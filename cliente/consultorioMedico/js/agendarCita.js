// API PARA ENVIAR LAS ESPECIALIDADES AL SELECT

fetch("http://localhost:3000/consultorio/traerEspecialidadesDoctor/").then((especialidades) => {
    return especialidades.json();
}).then((especialidades) => {
    console.log(especialidades);
    if (especialidades.status == true) {
        especialidades.descripcion.forEach((element) => {
            let select = `<option value="${element.especialidadMedico}">${element.especialidadMedico}</option>`;
            document.getElementById("selectEspecialidades").innerHTML += select;
        });
    } else {
        console.log(
            "hubo un error al consumir el API de las especialidades " +
            especialidades.error
        );
    }
})
    .catch((error) => {
        console.log(
            "hubo un error al consumir el API de las especialidades " + error
        );
    });

// -- FIN API --

// EVENTO API SELECIONAR MEDICOS CON LA ESPECIALIDAD SELECIONADA

document.getElementById("selectEspecialidades").addEventListener("input", async () => {
    let especialidad = document.getElementById("selectEspecialidades").value;
    if (especialidad != "Selecione una Especialidad") {
        document.getElementById("selectMedico").innerHTML = "";
        document.getElementById("selectMedico").disabled = false; // aca habilito el Select
        let datosMedicos = await fetch(`http://localhost:3000/consultorio/traerDoctorEspecifico/${especialidad}`);
        let json = await datosMedicos.json();
        console.log(json);
        if (json.status == true) {
            json.descripcion.forEach((element) => {
                let medicos = `<option value="${element.cedulaMedico}">${element.nombreMedico}</option>`;
                document.getElementById("selectMedico").innerHTML += medicos
            })
        }

    }
    else {
        document.getElementById("selectMedico").disabled = true; // aca desabilito el Select
        document.getElementById("selectMedico").innerHTML = `<option selected>Selecione un Medico</option>`


    }

});

// -- FIN EVENTO --

// EVENTO QUE SE VA EJECUTAR AL DARLE CLICK EN GUARDAR "ENVIARE LOS DATOS A LA BASE DE DATOS"

document.getElementById("btnGuardarAgendarCita").addEventListener('click', () => {

    // variables de los input
    let cedulaPacienteCita = document.getElementById("cedulaPacienteCita");
    let fechaCita = document.getElementById("fechaCita");
    let horaCita = document.getElementById("horaCita");
    let cedulaMedico = document.getElementById("selectMedico").value

    if (cedulaPacienteCita.value.length > 0 && fechaCita.value.length > 0 && horaCita.value.length > 0 && cedulaMedico != "Selecione un Medico") {
        console.log(horaCita.value);
        console.log(fechaCita.value);
        console.log(cedulaMedico);



        // aca voy a consumir la API para Agendar la cita del paciente

        let datosMandar = {
            cedulaPaciente: cedulaPacienteCita.value,
            cedulaMedico: parseInt(cedulaMedico),
            fechaCita: fechaCita.value,
            horaCita: horaCita.value,
        };

        fetch("http://localHost:3000/consultorio/insertarDatosAgendarCita/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosMandar),
        })
            .then((datosApi) => {
                return datosApi.json();
            })
            .then((datosApi) => {
                if (datosApi.status == true) {
                    Swal.fire({
                        title: "Agendado Con exito",
                        text: datosApi.descripcion,
                        icon: "success",
                    }).then(() => {
                        location.reload();
                    });
                } else {
                    if (datosApi.error == null) {
                        Swal.fire({
                            title: "Hora no Disponible",
                            text: datosApi.descripcion,
                            icon: "info",
                        });
                    } else {
                        Swal.fire({
                            title: "Hubo un error",
                            text: datosApi.error,
                            icon: "error",
                        });
                    }
                }
            });


        // --------------------------------------------
    } else {
        Swal.fire({
            title: "Faltan Casillas por llenar",
            text: "Llena todas las Casillas para poder Agendar la Cita",
            icon: "info",
        });
    }

})

// -- FIN EVENTO --
