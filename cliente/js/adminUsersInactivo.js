function validarCorreo(correo) {
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(correo);
}
// Obtener el id del usuario del localStorage
const datos = JSON.parse(window.localStorage.getItem(1));
fetch(`http://localhost:3000/Funcionario/traerFuncionarioInactivo`)
  .then((res) => res.json())
  .then((Programadas) => {
    const miTabla = document.getElementById("dataTable");
    Programadas.forEach((Citas) => {
      let fila = `
        <tr>
          <td>${Citas.cedulaUser !== undefined ? Citas.cedulaUser : ""}</td>
        
          <td>${Citas.emailUser !== undefined ? Citas.emailUser : ""}</td>
          <td>${Citas.userName !== undefined ? Citas.userName : ""}</td>
          <td>${Citas.nombreRol!== undefined ? Citas.nombreRol : ""}</td>
          <td>${Citas.estado!== undefined ? Citas.estado : ""}</td>
         
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
        { orderable: false, targets: [3, 4] },
        { searchable: false, targets: [3, 4] },
      ],
      pageLength: 5,
      destroy: true,
      language: {
        "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
        "decimal": ",",
        "thousands": ".",
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sSearch": "Buscar:",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast":"Último",
            "sNext":"Siguiente",
            "sPrevious": "Anterior"
        },
        "sProcessing":"Cargando..."
    }
    
    });
  })
  .catch((error) => console.error("Error al cargar el archivo JSON:", error));
  function verificarExistenciaUsuario(cedula) {
    return fetch(`http://localhost:3000/user/verificarUsers/${cedula}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al buscar Usuario.");
            }
            return response.json();
        })
        .then((data) => {
          
            if (data.length > 0) {
                return true; // El Usuario existe
            } else {
                return false; // El Usuario no existe
            }
        })
        .catch((error) => {
            console.error('Error al verificar la existencia del Usuario:', error);
            return false; // En caso de error, asumimos que el doctor no existe
        });
}
const btnEnviar = document.getElementById("btnEnviar");
btnEnviar.addEventListener('click', async (e) => {
    e.preventDefault(); // Evitar que la página se recargue

    // Obtener los valores de los campos
    const cedula = document.getElementById("cedulaUsers").value;
    const email = document.getElementById("emailUsers").value;
    const rolSelect = document.getElementById("RolUser").value;
  
    const usuarioNombre = document.getElementById("usuarioUsers").value;
  
   const pass=document.getElementById("password").value;
    // Verificar que todos los campos obligatorios estén llenos
    if (!cedula || !email || !rolSelect || !usuarioNombre || !pass) {
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
        const usuarioExiste= await verificarExistenciaUsuario(cedula);
        if (usuarioExiste) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario existe en la base de datos. Verifique la cédula.'
            });
            return; // Detener el envío del formulario si el paciente si existe
        }
        console.log(email)

        // Si pasa todas las validaciones, enviar los datos al servidor
        const data = {
            cedulaUser: cedula,
            emailUser: email,  
            userName: usuarioNombre,      
            rol_idRol:parseInt(rolSelect) ,
            password:pass
        };
       

        const response = await fetch("http://localhost:3000/usuario/create", {
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
            window.location.assign("http://127.0.0.1:5500/cliente/administrador/administrarUsuariosIncativos.html");
        });
    } catch (error) {
        console.error('Error al agregar el Usuario:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al agregar el Usuario. Por favor, inténtelo de nuevo más tarde.'
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
        cancelButtonText: 'activar',
    }).then((result) => {
        if (result.isConfirmed) {
            const fila = event.target.closest("tr"); // Obtener la fila de la tabla

            event.preventDefault();
            function generarOpcionesRol(rolActual) {
                const opciones = [
                  { valor: 4, texto: 'Bodeguero' },
                  { valor: 2, texto: 'Secretaria' },
                
                ];
              
                return opciones.map(opcion => `
                  <option value="${opcion.valor}" ${rolActual === opcion.texto ? 'selected' : ''}>${opcion.texto}</option>
                `).join('');
              }
             
            // Obtener los valores de las celdas de la fila
            const cedula = fila.querySelector('td:nth-child(1)').textContent;
            const email = fila.querySelector('td:nth-child(2)').textContent;
            const usuario = fila.querySelector('td:nth-child(3)').textContent;
            const rolTabla = fila.querySelector('td:nth-child(4)').textContent.trim();
            // Generar las opciones del select con el rol actual seleccionado
        const opcionesRol = generarOpcionesRol(rolTabla);
          
            
        
        
            if (fila) {
                // Crear el mensaje para el SweetAlert2
                const mensaje = `
                <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
               
                  <div class="modal-body">
                      <form>
                         
                         
                          <div class="form-group">
                              <label for="cedulaPaciente">Cédula:</label>
                              <input type="text" class="form-control" id="cedula" value="${cedula}" disabled>
                          </div>
                      
          
                          <div class="form-group">
                              <label for="email">Email:</label>
                              <input type="email" class="form-control" id="email" placeholder="${email}">
                          </div>
                      
                      
                      
                          
                          <div class="form-group">
                              <label for="usuarioUsers">Usuario:</label>
                              <input type="text" class="form-control" id="usuario" placeholder="${usuario}">
                          </div>
                      
                          <div class="form-group">
                              <label for="rol">Rol:</label>
                              <select id="RolUserEditar" name="rol">
                    ${opcionesRol}
                </select>
                          </div>
                              
                         
                          <div class="form-group">
                            <label for="contra">Contraseña:</label>
                            <input type="password" class="form-control" id="passwordd" placeholder="Ingrese una contraseña nueva">
                        </div>
                      </form>
                  </div>
                 
                </div>
              </div>
            </div>		
                              
          
                      </div>
            `;   
        
                Swal.fire({
                    title: `¡Detalle del usuario ${usuario}!`,
                    html: mensaje,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, ¡Guardar edición!',
                    cancelButtonText: 'Cancelar',
                  
                }).then((result) => {
                    if (result.isConfirmed) {
                        const id = document.getElementById("cedula").value;
                        const email = document.getElementById("email").value;
                        const nombre = document.getElementById('usuario').value;
                        const pass=document.getElementById("passwordd").value;
                   
        const rolSelect = document.getElementById("RolUserEditar").value;
                
                    
        
                        // Verificar si algún campo está vacío
                        if (email == "" ||
                            nombre == "" ||
                            pass==""
                           ) {
                            // Mostrar una alerta con SweetAlert2
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Por favor, completa todos los campos.',
                            });
                     console.log(email, nombre, pass);
                        }  else{
                        if (!validarCorreo(email)) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Por favor, ingrese un correo electrónico válido.',
                            });
                            return; // Detener el envío del formulario si el correo electrónico no es válido
                        }
                            const data = {
                                cedulaUser: id, // Asegúrate de obtener el ID del paciente que deseas editar
                                emailUser: email,
                                userName: nombre,
                                rol_idRol: parseInt(rolSelect),
                            password:pass
                            };
                       
                            fetch(`http://localhost:3000/usuario/editarUsuario/${data.cedulaUser}`, {
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
                                        window.location.assign("http://127.0.0.1:5500/cliente/administrador/administrarUsuariosIncativos.html");
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error al actualizar el usuario:', error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Hubo un error al actualizar el usuario. Por favor, inténtelo de nuevo más tarde.'
                                    });
                                });
                        
        
                    }
                }
                })
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            const fila = event.target.closest("tr"); // Obtener la fila de la tabla

            if (fila) {
                const cedula = fila.querySelector('td:nth-child(1)').textContent;

                Swal.fire({
                    title: `¿Estás seguro de activar al usuario con cédula ${cedula}?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, activar',
                    cancelButtonText: 'Cancelar',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Realizar la petición para activar el usuario
                        fetch(`http://localhost:3000/medico/updateUnoEstadoActivar/${cedula}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Error al activar el usuario.");
                            }

                            Swal.fire({
                                title: "¡Éxito!",
                                text: "El usuario ha sido desactivado correctamente.",
                                icon: "success",
                            }).then(() => {
                                // Actualizar la tabla después de activar al usuario
                                window.location.assign("http://127.0.0.1:5500/cliente/administrador/administrarUsuariosIncativos.html");
                            });
                        })
                        .catch((error) => {
                            console.error('Error al activar el usuario:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Hubo un error al activar el usuario. Por favor, inténtelo de nuevo más tarde.'
                            });
                        });
                    }
                });
            }
        }
    });
});