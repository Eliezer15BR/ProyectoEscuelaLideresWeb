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
      <div className="p-8 text-center bg-surface-white rounded-2xl border border-gray-100 shadow-sm text-text-secondary">
        <span className="text-4xl block mb-3">📭</span>
        <p>No hay estudiantes inscritos o datos disponibles para generar el reporte.</p>
      </div>
    );
  }
  return (
    <div className="bg-surface-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
      
      {/* --- CABECERA Y BOTONES --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Calificaciones del Curso</h2>
          <p className="text-sm text-text-secondary">Exportación de notas.</p>
        </div>

        {/* 🖨️ BOTONES DE EXPORTACIÓN */}
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(datosReporte, cursoNombre)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span className="text-lg">📗</span> Excel
          </button>

          <button
            onClick={() => exportToPDF(datosReporte, cursoNombre)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span className="text-lg">📄</span> PDF
          </button>
        </div>
      </div>

    </div>
  );
};