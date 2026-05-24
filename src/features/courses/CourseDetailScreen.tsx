// src/features/courses/CourseDetailScreen.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from './hooks/useCourseStore';
import { Button } from '../../components/Button';
import { CourseFeed } from './CourseFeed';
import { useAuthStore } from '../../store/authStore';
import { PublishContentModal } from './components/PublishContentModal';

export const CourseDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCourse, isLoading, error, fetchCourseById, clearCurrentCourse } = useCourseStore();
  const user = useAuthStore((state) => state.user);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const canPublish = user?.rol === 'Profesor' || user?.rol === 'Admin';
  useEffect(() => {
    if (id) {
      fetchCourseById(Number(id));
    }
    // Cuando el usuario salga de la pantalla, limpiamos la memoria
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

  // Función para formatear fechas limpio
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Botón de retroceso sutil */}
      <div>
        <button 
          onClick={() => navigate('/clases')}
          className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 font-medium mb-4"
        >
          <span>←</span> Volver a mis clases
        </button>
      </div>

      {/* Cabecera del Curso */}
      <div className="bg-surface-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-primary-dark tracking-tight mb-2">
              {currentCourse.nombre}
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              {currentCourse.descripcion}
            </p>
          </div>
          
          <div className="bg-background-light px-4 py-2 rounded-xl text-center min-w-[100px]">
            <span className="block text-2xl font-bold text-primary-dark">{currentCourse.cupos}</span>
            <span className="text-xs text-primary-dark uppercase tracking-wider font-semibold">Cupos</span>
          </div>
        </div>

        <div className="mt-8 flex gap-8 border-t border-gray-50 pt-6">
          <div>
            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Fecha de Inicio</p>
            <p className="text-text-primary font-medium">{formatDate(currentCourse.fecha_inicio)}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Fecha de Fin</p>
            <p className="text-text-primary font-medium">{formatDate(currentCourse.fecha_fin)}</p>
          </div>
        </div>
      </div>

      {/* Aquí abajo irá el contenido dinámico (Tareas, Alumnos, etc.) */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
          <span>⚡ Actividad del Curso</span>
        </h2>
        {canPublish && (
            <button 
              onClick={() => setIsPublishModalOpen(true)}
              className="bg-primary text-surface-white font-bold mb-2 px-4 py-2 rounded-xl text-sm btn-animated shadow-sm flex items-center gap-2"
            >
              <span>+</span> Crear Publicación
            </button>
          )}
        {/* 2. INYECTAMOS EL COMPONENTE PASÁNDOLE EL ID */}
        {currentCourse && <CourseFeed courseId={currentCourse.id_curso} />}
      </div>
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