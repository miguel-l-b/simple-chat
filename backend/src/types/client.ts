import { Socket } from "socket.io"
import TUser from "./user"
import TCacheValue from "./cache_value"

type TClient = {
  user_id: TUser["id"],
  socket: Socket
} & TCacheValue


export default TClient
