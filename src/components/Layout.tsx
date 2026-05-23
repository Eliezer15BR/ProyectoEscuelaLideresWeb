import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const getLinkClass = (path: string) => {
        const isActive = location.pathname.includes(path);
        return `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
            isActive 
                ? 'bg-primary/10 text-primary-dark' 
                : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
            }`;
    }
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
        
        {/* BARRA LATERAL (Sidebar) */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo / Título */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">App Líderes</h1>
            </div>

            {/* Menú de Navegación */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* 2. Reemplazamos <a> por <Link> */}
            <Link to="/clases" className={getLinkClass('/clases')}>
                <span className="text-xl">📚</span> Mis Clases
            </Link>
            <Link to="/tareas" className={getLinkClass('/tareas')}>
                <span className="text-xl">✅</span> Tareas Pendientes
            </Link>
            
            {user?.rol !== 'Estudiante' && (
                <Link to="/admin" className={getLinkClass('/admin')}>
                <span className="text-xl">⚙️</span> Gestión de Cursos
                </Link>
            )}
            </nav>

            {/* Perfil y Logout (Abajo del todo) */}
            <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {user?.nombre?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{user?.nombre}</span>
                <span className="text-xs text-gray-500">{user?.rol}</span>
                </div>
            </div>
            
            <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
                Cerrar Sesión
            </button>
            </div>
        </aside>

        {/* ÁREA CENTRAL DE CONTENIDO */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8">
            {/* El contenido inyectado */}
            {children}
            </div>
        </main>
        </div>
    );
};