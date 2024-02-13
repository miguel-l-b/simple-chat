import TUser from "../../../utils/types/user"

export default async function EditUserApi(data: Partial<TUser>, token: string) {
  return await fetch(`http://localhost:3030/user/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(data)
  })
    .then(async (res) => {
      if(!res.ok)
        throw new Error("Error updating user")

      await res.json() as TUser
    })
    .catch(err => {
      throw new Error(err)
    })
}