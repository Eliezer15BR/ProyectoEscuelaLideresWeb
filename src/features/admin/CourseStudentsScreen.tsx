import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EnrollStudentModal } from './components/EnrollStudentModal';
import { useAdminStore } from './hooks/useAdminStore';

export const CourseStudentsScreen = () => {
  const { id } = useParams<{ id: string }>();

  
  const { 
    currentCourseStudents, 
    isLoadingCourseStudents, 
    fetchCourseStudents, 
    unenrollStudent,
    clearCurrentCourseStudents 
  } = useAdminStore();

  const [busqueda, setBusqueda] = useState('');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseStudents(Number(id));
    }
    // Cleanup: Limpiamos la lista al salir de la pantalla
    return () => clearCurrentCourseStudents();
  }, [id, fetchCourseStudents, clearCurrentCourseStudents]);

  // 4. Manejadores de Eventos
  const handleDesinscribir = async (idInscripcion: number, nombreEstudiante: string) => {
    const confirmar = window.confirm(`¿Estás seguro de desinscribir a ${nombreEstudiante}?`);
    if (!confirmar) return;

    const exito = await unenrollStudent(idInscripcion);
    if (!exito) {
      alert('Hubo un error al intentar desinscribir al alumno.');
    }
  };

  // 5. Filtro dinámico (Buscador)
  const alumnosFiltrados = currentCourseStudents.filter(alumno => {
    const nombre = alumno.usuario?.nombre || '';
    return nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">

      {/* --- CABECERA Y CONTROLES --- */}
      <div className="bg-surface-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Alumnos Inscritos</h1>
          <p className="text-sm text-text-secondary mt-1">
            Total: {currentCourseStudents.length} estudiante(s) en este curso
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full md:w-64 transition-all"
          />
          
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="bg-primary text-surface-white font-bold px-5 py-2.5 rounded-xl text-sm btn-animated shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-lg leading-none">+</span> Inscribir
          </button>
        </div>
      </div>

      {/* --- LISTA DE ALUMNOS --- */}
      <div className="bg-surface-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {isLoadingCourseStudents ? (
           <div className="p-12 flex justify-center">
             <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
           </div>
        ) : alumnosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <span className="text-4xl block mb-3">📭</span>
            <p>{busqueda ? 'No se encontraron alumnos con ese nombre.' : 'No hay alumnos inscritos en este curso todavía.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Estudiante</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Correo</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alumnosFiltrados.map((inscripcion) => (
                  <tr key={inscripcion.id_inscripcion} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {inscripcion.usuario?.nombre?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-text-primary text-sm">
                          {inscripcion.usuario?.nombre || 'Usuario Desconocido'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-secondary">
                      {inscripcion.usuario?.correo || 'Sin correo'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDesinscribir(inscripcion.id_inscripcion, inscripcion.usuario?.nombre)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors border border-transparent hover:border-red-100"
                      >
                        Desinscribir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL PARA INSCRIBIR --- */}
      {id && (
        <EnrollStudentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          courseId={Number(id)}
          onSuccess={() => {
            setIsEnrollModalOpen(false);
            // Cuando el modal indique éxito, volvemos a pedir los inscritos para actualizar la tabla
            fetchCourseStudents(Number(id)); 
          }}
        />
      )}

    </div>
  );
};