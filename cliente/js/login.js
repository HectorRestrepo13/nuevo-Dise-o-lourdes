document.addEventListener("DOMContentLoaded", function () {
  let btnIniciarSesion = document.getElementById("btnIniciarSesion");

 document.getElementById('btnIniciarSesion').addEventListener("click",function (e){
  e.preventDefault();
    let txtEmail = document.getElementById("txtEmail").value;
    let txtContra = document.getElementById("txtContra").value;


        if (txtContra.length <=0|| txtEmail.length <=0) {
            Swal.fire({
              icon: 'error',
              title: 'Campos vacíos',
              text: 'Por favor, completa todos los campos.',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Aceptar'
            });
    
        }else{
          verificarUsuario(txtEmail, txtContra);
        }

       
    });

    function verificarUsuario(email, password) {
      Promise.all([
        fetch(`http://localhost:3000/login/selecionarUsuarioMedico/${email}/${password}`),
        fetch(`http://localhost:3000/login/selecionarPaciente/${email}/${password}`),
        fetch(`http://localhost:3000/login/selecionarUsuario/${email}/${password}`)
      ])
      .then((responses) => {
        return Promise.all(
          responses.map((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Error al obtener los datos");
            }
          })
        );
      })
      .then((data) => {
        let usuariosRegistrados = 0;
        let datosLocal = window.localStorage;
        let contenido = {};
        
        for (let i = 0; i < data.length; i++) {
          const usuarios = data[i];
          const datos=data[i].message;  
          console.log(usuarios); 
    
     //verifico si el usuario esta registrado
          if ( usuarios.status !== false) {
            usuariosRegistrados++;
    
            // Redirigir según el tipo de usuario
            if (datos.cedulaMedico !== undefined) {
              contenido = {
                id: usuarios.cedulaMedico,
               
              };
              window.location.href = "indexConsultorio.html";
            } else if (datos.cedulaPaciente !== undefined) {
              contenido = {
                id: usuarios.cedulaPaciente,
              
              };
              window.location.href = "./paciente/index.html";
            } else if (datos.cedulaUser !== undefined) {
              if (datos.rol_idRol == 1) {
                contenido = {
                  id: datos.cedulaUser,
              
                };
                window.location.href = "./admin/administradorForm.html";
              } else if (datos.rol_idRol == 0) {
                contenido = {
                  id: datos.cedulaUser,
                
                };
                window.location.href = "./Gerente/index.html";
              } else if (datos.rol_idRol == 4) {
                contenido = {
                  id: datos.cedulaUser,
                 
                };
                console.log("Aca va la ruta del bodeguero");
              }
              console.log("Aca van los usuarios");
            }
            datosLocal.setItem(1, JSON.stringify(datos));
          }
         
        }
        if(usuariosRegistrados<=0){
   
          Swal.fire({
            title: "Persona no existe en la base de datos del sistema medico",
            text: "Contraseña o correo incorrecto",
            icon: "warning",
          });
        
      }
        
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
    
  document.querySelectorAll(".button").forEach((button) => {
    let div = document.createElement("div"),
      letters = button.textContent.trim().split("");

    function elements(letter, index, array) {
      let element = document.createElement("span"),
        part = index >= array.length / 2 ? -1 : 1,
        position =
          index >= array.length / 2
            ? array.length / 2 - index + (array.length / 2 - 1)
            : index,
        move = position / (array.length / 2),
        rotate = 1 - move;

      element.innerHTML = !letter.trim() ? "&nbsp;" : letter;
      element.style.setProperty("--move", move);
      element.style.setProperty("--rotate", rotate);
      element.style.setProperty("--part", part);

      div.appendChild(element);
    }

    letters.forEach(elements);

    button.innerHTML = div.outerHTML;

    button.addEventListener("mouseenter", (e) => {
      if (!button.classList.contains("out")) {
        button.classList.add("in");
      }
    });

    button.addEventListener("mouseleave", (e) => {
      if (button.classList.contains("in")) {
        button.classList.add("out");
        setTimeout(() => button.classList.remove("in", "out"), 950);
      }
    });

    button.addEventListener("click", (e) => {
      e.preventDefault(); // Evitar que el formulario se envíe
    });
  });
});
