interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
    error?: string;
}

export const Select = ({ 
    label, 
    options, 
    error, 
    id, 
    className = '', 
    ...props 
}: SelectProps) => {
    const selectId = id || `select-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
            {label}
        </label>
        <select
            id={selectId}
            className={`
            px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-900 appearance-none
            transition-colors duration-200 focus:outline-none focus:bg-white focus:ring-2 
            ${error 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
            }
            disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
            {...props}
        >
            <option value="" disabled hidden>Selecciona una opción</option>
            {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
            ))}
        </select>
        {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
        </div>
    );
};