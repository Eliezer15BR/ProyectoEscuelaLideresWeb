import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogoInst } from './LogoInst';
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  // Definimos los items del menú
  const menuItems = [
    {
      label: 'Mis Clases',
      path: '/clases',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      roles: ['Estudiante', 'Profesor', 'Admin']
    },
    {
      label: 'Pendientes',
      path: '/pendientes',
      icon: (
        <span className="text-xl leading-none">📋</span>
      ),
      roles: ['Estudiante']
    },
    {
      label: 'Gestión Cursos',
      path: '/cursos',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      roles: ['Admin']
    },
    // --- NUEVO ITEM: GESTIÓN DE USUARIOS ---
    {
      label: 'Gestión Usuarios',
      path: '/usuarios',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      roles: ['Admin']
    },
    {
      label: 'Accesos',
      path: '/logs',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      roles: ['Admin']
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-surface-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        
        {/* Logo / Título */}
        <div className="p-5 border-gray-100 bg-primary h-1/4 flex flex-col justify-center items-center rounded-b-sm">
          <Link 
            to="/perfil"
            className={`group hover:bg-gray-50 flex flex-col items-center justify-center gap-3 p-3 rounded-2xl transition-all duration-500 ${
              location.pathname === '/perfil' 
                ? ' ring-1 ring-gray-200' : ''
            }`}
          >
            {/* Avatar con Inicial */}
            <div className="w-11 h-11 rounded-full bg-white text-primary flex items-center justify-center font-black text-lg border-2 border-surface-white shadow-sm group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition">
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="min-w-0">
              <p className="text-sm font-black text-white truncate group-hover:text-primary">{user?.nombre}</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${user?.rol === 'Admin' ? 'bg-purple-500' : 'bg-green-500'}`}></span>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">{user?.rol}</p>
              </div>
            </div>
          </Link>
        </div>
        {/* Navegación Principal */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            // Filtro de roles: Si la ruta requiere un rol que el usuario no tiene, no la mostramos
            if (!item.roles.includes(user?.rol || '')) return null;

            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-surface-white shadow-md shadow-primary/20 scale-[1.02]' 
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
          <a href="https://soceiqaap.wordpress.com/" target='blank' className='flex justify-center'>
            <LogoInst className="p-3 w-30 self-center bg-pink-900 rounded-4xl mb-5 btn-animated"/>
          </a>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light">
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-6xl mx-auto p-8 lg:p-12">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
};