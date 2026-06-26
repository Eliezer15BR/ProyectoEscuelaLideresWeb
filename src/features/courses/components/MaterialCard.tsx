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

  return (
    <div 
      onClick={handleOpenMaterial}
      className="bg-surface-white border border-gray-100 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-fade-in-up group cursor-pointer flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary-dark flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2zm0 4h16v2H4v-2z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-primary-dark group-hover:text-primary transition-colors">{material.titulo}</h3>
        <p className="text-sm text-text-secondary mt-0.5 line-clamp-1">{material.descripcion}</p>
      </div>
      
      <div className="text-gray-300 group-hover:text-primary/50 transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};