import { Link, useNavigate } from "react-router-dom"
import Form, { FormAlert, FormButton, FormInput } from "../components/form"

import { IoChatbubble } from 'react-icons/io5'
import { useState } from "react"
import ErrorAlert from "../utils/types/error"
import EmailValidator from "../utils/validations/email"



export default function Login() {
  const redirect = useNavigate()
  const [inputs, setInputs] = useState<Record<string, string>>({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState<Array<ErrorAlert>>([])

  function pushInput(key: string, value: string) {
    setInputs({
      ...inputs,
      [key]: value
    })
  }

  function pushError(error: ErrorAlert) {
    setErrors([error, ...errors])
  }

  function cleanError(id: ErrorAlert['id']) {
    setErrors([
      ...errors.filter(e => e.id !== id),
      {
        id,
        type: "success",
        message: "Campo válido!"
      }
    ])
  }

  function isIncorrect(id: ErrorAlert['id']) {
    const error = errors.find(e => e.id === id)
    if(!error)
      return undefined
    return error.type !== "success"
  }

  return (
    <Form 
      className={`
        flex flex-col py-20 justify-between h-full max-w-[30rem] w-2/3 m-auto
      `}
    >
      <Link to="/"
        className={`
          flex items-center rounded-2xl mx-auto
          bg-blue-500 p-4
        `}
        >
        <IoChatbubble 
          className={`
            m-auto text-6xl
            text-blue-200 transition-all duration-300
          `}
          style={{
            transform: `rotate(-${inputs.password.length}deg)`,
            scale: inputs.password.length > 0? "120%" : "100%"
          }}
        />
      </Link>
      <main className="flex flex-col gap-5">
        <FormInput
          label="Email"
          type="email"
          onChange={(e) => {
            pushInput("email", e.target.value)
            EmailValidator.validate(e.target.value)?
              cleanError("email") 
            : 
              pushError({
                id: "email",
                type: "error",
                message: "Email inválido, tente outro!"
              })
          }}
          incorrect={isIncorrect("email")}
          value={inputs.email}
          autoComplete="email"
        />
        <FormInput
          label="Senha"
          type="password"
          onChange={(e) => {
            pushInput("password", e.target.value)
            e.target.value.length > 0?
              cleanError("password")
            :
              pushError({
                id: "password",
                type: "error",
                message: "A senha é obrigatória!"
              })
          }}
          incorrect={isIncorrect("password")}
          value={inputs.password}
          autoComplete="current-password"
        />
      </main>
      <footer className="flex flex-col text-center gap-5">
        {
          errors.find(e => e.type !== "success") &&
          <FormAlert type={errors[0].type} description={errors[0].message} />
        }
        <FormButton onClick={() => {
          redirect("/chat")
        }}>Entrar</FormButton>
        <Link to="/register">
          Não tenho uma conta,
          <span id="animated"> criar conta!</span>
        </Link>
      </footer>
    </Form>
  )
}