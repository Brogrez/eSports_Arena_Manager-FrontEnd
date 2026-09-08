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
})