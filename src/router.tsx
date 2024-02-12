import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import twemoji from 'twemoji'
import Chat from './pages/Chat'
import PopUp from './components/pop_up'


export default function Router() {
  twemoji.parse(document.body, {
    folder: 'svg',
    ext: '.svg',
  })
  
  const [alertDemo, setAlertDemo] = useState(localStorage.getItem("alert-demo"))

  useEffect(() => {
      localStorage.setItem("alert-demo", alertDemo || "false")
  }, [alertDemo])

  return (
    <>
      {alertDemo === "false" &&
        <PopUp
          type="warning"
          title="Bem vindo ao SimpleChat"
          message="Este site é uma demo de um cliente, portanto não coloque informações pessoais nem utilize para conversar com outras pessoas, isso é um DEMO!"
          button={{
            type: "ok",
            onClick: () => setAlertDemo("true")
          }}
        />
      }
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
