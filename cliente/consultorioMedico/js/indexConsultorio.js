const func_llenarTablaConsultasCitas = (cedula, estado) => {
  // Definir la variable table fuera de la función initComplete
  let table;

  $("#datatableCitasPacientes").dataTable({
    ajax: {
      url: `http://localhost:3000/consultorio/selecionarCitasPorAtender/?estado=${estado}&nombre=${cedula}`,
      dataSrc: "",
      error: function (xhr, status, error) {
        console.error("Error en la consulta AJAX:", error);
      },
    },
    columns: [
      {
        data: "idCita",
      },
      {
        data: "paciente",
      },
      {
        data: "nombreMedico",
      },
      {
        data: "fechaCita",
        render: function (data, type, row) {
          let fechaModi = new Date(data);
          return `${fechaModi.getDate()}/${
            fechaModi.getMonth() + 1
          }/${fechaModi.getFullYear()}`;
        },
      },
      {
        data: "horaCita",
      },
      {
        data: "estadoCita",
      },
    ],
    initComplete: function () {
      // Asignar el valor a la variable table
      table = this.DataTable(); // Usamos DataTable() en lugar de api()

      // Asignar evento de clic a las celdas de la tabla después de que se haya completado la inicialización
      $("#datatableCitasPacientes tbody").on("click", "td", function () {
        let rowData = table.row($(this).closest("tr")).data();
        console.log(rowData);
        func_selecionarCliente(
          rowData.idCita,
          rowData.fechaCita,
          rowData.estadoCita
        );
      });
    },
  });
};

func_llenarTablaConsultasCitas(1006, "Confirmado");

// FUNCION PARA LLENAR LOS INPUS CON LOS DATOS DEL PACIENTE

const func_selecionarCliente = (id, fecha, estado) => {
  //este va hacer la API para consumir y colocar los datos del Paciente
  fetch("http://localhost:3000/consultorio/selecionarDatosPaciente/" + id)
    .then((date) => {
      return date.json();
    })
    .then((date) => {
      date.forEach((elemen) => {
        let fechaModi = new Date(elemen.fechaNacimientoPqciente);
        fechaModi = `${fechaModi.getDate()}/${
          fechaModi.getMonth() + 1
        }/${fechaModi.getFullYear()}`;

        // fecha cita
        let fechaCita = new Date(fecha);
        fechaCita = `${fechaCita.getDate()}/${
          fechaCita.getMonth() + 1
        }/${fechaCita.getFullYear()}`;

        document.getElementById("idCedulaPaciente").value = id;
        document.getElementById("inputNombrePaciente").value =
          elemen.nombrePaciente + " " + elemen.apellidoPaciente;

        document.getElementById("inputTelefono").value = elemen.movilPaciente;
        document.getElementById("inputFecha").value = fechaModi;
        document.getElementById("inputEPS").value = elemen.epsPaciente;
        document.getElementById("cedulaPaciente").value = elemen.cedulaPaciente;
        document.getElementById("inputFechaCita").value = fechaCita;
        document.getElementById("inputEstadoCita").value = estado;
        document.getElementById("inputCorreo").value = elemen.emailPaciente;
      });
      // aca hago si estado es confirmado desactivo el boton
      if (estado == "Confirmado") {
        let btnIniciarFormulario = document.getElementById(
          "btnIniciarFormulario"
        );
        btnIniciarFormulario.disabled = true;
      }
    });
};

// -- FIN FUNCION --

// FUNCION PARA REESCRIBIR EL DISEÑO PARA INICIAR LA FORMULA DEL PACIENTE

