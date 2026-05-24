import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface Material {
  id_material?: number;
  id?: number;
  titulo: string;
  descripcion: string;
  fecha_publicacion?: string;
}

interface MaterialCardProps {
  material: Material;
  courseId: number; // Necesitamos el ID del curso para navegar
}

export const MaterialCard = ({ material, courseId }: MaterialCardProps) => {
  const navigate = useNavigate();

  const handleOpenMaterial = () => {
    const materialId = material.id_material || material.id;
    navigate(`/clases/${courseId}/material/${materialId}`);
  };

  const formattedDate = material.fecha_publicacion 
    ? new Date(material.fecha_publicacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
    : 'Reciente';

  return (
    <div 
      onClick={handleOpenMaterial}
      className="bg-surface-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 animate-fade-in-up group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-400 opacity-80 group-hover:bg-blue-500 transition-colors"></div>

      <div className="flex items-start gap-4 pl-2">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Material</span>
            <span className="text-xs text-text-secondary">{formattedDate}</span>
          </div>
          <h3 className="text-lg font-bold text-text-primary group-hover:text-blue-600 transition-colors">{material.titulo}</h3>
          <p className="text-sm text-text-secondary mt-2 line-clamp-2">{material.descripcion}</p>
        </div>
      </div>
    </div>
  );
};