import React, { useEffect } from 'react';
import { Card } from '../../components/Card';
import { useFeedStore } from './hooks/useFeedStore';


interface CourseFeedProps {
  courseId: number;
}

export const CourseFeed = ({ courseId }: CourseFeedProps) => {
  const { recursos, isLoading, fetchFeed } = useFeedStore();

  useEffect(() => {
    fetchFeed(courseId);
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (recursos.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center text-text-secondary">
          <span className="text-4xl block mb-2">📭</span>
          <p>Aún no hay actividad en este curso.</p>
        </div>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      {recursos.map((item, index) => {
        // Usamos index como fallback para la key por si se mezclan IDs de tablas distintas
        const key = item.tipo === 'tarea' ? `t-${item.id_tarea}` : `m-${item.id_material || index}`;
        const isTarea = item.tipo === 'tarea';

        return (
          <div 
            key={key} 
            className="bg-surface-white border border-gray-100 rounded-xl p-5 shadow-sm flex gap-4 items-start transition-all hover:border-primary/30"
          >
            {/* Ícono dinámico: Tarea (Primario) vs Material (Secundario) */}
            <div className={`p-3 rounded-full flex-shrink-0 ${
              isTarea ? 'bg-primary/10 text-primary' : 'bg-background-light text-primary-dark'
            }`}>
              {isTarea ? '📝' : '📚'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <h3 className="font-bold text-text-primary text-lg">{item.titulo}</h3>
                
                {/* La fecha unificada en la que se publicó/subió */}
                <span className="text-xs text-text-secondary whitespace-nowrap">
                  {formatDate(item.fecha)}
                </span>
              </div>
              
              <p className="text-text-secondary mt-1 text-sm whitespace-pre-line">
                {item.descripcion}
              </p>

              {/* Botón de acción dependiendo del tipo de recurso */}
              {isTarea ? (
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/5 px-3 py-1.5 rounded-lg">
                  <span>Entrega: {item.fecha_entrega ? formatDate(item.fecha_entrega) : 'Sin fecha'}</span>
                </div>
              ) : (
                item.url_archivo && (
                  <a 
                    href={item.url_archivo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    <span>🔗 Descargar archivo</span>
                  </a>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};