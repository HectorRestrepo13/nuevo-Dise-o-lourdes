// Call the dataTables jQuery plugin
$(document).ready(function() {
  $("#dataTable").DataTable({
    responsive:true,
    lengthMenu: [5, 10, 15, 50, 100, 250, 500],
    columnDefs: [
      { orderable: false, targets: [4, 5] },
      { searchable: false, targets: [4, 5] },
    ],
    pageLength: 5,
    destroy: true,
    language: {
      lengthMenu: "Mostrar _MENU_ citas pendiente por página",
      zeroRecords: "Ninguna cita pendiente encontrada",
      info: "Mostrando _START_ a _END_ citas pendientes de _TOTAL_ ",
      infoEmpty: "Ningún citas pendiente encontrado",
      infoFiltered: "(filtrados desde _MAX_ citas pendientes totales)",
      search: "Buscar:",
      loadingRecords: "Cargando...",
      paginate: {
        first: "<<",
        last: ">>",
        next: ">",
        previous: "<",
      },
    },
  });
  
});
