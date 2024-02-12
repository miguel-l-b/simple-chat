import GetAllChannels from "./channels"
import createUserAPI from "./create"
import FindUserAPI from "./find"
import FindUserByIdAPI from "./find_by_id"
import loginUserAPI from "./login"
import VerifyLoginUserAPI from "./verify_login"

const userApi = {
  register: createUserAPI,
  login: loginUserAPI,
  verifyLogin: VerifyLoginUserAPI,
  findById: FindUserByIdAPI,
  search: FindUserAPI,

  getChannels: GetAllChannels,
}

export default userApi