import {create} from 'zustand'
interface User{
    id: number;
    nombre: string;
    rol: 'Profesor'|'Estudiante'|'Admin';
}
interface AuthState{
    user: User| null;
    isAuthenticated: boolean;
    login:(userData:User, token: string)=> void;
    logout: () => void;
}
export const useAuthStore = create<AuthState>((set)=>({
    user: null,
    isAuthenticated: false,
    login: (userData,token)=>{
        localStorage.setItem('app_lideres_jwt_token', token);
        set({
            user: userData,
            isAuthenticated: true,
        });
    },
    logout: () =>{
        localStorage.removeItem('app_lideres_jwt_token');
        set({
            user: null,
            isAuthenticated: false
        });
    },
}));