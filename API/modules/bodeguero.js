/* import mysql from "./mysql";
import express from "express"; */

let mysql = require("./mysql");
let express = require("express");
let bodeguero = express.Router();
bodeguero.use(express.json());

bodeguero.get(
  "/bodeguero/selecionarMedicamentosResetados/:cedula",
  (req, res) => {
    let cedula = req.params.cedula;
    let consulta = `SELECT detalleformula.idDetalle,item.descripcionItem,detalleformula.cantidadDetalle,detalleformula.plazoReclamacion from detalleformula INNER JOIN item ON detalleformula.item_idItem = item.idItem WHERE formula_idFormula IN (SELECT idFormula from formula WHERE paciente_cedulaPaciente =${cedula}) and estado="pendiente"  ORDER by idDetalle DESC;`;

    mysql.query(consulta, (erro, date) => {
      if (!erro) {
        res.status(200).send({
          status: true,
          descripcion: "consulta realizada con exito",
          error: null,
          datos: date,
        });
      } else {
        res.status(404).send({
          status: false,
          descripcion: "Error al realizar la consulta",
          error: erro,
          datos: null,
        });
      }
    });
    // -----------
  }
);

// aca voy hacer el API que va descontar los ITEM que el paciente fue a reclamar
bodeguero.put("/bodeguero/pagarMedicamentosSelecionados/", (req, res) => {
  let idMedicam = req.query.idMedicam;
  let cantidad = req.query.cantidad;
  let idItemMedicamento;

  // primera promesa para obtener el ID del item haciendo la consulta de detalle

  let obtenerIdItem = new Promise((resolve, reject) => {
    let consul = `SELECT item_idItem from detalleformula where idDetalle=${idMedicam}`;
    mysql.query(consul, (erro, date) => {
      if (!erro) {
        idItemMedicamento = parseInt(date[0].item_idItem);
        resolve(parseInt(date[0].item_idItem));
      } else {
        reject("error en la promesa de obtener el ID del item");
      }
    });
  });

  obtenerIdItem
    .then((idItem) => {
      // segunda aca voy hacer un promesa donde se va hacer la consulta para saber cuanta cantidad de Item tiene
      let obtenerCantidadItem = new Promise((resolve, reject) => {
        let consultaObtenerItemRestantes =
          `SELECT existenciaItem  FROM item WHERE idItem=` + idItem;

        mysql.query(consultaObtenerItemRestantes, (erro, date) => {
          if (!erro) {
            if (date.length > 0) {
              resolve(date[0].existenciaItem);
            } else {
              reject("Ese Item no exite");
            }
          } else {
            reject(
              "Hubo un error en la consulta de exitenciaItem de la Consulta"
            );
          }
        });
      });

      obtenerCantidadItem
        .then((cantidadItem) => {
          // aca voy hacer la tercera promesa este es para actualizar
          // aca voy a coger los datos que me devuelve la promesa

          console.log("aca va ir la cantidad que coge " + cantidadItem);
          let cantidadTotalFinal = parseInt(cantidadItem) - parseInt(cantidad);
          let consultaDeUpdate = `UPDATE item set existenciaItem=${cantidadTotalFinal} where idItem=${idItemMedicamento}`;

          let updateEstado = new Promise((resolve, reject) => {
            mysql.query(consultaDeUpdate, (error, date) => {
              if (!error) {
                resolve(true);
              } else {
                reject("Hubo un error en la promesa actualizar cantidad");
              }
            });
          });

          updateEstado
            .then(() => {
              // aca voy hacer la cuarta promesa donde se va actualizar el estado de detallerFormula

              let actualizarEstado = `UPDATE detalleformula set estado="reclamado" where idDetalle =${idMedicam}`;

              mysql.query(actualizarEstado, (erro, date) => {
                if (!erro) {
                  res.status(200).send({
                    status: true,
                    descripcion: "Actualizado con exito",
                    error: null,
                  });
                } else {
                  res.status(404).send({
                    status: false,
                    descripcion: "Hubo un error en la APi al Actualizar",
                    error: error,
                  });
                }
              });
            })
            .catch((error) => {
              res.status(404).send({
                status: false,
                descripcion: "Hubo un error en la APi al Actualizar",
                error: error,
              });
            });
        })
        .catch((error) => {
          res.status(404).send({
            status: false,
            descripcion: "Hubo un error en la APi al Actualizar",
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(404).send({
        status: false,
        descripcion: "Hubo un error en la APi al Actualizar",
        error: error,
      });
    });
});

bodeguero.get("/bodeguero/verificarCantidadMedicamentos", (req, res) => {
  let idDetalle = req.query.idDetalle;
  let cantidad = req.query.cantidad;

  let consulta = `SELECT existenciaItem from item WHERE idItem =(SELECT item_idItem from detalleformula WHERE idDetalle =${idDetalle});`;

  mysql.query(consulta, (erro, data) => {
    if (!erro) {
      if (parseInt(cantidad) <= parseInt(data[0].existenciaItem)) {
        res.status(200).send({
          status: true,
          descripcion: "esa cantidad esta en el inventario",
          error: null,
        });
      } else {
        res.status(200).send({
          status: false,
          descripcion: "esa cantidad NO esta en el inventario",
          error: null,
        });
      }
    } else {
      res.status(404).send({
        status: false,
        descripcion: "Error en la consulta de la base de datos de la API",
        error: erro,
      });
    }
  });
});

bodeguero.get("/bodeguero/consultarTodoMedicamentos", (req, res) => {
  let consulta = `Select * from item`;
  mysql.query(consulta, (error, date) => {
    if (!error) {
      res.status(404).send({
        status: true,
        datos: date,
      });
    } else {
      res.status(404).send({
        status: false,
        datos: null,
      });
    }
  });
});

// este va hacer la API donde se va actualizar el medicamento del inventario

bodeguero.put("/bodeguero/updateMedicamento", (req, res) => {
  let idItem = req.query.idItem;
  let nombreItem = req.query.nombreItem;
  let cantidadItem = req.query.cantidadItem;

  let updateItem = `UPDATE item SET descripcionItem ='${nombreItem}', existenciaItem =${cantidadItem} where idItem =${parseInt(
    idItem
  )} `;

  mysql.query(updateItem, (error, date) => {
    if (!error) {
      res.status(200).send({
        status: true,
        descripcion: "Se Actualizo con exito el Item",
        error: null,
      });
    } else {
      res.status(404).send({
        status: false,
        descripcion: "No se pudo actualizar el Item en la API",
        error: error,
      });
    }
  });
});

module.exports = bodeguero;
