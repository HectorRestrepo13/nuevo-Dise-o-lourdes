document.addEventListener('DOMContentLoaded', function(){
    const ctx = document.getElementById('myPieChartDoctores');
	let chartData=null;		
     let  downloadBtn=document.getElementById('downloadExcelDoctores');	
    fetch('http://localhost:3000/medicamentos/traerEstadisticasMedicos')
        .then(response => response.json())
        .then(data => {
            chartData=data;
             // Preparar arreglos para cada conjunto de datos
            
             const nombresDoctores = data.map(item => item.nombreMedico);
             const totalCitas = data.map(item => item.totalCitas);
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: nombresDoctores,
                    datasets: [{
                        label: 'Doctores mas solicitados por mes',
                        data: data.map(item => item.totalCitas),
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            grid: {
                              offset: true
                            }
                        }
                    },
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
        const worksheet = workbook.addWorksheet('Doctores más solicitados por el centro medico.');
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
                { header: 'Nombre del medico especialista', key: 'nombreMedico', width: 20 },
                { header: 'Cantidad de citas solicitadas', key: 'totalCitas', width: 20 }
            ];
            
            chartData.forEach(item => {
                worksheet.addRow({ nombreMedico: item.nombreMedico , totalCitas: item.totalCitas });
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
            link.download = 'Doctores más solicitados por el centro medico..xlsx';
            link.click();

            // Limpia el enlace y libera la URL del blob
            window.URL.revokeObjectURL(url);
        });
    });
})
