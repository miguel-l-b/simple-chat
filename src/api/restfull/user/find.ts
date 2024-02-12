import TUser from "../../../utils/types/user"

export type FindUserAPIProps = TUser["name"]
export default function FindUserAPI(username: FindUserAPIProps) {
  return fetch(`http://localhost:3030/users${username? `?username=${username}` : ""}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then(async(res) => {
      if(res.status !== 200)
        throw new Error(await res.text())
      return await res.json() as Omit<TUser, "password" | "email">
    })
    .catch(err => {
      throw new Error(err)
    })
}