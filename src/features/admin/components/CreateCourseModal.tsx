import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../hooks/useAdminStore';
import { InputField } from '../../../components/InputField';
import { Button } from '../../../components/Button';
import { SelectField } from '../../../components/SelectField';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCourseModal = ({ isOpen, onClose, onSuccess }: CreateCourseModalProps) => {
  // Extraemos las nuevas variables de profesores
  const { createCourse, adminError, clearAdminError, professors, fetchProfessors, isLoadingProfessors } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cupos, setCupos] = useState(20);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idProfesor, setIdProfesor] = useState<number | ''>(''); // Ahora empieza vacío para forzar a que elija uno

  useEffect(() => {
    if (isOpen) {
      clearAdminError();
      // Cuando se abre el modal, traemos la lista de profesores
      fetchProfessors();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idProfesor === '') return; // Validación extra
    if (fechaInicio && fechaFin) {
      if (fechaFin <= fechaInicio) {
        alert("La fecha de finalización debe ser estrictamente posterior a la fecha de inicio.");
        return;
      }
    }
    setIsLoading(true);

    const success = await createCourse({
      nombre,
      descripcion,
      cupos: Number(cupos),
      fecha_inicio: new Date(fechaInicio).toISOString(),
      fecha_fin: new Date(fechaFin).toISOString(),
      id_profesor: Number(idProfesor),
    }as any);

    setIsLoading(false);
    if (success) {
      onSuccess();
      onClose();
      setNombre('');
      setDescripcion('');
      setCupos(20);
      setFechaInicio('');
      setFechaFin('');
      setIdProfesor('');
    }
  };
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  const hoyStr = hoy.toISOString().split('T')[0];

  // 2. El mínimo para Fecha Fin será "hoy", PERO si la fecha de inicio es en el futuro, 
  // el mínimo será esa fecha de inicio para que no elijan una fecha anterior a la de inicio.
  const minFechaFin = fechaInicio && fechaInicio > hoyStr ? fechaInicio : hoyStr;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-white w-full max-w-lg rounded-2xl p-6 shadow-xl flex flex-col max-h-[90vh] animate-scale-up">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-primary-dark">Crear Nuevo Curso</h3>
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
            
            {/* --- EL NUEVO SELECT DE PROFESORES --- */}
            <div>
              <SelectField
                label="Profesor Asignado"
                placeholder={isLoadingProfessors ? "Cargando..." : "Selecciona un profesor"}
                value={idProfesor}
                onChange={(val) => setIdProfesor(val as number)}
                disabled={isLoading || isLoadingProfessors}
                // Transformamos la lista de profesores de tu backend al formato que lee nuestro componente
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
                Guardar Curso
              </Button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};