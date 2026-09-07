/**
 * eSports Arena Manager - Vista Perfil de jugador (EP1)
 * El selector de jugador simula la sesión activa (en EP3 vendrá del token JWT).
 */
document.addEventListener("DOMContentLoaded", () => {
  const { jugadores, equipos, inscripciones, sanciones, torneos } = window.EAM_DATA;
  const { crearElemento } = EAM_UTIL;

  const selectorJugador = document.getElementById("selector-jugador");
  const fichaJugador = document.getElementById("ficha-jugador");

  const form = document.getElementById("form-perfil");
  const campoApodo = document.getElementById("campo-apodo");
  const campoEmail = document.getElementById("campo-email-perfil");
  const campoPassword = document.getElementById("campo-password");
  const campoPasswordConfirmacion = document.getElementById("campo-password-confirmacion");
  const alertaGuardado = document.getElementById("alerta-perfil-guardado");

  const errorApodo = document.getElementById("error-apodo");
  const errorEmail = document.getElementById("error-email-perfil");
  const errorPassword = document.getElementById("error-password");
  const errorPasswordConfirmacion = document.getElementById("error-password-confirmacion");

  jugadores.forEach((j) => {
    const opcion = document.createElement("option");
    opcion.value = j.id;
    opcion.textContent = `${j.nombre} (${j.apodo})`;
    selectorJugador.appendChild(opcion);
  });

  const parametros = new URLSearchParams(window.location.search);
  const idInicial = parametros.get("id") || jugadores[0].id;
  selectorJugador.value = idInicial;

  function equiposDeJugador(jugadorId) {
    return equipos.filter((e) => e.integrantes.some((i) => i.jugadorId === jugadorId));
  }

  function historialDeJugador(jugadorId) {
    const equiposJugador = equiposDeJugador(jugadorId).map((e) => e.id);
    return inscripciones.filter(
      (i) =>
        (i.tipoParticipante === "jugador" && i.participanteId === jugadorId) ||
        (i.tipoParticipante === "equipo" && equiposJugador.includes(i.participanteId))
    );
  }

  function renderizarFicha(jugadorId) {
    const jugador = jugadores.find((j) => j.id === jugadorId);
    fichaJugador.innerHTML = "";
    if (!jugador) return;

    const tarjetaDatos = crearElemento("article", { clase: "tarjeta" });
    tarjetaDatos.appendChild(crearElemento("h2", { texto: jugador.nombre }));
    tarjetaDatos.appendChild(crearElemento("p", { clase: "texto-tenue", texto: `Apodo: ${jugador.apodo}` }));
    tarjetaDatos.appendChild(crearElemento("p", { clase: "texto-tenue", texto: `Correo de contacto: ${jugador.email}` }));

    const stats = crearElemento("div", { clase: "flex" });
    stats.appendChild(crearElemento("span", { texto: `Victorias: ${jugador.victorias}` }));
    stats.appendChild(crearElemento("span", { texto: `Derrotas: ${jugador.derrotas}` }));
    const totalPartidas = jugador.victorias + jugador.derrotas;
    const porcentaje = totalPartidas > 0 ? Math.round((jugador.victorias / totalPartidas) * 100) : 0;
    stats.appendChild(crearElemento("span", { texto: `Efectividad: ${porcentaje}%` }));
    tarjetaDatos.appendChild(stats);
    fichaJugador.appendChild(tarjetaDatos);

    // Equipos
    const bloqueEquipos = crearElemento("div", { clase: "seccion" });
    bloqueEquipos.appendChild(crearElemento("h3", { texto: "Equipos" }));
    const equiposJugador = equiposDeJugador(jugadorId);
    if (equiposJugador.length === 0) {
      bloqueEquipos.appendChild(crearElemento("p", { clase: "estado-vacio", texto: "Este jugador no pertenece a ningún equipo todavía." }));
    } else {
      const lista = document.createElement("ul");
      equiposJugador.forEach((e) => {
        const rol = e.integrantes.find((i) => i.jugadorId === jugadorId)?.rol || "Integrante";
        const li = document.createElement("li");
        li.textContent = `${e.nombre} — ${rol}`;
        lista.appendChild(li);
      });
      bloqueEquipos.appendChild(lista);
    }
    fichaJugador.appendChild(bloqueEquipos);

    // Historial de torneos
    const bloqueHistorial = crearElemento("div", { clase: "seccion" });
    bloqueHistorial.appendChild(crearElemento("h3", { texto: "Historial de torneos" }));
    const historial = historialDeJugador(jugadorId);
    if (historial.length === 0) {
      bloqueHistorial.appendChild(crearElemento("p", { clase: "estado-vacio", texto: "Sin participaciones registradas." }));
    } else {
      const lista = document.createElement("ul");
      historial.forEach((i) => {
        const torneo = torneos.find((t) => t.id === i.torneoId);
        const li = document.createElement("li");
        li.textContent = torneo ? `${torneo.nombre} (${EAM_UTIL.etiquetaEstado(torneo.estado)})` : "Torneo no disponible";
        lista.appendChild(li);
      });
      bloqueHistorial.appendChild(lista);
    }
    fichaJugador.appendChild(bloqueHistorial);

    // Sanciones
    const bloqueSanciones = crearElemento("div", { clase: "seccion" });
    bloqueSanciones.appendChild(crearElemento("h3", { texto: "Sanciones" }));
    const sancionesJugador = sanciones.filter((s) => s.jugadorId === jugadorId);
    if (sancionesJugador.length === 0) {
      bloqueSanciones.appendChild(crearElemento("p", { clase: "estado-vacio", texto: "Sin sanciones registradas." }));
    } else {
      sancionesJugador.forEach((s) => {
        const alerta = crearElemento("div", {
          clase: `alerta ${s.vigente ? "alerta--bloqueo" : ""}`,
          texto: `${s.motivo} — ${s.duracionDias} días desde ${EAM_UTIL.formatearFecha(s.fechaInicio)} (${s.vigente ? "vigente" : "cumplida"})`,
        });
        bloqueSanciones.appendChild(alerta);
      });
    }
    fichaJugador.appendChild(bloqueSanciones);

    // Precargar formulario de edición
    campoApodo.value = jugador.apodo;
    campoEmail.value = jugador.email;
    campoPassword.value = "";
    campoPasswordConfirmacion.value = "";
    alertaGuardado.hidden = true;
  }

  renderizarFicha(selectorJugador.value);
  selectorJugador.addEventListener("change", () => renderizarFicha(selectorJugador.value));

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
    alertaGuardado.hidden = true;
    let esValido = true;

    // Apodo obligatorio, sin espacios, largo definido
    const apodo = campoApodo.value.trim();
    if (!apodo || /\s/.test(apodo) || apodo.length < 3 || apodo.length > 15) {
      marcarError(campoApodo, errorApodo, "El apodo es obligatorio, no admite espacios y debe tener entre 3 y 15 caracteres.");
      esValido = false;
    } else {
      limpiarError(campoApodo, errorApodo);
    }

    // Correo con formato válido
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(campoEmail.value.trim())) {
      marcarError(campoEmail, errorEmail, "Ingresa un correo electrónico con formato válido.");
      esValido = false;
    } else {
      limpiarError(campoEmail, errorEmail);
    }

    // Contraseña: si se ingresó, longitud mínima 8
    const password = campoPassword.value;
    if (password && password.length < 8) {
      marcarError(campoPassword, errorPassword, "La contraseña debe tener al menos 8 caracteres.");
      esValido = false;
    } else {
      limpiarError(campoPassword, errorPassword);
    }

    // Coherencia entre campos relacionados: confirmación debe coincidir
    if (password && password !== campoPasswordConfirmacion.value) {
      marcarError(campoPasswordConfirmacion, errorPasswordConfirmacion, "Las contraseñas no coinciden.");
      esValido = false;
    } else {
      limpiarError(campoPasswordConfirmacion, errorPasswordConfirmacion);
    }

    if (!esValido) return;

    const jugador = jugadores.find((j) => j.id === selectorJugador.value);
    jugador.apodo = apodo;
    jugador.email = campoEmail.value.trim();

    alertaGuardado.hidden = false;
    alertaGuardado.textContent = "Los datos de la cuenta se actualizaron correctamente.";
    renderizarFicha(jugador.id);
    alertaGuardado.hidden = false;
  });

  form.addEventListener("reset", () => {
    [errorApodo, errorEmail, errorPassword, errorPasswordConfirmacion].forEach((el) => (el.textContent = ""));
    document.querySelectorAll("#form-perfil .campo.con-error").forEach((el) => el.classList.remove("con-error"));
    setTimeout(() => renderizarFicha(selectorJugador.value), 0);
  });
});
