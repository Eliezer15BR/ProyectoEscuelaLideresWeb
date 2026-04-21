import { useEffect, useState } from 'react';
import imgCurso from '../assets/banner3.png'
import { Link } from 'react-router-dom';
import type { CursoEntity } from '../types/CursoEntity.interface';
import Navbar from '../components/Navbar';
function Cursos(){
    const [cursos, setCursos]=useState<CursoEntity[]>([]);
    useEffect(()=>{
        fetch('/mocks/cursos.json')
        .then((res)=>res.json())
        .then((json)=>setCursos(json))
        .catch(err=>console.error(err));
    },[]);
    return(
        <div className='md:ml-70 ml-42'>
            <Navbar titulo="Cursos"/>
            <main>
        <div className="grid md:grid-cols-2 grid-cols-1 p-10 w-full gap-10">
            {
                (cursos.length!=0)
                ?   cursos.map((curso)=>(
                <Link to={`/curso/${curso.id_curso}/materiales`}>
                    <div className="border border-gray-500/20 rounded-md bg-white" key={curso.id_curso}>
                        <div className="group cursor-pointer flex items-center justify-center h-30">
                            <img className="h-full w-full group-hover:scale-105 transition object-cover rounded-t-md" src={imgCurso} alt="Imagen del curso" />
                        </div>
                        <div className="text-gray-500/60 text-sm px-3 py-2">
                            <p>2025</p>
                            <p className="text-gray-700 font-medium text-lg truncate w-full">{curso.nombre}</p>
                            
                            <div className="flex items-end justify-between mt-1">
                                <p className="md:text-xl text-base font-medium text-pink-950">
                                    {curso.descripcion}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
                ))
                :(<div className='text-bold'>Ningun curso encontrado</div>)
            }
            
            
        </div>
        </main>
        </div>
    )
}
export default Cursos;