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
      className="bg-surface-white border border-gray-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-fade-in-up group cursor-pointer flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary-dark flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 1-2.4 1.84-2.82 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="text-base font-bold text-primary-dark group-hover:text-primary transition-colors">{tarea.titulo}</h3>
        <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-text-secondary line-clamp-1">{tarea.descripcion}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
          {tarea.fecha_entrega && (
              <span className={`text-xs font-bold ${isOverdue ? 'text-error' : 'text-text-secondary'}`}>
                {isOverdue ? 'Vencida' : new Date(tarea.fecha_entrega).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </span>
          )}
          <div className="text-gray-300 group-hover:text-primary/50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
      </div>
    </div>
  );
};