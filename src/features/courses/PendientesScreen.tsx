import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tareaService } from './services/tareaService';

// --- MINI COMPONENTE: ACORDEÓN (Equivalente al ExpansionTile de Flutter) ---
// --- MINI COMPONENTE: ACORDEÓN CON TRANSICIÓN SUAVE ---
const ExpansionSection = ({ title, count, tasks, defaultExpanded = false }: any) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || count > 0);
  const navigate = useNavigate();
  return (
    <div className="bg-surface-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
      {/* Cabecera Clickable */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 select-none transition-colors"
      >
        <h3 className="font-bold text-primary-dark text-lg">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-primary-dark text-xs font-extrabold px-3 py-1 rounded-full">
            {count}
          </span>
          {/* Animamos también la flecha para que gire al abrir */}
          <span className={`transform transition-transform duration-300 text-text-secondary ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {/* EL TRUCO MÁGICO: Transición de altura con CSS Grid */}
      <div 
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {/* Contenido Expandible */}
          <div className="border-t border-gray-100 bg-gray-50/30">
            {tasks.length === 0 ? (
              <div className="p-6 text-text-secondary text-sm italic">
                No hay tareas en esta sección
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tasks.map((tarea: any) => (
                  <div 
                    key={tarea.id} 
                    onClick={() => navigate(`/clases/${tarea.curso?.id_curso || tarea.id_curso}/tarea/${tarea.id_tarea}`)}
                    className="p-5 hover:bg-gray-50 cursor-pointer transition-colors group flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                        {tarea.titulo}
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">
                        📚 {tarea.curso?.nombre || 'Curso'}
                      </p>
                    </div>
                    {tarea.fecha_entrega && (
                      <span className="text-xs font-bold text-text-secondary">
                        {new Date(tarea.fecha_entrega).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PANTALLA PRINCIPAL ---
export const PendientesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Categorías de tareas
  const [sinFecha, setSinFecha] = useState<any[]>([]);
  const [proximas, setProximas] = useState<any[]>([]);
  const [vencidas, setVencidas] = useState<any[]>([]);

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const tareas = await tareaService.getPendientes();
        const now = new Date().getTime();

        const sf: any[] = [];
        const prox: any[] = [];
        const venc: any[] = [];

        // Lógica de separación replicada de tu app móvil
        tareas.forEach((t: any) => {
          if (!t.fecha_entrega) {
            sf.push(t);
          } else {
            const fechaLimite = new Date(t.fecha_entrega).getTime();
            if (fechaLimite >= now) {
              prox.push(t);
            } else {
              venc.push(t);
            }
          }
        });

        setSinFecha(sf);
        setProximas(prox);
        setVencidas(venc);

      } catch (error) {
        console.error("Error al cargar pendientes", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendientes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-primary-dark mb-8">Mis Pendientes</h1>
      
      <ExpansionSection 
        title="Sin fecha límite" 
        count={sinFecha.length} 
        tasks={sinFecha} 
      />
      
      <ExpansionSection 
        title="Próximas" 
        count={proximas.length} 
        tasks={proximas} 
      />
      
      <ExpansionSection 
        title="Anteriores (Vencidas)" 
        count={vencidas.length} 
        tasks={vencidas} 
      />
    </div>
  );
};