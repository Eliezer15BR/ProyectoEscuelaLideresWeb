import { create } from 'zustand';
import type { Course } from '../../services/courseService';
import { feedService, type RecursoFeed } from '../../services/feedService';


interface FeedState {
  cursoActual: Course | null;
  recursos: RecursoFeed[];
  isLoading: boolean;
  fetchFeed: (courseId: number) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set) => ({
  cursoActual: null,
  recursos: [],
  isLoading: false,

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
}));