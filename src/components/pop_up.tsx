import React from "react"

export interface PopUpProps {
  type?: "success" | "error" | "warning" | "info"
  title: string
  message: string
  button: {
    type: "ok",
    onClick: () => void
  } | {
    type: "yes-no",
    onClick: (result: boolean) => void
  }
}

export default function PopUp({title, message, button}: PopUpProps) {
  return (
  <div className="fixed z-[999] inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg max-w-[60%]">
      <h1 className="text-2xl font-bold">
        {title}
      </h1>
      <br />
      {message}
      <br />
      {
        button.type === "yes-no" ? (
          <div className="flex gap-4">
            <button
              className="bg-slate-400 text-white hover:bg-slate-600 transition-all duration-300 ease-in p-2 rounded-md"
              onClick={() => button.onClick(true)}
            >
              Sim
            </button>
            <button
              className="bg-slate-400 text-white hover:bg-slate-600 transition-all duration-300 ease-in p-2 rounded-md"
              onClick={() => button.onClick(false)}
            >
              Não
            </button>
          </div>
        ) : button.type === "ok" && (
          <button
            className="bg-slate-400 text-white hover:bg-slate-600 transition-all duration-300 ease-in p-2 rounded-md"
            onClick={button.onClick}
          >
            Ok
          </button>
        )
      }
    </div>
  </div>
  )
}