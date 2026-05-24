import { courseService, type Course } from "../../services/courseService";
import { create } from "zustand";

interface CourseState{
    courses: Course[];
    isLoading: boolean;
    error: string | null;
    currentCourse: Course | null;
    fetchCourseById: (id: number) => Promise<void>;
    clearCurrentCourse: () => void;
    fetchCourses: () => Promise<void>;
    clearError: () => void;
}
export const useCourseStore = create<CourseState> ((set)=>({
    courses: [],
    isLoading: false,
    error: null,
    currentCourse: null,
    clearCurrentCourse: () => set({ currentCourse: null }),
    clearError: () => set({error: null}),
    fetchCourses: async() => {
        set({ isLoading: true, error: null});
        try{
            const data = await courseService.getMyCourses();
            set({courses: data, isLoading: false});
        }catch(error: any){
            set({
                error: error.response?.data?.message||"No se pudieron cargar los cursos intente otra vez.",
                isLoading:false,
            })
        }
    },
    fetchCourseById: async(id: number) => {
        set({isLoading: true, error: null, currentCourse: null });
        try{
            const data = await courseService.getById(id);
            set({currentCourse: data, isLoading: false});
        }catch(error: any){
            set({
                error: error.response?.data?.message || "No se pudo cargar el detalle del curso",
                isLoading: false
            });
        }
    }
}))
