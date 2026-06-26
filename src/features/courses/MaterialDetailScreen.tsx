import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { materialService } from './services/materialService'; // <-- Importamos el nuevo servicio
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { Modal } from '../../components/Modal';

export const MaterialDetailScreen = () => {
  const { id: courseId, materialId } = useParams<{ id: string, materialId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [material, setMaterial] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [archivosDelServidor, setArchivosDelServidor] = useState<any[]>([]);
  // NUEVO: Ahora es un arreglo de archivos
  const [archivosPendientes, setArchivosPendientes] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const canManage = user?.rol === 'Admin' || user?.rol === 'Profesor';

  const loadMaterial = async () => {
    if (!materialId) return; 
    try {
      // Pedimos el material por un lado y los archivos por el otro (en paralelo)
      const [dataMaterial, dataArchivos] = await Promise.all([
        materialService.getById(materialId),
        materialService.getFiles(materialId)
      ]);
      
      setMaterial(dataMaterial);
      setArchivosDelServidor(dataArchivos); // Guardamos la lista de archivos
      
      setEditTitulo(dataMaterial.titulo);
      setEditDescripcion(dataMaterial.descripcion);
    } catch (error) {
      console.error('Error cargando datos', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMaterial();
  }, [materialId]);

  const handleUpdate = async () => {
    if (!editTitulo.trim() || !editDescripcion.trim() || !materialId) return;
    setIsSaving(true);
    try {
      await materialService.update(materialId, { titulo: editTitulo, descripcion: editDescripcion });
      setMaterial({ ...material, titulo: editTitulo, descripcion: editDescripcion });
      setIsEditing(false);
    } catch (error) {
      alert('Hubo un error al actualizar el material.');
    } finally {
      setIsSaving(false);
    } 
  };

  const handleDelete = async () => {
    if (!materialId) return;
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este material?');
    if (!confirmacion) return;
    try {
      await materialService.delete(materialId);
      navigate(`/clases/${courseId}`);
    } catch (error) {
      alert('No se pudo eliminar el material.');
    }
  };

  // --- NUEVA LÓGICA DE SUBIDA MÚLTIPLE ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevosArchivos = Array.from(e.target.files);
      setArchivosPendientes((prev) => [...prev, ...nuevosArchivos]);
    }
    // Limpiamos el input para poder seleccionar el mismo archivo de nuevo si se borró por error
    e.target.value = ''; 
  };

  const removePendingFile = (indexToRemove: number) => {
    setArchivosPendientes((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUploadFiles = async () => {
    if (archivosPendientes.length === 0 || !materialId) return;
    setIsUploading(true);
    const controller = new AbortController();
    setUploadProgress(0);
    try {
      await materialService.uploadFiles(Number(materialId), archivosPendientes, controller.signal, (pct) => setUploadProgress(pct));

      // Recargamos SOLO los archivos para no pedir todo el material de nuevo
      const nuevosArchivos = await materialService.getFiles(materialId);
      setArchivosDelServidor(nuevosArchivos);

      setArchivosPendientes([]); // Limpiamos la bandeja
    } catch (error: any) {
      if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError' || error?.name === 'AbortError') {
        setCancelMessage('Subida cancelada');
        setTimeout(() => setCancelMessage(null), 5000);
        const nuevosArchivos = await materialService.getFiles(materialId);
        setArchivosDelServidor(nuevosArchivos);
      } else {
        console.error(error);
        alert('Error al subir algunos archivos.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteServerFile = async (fileId: number) => {
    const confirmacion = window.confirm('¿Eliminar este archivo de forma permanente?');
    if (!confirmacion) return;
    try {
      // Usamos el ID del archivo directamente
      await materialService.deleteFile(fileId);
      await loadMaterial();
      // Filtramos visualmente el archivo eliminado para no hacer otra petición al servidor
      setArchivosDelServidor((prev) => prev.filter(a => a.id !== fileId)); 
      // (Nota: cambia a.id por a.id_archivo_material si así viene en tu base de datos)
    } catch (error) {
      alert('No se pudo eliminar el archivo.');
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>;
  if (!material) return <div className="text-center p-12 text-text-secondary">Material no encontrado.</div>;

  return (
    <div className="flex flex-col gap-6 relative animate-fade-in">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COLUMNA IZQUIERDA: Detalles del Material (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="mb-2 flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-full bg-primary/10 text-primary-dark flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                <h1 className="text-3xl font-black text-primary-dark leading-tight">{material.titulo}</h1>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium mt-1">
                <span className="text-text-secondary">
                  {material.nombre_profesor || 'Profesor'} • {new Date(material.fecha_creacion || Date.now()).toLocaleDateString()}
                </span>
                <span className="font-bold text-primary/70">Material de estudio</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
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
            </div>
          </div>
          <hr className="border-gray-200 mt-2" />

          {/* MODAL DE EDICIÓN PARA PROFESORES */}
          <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Editar Material">
            <div className="space-y-4">
              <InputField label="Título del Material" type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} disabled={isSaving} />
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1.5">Descripción</label>
                <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none h-32" value={editDescripcion} onChange={(e) => setEditDescripcion(e.target.value)} disabled={isSaving} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => { setIsEditing(false); setEditTitulo(material.titulo); setEditDescripcion(material.descripcion); }} className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary" disabled={isSaving}>Cancelar</button>
                <div className="w-32"><Button onClick={handleUpdate} isLoading={isSaving}>Guardar</Button></div>
              </div>
            </div>
          </Modal>

          <div className="pt-2">
            <p className="text-text-primary text-base leading-relaxed whitespace-pre-wrap">{material.descripcion}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-4">Archivos adjuntos</h2>
            <div className="bg-surface-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              {(!archivosDelServidor || archivosDelServidor.length === 0) ? (
                <p className="text-sm text-text-secondary text-center py-4">No hay archivos adjuntos.</p>
              ) : (
                <div className="space-y-2">
                  {archivosDelServidor.map((archivo: any) => (
                    <div key={archivo.id_archivo || archivo.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-4 min-w-0 pr-4">
                        <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary-dark flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                          </svg>
                        </span>
                        <span className="font-bold text-sm text-text-primary truncate group-hover:text-primary transition-colors">{archivo.nombre_archivo || 'Documento'}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a href={archivo.url_archivo || archivo.url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-transparent text-primary-dark hover:bg-primary/10 rounded-xl transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                        {canManage && (
                          <button onClick={() => handleDeleteServerFile(archivo.id_archivo || archivo.id)} className="w-10 h-10 flex items-center justify-center bg-transparent text-error hover:bg-error/10 rounded-xl transition-colors" title="Eliminar archivo">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Panel de Gestión (1/3) */}
        <div className="lg:col-span-1">
          {canManage && (
            <div className="bg-surface-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sticky top-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4 border-b border-gray-100 pb-2">Gestión de Material</h2>
              
              <div className="pt-2">
                <h3 className="text-sm font-bold text-text-primary mb-3">Adjuntar archivos</h3>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileSelect} 
                  className="block w-full text-xs text-text-secondary file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary hover:file:text-white cursor-pointer mb-3" 
                  disabled={isUploading} 
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
                    <Button onClick={handleUploadFiles} isLoading={isUploading} fullWidth>Subir archivos</Button>
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-primary h-1.5" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                    {cancelMessage && (
                      <div className="mt-2 text-xs text-error font-bold text-center">{cancelMessage}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};