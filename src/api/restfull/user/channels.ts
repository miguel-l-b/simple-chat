import ApiConsts from "../../../constants/ApiConsts"
import { TChannelPopulate } from "../../../utils/types/channel"

export default async function GetAllChannels(token: string): Promise<Array<TChannelPopulate>> {
  return await fetch(`${ApiConsts.BASE_URL}/user/channels`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  }).then(async (res) => {
    if (res.status !== 200)
      throw new Error("Erro ao buscar canais")
    return await res.json()
  }).catch((err) => {
    throw new Error(err)
  })
}