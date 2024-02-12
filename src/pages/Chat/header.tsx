import { FiSearch, FiSettings, FiUser } from "react-icons/fi"
import { Link } from "react-router-dom"
import CardChannel from "../../components/chat/card_channel"
import TUser from "../../utils/types/user"
import { useContext } from "react"
import { ChatContext } from "../../context/chat"

export interface ChatHeaderProps {
  user: Omit<TUser, "email" | "password">
}
export default function ChatHeader({ user }: ChatHeaderProps) {
  const { channels } = useContext(ChatContext)

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
        <button>
          <FiUser className="text-slate-600 w-5 h-5" />
        </button>
        <button>
          <FiSettings className="text-slate-600 w-5 h-5" />
        </button>
      </nav>
      <div className="hidden lg:block relative my-1.5">
        <input 
          className="h-7 w-full pl-2 pr-7 rounded-md"
          placeholder="Search..."
          type="search"
          autoComplete="on"
        />
        <button className="flex h-7 w-7 items-center justify-center absolute right-0 top-0">
          <FiSearch className="text-slate-600 w-4 h-4" />
        </button>
      </div>
      <div className="flex lg:flex-col gap-2 justify-center overflow-x-auto lg:overflow-x-hidden">
        {
          channels.map((channel, key) => <CardChannel key={key} user={user} channel={channel} />)
        }
      </div>
    </main>
  )
}