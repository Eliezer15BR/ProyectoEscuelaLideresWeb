import React from 'react';
interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export const Card = ({ children, title, className = '' }: CardProps) => {
    return (
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
        {title && (
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            </div>
        )}
        
        <div className="p-6">
            {children}
        </div>
        </div>
    );
};