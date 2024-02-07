
export interface FormRootProps extends React.HTMLAttributes<HTMLFormElement> {
  children?: React.ReactNode;
}

export default function Root({children, ...props}: FormRootProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()} {...props}>
      {children}
    </form>
  );
}