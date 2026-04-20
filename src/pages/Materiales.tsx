import { Link, useParams } from 'react-router-dom';
import imgCurso from '../assets/banner3.png'
import { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { FaBook, FaClipboardList } from 'react-icons/fa';
function Materiales(){
    const { id }=useParams();
    const [curso,setCurso]=useState(null);
    const [materiales, setMateriales]=useState([]);
    const [tareas, setTareas]=useState([]);
    useEffect(()=>{
            const fetchData= async()=>{
                const [cursoRes,materialesRes,tareasRes]= await Promise.all([
                    fetch(`/mocks/cursos.json`),
                    fetch(`/mocks/materiales.json`),
                    fetch(`/mocks/tareas.json`)
                ])
            const curso=await cursoRes.json();
            const materiales=await materialesRes.json();
            const tareas=await tareasRes.json();
            const idNum=Number(id);
            setCurso(curso.find(c=>c.id_curso===idNum));
            setMateriales(materiales.filter(c=>c.id_curso===idNum))
            setTareas(tareas.filter(c=>c.id_curso===idNum))
            }
            fetchData();
        },[id]);
    return(
        <>  {(!curso)
            ? (<h1 className='font-bold text-pink-950'>Curso no encontrado</h1>)
            : (
                <div className='p-5 flex flex-col'>
                    <section className={`relative flex flex-col p-20 mx-auto max-md:mx-2 max-md:px-2 max-w-5xl w-full rounded-2xl py-20 md:py-24 bg-cover bg-center bg-no-repeat`}
                        style={{backgroundImage:`url(${imgCurso})`}}
                    >
                        <div className="absolute inset-0 bg-white/20 h-full w-full rounded-2xl"></div> 
                        <h1 className="relative text-2xl md:text-3xl font-bold text-pink-950 max-w-2xl">{curso.nombre}</h1>
                        <p className="relative text-sm md:text-base text-pink-950 font-bold max-w-xl">
                            {curso.descripcion}
                        </p>
                    </section>
                    <button className='w-full bg-pink-200 h-15 my-3 rounded-2xl cursor-pointer text-lg hover:bg-pink-800 hover:text-white transition-all duration-300 '>
                        <MdEdit className='inline mx-5'/>
                        Nuevo anuncio
                    </button>
                    {(materiales.length===0)?(<h1 className='text-bold text-pink-950'>No hay materiales aun</h1>)
                    :(
                        <ul className='flex flex-col gap-2'>
                            {materiales.map(material=>(
                                <Link to={`/curso/${material.id_curso}/material/${material.id_material}`}>
                                <li className='w-full h-20 bg-gray-100 rounded-2xl flex items-center justify-center gap-5 hover:bg-pink-100 transition-all duration-500 cursor-pointer'>
                                    <FaBook className='text-5xl'/>
                                    <div>
                                        {material.titulo} <br />
                                        {material.fecha_subida}
                                    </div>
                                </li>
                                </Link>
                            ))}
                            {tareas.map(tarea=>(
                                <Link to={`/curso/${tarea.id_curso}/tarea/${tarea.id_tarea}`}>
                                <li className='w-full h-20 bg-gray-300 rounded-2xl flex items-center justify-center gap-5 hover:bg-pink-100 transition-all duration-500 cursor-pointer'>
                                    <FaClipboardList className='text-5xl'/>
                                    <div>
                                        {tarea.titulo} <br />
                                        {tarea.descripcion} <br />
                                        {tarea.fecha_publicacion}
                                    </div>
                                </li>
                                </Link>
                            ))}
                        </ul>
                    )
                    }
                </div>
            )}
            
        </>
    )
}
export default Materiales;