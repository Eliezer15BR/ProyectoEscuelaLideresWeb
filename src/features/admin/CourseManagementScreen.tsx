import { useEffect, useState } from 'react';
import { useAdminStore } from './hooks/useAdminStore';
import { CreateCourseModal } from './components/CreateCourseModal';
import { EstadisticasCursos } from './EstadisticasCursos';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../services/courseService';
import { EditCourseModal } from './components/EditCourseModal';

export const CourseManagementScreen = () => {
  const { courses, isLoadingCourses, fetchAllCourses } = useAdminStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Nuevo estado para el buscador
  const [busqueda, setBusqueda] = useState(''); 
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  const triggerToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Lógica de filtrado en tiempo real
  const cursosFiltrados = courses?.filter(course => 
    course.nombre.toLowerCase().includes(busqueda.toLowerCase())
  ) || [];

  if (isLoadingCourses) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative animate-fade-in">
      
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-bold animate-fade-in-up">
          {successMessage}
        </div>
      )}

      {/* --- CABECERA Y BUSCADOR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Gestión de Cursos</h1>
          <p className="text-sm text-text-secondary mt-1">Administración e inscripciones</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar curso por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2.5 bg-surface-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all"
          />
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-surface-white font-bold px-5 py-2.5 rounded-xl text-sm btn-animated shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-lg leading-none">+</span> Crear Curso
          </button>
        </div>
      </div>

      <EstadisticasCursos/>
      
      {/* --- LISTA DE CURSOS --- */}
      <div className="bg-surface-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {cursosFiltrados.length === 0 ? (
          <div className="p-10 text-center text-text-secondary">
            <span className="text-4xl block mb-3">{busqueda ? '📭' : '📁'}</span>
            <p>{busqueda ? 'No se encontraron cursos con ese nombre.' : 'No hay cursos registrados en el sistema.'}</p>
          </div>
        ) : (
          cursosFiltrados.map((course) => (
            <div 
              key={course.id_curso} 
              className="flex items-center justify-between p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors flex-wrap gap-4"
            >
              <div className="min-w-0">
                <h3 className="font-bold text-text-primary text-lg truncate">{course.nombre}</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  <span className="font-medium text-primary-dark">{course.cupos}</span> cupos
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCourseToEdit(course)}
                  className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                  title="Editar curso"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>

                <button 
                  onClick={() => navigate(`/admin/cursos/${course.id_curso}/alumnos`)}
                  className="bg-primary/10 text-primary hover:bg-primary hover:text-surface-white font-bold px-4 py-2 rounded-xl text-sm transition-all btn-animated whitespace-nowrap"
                >
                  Gestionar Alumnos
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- MODALES --- */}
      <CreateCourseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => triggerToast('¡Curso creado exitosamente!')}
      />
      {courseToEdit && (
        <EditCourseModal
          isOpen={!!courseToEdit}
          onClose={() => setCourseToEdit(null)}
          course={courseToEdit}
          onSuccess={() => triggerToast('¡Curso actualizado correctamente!')}
        />
      )}
    </div>
  );
};