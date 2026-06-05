import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../hooks/useAdminStore';
import { InputField } from '../../../components/InputField';
import { Button } from '../../../components/Button';
import { SelectField } from '../../../components/SelectField';
import type { Course } from '../../services/courseService';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onSuccess: () => void;
}

export const EditCourseModal = ({ isOpen, onClose, course, onSuccess }: EditCourseModalProps) => {
  const { updateCourse, adminError, clearAdminError, professors, fetchProfessors, isLoadingProfessors } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);
  // Función auxiliar para formatear la fecha del backend (ISO) a 'YYYY-MM-DD' para el input type="date"
  const formatearFecha = (fechaString?: string) => {
    if (!fechaString) return '';
    return fechaString.split('T')[0];
  };

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cupos, setCupos] = useState(20);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idProfesor, setIdProfesor] = useState<number | ''>('');

  useEffect(() => {
    if (isOpen) {
      clearAdminError();
      fetchProfessors();
      
      // Precargamos los datos del curso actual en los estados
      setNombre(course.nombre || '');
      setDescripcion(course.descripcion || '');
      setCupos(course.cupos || 20);
      setFechaInicio(formatearFecha(course.fecha_inicio));
      setFechaFin(formatearFecha(course.fecha_fin));
      setIdProfesor(course.profesor.id_usuario || '');
    }
  }, [isOpen, course, clearAdminError, fetchProfessors]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idProfesor === '') return; 
    
    if (fechaInicio && fechaFin) {
      if (fechaFin <= fechaInicio) {
        alert("La fecha de finalización debe ser estrictamente posterior a la fecha de inicio.");
        return;
      }
    }
    
    setIsLoading(true);

    const success = await updateCourse(course.id_curso, {
      nombre,
      descripcion,
      cupos: Number(cupos),
      fecha_inicio: new Date(fechaInicio).toISOString(),
      fecha_fin: new Date(fechaFin).toISOString(),
      id_profesor: Number(idProfesor),
    });

    setIsLoading(false);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  const hoyStr = hoy.toISOString().split('T')[0];

  const minFechaFin = fechaInicio && fechaInicio > hoyStr ? fechaInicio : hoyStr;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-white w-full max-w-lg rounded-2xl p-6 shadow-xl flex flex-col max-h-[90vh] animate-scale-up">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-primary-dark">Editar Curso</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl p-1">✕</button>
        </div>

        {adminError && (
          <div className="p-3 mb-4 bg-error/10 border border-error/20 text-error text-sm font-medium rounded-lg">
            {adminError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4">
          <InputField
            label="Nombre del Curso"
            type="text"
            placeholder="Ej: Programación Web con NestJS"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={isLoading}
          />

          <div>
            <label className="block text-sm font-bold text-text-primary mb-1.5">Descripción</label>
            <textarea
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none h-24"
              placeholder="Escribe los objetivos y detalles del curso..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Cupos Disponibles"
              type="number"
              min={1}
              value={cupos.toString()}
              onChange={(e) => setCupos(Number(e.target.value))}
              required
              disabled={isLoading}
            />
            
            <div>
              <SelectField
                label="Profesor Asignado"
                placeholder={isLoadingProfessors ? "Cargando..." : "Selecciona un profesor"}
                value={idProfesor}
                onChange={(val) => setIdProfesor(val as number)}
                disabled={isLoading || isLoadingProfessors}
                options={professors.map(prof => ({
                    value: prof.id_usuario,
                    label: prof.nombre
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Fecha de Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              disabled={isLoading}
            />
            <InputField
              label="Fecha de Finalización"
              type="date"
              min={minFechaFin}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <div className="w-36">
              <Button type="submit" isLoading={isLoading} fullWidth>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};