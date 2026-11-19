/* =========================================================
   VANY LIGHTS — catalogo.js
   Muestra las velas y las filtra por línea.
   El filtro también queda en la URL (catalogo.html?linea=deco),
   así se puede compartir o enlazar directo a una línea.
   ========================================================= */

const grid = document.getElementById('grid');
const chips = document.querySelectorAll('.chip');
const result = document.getElementById('resultado');


/* Dibuja las tarjetas de la línea elegida ('todas' muestra todo) */
function render(filter) {
  const list = filter === 'todas'
    ? VL.PRODUCTS
    : VL.PRODUCTS.filter((p) => p.line === filter);

  grid.innerHTML = list.map((p, i) => VL.tileHTML(p, i)).join('');

  // Marca el filtro activo
  chips.forEach((chip) => chip.setAttribute('aria-pressed', chip.dataset.filter === filter));

  // Aviso para lectores de pantalla: cuántas velas se muestran
  result.textContent = `Mostrando ${list.length} velas`;
}


/* Al tocar un filtro: dibujar de nuevo y actualizar la URL sin recargar */
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    render(filter);

    const url = new URL(location.href);
    if (filter === 'todas') url.searchParams.delete('linea');
    else url.searchParams.set('linea', filter);
    history.replaceState(null, '', url);
  });
});


/* Al abrir la página: leer el filtro de la URL, si viene uno válido */
const fromUrl = new URLSearchParams(location.search).get('linea');
render(VL.LINES[fromUrl] ? fromUrl : 'todas');
