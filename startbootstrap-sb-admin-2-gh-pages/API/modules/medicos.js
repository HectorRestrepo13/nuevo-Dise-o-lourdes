const express = require("express");
const mysql = require("./mysql");
const bcrypt=require("bcrypt");
const medicos = express.Router();

//Buscar siempre por id
medicos.get("/medico/buscarEspecialidadMedico", (req, res) => {
  let consulta = `select especialidadMedico from medico`;

  mysql.query(consulta, (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      throw `hay un error en la consulta${error}`;
    }
  });
});

medicos.get("/medico/buscarMedico/:especialidadMedico", (req, res) => {
  let especialidadMedico = req.params.especialidadMedico;
  let consulta = `select nombreMedico, cedulaMedico from medico where especialidadMedico=?`;

  mysql.query(consulta, [especialidadMedico], (error, data) => {
    try {
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      throw `hay un error en la consulta${error}`;
    }
  });
});

medicos.get("/medico/verificarMedico/:cedulaMedico", (req, res) => {
  let cedula = req.params.cedulaMedico;
  mysql.query(
    "SELECT*FROM medico WHERE cedulaMedico = ?",
    [cedula],
    (error, data) => {
      try {
        if (data == 0) {
          res.status(400).send("No Existe el doctor en la base de datos!!");
        } else {
          res.status(200).send(data);
        }
      } catch (error) {
        console.log(error);
        throw `hay un error en la consulta${error}`;
      }
    }
  );
});

medicos.get("/medico/traerDatos/", (req, res) => {
  mysql.query("SELECT*FROM medico ", (error, data) => {
    try {
      if (data == 0) {
        res.status(400).send("No datos en la base de datos!!");
      } else {
        res.status(200).send(data);
      }
    } catch (error) {
      console.log(error);
      throw `hay un error en la consulta${error}`;
    }
  });
});

medicos.get("/medicamentos/traerEstadisticasMedicos", (req, res) => {
  mysql.query(
    `
    SELECT 
    YEAR(c.fechaCita) AS year,
    MONTH(c.fechaCita) AS month,
    m.nombreMedico AS nombreMedico,
    COUNT(*) AS totalCitas
FROM 
    cita c
INNER JOIN 
    medico m ON c.medico_cedulaMedico = m.cedulaMedico
GROUP BY 
    YEAR(c.fechaCita), 
    MONTH(c.fechaCita),
    c.medico_cedulaMedico
ORDER BY 
    YEAR(c.fechaCita), 
    MONTH(c.fechaCita),
    COUNT(*) DESC;

    `,
    (error, data) => {
      try {
        if (data.length === 0) {
          res.status(400).send("No hay datos en la base de datos!!");
        } else {
          res.status(200).send(data);
          // Modificar los datos para incluir el nombre del medicamento
          const estadisticasMedicamentos = data.map((item) => ({
            year: item.year,
            month: item.month,
            citas: item.totalCitas,
            totalMedicamentosVendidos: item.nombreMedico,
          }));
        }
      } catch (error) {
        console.log(error);
        throw `Hay un error en la consulta: ${error}`;
      }
    }
  );
});

// Crear doctor
// Endpoint para la creación de un nuevo doctor
medicos.post("/doctor/create", (req, res) => {
  // Extraer los datos del cuerpo de la solicitud



  const {
    cedulaDoctor,
    nombreDoctor,
    apellidoDoctor,
    emailDoctor,
    especialidadDoctor,
    usuarioDoctor,
    password
  } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const formData = {
    cedulaMedico: cedulaDoctor,
    nombreMedico: nombreDoctor,
    apellidoMedico: apellidoDoctor,
    emailMedico: emailDoctor,
    especialidadMedico: especialidadDoctor,
    usuarioMedico: usuarioDoctor,
password:hashedPassword
  };

  // Realizar la inserción en la base de datos
  mysql.query("INSERT INTO medico SET ?", formData, (error, data) => {
    if (error) {
      console.error("Error al insertar doctor en la base de datos: " + error);
      res.status(500).send("Error en la consulta: " + error.message);
      console.log("ver error" + error);
    } else {
      console.log("Doctor  insertado correctamente en la base de datos");
      res.status(200).send(data);
    }
  });
});

medicos.put("/medico/editarDoctor/:cedulaDoctor", (req, res) => {
  let cedulaDoctor = req.params.cedulaDoctor;
const{nombreMedico, apellidoMedico, emailMedico,especialidadMedico,usuarioMedico, password}=req.body;
const hashedPassword = bcrypt.hashSync(password, 10);
  // Crear objeto con los datos actualizados
  const doctorActualizado = {
    nombreMedico:nombreMedico,
    apellidoMedico: apellidoMedico,
    emailMedico: emailMedico,
    especialidadMedico: especialidadMedico,
    usuarioMedico: usuarioMedico,
    password:hashedPassword
    
  };

  // Ejecutar consulta para actualizar los datos del doctor
  mysql.query(
    "UPDATE medico SET ? WHERE cedulaMedico = ?",
    [doctorActualizado, cedulaDoctor],
    (error, data) => {
      try {
        if (data == 0) {
          res.status(400).send("No hay datos en la base de datos!!");
        } else {
          res.status(200).send("Datos actualizados");
        }
      } catch (error) {
        console.log(error);
        throw `hay un error en la consulta${error}`;
      }
    }
  );
});

module.exports = medicos;
