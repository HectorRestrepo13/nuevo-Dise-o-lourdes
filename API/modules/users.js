const express = require("express");
const mysql = require("./mysql");
const users = express.Router();
const bcrypt=require("bcrypt");

// Traer todos los pacientes siempre por id
users.get("/Funcionario/traerFuncionario", (req, res) => {
    let consulta = `SELECT users.cedulaUser, users.emailUser, users.userName, users.password, rol.nombreRol, users.estado
    FROM users
    INNER JOIN rol ON users.rol_idRol = rol.idRol
    WHERE rol_idRol IN (2, 4) and estado='activo';`;
                   
    mysql.query(consulta, (error, data) => {

      try {
        if (error) {
          console.error("Error al ejecutar la consulta:", error);
          throw error;
        }
        res.status(200).send(data);
      } catch (error) {
        console.log(error);
        throw `Hubo un error en la consulta: ${error}`;
      }
    });
  });
  

  // Traer todos los pacientes siempre por id y inactivos
users.get("/Funcionario/traerFuncionarioInactivo", (req, res) => {
  let consulta = `SELECT users.cedulaUser, users.emailUser, users.userName, users.password, rol.nombreRol, users.estado
  FROM users
  INNER JOIN rol ON users.rol_idRol = rol.idRol
  WHERE rol_idRol IN (2, 4) and estado='inactivo';`;
                 
  mysql.query(consulta, (error, data) => {

    try {
      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        throw error;
      }
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      throw `Hubo un error en la consulta: ${error}`;
    }
  });
});


// Traer todos los pacientes siempre por id
users.get("/Funcionario/traerFuncionarioAdminGerente", (req, res) => {
  let consulta = `SELECT users.cedulaUser, users.emailUser, users.userName,rol.nombreRol,users.estado
  FROM users
  INNER JOIN rol ON users.rol_idRol = rol.idRol
  WHERE rol_idRol IN (1, 0) and estado='activo';`;
                 
  mysql.query(consulta, (error, data) => {

    try {
      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        throw error;
      }
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      throw `Hubo un error en la consulta: ${error}`;
    }
  });
});


// Traer todos los pacientes siempre por id
users.get("/Funcionario/traerFuncionarioAdminGerenteInactivos", (req, res) => {
  let consulta = `SELECT users.cedulaUser, users.emailUser, users.userName,rol.nombreRol,users.estado
  FROM users
  INNER JOIN rol ON users.rol_idRol = rol.idRol
  WHERE rol_idRol IN (1, 0) and estado='inactivo';`;
                 
  mysql.query(consulta, (error, data) => {

    try {
      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        throw error;
      }
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      throw `Hubo un error en la consulta: ${error}`;
    }
  });
});
users.get("/user/verificarUsers/:cedulaUser", (req, res) => {
    let cedula= req.params.cedulaUser;
    mysql.query("SELECT*FROM users WHERE cedulaUser= ?", [cedula], (error, data) => {
      try {
        if(data==0){
          res.status(400).send("No Existe el usuario en la base de datos!!");
        }else{
          res.status(200).send(data);
        }
       
      }catch (error) {
        console.log(error);
        throw `hay un error en la consulta${error}`;
    }
    });
});


// Endpoint para la creación de un nuevo usuario
users.post("/usuario/create", (req, res) => {
    // Extraer los datos del cuerpo de la solicitud
    const { cedulaUser, emailUser,userName, password , rol_idRol} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

        // El rol existe, procede a insertar el usuario en la base de datos
        const formData = {
            cedulaUser: cedulaUser,
            emailUser: emailUser,
            userName: userName,
            rol_idRol: rol_idRol,
            password:hashedPassword
        };

        // Realizar la inserción en la base de datos
        mysql.query("INSERT INTO users SET ?", formData, (insertError, insertResult) => {
            if (insertError) {
                console.error('Error al insertar usuario en la base de datos: ' + insertError);
                res.status(500).send("Error en la consulta: " + insertError.message);
                return;
            }
            console.log('Usuario insertado correctamente en la base de datos');
            res.status(200).send(insertResult);
        });
    });


    users.put("/usuario/editarUsuario/:cedulaUser", (req, res) => {
        let cedulaUser = req.params.cedulaUser;
  const{emailUser, userName, rol_idRol, password}=req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
        // Crear objeto con los datos actualizados
        const UsuarioActualizado = {
          emailUser:emailUser,
          userName:userName,
          rol_idRol:rol_idRol,
        password:hashedPassword
        };
      
        // Ejecutar consulta para actualizar los datos del doctor
        mysql.query("UPDATE users SET ? WHERE cedulaUser = ?", [UsuarioActualizado, cedulaUser], (error, data) => {
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


users.put("/users/updateUnoEstado/:id", (req, res) => {
  let id = req.params.id; //parametro

  mysql.query("update users set estado='inactivo' where cedulaUser=?", [id], (error, data) => {
    try {
      res.status(200).send("Actualizacion exitosa!!");
    } catch (error) {
      console.log(error);
      throw `hay un error en la consulta${error}`;
    }
  });
});

users.put("/users/updateUnoEstadoActivar/:id", (req, res) => {
  let id = req.params.id; //parametro

  mysql.query("update users set estado='activo' where cedulaUser=?", [id], (error, data) => {
    try {
      res.status(200).send("Actualizacion exitosa!!");
    } catch (error) {
      console.log(error);
      throw `hay un error en la consulta${error}`;
    }
  });
});
module.exports=users;