import { apiClient } from '../../../api/apiClient';

export interface User {
  id_usuario: number;
  nombre: string;
  correo: string;
}
export interface Student {
  id_usuario: number;
  nombre: string;
  correo: string;
}
export interface Professor {
    id_usuario: number;
    nombre: string;
    correo: string;
}
export const adminService = {

  getStudents: async (): Promise<Student[]> => {
    const response = await apiClient.get('/usuario/estudiantes');
    return response.data;
  },

  enrollStudent: async (courseId: number, studentId: number): Promise<void> => {
    await apiClient.post(`/inscripcion`, { id_usuario: studentId, estado: "ACTIVO", id_curso: courseId });
  },

  getProfessors: async(): Promise<Professor[]> => {
    const response = await apiClient.get('usuario/profesores')
    return response.data;
  },
  getCourseStudents: async (courseId: number) => {
    const response = await apiClient.get(`/curso/${courseId}/inscripciones`);
    return response.data;
  },

  unenrollStudent: async (inscripcionId: number) => {
    const response = await apiClient.delete(`/inscripcion/${inscripcionId}`);
    return response.data;
  }
};