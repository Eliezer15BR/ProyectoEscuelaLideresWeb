import React from 'react'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props // Captura cualquier otra propiedad nativa (onClick, type, etc.)
}: ButtonProps) => {
  // 2. Diccionario de estilos base para mantener el diseño minimalista
    const baseStyles = "relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium tracking-wide rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100";
  // 3. Estilos específicos según la variante
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary border border-transparent shadow-md shadow-primary/20",
        secondary: "bg-surface-white text-primary hover:bg-background-light focus:ring-secondary border border-secondary shadow-sm shadow-secondary/20",
        danger: "bg-error text-white hover:bg-red-700 focus:ring-error border border-transparent shadow-md shadow-error/20",
    };

  // 4. Combinamos todas las clases
    const combinedClasses = `
        ${baseStyles} 
        ${variants[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
    `;

    return (
        <button 
        className={combinedClasses}
        disabled={disabled || isLoading}
        {...props}
            >
        {/* Si está cargando, mostramos un pequeño spinner minimalista */}
        {isLoading && (
            <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        )}
        
        {/* El contenido del botón (texto o íconos) */}
        <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
            {children}
        </span>
        
        {/* Mantenemos el texto invisible si está cargando para que el botón no cambie de tamaño */}    
        {isLoading && (
            <span className="absolute">
            Cargando...
            </span>
        )}
        </button>
    );
};