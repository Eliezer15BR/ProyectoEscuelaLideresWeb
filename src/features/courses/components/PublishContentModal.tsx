import React, { useState, useEffect } from 'react';
import { useFeedStore } from '../hooks/useFeedStore';
import { InputField } from '../../../components/InputField';
import { Button } from '../../../components/Button';
import { SelectField } from '../../../components/SelectField';

interface PublishContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
}

export const PublishContentModal = ({ isOpen, onClose, courseId }: PublishContentModalProps) => {
  const { publishContent, publishError, clearPublishError } = useFeedStore();
  const [isLoading, setIsLoading] = useState(false);

  const [tipo, setTipo] = useState<'tarea' | 'material'>('material');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState(''); 
  const [calificacion, setCalificacion] = useState(100);
  useEffect(() => {
    if (!isOpen) clearPublishError();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Payload súper limpio, sin archivos raros
    const payload = tipo === 'tarea' 
      ? { titulo, descripcion, fecha_entrega: new Date(fechaEntrega).toISOString(), calificacion: Number(calificacion) }
      : { titulo, descripcion };

    const success = await publishContent(courseId, tipo, payload);

    setIsLoading(false);
    if (success) {
      onClose();
      setTitulo('');
      setDescripcion('');
      setFechaEntrega('');
      setTipo('material');
      setCalificacion(100);
    }
  };
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const fechaMinima = now.toISOString().slice(0,16);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-white w-full max-w-lg rounded-2xl p-6 shadow-xl flex flex-col max-h-[90vh] animate-scale-up">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-primary-dark">Publicar en el Curso</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl p-1">✕</button>
        </div>

        {publishError && (
          <div className="p-3 mb-4 bg-error/10 border border-error/20 text-error text-sm font-medium rounded-lg">
            {publishError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4">
          
          <SelectField
            label="Tipo de Publicación"
            value={tipo}
            onChange={(val) => setTipo(val as 'tarea' | 'material')}
            disabled={isLoading}
            options={[
              { value: 'material', label: '📚 Material de Estudio (Aviso/Archivo)' },
              { value: 'tarea', label: '📝 Tarea' }
            ]}
          />

          <InputField
            label="Título"
            type="text"
            placeholder="Ej: Lectura obligatoria"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            disabled={isLoading}
          />

          <div>
            <label className="block text-sm font-bold text-text-primary mb-1.5">Descripción o Instrucciones</label>
            <textarea
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none h-24"
              placeholder="Escribe los detalles aquí..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="animate-fade-in">
            {tipo === 'tarea' && (
              <InputField
                label="Fecha límite de entrega"
                type="datetime-local" 
                min={fechaMinima}
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                required={tipo === 'tarea'}
                disabled={isLoading}
              />
            )}
          </div>
            {
              (tipo==='tarea')?(
                <InputField
                  label="Calificación Máxima"
                  type="number"
                  min={1}
                  max={100}
                  value={calificacion.toString()}
                  onChange={(e) => setCalificacion(Number(e.target.value))}
                  required={tipo === 'tarea'}
                  disabled={isLoading}
                />
              ):<></>
            }
            
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
                Publicar
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};