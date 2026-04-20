import { useParams } from 'react-router-dom';
import imgCurso from '../assets/banner3.png'
import { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
function Materiales(){
    const { id }=useParams();
    const [curso,setCurso]=useState(null);
    useEffect(()=>{
            fetch('/mocks/cursos.json')
            .then((res)=>res.json())
            .then((json)=>{
                setCurso(json.find(c=>c.id_curso==id));
            })
            .catch(err=>console.error(err));
        },);
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
                    <button className='w-full bg-pink-200 h-15 my-3 rounded-2xl cursor-pointer text-lg'>
                        <MdEdit className='inline mx-5'/>
                        Nuevo anuncio
                    </button>
                    
                </div>
            )}
            
        </>
    )
}
export default Materiales;