import { IoCheckmarkDone  } from "react-icons/io5"


export interface ChatBallonProps {
  children: React.ReactNode;
  direction: "left" | "right";
  read: boolean;
  avatar?: string;
  author: string;
  isFinal?: boolean;
}

export default function Balloon({direction, avatar, author, read, isFinal, children}: ChatBallonProps) {
  return (
    <>
    <div 
      className={`
        px-8 py-4 rounded-3xl text-white font-inter max-w-[50%] w-fit
        ${direction === "left" ? "bg-slate-500" : "bg-blue-500"}
        ${direction === "left" ? "m-none mr-auto" : "m-none ml-auto"}
        ${isFinal && (direction === "left" ? "rounded-bl-md" : "rounded-br-md")}
      `}>
      {children}
      {
      direction === "right" && isFinal && (
        <IoCheckmarkDone
          className={`
            w-5 h-5 ml-1.5 inline-block mt-0.5 float-right
            transition-all duration-150
            ${read? "text-blue-900" : "text-slate-300"}
          `} 
        />
      )
    }
    </div>
      {
        isFinal && avatar && (
          <img className={`w-8 rounded-xl ${direction === "left" ? "m-none mr-auto" : "m-none ml-auto"}`} src={avatar} alt={`avatar de ${author}`} />
        )
      }
    </>
  )
}