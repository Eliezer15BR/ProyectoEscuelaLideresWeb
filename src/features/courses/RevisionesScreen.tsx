import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tareaService } from './services/tareaService';
import { entregaService } from './services/entregaService';
import { Button } from '../../components/Button';


const SubmissionCard = ({ 
  entrega,
  notaMaxima,
  onCalificar, 
  onAnular 
}: { 
  entrega: any;
  notaMaxima: number;
  onCalificar: (id: number, nota: number, comentario: string) => Promise<void>;
  onAnular: (id: number) => Promise<void>; 
}) => {
  const [nota, setNota] = useState<number | ''>(entrega.calificacion ?? '');
  const [comentario, setComentario] = useState(entrega.comentario_profesor || '');
  const [isSaving, setIsSaving] = useState(false);

  const nombreEstudiante = entrega.usuario?.nombre || `Estudiante #${entrega.id_usuario || 'Desconocido'}`;
  const isGraded = entrega.calificacion !== null && entrega.calificacion !== undefined;

  const handleSave = async () => {
    if (nota === '') {
      return alert('Por favor, ingresa una calificación.');
    }
    const valorNota = Number(nota);
    if (valorNota < 0 || valorNota > notaMaxima) {
      return alert(`Error: La calificación debe ser un número entre 0 y ${notaMaxima}.`);
    }
    setIsSaving(true);
    await onCalificar(entrega.id || entrega.id_entrega, valorNota, comentario);
    setIsSaving(false);
  };

  const handleReset = async () => {
    const confirmacion = window.confirm('¿Anular la calificación? La tarea volverá a estar pendiente.');
    if (!confirmacion) return;
    setIsSaving(true);
    await onAnular(entrega.id || entrega.id_entrega);
    setNota(''); // Limpiamos el input local
    setComentario(''); // Limpiamos el comentario local
    setIsSaving(false);
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all ${isGraded ? 'bg-green-50/20 border-green-200' : 'bg-surface-white border-gray-200 shadow-sm'}`}>
      <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
        <div>
          <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
            👤 {nombreEstudiante}
            {isGraded && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-widest">Calificado</span>}
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Última actualización: {new Date(entrega.updatedAt || entrega.createdAt || new Date()).toLocaleString('es-ES')}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          {(!entrega.archivos || entrega.archivos.length === 0) ? (
            <span className="text-xs text-gray-500 italic px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">Entrega sin archivos</span>
          ) : (
            entrega.archivos.map((archivo: any) => (
              <a key={archivo.id} href={archivo.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                📄 {archivo.nombre_archivo}
              </a>
            ))
          )}
        </div>
      </div>

      <div className="flex gap-4 items-start flex-wrap lg:flex-nowrap pt-4 border-t border-gray-100">
        <div className="w-full lg:w-24">
          <label className="block text-xs font-bold text-text-secondary mb-1">Nota (0-{notaMaxima})</label>
          <input 
            type="number" min="0" max={notaMaxima}
            value={nota} onChange={(e) => setNota(e.target.value ? Number(e.target.value) : '')}
            disabled={isSaving}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-text-primary font-bold text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>
        <div className="flex-1 w-full min-w-[200px]">
          <label className="block text-xs font-bold text-text-secondary mb-1">Comentario / Feedback</label>
          <textarea 
            value={comentario} onChange={(e) => setComentario(e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary resize-none h-10 disabled:opacity-50"
            placeholder="Feedback para el alumno..."
          />
        </div>
        
        {/* ZONA DE BOTONES */}
        <div className="w-full lg:w-auto self-end flex items-center gap-2 mt-2 lg:mt-0">
          {isGraded && (
            <button 
              onClick={handleReset} 
              disabled={isSaving}
              title="Anular calificación"
              className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
            >
              🗑️
            </button>
          )}
          <div className="w-full lg:w-32">
            <Button onClick={handleSave} isLoading={isSaving} fullWidth>
              {isGraded ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PANTALLA PRINCIPAL ---
export const RevisionesScreen = () => {
  const { taskId } = useParams<{ id: string, taskId: string }>();
  
  const [tarea, setTarea] = useState<any>(null);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!taskId) return;
      try {
        const [dataTarea, dataEntregas] = await Promise.all([
          tareaService.getById(taskId),
          entregaService.getAllByTarea(taskId)
        ]);
        setTarea(dataTarea);
        setEntregas(dataEntregas || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [taskId]);

  const handleCalificar = async (entregaId: number, nota: number, comentario: string) => {
    try {
      await entregaService.calificar(entregaId, { calificacion: nota, comentario_profesor: comentario });
      // Refrescar para ver los cambios
      const dataEntregas = await entregaService.getAllByTarea(Number(taskId));
      setEntregas(dataEntregas || []);
    } catch (error) {
      alert('Error al guardar la calificación.');
    }
  };
  const handleAnularCalificacion = async (entregaId: number) => {
    try {
      await entregaService.anularCalificacion(entregaId);
      // Refrescamos la lista global para que el cambio se refleje
      const dataEntregas = await entregaService.getAllByTarea(Number(taskId));
      setEntregas(dataEntregas || []);
    } catch (error) {
      alert('Error al anular la calificación. Revisa tu conexión.');
    }
  };
  if (isLoading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="flex flex-col gap-6 relative animate-fade-in pb-10">

      <div className="bg-surface-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-primary-dark mb-1">Revisiones</h1>
          <p className="text-text-secondary font-medium text-lg">{tarea?.titulo}</p>
        </div>
        <div className="bg-primary/10 px-5 py-3 rounded-xl border border-primary/20">
           <span className="text-primary-dark font-black text-sm uppercase tracking-wider">{entregas.length} Entregas en total</span>
        </div>
      </div>

      <div className="space-y-4">
        {entregas.length === 0 ? (
          <div className="p-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <span className="text-4xl block mb-2">📭</span>
            <p className="text-text-secondary font-medium">Aún no hay entregas para calificar.</p>
          </div>
        ) : (
          entregas.map((entregaItem) => (
            <SubmissionCard 
              key={entregaItem.id || entregaItem.id_entrega} 
              entrega={entregaItem} 
              notaMaxima={tarea?.calificacion || 100}
              onCalificar={handleCalificar}
              onAnular={handleAnularCalificacion}
            />
          ))
        )}
      </div>
    </div>
  );
};