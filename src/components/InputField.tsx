import React from 'react'
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

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
        </label>

        <input
            id={inputId}
            className={`
            px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-900 
            transition-colors duration-200 focus:outline-none focus:bg-white focus:ring-2 
            ${error 
                ? 'border-red-500 focus:ring-red-200' // Estilos de error
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100' // Estilos normales
            }
            disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
            {...props}
        />

        {error && (
            <span className="text-sm text-red-500 font-medium">
            {error}
            </span>
        )}
        </div>
    );
};