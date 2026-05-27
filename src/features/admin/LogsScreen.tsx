import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/apiClient';

export const LogsScreen = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;
  // --- 🛡️ PROTECCIÓN DE RUTA ---
  useEffect(() => {
    // Si ya cargó el usuario y no es Admin, lo sacamos de aquí
    if (user && user.rol !== 'Admin') {
      navigate('/clases'); // Redirígelo a donde tenga sentido en tu app
    }
  }, [user, navigate]);

  // --- 📡 CARGA DE DATOS ---
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true); // Mostrar loading al cambiar de página
      try {
        const response = await apiClient.get(`/log-acceso?page=${currentPage}&limit=${limit}`); 
        setLogs(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        console.error('Error al cargar la bitácora', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.rol === 'Admin') {
      fetchLogs();
    }
  }, [user, currentPage]);

  // --- 🎨 RENDERIZADO DEL BADGE ---
  const renderEventoBadge = (evento: string) => {
    const isIngreso = evento.toLowerCase() === 'ingreso';
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isIngreso ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {evento}
      </span>
    );
  };

  if (isLoading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto py-6 animate-fade-in pb-10">
      
      {/* CABECERA */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-primary-dark">Bitácora de Accesos</h1>
        <p className="text-sm text-text-secondary mt-1">
          Registro de auditoría de ingresos y salidas del sistema.
        </p>
      </div>

      {/* TABLA DE LOGS */}
      <div className="bg-surface-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Fecha y Hora</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Usuario</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Evento</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">IP</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Navegador / SO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary italic">
                    No hay registros en la bitácora aún.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* FECHA FORMATEADA */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-text-primary">
                        {new Date(log.fecha).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {new Date(log.fecha).toLocaleTimeString('es-ES')}
                      </div>
                    </td>

                    {/* USUARIO */}
                    <td className="p-4 text-sm font-medium text-text-primary">
                      {log.usuario}
                    </td>

                    {/* EVENTO (BADGE) */}
                    <td className="p-4 whitespace-nowrap">
                      {renderEventoBadge(log.evento)}
                    </td>

                    {/* DIRECCIÓN IP */}
                    <td className="p-4 text-sm font-mono text-text-secondary">
                      {log.ip}
                    </td>

                    {/* NAVEGADOR (USER AGENT) */}
                    <td className="p-4 text-xs text-text-secondary max-w-xs truncate" title={log.browser}>
                      {log.browser}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
              {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-6 mt-2">
          <span className="text-sm text-text-secondary">
            Página <span className="font-bold text-text-primary">{currentPage}</span> de <span className="font-bold text-text-primary">{totalPages}</span>
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-text-secondary"
            >
              Anterior
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-text-secondary"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};