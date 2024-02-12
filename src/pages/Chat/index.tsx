import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import TUser from "../../utils/types/user"
import userApi from "../../api/restfull/user"
import { SocketConnection } from "../../api/socket/connection"
import ChatHeader from "./header"
import ChatBox from "./chat"
import ChatContextProvider from "../../context/chat"

export default function Chat() {
  const redirect = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || "{}") as Omit<TUser, "email" | "password">
  const token = JSON.parse(localStorage.getItem('token') || "{}")

  useEffect(() => {
    if(!token) redirect('/login')
    if(!user) redirect('/login')

    userApi.verifyLogin(token.token).catch(() => {
      SocketConnection.getConnection().disconnect()
      redirect('/login')
    })
  }, [redirect, token, user])
  
  return (
    <main className="flex h-dvh flex-col lg:flex-row">
      <ChatContextProvider>
        <ChatHeader user={user} />
        <ChatBox user={user} />
      </ChatContextProvider>
    </main>
  )
}