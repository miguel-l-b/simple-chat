import { Link } from "react-router-dom"
import { TChannelPopulate } from "../../utils/types/channel"
import TUser from "../../utils/types/user"

export interface CardChannelProps {
  user: Omit<TUser, "email" | "password">
  channel: TChannelPopulate
}

export default function CardChannel({
  user,
  channel
}: CardChannelProps) {
  function getLastMessage() {
    if (channel.messages.length === 0) return "Nenhuma mensagem"
    const msg = channel.messages[channel.messages.length - 1].content
    return msg.length > 30? msg.slice(0, 30) + "..." : msg
  }
  return (
    <Link
    key={channel.id}
    className="flex items-center gap-2 py-3 px-2 transition-all duration-200 ease-in hover:bg-slate-400 hover:text-white rounded-xl w-fit lg:w-full"
    to={`/chat/${channel.id}`}
  >
    <img
      className="h-10 w-10 rounded-full"
      src={channel.isDirect? channel.members.find(member => member.id !== user.id)?.avatar : channel.image}
      alt={`avatar de ${channel.isDirect? channel.members.find(member => member.id !== user.id)?.name : channel.name}`}
    />
    <div className="hidden lg:flex flex-col">
      <h2 className="text-lg font-bold">
        {channel.isDirect? channel.members.find(member => member.id !== user.id)?.name : channel.name}
      </h2>
      <p>{getLastMessage()}</p>
    </div>
  </Link>
  )
}