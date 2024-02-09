import TCacheValue from "./cache_value"
import TUser from "./user"

export type TDirect = {
  isDirect: true
}

export type TGroup = {
  isDirect: false
  image: string
}

type TChannel = {
  name: string
  members: TUser["id"][]
} & (TDirect | TGroup) & TCacheValue

export default TChannel
