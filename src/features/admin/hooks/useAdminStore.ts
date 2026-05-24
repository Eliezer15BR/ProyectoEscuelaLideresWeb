import { create } from 'zustand';
import { adminService, type Professor, type Student } from '../services/adminService';
import { courseService, type Course } from '../../services/courseService';

interface AdminState {
  students: Student[];
  courses: Course[];
  professors: Professor[];
  isLoadingProfessors: boolean;
  isLoadingStudents: boolean;
  isLoadingCourses: boolean; // <-- Nuevo estado de carga para los cursos
  adminError: string | null;
  
  fetchStudents: () => Promise<void>;
  fetchAllCourses: () => Promise<void>;
  fetchProfessors: () => Promise<void>;
  enrollStudentInCourse: (courseId: number, studentId: number) => Promise<boolean>;
  createCourse: (courseData: Omit<Course, 'id_curso'>) => Promise<boolean>;
  clearAdminError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  students: [],
  courses: [],
  isLoadingStudents: false,
  isLoadingCourses: false,
  adminError: null,
  professors: [],
  isLoadingProfessors: false,
  clearAdminError: () => set({ adminError: null }),

  fetchStudents: async () => {
    set({ isLoadingStudents: true, adminError: null });
    try {
      const data = await adminService.getStudents();
      set({ students: data, isLoadingStudents: false });
    } catch (error: any) {
      set({ 
        adminError: error.response?.data?.message || 'Error al cargar los estudiantes.', 
        isLoadingStudents: false 
      });
    }
  },

  fetchAllCourses: async () => {
    set({ isLoadingCourses: true, adminError: null });
    try {
      const data = await courseService.getAll();
      
      set({ courses: data, isLoadingCourses: false });
    } catch (error: any) {
      set({ 
        adminError: error.response?.data?.message || 'Error al cargar los cursos.', 
        isLoadingCourses: false 
      });
    }
  },
  fetchProfessors: async() => {
    set({isLoadingProfessors: true});
    try{
        const data = await adminService.getProfessors();
        set({professors: data, isLoadingProfessors: false });
    }catch(error){
        console.error("Error al cargar profesores", error);
        set({isLoadingProfessors: false});
    }
  },
  enrollStudentInCourse: async (courseId: number, studentId: number) => {
    set({ adminError: null });
    try {
      await adminService.enrollStudent(courseId, studentId);
      return true; // Inscripción exitosa
    } catch (error: any) {
      set({ 
        adminError: error.response?.data?.message || 'No se pudo inscribir al estudiante.' 
      });
      return false; // Hubo un fallo
    }
  },

  createCourse: async (courseData) => {
    set({adminError: null});
    try{
        const newCourse = await courseService.create(courseData);
        set((state)=>({
            courses: [newCourse, ...state.courses]
        }));
        return true;
    }catch(error: any){
        set({
            adminError: error.response?.data?.message || "No se pudo crear el curso."
        });
        return false;
    }
  }
}));