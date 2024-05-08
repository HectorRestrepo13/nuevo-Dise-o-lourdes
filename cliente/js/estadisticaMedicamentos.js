

document.addEventListener('DOMContentLoaded', function(){
    let chartData = null; // Variable para almacenar los datos de la gráfica
    const ctx = document.getElementById('myBarChart');
    const downloadBtn = document.getElementById('downloadExcelMedicamentos');
    fetch('http://localhost:3000/medicamentos/traerEstadisticasMedicamentos')
        .then(response => response.json())
        .then(data => {
            chartData = data;
            new Chart(ctx, {  
                type: 'bar',
                data: {
                    labels: data.map(item => item.medicamento),
                    datasets: [{
                        label: 'Medicamentos más necesitados por mes',
                        data: data.map(item => item.totalMedicamentosVendidos),
                        backgroundColor: '#49E5EB',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Chart.js Bar Chart'
                      }
                    }
                  },
            });
        })
        .catch(error => console.error('Error al obtener los datos de la API:', error));
         // Agrega un evento de escucha al botón de descarga
    downloadBtn.addEventListener('click', function() {
        // Crea un nuevo workbook
        const workbook = new ExcelJS.Workbook();

        // Agrega una nueva hoja al workbook
        const worksheet = workbook.addWorksheet('Cantidad de medicamentos vendidos por mes');
// Estilo para los bordes
const borderStyle = {
    top: { style: 'thin', color: { argb: '000000' } }, // Borde superior
    bottom: { style: 'thin', color: { argb: '000000' } }, // Borde inferior
    left: { style: 'thin', color: { argb: '000000' } }, // Borde izquierdo
    right: { style: 'thin', color: { argb: '000000' } }, // Borde derecho
};
        // Agrega los datos de la gráfica a la hoja Excel
        if (chartData) {
            worksheet.columns = [
                { header: 'Nombre del medicamento', key: 'medicamentos', width: 20 },
                { header: 'Cantidad vendida', key: 'totalVendidos', width: 20 }
            ];
            
            chartData.forEach(item => {
                worksheet.addRow({ medicamentos: item.medicamento , totalVendidos: item.totalMedicamentosVendidos });
            });
        
            // Estilo para el encabezado
            worksheet.getRow(1).eachCell(cell => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' }, // Color de fondo amarillo
                };
                cell.font = {
                    bold: true,
                    color: { argb: '000000' },
                };
                cell.alignment = { horizontal: 'center' };
             
            });
        
            // Estilo para las celdas de datos
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    row.eachCell(cell => {
                        cell.border = borderStyle;
                    });
                }
            });
        }
        // Crea un archivo Excel
        workbook.xlsx.writeBuffer().then(function(buffer) {
            // Crea un blob desde el buffer
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);

            // Crea un enlace para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Cantidad de medicamentos vendidos por mes.xlsx';
            link.click();

            // Limpia el enlace y libera la URL del blob
            window.URL.revokeObjectURL(url);
        });
    });
});

