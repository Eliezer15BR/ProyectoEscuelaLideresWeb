interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export const TextArea = ({ 
    label, 
    error, 
    id, 
    className = '', 
    rows = 4,
    ...props 
}: TextAreaProps) => {
    const inputId = id || `textarea-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
        </label>
        <textarea
            id={inputId}
            rows={rows}
            className={`
            px-4 py-2.5 rounded-xl border bg-gray-50/50 text-text-primary resize-y
            transition-all duration-300 focus:outline-none focus:bg-surface-white focus:ring-2 
            ${error 
                ? 'border-error focus:border-error focus:ring-error/20' 
                : 'border-gray-200 focus:border-primary focus:ring-primary/20 hover:border-secondary/50'
            }
            disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
            {...props}
        />
        {error && <span className="text-sm text-error font-medium">{error}</span>}
        </div>
    );
};