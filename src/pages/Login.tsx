import { Link, useNavigate } from "react-router-dom"
import Form, { FormAlert, FormButton, FormInput } from "../components/form"

import { IoChatbubble } from 'react-icons/io5'
import { useEffect, useState } from "react"
import ErrorAlert from "../utils/types/error"
import EmailValidator from "../utils/validations/email"
import userApi from "../api/restfull/user"
import PopUp from "../components/pop_up"



export default function Login() {
  const redirect = useNavigate()
  const [isLogged, setIsLogged] = useState(false)
  const [inputs, setInputs] = useState<Record<string, string>>({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState<Array<ErrorAlert>>([])

  useEffect(() => {
    if(localStorage.getItem("token") && localStorage.getItem("user")) {
      userApi.verifyLogin(JSON.parse(localStorage.getItem("token") || "").token).then(() => {
        setIsLogged(true)
      }).catch(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      })
    }
  }, [])

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
      {
        isLogged && 
        <PopUp
          type="warning"
          title="Você já está logado!"
          message={`
            você já está logado como 
            @${JSON.parse(localStorage.getItem("user") || "{}").name},
            deseja ir para o chat?
          `}
          button={{
            type: "yes-no",
            onClick: (result) => {
              result?
                redirect("/chat")
              :
                setIsLogged(false)
            }
          }}
        />
      }
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
        <FormButton
          disabled={
            errors.find(e => e.type !== "success" && e.type !== "warning") !== undefined ||
            Object.values(inputs).some(v => v.length === 0)
          }
          onClick={async () => {
            await userApi.login({
              email: inputs.email,
              password: inputs.password
            }).then((res) => {
              localStorage.setItem("user", JSON.stringify(res.user))
              localStorage.setItem("token", JSON.stringify(res.token))   
              redirect("/chat")
            }).catch((err) => {
              pushError({
                id: "login",
                type: "warning",
                message: "Email ou senha inválidos!"
              })
            })
          }}
        >
          Entrar
        </FormButton>
        <Link to="/register">
          Não tenho uma conta,
          <span id="animated"> criar conta!</span>
        </Link>
      </footer>
    </Form>
  )
}