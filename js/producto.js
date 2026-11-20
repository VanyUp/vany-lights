/* =========================================================
   VANY LIGHTS — producto.js
   Una sola página sirve para TODAS las velas.
   La vela se elige con un parámetro en la URL:
   producto.html?id=osito-rosa  →  muestra el osito rosa.
   ========================================================= */

const detail = document.getElementById('detalle');
const related = document.getElementById('relacionados');

// 1. Leer el id de la URL y buscar la vela en data.js
const id = new URLSearchParams(location.search).get('id');
const product = VL.getProduct(id);


if (!product) {
  /* Si el id no existe, mostramos un mensaje amable en vez de una página rota */
  detail.innerHTML = `
    <div class="empty" style="padding-top: 160px">
      <span class="script">Ups</span>
      <p>No encontramos esa vela.</p>
      <a class="btn btn-dark" href="/html/catalogo.html">Ver el catálogo</a>
    </div>`;
  related.closest('section').hidden = true;

} else {
  const line = VL.LINES[product.line];
  let qty = 1;

  // 2. Título de la pestaña del navegador con el nombre de la vela
  document.title = `${product.name} · Vany Lights`;

  // 3. Armar el detalle
  detail.innerHTML = `
    <div class="product-layout">

      <div class="stage" id="escenario">
        <div class="aura" style="background: radial-gradient(circle, ${line.glow} 0%, rgba(255,255,255,0) 66%)" aria-hidden="true"></div>
        ${VL.sceneHTML(product, line, { link: false, lazy: false })}
      </div>

      <div class="product-copy">
        <nav class="breadcrumb" aria-label="Ruta">
          <a href="/index.html">Inicio</a> / <a href="/html/catalogo.html?linea=${product.line}">${line.name}</a> / <span>${product.name}</span>
        </nav>
        <span class="script" style="font-size: 40px; line-height: 1; color: ${line.ink}">${line.name}</span>
        <h1>${product.name}</h1>
        <p class="desc">${product.desc}</p>
        <div class="tags">
          <span class="tag">Hecha a mano</span>
          <span class="tag">Envíos nacionales</span>
        </div>
        <span class="price-big">${VL.formatPrice(product.price)}</span>

        <div class="buy-row">
          <div class="qty" role="group" aria-label="Cantidad">
            <button class="qty-btn" type="button" data-step="-1" aria-label="Quitar uno">−</button>
            <span class="qty-value" aria-live="polite">1</span>
            <button class="qty-btn" type="button" data-step="1" aria-label="Agregar uno">+</button>
          </div>
          <button class="btn btn-dark" type="button" id="agregar"
                  data-add="${product.id}" data-name="${product.name}" data-qty="1">Agregar al carrito</button>
        </div>
      </div>
    </div>`;

  // 4. Fondo de la página con el color de su línea
  document.body.style.background = `linear-gradient(180deg, ${line.bg} 0%, ${line.bg} 55%, #FBF3EE 100%)`;

  // 5. Selector de cantidad: actualiza el número y el data-qty del botón
  const qtyValue = detail.querySelector('.qty-value');
  const addButton = document.getElementById('agregar');

  detail.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      qty = Math.min(20, Math.max(1, qty + Number(btn.dataset.step)));
      qtyValue.textContent = qty;
      addButton.dataset.qty = qty;
    });
  });

  // 6. Inclinación 3D (función de main.js)
  VL.initTilt(document.getElementById('escenario'));

  // 7. Velas relacionadas: primero las de la misma línea, después otras
  const others = VL.PRODUCTS.filter((p) => p.id !== product.id);
  const sameLine = others.filter((p) => p.line === product.line);
  const rest = others.filter((p) => p.line !== product.line);
  related.innerHTML = [...sameLine, ...rest].slice(0, 4).map((p, i) => VL.tileHTML(p, i)).join('');
}
