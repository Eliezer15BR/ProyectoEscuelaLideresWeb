import { create } from 'zustand';
import { apiClient } from '../api/apiClient'; // Importamos el cliente para hacer la validación

export interface User {
    id_usuario: number; // o 'id', según tu backend
    nombre: string;
    rol: 'Profesor' | 'Estudiante' | 'Admin';
    correo: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean; // <-- NUEVO: Para saber si estamos validando el F5
    login: (userData: User, token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>; // <-- NUEVO: La función que restaura la sesión
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true, // Arranca en true para que no parpadee el login al recargar

    login: (userData, token) => {
        localStorage.setItem('app_lideres_jwt_token', token);
        set({ user: userData, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('app_lideres_jwt_token');
        set({ user: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('app_lideres_jwt_token');
        
        // Si no hay token guardado, cortamos de inmediato
        if (!token) {
            set({ isCheckingAuth: false, isAuthenticated: false, user: null });
            return;
        }

        try {
            // Si hay token (el apiClient lo enviará automáticamente gracias a tu interceptor)
            // Le pedimos al backend los datos frescos del usuario
            const response = await apiClient.get('/auth/profile');
            
            // ¡Sesión restaurada con éxito!
            set({ user: response.data, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            // Si el token expiró o es inválido, limpiamos todo por seguridad
            localStorage.removeItem('app_lideres_jwt_token');
            set({ isCheckingAuth: false, isAuthenticated: false, user: null });
        }
    },
}));