import Login from "./pages/Login"
import Layout from "./components/Layout"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Cursos from "./pages/Cursos"
import Materiales from "./pages/Materiales"
import Perfil from "./pages/Perfil"
import Admin from "./pages/Admin"
import Pendientes from "./pages/Pendientes"
import Material from "./pages/Material"
import Tarea from "./pages/Tarea"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Cursos/>}/>
          <Route path="/curso/:id/materiales" element={<Materiales/>}/>
          <Route path="/curso/:cursoId/material/:materialId" element={<Material/>}/>
          <Route path="/curso/:cursoId/tarea/:tareaId" element={<Tarea/>}/>
          <Route path="/pendientes" element={<Pendientes/>}/>
        </Route>
        <Route path="/perfil" element={<Perfil/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
