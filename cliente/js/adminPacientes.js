function validarCorreo(correo) {
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(correo);
}
// Obtener el id del usuario del localStorage
const datos = JSON.parse(window.localStorage.getItem(1));
fetch(`http://localhost:3000/pacientes/traerPacientes`)
  .then((res) => res.json())
  .then((Programadas) => {
    const miTabla = document.getElementById("dataTable");
    Programadas.forEach((Citas) => {
      let fila = `
        <tr>
          <td>${Citas.cedulaPaciente !== undefined ? Citas.cedulaPaciente : ""}</td>
          <td>${Citas.nombrePaciente !== undefined ? Citas.nombrePaciente : ""}</td>
          <td>${Citas.apellidoPaciente !== undefined ? Citas.apellidoPaciente : ""}</td>
          <td>${Citas.emailPaciente !== undefined ? Citas.emailPaciente : ""}</td>
          <td>${Citas.telefonoPaciente !== undefined ? Citas.telefonoPaciente : ""}</td>
          <td>${Citas.movilPaciente !== undefined ? Citas.movilPaciente : ""}</td>
          <td>${Citas.fechaNacimientoPqciente !== undefined ? Citas.fechaNacimientoPqciente.substring(0,10) : ""}</td>
          <td>${Citas.epsPaciente !== undefined ? Citas.epsPaciente : ""}</td>
          <td>${Citas.usuarioPaciente !== undefined ? Citas.usuarioPaciente : ""}</td>
         
          </tr>
      `;
      miTabla.innerHTML += fila;
    });

    // Inicializar DataTables después de insertar los datos
    $("#miTabla").DataTable({
      responsive:true,
      autoWidth: true, // Permite que las columnas se ajusten automáticamente
      lengthMenu: [5, 10, 15, 50, 100, 250, 500],
   
      columnDefs: [
        { orderable: false, targets: [7, 8] },
        { searchable: false, targets: [7, 8] },
      ],
      pageLength: 5,
      destroy: true,
      language: {
        lengthMenu: "Mostrar _MENU_ pacientes por página",
        zeroRecords: "Ningún pacientes encontrado",
        info: "Mostrando _START_ a _END_ pacientes  de _TOTAL_ ",
        infoEmpty: "Ningún pacientes encontrado",
        infoFiltered: "(filtrados desde _MAX_ pacientes  totales)",
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
  })
  .catch((error) => console.error("Error al cargar el archivo JSON:", error));
  function verificarExistenciaPaciente(cedula) {
    return fetch(`http://localhost:3000/paciente/verificarPaciente/${cedula}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al buscar paciente.");
            }
            return response.json();
        })
        .then((data) => {
            // Verificar si se encontró algún paciente con la cédula proporcionada
            if (data.length > 0) {
                return true; // El paciente existe
            } else {
                return false; // El paciente no existe
            }
        })
        .catch((error) => {
            console.error('Error al verificar la existencia del paciente:', error);
            return false; // En caso de error, asumimos que el paciente no existe
        });
}
const btnEnviar = document.getElementById("btnEnviar");
btnEnviar.addEventListener('click', async (e) => {
    e.preventDefault(); // Evitar que la página se recargue

    // Obtener los valores de los campos
    const cedula = document.getElementById("cedulaPaciente").value;
    const nombre = document.getElementById("nombrePaciente").value;
    const apellido = document.getElementById("apellidoPaciente").value;
    const email = document.getElementById("emailPaciente").value;
    const telefono = document.getElementById("telefonoPaciente").value;
    const movil = document.getElementById("movilPaciente").value;
    const fechaNa = document.getElementById("fechaNacimientoPaciente").value;
    const epsAfiliada = document.getElementById("epsPaciente").value;
    const usuarioNombre = document.getElementById("usuarioPaciente").value;
const pass=document.getElementById("passwordPaciente").value

    // Verificar que todos los campos obligatorios estén llenos
    if (!cedula || !nombre || !apellido || !email || !telefono || !movil || !fechaNa || !epsAfiliada || !usuarioNombre || !pass){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, complete todos los campos obligatorios.',
        });
        return;
    }
        // Validar el correo electrónico
if (!validarCorreo(email)) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, ingrese un correo electrónico válido.',
    });
    return; // Detener el envío del formulario si el correo electrónico no es válido
}

    // Verificar la existencia del paciente
    try {
        const pacienteExiste = await verificarExistenciaPaciente(cedula);
        if (pacienteExiste) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El paciente existe en la base de datos. Verifique la cédula.'
            });
            return; // Detener el envío del formulario si el paciente si existe
        }

        // Si pasa todas las validaciones, enviar los datos al servidor
        const data = {
            cedulaPaciente: cedula,
            nombrePaciente: nombre,
            apellidoPaciente: apellido,
            emailPaciente: email,
            telefonoPaciente: telefono,
            movilPaciente: movil,
            fechaNacimientoPqciente: fechaNa,
            epsPaciente: epsAfiliada,
            usuarioPaciente: usuarioNombre,
            passwordPaciente: pass,
        };

        const response = await fetch("http://localhost:3000/paciente/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Error al guardar los datos.");
        }

        Swal.fire({
            title: "¡Éxito!",
            text: "Se agregó correctamente.",
            icon: "success",
        }).then(() => {
            window.location.assign("http://127.0.0.1:5500/cliente/administrador/administrarPacientes.html");
        });
    } catch (error) {
        console.error('Error al agregar el paciente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al agregar el paciente. Por favor, inténtelo de nuevo más tarde.'
        });
    }
});


const tabla = document.getElementById("miTabla");

tabla.addEventListener("click", (event) => {
    const fila = event.target.closest("tr"); // Obtener la fila clicada
    // Evitar que el formulario se envíe
    event.preventDefault();
    // Obtener los valores de las celdas de la fila
    const cedula = fila.querySelector('td:nth-child(1)').textContent;
    const nombre = fila.querySelector('td:nth-child(2)').textContent;
    const apellido = fila.querySelector('td:nth-child(3)').textContent;
    const email = fila.querySelector('td:nth-child(4)').textContent;
    const telefono = fila.querySelector('td:nth-child(5)').textContent;
    const movil = fila.querySelector('td:nth-child(6)').textContent;
    const fechaNac = fila.querySelector('td:nth-child(7)').textContent;
    const eps = fila.querySelector('td:nth-child(8)').textContent;
    const usuarioNom = fila.querySelector('td:nth-child(9)').textContent;
    const fechaFormateada = new Date(fechaNac).toISOString().split('T')[0];

    console.log(fechaFormateada)
    if (fila) {
        // Crear el mensaje para el SweetAlert2
        const mensaje = `
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Detalle paciente</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <form>
                
                 
                  <div class="form-group">
                      <label for="cedulaPaciente">Cédula:</label>
                      <input type="number" class="form-control" id="cedula" value="${cedula}" disabled>
                  </div>
                  <div class="form-group">
                      <label for="nombrePaciente">Nombre:</label>
                      <input type="text" class="form-control" id="nombre" placeholder="${nombre}">
                  </div>
                  <div class="form-group">
                      <label for="apellidoPaciente">Apellido:</label>
                      <input type="text" class="form-control" id="apellido" placeholder="${apellido}">
                  </div>
                  <div class="form-group">
                      <label for="emailPaciente">Email:</label>
                      <input type="email" class="form-control" id="email" placeholder="${email}">
                  </div>
                  <div class="form-group">
                      <label for="telefonoPaciente">Teléfono:</label>
                      <input type="text" class="form-control" id="telefono" placeholder="${telefono}">
                  </div>
                  <div class="form-group">
                      <label for="movilPaciente">Móvil:</label>
                      <input type="text" class="form-control" id="movil" placeholder="${movil}">
                  </div>
                  <div class="form-group">
                      <label for="fechaNacimientoPaciente">Fecha de nacimiento:</label>
                      <input type="date" class="form-control" id="fecha" value="${fechaFormateada}">
                  </div>
                  <div class="form-group">
                      <label for="epsPaciente">EPS afiliada:</label>
                      <input type="text" class="form-control" id="eps" placeholder="${eps}">
                  </div>
                  <div class="form-group">
                      <label for="usuarioPaciente">Usuario:</label>
                      <input type="text" class="form-control" id="usuario" placeholder="${usuarioNom}">
                  </div>
                  <div class="form-group">
                      <label for="passwordPaciente">Contraseña:</label>
                      <input type="password" class="form-control" id="pass" placeholder="Nueva contraseña">
                  </div>
                  
              </form>
          </div>
         
        </div>
      </div>
        `;  

        // Mostrar el SweetAlert2 con los valores de los campos
        Swal.fire({
            title: `¡Detalle del paciente ${nombre}!`,
            html: mensaje,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡Guardar edición!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const id = document.getElementById("cedula").value;
                const nombres = document.getElementById("nombre").value;
                const apellidos = document.getElementById('apellido').value;
                const emails = document.getElementById('email').value;
                const telefonos = document.getElementById('telefono').value;
                const movils = document.getElementById('movil').value;
                const fechas = document.getElementById("fecha").value; // Obtener el valor del campo fecha directamente
                const epss = document.getElementById('eps').value;
                const usuarios = document.getElementById('usuario').value;
                const pass = document.getElementById('pass').value;
               
                const formate = fechas; // Utilizar directamente el valor obtenido del campo fecha

                // Verificar si algún campo está vacío
                if (nombres == "" ||
                    apellidos == "" ||
                    emails == "" ||
                    telefonos == "" ||
                    movils == "" ||
                    fechas == "" ||
                    epss == "" ||
                    usuarios == ""||
                    pass=="") {
                    // Mostrar una alerta con SweetAlert2
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Por favor, completa todos los campos.',
                    });
                }  else{
                    // Validar el correo electrónico
if (!validarCorreo(email)) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, ingrese un correo electrónico válido.',
    });
    return; 
}
                    const data = {
                        id: id, 
                        nombrePaciente: nombres,
                        apellidoPaciente: apellidos,
                        emailPaciente: emails,
                        telefonoPaciente: telefonos,
                        movilPaciente: movils,
                        fechaNacimientoPqciente: formate,
                        epsPaciente: epss,
                        usuarioPaciente: usuarios,
                        passwordPaciente:pass
                    };
           
                    fetch(`http://localhost:3000/paciente/editarPaciente/${data.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Error al actualizar el dato del elemento.");
                            }else{
                                Swal.fire({
                                    title: "¡Éxito!",
                                    text: "La edición se ha completado correctamente.",
                                    icon: "success",
                                }).then(() => {
                                    window.location.assign("http://127.0.0.1:5500/cliente/administrador/administrarPacientes.html");
                                });
                            }

                           
                        })
                        .catch((error) => {
                            console.error('Error al actualizar el paciente:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Hubo un error al actualizar el paciente. Por favor, inténtelo de nuevo más tarde.'
                            });
                        });
            }
        }
        })
    
    }

});
