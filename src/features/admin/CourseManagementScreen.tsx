import React, { useEffect, useState } from 'react';
import { useAdminStore } from './hooks/useAdminStore';
import { EnrollStudentModal } from './components/EnrollStudentModal';
import { CreateCourseModal } from './components/CreateCourseModal';

export const CourseManagementScreen = () => {
  // 1. Traemos el estado y las acciones de nuestro Store administrativo
  const { courses, isLoadingCourses, fetchAllCourses } = useAdminStore();
  
  // 2. Estados locales para controlar qué modal está abierto y los mensajes de éxito
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null); // Para Inscribir
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Para Crear Curso
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 3. Al entrar a la pantalla, le pedimos al backend la lista de cursos
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // 4. Función auxiliar para mostrar notificaciones temporales (3 segundos)
  const triggerToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // 5. Pantalla de carga
  if (isLoadingCourses) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative animate-fade-in">
      
      {/* --- ALERTA FLOTANTE (Toast) --- */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-bold animate-fade-in-up">
          {successMessage}
        </div>
      )}

      {/* --- CABECERA --- */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Gestión de Cursos</h1>
          <p className="text-sm text-text-secondary mt-1">Administración e inscripciones</p>
        </div>
        
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary text-surface-white font-bold px-5 py-2.5 rounded-xl text-sm btn-animated shadow-sm flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Crear Curso
        </button>
      </div>

      {/* --- LISTA DE CURSOS --- */}
      <div className="bg-surface-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {(!courses || courses.length === 0) ? (
          <div className="p-10 text-center text-text-secondary">
            <span className="text-4xl block mb-3">📁</span>
            <p>No hay cursos registrados en el sistema.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div 
              key={course.id_curso} 
              className="flex items-center justify-between p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors flex-wrap gap-4"
            >
              <div className="min-w-0">
                <h3 className="font-bold text-text-primary text-lg truncate">{course.nombre}</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  <span className="font-medium text-primary-dark">{course.cupos}</span> cupos disponibles
                </p>
              </div>
              
              <button 
                onClick={() => setSelectedCourseId(course.id_curso)}
                className="bg-primary/10 text-primary hover:bg-primary hover:text-surface-white font-bold px-4 py-2 rounded-xl text-sm transition-all btn-animated whitespace-nowrap"
              >
                + Inscribir Estudiante
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- MODALES --- */}
      
      {/* Modal para inscribir estudiantes a un curso específico */}
      {selectedCourseId && (
        <EnrollStudentModal
          isOpen={!!selectedCourseId}
          onClose={() => setSelectedCourseId(null)}
          courseId={selectedCourseId}
          onSuccess={() => triggerToast('¡Estudiante inscrito correctamente!')}
        />
      )}

      {/* Modal para crear un curso nuevo */}
      <CreateCourseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => triggerToast('¡Curso creado exitosamente!')}
      />

    </div>
  );
};