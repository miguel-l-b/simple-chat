import { useRef } from "react"
import { Link } from "react-router-dom"
import Header, { HeaderButton } from "../components/header"
import Chat, { ChatButton, ChatInput } from "../components/chat"

export default function Home() {
  const refAbout = useRef<HTMLDivElement>(null)
  return (
    <>
    <Header className="p-5 bg-white">
      <img className="w-12" src="logo.svg" alt="logo do site" />
      <nav className="flex gap-8 items-center justify-between w-full h-fit">
        <HeaderButton to={refAbout}>Sobre</HeaderButton>
        <div className="flex gap-2 px-8">
          <HeaderButton to="/login" className="hover:underline">Login</HeaderButton>
          /
          <HeaderButton to="/register" className="hover:underline">Registrar</HeaderButton>
        </div>
      </nav>
    </Header>
    <main className="mt-12 text-center">
      <h1>Olá, 🖖</h1>
      <br />
      <h2>Seja bem vindo ao SimpleChat</h2>
      <br />
      <p>Um chat simples e fácil de usar</p>
      <p>
        Para começar, faça o 
        <Link to="/login"><span id="animated"> login </span></Link>
        ou
        <Link to="/register"><span id="animated"> crie uma conta</span></Link>
      </p>
      <br />
      <br />
      <br />
      <section className="hidden md:block" id="exemple">
      <h1 className="text-xl">Um exemplo do nosso sitema: </h1>
      <br />
      <Chat user_id="456" className="w-2/3 m-auto bg-slate-300 p-8 rounded-t-xl" content={[
        {
          id: "1",
          channel_id: "1",
          type: "text",
          content: "Você tem algum compromisso amanhã? 🧐",
          author: { id: "456", name: "Bob", avatar: "https://i.imgur.com/rzIaXzK.jpeg" },
          createAt: new Date("2024-02-12T18:46:00"),
          read: false
        },
        {
          id: "1",
          channel_id: "1",
          type: "text",
          content: "Também estou bem, obrigado por perguntar! ✌️",
          author: { id: "123", name: "Alice", avatar: "https://i.imgur.com/gSUHQQx.jpeg" },
          createAt: new Date("2024-02-12T15:46:00"),
          read: true
        },
        {
          id: "2",
          channel_id: "1",
          type: "text",
          content: "Eaí mana!",
          author: { id: "456", name: "Bob", avatar: "https://i.imgur.com/rzIaXzK.jpeg" },
          createAt: new Date("2024-02-12T15:44:34"),
          read: true
        },
        {
          id: "2",
          channel_id: "1",
          type: "text",
          content: "Estou bem, e você?",
          author: { id: "456", name: "Bob", avatar: "https://i.imgur.com/rzIaXzK.jpeg" },
          createAt: new Date("2024-02-11T15:45:00"),
          read: true
        },
        {
          id: "3",
          channel_id: "1",
          type: "text",
          content: "Olá, como você está?",
          author: { id: "123", name: "Alice", avatar: "https://i.imgur.com/gSUHQQx.jpeg" },
          createAt: new Date("2024-02-11T08:00:00"),
          read: true
        },
      ]} />
      <div 
        className={`
          flex gap-8 justify-center items-center w-2/3 px-8 pb-5 
          bg-slate-300 m-auto rounded-b-xl
        `}
      >
        <ChatInput readOnly message="topa ir na lanchonete amanhã?" />
        <ChatButton />
      </div>
    </section>
    </main>
    <section ref={refAbout} className="flex flex-wrap gap-y-8 gap-x-10 items-center justify-center text-center mt-56 py-15 p-20 w-full min-h-dvh bg-slate-300" id="about">
      <h1 className="mb-20 basis-full">Principais Recursos</h1>
      <div className="flex items-center rounded-3xl bg-green-200 w-[35rem] p-5">
        <img className="w-40 rounded-3xl" src="https://i.imgur.com/LAMtcFH.jpeg" alt="exemplo" />
        <div className="flex flex-col gap-2 w-full">
          <p>Envie mensagens em tempo real</p>
          <p>Conecte-se com seus amigos via DM</p>
          <p>Crie grupos temáticos</p>
        </div>
      </div>
      <div  className="flex items-center rounded-3xl bg-purple-200 w-[30rem] p-5">
        <img className="bg-purple-400 w-40 rounded-3xl" src="https://i.imgur.com/XBAygBH.png" alt="" />
        <div className="flex flex-col gap-2 w-full">
          <p><Link to="/register"><span id="animated">Crie uma conta</span></Link> para começar</p>
          <p>Adicione amigos</p>
          <p>Crie grupos e convide membros</p>
        </div>
      </div>
      <div className="flex items-center rounded-3xl bg-brown-200 w-[25rem] p-5">
        <img className="w-40 rounded-3xl" src="https://i.imgur.com/ItZNGtd.jpeg" alt="" />
        <div className="flex flex-col gap-2 w-full">
          <p>Conheça pessoas</p>
          <p>Busque e encontre a sua comunidade</p>
        </div>
      </div>
      <div className="flex items-center rounded-3xl bg-blue-200 w-[25rem] p-5">
        <img className="w-40 rounded-3xl" src="https://i.imgur.com/LWPk2lg.jpeg" alt="exemplo" />
        <div className="flex flex-col gap-2 w-full">
          <p>Converse com segurança!</p>
          <p>Mantemos seus dados pessoais seguros e protegidos.</p>
        </div>
      </div>
    </section>
    </>
  )
}