import { IoCheckmarkDone  } from "react-icons/io5"


export interface ChatBallonProps {
  children: React.ReactNode;
  direction: "left" | "right";
  read: boolean;
  isFinal?: boolean;
}

export default function Ballon({direction, read, isFinal, children}: ChatBallonProps) {
  return (
    <>
    <div 
      className={`
        px-8 py-4 rounded-3xl text-white font-inter max-w-xl w-fit
        ${direction === "left" ? "bg-slate-500" : "bg-blue-500"}
        ${direction === "left" ? "m-none mr-auto" : "m-none ml-auto"}
        ${isFinal && (direction === "left" ? "rounded-bl-md" : "rounded-br-md")}
      `}>
      {children}
    </div>
    {
      direction === "right" && isFinal && (
        <IoCheckmarkDone
          className={`
            w-5 h-5 m-none ml-auto
            transition-all duration-150 
            ${read? "text-green-900" : "text-slate-500"}
          `} 
        />
      )
    }
    </>
  )
}