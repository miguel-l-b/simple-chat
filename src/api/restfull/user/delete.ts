import ApiConsts from "../../../constants/ApiConsts"

export default async function DeleteUserApi(token: string) {
  return await fetch(`${ApiConsts.BASE_URL}/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
    .then(async (res) => {
      if (!res.ok)
        throw new Error("Error deleting user")

      await res.json() as { message: string }
    })
    .catch(err => {
      throw new Error(err)
    })
}