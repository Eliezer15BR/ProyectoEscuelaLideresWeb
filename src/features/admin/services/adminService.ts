import { apiClient } from '../../../api/apiClient';

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
  // Le pegamos a tu endpoint específico
  getStudents: async (): Promise<Student[]> => {
    const response = await apiClient.get('/usuario/estudiantes');
    return response.data;
  },

  // Método para inscribir al estudiante en el curso
  enrollStudent: async (courseId: number, studentId: number): Promise<void> => {
    // NOTA: Ajusta esta URL y el body según cómo reciba los datos tu NestJS
    // Por ejemplo: POST /curso/:courseId/inscribir pasando el id del usuario
    await apiClient.post(`/inscripcion`, { id_usuario: studentId, estado: "ACTIVO", id_curso: courseId });
  },

  getProfessors: async(): Promise<Professor[]> => {
    const response = await apiClient.get('usuario/profesores')
    return response.data;
  }
};