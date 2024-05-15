let btnBuscar=document.getElementById("BuscarP")

let idPaciente=document.getElementById("idPaciente");
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
      
btnBuscar.addEventListener('click',function(){
    const cedulaIngresada=document.getElementById("cedulaPersona").value;

    if(cedulaIngresada.length!=0){
    
        fetch(`http://localhost:3000/paciente/traerDatosPaciente/${cedulaIngresada}`)
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
    
          }else{
    
            Swal.fire({
                title: "Persona no existe en la base de datos del sistema medico",
                text: "VERIFICA LA IDENTIFICACION",
                icon: "warning",
              });
            
          }
          })

    }else{
        Swal.fire({
            title: "Porfavor llenar el campo para buscar.",
            text: "No ha ingresado la identificacion",
            icon: "error",
          });
        
    }
   
    })


