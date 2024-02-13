import { useState } from "react"
import Form from "../../components/form"
import Button from "../../components/form/button"
import Input from "../../components/form/input"
import { FiArrowLeft } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import PopUp from "../../components/pop_up"
import userApi from "../../api/restfull/user"

export default function Profile() {
  const token = JSON.parse(localStorage.getItem('token') || "{}")
  const redirect = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || "{}")

  const [edit, setEdit] = useState({
    ...user,
    password: "",
    currentPassword: "",
    newPassword: ""
  })

  const [drawerDelete, setDrawerDelete] = useState(false)

  function updateEdit(name: string, value: string) {
    setEdit({...edit, [name]: value})
  }

  return (
    <>
    <Link className="fixed top-10 left-10" to="/chat">
      <FiArrowLeft className=" w-10 h-10" />
    </Link>
    <main className="flex flex-col justify-center items-center w-full min-h-full bg-slate-300 py-40">
      <div className="flex gap-10 items-center">
        <img className="w-52 rounded-3xl" src={user.avatar} alt="" />
        <div className="text-center">
        <h1>@{user.name}</h1>
        <br />
        <h2>{user.email}</h2>
        </div>
      </div>
      <div className="flex flex-col items-center w-96 mt-8">
        <Button 
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = "/login"
          }}
          className="bg-orange-500"
          type="submit"
        >
          Logout
        </Button>
      </div>
      <Form className="flex flex-col gap-8 items-center w-96 mt-28">
        <h1>Editar informações:</h1>
        <Input
          label="Name"
          type="text"
          value={edit.name}
          onChange={(e) => updateEdit("name", e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={edit.email}
          onChange={(e) => updateEdit("email", e.target.value)}
        />
        <div className="relative w-full">
          <Input
            label="Avatar"
            type="text"
            value={edit.avatar}
            onChange={(e) => updateEdit("avatar", e.target.value)}
          />
          {
            edit.avatar.length !== 0 && (
              <img
                onError={(e) => e.currentTarget.src = "/logo.svg"}
                className="absolute h-8 w-8 rounded-lg right-0 bottom-0"
                src={edit.avatar}
                alt="avatar"
              />
            )
          }
        </div>
        <Button
          onClick={() => {
            userApi.update(edit, token.token)
              .then(() => localStorage.setItem('user', JSON.stringify({
                name: edit.name,
                email: edit.email,
                avatar: edit.avatar
              })))
              .catch(() => console.log("Erro"))
          }}
          type="submit"
        >
          Salvar
        </Button>
      </Form>
      <Form className="flex flex-col gap-8 items-center w-96 mt-28">
        <h1>Deletar conta:</h1>
        <Button 
          className="bg-red-500"
          type="submit"
          onClick={() => setDrawerDelete(true)}
        >
          Deletar
        </Button>
      </Form>
      {
        drawerDelete && (
          <PopUp
            title={"Deletar conta"}
            message={"Tem certeza que deseja deletar a sua conta, esse processo é irreversível!"}
            button={{
              type: "yes-no",
              onClick: (e) => {
                if(e) {
                  localStorage.removeItem('token')
                  localStorage.removeItem('user')
                  userApi.delete(token.token)
                    .then(() => redirect("/login"))
                }
                setDrawerDelete(false)
              }}
            } />
        )
      }
    </main>
    </>
  )
}