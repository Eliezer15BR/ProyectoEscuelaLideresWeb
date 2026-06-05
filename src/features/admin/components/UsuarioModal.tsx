import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/Button';
import { InputField } from '../../../components/InputField';
import { SelectField } from '../../../components/SelectField';
import { useUsuarioStore } from '../hooks/useUsuarioStores';


interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: any | null;
}

export const UsuarioModal = ({ isOpen, onClose, userToEdit }: UsuarioModalProps) => {
  const { createUsuario, updateUsuario, usuarioError } = useUsuarioStore();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'Estudiante'
  });

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setFormData({ nombre: userToEdit.nombre, correo: userToEdit.correo, password: '', rol: userToEdit.rol });
      } else {
        setFormData({ nombre: '', correo: '', password: '', rol: 'Estudiante' });
      }
    }
  }, [isOpen, userToEdit]);

  if (!isOpen) return null;

  const evaluarFuerzaPassword = (password: string) => {
    if (!password) return { nivel: '', color: 'bg-gray-200', ancho: 'w-0', texto: '' };
    const esFuerte = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
    if (esFuerte) return { nivel: 'Fuerte', color: 'bg-green-500', ancho: 'w-full', texto: 'text-green-600' };
    const esIntermedio = password.length >= 8 && (/[A-Z]/.test(password) && /[0-9]/.test(password)) && /[a-z]/.test(password);
    if (esIntermedio) return { nivel: 'Intermedio', color: 'bg-orange-400', ancho: 'w-2/3', texto: 'text-orange-500' };
    if (password.length >= 8) return { nivel: 'Débil', color: 'bg-red-500', ancho: 'w-1/3', texto: 'text-red-500' };
    return { nivel: 'No valido', color: 'bg-gray-400', ancho: 'w-0', texto: 'text-gray-500' };
  };

  const fuerzaPassword = evaluarFuerzaPassword(formData.password);
  const opcionesRol = [
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Profesor', label: 'Profesor' },
    { value: 'Admin', label: 'Administrador' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit || (userToEdit && formData.password)) {
      if (fuerzaPassword.nivel === 'No valido' || fuerzaPassword.nivel === 'Débil') {
        alert('Ingresa una contraseña de al menos 8 caracteres y mayor complejidad.');
        return;
      }
    }
    
    setIsSaving(true);
    const { password, ...restoDeDatos } = formData;
    const payload = (userToEdit && !password) ? restoDeDatos : formData;
    
    const success = userToEdit 
      ? await updateUsuario(userToEdit.id_usuario, payload)
      : await createUsuario(payload);
    
    setIsSaving(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-white rounded-2xl p-8 w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-dark">
            {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Nombre completo" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
          <InputField type="email" label="Correo electrónico" value={formData.correo} onChange={(e) => setFormData({...formData, correo: e.target.value})} required />
          <InputField 
            type="password" 
            label={userToEdit ? "Nueva Contraseña (en blanco para mantener)" : "Contraseña"} 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required={!userToEdit} 
          />
          
          {formData.password.length > 0 && (
            <div className="mt-2 animate-fade-in">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Seguridad</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${fuerzaPassword.texto}`}>{fuerzaPassword.nivel}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full transition-all duration-300 ${fuerzaPassword.color} ${fuerzaPassword.ancho}`}></div>
              </div>
            </div>
          )}

          <div className="relative z-50">
            <SelectField label="Rol del sistema" options={opcionesRol} value={formData.rol} onChange={(value) => setFormData({...formData, rol: String(value)})} />
          </div>

          {usuarioError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 mt-2">{usuarioError}</div>}

          <div className="flex gap-3 pt-6 mt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm" disabled={isSaving}>
              Cancelar
            </button>
            <div className="flex-1">
              <Button type="submit" isLoading={isSaving} fullWidth>{userToEdit ? 'Actualizar' : 'Crear'}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};