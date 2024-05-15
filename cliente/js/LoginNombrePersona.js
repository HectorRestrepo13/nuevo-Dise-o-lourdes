let NombreSesionPaciente= document.getElementById("NombreSesionPaciente");
let datosLocal=window.localStorage;
let datosLocales=JSON.parse(datosLocal.getItem(1));
NombreSesionPaciente.innerText=datosLocales.nombrePaciente;