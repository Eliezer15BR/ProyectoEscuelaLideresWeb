import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * 📄 EXPORTAR A PDF
 * @param data Array de objetos JSON (ej. [{ Estudiante: 'Juan', Tarea1: 90, ... }])
 * @param courseName Nombre del curso para el título
 */
export const exportToPDF = (data: any[], courseName: string) => {
  if (!data || data.length === 0) return;

  const doc = new jsPDF();

  // Título minimalista
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900 (text-primary-dark)
  doc.text(`Reporte de Calificaciones - ${courseName}`, 14, 22);

  // Extraemos las cabeceras (las llaves del primer objeto) y las filas (los valores)
  const tableColumns = Object.keys(data[0]);
  const tableRows = data.map((row) => Object.values(row));

  // Dibujamos la tabla
  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    styles: { 
      fontSize: 9, 
      font: 'helvetica', 
      cellPadding: 4,
      textColor: [51, 65, 85], // slate-700
    },
    headStyles: { 
      fillColor: [59, 130, 246], // blue-500 (tu color primario)
      textColor: [255, 255, 255],
      fontStyle: 'bold' 
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // slate-50 (para leer mejor las filas)
    }
  });

  doc.save(`Reporte_Notas_${courseName.replace(/\s+/g, '_')}.pdf`);
};

/**
 * 📗 EXPORTAR A EXCEL
 * @param data Array de objetos JSON
 * @param courseName Nombre del curso para nombrar el archivo
 */
export const exportToExcel = (data: any[], courseName: string) => {
  if (!data || data.length === 0) return;

  // Creamos una hoja de cálculo a partir del JSON
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  
  // Añadimos la hoja al libro de Excel
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Calificaciones');

  // Forzamos la descarga del archivo
  XLSX.writeFile(workbook, `Reporte_Notas_${courseName.replace(/\s+/g, '_')}.xlsx`);
};