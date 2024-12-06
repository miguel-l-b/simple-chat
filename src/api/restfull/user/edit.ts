import ApiConsts from "../../../constants/ApiConsts"
import TUser from "../../../utils/types/user"

export default async function EditUserApi(data: Partial<TUser>, token: string) {
  return await fetch(`${ApiConsts.BASE_URL}/user/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(data)
  })
    .then(async (res) => {
      if (!res.ok)
        throw new Error("Error updating user")

      await res.json() as TUser
    })
    .catch(err => {
      throw new Error(err)
    })
}