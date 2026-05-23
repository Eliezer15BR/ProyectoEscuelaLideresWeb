interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null; // Si no está abierto, no renderiza nada

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
        {/* Contenedor del Modal */}
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            
            {/* Cabecera */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                ✕
            </button>
            </div>
            
            {/* Cuerpo */}
            <div className="p-6">
            {children}
            </div>

        </div>
        </div>
    );
};