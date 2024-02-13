import { createRef, useContext, useEffect, useState } from "react"
import { FiChevronDown } from "react-icons/fi"
import { BsChatSquareDots } from "react-icons/bs"

import TUser from "../../utils/types/user"
import { SocketConnection } from "../../api/socket/connection"
import Chat, { ChatButton, ChatInput } from "../../components/chat"
import { ChatContext } from "../../context/chat"
import { TChannelPopulate } from "../../utils/types/channel"
import { useNavigate, useParams } from "react-router-dom"

export interface ChatBoxProps {
  user: Omit<TUser, "email" | "password">
}

export default function ChatBox({user}: ChatBoxProps) {
  const redirect = useNavigate()
  const token = JSON.parse(localStorage.getItem('token') || "{}")
  const { id: pageID } = useParams<{ id: string }>()

  const [input, setInput] = useState("")
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const [currentChannel, setCurrentChannel] = useState<TChannelPopulate>()
  const { channels, newMessage, updateMessage, memberLeft, memberJoined, channelDeleted, channelJoined } = useContext(ChatContext)

  const ChatRef = createRef<HTMLDivElement>()

  useEffect(() => {
    const channel = channels.find(channel => channel.id === pageID)
    if(channel) {
      setCurrentChannel(channel)
      ChatRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [ChatRef, channels, pageID])

  useEffect(() => { 
    SocketConnection.connect(token.token)
      .on("error", console.error)
      .on("new_message", (msg) => {
        newMessage(msg)
      })
      .on("update_message", (msg) => {
        updateMessage(msg)
      })
      .on("member_left", ({ id, member }) => {
        memberLeft(id, member)
      })
      .on("member_joined", ({ id, member }) => {
        memberJoined(id, member)
      })
      .on("channel_deleted", ({ id }) => {
        channelDeleted(id)
        if(pageID === id) {
          redirect("/chat")
          setCurrentChannel(undefined)
        }
      })
      .on("channel_joined", (channel) => {
        channelJoined(channel)
      })
  }, [channelDeleted, channelJoined, memberJoined, memberLeft, newMessage, pageID, redirect, token.token, updateMessage])
  
  function getName(channel: TChannelPopulate) {
    return channel.isDirect === true? channel.members.find(member => member.id !== user.id)!.name : channel.name
  }

  function getIcon(channel: TChannelPopulate) {
    return channel.isDirect === true? channel.members.find(member => member.id !== user.id)!.avatar : channel.image
  }

  function sendMessage() {
    SocketConnection.getConnection().emit("send_message", {
      type: "text",
      content: input,
      channel_id: currentChannel!.id,
    })
    setInput("")
  }
  
  return (
    <footer className="w-full lg:w-4/5 h-[93%] lg:h-full bg-slate-300 min-w-[40rem]">
      {
        currentChannel? (
          <>
          <header className="flex gap-2 items-center h-12 bg-white px-4 border-b-2 border-slate-400">
              <img
                className="w-10 h-10 rounded-2xl"
                src={getIcon(currentChannel)}
                alt={`imagem de ${getName(currentChannel)}`}
              />
              <h1 className="text-lg font-bold text-center">
                {getName(currentChannel)}
              </h1>
            <div className="relative m-none ml-auto">
              <button
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                className="p-1"
              >
                <FiChevronDown className="w-6 h-6" />
              </button>
              <div
                className={`absolute z-20 top-10 right-0 bg-white w-40 rounded-lg shadow-lg ${isOpenDropdown? "block" : "hidden"}`}
              >
                <ul>
                  <li>
                    <button
                      onClick={() => {
                        SocketConnection.getConnection().emit("leave_channel", {
                          channel_id: currentChannel.id
                        })
                        redirect("/chat")
                        setCurrentChannel(undefined)
                        window.location.reload()
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
          {
            currentChannel && (
              <Chat
                key={currentChannel.id}
                className="h-5/6 py-8 px-10 overflow-y-auto"
                content={currentChannel.messages}
                user_id={user.id}
              >
                <div ref={ChatRef} />
              </Chat>
            )
          }
          <footer className="flex gap-12 items-center justify-center">
            <ChatInput 
              onChange={e => setInput(e.target.value)}
              value={input}
            />
            <ChatButton onClick={sendMessage} />
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