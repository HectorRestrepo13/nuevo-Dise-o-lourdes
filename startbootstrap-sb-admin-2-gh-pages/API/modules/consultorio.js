let express = require("express");
let mysql = require("./mysql.js");

let consultorio = express.Router();
consultorio.use(express.json());

// API para consultar las citas
consultorio.get("/consultorio/selecionarCitasPorAtender", (req, res) => {
  let estado = req.query.estado;
  let nombre = req.query.nombre;
  let consulta = `SELECT cita.idCita,cita.fechaCita,cita.horaCita,cita.estadoCita, CONCAT(paciente.nombrePaciente," ",paciente.apellidoPaciente) As paciente ,medico.nombreMedico FROM cita INNER JOIN medico ON cita.medico_cedulaMedico=medico.cedulaMedico INNER JOIN paciente ON cita.paciente_cedulaPaciente=paciente.cedulaPaciente WHERE cita.estadoCita =? and medico.cedulaMedico=?;`;
  mysql.query(consulta, [estado, nombre], (error, date) => {
    if (!error) {
      res.status(200).send(date);
    } else {
      res.status(404).send(error);
    }
  });
});
//--------------
//aca voy hacer una consulta donde voy a selecionar al paciente
consultorio.get("/consultorio/selecionarDatosPaciente/:id", (req, res) => {
  let id = req.params.id;

  let consulta = `SELECT * FROM paciente WHERE paciente.cedulaPaciente =(SELECT cita.paciente_cedulaPaciente FROM cita WHERE cita.idCita =${id})`;
  mysql.query(consulta, (error, data) => {
    if (!error) {
      res.status(200).send(data);
    } else {
      res.status(404).send(error);
    }
  });
});

//aca voy hacer una consulta donde voy a selecionar las formulas medicas de los clientes

consultorio.get("/consultorio/selecionarDatosPaciente/", (req, res) => {
  let cedula = req.query.cedula;
  let dactor = req.query.dactor;

  let consulta = `select formula.idFormula,paciente.nombrePaciente,medico.nombreMedico,formula.fechaFormula from formula INNER JOIN paciente ON formula.paciente_cedulaPaciente=paciente.cedulaPaciente INNER JOIN medico ON formula.medico_cedulaMedico=medico.cedulaMedico where paciente_cedulaPaciente=(SELECT cita.paciente_cedulaPaciente from cita WHERE cita.idCita=?) and medico_cedulaMedico=?`;

  mysql.query(consulta, [cedula, dactor], (error, date) => {
    if (!error) {
      res.status(200).send(date);
    } else {
      res.status(404).send(error);
    }
  });
});

//aca voy hacer el API donde va selecionar el Historial

consultorio.get(
  "/consultorio/selecionarDatosHistorial/:idFormula",
  (req, res) => {
    let idFormula = req.params.idFormula;

    let consulta =
      `SELECT * FROM historial WhERE formula_idFormula =` + idFormula;

    mysql.query(consulta, (error, date) => {
      if (!error) {
        res.status(200).send(date);
      } else {
        res.status(404).send(error);
      }
    });
  }
);

//aca voy hacer el API donde va selecionar el detalleFormula

consultorio.get(
  "/consultorio/selecionarDetalleFormula/:idFormula",
  (req, res) => {
    let idFormula = req.params.idFormula;

    let consulta =
      `SELECT detalleformula.idDetalle,item.descripcionItem,detalleformula.posologiaDetalle,detalleformula.cantidadDetalle FROM detalleformula INNER JOIN item ON detalleformula.item_idItem=item.idItem WhERE formula_idFormula =` +
      idFormula;

    mysql.query(consulta, (error, date) => {
      if (!error) {
        res.status(200).send(date);
      } else {
        res.status(404).send(error);
      }
    });
  }
);

// TENGO QUE SEGUIR DE AQUI HACIA ABAJO ||

// aca voy hacer la API donde voy a llamar la tabla de los medicamentos
consultorio.get("/consultorio/selecionarMedicamentos/", (req, res) => {
  let consulta = `SELECT * FROM item WHERE existenciaItem > 0`;
  mysql.query(consulta, (error, date) => {
    if (!error) {
      res.status(200).send(date);
    } else {
      res.status(404).send(error);
    }
  });
});

// aca voy hacer un API para consultar los medicamentos para agregar a la tabla

