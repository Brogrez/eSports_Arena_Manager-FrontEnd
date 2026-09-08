/**
 * eSports Arena Manager - Comportamiento común del layout (EP1)
 * Se carga en todas las vistas: menú móvil, enlace activo y año del footer.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Menú de navegación en móvil
  const botonMenu = document.querySelector(".nav-toggle");
  const listaNav = document.querySelector(".nav-lista");
  if (botonMenu && listaNav) {
    botonMenu.addEventListener("click", () => {
      const abierto = listaNav.classList.toggle("nav-lista--abierta");
      botonMenu.setAttribute("aria-expanded", String(abierto));
    });
  }

  // Marca el enlace activo según la página actual
  const paginaActual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-lista a").forEach((enlace) => {
    const destino = enlace.getAttribute("href");
    if (destino === paginaActual) {
      enlace.setAttribute("aria-current", "page");
    }
  });

  // Año dinámico en el footer
  const spanAnio = document.querySelector("[data-anio]");
  if (spanAnio) {
    spanAnio.textContent = new Date().getFullYear();
  }
});
