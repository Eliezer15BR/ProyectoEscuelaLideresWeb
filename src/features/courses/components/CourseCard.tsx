import type { Course } from "../../services/courseService";

interface CourseCardProps {
    course: Course;
    onClick?: (id: number) => void;
}
export const CourseCard = ({course,onClick}: CourseCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {day: '2-digit', month: 'short'}).format(date);
    };
    return (
        <div 
            onClick={() => onClick && onClick(course.id_curso)}
            className={`
                bg-surface-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.05)] flex flex-col h-full overflow-hidden group
                ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''}
            `}
            >
            {/* Cabecera Tipo Classroom / App Móvil */}
            <div className="bg-gradient-to-r from-primary-dark to-primary p-5 h-28 relative">
                <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 pr-12 drop-shadow-md">
                {course.nombre}
                </h3>
                {course.profesor && (
                  <p className="text-white/90 text-sm mt-1 line-clamp-1">{course.profesor.nombre}</p>
                )}
                {/* Ícono de avatar flotante a la derecha */}
                <div className="absolute -bottom-6 right-5 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 group-hover:scale-110 transition-transform">
                    <span className="text-primary font-black text-xl">
                      {course.profesor?.nombre?.charAt(0).toUpperCase() || 'P'}
                    </span>
                </div>
            </div>

            {/* Cuerpo: Descripción */}
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-sm text-text-secondary line-clamp-3 grow mb-6 mt-4">
                  {course.descripcion}
              </p>

              {/* Pie: Fechas */}
              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span>{formatDate(course.fecha_inicio)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span>{formatDate(course.fecha_fin)}</span>
                  </div>
              </div>
            </div>
        </div>
    )
}