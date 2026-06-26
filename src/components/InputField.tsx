import React, { useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const InputField = ({ 
    label, 
    error, 
    id, 
    className = '', 
    ...props 
}: InputFieldProps) => {
    // Generamos un ID automático si no se pasa uno (útil para la accesibilidad del label)
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    // NUEVO: Estado local para manejar la visibilidad
    const [mostrarPassword, setMostrarPassword] = useState(false);

    // NUEVO: Verificamos si este input fue declarado como contraseña
    const esTipoPassword = props.type === 'password';
    
    // NUEVO: Decidimos si lo renderizamos como texto o como contraseña
    const tipoInputFinal = esTipoPassword && mostrarPassword ? 'text' : props.type;

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                {label}
            </label>

            {/* NUEVO: Contenedor relativo para posicionar el ícono adentro */}
            <div className="relative w-full">
                <input
                    id={inputId}
                    {...props} // Pasamos todas las props primero
                    type={tipoInputFinal} // IMPORTANTE: Sobrescribimos el type al final
                    className={`
                        w-full px-4 py-2.5 rounded-xl border bg-gray-50/50 text-text-primary 
                        transition-all duration-300 focus:outline-none focus:bg-surface-white focus:ring-2 
                        ${esTipoPassword ? 'pr-12' : ''} /* Padding derecho si es password para no pisar el ícono */
                        ${error 
                            ? 'border-error focus:border-error focus:ring-error/20' // Estilos de error
                            : 'border-gray-200 focus:border-primary focus:ring-primary/20 hover:border-secondary/50' // Estilos normales
                        }
                        disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed
                    `}
                />

                {/* NUEVO: El botón del ojito */}
                {esTipoPassword && (
                    <button
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary focus:outline-none transition-colors"
                        title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {mostrarPassword ? (
                            // Ícono Ojo Tachado
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            // Ícono Ojo Abierto
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {error && (
                <span className="text-sm text-error font-medium">
                    {error}
                </span>
            )}
        </div>
    );
};