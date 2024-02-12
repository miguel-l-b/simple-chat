import TUser from "./user"

type TMessage = {
  id: string
  type: "text"
  content: string
  author: Omit<TUser, "email" | "password">
  channel_id: string
  createAt: Date
  read: boolean
}

export default TMessage
