export interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export default function HeaderRoot({children, className, ...props}: HeaderRootProps) {
  return (
    <>
    <header className={`fixed flex gap-10 items-center w-full z-50 ${className}`} {...props}>
      {children}
    </header>
    <span className="block h-20 w-full" />
    </>
  )
}