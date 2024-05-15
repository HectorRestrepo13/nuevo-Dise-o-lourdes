// INICIALIZAR TABLA
$("#datatableMedicamentos").dataTable({
    info: false, // Desactiva la información sobre el número de registros mostrados y total
    paging: false, // Desactiva la paginación
    searching: false, // Desactiva la búsqueda
    ordering: false, // Desactiva la ordenación
});


// -- FIN INICIALIZACION TABLA --

// EVENTO DEL BOTON BUSCAR MEDICAMENTOS CON LA CEDULA

document.getElementById("botonBuscarCedula").addEventListener("click", () => {

    let cedulaPacie = document.getElementById("cedulaPaciente").value;

    if (cedulaPacie.length > 0) {

        // sobreEscribo la tabla
        document.getElementById("datosTablaMedicamentos").innerHTML = `<table
         class="table table-bordered"
           id="datatableMedicamentos"
            >
            <thead>
           <tr>
             <th>ID</th>
              <th>Medicamento</th>
              <th>Cantidad</th>
               <th>Plazo Reclamacion</th>
                </tr>
                   </thead>
                    <tbody></tbody>
                  </table>`


        // ---
        // -- FIN INICIALIZACION TABLA --
        $("#datatableMedicamentos").dataTable({
            ajax: {
                url: `http://localHost:3000/bodeguero/selecionarMedicamentosResetados/${cedulaPacie}`,
                dataSrc: "datos", // Indica que los datos se encuentran en la propiedad "datos" de la respuesta,
                error: function (xhr, status, error) {
                    console.error("Error en la consulta AJAX:", error);
                },
            },
            info: false,

            columns: [
                {
                    data: "idDetalle",
                },
                {
                    data: "descripcionItem",
                },
                {
                    data: "cantidadDetalle",
                },
                {
                    data: "plazoReclamacion",
                    render: function (data, type, row) {
                        let fechaModi = new Date(data);
                        return `${fechaModi.getDate()}/${fechaModi.getMonth() + 1
                            }/${fechaModi.getFullYear()}`;
                    },
                },
            ],
            initComplete: function () {
                // Asignar el valor a la variable table
                table = this.DataTable(); // Usamos DataTable() en lugar de api()

                // Asignar evento de clic a las celdas de la tabla después de que se haya completado la inicialización
                $("#datatableMedicamentos tbody").on("click", "td", function () {
                    let rowData = table.row($(this).closest("tr")).data();
                    console.log(rowData);
                    fetch(
                        `http://localHost:3000/bodeguero/verificarCantidadMedicamentos?idDetalle=${rowData.idDetalle}&cantidad=${rowData.cantidadDetalle}`
                    )
                        .then((datos) => {
                            return datos.json();
                        })
                        .then((datos) => {
                            console.log(datos.status);
                            if (datos.status == true) {
                                let yaEstas = false;
                                // Selecciona el tbody dentro del cual se encuentran las filas de la tabla
                                let tbody = document.querySelector("#medicamentoAMandar");

                                // Selecciona todas las filas dentro del tbody
                                let filas = tbody.querySelectorAll("tr");

                                // Itera sobre cada fila
                                filas.forEach((fila) => {
                                    // Obtiene el contenido del primer td de la fila actual
                                    let primerTD =
                                        fila.querySelector("td:first-child").textContent;

                                    // Compara el contenido del primer td con algo específico
                                    if (primerTD == rowData.idDetalle) {
                                        // Realiza alguna acción si la comparación es verdadera
                                        yaEstas = true;
                                    }
                                });
                                // aca si  es false es porque ese medicamento no lo a selecionado
                                if (yaEstas == false) {
                                    medicamentoAMandar.innerHTML += `<tr id="filaTblReclmacion" > <td>${rowData.idDetalle} </td> <td>${rowData.descripcionItem} </td><td>${rowData.cantidadDetalle} </td> </tr>`;
                                }
                            } else {
                                Swal.fire({
                                    title: "No hay en el Inventario",
                                    text: "No hay esa cantidad en el inventario",
                                    icon: "warning",
                                });
                            }
                        });






                });
            },
        });


    } else {
        Swal.fire({
            title: "Faltan Datos",
            text: "Ingrese la cedula para poder Buscar",
            icon: "info",
        });
    }


});

// -- FIN EVENTO --

// EVENTO DONDE EL BTON PAGAR SE EJECUTARA PARA LA ENTREGA DE LOS MEDICAMENTOS

document.getElementById("BtnPagarMedicamentos").addEventListener("click", () => {
    // Selecciona el tbody dentro del cual se encuentran las filas de la tabla
    let tbody = document.querySelector("#medicamentoAMandar");

    // Selecciona todas las filas dentro del tbody
    let filas = tbody.querySelectorAll("tr");

    console.log(filas);

    if (filas.length > 0) {
        let insertoTodo = true;
        // Itera sobre cada fila
        filas.forEach(async (fila) => {
            // Obtiene el contenido del primer td de la fila actual
            let primerTD = fila.querySelectorAll("td");
            console.log(primerTD[2].textContent);

            let idDetalleFormula = parseInt(primerTD[0].textContent);
            let cantidad = parseInt(primerTD[2].textContent);

            // voy a comenzar a consumir la API para que actualice los medicamentos
            let API = await fetch(
                `http://localHost:3000/bodeguero/pagarMedicamentosSelecionados/?idMedicam=${idDetalleFormula}&cantidad=${cantidad}`,
                { method: "PUT" }
            );

            let jsonAPi = await API.json();

            console.log(jsonAPi);
            if (jsonAPi.status == false) {
                insertoTodo = false;
            }
        });

        if (insertoTodo) {
            Swal.fire({
                title: "Pago Exitoso",
                text: "Los medicamentos han sido resetados",
                icon: "success",
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                title: "Hubo un error al guardar los medicamentos!",
                text: "Verificar con el Programador",
                icon: "error",
            });
        }
    } else {
        Swal.fire({
            title: "No hay medicamentos selecionados!",
            text: "Selecione los medicamentos para poder Pagar",
            icon: "info",
        });
    }
});