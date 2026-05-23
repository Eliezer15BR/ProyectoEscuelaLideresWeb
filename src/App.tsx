// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoginScreen } from './features/auth/LoginScreen';
import { Layout } from './components/Layout';
import { CourseListScreen } from './features/courses/CourseListScreen';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { CourseDetailScreen } from './features/courses/CourseDetailScreen';

export const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/clases" replace /> : <LoginScreen />
          } 
        />

        <Route
          path="/clases"
          element={
            <ProtectedRoute>
              <Layout>
                <CourseListScreen />
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
            path='/clases/:id'
            element={
              <ProtectedRoute>
                <Layout>
                  <CourseDetailScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;