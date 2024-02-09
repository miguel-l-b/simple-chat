import { Link } from "react-router-dom"
import { BsChatSquareDots } from "react-icons/bs"
import { FiChevronDown, FiUser, FiSearch, FiSettings } from "react-icons/fi"

import ChatRoot, { ChatButton, ChatInput } from '../components/chat'

export default function Chat() {
  return (
    <main className="flex h-dvh flex-col lg:flex-row">
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
        <div className="flex flex-col justify-center overflow-x-auto">
          <Link
            className="flex items-center gap-2 py-3 px-2 transition-all duration-200 ease-in hover:bg-slate-400 hover:text-white rounded-xl w-fit lg:w-full"
            to={`/chat/${'123'}`}
          >
            <img
              className="h-10 w-10 rounded-full"
              src="https://i.imgur.com/gSUHQQx.jpeg"
              alt="avatar de ..."
            />
            <div className="hidden lg:flex flex-col">
              <h2 className="text-lg font-bold">Chat Name</h2>
              <p className="text-sm">Last message...</p>
            </div>
          </Link>
        </div>
      </main>
      <footer className="w-full lg:w-4/5 bg-slate-300 min-w-[40rem]">
        <header className="flex gap-2 items-center h-12 bg-white px-4 border-b-2 border-slate-400">
          {/* <img src="" alt="avatar de ..." /> */}
          <BsChatSquareDots
            className="bg-green-300 text-green-800 bg-opacity-50 p-2 rounded-lg w-9 h-9"
          />
          <h1 className="text-lg font-bold text-center">Chat Name</h1>
          <button className="m-none ml-auto p-1">
            <FiChevronDown className="w-6 h-6" />
          </button>
        </header>
        <ChatRoot
          className="h-5/6 py-8 px-10 overflow-y-auto"
          content={[
            {
              id: "1",
              type: "text",
              content: "Você tem algum compromisso amanhã? 🧐",
              author: { id: "456", name: "Bob", avatar: "https://i.imgur.com/rzIaXzK.jpeg" },
              date: new Date("2024-02-07T18:46:00"),
              read: false
            },        {
              id: "1",
              type: "text",
              content: "Também estou bem, obrigado por perguntar! ✌️",
              author: { id: "123", name: "Alice", avatar: "https://i.imgur.com/gSUHQQx.jpeg" },
              date: new Date("2024-02-07T15:46:00"),
              read: true
            },
            {
              id: "2",
              type: "text",
              content: "Eaí mana!",
              author: { id: "456", name: "Bob", avatar: "https://i.imgur.com/rzIaXzK.jpeg" },
              date: new Date("2024-02-07T15:44:34"),
              read: true
            },
            {
              id: "2",
              type: "text",
              content: "Estou bem, e você?",
              author: { id: "456", name: "Bob", avatar: "https://i.imgur.com/rzIaXzK.jpeg" },
              date: new Date("2024-02-07T15:45:00"),
              read: true
            },
            {
              id: "3",
              type: "text",
              content: "Olá, como você está?",
              author: { id: "123", name: "Alice", avatar: "https://i.imgur.com/gSUHQQx.jpeg" },
              date: new Date("2024-02-05T08:00:00"),
              read: true
            },
          ]}
          user_id='123'
        />
        <footer className="flex gap-12 items-center justify-center">
          <ChatInput  />
          <ChatButton />
        </footer>
      </footer>
    </main>
  )
}