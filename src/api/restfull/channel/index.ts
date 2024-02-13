import CreateChannelAPI from "./create"
import SearchChannelAPI from "./search"

const channelApi = {
  search: SearchChannelAPI,
  create: CreateChannelAPI
}

export default channelApi