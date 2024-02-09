import { useEffect, useState } from "react"
import { FiAlertCircle } from "react-icons/fi"

export default function AlertDemo() {
  const [alertDemo, setAlertDemo] = useState(localStorage.getItem("alert-demo"))

  useEffect(() => {
      localStorage.setItem("alert-demo", alertDemo || "false")
  }, [alertDemo])

  if(alertDemo === "false") {
    return (
      <div className="fixed z-[999] inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg">
          <h1 className="text-2xl font-bold">
            <FiAlertCircle className="inline-block -mt-1 text-orange-500" /> Bem vindo ao SimpleChat
          </h1>
          <br />
          <p>Este site é uma demo de um cliente feito unicamente utilizando reactJs,</p>
          <p>portanto não coloque informações pessoais nem utilize para conversar</p>
          <p>com outras pessoas, isso é um DEMO!</p>
          <br />
          <button
            className="bg-slate-400 text-white hover:bg-slate-600 transition-all duration-300 ease-in p-2 rounded-md"
            onClick={() => setAlertDemo("true")}
          >
            Entendi
          </button>
        </div>
      </div>
    )
  }

  return <></>
}