consultorio.get("/consultorio/selecionarMedicamentosResetados/", (req, res) => {
  let idMedicamento = req.query.idMedicamento;
  let cantidad = req.query.cantidad;
  let consulta = `SELECT * FROM item where idItem=` + idMedicamento;

  mysql.query(consulta, (error, date) => {
    if (!error) {
      // aca voy hacer una desicion para que pueda enviarse si tiene la cantidad que requiere en el inventario
      if (date.length > 0) {
        if (cantidad <= date[0].existenciaItem) {
          res.status(200).send({
            procede: true,
            nombre: date[0].descripcionItem,
            id: date[0].idItem,
            cantidad: cantidad,
            error: null,
          });
        } else {
          res.status(404).send({
            procede: false,
            nombre: null,
            id: null,
            cantidad: null,
            error: "Esa cantidad no hay en el inventario",
          });
        }
      } else {
        res.status(404).send({
          procede: false,
          nombre: null,
          id: null,
          cantidad: null,
          error: "Ese Medicamento no existe en el inventario",
        });
      }
    } else {
      res.status(505).send({
        procede: false,
        nombre: null,
        id: null,
        cantidad: null,
        error: "error en la API " + error,
      });
    }
  });
});

// aca voy hacer la API donde va insertar los datos de la formula,datalle formula y el historial
// a la base de DAtos

consultorio.post("/consultorio/insertarDatosFormulario/", async (req, res) => {
  try {
    let fechaActual = new Date();
    fechaActual = `${fechaActual.getFullYear()}-${
      fechaActual.getMonth() + 1
    }-${fechaActual.getDate()}`;

    let cedulaPaciente = req.query.cedulaPaciente;
    let cedulaMedico = req.query.cedulaMedico;
    let idCita = req.query.idCita;
    let idFormulaCreada;
    let objetoDatosFormula = req.body;

    // Insertación a la tabla de formula
    let insertacionFormula = new Promise((resolve, reject) => {
      let consultaFormula = `INSERT INTO formula(fechaFormula, paciente_cedulaPaciente, medico_cedulaMedico, cita_idCita) VALUES ('${fechaActual}', ${cedulaPaciente}, ${cedulaMedico}, ${idCita})`;
      mysql.query(consultaFormula, (error, date) => {
        if (!error) {
          idFormulaCreada = parseInt(date.insertId);
          resolve(true);
        } else {
          reject(
            "Hubo un error en la inserción de la Formula. Verificar: " + error
          );
          console.log(reject);
        }
      });
    });

    // Esperar a que se complete la inserción de la fórmula
    let insertoFormulaBolea = await insertacionFormula;

    // Si la inserción de la fórmula fue exitosa, proceder con la inserción de los detalles de la fórmula
    if (insertoFormulaBolea) {
      for (const detalleFormula of objetoDatosFormula.detalle) {
        let consultaInsertacionDetalle = `INSERT INTO detalleformula(cantidadDetalle, posologiaDetalle, item_idItem, formula_idFormula) VALUES (${detalleFormula.cantidadDetalle}, '${detalleFormula.posologiaDetalle}', ${detalleFormula.item_id}, ${idFormulaCreada})`;
        await new Promise((resolve, reject) => {
          mysql.query(consultaInsertacionDetalle, (error, date) => {
            if (error) {
              reject(
                "Hubo un error en la inserción en el detalle de la fórmula. Verifique: " +
                  error
              );
            } else {
              console.log(date);
              resolve();
            }
          });
        });
      }
      // ----------------------------------------------------------

      // aca despues de insertar en la tabla detalle formula voy hacer un PUT en la tabla Item para Actualizar
      // y quitarle la cantidad que se vendio

      for (const detalleFormula of objetoDatosFormula.detalle) {
        // aca voy hacer un promesa donde se va hacer la consulta para saber cuanta cantidad de Item tiene
        let obtenerCantidadItem = new Promise((resolve, reject) => {
          let consultaObtenerItemRestantes =
            `SELECT existenciaItem  FROM item WHERE idItem=` +
            parseInt(detalleFormula.item_id);

          mysql.query(consultaObtenerItemRestantes, (erro, date) => {
            if (!erro) {
              resolve(date[0].existenciaItem);
            } else {
              reject(
                "Hubo un error en la consulta de exitenciaItem de la Consulta"
              );
            }
          });
        });

        // -----------------------------------------------------------

        obtenerCantidadItem
          .then((cantidadItem) => {
            // aca voy a coger los datos que me devuelve la promesa

            console.log("aca va ir la cantidad que coge " + cantidadItem);
            let cantidadTotalFinal =
              parseInt(cantidadItem) - parseInt(detalleFormula.cantidadDetalle);
            let updateItemCantidad = new Promise((resolve, reject) => {
              let consultaDeUpdate = `UPDATE item set existenciaItem=${cantidadTotalFinal} where idItem=${parseInt(
                detalleFormula.item_id
              )}`;

              mysql.query(consultaDeUpdate, (error, date) => {
                if (!error) {
                  resolve();
                } else {
                  reject("Hubo un error en la UPDATE de la tabla  de los Item");
                }
              });
            });

            updateItemCantidad
              .then(() => {
                // aca voy hacer una promesa para que Actualice el estado de la Cita

                let ActulizarEstadoCita = new Promise((resolve, reject) => {
                  let consultaUpdateEstadoCita = `UPDATE cita set estadoCita='Confirmado' where idCita = ${idCita}`;

                  mysql.query(consultaUpdateEstadoCita, (erro, date) => {
                    if (!erro) {
                      resolve();
                    } else {
                      reject(
                        "Hubo un error en la Actuliazacion del estado De la Cita"
                      );
                    }
                  });
                });
                // ---------------------------

                ActulizarEstadoCita.then(() => {}).catch((erro) => {
                  res.status(404).send({
                    status: false,
                    descripcion:
                      "Verifique la API donde se Actuliza el estado De la Cita",
                    erro: erro,
                  });
                });
              })
              .catch((erro) => {
                res.status(404).send({
                  status: false,
                  descripcion:
                    "Error en la Consulta De Actualizar la Cantidad de la la tabla  Item",
                  erro: erro,
                });
              });
          })
          .catch((error) => {
            res.status(404).send({
              status: false,
              descripcion:
                "Error en la Consulta De Coger la Cantidad de los Item",
              erro: error,
            });
          });
      }

      // -------------------------------------------------------------

      // aca voy hacer para que inserte en la tabla de historial

      for (const historial of objetoDatosFormula.historial) {
        await new Promise((resolve, reject) => {
          let descripHistorial = `INSERT INTO historial(sintoma,descripcion,formula_idFormula) values('${historial.sintoma}','${historial.descripcion}',${idFormulaCreada})`;
          console.log(descripHistorial);
          mysql.query(descripHistorial, (error, date) => {
            if (!error) {
              resolve(date);
            } else {
              reject(
                "Hubo un problema en la insertacion del historial: " + error
              );
            }
          });
        });
      }
      res.status(200).send({
        status: true,
        descripcion: "Datos insertados con Exito",
        erro: null,
      });
    }
  } catch (error) {
    res.status(404).send({
      status: false,
      descripcion: "Error al insertar los Datos",
      erro: error,
    });
  }
});

