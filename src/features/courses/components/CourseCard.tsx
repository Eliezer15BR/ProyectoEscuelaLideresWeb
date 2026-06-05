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
                bg-surface-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col h-full
                ${onClick ? 'cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-300' : ''}
            `}
            >
            {/* Cabecera: Título y Etiqueta de Cupos */}
            <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="text-lg font-bold text-text-primary leading-tight line-clamp-2">
                {course.nombre}
                </h3>
            </div>

            {/* Cuerpo: Descripción */}
            {/* line-clamp-3 evita que descripciones muy largas rompan el tamaño de la tarjeta */}
            <p className="text-sm text-text-secondary line-clamp-3 grow mb-6">
                {course.descripcion}
            </p>

            {/* Pie: Fechas de inicio y fin */}
            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-text-secondary font-medium">
                <div className="flex items-center gap-1.5">
                <span className="text-primary">▶</span>
                <span>{formatDate(course.fecha_inicio)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                <span className="text-error">■</span>
                <span>{formatDate(course.fecha_fin)}</span>
                </div>
            </div>
        </div>
    )
}