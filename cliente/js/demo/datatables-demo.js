const datos = JSON.parse(window.localStorage.getItem(1));
const miTabla = document.getElementById("dataTable");
fetch(`http://localhost:3000/pacientes/selecionarpaciente/${datos.cedulaPaciente}`)
  .then((res) => res.json())
  .then((Programadas) => {
    Programadas.forEach((Citas) => {
      let fila = `
        <tr>
          <td>${Citas.idCita !== undefined ? Citas.idCita : ""}</td>
          <td>${Citas.fechaCita !== undefined ? Citas.fechaCita.substring(0,10) : ""}</td>
          <td>${Citas.horaCita !== undefined ? Citas.horaCita : ""}</td>
          <td>${Citas.estadoCita !== undefined ? Citas.estadoCita : ""}</td>
          <td>${Citas.paciente_cedulaPaciente !== undefined ? Citas.paciente_cedulaPaciente : ""}</td>
          <td>${Citas.medico_cedulaMedico !== undefined ? Citas.medico_cedulaMedico : ""}</td>
        </tr>
      `;
      miTabla.innerHTML += fila;
    });
    

    $("#miTabla").DataTable({
      responsive:true,
      lengthMenu: [5, 10, 15, 50, 100, 250, 500],
      columnDefs: [
        { orderable: false, targets: [4, 5] },
        { searchable: false, targets: [4, 5] },
      ],
      pageLength: 6,
      destroy: true,
      language: {
        lengthMenu: "Mostrar _MENU_ citas pendiente por página",
        zeroRecords: "Ningún citas pendiente encontrado",
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
  
  