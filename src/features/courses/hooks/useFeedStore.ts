import { create } from 'zustand';
import type { Course } from '../../services/courseService';
import { feedService, type RecursoFeed } from '../../services/feedService';


interface FeedState {
  cursoActual: Course | null;
  recursos: RecursoFeed[];
  isLoading: boolean;
  publishError: string | null;
  fetchFeed: (courseId: number) => Promise<void>;
  publishContent: (courseId: number, tipo: 'tarea'|'material',data: any) => Promise<any>;
  clearPublishError: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  cursoActual: null,
  recursos: [],
  isLoading: false,
  publishError: null,
  clearPublishError: () => set({publishError: null}),
  fetchFeed: async (courseId: number) => {
    set({ isLoading: true });
    try {
      const data = await feedService.getCourseFeed(courseId);
      // Guardamos ambas cosas tal como las mandó NestJS
      set({ cursoActual: data.curso, recursos: data.recursos, isLoading: false });
    } catch (error) {
      console.error("Error cargando el feed:", error);
      set({ cursoActual: null, recursos: [], isLoading: false });
    }
  },
  publishContent: async (courseId, tipo, data) => {
    set({ publishError: null });
    try {
      let nuevoContenido; // Guardamos la respuesta aquí
      
      if (tipo === 'tarea') {
        nuevoContenido = await feedService.createTarea(courseId, data);
      } else {
        nuevoContenido = await feedService.createMaterial(courseId, data);
      }
      
      // Mantenemos esta línea para que tu backend vuelva a ordenar y mezclar
      // las tareas y materiales con su lógica de fechas personalizada.
      const store = useFeedStore.getState();
      await store.fetchFeed(courseId);
      
      // En lugar de devolver true, devolvemos los datos reales del backend
      return nuevoContenido; 
      
    } catch (error: any) {
      set({ publishError: error.response?.data?.message || 'Error al publicar el contenido.' });
      return null; // Retornamos null en lugar de false
    }
  },
}));