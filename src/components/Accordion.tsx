import { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";

function AccordionItem({ title, content }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 bg-white rounded-2xl p-4 m-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-left font-medium text-gray-900 hover:text-gray-600 transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ease-in-out ${open ? "rotate-45" : "rotate-0"}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
            <ul>
                {(content.length==0)?(<li className="m-2">No hay pendientes</li>)
                : content.map(c=>(
                    <li key={c.id_tarea} className="m-2 h-20 flex items-center rounded-xl">
                        <span className=" block w-4 h-full bg-pink-950 rounded-l-2xl"></span>
                        <FaClipboardList className='inline ml-5 text-4xl'/>
                        <div className="ml-4">
                            {c.titulo} <br />
                            {c.descripcion} <br />
                            Entrega: {c.fecha_entrega}
                        </div>
                        <div className="ml-auto">
                            Curso: {c.id_curso}
                        </div>
                    </li>
                ))
                }
            </ul>
        </div>
      </div>
    </div>
  );
}

export default function Accordion() {
    const [items,setItems]=useState([
        ["Hoy",[]],
        ["Semana",[]],
        ["Mes",[]],
        ["Mas tarde",[]]
    ]);
    useEffect(()=>{
        const fetchData=async()=>{
            const [pendientesRes]=await Promise.all([
                fetch(`/mocks/tareas.json`)
            ])
            const pendientes=await pendientesRes.json();
            const hoy=new Date();
            const tareasHoy=[];
            const tareasSemana=[];
            const tareasMes=[];
            const otros=[];
            pendientes.forEach(pendiente => {
                const fecha=new Date(pendiente.fecha_entrega)
                const diffTime=fecha-hoy;
                const diffDias=diffTime/(1000*60*60*24);
                console.log(diffDias)
                if(diffDias<0)return;
                if(diffDias<=1 && diffDias>=0)
                    tareasHoy.push(pendiente);
                else if(diffDias>1 && diffDias<=7)
                    tareasSemana.push(pendiente);
                else if(diffDias>7 && diffDias<=30)
                    tareasMes.push(pendiente)
                else 
                    otros.push(pendiente)
            });
            setItems([
                ["Hoy",tareasHoy],
                ["Semana",tareasSemana],
                ["Mes",tareasMes],
                ["Mas tarde", otros]
            ])
        }
        fetchData();
    },[])
  return (
    <div className="w-2/3 mx-auto border-t border-gray-200">
      {Array.from(items).map((item, i) => (
        <AccordionItem key={i} title={item[0]} content={item[1]} />
      ))}
    </div>
  );
}