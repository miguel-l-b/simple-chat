import GetAllChannels from "./channels"
import createUserAPI from "./create"
import DeleteUserApi from "./delete"
import EditUserApi from "./edit"
import FindUserAPI from "./find"
import FindUserByIdAPI from "./find_by_id"
import loginUserAPI from "./login"
import VerifyLoginUserAPI from "./verify_login"

const userApi = {
  register: createUserAPI,
  update: EditUserApi,
  delete: DeleteUserApi,

  login: loginUserAPI,
  verifyLogin: VerifyLoginUserAPI,

  findById: FindUserByIdAPI,
  search: FindUserAPI,

  getChannels: GetAllChannels,
}

export default userApi