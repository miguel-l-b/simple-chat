import TCacheValue from "./cache_value"
import TUser from "./user"

type TMessage = {
  type: "text"
  content: string
  author: string
  channel_id: string
  createAt: Date
  read: TUser["id"][]
} & TCacheValue

export default TMessage
