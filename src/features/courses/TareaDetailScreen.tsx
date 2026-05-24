import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { tareaService } from './services/tareaService';
import { entregaService } from './services/entregaService';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';

export const TareaDetailScreen = () => {
  const { id: courseId, taskId } = useParams<{ id: string, taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [tarea, setTarea] = useState<any>(null);
  const [archivosDelServidor, setArchivosDelServidor] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [archivosPendientes, setArchivosPendientes] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
  const [isSaving, setIsSaving] = useState(false);

  const canManage = user?.rol === 'Admin' || user?.rol === 'Profesor';
  const isEstudiante = user?.rol === 'Estudiante';

  // 💡 LA SOLUCIÓN: Validamos si realmente hay una entrega activa inspeccionando sus IDs reales
  const tieneEntregaActiva = !!(entrega?.id || entrega?.id_entrega);

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
        fecha_entrega: fechaISO
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
    setIsUploading(true);
    try {
      await tareaService.uploadFiles(Number(taskId), archivosPendientes);
      await loadTarea();
      setArchivosPendientes([]);
    } catch (error) {
      alert('Error al subir los archivos.');
    } finally {
      setIsUploading(false);
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
    try {
      let currentEntregaId = entrega?.id || entrega?.id_entrega;

      if (!currentEntregaId) {
        const resNueva = await entregaService.crearEntrega(Number(taskId));
        const nuevaEntregaLimpia = resNueva.entrega ? resNueva.entrega : resNueva;
        currentEntregaId = nuevaEntregaLimpia.id || nuevaEntregaLimpia.id_entrega;
      }

      if (archivosSubirAlumno.length > 0 && currentEntregaId) {
        await entregaService.subirArchivos(currentEntregaId, archivosSubirAlumno);
        setArchivosSubirAlumno([]);
      }

      await loadTarea(); 
    } catch (error) {
      console.error(error);
      alert('Error al realizar la entrega.');
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

  return (
    <div className="flex flex-col gap-6 relative animate-fade-in pb-10">
      
      <div>
        <button onClick={() => navigate(`/clases/${courseId}`)} className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 font-medium">
          <span>←</span> Volver a la clase
        </button>
      </div>

      {/* CABECERA DE LA TAREA */}
      <div className="bg-surface-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-400"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">📝 Tarea Asignada</span>
            {tarea.fecha_entrega && !isEditing && (
               <span className={`text-sm font-bold flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-text-secondary'}`}>
                 ⏱️ Vence: {new Date(tarea.fecha_entrega).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
               </span>
            )}
          </div>
          {canManage && !isEditing && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setIsEditing(true)} className="p-2 text-text-secondary hover:text-orange-600 rounded-lg">✏️</button>
              <button onClick={handleDelete} className="p-2 text-text-secondary hover:text-red-600 rounded-lg">🗑️</button>
            </div>
          )}
        </div>
          {canManage && !isEditing && (
          <div className="mt-6 pt-4 border-t border-orange-100 flex justify-end">
            <button 
              onClick={() => navigate(`/clases/${courseId}/tarea/${taskId}/revisiones`)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800 rounded-xl font-bold transition-colors shadow-sm"
            >
              <span>📑</span> Ver Entregas y Calificar
            </button>
          </div>
        )}
        {isEditing ? (
          <div className="space-y-4 animate-fade-in border-t border-gray-100 pt-4">
            <InputField label="Título de la Tarea" type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} disabled={isSaving} />
            <InputField label="Fecha Límite de Entrega" type="datetime-local" value={editFechaEntrega} onChange={(e) => setEditFechaEntrega(e.target.value)} disabled={isSaving} required />
            <div>
              <label className="block text-sm font-bold text-text-primary mb-1.5">Instrucciones</label>
              <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none h-32" value={editDescripcion} onChange={(e) => setEditDescripcion(e.target.value)} disabled={isSaving} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setIsEditing(false); setEditTitulo(tarea.titulo); setEditDescripcion(tarea.descripcion); setEditFechaEntrega(formatForInput(tarea.fecha_entrega)); }} className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary" disabled={isSaving}>Cancelar</button>
              <div className="w-32"><Button onClick={handleUpdate} isLoading={isSaving}>Guardar</Button></div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in mt-2">
            <h1 className="text-3xl font-extrabold text-primary-dark pr-12">{tarea.titulo}</h1>
            <p className="text-text-secondary mt-4 text-lg leading-relaxed whitespace-pre-wrap">{tarea.descripcion}</p>
          </div>
        )}
      </div>

      {/* ARCHIVOS DE INSTRUCCIONES */}
      <div className="bg-surface-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-text-primary mb-6">Archivos de Instrucciones</h2>
        <div className="space-y-3">
          {archivosDelServidor.length === 0 ? (
            <p className="text-sm text-text-secondary italic">El profesor no ha adjuntado archivos adicionales.</p>
          ) : (
            archivosDelServidor.map((archivo) => (
              <div key={archivo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="text-2xl flex-shrink-0">📄</span>
                  <span className="font-medium text-text-primary truncate">{archivo.nombre_archivo || 'Documento adjunto'}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={archivo.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-sm font-bold transition-colors">Descargar</a>
                  {canManage && <button onClick={() => handleDeleteServerFile(archivo.id)} className="p-2 text-text-secondary hover:text-red-600 rounded-lg">🗑️</button>}
                </div>
              </div>
            ))
          )}
        </div>
        {canManage && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-bold text-text-primary mb-4">Añadir archivos de instrucciones</h3>
            <div className="mb-4">
              <input type="file" multiple onChange={handleFileSelect} className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer border border-gray-200 rounded-xl border-dashed bg-gray-50" disabled={isUploading} />
            </div>
            {archivosPendientes.length > 0 && (
              <div className="mb-4 p-4 border border-orange-200 bg-orange-50 rounded-xl">
                <ul className="space-y-2 mb-4">
                  {archivosPendientes.map((file, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg border border-orange-100">
                      <span className="truncate text-text-primary pr-4">{file.name}</span>
                      <button onClick={() => removePendingFile(idx)} className="text-red-500 font-bold px-2">✕</button>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleUploadFiles} isLoading={isUploading} fullWidth>⬆️ Subir instrucciones al servidor</Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- SECCIÓN: MI TRABAJO (SOLO ESTUDIANTES) --- */}
      {isEstudiante && (
        <div className="bg-surface-white rounded-2xl p-8 border border-gray-100 shadow-md relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-text-primary">Mi Trabajo</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                tieneEntregaActiva ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {tieneEntregaActiva ? '✅ Entregado' : '⏳ Pendiente'}
              </span>
            </div>
            {tieneEntregaActiva && !isOverdue && (
              <button
                onClick={handleCancelarEntrega}
                disabled={isSubiendoAlumno}
                className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Anular Entrega
              </button>
            )}
          </div>

          {tieneEntregaActiva && archivosEntrega.length > 0 && (
            <div className="space-y-3 mb-4">
              {archivosEntrega.map((archivo) => (
                <div key={archivo.id} className="flex items-center justify-between p-4 border border-green-100 rounded-xl bg-green-50/30">
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <span className="text-xl">📄</span>
                    <span className="text-sm font-medium text-text-primary truncate">{archivo.nombre_archivo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <a href={archivo.url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-text-primary hover:bg-gray-50 transition-colors">Ver</a>
                     {!isOverdue && (
                       <button onClick={() => handleEliminarArchivoAlumno(archivo.id_archivo)} className="text-red-400 hover:text-red-600 p-1 transition-colors">✕</button>
                     )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            {isOverdue && !tieneEntregaActiva ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center">
                La fecha límite ha pasado. No puedes realizar entregas.
              </div>
            ) : (
              <div className="space-y-4">
                {(!tieneEntregaActiva || archivosEntrega.length > 0) && (
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      {tieneEntregaActiva ? 'Adjuntar más archivos a tu entrega' : 'Adjuntar archivos físicos (Opcional)'}
                    </label>
                    <input type="file" multiple onChange={handleSelectArchivosAlumno} disabled={isSubiendoAlumno} className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary hover:file:text-white cursor-pointer" />
                  </div>
                )}

                {archivosSubirAlumno.length > 0 && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <ul className="space-y-2">
                      {archivosSubirAlumno.map((file, idx) => (
                        <li key={idx} className="flex justify-between items-center text-xs text-text-primary">
                          <span className="truncate pr-4">📄 {file.name}</span>
                          <button onClick={() => setArchivosSubirAlumno(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 font-bold px-1 hover:bg-red-50 rounded">✕</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    onClick={handleSubmitEntrega} 
                    isLoading={isSubiendoAlumno} 
                    fullWidth
                    disabled={tieneEntregaActiva && archivosSubirAlumno.length === 0}
                  >
                    {archivosSubirAlumno.length > 0 
                      ? `🚀 Entregar con ${archivosSubirAlumno.length} archivo(s)` 
                      : (tieneEntregaActiva ? '✅ Tarea Entregada' : '✔ Marcar como completada (Sin archivos)')
                    }
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};