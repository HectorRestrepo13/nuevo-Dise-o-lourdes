const express = require("express");
const mysql = require("./mysql");
const historial = express.Router();


 //Editar datos personales del paciente
/*  historial.put("/paciente/TraerDatosHistorial/:cedulaPaciente", (req, res) => {
    let cedulaPaciente = req.params.cedulaPaciente; //parametro
    let frmdata = {
        nombrePaciente: req.body.nombrePaciente,
        apellidoPaciente: req.body.apellidoPaciente,
        emailPaciente: req.body.emailPaciente,
        telefonoPaciente: req.body.telefonoPaciente,
        movilPaciente: req.body.movilPaciente,
        fechaNacimientopqciente: req.body.fechaNacimientopqciente,
        epsPaciente: req.body.epsPaciente,
        usuarioPaciente: req.body.usuarioPaciente
    }; 
       
    mysql.query("UPDATE paciente SET ? where cedulaPaciente=?", [frmdata,cedulaPaciente], (error, data) => {
      try {
        if(data==0){
          res.status(400).send("No hay datos en la base de datos!!");
        }else{
          res.status(200).send("Datos actualizados");
        }
       
      } catch (error) {
        console.log(error);
        throw `hay un error en la consulta${error}`;
      }
    });
  }); 
 */
  //Traer datos del paciente por identificacion
  historial.get("/paciente/traerDatosPaciente/historial/:identificacion", (req, res) => {
    let identificacion = req.params.identificacion; //parametro
    mysql.query("SELECT cedulaPaciente, nombrePaciente, apellidoPaciente, emailPaciente,telefonoPaciente, fechaNacimientoPqciente, epsPaciente FROM paciente WHERE cedulaPaciente = ?", [identificacion], (error, data) => {
      try {
        if(data==0){
          res.status(400).send("No hay datos en la base de datos!!");
        }else{
          
          res.status(200).send(data);
        }
       
      } catch (error) {
        console.log(error);
        throw `hay un error en la consulta${error}`;
      }
    });
  });



    //Traer datos historial
    historial.get("/paciente/traerHistorial/historial/:identificacion", (req, res) => {
        let identificacion = req.params.identificacion; //parametro
        mysql.query("SELECT h.idHistorial, h.sintomas, h.descripcion FROM historial h JOIN formula f ON h.formula_idFormula = f.idFormula JOIN paciente p ON f.paciente_cedulaPaciente = p.cedulaPaciente WHERE p.cedulaPaciente = ?", [identificacion], (error, data) => {
          try {
            if(data==0){
              res.status(400).send("No hay datos en la base de datos!!");
            }else{
              
              res.status(200).send(data);
            }
           
          } catch (error) {
            console.log(error);
            throw `hay un error en la consulta${error}`;
          }
        });
      });

        //Traer datos formula
    historial.get("/paciente/traerFormula/formula/:identificacion", (req, res) => {
        let identificacion = req.params.identificacion; //parametro
        mysql.query("SELECT idFormula, fechaFormula, paciente_cedulaPaciente, medico_cedulaMedico from formula where paciente_cedulaPaciente= ?", [identificacion], (error, data) => {
          try {
            if(data==0){
              res.status(400).send("No hay datos en la base de datos!!");
            }else{
              
              res.status(200).send(data);
            }
           
          } catch (error) {
            console.log(error);
            throw `hay un error en la consulta${error}`;
          }
        });
      });

             //Traer datos detalle formula
    historial.get("/paciente/traerDetalleFormula/detalleFormula/:identificacion", (req, res) => {
        let identificacion = req.params.identificacion; //parametro
        mysql.query("SELECT df.idDetalle, df.cantidadDetalle, df.posologiaDetalle, i.descripcionItem FROM detalleformula df INNER JOIN item i ON df.item_idItem = i.idItem   INNER JOIN formula f ON df.formula_idFormula = f.idFormula   INNER JOIN paciente p ON f.paciente_cedulaPaciente = p.cedulaPaciente    WHERE p.cedulaPaciente = ?", [identificacion], (error, data) => {
          try {
            if(data==0){
              res.status(400).send("No hay datos en la base de datos!!");
            }else{
              
              res.status(200).send(data);
            }
           
          } catch (error) {
            console.log(error);
            throw `hay un error en la consulta${error}`;
          }
        });
      });
module.exports = historial;