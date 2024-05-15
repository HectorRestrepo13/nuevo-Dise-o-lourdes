let btnBuscar=document.getElementById("btnBuscarP");

const miTabla = document.getElementById("dataTable");
btnBuscar.addEventListener('click', function(){
  const identificacionPersona=document.getElementById("identificacionPersona").value;
  if(identificacionPersona.length!=0){
    fetch(`http://localhost:3000/pacientes/selecionarpacienteRechazados/${identificacionPersona}`)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw "Error al obtener los datos del paciente";
    })
    .then(Programadas => {
miTabla.innerHTML="";
      if(Programadas.length>0){
        const miTabla = document.getElementById("dataTable");
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
      }else{

        Swal.fire({
          title: "Informacion importante",
          text: "No hay citas pendientes, si quieres puedes programar una",
          icon: "warning",
        });

      }
     
    });

  }else{

    Swal.fire({
      title: "El campo esta vacio",
      text: "Ingresa la identificacion en el campo de texto.",
      icon: "warning",
    });

  }

})
$("#miTabla").DataTable({
  responsive: true,
  lengthMenu: [5, 10, 15, 50, 100, 250, 500],
  pageLength: 5, // Agrega esta línea si deseas mostrar 10 filas por defecto
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
   

  
  