const func_InterfazConsultarPaciente = () => {
  let Descrip = `   <form>
  <div class="row">
    <div class="col-6">
    <div class="dato1">
    <input
    type="text"
    value="${document.getElementById("idCedulaPaciente").value}"
    id="inputIDCitaFormulario"
    hidden
  />

    <div class="form-floating mb-3 datosInput">
      <input
        disabled
        value="${document.getElementById("cedulaPaciente").value}"
        type="text"
        class="form-control"
        id="inputCedulaPacienteFormulario"
      />
      <label for="floatingInput">Cedula</label>
    </div>
    <div class="form-floating mb-3">
      <input
      value="${document.getElementById("inputNombrePaciente").value}"
        disabled
        type="text"
        class="form-control"
        id="inputNombrePacienteFormulario"
      />
      <label for="floatingInput">Nombre Paciente</label>
    </div>
  </div>
      <div class="mb-3">
        <h1>Medicamentos a Resetar</h1>
      </div>

      <div class="mb-3">
        <label
          for="recipient-name"
          class="col-form-label"
          >Formula DE como Consumirlo:</label
        >
        <textarea
          class="form-control"
          id="formulaConsumir"
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="message-text" class="col-form-label"
          >Medicamento:</label
        >

        <!-- aca va el select-->
        <div class="selectorMedicamentos">
          <input
            id="idMedica"
            class="selectMedicamentos"
            type="text"
            list="opciones"
            placeholder="Medicamento"
          />

          <datalist id="opciones"> </datalist>

          <input
            class="selectMedicamentos"
            id="cantidadMedicamento"
            type="number"
            placeholder="Selecione la cantidad"
          />
        </div>
      </div>
      <!---------------------------------------------->
      <!-- aca voy agregar el boton para que se envie a la tabla-->
      <div class="mb-3">
        <button
          onclick="func_guardarMedicamentosEnLaTabla()"
          type="button"
          class="btn btn-primary botonEnviar"
        >
          Guardar
        </button>
      </div>

      <!-- aca voy a poner los otros inpus para los sintomas -->
      <div class="mb-3">
        <h1>Historial Clinico</h1>
      </div>
      <div class="mb-3">
        <label for="message-text" class="col-form-label"
          >Sintomas:</label
        >

        <input
          id="sintomas"
          class="selectMedicamentos2"
          type="text"
          placeholder="Sintomas"
        />
      </div>

      <div class="mb-3">
        <label
          for="recipient-name"
          class="col-form-label"
          >Descripcion:</label
        >

        <textarea
          class="form-control"
          id="descripcionSintomas"
        ></textarea>
      </div>

      <div class="mb-3">
        <button
          onclick="func_guardarSintomasEnlaTabla()"
          type="button"
          class="btn btn-primary botonEnviar"
        >
          Guardar
        </button>
      </div>
      <!---------------------------------------------------------------->
    </div>
    <div class="col-6">
      <div class="tituloPrincipal">
        <h1>Medicamentos Disponibles</h1>
      </div>
      <!-- aca voy a colocar la tabla donde se va mostrar los productos disponibles-->
      <div class="acaTabla">
        <table class="table tablasFormulas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Medicamento</th>
              <th>Existencia</th>
            </tr>
          </thead>
          <tbody
            class="table-group-divider"
            id="tablaProductos"
          ></tbody>
        </table>
      </div>

      <!-------------------------------------------------------------->
      <!-- aca voy hacer la tabla de los medicamentos resetados-->
      <div class="tituloPrincipal">
        <h1>Medicamentos Resetados</h1>
      </div>
      <div class="acaTabla">
        <table class="table tablasFormulas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Medicamento</th>
              <th>Posologia</th>
              <th>Cantidad</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody
            class="table-group-divider"
            id="tablaMedicamentoResetados"
          ></tbody>
        </table>
      </div>

      <!-------------------------------------->

      <!-- aca voy a colocar la tabla donde van a ir los sintomas -->

      <div class="tituloPrincipal">
        <h1>Sintomas del Paciente</h1>
      </div>
      <div class="acaTabla">
        <table class="table tablasFormulas">
          <thead>
            <tr>
              <th>Sintoma</th>
              <th>Descripcion</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody
            class="table-group-divider"
            id="tablaSintomasPaciente"
          ></tbody>
        </table>
      </div>

      <!------------------------------------------------------------------->
    </div>
  </div>
</form>
<div class="modal-footer botones">
<button
  type="button"
  class="btn btn-secondary"
  onclick="func_BtnCerrar()"
>
  Cerrar
</button>
<button
  onclick="func_insertarFormularioAlaBaseDatos()"
  type="button"
  class="btn btn-primary"
>
  Guardar
</button>

</div>

`;

  document.getElementById("contenedorPrincipal").innerHTML = Descrip;
};

