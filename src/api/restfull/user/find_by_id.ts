import ApiConsts from "../../../constants/ApiConsts"
import TUser from "../../../utils/types/user"

export type FindUserAPIProps = TUser["id"]
export default function FindUserByIdAPI(id: FindUserAPIProps) {
  return fetch(`${ApiConsts.BASE_URL}/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async (res) => {
      if (res.status !== 200)
        throw new Error(await res.text())
      return await res.json() as Omit<TUser, "password" | "email">
    })
    .catch(err => {
      throw new Error(err)
    })
}