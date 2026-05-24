import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: React.ReactNode;
  allowedRoles?: ('Admin' | 'Profesor' | 'Estudiante')[]; // <-- Propiedad opcional
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  // 1. Mientras revisa el token por el F5, mostramos un spinner en lugar de enviarlo al Login
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Si definitivamente no está logueado, lo pateamos al Login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. EL ESCUDO DE ROLES: Si la ruta exige roles específicos y el usuario no los tiene
  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    // Lo devolvemos a una ruta segura (sus clases)
    return <Navigate to="/clases" replace />;
  }

  // 4. Si todo está bien, lo dejamos pasar
  return <>{children}</>;
};