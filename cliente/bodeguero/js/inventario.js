// INICIALIZACION TABLA 
$("#datatableMedicamentos").dataTable({
    ajax: {
        url: "http://localhost:3000/bodeguero/consultarTodoMedicamentos",
        dataSrc: "datos", // Indica que los datos se encuentran en la propiedad "datos" de la respuesta,
        error: function (xhr, status, error) {
            console.error("Error en la consulta AJAX:", error);
        },
    },
    info: false,
    columns: [
        {
            data: "idItem",
        },
        {
            data: "descripcionItem",
        },
        {
            data: "existenciaItem",
        },
        {
            data: null, // Para que renderice el botón pero no utilice datos específicos de la fila
            render: function (data, type, row) {
                return '<button data-bs-toggle="modal" data-bs-target="#modalEditarItem" onclick="func_editarItem(\'' + row.idItem + '\',\'' + row.descripcionItem + '\',\'' + row.existenciaItem + '\')" type="button" class="btn btn-warning">Editar</button>';
            }
        },
    ],

});

// -- FIN INICIALIZACION TABLA --

// FUNCION DE MANDAR LOS DATOS AL MODAL CUANDO LE DE EN EDITAR

const func_editarItem = (idItem, nombreMedicamento, cantidadMedicamenti) => {
    document.getElementById("tituloModal").textContent =
        "Editar Medicamento: " + nombreMedicamento;

    document.getElementById("inputNombreItem").value = nombreMedicamento;
    document.getElementById("inputCantidadItem").value = cantidadMedicamenti;
    document.getElementById("idItem").value = idItem;
};

// -- FIN FUNCION --

// EVENTO DE GUARDAR  EN LA BASE DE DATOS LA ACTUALIZACION DE LOS MEDICAMENTOS

document.getElementById("GuardarCambiosItem").addEventListener("click", () => {
    let idItem = document.getElementById("idItem").value;
    let nombreItem = document.getElementById("inputNombreItem").value;
    let cantidadItem = document.getElementById("inputCantidadItem").value;
    console.log(idItem);
    console.log(nombreItem);
    console.log(cantidadItem);

    fetch(
        `http://localHost:3000/bodeguero/updateMedicamento?idItem=${idItem}&nombreItem=${nombreItem}&cantidadItem=${cantidadItem}`,
        { method: "PUT" }
    )
        .then((datos) => {
            return datos.json();
        })
        .then((datos) => {
            if (datos.status == true) {
                Swal.fire({
                    title: "Se Actualizo con Exito!",
                    text: "El medicamento se Actualizo en la base de datos",
                    icon: "success",
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    title: "No se pudo Actualizar!",
                    text: datos.error,
                    icon: "warning",
                });
            }
        });
});

// -- FIN EVENTO --