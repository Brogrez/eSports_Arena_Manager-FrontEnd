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