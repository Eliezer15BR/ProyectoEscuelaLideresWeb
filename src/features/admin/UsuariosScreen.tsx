import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { UsuarioModal } from './components/UsuarioModal'; // Ajusta la ruta a donde guardaste el modal
import { useUsuarioStore } from './hooks/useUsuarioStores';

export const UsuariosScreen = () => {
  const { usuarios, isLoadingUsuarios, usuarioError, fetchUsuarios, deleteUsuario } = useUsuarioStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [busqueda, setBusqueda] = useState(''); // Estado para el buscador

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const openModal = (user: any = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este usuario de forma irreversible?')) return;
    const success = await deleteUsuario(id);
    if (!success) alert(usuarioError || 'Error al eliminar usuario.');
  };

  const renderRoleBadge = (rol: string) => {
    const styles: Record<string, string> = {
      Admin: 'bg-purple-100 text-purple-700',
      Profesor: 'bg-blue-100 text-blue-700',
      Estudiante: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[rol] || styles.Estudiante}`}>
        {rol}
      </span>
    );
  };

  // Filtrado dinámico por nombre o correo
  const usuariosFiltrados = usuarios.filter(user => 
    user.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    user.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (isLoadingUsuarios) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6 animate-fade-in">
      
      {/* CABECERA Y BUSCADOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Gestión de Usuarios</h1>
          <p className="text-sm text-text-secondary mt-1">Administra el acceso a la plataforma.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2.5 bg-surface-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all"
          />
          <Button onClick={() => openModal()}>+ Nuevo Usuario</Button>
        </div>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-surface-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {usuariosFiltrados.length === 0 ? (
          <div className="p-10 text-center text-text-secondary">
            <span className="text-4xl block mb-3">📭</span>
            <p>{busqueda ? 'No se encontraron resultados.' : 'No hay usuarios registrados.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Nombre</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Rol</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuariosFiltrados.map((user) => (
                  <tr key={user.id_usuario} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-text-primary">{user.nombre}</td>
                    <td className="p-4 text-sm text-text-secondary">{user.correo}</td>
                    <td className="p-4">{renderRoleBadge(user.rol)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(user)} className="p-2 text-text-secondary hover:bg-green-200 transition-colors rounded-xl" title="Editar">✏️</button>
                      <button onClick={() => handleDelete(user.id_usuario)} className="p-2 text-text-secondary hover:bg-red-200 transition-colors ml-2 rounded-xl" title="Eliminar">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL EXTERNO */}
      <UsuarioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userToEdit={editingUser} 
      />
    </div>
  );
};