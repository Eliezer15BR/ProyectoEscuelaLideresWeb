import { FaClipboardList, FaHome } from 'react-icons/fa';
import { FaCircleUser } from "react-icons/fa6";
import { IoIosLogOut } from 'react-icons/io';
import { Link } from 'react-router-dom';
function Sidebar(){
    return (
        <>
            <nav className="flex w-70 bg-white fixed h-screen flex-col rounded-tr-2xl rounded-br-2xl">
                <div className=' rounded-tr-2xl bg-linear-to-b from-pink-950 to-pink-800'>
                    <FaCircleUser className='h-15 w-15 text-white m-4'/>
                    <div className="flex-col flex py-3 px-4" >
                        <span className='text-white text-xl'>usuario</span>
                        <span className='text-white text-lg'>correo@gmail.com</span>
                    </div>
                </div>
                <ul className='flex flex-col'>
                    <Link to="/" className="p-5 text-pink-950 flex items-center text-xl hover:bg-pink-50">
                        <FaHome className='inline mr-5'/>
                        Inicio
                    </Link>
                    <a href="" className="p-5 text-pink-950 flex items-center text-xl hover:bg-pink-50">
                        <FaClipboardList className='inline mr-5'/>
                        Pendientes
                    </a>
                </ul>
                <Link to="/login" className='hover:bg-pink-50 text-red-500 mt-auto p-5 rounded-br-2xl text-lg cursor-pointer'>
                    <IoIosLogOut className="inline mx-3"/>
                    Cerrar sesión
                </Link>
            </nav>
            asdf
        </>
    )
}
export default Sidebar;