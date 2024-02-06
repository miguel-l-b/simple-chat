import { IoChatbubble } from "react-icons/io5";
import { Link } from "react-router-dom";
import Form, { FormAlert, FormButton, FormInput } from "../components/form";
import { useState } from "react";
import ErrorAlert from "../utils/types/error";
import UsernameValidator from "../utils/validations/username";
import EmailValidator from "../utils/validations/email";
import PasswordValidator from "../utils/validations/password";
import EqualValidator from "../utils/validations/equals";

export default function Register() {
  const [inputs, setInputs] = useState<Record<string, string>>({})
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
          }}
          incorrect={isIncorrect("password")}
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
        />
      </main>
      <footer className="flex flex-col text-center gap-5">
        {
          errors.find(e => e.type !== "success") && <FormAlert type={errors[0].type} description={errors[0].message} />
        }
        <FormButton>Cadastrar</FormButton>
        <Link to="/login">
          Já tenho uma conta,
          <span id="animated"> Entrar!</span>
        </Link>
      </footer>
    </Form>
  )
}