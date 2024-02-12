import { IoChatbubble } from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom"
import Form, { FormAlert, FormButton, FormInput } from "../components/form"
import { useState } from "react"
import ErrorAlert from "../utils/types/error"
import UsernameValidator from "../utils/validations/username"
import EmailValidator from "../utils/validations/email"
import PasswordValidator from "../utils/validations/password"
import EqualValidator from "../utils/validations/equals"
import userApi from "../api/restfull/user"

export default function Register() {
  const redirect = useNavigate()
  const [inputs, setInputs] = useState<Record<string, string>>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: ""
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
        <IoChatbubble className="m-auto text-6xl text-blue-200" />
      </Link>
      <main className="flex flex-col gap-5">
        <FormInput
          label="Nome de usuário"
          type="text"
          onChange={e => {
            pushInput("username", e.target.value)
            UsernameValidator.validate(e.target.value)?
              cleanError("username")
            :
              pushError({
                id: "username",
                type: "error",
                message: "Nome de usuário inválido!"
              })
          }}
          incorrect={isIncorrect("username")}
          autoComplete="username"
        />
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
          autoComplete="email"
        />
        <FormInput
          label="Senha"
          type="password"
          onChange={(e) => {
            pushInput("password", e.target.value)
            PasswordValidator.validate(e.target.value)?
              cleanError("password")
            :
              pushError({
                id: "password",
                type: "error",
                message: "Senha inválida, tente outra!"
              })
            EqualValidator.validate(e.target.value, inputs.confirmPassword)?
            cleanError("confirmPassword")
          :
            pushError({
              id: "confirmPassword",
              type: "error",
              message: "Senhas não coincidem!"
            })
          }}
          incorrect={isIncorrect("password")}
          autoComplete="new-password"
        />
        <FormInput
          label="Confirmar Senha"
          type="password"
          onChange={(e) => {
            pushInput("confirmPassword", e.target.value)
            EqualValidator.validate(e.target.value, inputs.password)?
              cleanError("confirmPassword")
            :
              pushError({
                id: "confirmPassword",
                type: "error",
                message: "Senhas não coincidem!"
              })
          }}
          incorrect={isIncorrect("confirmPassword")}
          autoComplete="new-password"
        />
        <div className="relative flex w-full">
          <FormInput
            label="URL da foto de perfil"
            type="url"
            onChange={(e) => {
              pushInput("avatar", e.target.value)
              e.target.value.length !== 0?
                cleanError("avatar")
              :
                pushError({
                  id: "avatar",
                  type: "error",
                  message: "URL inválida, tente outra!"
                })
            }}
            incorrect={isIncorrect("avatar")}
            autoComplete="photo"
          />
          {
            inputs.avatar.length !== 0 && (
              <img
                onError={(e) => {
                  e.currentTarget.src = "/logo.svg"
                  pushError({
                    id: "avatar",
                    type: "error",
                    message: "URL inválida, tente outra!"
                  })
                }}
                className="absolute h-8 w-8 rounded-lg right-0 bottom-0"
                src={inputs.avatar}
                alt="avatar"
              />
            )
          }
        </div>
      </main>
      <footer className="flex flex-col text-center gap-5">
        {
          errors.find(e => e.type !== "success") && <FormAlert type={errors[0].type} description={errors[0].message} />
        }
        <FormButton
          disabled={
            errors.find(e => e.type !== "success" && e.type !== "warning") !== undefined ||
            Object.values(inputs).some(v => v.length === 0)
          }
          onClick={async () => {
            await userApi.register({
              name: inputs.username,
              email: inputs.email,
              password: inputs.password,
              avatar: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
            }).then(() => {
              redirect("/login")
            }).catch(() => {
              pushError({
                id: "server",
                type: "warning",
                message: "Erro ao cadastrar, tente novamente!"
              })
            })
          }}
        >
          Cadastrar
        </FormButton>
        <Link to="/login">
          Já tenho uma conta,
          <span id="animated"> Entrar!</span>
        </Link>
      </footer>
    </Form>
  )
}