import { apiClient } from "../../api/apiClient";
import type { Course } from "./courseService";


// Definimos la forma exacta de lo que devuelve tu map() en NestJS
export interface RecursoFeed {
  // Campos compartidos
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: 'tarea' | 'material';
  
  // Campos que podrían venir solo en tareas o solo en materiales
  id_tarea?: number;
  id_material?: number;
  fecha_entrega?: string;
  url_archivo?: string;
}

// La respuesta completa que armaste: { curso: {...}, recursos: [...] }
export interface FeedResponse {
  curso: Course;
  recursos: RecursoFeed[];
}

export const feedService = {
  getCourseFeed: async (courseId: number): Promise<FeedResponse> => {
    const response = await apiClient.get(`/curso/${courseId}/recursos`);
    return response.data;
  }
};