import ApiConsts from "../../../constants/ApiConsts"
import TUser from "../../../utils/types/user"

export interface CreateUserAPIProps extends Omit<TUser, "id"> { }
export default async function createUserAPI(data: CreateUserAPIProps) {
  return await fetch(`${ApiConsts.BASE_URL}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(async (res) => {
      if (res.status !== 200)
        throw new Error(await res.text())
      return await res.json() as Omit<TUser, "password">
    })
    .catch(err => {
      throw new Error(err)
    })
}