//----------------------------------------------------------------------------------

// aca voy hacer la API donde va Agendar la Cita del paciente

consultorio.post("/consultorio/insertarDatosAgendarCita/", (req, res) => {
  let cedulaPaciente = req.body.cedulaPaciente;
  let cedulaMedico = req.body.cedulaMedico;
  let fechaCita = req.body.fechaCita;
  let horaCita = req.body.horaCita;

  var tiempoInicialArray = horaCita.split(":");
  var horasInicial = parseInt(tiempoInicialArray[0]);
  var horasMenos = parseInt(tiempoInicialArray[0]);

  var minutosInicial = parseInt(tiempoInicialArray[1]);

  horasInicial = horasInicial + 1;
  horasMenos = horasMenos - 1;

  if (horasInicial >= 24) {
    horasInicial = horasInicial - 24;
  }
  if (horasMenos >= 24) {
    horasMenos = horasMenos - 24;
  }

  let consultaSiYaTieneCitaEsaHora = `SELECT * FROM cita WHERE fechaCita = '${fechaCita}' AND estadoCita ="Pendiente"  AND ( horaCita BETWEEN '${horasMenos}:${minutosInicial}' AND '${horaCita}'  OR horaCita BETWEEN '${horaCita}' AND '${horasInicial}:${minutosInicial}');`;
  console.log("consulta -" + consultaSiYaTieneCitaEsaHora);
  let promesaConsultaCita = new Promise((resolve, reject) => {
    mysql.query(consultaSiYaTieneCitaEsaHora, (erro, date) => {
      if (!erro) {
        resolve(date);
      } else {
        reject(
          "Hubo un problema en la Consulta de mirar si hay mas citas para ese dia"
        );
      }
    });
  });
  //  -----

  promesaConsultaCita
    .then((datos) => {
      console.log(datos.length);
      console.log(datos);

      if (datos.length == 0) {
        let insertarCita = `insert into cita(fechaCita,horaCita,paciente_cedulaPaciente,medico_cedulaMedico) values('${fechaCita}','${horaCita}',${cedulaPaciente},${cedulaMedico})`;

        mysql.query(insertarCita, (erro, date) => {
          if (!erro) {
            res.status(404).send({
              status: true,
              descripcion: "Insertacion de la Cita fue exitosa ",
              error: null,
            });
          } else {
            res.status(404).send({
              status: false,
              descripcion: null,
              error: "Hubo un error al Insertar La Cita " + erro,
            });
          }
        });
      } else {
        res.status(404).send({
          status: false,
          descripcion: "ya esta Agendado para esa hora ",
          error: null,
        });
      }
    })
    .catch((erro) => {
      res.status(404).send({
        status: false,
        descripcion: null,
        error: " hubo un error en la consulta de que si hay mas citas " + erro,
      });
    });
});

module.exports = consultorio;
