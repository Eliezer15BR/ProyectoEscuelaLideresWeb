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

  // 📡 LLAMADA AL BACKEND
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

  // 🧠 MAGIA DINÁMICA: Extraemos los nombres de las columnas del primer estudiante
  // Esto sacará: ["Estudiante", "Tarea 1", "Tarea 2", "Promedio"]
  const columnas = Object.keys(datosReporte[0]);

  return (
    <div className="bg-surface-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
      
      {/* --- CABECERA Y BOTONES --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Calificaciones del Curso</h2>
          <p className="text-sm text-text-secondary">Previsualización y exportación de notas.</p>
        </div>

        {/* 🖨️ BOTONES DE EXPORTACIÓN */}
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(datosReporte, cursoNombre)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <span className="text-lg">📗</span> Excel
          </button>

          <button
            onClick={() => exportToPDF(datosReporte, cursoNombre)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <span className="text-lg">📄</span> PDF
          </button>
        </div>
      </div>

      {/* --- 📊 TABLA DE PREVISUALIZACIÓN --- */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columnas.map((col, index) => (
                <th key={index} className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {datosReporte.map((fila, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
                
                {columnas.map((col, colIndex) => (
                  <td key={colIndex} className="p-4 text-sm text-text-primary">
                    {/* Renderizado condicional para darle colorcito al promedio */}
                    {col === 'Promedio' ? (
                      <span className={`font-bold px-2 py-1 rounded-md ${
                        fila[col] >= 51 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {fila[col]}
                      </span>
                    ) : col === 'Estudiante' ? (
                      <span className="font-bold">{fila[col]}</span>
                    ) : (
                      <span className="text-text-secondary">{fila[col]}</span>
                    )}
                  </td>
                ))}

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};