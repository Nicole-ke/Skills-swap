import { useState } from "react"
import CardsSection from "./components/CardsSection"

function App() {

  const [search, setSearch] = useState("")
  return (

    <div className="min-h-screen bg-gray-100 ">

      <CardsSection search ={search} />

      
    </div>
  )
}

export default App