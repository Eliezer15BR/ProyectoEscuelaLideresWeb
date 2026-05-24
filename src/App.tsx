import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoginScreen } from './features/auth/LoginScreen';
import { Layout } from './components/Layout';
import { CourseListScreen } from './features/courses/CourseListScreen';
import { CourseDetailScreen } from './features/courses/CourseDetailScreen';
import { CourseManagementScreen } from './features/admin/CourseManagementScreen';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { MaterialDetailScreen } from './features/courses/MaterialDetailScreen';
import { TareaDetailScreen } from './features/courses/TareaDetailScreen';
import { RevisionesScreen } from './features/courses/RevisionesScreen';

export const App = () => {
  const { isAuthenticated, checkAuth, isCheckingAuth } = useAuthStore();

  // Al abrir la app o presionar F5, ejecutamos la restauración de sesión
  useEffect(() => {
    checkAuth();
  }, []);

  // Para evitar que el Router intente redirigir antes de que sepamos si hay sesión
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        
        {/* RUTA PÚBLICA */}
        <Route 
          path="/" 
          element={ isAuthenticated ? <Navigate to="/clases" replace /> : <LoginScreen /> } 
        />

        {/* RUTAS PRIVADAS GENERALES (Para todos los roles) */}
        <Route path="/clases" element={
          <ProtectedRoute>
            <Layout><CourseListScreen /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/clases/:id" element={
          <ProtectedRoute>
            <Layout><CourseDetailScreen /></Layout>
          </ProtectedRoute>
        } />

        {/* --- RUTA BLINDADA (Solo Administradores) --- */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Layout><CourseManagementScreen /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Layout><ProfileScreen /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/clases/:id/material/:materialId" element={
          <ProtectedRoute>
            <Layout><MaterialDetailScreen /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/clases/:id/tarea/:taskId" element={
          <ProtectedRoute>
            <Layout><TareaDetailScreen /></Layout>
          </ProtectedRoute>
        } />
        {/* Panel de Revisiones del Profesor */}
        <Route path="/clases/:id/tarea/:taskId/revisiones" element={
          <ProtectedRoute allowedRoles={['Admin', 'Profesor']}>
            <Layout><RevisionesScreen /></Layout>
          </ProtectedRoute>
        } />
        {/* RUTA COMODÍN */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;