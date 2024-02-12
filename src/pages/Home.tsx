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
      <h1>Olá 🖖</h1>
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
      <section id="exemple">
      <Chat user_id="456" className="w-2/3 m-auto bg-slate-300 p-8 rounded-t-xl" content={[
        {
          id: "1",
          channel_id: "1",
          type: "text",
          content: "Você tem algum compromisso amanhã? 🧐",
          author: { id: "456", name: "Bob", avatar: "https://i.imgur.com/rzIaXzK.jpeg" },
          createAt: new Date("2024-02-07T18:46:00"),
          read: false
        },
        {
          id: "1",
          channel_id: "1",
          type: "text",
          content: "Também estou bem, obrigado por perguntar! ✌️",
          author: { id: "123", name: "Alice", avatar: "https://i.imgur.com/gSUHQQx.jpeg" },
          createAt: new Date("2024-02-07T15:46:00"),
          read: true
        },
        {
          id: "2",
          channel_id: "1",
          type: "text",
          content: "Eaí mana!",
          author: { id: "456", name: "Bob", avatar: "https://i.imgur.com/rzIaXzK.jpeg" },
          createAt: new Date("2024-02-07T15:44:34"),
          read: true
        },
        {
          id: "2",
          channel_id: "1",
          type: "text",
          content: "Estou bem, e você?",
          author: { id: "456", name: "Bob", avatar: "https://i.imgur.com/rzIaXzK.jpeg" },
          createAt: new Date("2024-02-07T15:45:00"),
          read: true
        },
        {
          id: "3",
          channel_id: "1",
          type: "text",
          content: "Olá, como você está?",
          author: { id: "123", name: "Alice", avatar: "https://i.imgur.com/gSUHQQx.jpeg" },
          createAt: new Date("2024-02-05T08:00:00"),
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
    <section ref={refAbout} className="flex flex-col items-center justify-center text-center mt-56 w-full h-dvh bg-slate-300" id="about">
      <h1 className="mb-20">Principais Recursos</h1>
      <h2>Chat em Tempo Real</h2>
      <p>Converse com amigos, familiares e colegas instantaneamente, sem atrasos.</p>
      <p>Receba mensagens em tempo real, proporcionando uma experiência de comunicação rápida e eficaz.</p>
      <br />
      <h2>Sistema de Grupos</h2>
      <p>Crie grupos temáticos para discutir tópicos específicos com pessoas interessadas.</p>
      <p>Convide membros para seus grupos e mantenha conversas organizadas e focadas.</p>
      <br />
      <h2>Segurança e Privacidade</h2>
      <p>Converse com segurança, sabendo que suas mensagens estão protegidas e privadas.</p>
      <p>Mantemos seus dados pessoais seguros e protegidos.</p>
      <br />
      <h2>Como Funciona</h2>
      <p>Crie uma conta ou faça login para começar a conversar.</p>
      <p>Adicione amigos e comece a conversar com eles.</p>
      <p>Crie grupos e convide membros para conversas temáticas.</p>
    </section>
    </>
  )
}