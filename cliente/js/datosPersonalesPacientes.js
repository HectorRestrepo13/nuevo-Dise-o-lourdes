const btnEditar = document.getElementById("btnEditar");
let idPaciente = document.getElementById("idPaciente");
let nombrePaciente = document.getElementById("nombrePaciente");
let apellidoPaciente = document.getElementById("apellidoPaciente");
let emailPaciente = document.getElementById("emailPaciente");
let telefonoPaciente = document.getElementById("telefonoPaciente");
let fechaPaciente = document.getElementById("fechaPaciente");
let movilPaciente = document.getElementById("movilPaciente");
let epsPaciente = document.getElementById("epsPaciente");
let usuarioPaciente = document.getElementById("usuarioPaciente");
let passwordPaciente=document.getElementById("password");
let inputs = document.querySelectorAll('input');
      // Obtener el id del usuario del localStorage
      const datos = JSON.parse(window.localStorage.getItem(1));

fetch(`http://localhost:3000/paciente/traerDatosPaciente/${datos.cedulaPaciente}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw "Error al obtener los datos del paciente";
  })
  .then(data => {
    if (data.length > 0) {
      // Asignar los valores a los campos de entrada
      idPaciente.value = data[0].cedulaPaciente;
      nombrePaciente.value = data[0].nombrePaciente;
      apellidoPaciente.value = data[0].apellidoPaciente;
      emailPaciente.value = data[0].emailPaciente;
      telefonoPaciente.value = data[0].telefonoPaciente;
      movilPaciente.value = data[0].movilPaciente;
      epsPaciente.value = data[0].epsPaciente;
      usuarioPaciente.value = data[0].usuarioPaciente;
      passwordPaciente.value = data[0].passwordPaciente;
      // Suponiendo que la fecha viene en formato 'YYYY-MM-DD'
      const fechaObj = new Date(data[0].fechaNacimientoPqciente);
      console.log(data[0].fechaNacimientoPqciente);

      // Asignar la fecha al campo de entrada de tipo 'date'
      fechaPaciente.value = fechaObj.toISOString().split('T')[0];

      idPaciente.disabled = true;

      btnEditar.disabled = true;

      if (btnEditar.disabled == true) {
        // Poner color a los botones si están desactivados
        btnEditar.style.background = "black";
      }

    } else {
      console.log("No hay datos del paciente. Verifica la cédula si se encuentra bien escrita sin puntos y comas");
    }
  })
  .catch((error) => {
    console.log(error);
  });

inputs.forEach(input => {
  input.addEventListener("change", function () {
    btnEditar.disabled = false;
    btnEditar.style.background = "red";
  })
});

btnEditar.addEventListener("click", function () {
  const nombrePacienteValue = nombrePaciente.value;
  const apellidoPacienteValue = apellidoPaciente.value;
  const emailPacienteValue = emailPaciente.value;
  const telefonoPacienteValue = telefonoPaciente.value;
  const movilPacienteValue = movilPaciente.value;
  const fechaPacienteValue = fechaPaciente.value;
  const epsPacienteValue = epsPaciente.value;
  const usuarioPacienteValue = usuarioPaciente.value;
  const passValue=passwordPaciente.value;
  function validarCorreoElectronico(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }
  
  // Luego puedes llamar a esta función para validar el correo electrónico:
  if (!validarCorreoElectronico(emailPacienteValue)) {
    // Mostrar una alerta indicando que el correo electrónico no es válido
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'El correo electrónico ingresado no es válido.',
    });
    return; // Detener la ejecución del código si el correo no es válido
  }
  if (
    nombrePacienteValue === "" ||
    apellidoPacienteValue === "" ||
    emailPacienteValue === "" ||
    telefonoPacienteValue === "" ||
    movilPacienteValue === "" ||
    fechaPacienteValue === "" ||
    epsPacienteValue === "" ||
    usuarioPacienteValue === ""||
    passValue===""
  ) {
    // Mostrar una alerta con SweetAlert2
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, completa todos los campos.',
    });
  } else {
    const data = {
      nombrePaciente: nombrePacienteValue,
      apellidoPaciente: apellidoPacienteValue,
      emailPaciente: emailPacienteValue,
      telefonoPaciente: telefonoPacienteValue,
      movilPaciente: movilPacienteValue,
      fechaNacimientoPqciente: fechaPacienteValue,
      epsPaciente: epsPacienteValue,
      usuarioPaciente: usuarioPacienteValue,
      passwordPaciente:passValue
    };
    fetch(`http://localhost:3000/paciente/editarPaciente/${datos.cedulaPaciente}`, {
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
          window.location.assign("http://127.0.0.1:5500/cliente/paciente/datosPersonales.html");
        });
      })
  }
});
