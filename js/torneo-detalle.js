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

 