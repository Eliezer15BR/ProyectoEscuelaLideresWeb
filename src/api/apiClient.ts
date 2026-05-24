import axios from 'axios'
import { useAuthStore } from '../store/authStore';
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-type': 'application/json',
    }
});
apiClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem('app_lideres_jwt_token');
    if(token && config.headers){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},(error) => {
    if(error.response && error.response.status === 401){
        console.warn("La sesión expiro o el token es invalido");
        useAuthStore.getState().logout();
        alert("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión")
    }
    return Promise.reject(error);
})