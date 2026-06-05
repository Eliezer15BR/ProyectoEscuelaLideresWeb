import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { apiClient } from '../../api/apiClient';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const EstadisticasCursos = () => {
  const [estadisticas, setEstadisticas] = useState<any[]>([]);
  const [cursosSeleccionados, setCursosSeleccionados] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await apiClient.get('/curso/estadisticas');
        setEstadisticas(response.data);
      } catch (error) {
        console.error('Error al cargar estadísticas', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  // 🌟 LÓGICA DE SELECCIÓN: Agrega o quita el ID del array
  const toggleCurso = (id: number) => {
    setCursosSeleccionados((prev) =>
      prev.includes(id)
        ? prev.filter((cursoId) => cursoId !== id) // Si ya está, lo quitamos
        : [...prev, id] // Si no está, lo agregamos
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-surface-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center animate-pulse">
        <span className="text-text-secondary text-sm font-bold">Cargando estadísticas...</span>
      </div>
    );
  }

  if (estadisticas.length === 0) return null;

  // 🌟 FILTRAMOS LOS DATOS: Solo pasamos a Chart.js los que el usuario haya seleccionado
  const datosFiltrados = estadisticas.filter((curso) =>
    cursosSeleccionados.includes(curso.id_curso)
  );

  const chartData = {
    labels: datosFiltrados.map((curso) => curso.nombre),
    datasets: [
      {
        label: 'Cupos Ocupados',
        data: datosFiltrados.map((curso) => curso.cupos_ocupados),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
      {
        label: 'Cupos Libres',
        data: datosFiltrados.map((curso) => curso.cupos_libres),
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", size: 12 },
          color: '#64748b',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        cornerRadius: 8,
      },
    },
    scales: {
      x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 }, color: '#64748b' } },
      y: { stacked: true, border: { display: false }, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 }, color: '#64748b', stepSize: 5 } },
    },
  };

  return (
    <div className="bg-surface-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-text-primary">Ocupación de Cursos</h2>
        <p className="text-sm text-text-secondary">Selecciona los cursos que deseas comparar en el gráfico.</p>
      </div>
      
      {/* 🎛️ CONTROLES DE FILTRO (Píldoras) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {estadisticas.map((curso) => {
          const isSelected = cursosSeleccionados.includes(curso.id_curso);
          return (
            <button
              key={curso.id_curso}
              onClick={() => toggleCurso(curso.id_curso)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all duration-200 ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm scale-105'
                  : 'bg-transparent text-text-secondary border-gray-200 hover:border-primary/50 hover:text-primary'
              }`}
            >
              {curso.nombre}
            </button>
          );
        })}
      </div>

      <div className="h-72 w-full">
        {datosFiltrados.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-text-secondary text-sm italic">
            Selecciona al menos un curso para visualizar los datos.
          </div>
        )}
      </div>
    </div>
  );
};