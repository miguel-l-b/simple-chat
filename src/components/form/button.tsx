export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({children, className, ...props}: ButtonProps) {
  return (
    <button
      className={`
        w-3/4 min-w-40 m-auto py-3 rounded-lg
        bg-black text-white
        disabled:bg-slate-500 disabled:text-slate-200
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}