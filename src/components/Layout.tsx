import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogoInst } from './LogoInst';
import { courseService } from '../features/services/courseService';
import type { Course } from '../features/services/courseService';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Estado para las clases que cursa
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);

  useEffect(() => {
    // Si es estudiante o profesor, traemos sus cursos
    if (user && (user.rol === 'Estudiante' || user.rol === 'Profesor')) {
        courseService.getMyCourses()
            .then(data => setCourses(data))
            .catch(err => console.error("Error cargando cursos en Layout:", err));
    }
  }, [user]);

  // Definimos los items del menú (quitamos Mis Clases porque será el general, y Clases que cursas será el desplegable)
  const topMenuItems = [
    {
      label: 'Inicio',
      path: '/clases',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
    }
  ];

  const adminMenuItems = [
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
    <div className="flex flex-col h-screen overflow-hidden bg-background-light">
      
      {/* --- NAVBAR SUPERIOR --- */}
      <header className="h-16 bg-surface-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-40 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          {/* Botón de Menú (Hamburger) */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-full hover:bg-gray-100 text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Alternar menú"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo y Nombre en el Navbar */}
          <Link to="/clases" className="flex items-center gap-3 transition-transform hover:scale-105">
             <span className="text-xl font-bold text-primary hidden sm:block">SOCEIQAPP</span>
          </Link>
        </div>
        
        {/* Eliminamos el perfil duplicado de aquí, tal como pediste */}
        <div className="flex items-center gap-4">
            {/* Espacio reservado para iconos de notificaciones en el futuro */}
        </div>
      </header>

      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- SIDEBAR --- */}
        <aside 
          className={`bg-surface-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden absolute sm:relative z-30 h-full
            ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full border-none'}`}
        >
          {/* HEADER DEL SIDEBAR (Estilo App Móvil) */}
          <div className="bg-primary p-6 flex flex-col justify-end min-h-[180px] shrink-0">
            <Link to="/perfil" className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border-2 border-white/20 hover:scale-105 transition-transform cursor-pointer">
               {user?.nombre ? (
                 <span className="text-2xl font-black text-primary">{user.nombre.charAt(0).toUpperCase()}</span>
               ) : (
                <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
               )}
            </Link>
            <h2 className="text-white font-bold text-xl leading-tight truncate">{user?.nombre || 'Usuario'}</h2>
            <p className="text-white/80 text-sm truncate mt-0.5">{user?.correo || user?.rol || 'usuario@correo.com'}</p>
          </div>

          {/* Navegación Principal (Scrollable) */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-3 space-y-1 mt-2">
                {topMenuItems.map((item) => {
                if (!item.roles.includes(user?.rol || '')) return null;

                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
                return (
                    <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-r-2xl font-bold text-[15px] transition-colors mr-4 ${
                        isActive 
                        ? 'bg-primary/10 text-primary-dark' 
                        : 'text-text-primary hover:bg-gray-50'
                    }`}
                    >
                    <span className={isActive ? 'text-primary' : 'text-primary/70'}>
                        {item.icon}
                    </span>
                    {item.label}
                    </Link>
                );
                })}

                {/* --- SECCIÓN: CLASES QUE CURSAS --- */}
                {(user?.rol === 'Estudiante' || user?.rol === 'Profesor') && (
                    <div className="mt-2">
                        <button 
                            onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-r-2xl font-bold text-[15px] text-text-primary hover:bg-gray-50 transition-colors mr-4 focus:outline-none"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-primary/70">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5-9 5" />
                                    </svg>
                                </span>
                                {user?.rol === 'Profesor' ? 'Clases que dictas' : 'Clases que cursas'}
                            </div>
                            <svg 
                                className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isCoursesOpen ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {/* Lista desplegable de cursos */}
                        <div className={`overflow-hidden transition-all duration-300 ${isCoursesOpen ? 'max-h-96' : 'max-h-0'}`}>
                            <div className="py-1 space-y-1">
                                {courses.length === 0 ? (
                                    <p className="px-12 py-2 text-sm text-text-secondary italic">No hay clases aún.</p>
                                ) : (
                                    courses.map(course => (
                                        <Link 
                                            key={course.id_curso}
                                            to={`/clases/${course.id_curso}`}
                                            className="flex items-center gap-3 pl-12 pr-4 py-2.5 text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary/5 rounded-r-2xl mr-4 transition-colors truncate"
                                            title={course.nombre}
                                        >
                                            <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                                            <span className="truncate">{course.nombre}</span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SECCIÓN: ADMINISTRACIÓN --- */}
                {user?.rol === 'Admin' && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="px-4 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Administración</p>
                        {adminMenuItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-r-2xl font-bold text-[15px] transition-colors mr-4 ${
                                    isActive 
                                    ? 'bg-primary/10 text-primary-dark' 
                                    : 'text-text-primary hover:bg-gray-50'
                                }`}
                                >
                                <span className={isActive ? 'text-primary' : 'text-primary/70'}>
                                    {item.icon}
                                </span>
                                {item.label}
                                </Link>
                            );
                        })}
                    </div>
                )}

            </nav>
            
            {/* Logo Inferior Opcional */}
            <div className="p-4 flex justify-center mt-6 mb-4">
                <a href="https://soceiqaap.wordpress.com/" target="_blank" rel="noopener noreferrer">
                <LogoInst className="w-24 opacity-50 hover:opacity-100 transition-opacity drop-shadow-sm"/>
                </a>
            </div>
          </div>
        </aside>

        {/* OVERLAY PARA MÓVILES (Si el sidebar está abierto en pantallas pequeñas) */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/20 z-20 sm:hidden backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="flex-1 overflow-y-auto w-full h-full">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};