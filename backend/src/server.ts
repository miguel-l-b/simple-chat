import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import { createServer } from "node:http"

import Cache from "./utils/cache"
import TUser from "./types/user"
import TChannel from "./types/channel"
import generateUUID from "./utils/generate_uuid"
import TMessage from "./types/message"
import HandleInitialData from "./utils/generate_initial_data"
import TLoginToken from "./types/login-token"
import validToken from "./utils/valid_token"
import parseMessage from "./utils/parse_read"

const app = express()
const server = createServer(app)
const io = new Server(server)
const port = process.env.PORT || 3030

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.get("/channels", (req, res) => {
  const { name } = req.query as { name: string }
  const channels = Cache.getAll<TChannel>("channel").filter(channel => channel.isDirect === false && channel.name.toLowerCase().includes(name.toLowerCase()))
  res.json(channels)
})

app.post("/channel/create", (req, res) => {
  const channel = req.body as TChannel

  channel.id = generateUUID()

  if(!channel.members || channel.members.length === 0)
    return res.status(400).json({ message: "Channel must have at least one member" })

  if(channel.isDirect && channel.members.length !== 2)
    return res.status(400).json({ message: "Direct channels must have exactly two members" })

  if(!channel.isDirect && (!channel?.["name"] || !channel?.["image"]))
    return res.status(400).json({ message: "Group channels must have a name and an image" })

  Cache.set<TChannel>("channel", channel)

  channel.members.forEach(member => {
    const user = Cache.get<TUser>("user", member)
    if(user.socket_id)
      io.to(user.socket_id).emit("new_channel", Cache.get<TChannel>("channel", channel.id))
  })

  res.json(channel)
})

app.get("/users", (req, res) => {
  const { username } = req.query as { username: string }
  if(username !== undefined && typeof username !== "string")
    return res.status(400).json({ message: "Invalid username" })

  const users = Cache.getAll<TUser>("user")
    .map(user => {
      delete user.password
      delete user.socket_id
      delete user.email

      if(username && !user.name.toLowerCase().includes(username.toLowerCase()))
        return

      return user
    })

  users.sort()

  res.json(users)
})

app.get("/user/channels", (req, res) => {
  const token = req.headers.authorization

  if(!validToken(token))
    return res.status(401).json({ message: "Invalid token" })
  const user = Cache.get<TLoginToken>("login_token", token)
  if(!user)
    return res.status(404).json({ message: "User not found" })

  const channels = Cache.getAll<TChannel>("channel").filter(channel => channel.members.includes(user.user_id))

  const getMessages = (channel: TChannel) => Cache.getAll<TMessage>("message").filter(message => message.channel_id === channel.id).map(message => parseMessage(message))

  res.json(channels.map(channel => {
    return {
      ...channel,
      messages: getMessages(channel),
      members: channel.members.map(member => {
        const user = Cache.get<TUser>("user", member)
        delete user.password
        delete user.email
        delete user.socket_id
        return user
      })
    }
  })
  )
})

app.get("/user/verify", (req, res) => {
  const token = req.headers.authorization

  if(!validToken(token))
    return res.status(401).json({ message: "Invalid token" })

  res.status(200).json({ message: "Valid token" })
})

app.get("/user/:id", (req, res) => {
  const { id } = req.params
  const user = Cache.get<TUser>("user", id)

  if(!user)
    return res.status(404).json({ message: "User not found" })

  delete user.email
  delete user.password
  delete user.socket_id
  res.json(user)
})


app.post("/user/login", (req, res) => {
  const { email, password } = req.body
  const user = Cache.getAll<TUser>("user").find(user => user.email === email && user.password === password)
  if(!user)
    return res.status(404).json({ message: "User not found" })

  const { id, expiresIn } = Cache.set<TLoginToken>("login_token", {
    id: generateUUID(),
    user_id: user.id,
    expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
  })

  delete user.password
  delete user.socket_id

  return res.json({
    token: { token: id, expiresIn },
    user,
  })
})

app.post("/user/create", (req, res) => {
  const { email, name, password, avatar } = req.body as Omit<TUser, "id" | "socket_id">
  const user = Cache.set<TUser>("user", {
    id: generateUUID(),
    email, name, password, avatar
  })

  HandleInitialData(user)

  delete user.password

  res.json(user)
})

io.on("connection", (socket) => {
  socket.join(socket.id)
  socket.emit("connected", "Connected to the server")

  const login_token = Cache.getAll<TLoginToken>("login_token").find(user => user.id === socket.handshake.auth.token)
  const user = Cache.update<TUser>("user", login_token?.user_id, { socket_id: socket.id })
  if(!user) {
    socket.emit("error", "Invalid token")
    return socket.disconnect()
  }
  console.log(`New Connection: ${user.name}#${user.socket_id}`)

  socket.on("join_channel", (data) => {
    if(!data || data.length === 0)
      return socket.emit("error", "Invalid data on join_channel")

    const { channel_id } = JSON.parse(data)
    const oldChannel = Cache.get<TChannel>("channel", channel_id)

    Cache.update<TChannel>("channel", channel_id, {
      members: [...oldChannel.members, user.id]
    })

    socket.emit("channel_joined", {
      ...oldChannel,
      members: [...oldChannel.members, user.id]
    })

    Cache.get<TChannel>("channel", channel_id).members.forEach(member => {
      const user = Cache.get<TUser>("user", member)
      if(user.socket_id)
        io.to(user.socket_id).emit("member_joined", {
          id: channel_id,
          member: user.id
        })
    })
  })
  socket.on("leave_channel", (data) => {
    if(!data || data.length === 0)
      return socket.emit("error", "Invalid data on leave_channel")

    const { channel_id } = JSON.parse(data)
    const oldChannel = Cache.get<TChannel>("channel", channel_id)

    Cache.update<TChannel>("channel", channel_id, {
      members: oldChannel.members.filter(member => member !== user.id)
    })

    socket.emit("channel_left", {
      ...oldChannel,
      members: oldChannel.members.filter(member => member !== user.id)
    })
    socket.leave(channel_id)
    io.to(channel_id).emit("member_left", {
      id: channel_id,
      member: user.id
    })
  })
  socket.on("read_message", (data) => {
    if(!data || data.length === 0)
      return socket.emit("error", "Invalid data on read_message")

    const { message_id } = JSON.parse(data)
    let message = Cache.get<TMessage>("message", message_id)

    if(!message)
      return socket.emit("error", "Message not found")

    message = Cache.update<TMessage>("message", message_id, {
      read: [...message.read, user.id]
    })

    socket.emit("update_message", parseMessage(message))
  })
  socket.on("send_message", (data) => {
    if(!data || data.length === 0)
      return socket.emit("error", "Invalid data on send_message")

    console.log("New message:", data)

    const message = Cache.set<TMessage>("message", {
      id: generateUUID(),
      author: user.id,
      createAt: new Date(),
      read: [user.id],
      ...data as Omit<TMessage, "author" | "createAt" | "read">
    })

    io.to(message.channel_id).emit("new_message", parseMessage(message))
  })
  socket.on("disconnect", () => {
    Cache.update<TUser>("user", user.id, { socket_id: null })
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
