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
  uploadFiles: async (materialId: number, files: File[]) => {
    // Creamos un arreglo de promesas
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append('file', file); // El interceptor espera 'file'
      formData.append('id_material', String(materialId)); // Tu DTO exige esto

      return apiClient.post('/archivo-material', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    });

    // Ejecutamos todas las subidas al mismo tiempo
    await Promise.all(uploadPromises);
  },

  // 3. Eliminar un archivo por su propio ID
  deleteFile: async (fileId: number) => {
    await apiClient.delete(`/archivo-material/${fileId}`);
  }
};