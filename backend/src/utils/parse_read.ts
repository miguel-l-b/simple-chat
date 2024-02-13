import TMessage from "@/types/message"
import Cache from "./cache"
import TChannel from "@/types/channel"
import TUser from "@/types/user"

export default function parseMessage(message: TMessage): Omit<TMessage, "read" | "author"> & { author: Omit<TUser, "email" | "password" | "socket_id">, read: boolean } {
  const channel = Cache.get<TChannel>("channel", message.channel_id)
  let author = Cache.get<TUser>("user", message.author)

  if(author) {
    delete author.email
    delete author.password
    delete author.socket_id
  } else {
    author = {
      id: "0",
      name: "Usuário Desconhecido",
      email: "",
      password: "",
      avatar: "https://i.imgur.com/bsNR2uu.jpeg"
    }
  }

  return {
    ...message,
    author,
    read: channel.members.every(member => message.read.includes(member))
  }
}
