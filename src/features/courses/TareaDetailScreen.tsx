import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { tareaService } from './services/tareaService';
import { entregaService } from './services/entregaService';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { Modal } from '../../components/Modal';

export const TareaDetailScreen = () => {
  const { id: courseId, taskId } = useParams<{ id: string, taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [tarea, setTarea] = useState<any>(null);
  const [archivosDelServidor, setArchivosDelServidor] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [archivosPendientes, setArchivosPendientes] = useState<File[]>([]);
  const [isProfUploading, setIsProfUploading] = useState(false);
  const [profUploadProgress, setProfUploadProgress] = useState<number>(0);

  // Estados de entrega del estudiante
  const [entrega, setEntrega] = useState<any>(null);
  const [archivosEntrega, setArchivosEntrega] = useState<any[]>([]);
  const [archivosSubirAlumno, setArchivosSubirAlumno] = useState<File[]>([]);
  const [isSubiendoAlumno, setIsSubiendoAlumno] = useState(false);


  // Estados de edición de la tarea (Profesor/Admin)
  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editFechaEntrega, setEditFechaEntrega] = useState('');
  const [editCalificacion, setEditCalificacion] = useState<number | ''>(100);
  const [isSaving, setIsSaving] = useState(false);
  const canManage = user?.rol === 'Admin' || user?.rol === 'Profesor';
  const isEstudiante = user?.rol === 'Estudiante';

  // 💡 LA SOLUCIÓN: Validamos si realmente hay una entrega activa inspeccionando sus IDs reales
  const tieneEntregaActiva = !!(entrega?.id || entrega?.id_entrega);
    const isCalificada = entrega?.calificacion !== null && entrega?.calificacion !== undefined;
  const formatForInput = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const loadTarea = async () => {
    if (!taskId) return;
    try {
      const [dataTarea, dataArchivosProfe] = await Promise.all([
        tareaService.getById(taskId),
        tareaService.getFiles(taskId).catch(() => [])
      ]);
      
      setTarea(dataTarea);
      setArchivosDelServidor(dataArchivosProfe);
      setEditTitulo(dataTarea.titulo);
      setEditDescripcion(dataTarea.descripcion);
      setEditFechaEntrega(formatForInput(dataTarea.fecha_entrega));
      setEditCalificacion(dataTarea.calificacion ?? 100);
      if (isEstudiante) {
        try {
          const res = await entregaService.getByTarea(taskId);
          
          if (!res) {
            setEntrega(null);
            setArchivosEntrega([]);
            return;
          }

          const entregaLimpia = res.entrega ? res.entrega : res;
          
          // 💡 Si el servidor responde un objeto fantasma sin IDs, lo forzamos a null
          if (!entregaLimpia.id && !entregaLimpia.id_entrega) {
            setEntrega(null);
            setArchivosEntrega([]);
          } else {
            setEntrega(entregaLimpia);
            setArchivosEntrega(entregaLimpia.archivos || []); 
          }
        } catch (e) {
          setEntrega(null);
          setArchivosEntrega([]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTarea();
  }, [taskId]);

  const handleUpdate = async () => {
    if (!editTitulo.trim() || !editDescripcion.trim() || !taskId) return;
    setIsSaving(true);
    try {
      const fechaISO = editFechaEntrega ? new Date(editFechaEntrega).toISOString() : undefined;
      await tareaService.update(taskId, { 
        titulo: editTitulo, 
        descripcion: editDescripcion,
        fecha_entrega: fechaISO,
        calificacion: Number(editCalificacion)
      });
      await loadTarea();
      setIsEditing(false);
    } catch (error) {
      alert('Hubo un error al actualizar la tarea.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!taskId) return;
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta tarea?');
    if (!confirmacion) return;
    try {
      await tareaService.delete(taskId);
      navigate(`/clases/${courseId}`);
    } catch (error) {
      alert('No se pudo eliminar la tarea.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const nuevosArchivos = Array.from(e.target.files);
      setArchivosPendientes((prev) => [...prev, ...nuevosArchivos]);
    }
    e.target.value = ''; 
  };

  const removePendingFile = (indexToRemove: number) => {
    setArchivosPendientes((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUploadFiles = async () => {
    if (archivosPendientes.length === 0 || !taskId) return;
    setIsProfUploading(true);
    const controller = new AbortController();
    setProfUploadProgress(0);
    try {
      await tareaService.uploadFiles(Number(taskId), archivosPendientes, controller.signal, (pct) => setProfUploadProgress(pct));
      await loadTarea();
      setArchivosPendientes([]);
    } catch (error: any) {
      // Treat abort as cancel; show transient message
      if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError' || error?.name === 'AbortError') {
        await loadTarea();
      } else {
        console.error(error);
        alert('Error al subir los archivos.');
      }
    } finally {
      setIsProfUploading(false);
      setProfUploadProgress(0);
    }
  };

  const handleDeleteServerFile = async (fileId: number) => {
    const confirmacion = window.confirm('¿Eliminar este archivo de instrucciones?');
    if (!confirmacion) return;
    try {
      await tareaService.deleteFile(fileId);
      await loadTarea();
    } catch (error) {
      alert('No se pudo eliminar el archivo.');
    }
  };

  // --- LÓGICA DEL ESTUDIANTE ---
  const handleSelectArchivosAlumno = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const nuevosArchivos = Array.from(e.target.files);
      setArchivosSubirAlumno((prev) => [...prev, ...nuevosArchivos]);
    }
    e.target.value = '';
  };

  const handleSubmitEntrega = async () => {
    if (!taskId) return;
    setIsSubiendoAlumno(true);
    const controller = new AbortController();
    try {
      let currentEntregaId = entrega?.id || entrega?.id_entrega;

      if (!currentEntregaId) {
        const resNueva = await entregaService.crearEntrega(Number(taskId));
        const nuevaEntregaLimpia = resNueva.entrega ? resNueva.entrega : resNueva;
        currentEntregaId = nuevaEntregaLimpia.id || nuevaEntregaLimpia.id_entrega;
      }

      if (archivosSubirAlumno.length > 0 && currentEntregaId) {
        await entregaService.subirArchivos(currentEntregaId, archivosSubirAlumno, controller.signal, () => {});
        setArchivosSubirAlumno([]);
      }

      await loadTarea(); 
    } catch (error) {
      // cancellation handling
      if ((error as any)?.code === 'ERR_CANCELED' || (error as any)?.name === 'CanceledError' || (error as any)?.name === 'AbortError') {
        await loadTarea();
      } else {
        console.error(error);
        alert('Error al realizar la entrega.');
      } 
    } finally {
      setIsSubiendoAlumno(false);
    }
  };

  const handleCancelarEntrega = async () => {
    const entregaId = entrega?.id || entrega?.id_entrega;
    if (!entregaId) return;

    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas anular esta entrega? Se eliminarán todos los archivos adjuntos.'
    );
    if (!confirmacion) return;

    setIsSubiendoAlumno(true);
    try {
      await entregaService.eliminarEntrega(Number(entregaId));
      
      // Reseteamos inmediatamente los estados locales
      setEntrega(null);
      setArchivosEntrega([]);
      setArchivosSubirAlumno([]);
      
      await loadTarea();
    } catch (error) {
      console.error(error);
      alert('No se pudo anular la entrega.');
    } finally {
      setIsSubiendoAlumno(false);
    }
  };

  const handleEliminarArchivoAlumno = async (fileId: number) => {
    if (!window.confirm('¿Quieres quitar este archivo de tu entrega?')) return;
    try {
      await entregaService.eliminarArchivo(fileId);
      await loadTarea();
    } catch (error) {
      alert('No se pudo quitar el archivo.');
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>;
  if (!tarea) return <div className="text-center p-12 text-text-secondary">Tarea no encontrada.</div>;

  const isOverdue = tarea.fecha_entrega ? new Date(tarea.fecha_entrega) < new Date() : false;
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const fechaMinima = now.toISOString().slice(0,16);
  return (
    <div className="flex flex-col gap-6 relative animate-fade-in pb-10">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COLUMNA IZQUIERDA: Detalles de la Tarea (Ocupa 2/3 en escritorio) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
      <div className="mb-2 flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-full bg-primary/10 text-primary-dark flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            <h1 className="text-3xl font-black text-primary-dark leading-tight">{tarea.titulo}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium mt-1">
            <span className="text-text-secondary">
              {tarea.nombre_profesor || 'Profesor'} • {new Date(tarea.fecha_creacion || Date.now()).toLocaleDateString()}
            </span>
            {tarea.fecha_entrega && (
              <span className={`font-bold ${isOverdue ? 'text-error' : 'text-primary/70'}`}>
                Límite: {new Date(tarea.fecha_entrega).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
             {canManage && (
              <div className="flex items-center gap-2 mr-2">
                <button onClick={() => setIsEditing(true)} className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-full transition-colors" title="Editar">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={handleDelete} className="p-2 text-text-secondary hover:text-error hover:bg-error/5 rounded-full transition-colors" title="Eliminar">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            )}
            <div className="text-right">
              <div className="text-lg font-black text-primary-dark">{tarea.calificacion || 100} puntos</div>
              {isEstudiante && (
                <div className={`text-sm font-bold ${isCalificada ? 'text-orange-600' : (tieneEntregaActiva ? 'text-green-500' : 'text-gray-400')}`}>
                   {isCalificada ? 'Calificado' : (tieneEntregaActiva ? 'Entregado' : 'Asignado')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-200 mt-2" />

      {/* MODAL DE EDICIÓN PARA PROFESORES */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Editar Tarea">
        <div className="space-y-4">
          <InputField label="Título de la Tarea" type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} disabled={isSaving} />
          <div className="grid grid-cols-1 gap-4">
            <InputField label="Fecha Límite de Entrega" type="datetime-local" min={fechaMinima} value={editFechaEntrega} onChange={(e) => setEditFechaEntrega(e.target.value)} disabled={isSaving} required />
            <InputField label="Calificación Máxima" type="number" min={1} max={100} value={editCalificacion.toString()} onChange={(e) => setEditCalificacion(e.target.value ? Number(e.target.value) : '')} disabled={isSaving} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-primary mb-1.5">Instrucciones</label>
            <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none h-32" value={editDescripcion} onChange={(e) => setEditDescripcion(e.target.value)} disabled={isSaving} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setIsEditing(false); setEditTitulo(tarea.titulo); setEditDescripcion(tarea.descripcion); setEditFechaEntrega(formatForInput(tarea.fecha_entrega)); setEditCalificacion(tarea.calificacion ?? 100); }} className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary" disabled={isSaving}>Cancelar</button>
            <div className="w-32"><Button onClick={handleUpdate} isLoading={isSaving}>Guardar</Button></div>
          </div>
        </div>
      </Modal>

      <div className="pt-2">
        <p className="text-text-primary text-base leading-relaxed whitespace-pre-wrap">{tarea.descripcion}</p>
      </div>

      {/* ARCHIVOS DE INSTRUCCIONES */}
      <div>
        <h2 className="text-xl font-bold text-primary-dark mb-4">Archivos adjuntos</h2>
        
        <div className="bg-surface-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          {archivosDelServidor.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-4">No hay archivos adjuntos.</p>
          ) : (
            <div className="space-y-2">
              {archivosDelServidor.map((archivo) => (
                <div key={archivo.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4 min-w-0 pr-4">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary-dark flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                      </svg>
                    </span>
                    <span className="font-bold text-sm text-text-primary truncate group-hover:text-primary transition-colors">{archivo.nombre_archivo || 'Documento adjunto'}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={archivo.url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-transparent text-primary-dark hover:bg-primary/10 rounded-xl transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                    {canManage && (
                      <button onClick={() => handleDeleteServerFile(archivo.id)} className="w-10 h-10 flex items-center justify-center bg-transparent text-error hover:bg-error/10 rounded-xl transition-colors" title="Eliminar archivo">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* SE MOVIÓ LA GESTIÓN AL PANEL DERECHO */}
      </div>
      </div>

      {/* COLUMNA DERECHA: Tu trabajo o Panel Profesor (Ocupa 1/3 en escritorio) */}
      <div className="lg:col-span-1">
      
      {/* --- PANEL DEL PROFESOR --- */}
      {canManage && (
        <div className="bg-surface-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sticky top-6">
          <h2 className="text-lg font-bold text-primary-dark mb-4 border-b border-gray-100 pb-2">Gestión de Tarea</h2>
          
          <Button 
            onClick={() => navigate(`/clases/${courseId}/tarea/${taskId}/revisiones`)} 
            fullWidth
          >
            Ver Entregas y Calificar
          </Button>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-text-primary mb-3">Adjuntar instrucciones</h3>
            <input 
              type="file" 
              multiple 
              onChange={handleFileSelect} 
              className="block w-full text-xs text-text-secondary file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary hover:file:text-white cursor-pointer mb-3" 
              disabled={isProfUploading} 
            />
            {archivosPendientes.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3">
                <ul className="space-y-1 mb-3">
                  {archivosPendientes.map((file, idx) => (
                    <li key={idx} className="flex justify-between items-center text-xs">
                      <span className="truncate pr-2">{file.name}</span>
                      <button onClick={() => removePendingFile(idx)} className="text-error font-bold">✕</button>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleUploadFiles} isLoading={isProfUploading} fullWidth>Subir archivos</Button>
                {isProfUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-1.5" style={{ width: `${profUploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* --- SECCIÓN: MI TRABAJO (SOLO ESTUDIANTES) --- */}
      {isEstudiante && (
        <div className="mt-4">
          <h2 className="text-xl font-bold text-primary-dark mb-4">Tu trabajo</h2>
          
          <div className="bg-surface-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            {/* EL VEREDICTO DEL PROFESOR */}
            {isCalificada && (
              <div className="mb-6 p-4 bg-primary/5 rounded-xl text-center border border-primary/20">
                <p className="text-primary-dark font-black text-2xl">{entrega.calificacion} / {tarea.calificacion || 100}</p>
                {entrega.comentario_profesor && (
                  <p className="text-sm text-text-primary mt-2 italic">"{entrega.comentario_profesor}"</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              {/* ZONA DE SUBIDA */}
              {(!isCalificada && (!isOverdue || tieneEntregaActiva)) && (
                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors group">
                  <input type="file" multiple onChange={handleSelectArchivosAlumno} disabled={isSubiendoAlumno} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-16 h-16 rounded-full bg-blue-50 mx-auto flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-secondary font-medium">Toca para subir un archivo</p>
                </div>
              )}

              {/* LISTA DE ARCHIVOS PENDIENTES */}
              {archivosSubirAlumno.length > 0 && (
                <div className="space-y-2 mt-4">
                  {archivosSubirAlumno.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="truncate text-text-primary font-medium pr-4">{file.name}</span>
                      <button onClick={() => setArchivosSubirAlumno(prev => prev.filter((_, i) => i !== idx))} className="text-text-secondary hover:text-error transition-colors px-1">✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* LISTA DE ARCHIVOS YA ENTREGADOS */}
              {archivosEntrega.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-primary-dark mb-3">Archivos entregados</h3>
                  <div className="space-y-2">
                    {archivosEntrega.map((archivo) => (
                      <div key={archivo.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                        <span className="text-sm font-medium text-text-primary truncate">{archivo.nombre_archivo}</span>
                        <div className="flex items-center gap-2">
                           <a href={archivo.url} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-dark text-sm font-bold">Ver</a>
                           {!isOverdue && !isCalificada && (
                             <button onClick={() => handleEliminarArchivoAlumno(archivo.id_archivo)} className="text-error/70 hover:text-error ml-2 transition-colors">✕</button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tieneEntregaActiva && archivosEntrega.length === 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-primary-dark mb-1">Archivos entregados</h3>
                  <p className="text-xs text-text-secondary">Entregado sin archivos adjuntos</p>
                </div>
              )}

              {/* BOTONES PRINCIPALES */}
              <div className="pt-4 flex flex-col md:flex-row gap-3">
                {tieneEntregaActiva && !isOverdue && !isCalificada && (
                  <button
                    onClick={handleCancelarEntrega}
                    disabled={isSubiendoAlumno}
                    className="flex-1 py-3.5 bg-error text-white font-bold rounded-xl shadow-sm hover:bg-red-600 transition-colors"
                  >
                    Anular entrega
                  </button>
                )}
                
                {(!isCalificada && (!isOverdue || tieneEntregaActiva)) && (
                   <button
                    onClick={handleSubmitEntrega}
                    disabled={isSubiendoAlumno || (tieneEntregaActiva && archivosSubirAlumno.length === 0)}
                    className="flex-1 py-3.5 bg-primary-dark text-white font-bold rounded-xl shadow-sm hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {isSubiendoAlumno ? 'Subiendo...' : (tieneEntregaActiva ? (archivosSubirAlumno.length > 0 ? 'Entregar nuevos archivos' : 'Reentregar tarea') : 'Entregar tarea')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  </div>
  );
};