import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/Card';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Función para extraer las iniciales para el avatar (ej: "Juan Pérez" -> "JP")
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Lo mandamos de vuelta al login
  };

  if (!user) return null;

  // Asignamos un color al badge dependiendo del rol
  const roleColors = {
    Admin: 'bg-purple-100 text-purple-700 border-purple-200',
    Profesor: 'bg-blue-100 text-blue-700 border-blue-200',
    Estudiante: 'bg-green-100 text-green-700 border-green-200',
  };

  const badgeColor = roleColors[user.rol] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in py-10">
      
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-primary-dark mb-6 text-center">Mi Perfil</h1>
        
        <Card>
          <div className="p-8 flex flex-col items-center">
            
            {/* Avatar Minimalista */}
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-extrabold mb-4 shadow-sm">
              {getInitials(user.nombre)}
            </div>

            {/* Datos del Usuario */}
            <h2 className="text-2xl font-bold text-text-primary text-center mb-1">
              {user.nombre}
            </h2>
            
            {/* Badge del Rol */}
            <div className={`px-3 py-1 mt-2 rounded-full border text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
              {user.rol}
            </div>

            {/* Línea divisoria sutil */}
            <div className="w-full h-px bg-gray-100 my-6"></div>

            {/* Más información (si tu backend devuelve el correo u otros datos, los puedes poner aquí) */}
            <div className="w-full space-y-4">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Correo Electrónico</p>
                <p className="text-text-primary font-medium">{user.correo}</p>
              </div>
            </div>

            <div className="w-full mt-8">
              <button 
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold rounded-xl transition-colors border border-red-100 flex items-center justify-center gap-2"
              >
                <span>🚪</span> Cerrar Sesión
              </button>
            </div>

          </div>
        </Card>
      </div>

    </div>
  );
};