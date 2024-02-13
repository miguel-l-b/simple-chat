import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FiSearch, FiUser, FiX } from "react-icons/fi"
import { MdGroupAdd } from "react-icons/md"
import { IoMdPersonAdd } from "react-icons/io"

import CardChannel from "../../components/chat/card_channel"
import TUser from "../../utils/types/user"
import { ChatContext } from "../../context/chat"
import { TChannelSearch } from "../../utils/types/channel"
import channelApi from "../../api/restfull/channel"
import Form from "../../components/form"
import Input from "../../components/form/input"
import Button from "../../components/form/button"
import { SocketConnection } from "../../api/socket/connection"

export interface ChatHeaderProps {
  user: Omit<TUser, "email" | "password">
}
export default function ChatHeader({ user }: ChatHeaderProps) {
  const { channels } = useContext(ChatContext)

  const [input, setInput] = useState("")
  const [search, setSearch] = useState<Array<TChannelSearch>>()
  const [newChannel, setNewChannel] = useState({
    name: "",
    image: "",
    isDirect: false,
    members: [user.id]
  })
  const [drawer, setDrawer] = useState(false)


  useEffect(() => {
    setSearch(undefined)
  }, [input])

  return (
    <main
        className={`
        flex flex-row lg:flex-col lg:justify-between
          w-full lg:w-1/5 min-h-16 min-w-52
          border-slate-400 border-b-2 lg:border-b-0 lg:border-r-2
          py-1.5 px-4
        `}
      >
      <nav className="hidden lg:flex justify-end items-center gap-5 py-1">
        <Link className="h-10 w-10 m-none mr-auto" to="/">
          <img src="logo.svg" alt="" />
        </Link>
        <Link to="/chat/profile">
          <FiUser className="text-slate-600 w-5 h-5" />
        </Link>
        {/* <button>
          <FiSettings className="text-slate-600 w-5 h-5" />
        </button> */}
      </nav>
      <div className="hidden lg:block relative my-1.5">
        <input 
          className="h-7 w-full pl-2 pr-7 rounded-md"
          placeholder="Search..."
          type="search"
          autoComplete="on"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => {
          channelApi.search(input).then((e) => {
            setSearch(
              e.filter((ch: any) => {
                if(!ch.isDirect) {
                  if(channels.find((c) => c.id === ch.id)) return false
                } else
                  if(channels.find((c) => c.members.find(m => m.id === ch.id))) return false
                return true
              })
            )
          })
          .catch(console.log)
        }} className="flex h-7 w-7 items-center justify-center absolute right-0 top-0">
          <FiSearch className="text-slate-600 w-4 h-4" />
        </button>
      </div>
      {
        search && (
          <div className="flex lg:flex-col gap-2 justify-center overflow-x-auto lg:overflow-x-hidden">
            {
              search.map((channel, key) => (
                <button 
                  onClick={() => {
                    if(channel.isDirect) {
                      channelApi.create({
                        isDirect: true,
                        members: [user.id, channel.id]
                      }).then()
                        .catch()
                    } else {
                      SocketConnection.getConnection().emit("join_channel", {
                        channel_id: channel.id
                      })
                    }

                    setSearch(undefined)
                  }}
                  key={channel.id}
                  className="flex items-center gap-2 py-3 px-2 transition-all duration-200 ease-in hover:bg-slate-400 hover:text-white rounded-xl w-fit lg:w-full"
                >
                  <img
                    className="h-10 w-10 rounded-full"
                    src={channel.image}
                    alt={`avatar de ${channel.name}`}
                  />
                  <div className="hidden lg:flex flex-col w-full">
                    <h2 className="text-lg font-bold text-start">
                      {channel.name}
                    </h2>
                    <div className="flex w-full">
                      {
                        channel.members.map((member, key) => (
                          <img
                            className={`h-6 w-6 ${key === 0? "" : "-ml-3"} rounded-full`}
                            src={member.avatar}
                            alt={`avatar de ${member.name}`}
                            key={key}
                          />
                        ))
                      }
                      <IoMdPersonAdd className="text-slate-800 text-xl m-none ml-auto mr-4" />
                    </div>
                  </div>
                </button>
              ))
            }
            {
              search.length === 0 && (
                <p className="text-center">
                  Nenhum resultado encontrado
                </p>
              )
            }
            <hr className="text-black" />
            <br />
          </div>
        )
      }
      <div className="flex lg:flex-col gap-2 justify-center overflow-y-hidden overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto">
        {
          channels.map((channel, key) => <CardChannel key={key} user={user} channel={channel} />)
        }
      </div>
      <button onClick={() => setDrawer(!drawer)} className="hidden mt-auto mx-auto lg:block p-2 bg-slate-300 text-slate-700 text-3xl rounded-lg">
        <MdGroupAdd />
      </button>
      {
        drawer && (
          <div className="absolute z-[999] flex flex-col items-center justify-center top-0 left-0 bg-slate-300 backdrop-blur-sm bg-opacity-50 w-full h-full py-48 px-56">
          <Form className="relative flex flex-col items-center w-2/4 gap-8 bg-white p-20 rounded-3xl">
            <button onClick={() => {
              setDrawer(false)
              setNewChannel({
                name: "",
                image: "",
                isDirect: false,
                members: [user.id]
              })
            }} className="absolute top-10 left-10 text-red-500 text-xl">
              <FiX />
            </button>
            <Input
              label="Nome do Grupo"
              type="text"
              value={newChannel?.name}
              onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
            />
            <div className="relative w-full">
              <Input
                label="Imagem do Grupo"
                type="text"
                value={newChannel.image}
                onChange={(e) => setNewChannel({ ...newChannel, image: e.target.value })}
              />
              {
                newChannel.image.length !== 0 && (
                  <img
                    onError={(e) => e.currentTarget.src = "/logo.svg"}
                    className="absolute h-8 w-8 rounded-lg right-0 bottom-0"
                    src={newChannel.image}
                    alt="avatar"
                  />
                )
              }
            </div>
            <Button 
              type="submit"
              onClick={() => {
                channelApi.create(newChannel).then((channel) => {
                  setDrawer(false)
                  setNewChannel({
                    name: "",
                    image: "",
                    isDirect: false,
                    members: [user.id]
                  })
                }).catch(console.log)
              }}
            >
              Criar
            </Button>
          </Form>
          </div>
        )
      }
    </main>
  )
}