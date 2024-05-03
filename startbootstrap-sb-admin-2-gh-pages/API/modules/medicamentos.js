let express = require("express");
let mysql = require("./mysql");
const medicamento = express.Router();

medicamento.get("/medicamentos/traerEstadisticasMedicamentos", (req, res) => {
    mysql.query(`
    SELECT 
    YEAR(f.fechaFormula) AS year,
    MONTH(f.fechaFormula) AS month,
    i.descripcionItem AS medicamento,
    SUM(df.cantidadDetalle) AS totalMedicamentosVendidos
FROM 
    formula f
INNER JOIN 
    detalleformula df ON f.idFormula = df.formula_idFormula
INNER JOIN 
    item i ON df.item_idItem = i    .idItem
GROUP BY 
    YEAR(f.fechaFormula), 
    MONTH(f.fechaFormula),
    i.descripcionItem
ORDER BY 
    YEAR(f.fechaFormula), 
    MONTH(f.fechaFormula);
    `, (error, data) => {
      try {
        if(data.length === 0) {
          res.status(400).send("No hay datos en la base de datos!!");
        } else {
          res.status(200).send(data);
       // Modificar los datos para incluir el nombre del medicamento
       const estadisticasMedicamentos = data.map(item => ({
        year: item.year,
        month: item.month,
        medicamento: item.medicamento,
        totalMedicamentosVendidos: item.totalMedicamentosVendidos
    }));

      }
    } catch (error) {
      console.log(error);
      throw `Hay un error en la consulta: ${error}`;
    }
  });
  });



module.exports=medicamento;