import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface Tarea {
  id_tarea?: number;
  id?: number;
  titulo: string;
  descripcion: string;
  fecha_entrega?: string;
}

interface TaskCardProps {
  tarea: Tarea;
  courseId: number;
}

export const TaskCard = ({ tarea, courseId }: TaskCardProps) => {
  const navigate = useNavigate();

  const isOverdue = tarea.fecha_entrega ? new Date(tarea.fecha_entrega) < new Date() : false;

  const handleOpenTask = () => {
    const taskId = tarea.id_tarea || tarea.id;
    navigate(`/clases/${courseId}/tarea/${taskId}`);
  };

  return (
    <div 
      onClick={handleOpenTask}
      className="bg-surface-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 animate-fade-in-up group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400 opacity-80 group-hover:bg-orange-500 transition-colors"></div>

      <div className="flex items-start gap-4 pl-2">
        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Tarea</span>
            {tarea.fecha_entrega && (
              <span className={`text-xs font-medium flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-text-secondary'}`}>
                Vence: {new Date(tarea.fecha_entrega).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-text-primary group-hover:text-orange-600 transition-colors">{tarea.titulo}</h3>
          <p className="text-sm text-text-secondary mt-2 line-clamp-2">{tarea.descripcion}</p>
        </div>
      </div>
    </div>
  );
};