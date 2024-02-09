import TCacheValue from "./cache_value"

type TUser = {
  name: string;
  avatar?: string;
  email: string;
  password: string;
} & TCacheValue

export default TUser
