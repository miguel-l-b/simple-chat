import { useState } from 'react'
import { FiAlertTriangle, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  incorrect?: boolean;
}

export default function Input({label, ...props}: InputProps) {
  const [type, setType] = useState(props.type)
  return (
    <div className="flex flex-col text-center">
      <label className="mb-2 text-xl font-bold">{label}</label>
      <div className="relative flex h-8">
        <input
          className="w-full px-3 rounded-lg"
          {...props}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange(e)
            }

            if(props.type === "password") {
              setType("password")
            }
          }}
          type={type}
        />
        {props.type === "password" && (
          <button
            type="button"
            onClick={() => setType(type === "password" ? "text" : "password")}
            className={`
              absolute flex justify-center items-center right-0 h-8 w-8 rounded-lg
              bg-blue-100 text-blue-500
            `}
          >
            {type === "password" ? <FiEye /> : <FiEyeOff />}
          </button>
        )}
        {
          props.incorrect === true ? (
            <FiAlertTriangle
              className={`
              absolute -right-12
              bg-orange-100 text-orange-500 h-full w-8 p-1.5 rounded-lg
              `}
            />
          ) : props.incorrect === false && (
            <FiCheckCircle
              className={`
              absolute -right-12
              bg-green-100 text-green-500 h-full w-8 p-1.5 rounded-lg
              `}
            />
          )
        }
      </div>
    </div>
  )
}