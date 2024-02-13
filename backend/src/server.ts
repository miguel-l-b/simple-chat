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
const port = 3030

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.get("/channels", (req, res) => {
  const { name } = req.query as { name: string }
  const channels = Cache.getAll<TChannel>("channel")
    .filter(channel => channel.isDirect === false && channel.name.toLowerCase().includes(name.toLowerCase()))
    .map(ch => ({
      isDirect: false,
      ...ch,
      members: ch.members.map(member => {
        const user = Cache.get<TUser>("user", member)
        delete user.password
        delete user.email
        delete user.socket_id
        return user
      })
    }))

  const members = Cache.getAll<TUser>("user")
    .filter(user => user.name.toLowerCase().includes(name.toLowerCase()))
    .map(u => ({
      isDirect: true,
      id: u.id,
      name: u.name,
      image: u.avatar,
      members: []
    }))
  res.json([...channels, ...members])
})

app.post("/channel/create", (req, res) => {
  const data = req.body as TChannel

  data.id = generateUUID()

  if(!data.members || data.members.length === 0)
    return res.status(400).json({ message: "Channel must have at least one member" })

  if(data.isDirect && data.members.length !== 2)
    return res.status(400).json({ message: "Direct channels must have exactly two members" })

  if(!data.isDirect && (!data?.["name"] || !data?.["image"]))
    return res.status(400).json({ message: "Group channels must have a name and an image" })

  const channel = Cache.set<TChannel>("channel", data)

  channel.members.forEach(member => {
    const user = Cache.get<TUser>("user", member)
    if(user.socket_id)
      io.to(user.socket_id).emit("channel_joined", {
        ...channel,
        members: channel.members.map(member => {
          const user = Cache.get<TUser>("user", member)
          delete user.password
          delete user.email
          delete user.socket_id
          return user
        }),
        messages: []
      })
  })

  res.json(channel)
})

app.delete("/channel/delete/:id", (req, res) => {
  const token = req.headers.authorization

  if(!validToken(token))
  return res.status(401).json({ message: "Invalid token" })
  const login_token = Cache.get<TLoginToken>("login_token", token)

  const { id } = req.params
  const channel = Cache.get<TChannel>("channel", id)

  if(!channel)
    return res.status(404).json({ message: "Channel not found" })

  if(!channel.members.includes(login_token.user_id))
    return res.status(403).json({ message: "You are not a member of this channel" })

  Cache.delete("channel", id)

  channel.members.forEach(member => {
    const user = Cache.get<TUser>("user", member)
    if(user.socket_id)
      io.to(user.socket_id).emit("channel_deleted", { id })
  })

  res.json({ message: "Channel deleted" })
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

app.put("/user/update", (req, res) => {
  const token = req.headers.authorization

  if(!validToken(token))
  return res.status(401).json({ message: "Invalid token" })
  const login_token = Cache.get<TLoginToken>("login_token", token)

  const updatedUser = req.body as Partial<TUser>
  const user = Cache.update<TUser>("user", login_token.user_id, updatedUser)

  delete user.password
  delete user.socket_id

  res.json(user)
})

app.put("/user/update/password", (req, res) => {
  const token = req.headers.authorization

  if(!validToken(token))
  return res.status(401).json({ message: "Invalid token" })
  const login_token = Cache.get<TLoginToken>("login_token", token)

  const { password } = req.body as TUser
  const user = Cache.update<TUser>("user", login_token.user_id, { password })

  res.json({ message: "Password updated" })
})

app.delete("/user/delete", (req, res) => {
  const token = req.headers.authorization

  if(!validToken(token))
  return res.status(401).json({ message: "Invalid token" })
  const login_token = Cache.get<TLoginToken>("login_token", token)

  Cache.delete("user", login_token.user_id)

  res.json({ message: "User deleted" })
})

app.delete("/channel/delete/:id", (req, res) => {
  const token = req.headers.authorization

  if(!validToken(token))
  return res.status(401).json({ message: "Invalid token" })
  const login_token = Cache.get<TLoginToken>("login_token", token)

  const { id } = req.params
  const channel = Cache.get<TChannel>("channel", id)

  if(!channel)
    return res.status(404).json({ message: "Channel not found" })

  if(!channel.members.includes(login_token.user_id))
    return res.status(403).json({ message: "You are not a member of this channel" })

  Cache.delete("channel", id)

  res.json({ message: "Channel deleted" })
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
        if(user) {
          delete user.password
          delete user.email
          delete user.socket_id
        } else {
          return {
            id: "0",
            name: "Usuário Desconhecido",
            avatar: "https://i.imgur.com/bsNR2uu.jpeg"
          }
        }

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

    const { channel_id } = data
    const oldChannel = Cache.get<TChannel>("channel", channel_id)

    Cache.update<TChannel>("channel", channel_id, {
      members: [...oldChannel.members, user.id]
    })

    socket.emit("channel_joined", {
      ...oldChannel,
      members: [...oldChannel.members, user.id],
      messages: Cache.getAll<TMessage>("message").filter(message => message.channel_id === channel_id).map(message => parseMessage(message))
    })

    Cache.get<TChannel>("channel", channel_id).members.forEach(member => {
      const user = Cache.get<TUser>("user", member)

      if(user.socket_id) {
        io.to(user.socket_id).emit("member_joined", {
          id: channel_id,
          member: {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          }
        })
      }
    })
  })
  socket.on("leave_channel", (data) => {
    if(!data || data.length === 0)
      return socket.emit("error", "Invalid data on leave_channel")

    const { channel_id } = data
    const oldChannel = Cache.get<TChannel>("channel", channel_id)

    if(oldChannel.isDirect || oldChannel.members.length === 1) {
      Cache.delete("channel", channel_id)
      oldChannel.members.forEach(member => {
        const user = Cache.get<TUser>("user", member)
        if(user.socket_id)
          io.to(user.socket_id).emit("channel_deleted", { id: channel_id })
      })
      return
    }

    Cache.update<TChannel>("channel", channel_id, {
      members: oldChannel.members.filter(member => member !== user.id)
    })

    socket.emit("channel_deleted", { id: channel_id })

    oldChannel.members.forEach(member => {
      const user = Cache.get<TUser>("user", member)
      if(user.socket_id)
        io.to(user.socket_id).emit("member_left", {
          id: channel_id,
          member: user.id
        })
    })
  })
  socket.on("read_message", (data) => {
    if(!data || data.length === 0)
      return socket.emit("error", "Invalid data on read_message")

    const { message_id } = data
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

    const channel = Cache.get<TChannel>("channel", message.channel_id)
    channel.members.forEach(member => {
      const user = Cache.get<TUser>("user", member)
      console.log(`Sending message to: ${user.name}#${user.socket_id}`)
      if(user.socket_id)
        io.to(user.socket_id).emit("new_message", parseMessage(message))
    })
  })
  socket.on("disconnect", () => {
    Cache.update<TUser>("user", user.id, { socket_id: null })
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
