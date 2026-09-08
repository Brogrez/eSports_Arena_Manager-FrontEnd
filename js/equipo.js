/**
 * eSports Arena Manager - Vista Gestión de equipo (EP1)
 * Segundo formulario funcional del caso. Los cambios se mantienen en memoria
 * (arreglos de datos.js) ya que en EP1 no existe persistencia en backend.
 */
document.addEventListener("DOMContentLoaded", () => {
  const { juegos, jugadores, equipos } = window.EAM_DATA;
  const { obtenerNombreJuego, obtenerJugadorPorId, crearElemento } = EAM_UTIL;

  const form = document.getElementById("form-equipo");
  const campoNombre = document.getElementById("campo-nombre-equipo");
  const campoJuego = document.getElementById("campo-juego-equipo");
  const campoCapitan = document.getElementById("campo-capitan");
  const campoIntegranteNuevo = document.getElementById("campo-integrante-nuevo");
  const botonAgregarIntegrante = document.getElementById("boton-agregar-integrante");
  const listaIntegrantesNuevos = document.getElementById("lista-integrantes-nuevos");
  const alertaCreado = document.getElementById("alerta-equipo-creado");
  const listaEquiposExistentes = document.getElementById("lista-equipos-existentes");

  const errorNombre = document.getElementById("error-nombre-equipo");
  const errorJuego = document.getElementById("error-juego-equipo");
  const errorCapitan = document.getElementById("error-capitan");
  const errorIntegrantes = document.getElementById("error-integrantes");

  let integrantesNuevoEquipo = []; // ids de jugadores agregados al equipo en construcción

  // Poblar selects
  juegos.forEach((j) => {
    const opcion = document.createElement("option");
    opcion.value = j.id;
    opcion.textContent = `${j.nombre} (${j.integrantesPorEquipo} integrantes)`;
    campoJuego.appendChild(opcion);
  });

  function poblarSelectsJugadores() {
    [campoCapitan, campoIntegranteNuevo].forEach((select) => {
      const valorPrevio = select.value;
      select.innerHTML = `<option value="">${select === campoCapitan ? "Selecciona al capitán" : "Selecciona un jugador"}</option>`;
      jugadores
        .filter((j) => !integrantesNuevoEquipo.includes(j.id) || select === campoCapitan)
        .forEach((j) => {
          const opcion = document.createElement("option");
          opcion.value = j.id;
          opcion.textContent = `${j.nombre} (${j.apodo})`;
          select.appendChild(opcion);
        });
      if ([...select.options].some((o) => o.value === valorPrevio)) select.value = valorPrevio;
    });
  }
  poblarSelectsJugadores();

  function renderizarIntegrantesNuevos() {
    listaIntegrantesNuevos.innerHTML = "";
    if (integrantesNuevoEquipo.length === 0) {
      listaIntegrantesNuevos.appendChild(crearElemento("li", { clase: "texto-tenue", texto: "Aún no agregas integrantes." }));
      return;
    }
    integrantesNuevoEquipo.forEach((id) => {
      const jugador = obtenerJugadorPorId(id);
      const li = document.createElement("li");
      li.textContent = `${jugador.nombre} `;
      const botonQuitar = document.createElement("button");
      botonQuitar.type = "button";
      botonQuitar.className = "boton boton-peligro";
      botonQuitar.style.padding = "0.15rem 0.6rem";
      botonQuitar.style.fontSize = "0.8rem";
      botonQuitar.textContent = "Quitar";
      botonQuitar.addEventListener("click", () => {
        integrantesNuevoEquipo = integrantesNuevoEquipo.filter((existente) => existente !== id);
        renderizarIntegrantesNuevos();
        poblarSelectsJugadores();
      });
      li.appendChild(botonQuitar);
      listaIntegrantesNuevos.appendChild(li);
    });
  }
  renderizarIntegrantesNuevos();

  botonAgregarIntegrante.addEventListener("click", () => {
    const jugadorId = campoIntegranteNuevo.value;
    if (!jugadorId) {
      errorIntegrantes.textContent = "Selecciona un jugador antes de agregarlo.";
      return;
    }
    // Un mismo jugador no puede repetirse en el equipo
    if (integrantesNuevoEquipo.includes(jugadorId)) {
      errorIntegrantes.textContent = "Ese jugador ya fue agregado al equipo.";
      return;
    }
    errorIntegrantes.textContent = "";
    integrantesNuevoEquipo.push(jugadorId);
    campoIntegranteNuevo.value = "";
    renderizarIntegrantesNuevos();
    poblarSelectsJugadores();
  });

  function marcarError(campoEl, mensajeEl, mensaje) {
    campoEl.closest(".campo").classList.add("con-error");
    mensajeEl.textContent = mensaje;
  }
  function limpiarError(campoEl, mensajeEl) {
    campoEl.closest(".campo").classList.remove("con-error");
    mensajeEl.textContent = "";
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    alertaCreado.hidden = true;
    let esValido = true;

    const nombre = campoNombre.value.trim();
    const nombreDuplicado = equipos.some((e) => e.nombre.toLowerCase() === nombre.toLowerCase());
    if (!nombre) {
      marcarError(campoNombre, errorNombre, "El nombre del equipo es obligatorio.");
      esValido = false;
    } else if (nombreDuplicado) {
      marcarError(campoNombre, errorNombre, "Ya existe un equipo registrado con ese nombre.");
      esValido = false;
    } else {
      limpiarError(campoNombre, errorNombre);
    }

    if (!campoJuego.value) {
      marcarError(campoJuego, errorJuego, "Selecciona el juego principal del equipo.");
      esValido = false;
    } else {
      limpiarError(campoJuego, errorJuego);
    }

    if (!campoCapitan.value) {
      marcarError(campoCapitan, errorCapitan, "El capitán es obligatorio.");
      esValido = false;
    } else {
      limpiarError(campoCapitan, errorCapitan);
    }

    // Coherencia: si hay juego seleccionado, se informa cuántos integrantes exige
    const juego = juegos.find((j) => j.id === campoJuego.value);
    const totalIntegrantes = integrantesNuevoEquipo.includes(campoCapitan.value)
      ? integrantesNuevoEquipo.length
      : integrantesNuevoEquipo.length + (campoCapitan.value ? 1 : 0);

    if (juego && totalIntegrantes < juego.integrantesPorEquipo) {
      errorIntegrantes.textContent = `Este juego exige al menos ${juego.integrantesPorEquipo} integrantes (capitán incluido). Llevas ${totalIntegrantes}.`;
      esValido = false;
    } else {
      errorIntegrantes.textContent = "";
    }

    if (!esValido) return;

    // Simulación de creación: se agrega al arreglo en memoria
    const nuevoId = `e${equipos.length + 1}`;
    const integrantesFinales = [...new Set([campoCapitan.value, ...integrantesNuevoEquipo])].map((id) => ({
      jugadorId: id,
      rol: id === campoCapitan.value ? "Capitán" : "Integrante",
    }));

    equipos.push({
      id: nuevoId,
      nombre,
      juegoId: campoJuego.value,
      capitanId: campoCapitan.value,
      activo: true,
      integrantes: integrantesFinales,
    });

    alertaCreado.hidden = false;
    alertaCreado.textContent = `Equipo "${nombre}" creado con ${integrantesFinales.length} integrante(s).`;
    integrantesNuevoEquipo = [];
    form.reset();
    renderizarIntegrantesNuevos();
    poblarSelectsJugadores();
    renderizarEquiposExistentes();
  });

  form.addEventListener("reset", () => {
    [errorNombre, errorJuego, errorCapitan, errorIntegrantes].forEach((el) => (el.textContent = ""));
    document.querySelectorAll("#form-equipo .campo.con-error").forEach((el) => el.classList.remove("con-error"));
  });

  // --- Listado de equipos existentes con acción de quitar integrante ---
  function renderizarEquiposExistentes() {
    listaEquiposExistentes.innerHTML = "";
    equipos.forEach((equipo) => {
      const tarjeta = crearElemento("article", { clase: "tarjeta" });
      const cabecera = crearElemento("div", { clase: "flex-entre" });
      cabecera.appendChild(crearElemento("h3", { texto: equipo.nombre }));
      cabecera.appendChild(
        crearElemento("span", {
          clase: "etiqueta-estado " + (equipo.activo ? "etiqueta-estado--abierto" : "etiqueta-estado--finalizado"),
          texto: equipo.activo ? "Activo" : "Inactivo",
        })
      );
      tarjeta.appendChild(cabecera);
      tarjeta.appendChild(
        crearElemento("p", { clase: "texto-tenue", texto: obtenerNombreJuego(equipo.juegoId) })
      );

      const listaMiembros = document.createElement("ul");
      equipo.integrantes.forEach((integrante) => {
        const jugador = obtenerJugadorPorId(integrante.jugadorId);
        const li = document.createElement("li");
        li.textContent = `${jugador ? jugador.nombre : "Jugador"} — ${integrante.rol} `;

        if (integrante.jugadorId !== equipo.capitanId) {
          const botonQuitar = document.createElement("button");
          botonQuitar.type = "button";
          botonQuitar.className = "boton boton-peligro";
          botonQuitar.style.padding = "0.1rem 0.5rem";
          botonQuitar.style.fontSize = "0.75rem";
          botonQuitar.textContent = "Quitar";
          botonQuitar.addEventListener("click", () => {
            equipo.integrantes = equipo.integrantes.filter((i) => i.jugadorId !== integrante.jugadorId);
            renderizarEquiposExistentes();
          });
          li.appendChild(botonQuitar);
        }
        listaMiembros.appendChild(li);
      });
      tarjeta.appendChild(listaMiembros);
      listaEquiposExistentes.appendChild(tarjeta);
    });
  }
  renderizarEquiposExistentes();
});
