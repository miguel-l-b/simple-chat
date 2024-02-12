import TUser from "./user"

type TLoginToken = {
  id: string
  user_id: TUser["id"]
  expiresIn: Date
}

export default TLoginToken
