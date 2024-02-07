export interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export default function HeaderRoot({children, className, ...props}: HeaderRootProps) {
  return (
    <header className={`flex gap-10 items-center ${className}`} {...props}>
      {children}
    </header>
  )
}