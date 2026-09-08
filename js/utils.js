const EAM_UTIL = (() => {
  const { juegos, torneos, equipos, jugadores, inscripciones, sanciones } = window.EAM_DATA;

  function obtenerNombreJuego(juegoId) {
    const juego = juegos.find((j) => j.id === juegoId);
    return juego ? juego.nombre : "Juego no disponible";
  }

  function obtenerJuegoPorId(juegoId) {
    return juegos.find((j) => j.id === juegoId) || null;
  }

  function obtenerTorneoPorId(torneoId) {
    return torneos.find((t) => t.id === torneoId) || null;
  }

  function obtenerEquipoPorId(equipoId) {
    return equipos.find((e) => e.id === equipoId) || null;
  }

  function obtenerJugadorPorId(jugadorId) {
    return jugadores.find((j) => j.id === jugadorId) || null;
  }

  function cuposDisponibles(torneo) {
    const disponibles = torneo.cupoMaximo - torneo.cupoOcupado;
    return disponibles < 0 ? 0 : disponibles;
  }

  function formatearFecha(fechaISO) {
    if (!fechaISO) return "Sin fecha";
    const [anio, mes, dia] = fechaISO.split(/[- ]/);
    return `${dia}-${mes}-${anio}`;
  }

  function etiquetaEstado(estado) {
    const mapa = {
      abierto: "Abierto",
      "en-curso": "En curso",
      finalizado: "Finalizado",
    };
    return mapa[estado] || estado;
  }

  function inscripcionFueraDePlazo(torneo, fechaActualISO = new Date().toISOString().slice(0, 10)) {
    return fechaActualISO > torneo.fechaCierreInscripcion;
  }

  function tieneSancionActiva(jugadorId) {
    return sanciones.some((s) => s.jugadorId === jugadorId && s.vigente);
  }

  function yaInscrito(torneoId, participanteId) {
    return inscripciones.some((i) => i.torneoId === torneoId && i.participanteId === participanteId);
  }

   function equipoCompleto(equipo) {
    const juego = obtenerJuegoPorId(equipo.juegoId);
    if (!juego) return false;
    return equipo.integrantes.length >= juego.integrantesPorEquipo;
  }

  function crearElemento(tag, opciones = {}) {
    const el = document.createElement(tag);
    if (opciones.texto) el.textContent = opciones.texto;
    if (opciones.html) el.innerHTML = opciones.html;
    if (opciones.clase) el.className = opciones.clase;
    if (opciones.atributos) {
      Object.entries(opciones.atributos).forEach(([clave, valor]) => el.setAttribute(clave, valor));
    }
    return el;
  }

  return {
    obtenerNombreJuego,
    obtenerJuegoPorId,
    obtenerTorneoPorId,
    obtenerEquipoPorId,
    obtenerJugadorPorId,
    cuposDisponibles,
    formatearFecha,
    etiquetaEstado,
    inscripcionFueraDePlazo,
    tieneSancionActiva,
    yaInscrito,
    equipoCompleto,
    crearElemento,
  };

})();