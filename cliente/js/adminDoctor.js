function validarCorreo(correo) {
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(correo);
}
// Obtener el id del usuario del localStorage
const datos = JSON.parse(window.localStorage.getItem(1));
fetch(`http://localhost:3000/medico/traerDatos/`)
  .then((res) => res.json())
  .then((Programadas) => {
    const miTabla = document.getElementById("dataTable");
    Programadas.forEach((Citas) => {
      let fila = `
        <tr>
          <td>${Citas.cedulaMedico !== undefined ? Citas.cedulaMedico : ""}</td>
          <td>${Citas.nombreMedico !== undefined ? Citas.nombreMedico : ""}</td>
          <td>${Citas.apellidoMedico !== undefined ? Citas.apellidoMedico : ""}</td>
          <td>${Citas.emailMedico !== undefined ? Citas.emailMedico : ""}</td>
        
          <td>${Citas.especialidadMedico !== undefined ? Citas.especialidadMedico : ""}</td>
        
         
          <td>${Citas.usuarioMedico !== undefined ? Citas.usuarioMedico : ""}</td>
          <td>${Citas.estado !== undefined ? Citas.estado : ""}</td>
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
        { orderable: false, targets: [4, 5] },
        { searchable: false, targets: [4, 5] },
      ],
      pageLength: 5,
      destroy: true,
      language: {
        lengthMenu: "Mostrar _MENU_ Medicos por página",
        zeroRecords: "Ningún Medicos encontrado",
        info: "Mostrando _START_ a _END_ Medicos  de _TOTAL_ ",
        infoEmpty: "Ningún Medicos encontrado",
        infoFiltered: "(filtrados desde _MAX_ Medicos  totales)",
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
    return fetch(`http://localhost:3000/medico/verificarMedico/${cedula}`)
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
    const cedula = document.getElementById("cedulaDoctor").value;
    const nombre = document.getElementById("nombreDoctor").value;
    const apellido = document.getElementById("apellidoDoctor").value;
    const email = document.getElementById("emailDoctor").value;
    const especialidad = document.getElementById("especialidadDoctor").value;
    const usuarioNombre = document.getElementById("usuarioDoctor").value;
const pass=document.getElementById("passwordDoctor").value;

    // Verificar que todos los campos obligatorios estén llenos
    if (!cedula || !nombre || !apellido || !email || !especialidad || !usuarioNombre || !pass) {
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
        const doctorExiste= await verificarExistenciaPaciente(cedula);
        if (doctorExiste) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El Doctor existe en la base de datos. Verifique la cédula.'
            });
            return; // Detener el envío del formulario si el paciente si existe
        }

        // Si pasa todas las validaciones, enviar los datos al servidor
        const data = {
            cedulaDoctor: cedula,
            nombreDoctor: nombre,
            apellidoDoctor: apellido,
            emailDoctor: email,
          
            especialidadDoctor: especialidad,

            usuarioDoctor: usuarioNombre,
password:pass
        };

        const response = await fetch("http://localhost:3000/doctor/create", {
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
            window.location.assign("http://127.0.0.1:5500/cliente/administrador/administrarDoctores.html");
        });
    } catch (error) {
        console.error('Error al agregar el doctor:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al agregar el doctor. Por favor, inténtelo de nuevo más tarde.'
        });
    }
});


const tabla = document.getElementById("miTabla");

