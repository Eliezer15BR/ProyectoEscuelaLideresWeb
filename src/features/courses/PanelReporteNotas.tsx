import { useState, useEffect } from 'react';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
import { apiClient } from '../../api/apiClient';

interface Props {
  cursoId: number;
  cursoNombre: string;
}

export const PanelReporteNotas = ({ cursoId, cursoNombre }: Props) => {
  const [datosReporte, setDatosReporte] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReporte = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/curso/${cursoId}/reporte-notas`);
        setDatosReporte(response.data);
      } catch (error) {
        console.error('Error al cargar el reporte', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (cursoId) fetchReporte();
  }, [cursoId]);

  // ⏳ ESTADO DE CARGA
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12 bg-surface-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // 📭 ESTADO VACÍO
  if (datosReporte.length === 0) {
    return (
      <div className="text-center p-4 text-text-secondary">
        <span className="text-2xl block mb-2">📭</span>
        <p className="text-xs">Sin datos para reporte.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <button
        onClick={() => exportToExcel(datosReporte, cursoNombre)}
        className="flex items-center justify-center gap-2 w-full py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
      >
        <span>📗</span> Exportar Excel
      </button>

      <button
        onClick={() => exportToPDF(datosReporte, cursoNombre)}
        className="flex items-center justify-center gap-2 w-full py-2 text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
      >
        <span>📄</span> Exportar PDF
      </button>
    </div>
  );
};