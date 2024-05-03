let express = require("express");
let mysql = require("./mysql");
const bcrypt=require("bcrypt");
let login = express.Router();

//selecionar Usuario medico para saber si existe y ingrese session
login.get("/login/selecionarUsuarioMedico/:email/:password", (req, res) => {
    let emailMedico = req.params.email;
  let password = req.params.password;
//Comparamos el correo solamente, para verificar el usuario
  let consulta = `select * from medico where emailMedico=?`;


  mysql.query(consulta, [emailMedico, password], (error, date) => {
    if (!error) {
   
      if (date.length > 0) {
        const usuario = date[0];
     
        if (usuario && usuario.password) {
          
          bcrypt.compare(password, usuario.password, (err, resultado) => {
            // Resto del código de comparación y manejo de errores
            if (err) {
              console.log(err);
              return res.status(500).send("Error interno del servidor");
            }
            if (!resultado) {
              return res.status(200).send({
                status: false,
                message: 'Contraseña incorrecta',
                codigo: 200,
             });
            }else{
   // Las contraseñas coinciden, el usuario está autenticado
   res.status(200).send({
    status: true,
    message: usuario,
    codigo: 200,
 } );
            }
         
          });
        } else {
          return res.status(401).send("Usuario o contraseña incorrectos");
        }
      } else {
        res.status(200).send({
          status: false,
          message: "Usuario No registrado",
          codigo: 200,
        });
      }
         
    } else {
      res.status(404).send(error);
    }
   
  
  });
});

//selecionar Usuario trabajodres para saber si existe y ingrese session

login.get("/login/selecionarUsuario/:email/:password", (req, res) => {
  let consulta = "select * from users where emailUser=?";
  let emailUser = req.params.email;
  let password = req.params.password;

  mysql.query(consulta, [emailUser, password], (error, date) => {
    if (!error) {
      console.log('Resultados de la consulta SQL:', date); // Agregar este console.log
      if (date.length > 0) {
        const usuario = date[0];
     
        if (usuario && usuario.password) {
          
          bcrypt.compare(password, usuario.password, (err, resultado) => {
            // Resto del código de comparación y manejo de errores
            if (err) {
              console.log(err);
              return res.status(500).send("Error interno del servidor");
            }
            if (!resultado) {
              return res.status(200).send({
                status: false,
                message: 'Contraseña incorrecta',
                codigo: 200,
             });
            }else{
  // Las contraseñas coinciden, el usuario está autenticado
  res.status(200).send({
    status: true,
    message: usuario,
    codigo: 200,
 } );
            }
        
          });
        } else {
          return res.status(401).send("Usuario o contraseña incorrectos");
        }
      } else {
        res.status(200).send({
          status: false,
          message: "Usuario No registrado",
          codigo: 200,
        });
      }
    } else {
      res.status(404).send(error);
    }
  
    });
  
});

login.get("/login/selecionarPaciente/:email/:password", (req, res) => {
  let consulta =
    "SELECT * FROM paciente WHERE emailPaciente = ?";
  let email = req.params.email;
  let password = req.params.password;

  mysql.query(consulta, [email, password], (error, data) => {
    if (!error) {
      console.log('Resultados de la consulta SQL:', data); // Agregar este console.log
      if (data.length > 0) {
        const usuario = data[0];
     
        if (usuario && usuario.passwordPaciente) {
          
          bcrypt.compare(password, usuario.passwordPaciente, (err, resultado) => {
            // Resto del código de comparación y manejo de errores
            if (err) {
              console.log(err);
              return res.status(500).send("Error interno del servidor");
            }
            if (!resultado) {
              return res.status(200).send({
                status: false,
                message: 'Contraseña incorrecta',
                codigo: 200,
             });
            }else{
              res.status(200).send({
                status: true,
                message: usuario,
                codigo: 200,
             } );
            }
             // Las contraseñas coinciden, el usuario está autenticado
      
          });
        } else {
          return res.status(401).send("Usuario o contraseña incorrectos");
        }
      } else {
       // Las contraseñas coinciden, el usuario está autenticado
       res.status(200).send({
        status: false,
        message: 'Usuario no registrado',
        codigo: 200,
     } );
      }
    } else {
      res.status(500).send(error);
    }
   
  });
});



// Cambiar contrasena si el usuario lo desea o se le olvida
/* login.post("/login/cambiarContrasenaUsuarios/:cedula/:nuevaContrasena", (req, res) => {
  let cedula = req.params.cedula;
  let nuevaContrasena = bcrypt.hashSync(req.params.nuevaContrasena, 10)

  // Función para actualizar la contraseña de un usuario en una tabla específica
  function actualizarContrasena(tabla, columnaCedula, columnaPassword, nombreTabla) {
      let consultaUsuario = `SELECT * FROM ${tabla} WHERE ${columnaCedula}=?`;
      let actualizarContrasenaQuery = `UPDATE ${tabla} SET ${columnaPassword}=? WHERE ${columnaCedula}=?`;

      mysql.query(consultaUsuario, [cedula], (error, resultado) => {
         
          if (error) {
            res.status(500).send({
              status: false,
              message: `Error al buscar el usuario en la tabla`
         
          });
          return;
        
          }
           // Si no se encuentra ningún usuario, enviar un estado 404
           if (resultado.length === 0) {
            res.status(404).send({
                status: false,
                message: `No se encontró ningún usuario con la cédula ${cedula} en la tabla ${nombreTabla}`
            });
            return;
        }

          mysql.query(actualizarContrasenaQuery, [nuevaContrasena, cedula], (error, resultado) => {
              if (error) {
                  res.status(500).send({
                      status: false,
                      message: "Error al actualizar la contraseña",
                      error: error
               
                  });
                  return;
              }
                res.status(200).send({
                  status: true,
                  message: "Contraseña actualizada correctamente"
             
              });
              

              
          });
      });
  }

  // Llamamos a la función para actualizar la contraseña en cada tabla
  actualizarContrasena('medico', 'cedulaMedico', 'password', 'medico');
  actualizarContrasena('users', 'cedulaUser', 'password', 'users');
  actualizarContrasena('paciente', 'cedulaPaciente', 'passwordPaciente', 'paciente');
});



 */







