export interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  message?: string
  className?: string
}

export default function Input({ className, ...props }: ChatInputProps) {
  return (
    <textarea
      className={`
        bg-white text-gray-900 px-4 py-3 resize-none overflow-x-hidden
        rounded-xl rounded-b-md h-12 w-3/5 xl:4/5 max-w-[40rem]
        ${className}
      `}
      rows={2}
      placeholder="Digite sua mensagem..."
      autoComplete="off" 
      value={props.message}
      {...props}
    />
  )
}