// -- FIN FUNCION --

// aca voy hacer la funcion que se ejecute cuando se habra el Modal para que consuma el API de los
// medicamentos y se cargue en la tabla

const func_selecionarMedicamentos = async () => {
  let tablaProductos = document.getElementById("tablaProductos");
  let opciones = document.getElementById("opciones");

  let tablaMedicamentoResetados = document.getElementById(
    "tablaMedicamentoResetados"
  );
  let tablaSintomasPaciente = document.getElementById("tablaSintomasPaciente");
  tablaMedicamentoResetados.innerHTML = "";
  tablaSintomasPaciente.innerHTML = "";

  opciones.innerHTML = "";
  tablaProductos.innerHTML = "";
  let medicamentos = await fetch(
    "http://localHost:3000/consultorio/selecionarMedicamentos/"
  );
  medicamentos = await medicamentos.json();
  if (medicamentos.length > 0) {
    medicamentos.forEach((medi) => {
      // este va hacer para llenar la tabla
      let descrip = `<tr> <td>${medi.idItem} </td> <td>${medi.descripcionItem} </td> <td>${medi.existenciaItem} </td> </tr>`;

      // aca voy a poner las Opciones en el select para que el doctor pueda selecionar un medicmanto

      let descripOpciones = `<option value="${medi.idItem}">${medi.descripcionItem}</option>`;
      opciones.innerHTML += descripOpciones;
      tablaProductos.innerHTML += descrip;
    });
  }
};

// -- FIN FUNCION --

// EVENTO AL DARLE CLICK EN INICIAR
document
  .getElementById("btnIniciarFormulario")
  .addEventListener("click", () => {
    // aca llamo la funcion donde se ba reescribir

    func_InterfazConsultarPaciente();
    func_selecionarMedicamentos();
  });

// -- FIN EVENTO --

// FUNCION QUE SE VA GUARDAR LOS MEDICAMENTOS SELEDIONADOS EN LA TABLA

