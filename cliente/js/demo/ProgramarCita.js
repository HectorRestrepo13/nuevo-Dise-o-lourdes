fetch("http://localhost:3000/medico/buscarEspecialidadMedico")
  .then((res) => res.json())
  .then((data) => {
    const selectCitas = document.getElementById("selectCitas");
    const especialidadesAgregadas = new Set(); // Utilizar un conjunto para almacenar las especialidades añadidas

    // Limpiar las opciones existentes
    selectCitas.innerHTML = "";

    // Agregar la opción "Seleccione una especialidad"
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione una especialidad";
    selectCitas.appendChild(defaultOption);

    // Agregar las opciones de especialidades únicas
    data.forEach((especialidad) => {
      const especialidadMedico = especialidad.especialidadMedico;
      if (!especialidadesAgregadas.has(especialidadMedico)) {
        const option = document.createElement("option");
        option.value = especialidadMedico;
        option.textContent = especialidadMedico;
        selectCitas.appendChild(option);
        especialidadesAgregadas.add(especialidadMedico); // Agregar la especialidad al conjunto
      }
    });
  })
  .catch((error) => console.error("Error al cargar las especialidades:", error));






  // Obtener referencia a los selectores
const selectEspecialidad = document.getElementById('selectCitas');

// Evento que se activa cuando se cambia la especialidad
selectEspecialidad.addEventListener('change', () => {
    const selectDoctor = document.getElementById('selectDoctor');
    // Obtener el valor seleccionado de la especialidad
    const especialidadSeleccionada = selectEspecialidad.value;

     // Vaciar el selector de doctores
     selectDoctor.innerHTML = ''; // Vacía todas las opciones existentes
    console.log(especialidadSeleccionada);

    // Realizar una solicitud al servidor para obtener los doctores con esa especialidad
    fetch('http://localhost:3000/medico/buscarMedico/' + especialidadSeleccionada, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
     
        // Limpiar el selector de doctores
        selectDoctor.innerHTML = ''; // Añadida esta línea

        // Agregar las opciones de doctores al selector
        data.forEach(doctor => {
          const option = document.createElement('option');
          option.value = doctor.cedulaMedico+ '|' + doctor.nombreMedico; // Concatena cédula y nombre
          option.textContent = doctor.nombreMedico;
          selectDoctor.appendChild(option);
      });
    })
    .catch((error) => console.error('Error al cargar los doctores:', error));
});

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

function  funcion_gubuttonrdbuttonrCita() {
    const fecha = document.getElementById("fechaCita").value;
    const hora = document.getElementById("horaCita").value;
    const cedulaPaciente = document.getElementById("cedulaPaciente").value;
    const cedulaDoctor = document.getElementById("selectDoctor").value;

    // Verificar si alguno de los campos está vacío
    if (!fecha || !hora || !cedulaPaciente || !cedulaDoctor) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, complete todos los campos.'
        });
        return false; // Detener el envío del formulario si algún campo está vacío
    } else {
        // Verificar la existencia del paciente
        return verificarExistenciaPaciente(cedulaPaciente)
            .then((pacienteExiste) => {
                if (!pacienteExiste) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'El paciente no existe en la base de datos. Verifique la cédula.'
                    });
                    return false; // Detener el envío del formulario si el paciente no existe
                }

                // Si el paciente existe, guardar la cita
                const data = {
                    fechaCita: fecha,
                    horaCita: hora,
                    paciente_cedulaPaciente: cedulaPaciente,
                    medico_cedulaMedico: parseInt(cedulaDoctor)
                };

                return fetch("http://localhost:3000/cita/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error al guardar los datos.");
                    }
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "Se agregó correctamente.",
                        icon: "success",
                    }).then(() => {
                        window.location.assign("http://127.0.0.1:5501/Cliente/citasProgramadas.htmhttp://127.0.0.1:5500/cliente/paciente/citasProgramadas.html");
                    });
                })
                .catch((error) => {
                    console.error('Error al agregar la cita:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Hubo un error al agregar la cita. Por favor, inténtelo de nuevo más tarde.'
                    });
                    return false; // Detener el envío del formulario en caso de error
                });
            })
            .catch((error) => {
                console.error('Error al verificar la existencia del paciente:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hubo un error al verificar la existencia del paciente. Por favor, inténtelo de nuevo más tarde.'
                });
                return false; // Detener el envío del formulario en caso de error
            });
    }
}

document.getElementById("Notificacion").addEventListener("click", ()=>{
  Swal.fire({
    icon: 'info',
    title: 'La salud es la prioridad de nosotros',
    text: 'Gracias por leer nuestra informacion.'
});
})