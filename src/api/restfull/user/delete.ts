export default async function DeleteUserApi(token: string) {
  return await fetch(`http://localhost:3030/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
    .then(async (res) => {
      if(!res.ok)
        throw new Error("Error deleting user")

      await res.json() as { message: string }
    })
    .catch(err => {
      throw new Error(err)
    })
}