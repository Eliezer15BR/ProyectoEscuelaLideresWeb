// src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Si no está logueado, lo pateamos a la pantalla de login ("/")
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si tiene el token, lo dejamos pasar al contenido
  return <>{children}</>;
};