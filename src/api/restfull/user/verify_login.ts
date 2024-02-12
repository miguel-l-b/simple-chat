export default function VerifyLoginUserAPI(token: string) {
  return fetch("http://localhost:3030/user/verify", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
    .then(async(res) => {
      if(res.status !== 200)
        throw new Error(await res.text())
      return await res.json()
    })
    .catch(err => {
      throw new Error(err)
    })
}