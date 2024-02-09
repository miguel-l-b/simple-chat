import express from "express"
import { Server } from "socket.io"
import { createServer } from "node:http"
import Cache from "./utils/cache"
import TClient from "./types/client"
import TUser from "./types/user"
import TMessage from "./types/message"
import TChannel from "./types/channel"

const app = express()
const server = createServer(app)
const io = new Server(server)
const port = process.env.PORT || 3000

app.get("/create", (req, res) => {
  res.send("Hello World")
})

io.on("connection", (socket) => {
  socket.emit("connected", "You are connected")
  const clientID = socket.id

  socket.on("join_account", (data) => {
    if(!data || data.length === 0) return socket.emit("error", "Invalid data on join_account")

    const { email, password } = JSON.parse(data)
    console.log("login", email, password)

    for(const user of Cache.getAll<TUser>("user")) {
      if(user.email === email && user.password === password) {
        Cache.set<TClient>("client", {
          id: clientID,
          user_id: user.id,
          socket: socket
        })
      }
      return;
    }

    socket.emit("error", "Invalid credentials on join_account")
  })
  socket.on("create_channel", (data) => {
    if(!data || data.length === 0) return socket.emit("error", "Invalid data on create_channel")

    const channel = JSON.parse(data) as TChannel
    Cache.set<TChannel>("channel", channel)
    socket.emit("channel_created", channel)
  })
  socket.on("join_channel", (data) => {
    if(!data || data.length === 0) return socket.emit("error", "Invalid data on join_channel")

    const { channel_id } = JSON.parse(data)
    const client = Cache.get<TClient>("client", clientID)

    Cache.getAll<TChannel>("channel").forEach((channel) => {
      if(channel.id === channel_id) {
        Cache.set<TClient>("client", client)
      }
    })

    socket.emit("joined_channel", Cache.get<TChannel>("channel", channel_id))
  })
  socket.on("leave_channel", () => {
    const client = Cache.get<TClient>("client", clientID)
    Cache.set<TClient>("client", client)
  })
  socket.on("send-msg", (data) => {
    if(!data || data.length === 0) return socket.emit("error", "Invalid data on send-msg")

    const msg = JSON.parse(data) as TMessage
    Cache.getAll<TClient>("client").forEach((client) => {
      if(client.channelId_active) {
        client.socket.emit("new-msg", msg)
      }
    })
  })
  socket.on("disconnect", () => {
    Cache.delete("client", clientID)
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
