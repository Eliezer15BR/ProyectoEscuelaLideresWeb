import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../hooks/useAdminStore';
import { InputField } from '../../../components/InputField';

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  onSuccess: () => void; // Para avisarle a la pantalla principal que recargue el feed si es necesario
}

export const EnrollStudentModal = ({ isOpen, onClose, courseId, onSuccess }: EnrollStudentModalProps) => {
  const { students, isLoadingStudents, adminError, fetchStudents, enrollStudentInCourse, clearAdminError } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Cargamos los estudiantes únicamente cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
    return () => clearAdminError();
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtrado reactivo en el cliente (rápido y eficiente)
  const filteredStudents = students.filter(student => 
    student.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.correo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = async (studentId: number) => {
    const success = await enrollStudentInCourse(courseId, studentId);
    if (success) {
      onSuccess(); // Disparamos la alerta de éxito en la pantalla principal
      onClose();   // Cerramos el modal automáticamente
    }
    // Si es false, el modal se queda abierto y el store dibuja el error arriba automáticamente
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      
      {/* Contenedor del Modal */}
      <div className="bg-surface-white w-full max-w-lg rounded-2xl p-6 shadow-xl flex flex-col max-h-[85vh] animate-scale-up">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-primary-dark">Inscribir Estudiante</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl font-medium p-1">
            ✕
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-4">
          <InputField
            label=""
            type="text"
            placeholder="Buscar estudiante por nombre o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoadingStudents}
          />
        </div>

        {/* Mensaje de Error Interno */}
        {adminError && (
          <div className="p-3 mb-4 bg-error/10 border border-error/20 text-error text-sm font-medium rounded-lg">
            {adminError}
          </div>
        )}

        {/* Lista de Estudiantes (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-[250px]">
          {isLoadingStudents ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-text-secondary text-sm">
              No se encontraron estudiantes disponibles.
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div 
                key={student.id_usuario}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-bold text-text-primary text-sm truncate">{student.nombre}</p>
                  <p className="text-text-secondary text-xs truncate">{student.correo}</p>
                </div>

                <button
                  onClick={() => handleEnroll(student.id_usuario)}
                  className="bg-primary/10 text-primary hover:bg-primary hover:text-surface-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all btn-animated"
                >
                  Inscribir
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};