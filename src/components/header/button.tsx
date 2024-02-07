import { Link } from "react-router-dom";

export interface HeaderButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

export default function Button({ to, children, ...props }: HeaderButtonProps) {
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
}