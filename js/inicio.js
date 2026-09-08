document.addEventListener("DOMContentLoaded", () => {
  const { torneos } = window.EAM_DATA;
  const { obtenerNombreJuego, cuposDisponibles, formatearFecha, etiquetaEstado, crearElemento } = EAM_UTIL;

  const destacados = torneos.filter((t) => t.estado === "abierto" || t.estado === "en-curso");

  // --- Torneos destacados ---
  const contenedorDestacados = document.getElementById("lista-destacados");
  destacados.forEach((torneo) => {
    const tarjeta = crearElemento("article", { clase: "tarjeta tarjeta-torneo" });

    const cabecera = crearElemento("div", { clase: "tarjeta-torneo__cabecera" });
    cabecera.appendChild(crearElemento("h3", { texto: torneo.nombre }));
    cabecera.appendChild(
      crearElemento("span", {
        clase: `etiqueta-estado etiqueta-estado--${torneo.estado}`,
        texto: etiquetaEstado(torneo.estado),
      })
    );
    tarjeta.appendChild(cabecera);

    const meta = crearElemento("div", { clase: "tarjeta-torneo__meta" });
    meta.appendChild(crearElemento("span", { texto: obtenerNombreJuego(torneo.juegoId) }));
    meta.appendChild(crearElemento("span", { texto: `Cierra: ${formatearFecha(torneo.fechaCierreInscripcion)}` }));
    tarjeta.appendChild(meta);

    const disponibles = cuposDisponibles(torneo);
    const porcentaje = Math.round((torneo.cupoOcupado / torneo.cupoMaximo) * 100);
    const barra = crearElemento("div", { clase: "barra-cupos" });
    const relleno = crearElemento("div", { clase: "barra-cupos__relleno" });
    relleno.style.width = `${porcentaje}%`;
    barra.appendChild(relleno);
    tarjeta.appendChild(barra);
    tarjeta.appendChild(
      crearElemento("p", { clase: "texto-tenue", texto: `${disponibles} cupos disponibles de ${torneo.cupoMaximo}` })
    );

    const enlace = crearElemento("a", {
      clase: "boton boton-secundario",
      texto: "Ver detalle",
      atributos: { href: `torneo-detalle.html?id=${torneo.id}` },
    });
    tarjeta.appendChild(enlace);

    contenedorDestacados.appendChild(tarjeta);
  });

  if (destacados.length === 0) {
    contenedorDestacados.appendChild(
      crearElemento("p", { clase: "estado-vacio", texto: "No hay torneos abiertos o en curso por ahora." })
    );
  }

  // --- Próximos cierres de inscripción ---
  const cuerpoCierres = document.getElementById("cuerpo-cierres");
  const abiertos = torneos
    .filter((t) => t.estado === "abierto")
    .sort((a, b) => a.fechaCierreInscripcion.localeCompare(b.fechaCierreInscripcion));

  abiertos.forEach((torneo) => {
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = torneo.nombre;

    const celdaJuego = document.createElement("td");
    celdaJuego.textContent = obtenerNombreJuego(torneo.juegoId);

    const celdaCierre = document.createElement("td");
    celdaCierre.textContent = formatearFecha(torneo.fechaCierreInscripcion);

    const celdaCupos = document.createElement("td");
    celdaCupos.textContent = `${torneo.cupoOcupado}/${torneo.cupoMaximo}`;

    const celdaAccion = document.createElement("td");
    const enlace = document.createElement("a");
    enlace.href = `inscripcion.html?torneo=${torneo.id}`;
    enlace.className = "boton boton-primario";
    enlace.textContent = "Inscribirme";
    celdaAccion.appendChild(enlace);

    fila.append(celdaNombre, celdaJuego, celdaCierre, celdaCupos, celdaAccion);
    cuerpoCierres.appendChild(fila);
  });

  if (abiertos.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.setAttribute("colspan", "5");
    celda.className = "estado-vacio";
    celda.textContent = "No hay cierres de inscripción próximos.";
    fila.appendChild(celda);
    cuerpoCierres.appendChild(fila);
  }
});