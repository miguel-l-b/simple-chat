import TMessage from "./message"
import TUser from "./user"

export type TDirect = {
  isDirect: true
}

export type TGroup = {
  name: string
  isDirect: false
  image: string
}

type TChannel = {
  id: string
  members: TUser["id"][]
} & (TDirect | TGroup)

export type TChannelSearch = {
  isDirect: boolean
  id: string
  name: string
  image: string
  members: Array<Omit<TUser, "email" | "password">>
}

export type TChannelPopulate = {
  id: string
  members: Array<Omit<TUser, "email" | "password">>
  messages: Array<TMessage>
} & (TDirect | TGroup)

export default TChannel
