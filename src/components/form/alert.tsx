import * as FeatherIcons from 'react-icons/fi'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'error' | 'warning' | 'info' | 'success';
  description?: string;
}

export default function Alert({type, description, ...props}: AlertProps) {
  switch (type) {
    case 'error':
      return (
        <div
          className={`
            flex gap-5 items-center
            bg-red-100 border border-red-400 text-red-700
            px-4 py-2 rounded-lg relative
          `}
          role="alert"
          {...props}
        >
          <FeatherIcons.FiAlertCircle className="text-2xl" />
          <p>{description}</p>
        </div>
      )
    case 'warning':
      return (
        <div
          className={`
            flex gap-5 items-center
            bg-yellow-100 border border-yellow-400 text-yellow-700
            px-4 py-2 rounded-lg relative
          `}
          role="alert"
          {...props}
        >
          <FeatherIcons.FiAlertTriangle className="text-2xl" />
          <p>{description}</p>
        </div>
      )
    case 'info':
      return (
        <div
          className={`
            flex gap-5 items-center
            bg-blue-100 border-2 border-blue-900 text-blue-700
            px-4 py-2 rounded-lg relative
          `}
          role="alert"
          {...props}
        >
          <FeatherIcons.FiInfo className="text-2xl" />
          <p>{description}</p>
        </div>
      )
    case 'success':
      return (
        <div
          className={`
            flex gap-5 items-center
            bg-green-100 border border-green-400 text-green-700
            px-4 py-2 rounded-lg relative
          `}
          role="alert"
          {...props}
        >
          <FeatherIcons.FiCheckCircle className="text-2xl" />
          <p>{description}</p>
        </div>
      )
  }
}