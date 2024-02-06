import { AlertProps } from "../../components/form/alert"

type ErrorAlert = {
  id: string,
  type: AlertProps['type'],
  message: string
}

export default ErrorAlert