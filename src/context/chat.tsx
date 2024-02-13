import { useState, createContext, useEffect } from "react"

import { TChannelPopulate } from "../utils/types/channel"
import TMessage from "../utils/types/message"
import userApi from "../api/restfull/user"
import TUser from "../utils/types/user"


export interface ChatContextProps {
  channels: Array<TChannelPopulate>;
  setChannels: (channels: Array<TChannelPopulate>) => void
  updateMessage: (message: TMessage) => void
  deleteMessage: (channel_id: string, message_id: string) => void
  newMessage: (message: TMessage) => void
  memberLeft: (channel_id: string, member_id: string) => void
  memberJoined: (channel_id: string, member: TUser) => void
  channelDeleted: (channel_id: string) => void
  channelJoined: (channel: TChannelPopulate) => void
}

export const ChatContext = createContext<ChatContextProps>({
  channels: [],
  setChannels: (channels) => {},
  updateMessage: (message) => {},
  deleteMessage: (channel_id, message_id) => {},
  newMessage: (message) => {},
  memberLeft: (channel_id, member_id) => {},
  memberJoined: (channel_id, member) => {},
  channelDeleted: (channel_id) => {},
  channelJoined: (channel) => {}
})

export default function ChatContextProvider({children}: {children: React.ReactNode}) {
  const token = JSON.parse(localStorage.getItem('token') || "{}")
  const [channels, setChannels] = useState<Array<TChannelPopulate>>([])

  const newMessage = (message: TMessage) => {
    const channelIndex = channels.findIndex(channel => channel.id === message.channel_id)
    if(channelIndex > -1) {
      const newChannels = [...channels]
      newChannels[channelIndex].messages.push({
        ...message,
        createAt: new Date(message.createAt)
      })
      setChannels(newChannels)
    }
  }

  const updateMessage = (message: TMessage) => {
    const channelIndex = channels.findIndex(channel => channel.id === message.channel_id)
    if(channelIndex === -1) return
    const messageIndex = channels[channelIndex].messages.findIndex(msg => msg.id === message.id)
    if(messageIndex === -1) return
    const newChannels = [...channels]
    newChannels[channelIndex].messages[messageIndex] = {
      ...message,
      createAt: new Date(message.createAt)
    }
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
    const channelIndex = channels.findIndex(channel => channel.id === channel_id)
    if(channelIndex === -1) return

    const newChannels = [...channels]
    newChannels[channelIndex].messages = newChannels[channelIndex].messages.filter(message => message.id !== message_id)
    setChannels(newChannels)
  }

  const memberLeft = (channel_id: string, member_id: string) => {
    const channelIndex = channels.findIndex(channel => channel.id === channel_id)
    if(channelIndex === -1) return

    const newChannels = [...channels]
    newChannels[channelIndex].members = newChannels[channelIndex].members.filter(member => member.id !== member_id)
    setChannels(newChannels)
  }

  const memberJoined = (channel_id: string, member: TUser) => {
    const channelIndex = channels.findIndex(channel => channel.id === channel_id)
    if(channelIndex === -1) return

    const newChannels = [...channels]
    newChannels[channelIndex].members.push(member)
    setChannels(newChannels)
  }

  const channelDeleted = (channel_id: string) => {
    const newChannels = channels.filter(channel => channel.id !== channel_id)
    setChannels(newChannels)
  }

  const channelJoined = (channel: TChannelPopulate) => {
    setChannels([...channels, channel])
  }

  return (
    <ChatContext.Provider value={{ channels, setChannels, updateMessage, deleteMessage, newMessage, memberLeft, memberJoined, channelDeleted, channelJoined }}>
      {children}
    </ChatContext.Provider>
  )
}