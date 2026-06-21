import { apiClient } from '../../../api/apiClient';

export const materialService = {
  // --- ENDPOINTS DEL MATERIAL (TEXTO) ---
  getById: async (materialId: string | number) => {
    const response = await apiClient.get(`/material/${materialId}`);
    return response.data;
  },
  
  update: async (materialId: string | number, data: { titulo: string; descripcion: string }) => {
    const response = await apiClient.patch(`/material/${materialId}`, data);
    return response.data;
  },
  
  delete: async (materialId: string | number) => {
    await apiClient.delete(`/material/${materialId}`);
  },

  // --- NUEVOS ENDPOINTS DE ARCHIVOS (/archivo-material) ---
  
  // 1. Obtener los archivos de un material específico
  getFiles: async (materialId: string | number) => {
    const response = await apiClient.get(`/archivo-material/material/${materialId}`);
    return response.data;
  },

  // 2. Subir múltiples archivos (Hacemos un loop ya que tu backend recibe de a uno)
  uploadFiles: async (materialId: number, files: File[], signal?: AbortSignal, onProgress?: (percent: number) => void) => {
    const totalBytes = files.reduce((s, f) => s + (f.size || 0), 0);
    const lastLoaded: number[] = files.map(() => 0);
    let totalLoaded = 0;

    const uploadPromises = files.map((file, idx) => {
      const formData = new FormData();
      formData.append('file', file); // El interceptor espera 'file'
      formData.append('id_material', String(materialId)); // Tu DTO exige esto

      return apiClient.post('/archivo-material', formData, {
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

  // 3. Eliminar un archivo por su propio ID
  deleteFile: async (fileId: number) => {
    await apiClient.delete(`/archivo-material/${fileId}`);
  }
};