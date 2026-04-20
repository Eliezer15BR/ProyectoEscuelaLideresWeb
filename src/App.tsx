import Login from "./pages/Login"
import Layout from "./pages/Layout"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Cursos from "./pages/Cursos"
import Materiales from "./pages/Materiales"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Cursos/>}/>
          <Route path="/curso/:id/materiales" element={<Materiales/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
