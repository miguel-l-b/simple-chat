import { useContext, useEffect, useState } from "react"
import { FiChevronDown } from "react-icons/fi"
import { BsChatSquareDots } from "react-icons/bs"

import TUser from "../../utils/types/user"
import { SocketConnection } from "../../api/socket/connection"
import Chat, { ChatButton, ChatInput } from "../../components/chat"
import ChatContextProvider, { ChatContext } from "../../context/chat"
import { TChannelPopulate } from "../../utils/types/channel"
import { useNavigate, useParams } from "react-router-dom"

export interface ChatBoxProps {
  user: Omit<TUser, "email" | "password">
}

export default function ChatBox({user}: ChatBoxProps) {
  const redirect = useNavigate()
  const { id: pageID } = useParams<{ id: string }>()

  const [input, setInput] = useState("")
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const [currentChannel, setCurrentChannel] = useState<number>(-1)
  const { channels } = useContext(ChatContext)

  useEffect(() => {
    const index = channels.findIndex(channel => channel.id === pageID)
    if(index > -1)
      setCurrentChannel(index)
  }, [channels, pageID])
  
  function getName(channel: TChannelPopulate) {
    return channel.isDirect === true? channel.members.find(member => member.id !== user.id)!.name : channel.name
  }

  function getIcon(channel: TChannelPopulate) {
    return channel.isDirect === true? channel.members.find(member => member.id !== user.id)!.avatar : channel.image
  }
  
  return (
    <footer className="w-full lg:w-4/5 h-full bg-slate-300 min-w-[40rem]">
      {
        currentChannel > -1? (
          <>
          <header className="flex gap-2 items-center h-12 bg-white px-4 border-b-2 border-slate-400">
              <img
                className="w-10 h-10 rounded-2xl"
                src={getIcon(channels[currentChannel])}
                alt={`imagem de ${getName(channels[currentChannel])}`}
              />
              <h1 className="text-lg font-bold text-center">
                {getName(channels[currentChannel])}
              </h1>
            <div className="relative m-none ml-auto">
              <button
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                className="p-1"
              >
                <FiChevronDown className="w-6 h-6" />
              </button>
              <div
                className={`absolute top-10 right-0 bg-white w-40 rounded-lg shadow-lg ${isOpenDropdown? "block" : "hidden"}`}
              >
                <ul>
                  <li>
                    <button
                      onClick={() => {

                      }}
                      className="w-full p-2 hover:bg-slate-200"
                    >
                      Sair
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </header>
          <ChatContextProvider>
            <Chat
              className="h-5/6 py-8 px-10 overflow-y-auto"
              content={channels[currentChannel].messages}
              user_id={user.id}
            />
          </ChatContextProvider>
          <footer className="flex gap-12 items-center justify-center">
            <ChatInput onChange={e => setInput(e.target.value)} value={input} />
            <ChatButton onClick={() => {
              SocketConnection.getConnection().emit("send_message", {
                type: "text",
                content: input,
                channel_id: channels[currentChannel].id,
              })
              setInput("")
            }} />
          </footer>
          </>
        ) : (
          <div className="flex items-center justify-center text-9xl font-bold text-slate-500 h-full">
            <BsChatSquareDots />
          </div>
        )
      }
    </footer>
  )
}