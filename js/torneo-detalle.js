/**
 * eSports Arena Manager - Vista Detalle de torneo (EP1)
 * El torneo se identifica por el parámetro ?id= en la URL.
 * La ronda visible se maneja como una variable de estado local en esta página.
 */
document.addEventListener("DOMContentLoaded", () => {
  const { torneos, inscripciones, equipos, jugadores, partidas, resultados, rankings, premios } = window.EAM_DATA;
  const { obtenerNombreJuego, cuposDisponibles, formatearFecha, etiquetaEstado, crearElemento } = EAM_UTIL;

  const parametros = new URLSearchParams(window.location.search);
  const torneoId = parametros.get("id") || torneos[0].id;
  const torneo = torneos.find((t) => t.id === torneoId);

  const contenedorDetalle = document.getElementById("detalle-torneo");

  if (!torneo) {
    contenedorDetalle.appendChild(
      crearElemento("p", { clase: "estado-vacio", texto: "No se encontró el torneo solicitado." })
    );
    return;
  }
})

// --- Datos generales ---
  document.title = `eSports Arena Manager | ${torneo.nombre}`;
  const cabecera = crearElemento("div", { clase: "flex-entre" });
  cabecera.appendChild(crearElemento("h1", { texto: torneo.nombre }));
  cabecera.appendChild(
    crearElemento("span", {
      clase: `etiqueta-estado etiqueta-estado--${torneo.estado}`,
      texto: etiquetaEstado(torneo.estado),
    })
  );
  contenedorDetalle.appendChild(cabecera);
  contenedorDetalle.appendChild(crearElemento("p", { texto: torneo.descripcion }));

  const meta = crearElemento("div", { clase: "flex texto-tenue" });
  meta.appendChild(crearElemento("span", { texto: `Juego: ${obtenerNombreJuego(torneo.juegoId)}` }));
  meta.appendChild(crearElemento("span", { texto: `Modalidad: ${torneo.modalidad}` }));
  meta.appendChild(
    crearElemento("span", { texto: `Cupos: ${torneo.cupoOcupado}/${torneo.cupoMaximo} (${cuposDisponibles(torneo)} disponibles)` })
  );
  meta.appendChild(crearElemento("span", { texto: `Inicio: ${formatearFecha(torneo.fechaInicio)}` }));
  meta.appendChild(crearElemento("span", { texto: `Cierre de inscripción: ${formatearFecha(torneo.fechaCierreInscripcion)}` }));
  contenedorDetalle.appendChild(meta);

  contenedorDetalle.appendChild(
    crearElemento("a", {
      clase: "boton boton-primario",
      texto: "Inscribirme en este torneo",
      atributos: { href: `inscripcion.html?torneo=${torneo.id}`, style: "margin-top:1rem;" },
    })
  );

  // --- Participantes inscritos ---
  const listaParticipantes = document.getElementById("lista-participantes");
  const inscritosDelTorneo = inscripciones.filter((i) => i.torneoId === torneo.id);

  if (inscritosDelTorneo.length === 0) {
    listaParticipantes.appendChild(
      crearElemento("li", { clase: "estado-vacio", texto: "Aún no hay participantes inscritos." })
    );
  } else {
    inscritosDelTorneo.forEach((inscripcion) => {
      let nombre = "Participante desconocido";
      if (inscripcion.tipoParticipante === "equipo") {
        const equipo = equipos.find((e) => e.id === inscripcion.participanteId);
        if (equipo) nombre = `${equipo.nombre} (equipo)`;
      } else {
        const jugador = jugadores.find((j) => j.id === inscripcion.participanteId);
        if (jugador) nombre = `${jugador.nombre} (individual)`;
      }
      listaParticipantes.appendChild(crearElemento("li", { texto: `${nombre} · inscrito el ${formatearFecha(inscripcion.fecha)}` }));
    });
  }

  // --- Calendario de partidas por ronda (estado local: rondaActual) ---
  const partidasDelTorneo = partidas.filter((p) => p.torneoId === torneo.id);
  const rondas = [...new Set(partidasDelTorneo.map((p) => p.ronda))].sort((a, b) => a - b);
  const contenedorPestanas = document.getElementById("pestanas-ronda");
  const cuerpoPartidas = document.getElementById("cuerpo-partidas");

  let rondaActual = rondas[0] || null;

  function renderizarPartidas() {
    cuerpoPartidas.innerHTML = "";
    const partidasRonda = partidasDelTorneo.filter((p) => p.ronda === rondaActual);

    if (partidasRonda.length === 0) {
      const fila = document.createElement("tr");
      const celda = document.createElement("td");
      celda.colSpan = 3;
      celda.className = "estado-vacio";
      celda.textContent = "No hay partidas registradas para esta ronda.";
      fila.appendChild(celda);
      cuerpoPartidas.appendChild(fila);
      return;
    }

    partidasRonda.forEach((partida) => {
      const fila = document.createElement("tr");
      const celdaEnfrentamiento = document.createElement("td");
      celdaEnfrentamiento.textContent = `${partida.participanteA} vs ${partida.participanteB}`;
      const celdaHorario = document.createElement("td");
      celdaHorario.textContent = partida.horario;
      const celdaEstado = document.createElement("td");
      const estadosLegibles = { programada: "Programada", jugada: "Jugada", cancelada: "Cancelada" };
      celdaEstado.textContent = estadosLegibles[partida.estado] || partida.estado;
      fila.append(celdaEnfrentamiento, celdaHorario, celdaEstado);
      cuerpoPartidas.appendChild(fila);
    });
  }

  function renderizarPestanas() {
    contenedorPestanas.innerHTML = "";
    if (rondas.length === 0) {
      contenedorPestanas.appendChild(crearElemento("p", { clase: "estado-vacio", texto: "Aún no hay calendario disponible." }));
      return;
    }
    rondas.forEach((ronda) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.textContent = `Ronda ${ronda}`;
      boton.setAttribute("role", "tab");
      boton.setAttribute("aria-selected", String(ronda === rondaActual));
      boton.addEventListener("click", () => {
        rondaActual = ronda;
        renderizarPestanas();
        renderizarPartidas();
      });
      contenedorPestanas.appendChild(boton);
    });
  }

  renderizarPestanas();
  renderizarPartidas();

  
