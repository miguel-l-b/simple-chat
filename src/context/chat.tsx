import { useState, createContext, useEffect } from "react"
import { TChannelPopulate } from "../utils/types/channel"
import TMessage from "../utils/types/message";
import userApi from "../api/restfull/user";
import { SocketConnection } from "../api/socket/connection";
import { redirect } from "react-router-dom";


export interface ChatContextProps {
  channels: Array<TChannelPopulate>;
  setChannels: (channels: Array<TChannelPopulate>) => void
  updateMessage: (channel_id: string, message_id: string, content: string) => void
  deleteMessage: (channel_id: string, message_id: string) => void
  newMessage: (channel_id: string, message: TMessage) => void
}

export const ChatContext = createContext<ChatContextProps>({
  channels: [],
  setChannels: (channels) => {},
  updateMessage: (channel_id, message_id, content) => {},
  deleteMessage: (channel_id, message_id) => {},
  newMessage: (channel_id, message) => {}
})

export default function ChatContextProvider({children}: {children: React.ReactNode}) {
  const token = JSON.parse(localStorage.getItem('token') || "{}")
  const [channels, setChannels] = useState<Array<TChannelPopulate>>([])

  const newMessage = (channel_id: string, message: TMessage) => {
    const newChannels = channels.map(channel => {
      if(channel.id === channel_id) {
        channel.messages.push(message)
      }
      return channel
    }
    )
    setChannels(newChannels)
  }

  const updateMessage = (channel_id: string, message_id: string, content: string) => {
    const newChannels = channels.map(channel => {
      if(channel.id === channel_id) {
        channel.messages = channel.messages.map(message => {
          if(message.id === message_id) {
            message.content = content
          }
          return message
        })
      }
      return channel
    })
    setChannels(newChannels)
  }

  useEffect(() => {
    userApi.getChannels(token.token).then(channels => {
      channels.forEach(channel => {
        channel.messages.forEach(message => {
          message.createAt = new Date(message.createAt)
        })
      })

      setChannels(channels)
    }).catch(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = "/login"
    })
  }, [])

  const deleteMessage = (channel_id: string, message_id: string) => {
    const newChannels = channels.map(channel => {
      if(channel.id === channel_id) {
        channel.messages = channel.messages.filter(message => message.id !== message_id)
      }
      return channel
    })
    setChannels(newChannels)
  }

  return (
    <ChatContext.Provider value={{channels, setChannels, updateMessage, deleteMessage, newMessage}}>
      {children}
    </ChatContext.Provider>
  )
}