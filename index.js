/// Selección de elementos
const fecha = document.querySelector("#fecha");
const lista = document.querySelector("#lista");
const input = document.querySelector("#input");
const botonEnter = document.querySelector("#boton-enter");

// Clases para iconos y estilo
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle";
const LINE_THROUGH = "line-through";
const COMPLETADA = "completada";
const ANIM_CHECK = "check-anim";
const VERDE = "icono-verde";

// Array de tareas
let LIST = [];
let id = 0;

// Mostrar fecha actual
const FECHA = new Date();
let fechaLarga = FECHA.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});
fecha.innerHTML = fechaLarga.charAt(0).toUpperCase() + fechaLarga.slice(1);


// Guardar en localStorage
function guardarLocal() {
    localStorage.setItem("TODO", JSON.stringify(LIST));
}

// Renderizar todas las tareas
function renderLista() {
    lista.innerHTML = "";
    LIST.forEach(item => agregarTarea(item.nombre, item.id, item.realizado, item.eliminado));
}

// Función para agregar tarea
function agregarTarea(tarea, id, realizado, eliminado) {
    if (eliminado) return;

    const REALIZADO = realizado ? CHECK : UNCHECK;
    const LINE = realizado ? LINE_THROUGH : "";
    const FONDO_COMPLETADO = realizado ? COMPLETADA : "";
    const COLOR_VERDE = realizado ? VERDE : "";

    const elemento = `
        <li id="tarea-${id}" class="slide-in ${FONDO_COMPLETADO}">
            <i class="far ${REALIZADO} ${COLOR_VERDE}" data="realizado" data-id="${id}"></i>
            <p class="text ${LINE}">${tarea}</p>
            <i class="fas fa-trash de" data="eliminado" data-id="${id}"></i>
        </li>
    `;
    lista.insertAdjacentHTML("beforeend", elemento);
}

// Función para marcar tarea como realizada
function tareaRealizada(element) {
    const tareaId = parseInt(element.getAttribute("data-id"));
    const index = LIST.findIndex(item => item.id === tareaId);

    if (index === -1) return;

    // Cambiar estado
    LIST[index].realizado = !LIST[index].realizado;

    // Reordenar: primero las no completadas, luego completadas
    LIST.sort((a, b) => a.realizado - b.realizado);

    guardarLocal();
    renderLista();
}

// Función para eliminar tarea
function tareaEliminada(element) {
    const tareaId = parseInt(element.getAttribute("data-id"));
    const index = LIST.findIndex(item => item.id === tareaId);

    if (index === -1) return;

    LIST[index].eliminado = true;
    guardarLocal();
    renderLista();
}

// Evento para agregar tarea con el botón
botonEnter.addEventListener("click", () => {
    const tarea = input.value.trim();
    if (tarea) {
        LIST.push({ nombre: tarea, id: id, realizado: false, eliminado: false });
        guardarLocal();
        id++;
        renderLista();
    }
    input.value = "";
});

// Evento para agregar tarea con Enter
document.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const tarea = input.value.trim();
        if (tarea) {
            LIST.push({ nombre: tarea, id: id, realizado: false, eliminado: false });
            guardarLocal();
            id++;
            renderLista();
        }
        input.value = "";
    }
});

// Evento para acciones de la lista
lista.addEventListener("click", (event) => {
    const element = event.target;
    const elementData = element.getAttribute("data");

    if (elementData === "realizado") {
        tareaRealizada(element);
    } else if (elementData === "eliminado") {
        tareaEliminada(element);
    }
});

// Cargar tareas desde localStorage
let data = localStorage.getItem("TODO");
if (data) {
    LIST = JSON.parse(data);
    if (LIST.length > 0) {
        id = Math.max(...LIST.map(item => item.id)) + 1;
    }
    renderLista();
} else {
    LIST = [];
    id = 0;
}
