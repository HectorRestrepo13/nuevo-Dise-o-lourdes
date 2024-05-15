// INICIALIZAR TABLA
$("#datatableFormularioPacientes").dataTable({
  info: false, // Desactiva la información sobre el número de registros mostrados y total
  paging: false, // Desactiva la paginación
  searching: false, // Desactiva la búsqueda
  ordering: false, // Desactiva la ordenación
});

$("#datatableDetalleFormulaPacientes").dataTable({
  info: false, // Desactiva la información sobre el número de registros mostrados y total
  paging: false, // Desactiva la paginación
  searching: false, // Desactiva la búsqueda
  ordering: true, // Desactiva la ordenación
});
// -- FIN INICIALIZACION TABLA --

// EVENTO PARA CONSUMIR API DEL FORMULARIO MEDICO DEL PACIENTE

document.getElementById("btnBuscarFormula").addEventListener("click", () => {
  let cedulaPaciente = document.getElementById("inputCedulaPaciente").value;
  if (cedulaPaciente != "") {
    // sobreEscribo la tabla en el contenedor de la formulas
    document.getElementById("datosTablaFormula").innerHTML = `  <table
      class="table table-bordered"
      id="datatableFormularioPacientes"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Paciente</th>
          <th>Medico</th>
          <th>Fecha Formula</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>`;
    // -----
    // hago lo mismo de sobreEscribir en la tabla Medicamentos recetados
    document.getElementById("datosTablaDetalleFormula").innerHTML = ` <table
    class="table table-bordered"
    id="datatableDetalleFormulaPacientes"
  >
    <thead>
      <tr>
        <th>ID</th>
        <th>Medicamente</th>
        <th>Posologia</th>
        <th>Cantidad</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>`;
    // -------
    // inicializo la tabla
    $("#datatableDetalleFormulaPacientes").dataTable({
      info: false, // Desactiva la información sobre el número de registros mostrados y total
      paging: false, // Desactiva la paginación
      searching: false, // Desactiva la búsqueda
      ordering: true, // Desactiva la ordenación
    });
    // -- FIN INICIALIZACION TABLA --

    $("#datatableFormularioPacientes").dataTable({
      ajax: {
        url: `http://localhost:3000/consultorio/selecionarFormulaPaciente?cedula=${cedulaPaciente}`,
        dataSrc: "",
        error: function (xhr, status, error) {
          console.error("Error en la consulta AJAX:", error);
        },
      },
      info: false,

      columns: [
        {
          data: "idFormula",
        },
        {
          data: "nombrePaciente",
        },
        {
          data: "nombreMedico",
        },
        {
          data: "fechaFormula",
          render: function (data, type, row) {
            let fechaModi = new Date(data);
            return `${fechaModi.getDate()}/${
              fechaModi.getMonth() + 1
            }/${fechaModi.getFullYear()}`;
          },
        },
      ],
      initComplete: function () {
        // Asignar el valor a la variable table
        table = this.DataTable(); // Usamos DataTable() en lugar de api()

        // Asignar evento de clic a las celdas de la tabla después de que se haya completado la inicialización
        $("#datatableFormularioPacientes tbody").on("click", "td", function () {
          let rowData = table.row($(this).closest("tr")).data();
          console.log(rowData);
          func_llenarTablaHistorial(rowData.idFormula);
        });
      },
    });
  } else {
    Swal.fire({
      title: "Hubo un Error",
      text: "Ingrese el numero de Cedula!!",
      icon: "info",
    });
  }
});

// -- FIN EVENTO --

// FUNCION DONDE SE VA LLENAR LA TABLA DEL HISTORIAL
const func_llenarTablaHistorial = (idFormula) => {
  // voy a limpiar el contenedor de la tabla detalleFormula
  document.getElementById("datosTablaDetalleFormula").innerHTML = `<table
  class="table table-bordered"
  id="datatableDetalleFormulaPacientes"
>
  <thead>
    <tr>
      <th>ID</th>
      <th>Medicamente</th>
      <th>Posologia</th>
      <th>Cantidad</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>`;

  // aca voy a consumir la APi del Historial
  $("#datatableDetalleFormulaPacientes").dataTable({
    ajax: {
      url:
        "http://localHost:3000/consultorio/selecionarDetalleFormula/" +
        idFormula,
      dataSrc: "",
      error: function (xhr, status, error) {
        console.error("Error en la consulta AJAX:", error);
      },
    },
    info: false,
    layout: {
      topStart: {
        buttons: {
          buttons: [
            {
              extend: "excel",
              text: '<i class="bi bi-file-earmark-excel"></i>',
              titleAttr: "Importar a excel",
              className: "btn btn-success",
            },
            {
              extend: "pdf",
              text: '<i class="bi bi-filetype-pdf"></i>',
              titleAttr: "Importar a pdf",
              className: "btn btn-danger",
            },
            {
              extend: "print",
              text: '<i class="bi bi-printer-fill"></i>',
              titleAttr: "Imprimir",
              className: "btn btn-info",
            },
          ],
        },
      },
    },
    columns: [
      {
        data: "idDetalle",
      },
      {
        data: "descripcionItem",
      },
      {
        data: "posologiaDetalle",
      },
      {
        data: "cantidadDetalle",
      },
    ],
  });
};

// -- FIN EVENTO --
