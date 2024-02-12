import { useState, createContext } from "react"

export interface BalloonSelectedContextProps {
  id: string;
  handleSelect: (id: string) => void
}

export const BalloonSelectedContext = createContext<BalloonSelectedContextProps>({
  id: "",
  handleSelect: (id) => {}
})

export default function BalloonSelectedProvider({children}: {children: React.ReactNode}) {
  const [id, setId] = useState("")

  const handleSelect = (id: string) => setId(id)

  return (
    <BalloonSelectedContext.Provider value={{id, handleSelect}}>
      {children}
    </BalloonSelectedContext.Provider>
  )
}