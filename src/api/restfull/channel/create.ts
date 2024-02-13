export default async function CreateChannelAPI(channel: any) {
  return await fetch("http://localhost:3030/channel/create", {
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