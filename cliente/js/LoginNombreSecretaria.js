let NombreSesionPaciente= document.getElementById("NombreSesionSecretaria");
let datosLocal=window.localStorage;
let datosLocales=JSON.parse(datosLocal.getItem(1));
NombreSesionPaciente.innerText=datosLocales.userName;