type TChannel = {
  id: number
  name: string
  users: number[]
} & ({
isDirect: false,
image: string
} | {
isDirect: true
})

export default TChannel