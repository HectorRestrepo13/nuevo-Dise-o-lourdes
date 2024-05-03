/* Modulo que gestiona la conexion con la base de datos */

const mysql = require("mysql2");

/* Cadena de conexion */

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bd_clinica_lourdes",
});

conexion.connect((error) => {
  if (error) {
    console.log(error);
    // throw "database connection error !";
  } else {
    console.log("Conexion exitosa!! ");
  }
});

module.exports = conexion;
