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

  uploadFiles: async (tareaId: number, files: File[]) => {
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append('file', file); 
      formData.append('id_tarea', String(tareaId)); // Tu DTO de archivo-tarea exigirá esto

      return apiClient.post('/archivo-tarea', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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