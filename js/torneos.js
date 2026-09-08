/**
 * eSports Arena Manager - Vista Listado de torneos (EP1)
 */
document.addEventListener("DOMContentLoaded", () => {
  const { torneos, juegos } = window.EAM_DATA;
  const { obtenerNombreJuego, cuposDisponibles, formatearFecha, etiquetaEstado, crearElemento } = EAM_UTIL;

  const selectJuego = document.getElementById("filtro-juego");
  const selectEstado = document.getElementById("filtro-estado");
  const inputBusqueda = document.getElementById("filtro-busqueda");
  const inputDesde = document.getElementById("filtro-desde");
  const inputHasta = document.getElementById("filtro-hasta");
  const errorFechas = document.getElementById("error-fechas");
  const contenedorLista = document.getElementById("lista-torneos");
  const contador = document.getElementById("contador-resultados");

  // Poblar el select de juegos desde el catálogo simulado
  juegos.forEach((juego) => {
    const opcion = document.createElement("option");
    opcion.value = juego.id;
    opcion.textContent = juego.nombre;
    selectJuego.appendChild(opcion);
  });

  function renderizarTarjeta(torneo) {
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
    meta.appendChild(crearElemento("span", { texto: torneo.modalidad }));
    meta.appendChild(
      crearElemento("span", { texto: `${torneo.cupoOcupado}/${torneo.cupoMaximo} cupos` })
    );
    meta.appendChild(
      crearElemento("span", { texto: `Cierra ${formatearFecha(torneo.fechaCierreInscripcion)}` })
    );
    tarjeta.appendChild(meta);

    tarjeta.appendChild(crearElemento("p", { texto: torneo.descripcion }));

    tarjeta.appendChild(
      crearElemento("a", {
        clase: "boton boton-secundario",
        texto: "Ver detalle",
        atributos: { href: `torneo-detalle.html?id=${torneo.id}` },
      })
    );

    return tarjeta;
  }

  function aplicarFiltros() {
    const desde = inputDesde.value;
    const hasta = inputHasta.value;

    // Validación: la fecha inicial no puede ser posterior a la final
    if (desde && hasta && desde > hasta) {
      errorFechas.textContent = "La fecha 'desde' no puede ser posterior a la fecha 'hasta'.";
      inputHasta.closest(".campo").classList.add("con-error");
      contenedorLista.innerHTML = "";
      contador.textContent = "";
      return;
    }
    errorFechas.textContent = "";
    inputHasta.closest(".campo").classList.remove("con-error");

    const texto = inputBusqueda.value.trim().toLowerCase();
    const juegoId = selectJuego.value;
    const estado = selectEstado.value;

    const filtrados = torneos.filter((torneo) => {
      const coincideTexto = !texto || torneo.nombre.toLowerCase().includes(texto);
      const coincideJuego = !juegoId || torneo.juegoId === juegoId;
      const coincideEstado = !estado || torneo.estado === estado;
      const coincideDesde = !desde || torneo.fechaCierreInscripcion >= desde;
      const coincideHasta = !hasta || torneo.fechaCierreInscripcion <= hasta;
      return coincideTexto && coincideJuego && coincideEstado && coincideDesde && coincideHasta;
    });

    contenedorLista.innerHTML = "";
    if (filtrados.length === 0) {
      contenedorLista.appendChild(
        crearElemento("p", {
          clase: "estado-vacio",
          texto: "Ningún torneo cumple con los filtros seleccionados. Prueba ajustando los criterios.",
        })
      );
    } else {
      filtrados.forEach((torneo) => contenedorLista.appendChild(renderizarTarjeta(torneo)));
    }
    contador.textContent = `${filtrados.length} torneo(s) encontrado(s)`;
  }

  [selectJuego, selectEstado, inputDesde, inputHasta].forEach((el) =>
    el.addEventListener("change", aplicarFiltros)
  );
  inputBusqueda.addEventListener("input", aplicarFiltros);

  aplicarFiltros();
});
