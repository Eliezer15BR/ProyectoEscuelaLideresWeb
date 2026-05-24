import React, { useEffect } from 'react';
import { useFeedStore } from './hooks/useFeedStore';
import { MaterialCard } from './components/MaterialCard';
import { TaskCard } from './components/TaskCard';

export const CourseFeed = ({ courseId }: { courseId: number }) => {
  // Usamos exactamente los nombres de tu interface FeedState
  const { recursos, isLoading, fetchFeed } = useFeedStore();

  useEffect(() => {
    fetchFeed(courseId);
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!recursos || recursos.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-10 text-center border border-dashed border-gray-200">
        <span className="text-4xl block mb-2">🍃</span>
        <p className="text-text-secondary font-medium">Aún no hay publicaciones en este curso.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {recursos.map((item: any) => {
        // Asumiendo que tu RecursoFeed trae un campo 'tipo' o podemos deducirlo por el ID
        const isMaterial = item.tipo === 'material' || item.id_material !== undefined;

        if (isMaterial) {
          return <MaterialCard key={`mat-${item.id_material || item.id}`} material={item} courseId={courseId}/>;
        } else {
          // Placeholder temporal para las Tareas
          return (
            <TaskCard 
              key={`task-${item.id_tarea || item.id}`} 
              tarea={item} 
              courseId={courseId} // Pasamos el ID del curso para el botón "Ver Tarea"
            />
          );
        }
      })}
    </div>
  );
};