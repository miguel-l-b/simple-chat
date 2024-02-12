import { useContext } from "react"
import { IoCheckmarkDone  } from "react-icons/io5"
import { FiTrash, FiCopy } from "react-icons/fi"
import { BalloonSelectedContext } from "../../context/balloon_selected"
import { ChatContext } from "../../context/chat"

export interface ChatBallonProps {
  children: React.ReactNode;
  id: string;
  direction: "left" | "right";
  channel_id: string;
  date: Date;
  read: boolean;
  avatar?: string;
  author: string;
  isFinal?: boolean;
}

export default function Balloon({
  id, channel_id, direction, date, avatar, author, read, isFinal, children
}: ChatBallonProps) {
  const { id: selectedId, handleSelect } = useContext(BalloonSelectedContext)
  const { deleteMessage } = useContext(ChatContext)
  function handleCopy() {
    navigator.clipboard.writeText(
      `"${children!.toString()}" de ${author} - ${date.toLocaleTimeString().substring(0, 5)}`
    )
  }

  return (
    <div className="relative w-full px-2.5 select-none" onDoubleClick={() => handleSelect(selectedId === id? "" : id)}>
      <div
        className={`
          absolute -top-1 left-0 w-full h-full px-14
          flex items-center rounded-md gap-5
          ${direction === "left" ? "justify-end" : "justify-end flex-row-reverse"}
          transition-all duration-150
          bg-blue-400 bg-opacity-60
          ${selectedId !== id && "hidden"}
        `}
      >
        <button
          className="flex flex-col group items-center mt-2 text-slate-600"
          type="button"
          onClick={() => deleteMessage(channel_id, id)}
        >
          <FiTrash
            className={`
              text-blue-900 bg-blue-200 group-hover:bg-blue-400 
              transition-colors duration-150 p-2 rounded-lg w-9 h-9
            `} 
            />
          <p>apagar</p>
        </button>
        <button
          className="flex flex-col group items-center mt-2 text-slate-600"
          type="button"
          onClick={handleCopy}
        >
          <FiCopy
            className={`
              text-blue-900 bg-blue-200 group-hover:bg-blue-400 
              transition-colors duration-150 p-2 rounded-lg w-9 h-9
            `} 
          />
          <p>copiar</p>
        </button>
      </div>
      <div 
        className={`
          relative z-10
          px-8 py-4 rounded-3xl text-white font-inter max-w-[50%] w-fit
          ${direction === "left" ? "bg-slate-500" : "bg-blue-500"}
          ${direction === "left" ? "m-none mr-auto" : "m-none ml-auto"}
          ${isFinal && (direction === "left" ? "rounded-bl-md" : "rounded-br-md pl-5")}
          ${!isFinal && "mb-2"}
        `}>
        {children}
        {
        direction === "right" && isFinal && (
          <IoCheckmarkDone
            className={`
              w-5 h-5 inline-block ml-1.5 mt-0.5 -mr-2.5 float-right
              transition-all duration-150
              ${read? "text-blue-900" : "text-slate-300"}
            `} 
          />
        )
      }
      </div>
      {
        isFinal && (
          <div 
            className={`
              relative z-10
              flex gap-5 items-center font-semibold max-w-fit mt-2 mb-2
              ${
                direction === "left" ? 
                  "m-none mr-auto flex-row-reverse text-slate-800"
                :
                  "m-none ml-auto text-slate-500"
              }
            `}
          >
            <p>@{author}</p>
            <img className="w-8 rounded-xl" src={avatar} alt={`avatar de ${author}`} />
            <p className={`${direction === "left"? "-ml-14" : "-mr-14"}`}>
              {date.toLocaleTimeString().substring(0, 5)}
            </p>
          </div>
        )
      }
    </div>
  )
}