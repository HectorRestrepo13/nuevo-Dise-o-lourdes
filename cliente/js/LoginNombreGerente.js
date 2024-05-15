let NombreSesionAdmin= document.getElementById("NombreSesionGerente");
let datosLocal=window.localStorage;
let datosLocales=JSON.parse(datosLocal.getItem(1));
NombreSesionAdmin.innerText=datosLocales.userName;