tabla.addEventListener("click", (event) => {


    Swal.fire({
        title: `¡Que deseas hacer!`,
      
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Editar',
        cancelButtonText: 'Desactivar',
    }).then((result)=>{

        if(result.isConfirmed){
            const fila = event.target.closest("tr"); // Obtener la fila clicada
            // Evitar que el formulario se envíe
            event.preventDefault();
            // Obtener los valores de las celdas de la fila
            const cedula = fila.querySelector('td:nth-child(1)').textContent;
            const nombre = fila.querySelector('td:nth-child(2)').textContent;
            const apellido = fila.querySelector('td:nth-child(3)').textContent;
            const email = fila.querySelector('td:nth-child(4)').textContent;
          
            const especialidad = fila.querySelector('td:nth-child(5)').textContent;
           
            const usuarioNom = fila.querySelector('td:nth-child(6)').textContent;
            
        
        
            if (fila) {
                // Crear el mensaje para el SweetAlert2
                const mensaje = `
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <form>
        
                            <div class="form-group">
                                <label for="cedulaPaciente">Cédula:</label>
                                <input type="number" class="form-control" id="cedula" value="${cedula}" disabled>
                            </div>
                            <div class="form-group">
                                <label for="nombre">Nombre:</label>
                                <input type="text" class="form-control" id="nombre" placeholder="${nombre}">
                            </div>
                            <div class="form-group">
                                <label for="apellido">Apellido:</label>
                                <input type="text" class="form-control" id="apellido" placeholder="${apellido}">
                            </div>
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" class="form-control" id="email" placeholder="${email}">
                            </div>
                           
                           
                            <div class="form-group">
                                <label for="fechaNacimiento">Especialidad:</label>
                                <input type="text" class="form-control" id="especialidad" placeholder="${especialidad}">
                            </div>
                           
                            <div class="form-group">
                                <label for="usuario">Usuario:</label>
                                <input type="text" class="form-control" id="usuario" placeholder="${usuarioNom}">
                            </div>
                            <div class="form-group">
                                <label for="password">Contraseña:</label>
                                <input type="password" class="form-control" id="password" placeholder="Ingrese la contraseña">
                            </div>
            
                        </form>
                    </div>
                </div>
            </div>
                `;  
        
                // Mostrar el SweetAlert2 con los valores de los campos
                Swal.fire({
                    title: `¡Detalle del Medico ${nombre}!`,
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
                        const especialidad = document.getElementById('especialidad').value;
                        const usuarios = document.getElementById('usuario').value;
                    const pass=document.getElementById("password").value
        
                        // Verificar si algún campo está vacío
                        if (nombres == "" ||
                            apellidos == "" ||
                            emails == "" ||
                            especialidad == "" ||
                            usuarios == ""||
                        pass=="") {
                            // Mostrar una alerta con SweetAlert2
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Por favor, completa todos los campos.',
                            });
                        } else{
        
                        
                            // Validar el correo electrónico
        if (!validarCorreo(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, ingrese un correo electrónico válido.',
            });
            return; // Detener el envío del formulario si el correo electrónico no es válido
        }
                            const data = {
                                cedulaDoctor: id, // Asegúrate de obtener el ID del paciente que deseas editar
                                nombreMedico: nombres,
                                apellidoMedico: apellidos,
                                emailMedico: emails,
                                especialidadMedico: especialidad,
                                usuarioMedico: usuarios,
                                password:pass
                            };
                            fetch(`http://localhost:3000/medico/editarDoctor/${data.cedulaDoctor}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(data),
                                })
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error("Error al actualizar el dato del elemento.");
                                    }
        
                                    Swal.fire({
                                        title: "¡Éxito!",
                                        text: "La edición se ha completado correctamente.",
                                        icon: "success",
                                    }).then(() => {
                                        window.location.assign("http://127.0.0.1:5500/cliente/administrador/administrarDoctores.html");
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error al actualizar el doctor:', error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Hubo un error al actualizar el Doctor. Por favor, inténtelo de nuevo más tarde.'
                                    });
                                });
                        
        
                    }
                }
        
                })
            }

        }else if (result.dismiss === Swal.DismissReason.cancel) {

            const fila = event.target.closest("tr"); // Obtener la fila de la tabla

            if (fila) {
                const cedula = fila.querySelector('td:nth-child(1)').textContent;

                Swal.fire({
                    title: `¿Estás seguro de desactivar al usuario con cédula ${cedula}?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, desactivar',
                    cancelButtonText: 'Cancelar',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Realizar la petición para desactivar el usuario
                        fetch(`http://localhost:3000/medico/updateUnoEstado/${cedula}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Error al desactivar el usuario.");
                            }

                            Swal.fire({
                                title: "¡Éxito!",
                                text: "El usuario ha sido desactivado correctamente.",
                                icon: "success",
                            }).then(() => {
                                // Actualizar la tabla después de desactivar al usuario
                                window.location.assign("http://127.0.0.1:5500/cliente/administrador/administrarDoctores.html");
                            });
                        })
                        .catch((error) => {
                            console.error('Error al desactivar el usuario:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Hubo un error al desactivar el usuario. Por favor, inténtelo de nuevo más tarde.'
                            });
                        });
                    }
                });
            }
        }
    })
   
});