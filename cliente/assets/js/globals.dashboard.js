import {
  getPageName,
  setNavBar,
  setFooter,
} from "../../../../assets/js/globals.js";

function setAsideActive() {
  let links = document.querySelectorAll(".btn-aside");
  links.forEach((Link) => {
    if (getPageName().toUpperCase() == Link.innerText) {
      Link.classList.add("active");
    }
  });
}
function setAsideBoard() {
  var folderOrigin = window.location.origin + "/formaser/front/admin/dashboard";
  var asideBoard = document.getElementById("asideBoard");
  asideBoard.innerHTML = `
    <ul class="nav nav-fill d-flex flex-nowrap flex-sm-column overflow-x-auto">
        <li class="nav-item">
            <a class="nav-link bg-body-secondary ps-3 h-100 text-nowrap d-flex align-items-center btn-aside" href="${folderOrigin}/subir_archivos/pre-inscritos.php">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-3" viewBox="0 0 16 16">
                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/>
                </svg>
                SUBIR ARCHIVOS
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link bg-body-secondary ps-3 h-100 d-flex justify-content-start align-items-center btn-aside" href="${folderOrigin}/pre-inscripciones/">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-3" viewBox="0 0 16 16">
                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
                <path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/>
                </svg>
                PRE-INSCRIPCIONES
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link bg-body-secondary ps-3 h-100 d-flex justify-content-start align-items-center btn-aside" href="${folderOrigin}/inscripciones/">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-3" viewBox="0 0 16 16">
                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
                <path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/>
                </svg>
                INSCRIPCIONES
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link bg-body-secondary ps-3 h-100 d-flex justify-content-start align-items-center btn-aside" href="${folderOrigin}/matriculas/">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-3" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9 1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5M9 8a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4A.5.5 0 0 0 9 8m1 2.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5m-1 2C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 0 2 13h6.96q.04-.245.04-.5M7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0"/>
                </svg>
                MATRICULAS
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link bg-body-secondary ps-3 h-100 d-flex justify-content-start align-items-center btn-aside" href="${folderOrigin}/usuarios/">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-3" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg>
                USUARIOS
            </a>
        </li>
    </ul>
    `;
  setAsideActive();
}

setNavBar();
setAsideBoard();
setFooter();
