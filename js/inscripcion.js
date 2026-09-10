/**
 * eSports Arena Manager - Vista Inscripción a torneo (EP1)
 * Formulario principal del dominio. Todas las validaciones se ejecutan en el
 * cliente antes de "enviar" (en EP1 no hay backend, se simula la confirmación).
 */
document.addEventListener("DOMContentLoaded", () => {
  const { torneos, jugadores, equipos, inscripciones } = window.EAM_DATA;
  const {
    obtenerNombreJuego,
    obtenerTorneoPorId,
    obtenerEquipoPorId,
    obtenerJugadorPorId,
    cuposDisponibles,
    inscripcionFueraDePlazo,
    tieneSancionActiva,
    yaInscrito,
    equipoCompleto,
    obtenerJuegoPorId,
  } = EAM_UTIL;

  const selectTorneo = document.getElementById("campo-torneo");
  const radiosTipo = document.querySelectorAll('input[name="tipoParticipante"]');
  const campoJugadorGrupo = document.getElementById("campo-jugador");
  const selectJugador = document.getElementById("campo-jugador-select");
  const campoEquipoGrupo = document.getElementById("campo-equipo");
  const selectEquipo = document.getElementById("campo-equipo-select");
  const campoEdad = document.getElementById("campo-edad");
  const campoContacto = document.getElementById("campo-contacto");
  const campoTerminos = document.getElementById("campo-terminos");
  const form = document.getElementById("form-inscripcion");
  const botonInscribir = document.getElementById("boton-inscribir");

  const errorTorneo = document.getElementById("error-torneo");
  const errorEquipo = document.getElementById("error-equipo");
  const errorEdad = document.getElementById("error-edad");
  const errorContacto = document.getElementById("error-contacto");
  const errorTerminos = document.getElementById("error-terminos");
  const alertaBloqueo = document.getElementById("alerta-bloqueo");
  const alertaConfirmacion = document.getElementById("alerta-confirmacion");
  const detalleConfirmacion = document.getElementById("detalle-confirmacion");

  const resumenTorneo = document.getElementById("resumen-torneo");
  const resumenRequisitos = document.getElementById("resumen-requisitos");
  const resumenCupos = document.getElementById("resumen-cupos");

  // Poblar selects desde el catálogo simulado
  torneos.forEach((t) => {
    const opcion = document.createElement("option");
    opcion.value = t.id;
    opcion.textContent = `${t.nombre} (${obtenerNombreJuego(t.juegoId)})`;
    selectTorneo.appendChild(opcion);
  });
  jugadores.forEach((j) => {
    const opcion = document.createElement("option");
    opcion.value = j.id;
    opcion.textContent = `${j.nombre} (${j.apodo})`;
    selectJugador.appendChild(opcion);
  });
  equipos.forEach((e) => {
    const opcion = document.createElement("option");
    opcion.value = e.id;
    opcion.textContent = `${e.nombre}${e.activo ? "" : " (inactivo)"}`;
    selectEquipo.appendChild(opcion);
  });

  // Preseleccionar torneo si viene por query string (?torneo=t1)
  const parametros = new URLSearchParams(window.location.search);
  const torneoQuery = parametros.get("torneo");
  if (torneoQuery) selectTorneo.value = torneoQuery;

  function tipoSeleccionado() {
    return document.querySelector('input[name="tipoParticipante"]:checked').value;
  }

  function actualizarVisibilidadTipo() {
    const tipo = tipoSeleccionado();
    campoJugadorGrupo.classList.toggle("oculto", tipo !== "jugador");
    campoEquipoGrupo.classList.toggle("oculto", tipo !== "equipo");
  }

  function actualizarResumenYBloqueo() {
    const torneo = obtenerTorneoPorId(selectTorneo.value);
    alertaBloqueo.hidden = true;
    alertaBloqueo.textContent = "";
    botonInscribir.disabled = false;

    if (!torneo) {
      resumenTorneo.textContent = "—";
      resumenRequisitos.textContent = "—";
      resumenCupos.textContent = "—";
      return;
    }

    const juego = obtenerJuegoPorId(torneo.juegoId);
    resumenTorneo.textContent = torneo.nombre;
    resumenRequisitos.textContent =
      torneo.modalidad === "Equipos"
        ? `Equipo con al menos ${juego.integrantesPorEquipo} integrantes activo.`
        : "Participación individual.";
    resumenCupos.textContent = `${cuposDisponibles(torneo)} de ${torneo.cupoMaximo}`;

    // Bloqueos que se muestran antes de enviar
    const motivosBloqueo = [];
    if (inscripcionFueraDePlazo(torneo)) {
      motivosBloqueo.push("El plazo de inscripción para este torneo ya cerró.");
    }
    if (cuposDisponibles(torneo) <= 0) {
      motivosBloqueo.push("Este torneo ya no tiene cupos disponibles.");
    }

    const tipo = tipoSeleccionado();
    if (tipo === "jugador" && selectJugador.value) {
      if (tieneSancionActiva(selectJugador.value)) {
        motivosBloqueo.push("El jugador seleccionado tiene una sanción vigente y no puede inscribirse.");
      }
      if (yaInscrito(torneo.id, selectJugador.value)) {
        motivosBloqueo.push("Este jugador ya está inscrito en este torneo.");
      }
    }
    if (tipo === "equipo" && selectEquipo.value) {
      if (yaInscrito(torneo.id, selectEquipo.value)) {
        motivosBloqueo.push("Este equipo ya está inscrito en este torneo.");
      }
    }

    if (motivosBloqueo.length > 0) {
      alertaBloqueo.hidden = false;
      alertaBloqueo.textContent = motivosBloqueo.join(" ");
      botonInscribir.disabled = true;
    }
  }

  radiosTipo.forEach((r) => r.addEventListener("change", () => {
    actualizarVisibilidadTipo();
    actualizarResumenYBloqueo();
  }));
  selectTorneo.addEventListener("change", actualizarResumenYBloqueo);
  selectJugador.addEventListener("change", actualizarResumenYBloqueo);
  selectEquipo.addEventListener("change", actualizarResumenYBloqueo);

  actualizarVisibilidadTipo();
  actualizarResumenYBloqueo();

  function marcarError(campoEl, mensajeEl, mensaje) {
    campoEl.closest(".campo").classList.add("con-error");
    mensajeEl.textContent = mensaje;
  }

  function limpiarError(campoEl, mensajeEl) {
    campoEl.closest(".campo").classList.remove("con-error");
    mensajeEl.textContent = "";
  }

  function validarFormulario() {
    let esValido = true;
    const torneo = obtenerTorneoPorId(selectTorneo.value);

    // Torneo obligatorio
    if (!torneo) {
      marcarError(selectTorneo, errorTorneo, "Debes seleccionar un torneo.");
      esValido = false;
    } else {
      limpiarError(selectTorneo, errorTorneo);
      if (inscripcionFueraDePlazo(torneo)) {
        marcarError(selectTorneo, errorTorneo, "El plazo de inscripción ya cerró para este torneo.");
        esValido = false;
      }
      if (cuposDisponibles(torneo) <= 0) {
        marcarError(selectTorneo, errorTorneo, "No quedan cupos disponibles en este torneo.");
        esValido = false;
      }
    }

    const tipo = tipoSeleccionado();

    // Coherencia: si el tipo es "equipo", el equipo es obligatorio y debe cumplir integrantes mínimos
    if (tipo === "equipo") {
      const equipo = obtenerEquipoPorId(selectEquipo.value);
      if (!equipo) {
        marcarError(selectEquipo, errorEquipo, "Selecciona el equipo que participará.");
        esValido = false;
      } else {
        limpiarError(selectEquipo, errorEquipo);
        if (!equipo.activo) {
          marcarError(selectEquipo, errorEquipo, "El equipo está inactivo y no puede inscribirse.");
          esValido = false;
        } else if (torneo && !equipoCompleto(equipo)) {
          marcarError(
            selectEquipo,
            errorEquipo,
            `El equipo no tiene los integrantes mínimos exigidos por ${obtenerNombreJuego(torneo.juegoId)}.`
          );
          esValido = false;
        } else if (torneo && yaInscrito(torneo.id, equipo.id)) {
          marcarError(selectEquipo, errorEquipo, "Este equipo ya está inscrito en el torneo seleccionado.");
          esValido = false;
        }
      }
    } else {
      limpiarError(selectEquipo, errorEquipo);
      if (torneo && selectJugador.value) {
        if (tieneSancionActiva(selectJugador.value)) {
          marcarError(selectJugador, errorEquipo, "El jugador tiene una sanción vigente que bloquea la inscripción.");
          esValido = false;
        } else if (yaInscrito(torneo.id, selectJugador.value)) {
          marcarError(selectJugador, errorEquipo, "Este jugador ya está inscrito en el torneo seleccionado.");
          esValido = false;
        }
      }
    }

    // Edad: rango numérico 13-99
    const edad = Number(campoEdad.value);
    if (!campoEdad.value || Number.isNaN(edad) || edad < 13 || edad > 99) {
      marcarError(campoEdad, errorEdad, "Ingresa una edad válida entre 13 y 99 años.");
      esValido = false;
    } else {
      limpiarError(campoEdad, errorEdad);
    }

    // Correo: formato válido
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(campoContacto.value.trim())) {
      marcarError(campoContacto, errorContacto, "Ingresa un correo electrónico con formato válido.");
      esValido = false;
    } else {
      limpiarError(campoContacto, errorContacto);
    }

    // Términos obligatorios
    if (!campoTerminos.checked) {
      errorTerminos.textContent = "Debes aceptar el reglamento del torneo para continuar.";
      esValido = false;
    } else {
      errorTerminos.textContent = "";
    }

    return esValido;
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    alertaConfirmacion.hidden = true;

    if (!validarFormulario()) {
      return; // El envío se bloquea mientras existan errores
    }

    const torneo = obtenerTorneoPorId(selectTorneo.value);
    const tipo = tipoSeleccionado();
    const nombreParticipante =
      tipo === "equipo"
        ? obtenerEquipoPorId(selectEquipo.value).nombre
        : obtenerJugadorPorId(selectJugador.value)?.nombre || "Jugador";

    detalleConfirmacion.textContent = `${nombreParticipante} quedó inscrito en "${torneo.nombre}". Se enviará la confirmación a ${campoContacto.value.trim()}.`;
    alertaConfirmacion.hidden = false;
    alertaConfirmacion.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  form.addEventListener("reset", () => {
    [errorTorneo, errorEquipo, errorEdad, errorContacto, errorTerminos].forEach((el) => (el.textContent = ""));
    document.querySelectorAll(".campo.con-error").forEach((el) => el.classList.remove("con-error"));
    alertaConfirmacion.hidden = true;
    setTimeout(() => {
      actualizarVisibilidadTipo();
      actualizarResumenYBloqueo();
    }, 0);
  });
});