// Cambiar contrasena si el usuario lo desea o se le olvida
login.post("/login/cambiarContrasenaDoctor/:cedulaDoctor", (req, res) => {
  const cedulaDoctor = req.params.cedulaDoctor;
  const {nuevaContrasena} = req.body;
 let nuevaPass= bcrypt.hashSync(nuevaContrasena, 10)
  

      let consultaUsuario = `SELECT * FROM medico WHERE cedulaMedico=?`;
      let actualizarContrasenaQuery = `UPDATE medico SET password=? WHERE cedulaMedico=?`;

      mysql.query(consultaUsuario, [cedulaDoctor], (error, resultado) => {
         
          if (error) {
            res.status(500).send({
              status: false,
              message: `Error al buscar el usuario en la tabla`
         
          });
          return;
        
          }
           // Si no se encuentra ningún usuario, enviar un estado 404
           if (resultado.length <=0) {
            res.status(404).send({
                status: false,
                message: `No se encontró ningún usuario con la cédula proporcionada`
            });
            return;
        }

          mysql.query(actualizarContrasenaQuery, [nuevaPass, cedulaDoctor], (error, resultado) => {
              if (error) {
                  res.status(500).send({
                      status: false,
                      message: "Error al actualizar la contraseña",
                      error: error
               
                  });
                  return;
              }
                res.status(200).send({
                  status: true,
                  message: "Contraseña actualizada correctamente"
             
              });
              

              
          });
      });
});



// Cambiar contrasena si el usuario lo desea o se le olvida
login.post("/login/cambiarContrasenaPaciente/:cedulaPaciente", (req, res) => {
  const cedulaPaciente = req.params.cedulaPaciente;
  const{nuevaContrasena}=req.body
  let nuevaPass = bcrypt.hashSync(nuevaContrasena, 10)

      let consultaUsuario = `SELECT * FROM paciente WHERE cedulaPaciente=?`;
      let actualizarContrasenaQuery = `UPDATE paciente SET passwordPaciente=? WHERE cedulaPaciente=?`;

      mysql.query(consultaUsuario, [cedulaPaciente], (error, resultado) => {
         
          if (error) {
            res.status(500).send({
              status: false,
              message: `Error al buscar el usuario en la tabla`
         
          });
          return;
        
          }
           // Si no se encuentra ningún usuario, enviar un estado 404
           if (resultado.length <=0) {
            res.status(404).send({
                status: false,
                message: `No se encontró ningún usuario con la cédula proporcionada`
            });
            return;
        }

          mysql.query(actualizarContrasenaQuery, [nuevaPass, cedulaPaciente], (error, resultado) => {
              if (error) {
                  res.status(500).send({
                      status: false,
                      message: "Error al actualizar la contraseña",
                      error: error
               
                  });
                  return;
              }
                res.status(200).send({
                  status: true,
                  message: "Contraseña actualizada correctamente"
             
              });
              

              
          });
      });
});


// Cambiar contrasena si el usuario lo desea o se le olvida
login.post("/login/cambiarContrasenaUsuario/:cedulaUsuario", (req, res) => {
  const cedulaUsuario = req.params.cedulaUsuario;
  const{nuevaContrasena}=req.body;
  let nuevaPass = bcrypt.hashSync(nuevaContrasena, 10)

      let consultaUsuario = `SELECT * FROM users WHERE cedulaUser=?`;
      let actualizarContrasenaQuery = `UPDATE users SET password=? WHERE cedulaUser=?`;

      mysql.query(consultaUsuario, [cedulaUsuario], (error, resultado) => {
         
          if (error) {
            res.status(500).send({
              status: false,
              message: `Error al buscar el usuario en la tabla`
         
          });
          return;
        
          }
           // Si no se encuentra ningún usuario, enviar un estado 404
           if (resultado.length <=0) {
            res.status(404).send({
                status: false,
                message: `No se encontró ningún usuario con la cédula proporcionada`
            });
            return;
        }

          mysql.query(actualizarContrasenaQuery, [nuevaPass, cedulaUsuario], (error, resultado) => {
              if (error) {
                  res.status(500).send({
                      status: false,
                      message: "Error al actualizar la contraseña",
                      error: error
               
                  });
                  return;
              }
                res.status(200).send({
                  status: true,
                  message: "Contraseña actualizada correctamente"
             
              });
              

              
          });
      });
});



module.exports = login;