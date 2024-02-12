import TCacheValue from "./cache_value"

type TUser = {
  name: string
  avatar?: string
  email: string
  password: string
  socket_id?: string
} & TCacheValue

export default TUser
