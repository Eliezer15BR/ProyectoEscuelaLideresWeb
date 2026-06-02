import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { materialService } from './services/materialService'; // <-- Importamos el nuevo servicio
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';

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
    try {
      // Usamos el nuevo servicio que dispara las peticiones en paralelo
      await materialService.uploadFiles(Number(materialId), archivosPendientes);
      
      // Recargamos SOLO los archivos para no pedir todo el material de nuevo
      const nuevosArchivos = await materialService.getFiles(materialId);
      setArchivosDelServidor(nuevosArchivos);
      
      setArchivosPendientes([]); // Limpiamos la bandeja
    } catch (error) {
      console.error(error);
      alert('Error al subir algunos archivos.');
    } finally {
      setIsUploading(false);
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
      
      <div>
        <button onClick={() => navigate(`/clases/${courseId}`)} className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 font-medium">
          <span>←</span> Volver a la clase
        </button>
      </div>

      {/* CABECERA (Se mantiene igual, oculto el código repetido por brevedad pero es el mismo diseño que ya tenías) */}
      <div className="bg-surface-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">📚 Material de Estudio</span>
          {canManage && !isEditing && (
            <div className="flex items-center gap-2">
              <button onClick={() => setIsEditing(true)} className="p-2 text-text-secondary hover:bg-blue-300 transition-colors rounded-lg">✏️</button>
              <button onClick={handleDelete} className="p-2 text-text-secondary hover:bg-red-300 transition-colors rounded-lg">🗑️</button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-4 animate-fade-in">
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
        ) : (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-extrabold text-primary-dark pr-12">{material.titulo}</h1>
            <p className="text-text-secondary mt-4 text-lg leading-relaxed whitespace-pre-wrap">{material.descripcion}</p>
          </div>
        )}
      </div>

      {/* ZONA DE ARCHIVOS MÚLTIPLES */}
      <div className="bg-surface-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-text-primary mb-6">Archivos Adjuntos</h2>

        {/* LISTA DE ARCHIVOS DEL SERVIDOR */}
        <div className="space-y-3">
          {(!archivosDelServidor || archivosDelServidor.length === 0) ? (
            <p className="text-sm text-text-secondary italic">No hay archivos adjuntos todavía.</p>
          ) : (
            archivosDelServidor.map((archivo: any) => (
              <div key={archivo.id_archivo || archivo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="text-2xl flex-shrink-0">📄</span>
                  {/* Asegúrate de que tu backend devuelve el nombre original o usaremos un genérico */}
                  <span className="font-medium text-text-primary truncate">{archivo.nombre_archivo || 'Documento'}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={archivo.url_archivo || archivo.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-colors">
                    Descargar
                  </a>
                  {canManage && (
                    <button onClick={() => handleDeleteServerFile(archivo.id_archivo || archivo.id)} className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar archivo">
                      Eliminar 🗑️
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ÁREA DE SELECCIÓN Y SUBIDA DE ARCHIVOS (Solo Admin/Profesor) */}
        {canManage && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-bold text-text-primary mb-4">Añadir archivos</h3>
            
            {/* Input para seleccionar MÚLTIPLES archivos */}
            <div className="mb-4">
              <input 
                type="file"
                multiple // <--- ESTO PERMITE SELECCIONAR VARIOS
                onChange={handleFileSelect}
                className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-200 rounded-xl border-dashed bg-gray-50"
                disabled={isUploading}
              />
            </div>

            {/* Bandeja de archivos pendientes por subir */}
            {archivosPendientes.length > 0 && (
              <div className="mb-4 p-4 border border-orange-200 bg-orange-50 rounded-xl">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Pendientes por subir ({archivosPendientes.length})</p>
                <ul className="space-y-2 mb-4">
                  {archivosPendientes.map((file, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg border border-orange-100">
                      <span className="truncate text-text-primary pr-4">{file.name}</span>
                      <button onClick={() => removePendingFile(idx)} className="text-red-500 hover:text-red-700 font-bold px-2 flex-shrink-0">✕</button>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleUploadFiles} isLoading={isUploading} fullWidth>
                  ⬆️ Subir {archivosPendientes.length} archivo(s) al servidor
                </Button>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};