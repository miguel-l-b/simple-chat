
export interface FormRootProps extends React.HTMLAttributes<HTMLFormElement> {
  children?: React.ReactNode;
}

export default function Root({children, ...props}: FormRootProps) {
  return (
    <form {...props}>
      {children}
    </form>
  );
}