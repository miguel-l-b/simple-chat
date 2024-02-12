import TCacheValue from "./cache_value"
import TUser from "./user"

export type TDirect = {
  isDirect: true
}

export interface TGroup {
  isDirect: false
  name: string
  image: string
}

type TChannel = {
  members: TUser["id"][]
} & (TDirect | TGroup) & TCacheValue

export default TChannel
