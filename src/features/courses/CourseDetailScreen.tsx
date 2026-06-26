// src/features/courses/CourseDetailScreen.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from './hooks/useCourseStore';
import { Button } from '../../components/Button';
import { CourseFeed } from './CourseFeed';
import { useAuthStore } from '../../store/authStore';
import { PublishContentModal } from './components/PublishContentModal';
import { PanelReporteNotas } from './PanelReporteNotas'; 

export const CourseDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCourse, isLoading, error, fetchCourseById, clearCurrentCourse } = useCourseStore();
  const user = useAuthStore((state) => state.user);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  
  // 2. APROVECHAMOS ESTA VARIABLE PARA PROTEGER EL CONTENIDO
  const canPublish = user?.rol === 'Profesor' || user?.rol === 'Admin';
  
  useEffect(() => {
    if (id) {
      fetchCourseById(Number(id));
    }
    return () => clearCurrentCourse();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !currentCourse) {
    return (
      <div className="flex flex-col items-center gap-4 mt-10">
        <p className="text-error font-bold">{error || 'Curso no encontrado'}</p>
        <Button onClick={() => navigate('/clases')} variant="secondary">Volver a mis clases</Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      
      {/* Cabecera del Curso (Banner Estilo Classroom) */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-secondary rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-end min-h-[260px] relative overflow-hidden mb-6">
        {/* Círculos decorativos de fondo para darle el toque premium */}
        <div className="absolute -top-24 -right-10 w-72 h-72 rounded-full bg-white opacity-10"></div>
        <div className="absolute top-20 right-40 w-32 h-32 rounded-full bg-white opacity-5"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            {currentCourse.nombre}
          </h1>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
               <span className="text-primary font-black text-lg">{currentCourse.profesor.nombre.charAt(0)}</span>
             </div>
             <div>
               <p className="text-white text-lg font-medium drop-shadow-md leading-tight">
                 {currentCourse.profesor.nombre}
               </p>
               {/* Fechas trasladadas al banner de forma sutil */}
               <p className="text-white/80 text-sm font-medium mt-1">
                 {formatDate(currentCourse.fecha_inicio)} – {formatDate(currentCourse.fecha_fin)}
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL (Diseño 2 columnas en escritorio) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- COLUMNA IZQUIERDA (Info y Reportes) --- */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Descripción del Curso */}
          {currentCourse.descripcion && (
            <div className="bg-surface-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-primary-dark mb-2">Acerca de la clase</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {currentCourse.descripcion}
              </p>
            </div>
          )}

          {/* Panel de Reportes (Solo Profesores) */}
          {canPublish && (
            <div className="bg-surface-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-primary-dark mb-3">Reportes del Curso</h3>
              <PanelReporteNotas 
                cursoId={currentCourse.id_curso} 
                cursoNombre={currentCourse.nombre} 
              />
            </div>
          )}

        </div>

        {/* --- COLUMNA DERECHA (Feed Principal) --- */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <span>Actividad de la Clase</span>
            </h2>
            
            {canPublish && (
              <button 
                onClick={() => setIsPublishModalOpen(true)}
                className="bg-primary text-surface-white font-bold px-5 py-2.5 rounded-xl text-sm btn-animated shadow-sm flex items-center gap-2"
              >
                <span className="text-lg leading-none">+</span> Crear Publicación
              </button>
            )}
          </div>

          {/* FEED DE ACTIVIDAD */}
          {currentCourse && <CourseFeed courseId={currentCourse.id_curso} />}
        </div>
      </div>

      {/* MODAL DE PUBLICACIÓN */}
      {currentCourse && (
        <PublishContentModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          courseId={currentCourse.id_curso}
        />
      )}
    </div>
  );
};