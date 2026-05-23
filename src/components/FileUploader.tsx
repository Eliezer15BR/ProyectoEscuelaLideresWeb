import React, { useRef } from 'react';

interface FileUploaderProps {
    label: string;
    selectedFileName?: string | null;
    onFileSelect: (file: File) => void;
    onClearFile?: () => void;
    error?: string;
}

export const FileUploader = ({ 
    label, 
    selectedFileName, 
    onFileSelect, 
    onClearFile,
    error 
}: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        
        {/* Ocultamos el input feo nativo del navegador */}
        <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
        />

        <div 
            className={`
            flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer
            transition-colors duration-200
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-50 hover:border-blue-400'}
            `}
            onClick={() => !selectedFileName && fileInputRef.current?.click()}
        >
            {selectedFileName ? (
            <div className="flex flex-col items-center gap-2">
                <span className="text-blue-600 font-medium truncate max-w-xs">{selectedFileName}</span>
                {onClearFile && (
                <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); onClearFile(); }}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                    Quitar archivo
                </button>
                )}
            </div>
            ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span className="text-sm font-medium text-gray-600">Haz clic para subir un archivo</span>
                <span className="text-xs text-gray-400">PDF, Word, JPG o ZIP</span>
            </div>
            )}
        </div>
        {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
        </div>
    );
};