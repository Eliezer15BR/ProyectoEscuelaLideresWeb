import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";

function Tarea(){
    const {tareaId}=useParams();
    const [tarea,setTarea]=useState(null);
    useEffect(()=>{
        const tareaIdNum=Number(tareaId);
        fetch('/mocks/tareas.json')
        .then(res=>res.json())
        .then(tar=>setTarea(tar.find(t=>t.id_tarea===tareaIdNum)))
        .catch(e=>console.log(e))
    })
    return(
        <section className="p-10">
            {(!tarea)?(<div>Tarea no encontrada</div>)
                :
                (  
                    <div className="p-5 flex flex-col gap-5 bg-white rounded-4xl">
                    <h1 className="font-bold text-3xl">{tarea.titulo}</h1>
                    <p>Fecha de vencimiento: {tarea.fecha_entrega}</p>
                    <p>Descripcion: {tarea.descripcion}</p>
                    <div className="flex flex-col gap-5">
                        Archivos adjuntos
                            <div className="p-4 bg-pink-950 border border-gray-200 hover:-translate-y-1 transition duration-300 rounded-lg shadow shadow-black/10 max-w-80">
                                <FaFileAlt className="text-9xl text-white"/>
                                <p className="text-white text-xl font-semibold ml-2 mt-4">
                                    Nombre del archivo asociado a tarea
                                </p>
                                <p className="text-zinc-400 text-sm/6 mt-2 ml-2 mb-2">
                                    Descripcion del archivo
                                </p>
                            </div>
                    </div>
                    <div className=" w-full p-6 bg-white rounded-lg border border-gray-500/30 shadow-[0px_1px_15px_0px] shadow-black/10 text-sm">
                        <h3 className="font-bold text-3xl">Entrega</h3>
                        <label htmlFor="fileInput" className="border-2 border-dotted border-gray-400 p-8 mt-2 flex flex-col items-center gap-4 cursor-pointer hover:border-blue-500 transition">
                            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.085 2.583H7.75a2.583 2.583 0 0 0-2.583 2.584v20.666a2.583 2.583 0 0 0 2.583 2.584h15.5a2.583 2.583 0 0 0 2.584-2.584v-15.5m-7.75-7.75 7.75 7.75m-7.75-7.75v7.75h7.75M15.5 23.25V15.5m-3.875 3.875h7.75" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p className="text-gray-500">Drag files here to upload</p>
                            <p className="text-gray-400">Or <span className="text-blue-500 underline">click here</span> to select a file</p>
                            <input id="fileInput" type="file" className="hidden" />
                        </label>
                    
                        <div className="mt-6 flex flex-col justify-end gap-4">
                            <button type="button" className="px-9 py-2 border border-red-500/50 bg-white hover:bg-red-500 hover:text-white cursor-pointer active:scale-95 transition-all text-red-500 rounded">
                                Anular entrega
                            </button>
                            <button type="button" className="px-6 py-2 bg-pink-950 hover:bg-blue-600 cursor-pointer active:scale-95 transition-all text-white rounded">
                                Entregar
                            </button>
                        </div>
                    </div>
                    </div>
                )
            }
            
        </section>
    );
}
export default Tarea;