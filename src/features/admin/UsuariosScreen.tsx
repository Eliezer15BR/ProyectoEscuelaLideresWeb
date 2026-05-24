import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { usuarioService } from './services/usuarioService';
import { SelectField } from '../../components/SelectField';

export const UsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'Estudiante'
  });

  const loadUsuarios = async () => {
    try {
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ nombre: '', correo: '', password: '', rol: 'Estudiante' });
    setIsModalOpen(true);
  };
  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({ 
      nombre: user.nombre, 
      correo: user.correo, 
      password: '', // Dejamos la contraseña en blanco por seguridad, solo se envía si se escribe algo
      rol: user.rol 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData };
      // Si estamos editando y no escribió password nuevo, lo quitamos del payload
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await usuarioService.update(editingUser.id_usuario, payload);
      } else {
        await usuarioService.create(payload);
      }
      
      await loadUsuarios();
      setIsModalOpen(false);
    } catch (error) {
      alert('Error al guardar el usuario.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción es irreversible.')) return;
    try {
      await usuarioService.delete(id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
      await loadUsuarios();
    } catch (error) {
      alert('Error al eliminar usuario. Puede que tenga datos asociados.');
    }
  };

  // --- RENDERIZADO DEL BADGE DE ROL ---
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
  const opcionesRol = [
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Profesor', label: 'Profesor' },
    { value: 'Admin', label: 'Administrador' }
  ];
  if (isLoading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-6xl mx-auto py-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">Gestión de Usuarios</h1>
          <p className="text-sm text-text-secondary mt-1">Administra el acceso a la plataforma.</p>
        </div>
        <Button onClick={openCreateModal}>+ Nuevo Usuario</Button>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-surface-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
              {usuarios.map((user) => (
                <tr key={user.id_usuario} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-text-primary">{user.nombre}</td>
                  <td className="p-4 text-sm text-text-secondary">{user.correo}</td>
                  <td className="p-4">{renderRoleBadge(user.rol)}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditModal(user)} className="p-2 text-text-secondary hover:text-blue-600 transition-colors" title="Editar">✏️</button>
                    <button onClick={() => handleDelete(user.id_usuario)} className="p-2 text-text-secondary hover:text-red-600 transition-colors ml-2" title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-primary-dark mb-6">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField 
                label="Nombre completo" 
                value={formData.nombre} 
                onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                required 
              />
              <InputField 
                type="email" 
                label="Correo electrónico" 
                value={formData.correo} 
                onChange={(e) => setFormData({...formData, correo: e.target.value})} 
                required 
              />
              <InputField 
                type="password" 
                label={editingUser ? "Nueva Contraseña (dejar en blanco para mantener)" : "Contraseña"} 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required={!editingUser} 
              />
              
              <div>
                <div className="z-50 relative">
                <SelectField 
                  label="Rol del sistema"
                  options={opcionesRol}
                  value={formData.rol}
                  onChange={(value) => setFormData({...formData, rol: String(value)})}
                />
              </div>
              </div>

              <div className="flex gap-3 pt-6 mt-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <div className="flex-1">
                  <Button type="submit" isLoading={isSaving} fullWidth>
                    {editingUser ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};