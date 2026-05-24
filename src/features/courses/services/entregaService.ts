import { apiClient } from '../../../api/apiClient';

export const entregaService = {
  // 1. Obtener la entrega (Funciona perfecto con tu GET /entrega/tarea/:id)
  getByTarea: async (tareaId: string | number) => {
    const response = await apiClient.get(`/entrega/tarea/${tareaId}`);
    return response.data;
  },

  // NUEVO: 2. Crear el "expediente" de la entrega
  // Coincide con tu POST /entrega y CreateEntregaDto
  crearEntrega: async (tareaId: number) => {
    const response = await apiClient.post('/entrega', {
      id_tarea: tareaId,
      // La calificación y el comentario son opcionales en tu DTO, así que no los mandamos
    });
    return response.data;
  },
  eliminarEntrega: async (entregaId: number) => {
    await apiClient.delete(`/entrega/${entregaId}`);
  },
  // 3. Subir archivos
  subirArchivos: async (entregaId: number, files: File[]) => {
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // OJO AQUÍ: Asumo que tu tabla archivo_entrega pide el id_entrega. 
      // Si te pide el id_tarea, cámbialo a 'id_tarea'
      formData.append('id_entrega', String(entregaId)); 

      return apiClient.post('/archivo-entrega', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    });

    await Promise.all(uploadPromises);
  },

  // 4. Eliminar un archivo
  eliminarArchivo: async (fileId: number) => {
    await apiClient.delete(`/archivo-entrega/${fileId}`);
  },
  getAllByTarea: async (tareaId: string | number) => {
    const response = await apiClient.get(`/entrega/tarea/${tareaId}/todas`);
    return response.data;
  },

  // NUEVO: Calificar una entrega (PATCH)
  calificar: async (entregaId: number, data: { calificacion: number; comentario_profesor?: string }) => {
    const response = await apiClient.patch(`/entrega/${entregaId}`, data);
    return response.data;
  },
  anularCalificacion: async (entregaId: number) => {
    const response = await apiClient.patch(`/entrega/${entregaId}`, {
      calificacion: null,
      comentario_profesor: null
    });
    return response.data;
  }
};