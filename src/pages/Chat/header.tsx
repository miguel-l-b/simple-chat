import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FiSearch, FiSettings, FiUser } from "react-icons/fi"
import { IoMdPersonAdd } from "react-icons/io"

import CardChannel from "../../components/chat/card_channel"
import TUser from "../../utils/types/user"
import { ChatContext } from "../../context/chat"
import { TChannelSearch } from "../../utils/types/channel"
import channelApi from "../../api/restfull/channel"

export interface ChatHeaderProps {
  user: Omit<TUser, "email" | "password">
}
export default function ChatHeader({ user }: ChatHeaderProps) {
  const { channels } = useContext(ChatContext)
  const [input, setInput] = useState("")

  const [search, setSearch] = useState<Array<TChannelSearch>>()

  useEffect(() => {
    setSearch(undefined)
  }, [input])

  return (
    <main
        className={`
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
          channelApi.search(input).then(setSearch)
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
      <div className="flex lg:flex-col gap-2 justify-center overflow-x-auto lg:overflow-x-hidden">
        {
          channels.map((channel, key) => <CardChannel key={key} user={user} channel={channel} />)
        }
      </div>
    </main>
  )
}