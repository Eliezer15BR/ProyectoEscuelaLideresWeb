import { useEffect, useState } from "react";
import { FaEdit, FaHome } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { Link } from "react-router-dom";

function Admin(){
    const [usuarios,setUsuarios]=useState([]);
    const [usuariosFiltrados,setUsuariosFiltrados]=useState([]);
    const [busqueda, setBusqueda]=useState('');
    const handleBuscar=()=>{
        const resultado=usuarios.filter(u=>
            u.nombre.toLowerCase()===busqueda.toLowerCase() || u.correo.toLowerCase()===busqueda.toLowerCase()
        );
        setUsuariosFiltrados(resultado);
    }
    const handleReset=()=> setUsuariosFiltrados(usuarios);
    useEffect(()=>{
            fetch('/mocks/usuarios.json')
            .then((res)=>res.json())
            .then((json)=>{setUsuarios(json);setUsuariosFiltrados(json)})
            .catch(err=>console.error(err));
        },[]);
    return(
        <>
            <main className="flex flex-col gap-2 items-center bg-linear-to-b from-blue-300 to-blue-200 min-h-screen">
            <div className=" bg-pink-950 h-30 w-full rounded-b-4xl text-white font-bold flex items-center justify-center text-6xl">
                Administración
            </div>
            <div className="w-2/5 flex flex-col gap-4 mt-5">
                <label htmlFor="buscarUsuario" className="text-gray-800">Buscar Usuario</label>
                <div className="flex gap-2">
                    <div className="flex items-center border pr-3 pl-3 gap-2 bg-white border-gray-500/30 h-11.5 rounded-md overflow-hidden w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="#6B7280">
                            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8"/>
                        </svg>
                        <input type="text" id='buscarUsuario' placeholder="Nombre/Correo" className="w-full h-full outline-none text-gray-500 placeholder-gray-500 text-sm" 
                            onChange={e=>setBusqueda(e.target.value)}
                        />
                    </div>
                    <button className="cursor-pointer bg-pink-950 w-32 h-11.5 rounded-md text-sm text-white hover:bg-pink-900 transition-all duration-200"
                        onClick={handleBuscar}
                    >
                        Buscar
                    </button>
                    <button className="cursor-pointer bg-pink-950 w-50 h-11.5 rounded-md text-sm text-white hover:bg-pink-900 transition-all duration-200"
                        onClick={handleReset}
                    >
                        Mostrar Todos
                    </button>
                </div>
            </div>
            <section className="w-2/3 mt-4">
                <ul className="w-full grid grid-cols-2 gap-4">
                {
                    usuariosFiltrados.map(usuario=>(
                        <li className="flex justify-around items-center gap-5 h-20 rounded-2xl bg-white">
                            <div>
                                {usuario.nombre} <br />
                                {usuario.correo}
                            </div>
                            <FaEdit className="text-2xl" />
                        </li>
                    ))
                }
                </ul>
            </section>
            <div className="flex gap-5 mb-2">
                <Link to="/" className='w-50 flex items-center border border-blue-500 hover:bg-pink-50 text-blue-500 mt-2 p-3 rounded-2xl text-lg cursor-pointer transition-all duration-200'>
                        <FaHome className="inline mx-3"/>
                        Inicio
                </Link>
                <Link to="/login" className='w-50 flex items-center border border-red-600 hover:bg-pink-50 text-red-500 mt-2 p-3 rounded-2xl text-lg cursor-pointer transition-all duration-200'>
                        <IoIosLogOut className="inline mx-3"/>
                        Cerrar sesión
                </Link>
            </div>
        </main> 
        </>
    );
}
export default Admin;