import { FaHome, FaUserCog } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosLogOut, IoMdMail } from "react-icons/io";
import { Link } from "react-router-dom";

function Perfil(){
    return (
        <main className="flex flex-col items-center bg-linear-to-b from-blue-300 to-blue-200 min-h-screen">
            <div className=" bg-pink-950 h-30 w-full rounded-b-4xl text-white font-bold flex items-center justify-center text-6xl">
                Datos Personales
            </div>
            <FaCircleUser className='h-25 w-25 text-pink-950 m-4 bg-white rounded-full'/>
            <span className="text-pink-950 text-xl font-bold">Usuario</span>
            <ul className="text-pink-950 font-bold flex flex-col gap-5 text-lg bg-white rounded-2xl p-5 mt-5 w-1/3">
                <li className="flex gap-5 items-center">
                    <IoMdMail className="inline"/>
                    <div>
                        <span className="text-gray-500 text-sm">Correo</span><br />
                        ejemplo@gmail.com
                    </div>
                </li>
                <hr className="text-gray-100"/>
                <li className="flex gap-5 items-center">
                    <FaUserCog className="inline"/>
                    <div>
                        <span className="text-gray-500 text-sm">Rol</span><br />
                            Profesor
                    </div>
                </li>
            </ul>
            <div className="flex flex-col">
                <Link to="/" className='flex items-center border border-blue-500 hover:bg-pink-50 text-blue-500 mt-2 p-3 rounded-2xl text-lg cursor-pointer transition-all duration-200'>
                        <FaHome className="inline mx-3"/>
                        Inicio
                </Link>
                <Link to="/login" className='flex items-center border border-red-600 hover:bg-pink-50 text-red-500 mt-2 p-3 rounded-2xl text-lg cursor-pointer transition-all duration-200'>
                        <IoIosLogOut className="inline mx-3"/>
                        Cerrar sesión
                </Link>
            </div>
        </main>
    )
}
export default Perfil;