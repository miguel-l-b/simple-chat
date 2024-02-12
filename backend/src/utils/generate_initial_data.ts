import TChannel from "../types/channel"
import TUser from "../types/user"
import Cache from "./cache"
import generateUUID from "./generate_uuid"

const tech = Cache.set<TUser>("user", {
  id: generateUUID(),
  name: "tech_recrutier",
  email: "demo@tech.com",
  avatar: "https://i.imgur.com/C4WRgx2.jpeg",
  password: "123456",
})


const dev = Cache.set<TUser>("user", {
  id: generateUUID(),
  name: "developer",
  email: "demodev@tech.com",
  avatar: "https://i.imgur.com/2hbwR7Y.jpeg",
  password: "123456",
})

let playroom = Cache.set<TChannel>("channel", {
  id: generateUUID(),
  name: "sala de Jogos",
  isDirect: false,
  image: "https://i.imgur.com/tSfeEwt.jpeg",
  members: [
    tech.id,
    dev.id
  ]
})

Cache.set<TChannel>("channel", {
  id: generateUUID(),
  isDirect: true,
  members: [
    tech.id,
    dev.id
  ]
})

export default function HandleInitialData(user: TUser) {
  Cache.set<TChannel>("channel", {
    id: generateUUID(),
    isDirect: true,
    members: [
      user.id,
      tech.id
    ]
  })

  Cache.set<TChannel>("channel", {
    id: generateUUID(),
    isDirect: true,
    members: [
      user.id,
      dev.id
    ]
  })

  playroom = Cache.update<TChannel>("channel", playroom.id, {
    members: [
      ...playroom.members,
      user.id
      ]
  })
}
