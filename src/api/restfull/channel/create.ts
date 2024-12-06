import ApiConsts from "../../../constants/ApiConsts"

export default async function CreateChannelAPI(channel: any) {
  return await fetch(`${ApiConsts.BASE_URL}/channel/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(channel)
  })
    .then(async (res) => {
      if (res.status !== 201) {
        throw new Error("Error to create channel")
      }
      return await res.json()
    })
    .then((data) => data)
    .catch(console.error)
}