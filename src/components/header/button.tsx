import { RefObject } from "react"
import { Link } from "react-router-dom"

export interface HeaderButtonProps extends React.HTMLAttributes<HTMLElement> {
  to: string | RefObject<any>;
  children: React.ReactNode;
}

export default function Button({ to, children, ...props }: HeaderButtonProps) {
  if(typeof to === "string")
    return (
      <Link
        to={to}
        className={`
          text-md font-semibold px-3 py-1.5
          border-b-4 border-blue-900 text-gray-900
          transition-all duration-500 hover:text-blue-900 hover:py-1 hover:border-blue-400
        `}
        {...props}
      >
        {children}
      </Link>
    )

  return (
    <button
      onClick={() => {
        if(to.current) {
          to.current.scrollIntoView({ behavior: "smooth" })
        }
      }}
      className={`
        text-md font-semibold px-3 py-1.5
        border-b-4 border-blue-900 text-gray-900
        transition-all duration-500 hover:text-blue-900 hover:py-1 hover:border-blue-400
      `}
      {...props}
    >
      {children}
    </button>
  )


}