// EVENTO DE AGREGAR ITEM

document.getElementById("btnGuardarItem").addEventListener('click', async () => {

    let nombreMedicamento = document.getElementById("nombreMedicamento").value;
    let cantidadMedicamento = document.getElementById("cantidadMedicamento").value;
    if (nombreMedicamento != "" && cantidadMedicamento != "") {

        let insertacionItem = await fetch(`http://localhost:3000/bodeguero/insertarNuevoItem?nombreItem=${nombreMedicamento}&cantidadItem=${cantidadMedicamento}`, { method: "POST" })
        let jsonInsertacion = await insertacionItem.json();

        if (jsonInsertacion.status == true) {
            Swal.fire({
                title: "Producto Agregado con Exito",
                text: "El Producto se encuentra ya en el inventario",
                icon: "success"
            }).then(() => {
                location.reload();
            })
        }
        else {

            Swal.fire({
                title: jsonInsertacion.descripcion,
                text: jsonInsertacion.error,
                icon: "error"
            });
        }


    }
    else {
        Swal.fire({
            title: "Faltan Casillas por llenar!",
            text: "Llenar las casillas que faltan para poder Agregar",
            icon: "info"
        });
    }



})

// -- FIN EVENTO --