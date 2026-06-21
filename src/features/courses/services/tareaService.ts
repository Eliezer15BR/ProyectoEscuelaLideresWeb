import { apiClient } from '../../../api/apiClient';

export const tareaService = {
  // --- ENDPOINTS DE LA TAREA ---
  getById: async (tareaId: string | number) => {
    const response = await apiClient.get(`/tarea/${tareaId}`);
    return response.data;
  },
  
  update: async (tareaId: string | number, data: { titulo: string; descripcion: string; fecha_entrega?: string, calificacion?: number }) => {
    const response = await apiClient.patch(`/tarea/${tareaId}`, data);
    return response.data;
  },
  
  delete: async (tareaId: string | number) => {
    await apiClient.delete(`/tarea/${tareaId}`);
  },

  // --- ENDPOINTS DE ARCHIVOS ADJUNTOS (INSTRUCCIONES) ---
  // Asumiendo que tienes un endpoint /archivo-tarea similar a /archivo-material
  getFiles: async (tareaId: string | number) => {
    const response = await apiClient.get(`/archivo-tarea/tarea/${tareaId}`);
    return response.data;
  },

  uploadFiles: async (tareaId: number, files: File[], signal?: AbortSignal, onProgress?: (percent: number) => void) => {
    const totalBytes = files.reduce((s, f) => s + (f.size || 0), 0);
    const lastLoaded: number[] = files.map(() => 0);
    let totalLoaded = 0;

    const uploadPromises = files.map((file, idx) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id_tarea', String(tareaId));

      return apiClient.post('/archivo-tarea', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal,
        onUploadProgress: (progressEvent) => {
          const loaded = progressEvent.loaded || 0;
          const delta = loaded - lastLoaded[idx];
          lastLoaded[idx] = loaded;
          totalLoaded += delta;
          if (onProgress && totalBytes > 0) {
            const percent = Math.round((totalLoaded / totalBytes) * 100);
            onProgress(percent);
          }
        }
      });
    });

    await Promise.all(uploadPromises);
  },

  deleteFile: async (fileId: number) => {
    await apiClient.delete(`/archivo-tarea/${fileId}`);
  },
  // NUEVO: Traer todas las tareas pendientes globales del estudiante
  getPendientes: async () => {
    const response = await apiClient.get('/tarea/pendientes');
    return response.data;
  },
};