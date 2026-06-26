import { useState } from 'react';
import { Card } from '../../components/Card';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/apiClient';
import { LogoInst } from '../../components/LogoInst';

export const LoginScreen = () => {
  // 1. Estados locales para capturar lo que escribe el usuario
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    
    // Estados para controlar la UI (carga y errores)
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // 2. Traemos la acción 'login' de nuestro store global de Zustand
    const loginGlobal = useAuthStore((state) => state.login);
    // 3. Manejador del envío del formulario
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault(); // Evita que la página se recargue (comportamiento nativo de HTML)
        setFormError(null);

        // Validación básica antes de gastar recursos llamando a la API
        if (!correo.trim() || !password.trim()) {
            setFormError('Por favor, llena todos los campos.');
            return;
        }
        setIsLoading(true);
        try {
        // 4. Petición a tu backend en NestJS usando el cliente centralizado
        const response = await apiClient.post('/auth/login', {
            correo,
            password,
        });
        const { access_token } = response.data;
        loginGlobal(null as any, access_token);
        const user = await apiClient.get('/auth/profile');
        const userData = user.data;
        loginGlobal(userData, access_token);
        } catch (error: any) {
        // Manejo de errores de Axios seguro
        if (error.response && error.response.data) {
            setFormError(error.response.data.message || 'Credenciales incorrectas');
        } else {
            setFormError('No se pudo conectar con el servidor. Intenta más tarde.');
        }
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-secondary flex flex-col justify-center py-2 sm:px-6 lg:px-8">
        
        <div className="sm:mx-auto w-full max-w-md flex flex-col items-center mb-6">
            <div className="bg-surface-white/10 p-4 rounded-3xl backdrop-blur-md shadow-xl border border-white/20">
                <LogoInst className="flex justify-center items-center m-auto w-40"/>
            </div>
        </div>

        <div className="mt-8 sm:mx-auto w-full max-w-md px-4 sm:px-0">
            {/* Nuestro componente Card conteniendo el formulario */}
            <Card className="bg-surface-white shadow-2xl">
            <h2 className="mb-6 text-2xl font-black text-text-primary text-center">
                Bienvenido de nuevo
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {formError && (
                <div className="p-3 bg-error/10 border border-error/20 text-error text-sm font-medium rounded-xl animate-fade-in text-center">
                    {formError}
                </div>
                )}

                <InputField
                label="Correo electrónico"
                type="email"
                placeholder="nombre@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                disabled={isLoading}
                required
                />

                <InputField
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                />
                {/* Separación sutil antes del botón */}
                <div className="pt-2">
                <Button 
                    type="submit" 
                    fullWidth 
                    isLoading={isLoading}
                >
                    Iniciar Sesión
                </Button>
                </div>

            </form>
            </Card>
        </div>

        </div>
    );
};