const func_guardarMedicamentosEnLaTabla = async () => {
  let formulaConsumir = document.getElementById("formulaConsumir").value;
  let idMedica = document.getElementById("idMedica").value;
  let cantidadMedicamento = document.querySelector(
    "#cantidadMedicamento"
  ).value;
  let yaResetado = false;

  let tablaMedicamentoResetados = document.getElementById(
    "tablaMedicamentoResetados"
  );
  if (
    idMedica.length > 0 &&
    cantidadMedicamento.length > 0 &&
    formulaConsumir.length > 0
  ) {
    let datosMedicamentos = await fetch(
      `http://localHost:3000/consultorio/selecionarMedicamentosResetados/?idMedicamento=${idMedica}&cantidad=${cantidadMedicamento}`
    );
    let jsonMedicamentos = await datosMedicamentos.json();

    if (jsonMedicamentos.procede == true) {
      // aca voy a verificar los que ya estan para ver si le pone mas cantidad o saber si ya lo habia selecionado
      let idDelMedicamento = document.querySelectorAll("#idDelMedicamento");
      console.log(idDelMedicamento);
      if (idDelMedicamento.length > 0) {
        idDelMedicamento.forEach((mediValue) => {
          if (parseInt(mediValue.textContent) == parseInt(idMedica)) {
            yaResetado = true;
          }
        });

        if (yaResetado == true) {
          Swal.fire({
            title: "Medicamento ya Resetado",
            text: "Este Medicamento ya lo seleciono",
            icon: "warning",
          });
        } else {
          let descripMedi = `<tr id="filaMedicamento">  <td id="idDelMedicamento" >${jsonMedicamentos.id} </td> <td>${jsonMedicamentos.nombre} </td> <td>${formulaConsumir} </td> <td>${jsonMedicamentos.cantidad} </td> <td><label  onclick="eliminarFila(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
        </svg></label></td></tr>`;

          tablaMedicamentoResetados.innerHTML += descripMedi;
        }
      } else {
        let descripMedi = `<tr id="filaMedicamento">  <td id="idDelMedicamento" >${jsonMedicamentos.id} </td> <td>${jsonMedicamentos.nombre} </td> <td>${formulaConsumir} </td> <td>${jsonMedicamentos.cantidad} </td>  <td><label  onclick="eliminarFila(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
      </svg></label></td></tr>`;

        tablaMedicamentoResetados.innerHTML += descripMedi;
      }

      document.getElementById("formulaConsumir").value = "";
      document.getElementById("idMedica").value = "";
      document.getElementById("cantidadMedicamento").value = "";

      //--------------------------------------------------------------------------------------
    } else {
      Swal.fire({
        title: "Hubo un error Verificar!!",
        text: jsonMedicamentos.error,
        icon: "warning",
      });
    }
  } else {
    Swal.fire({
      title: "Hubo un error Verificar!!",
      text: "Faltan Casillas por llenar",
      icon: "warning",
    });
  }
};

// -- FIN FUNCION --

// FUNCION PARA ELIMINAR EL ITEM DE LA FILA SELECIONADO DE ALGUNA DE LAS DOS TABLAS

function eliminarFila(boton) {
  var fila = boton.parentNode.parentNode;
  var tabla = fila.parentNode;
  tabla.removeChild(fila);
}

// -- FIN FUNCION --

// FUNCION PARA INSERTAR EN LA TABLA DE LOS SINTOMAS LO QUE ALLA LLENADO EN LOS INPUS

const func_guardarSintomasEnlaTabla = () => {
  let sintomas = document.getElementById("sintomas");
  let descripcionSintomas = document.getElementById("descripcionSintomas");
  let tablaSintomasPaciente = document.getElementById("tablaSintomasPaciente");
  if (sintomas.value.length > 0 && descripcionSintomas.value.length > 0) {
    let descr = `<tr id="tablaFilaSintomas"> <td>${sintomas.value} </td> <td>${descripcionSintomas.value} </td> <td>  <label  onclick="eliminarFila(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
  </svg></label> </td> </tr>`;
    tablaSintomasPaciente.innerHTML += descr;

    sintomas.value = "";
    descripcionSintomas.value = "";
  } else {
    Swal.fire({
      title: "Faltan Casillas por llenar !!",
      text: "Verificar y llenar los Campos Vacios",
      icon: "warning",
    });
  }
};

// -- FIN FUNCION --

// FUNCION PARA VOLVER A LA PAGINA PRINCIPAL

const func_BtnCerrar = () => {
  location.reload();
};

// -- FIN FUNCION --

// FUNCION PARA INSERTAR LOS DATOS DE LOS SINTOMAS Y LOS MEDICAMENTOS EN LA BASE DE DATOS

