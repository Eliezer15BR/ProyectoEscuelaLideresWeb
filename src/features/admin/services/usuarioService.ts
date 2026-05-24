import { apiClient } from "../../../api/apiClient";


export const usuarioService = {
  getAll: async () => {
    const response = await apiClient.get('/usuario');
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/usuario', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await apiClient.patch(`/usuario/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/usuario/${id}`);
    return response.data;
  }
};