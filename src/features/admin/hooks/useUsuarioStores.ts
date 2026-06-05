import { create } from 'zustand';
// Ajusta la ruta de tu servicio según tu estructura de carpetas
import { usuarioService } from '../services/usuarioService'; 

interface UsuarioState {
  usuarios: any[];
  isLoadingUsuarios: boolean;
  usuarioError: string | null;

  fetchUsuarios: () => Promise<void>;
  createUsuario: (payload: any) => Promise<boolean>;
  updateUsuario: (id: number, payload: any) => Promise<boolean>;
  deleteUsuario: (id: number) => Promise<boolean>;
  clearUsuarioError: () => void;
}

export const useUsuarioStore = create<UsuarioState>((set, get) => ({
  usuarios: [],
  isLoadingUsuarios: false,
  usuarioError: null,

  clearUsuarioError: () => set({ usuarioError: null }),

  fetchUsuarios: async () => {
    set({ isLoadingUsuarios: true, usuarioError: null });
    try {
      const data = await usuarioService.getAll();
      set({ usuarios: data, isLoadingUsuarios: false });
    } catch (error: any) {
      set({ 
        usuarioError: error.response?.data?.message || 'Error al cargar los usuarios.', 
        isLoadingUsuarios: false 
      });
    }
  },

  createUsuario: async (payload) => {
    set({ usuarioError: null });
    try {
      const newUser = await usuarioService.create(payload);
      // Actualizamos la tabla localmente sin recargar la página
      set((state) => ({ usuarios: [...state.usuarios, newUser] }));
      return true;
    } catch (error: any) {
      set({ usuarioError: error.response?.data?.message || 'Error al crear el usuario.' });
      return false;
    }
  },

  updateUsuario: async (id, payload) => {
    set({ usuarioError: null });
    try {
      await usuarioService.update(id, payload);
      // Volvemos a pedir la lista para asegurar que datos como el Badge de Rol vengan correctos
      await get().fetchUsuarios(); 
      return true;
    } catch (error: any) {
      set({ usuarioError: error.response?.data?.message || 'Error al actualizar el usuario.' });
      return false;
    }
  },

  deleteUsuario: async (id) => {
    set({ usuarioError: null });
    try {
      await usuarioService.delete(id);
      // Filtramos de la memoria el usuario eliminado para que la UI reaccione al instante
      set((state) => ({
        usuarios: state.usuarios.filter((u) => u.id_usuario !== id),
      }));
      return true;
    } catch (error: any) {
      set({ usuarioError: error.response?.data?.message || 'Error al eliminar usuario. Puede que tenga datos asociados.' });
      return false;
    }
  },
}));