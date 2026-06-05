import { create } from 'zustand';
import { adminService, type Professor, type Student } from '../services/adminService';
import { courseService, type Course } from '../../services/courseService';

interface AdminState {
  students: Student[];
  courses: Course[];
  professors: Professor[];
  isLoadingProfessors: boolean;
  isLoadingStudents: boolean;
  isLoadingCourses: boolean;
  adminError: string | null;
  currentCourseStudents: any[]; 
  isLoadingCourseStudents: boolean;
  fetchStudents: () => Promise<void>;
  fetchAllCourses: () => Promise<void>;
  fetchProfessors: () => Promise<void>;
  enrollStudentInCourse: (courseId: number, studentId: number) => Promise<boolean>;
  createCourse: (courseData: Omit<Course, 'id_curso'>) => Promise<boolean>;
  clearAdminError: () => void;
  fetchCourseStudents: (courseId: number) => Promise<void>;
  unenrollStudent: (inscripcionId: number) => Promise<boolean>;
  clearCurrentCourseStudents: () => void;
  updateCourse: (id: number, courseData: Partial<Course>) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set,get) => ({
  currentCourseStudents: [],
  isLoadingCourseStudents: false,
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
  },
  fetchCourseStudents: async (courseId: number) => {
    set({ isLoadingCourseStudents: true, adminError: null });
    try {
      const data = await adminService.getCourseStudents(courseId);
      set({ currentCourseStudents: data, isLoadingCourseStudents: false });
    } catch (error: any) {
      set({ 
        adminError: error.response?.data?.message || 'Error al cargar los inscritos.', 
        isLoadingCourseStudents: false 
      });
    }
  },

  // 🗑️ DESINSCRIBIR
  unenrollStudent: async (inscripcionId: number) => {
    set({ adminError: null });
    try {
      await adminService.unenrollStudent(inscripcionId);
      
      // Magia de Zustand: Actualizamos el estado local inmediatamente sin volver a consultar al backend
      const { currentCourseStudents } = get();
      set({
        currentCourseStudents: currentCourseStudents.filter(
          (inscripcion) => inscripcion.id_inscripcion !== inscripcionId
        )
      });
      return true;
    } catch (error: any) {
      set({ adminError: error.response?.data?.message || 'Error al desinscribir al estudiante.' });
      return false;
    }
  },
  clearCurrentCourseStudents: () => set({ currentCourseStudents: [] }),
  updateCourse: async (id, courseData) => {
    set({ adminError: null });
    try {
      // Asegúrate de tener este método en tu courseService (ej. apiClient.patch(`/curso/${id}`, data))
      const updatedCourse = await courseService.update(id, courseData);
      
      set((state) => ({
        // Actualizamos el curso en la lista local para no recargar la página
        courses: state.courses.map((c) => 
          c.id_curso === id ? { ...c, ...updatedCourse } : c
        )
      }));
      return true;
    } catch (error: any) {
      set({
        adminError: error.response?.data?.message || "No se pudo actualizar el curso."
      });
      return false;
    }
  },
}));