import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import type { MaterialEntity } from "../types/MaterialEntity.interface";
import Navbar from "../components/Navbar";

function Material(){
    const { materialId }=useParams();
    const [material,setMaterial]=useState<MaterialEntity>();
    useEffect(()=>{
        const idNum=Number(materialId)
        fetch('/mocks/materiales.json')
        .then(res=>res.json())
        .then((mat:MaterialEntity[])=>setMaterial(mat.find(m=>m.id_material===idNum)))
        .catch(e=>console.log(e))
    })
    return(
        <div className="md:ml-70 ml-42">
            <Navbar titulo="Material"/>
            <main>
        <section className="p-10">
            {(!material)?(<div> No se ha encontrado el material</div>)
                :(
                <div className="bg-white rounded-4xl p-5 text-pink-950">
                    <h1 className="font-bold text-3xl">{material.titulo}</h1>
                    <p className="mt-5">Fecha: {material.fecha_subida.toString()}</p>
                    <p className="my-5">Esta es una descripcion del fin del material visto</p>
                    <div className="flex flex-col gap-5">
                        Archivos adjuntos
                            <div className="p-4 bg-pink-950 border border-gray-200 hover:-translate-y-1 transition duration-300 rounded-lg shadow shadow-black/10 max-w-80">
                                <FaFileAlt className="text-9xl text-white"/>
                                <p className="text-white text-xl font-semibold ml-2 mt-4">
                                    Nombre del archivo
                                </p>
                                <p className="text-zinc-400 text-sm/6 mt-2 ml-2 mb-2">
                                    Descripcion del archivo
                                </p>
                            </div>
                    </div>
                </div>
                )
            }
        </section>
        </main>
        </div>
    );
}
export default Material;