const func_insertarFormularioAlaBaseDatos = () => {
  let tablaFilaSintomas = document.querySelectorAll("#tablaFilaSintomas");
  let tablaMedicamentoResetados = document.querySelectorAll("#filaMedicamento");

  let detalle = [];
  let historial = [];

  // aca voy a verificar si tienen datos las tablas

  if (tablaFilaSintomas.length > 0 && tablaMedicamentoResetados.length > 0) {
    // aca voy a recorrer los tr de la tabla
    tablaFilaSintomas.forEach((fila) => {
      console.log(fila);
      let descripDetalle = [];
      fila.childNodes.forEach(function (nodo) {
        // y aca voy a recorrer los TD de cada fila del TR
        if (nodo.nodeType === Node.ELEMENT_NODE && nodo.tagName === "TD") {
          // console.log(nodo.textContent); // Accede al contenido de cada celda
          descripDetalle.push(nodo.textContent);
        }
      });
      historial.push({
        sintoma: descripDetalle[0],
        descripcion: descripDetalle[1],
      });
    });

    // ----------------------------------------------------
    // aca voy a recorrer los TR de la tabla de Medicamentos resetados

    tablaMedicamentoResetados.forEach((filaTr) => {
      let arregloMedicamento = [];

      filaTr.childNodes.forEach((nodeTD) => {
        if (nodeTD.nodeType === Node.ELEMENT_NODE && nodeTD.tagName === "TD") {
          arregloMedicamento.push(nodeTD.textContent);
        }
      });

      console.log(arregloMedicamento);
      detalle.push({
        cantidadDetalle: arregloMedicamento[3],
        posologiaDetalle: arregloMedicamento[2],
        item_id: arregloMedicamento[0],
      });
    });
    // ----------------------------------
    // aca voy a pasar todo a una variable tipo objeto

    let todoLosDatosMandar = {
      detalle: detalle,
      historial: historial,
    }; // todos los datos de la tabla estan aca
    console.log(todoLosDatosMandar);

    // aca voy hacer para Consumir el API de Insertar los datos

    // aca voy a llenar las variables del ID de la cita y la cedula del medico para poder mandarlo al API
    let idCita = document.getElementById("inputIDCitaFormulario").value; // aca voy a obtener el ID de la Cita
    let cedulaPaciente = document.getElementById(
      "inputCedulaPacienteFormulario"
    ).value; // aca voy a obtener la Cedula del Paciente
    let datosLocalStore = window.localStorage;
    let datosMedico = JSON.parse(datosLocalStore.getItem(1));
    datosMedico = datosMedico.cedulaMedico;

    console.log(
      "cedula :" +
        datosMedico +
        " cita: " +
        idCita +
        " cedula Paciente: " +
        cedulaPaciente
    );
    // ---------------------------------------------------------------------------------
    console.log(JSON.stringify(todoLosDatosMandar));
    console.log(
      `http://localHost:3000/consultorio/insertarDatosFormulario/?cedulaPaciente=${cedulaPaciente}&cedulaMedico=${datosMedico}&idCita=${idCita}`
    );
    fetch(
      `http://localHost:3000/consultorio/insertarDatosFormulario/?cedulaPaciente=${cedulaPaciente}&cedulaMedico=${datosMedico}&idCita=${idCita}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoLosDatosMandar),
      }
    )
      .then((date) => {
        return date.json();
      })
      .then((date) => {
        console.log(date);

        if (date.status == true) {
          // aca voy a poner un Swalert donde va poder escoger si le Agenda una Cita nueva o no

          Swal.fire({
            title: "Datos Insertados con Exito",
            text: "La Cita ya fue Evaluada deseas Agendar otra Cita?",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Agendar Cita!",
          }).then((result) => {
            // si le da que si va abrir un modal nuevo donde va poder Agendar la Cita

            if (result.isConfirmed) {
              // Abrir el segundo modal
              console.log("Abriendo el segundo modal...");

              modalAgendarCita.show();
            } else {
              window.location.href = "indexConsultorio.html";
            }
          });

          // -------------------------------------------------
        } else {
          Swal.fire({
            title: "Hubo un error!!",
            text: date.erro,
            icon: "warning",
          });
        }
      })
      .catch((error) => {
        console.log("tiene un error al consumir la API " + error);
      });

    // ----------------------------------------------------------
  } else {
    Swal.fire({
      title: "Atencion falta!!",
      text: "Verificar Los sintomas y medicamentos Resetados",
      icon: "warning",
    });
  }
};

// -- FIN FUNCION --
