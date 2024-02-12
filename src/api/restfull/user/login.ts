import TUser from "../../../utils/types/user"

export interface LoginAPIProps extends Omit<TUser, "id" | "name" | "avatar"> {}
export default async function loginUserAPI(data: LoginAPIProps) {
  return await fetch("http://localhost:3030/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(async(res) => {
      if(res.status !== 200)
        throw new Error(await res.text())
      return await res.json() as {
        token: { token: string, expiresIn: number }
        user: Omit<TUser, "password">
      }
    })
    .catch(err => {
      throw new Error(err)
    })
}