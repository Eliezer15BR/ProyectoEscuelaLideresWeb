import { apiClient } from "../../api/apiClient";

export interface Course{
    id_curso: number;
    nombre: string;
    descripcion: string;
    cupos: number;
    fecha_inicio: string;
    fecha_fin: string;
    id_profesor: number;
}
export const courseService = {
    getMyCourses: async(): Promise<Course[]> => {
        const response = await apiClient.get('/curso/my');
        return response.data;
    },
    getAll: async(): Promise<Course[]> => {
        const response = await apiClient.get('/curso');
        return response.data;
    },
    getById: async(id: number): Promise<Course> => {
        const response = await apiClient.get(`/curso/${id}`)
        return response.data;
    },
    create: async(courseData: Omit<Course,'id_curso'>): Promise<Course> => {
        const response = await apiClient.post('/curso',courseData);
        return response.data;
    },
    delete: async(id: number): Promise<void> => {
        const response = await apiClient.delete(`/curso/${id}`);
        return response.data;
    }
};