import { FiSend } from "react-icons/fi"

export interface ChatButtonProps {
  onClick?: () => void
  className?: string
}

export default function Button({ className, ...props }: ChatButtonProps) {
  return (
    <button
      className={`
        flex justify-center items-center w-14 h-14 rounded-2xl text-3xl
        bg-blue-500 text-white
        transition-all duration-200 ease-in-out
        hover:bg-blue-400 hover:text-blue-800
        ${className}
       `}
      {...props}
    >
      <FiSend />
    </button>
  )
}