import { useState, useRef, useEffect } from 'react';

// Definimos la forma estándar de las opciones
export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SelectField = ({ label, options, value, onChange, placeholder = 'Seleccionar...', disabled }: SelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Buscamos cuál es el texto que se debe mostrar en la cajita
  const selectedOption = options.find((opt) => opt.value === value);

  // Truco de magia: Cerrar el menú si el usuario hace clic en cualquier otra parte de la pantalla
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-bold text-text-primary mb-1.5">{label}</label>
      
      {/* La "Cajita" que parece un input */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all cursor-pointer select-none
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary/30'}
          ${isOpen ? 'border-primary/50 ring-2 ring-primary/10' : ''}
        `}
      >
        <span className={selectedOption ? 'text-text-primary' : 'text-text-secondary'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        {/* Flechita SVG minimalista que gira cuando se abre */}
        <svg 
          className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* El menú desplegable flotante */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-surface-white border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-fade-in-up py-1">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-text-secondary text-center">No hay opciones</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false); // Cerramos al elegir
                }}
                className={`
                  px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${value === option.value 
                    ? 'bg-primary/10 text-primary-dark font-bold border-l-2 border-primary' 
                    : 'text-text-primary hover:bg-gray-50'
                  }
                `}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};