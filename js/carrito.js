/* =========================================================
   VANY LIGHTS — carrito.js
   Lee el carrito de localStorage (main.js), lo dibuja,
   permite cambiar cantidades y arma el pedido para WhatsApp.
   No hay pasarela de pagos: es un carrito simulado.
   ========================================================= */

const WHATSAPP = '573222224048';   // número de Vany Lights con el código de Colombia (57)
const box = document.getElementById('carrito');
let firstRender = true;   // la animación de entrada solo se ve la primera vez


/* Convierte { id: cantidad } en una lista con los datos completos de cada vela */
function getItems() {
  return Object.entries(VL.cart.get())
    .map(([id, qty]) => ({ product: VL.getProduct(id), qty }))
    .filter((item) => item.product);   // ignora ids que ya no existan en data.js
}


/* Dibuja todo el carrito. Se vuelve a llamar cada vez que algo cambia. */
function render() {
  const items = getItems();

  // --- Carrito vacío ---
  if (items.length === 0) {
    box.innerHTML = `
      <div class="empty">
        <span class="script">Aún vacío</span>
        <p>Todavía no has agregado velas. ¡Encuentra tu favorita!</p>
        <a class="btn btn-dark" href="catalogo.html">Ir al catálogo</a>
      </div>`;
    return;
  }

  // --- Total: suma de precio × cantidad ---
  const total = items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const units = items.reduce((sum, { qty }) => sum + qty, 0);

  // Valores que la persona ya escribió (para no borrarlos al redibujar)
  const name = document.getElementById('nombre')?.value || '';
  const city = document.getElementById('ciudad')?.value || '';

  box.innerHTML = `
    <div class="cart-layout">

      <ul class="cart-list" aria-label="Productos en tu carrito">
        ${items.map(({ product: p, qty }, i) => `
          <li class="cart-item" style="${firstRender ? `animation: aparecer .5s ${(i * 0.06).toFixed(2)}s both` : ''}">
            <div class="cart-thumb" style="background:${VL.LINES[p.line].bg}">
              <img src="${p.img}" alt="" width="${p.w}" height="${p.h}">
            </div>
            <div class="cart-info">
              <h3><a href="producto.html?id=${p.id}">${p.name}</a></h3>
              <span class="price">${VL.formatPrice(p.price)} c/u</span>
            </div>
            <div class="qty" role="group" aria-label="Cantidad de ${p.name}">
              <button class="qty-btn" type="button" data-id="${p.id}" data-step="-1" aria-label="Quitar uno">−</button>
              <span class="qty-value">${qty}</span>
              <button class="qty-btn" type="button" data-id="${p.id}" data-step="1" aria-label="Agregar uno">+</button>
            </div>
            <strong style="min-width: 96px; text-align: right">${VL.formatPrice(p.price * qty)}</strong>
            <button class="remove" type="button" data-remove="${p.id}">Quitar</button>
          </li>`).join('')}
      </ul>

      <aside class="cart-summary" aria-label="Resumen del pedido">
        <h2 class="serif" style="margin:0; font-size:32px">Resumen</h2>
        <div class="summary-row"><span>Productos (${units})</span><span>${VL.formatPrice(total)}</span></div>
        <div class="summary-row"><span>Envío</span><span>Se acuerda por WhatsApp</span></div>
        <div class="summary-row summary-total"><span>Total</span><span>${VL.formatPrice(total)}</span></div>

        <div class="field">
          <label for="nombre">Tu nombre (opcional)</label>
          <input id="nombre" type="text" autocomplete="name" value="${name.replace(/"/g, '&quot;')}">
        </div>
        <div class="field">
          <label for="ciudad">Ciudad de envío (opcional)</label>
          <input id="ciudad" type="text" autocomplete="address-level2" value="${city.replace(/"/g, '&quot;')}">
        </div>

        <a class="btn btn-dark" id="whatsapp" href="#" target="_blank" rel="noopener">Finalizar pedido por WhatsApp</a>
        <p class="note">Carrito simulado: no se realiza ningún pago en esta página.</p>
      </aside>
    </div>`;

  updateWhatsAppLink();
  firstRender = false;
}


/* Arma el mensaje del pedido y lo pone en el enlace de WhatsApp.
   encodeURIComponent convierte espacios, tildes y saltos de línea
   al formato que entiende una URL. */
function updateWhatsAppLink() {
  const link = document.getElementById('whatsapp');
  if (!link) return;

  const items = getItems();
  const total = items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const name = document.getElementById('nombre').value.trim();
  const city = document.getElementById('ciudad').value.trim();

  const lines = [
    `¡Hola Vany Lights! ${name ? `Soy ${name} y q` : 'Q'}uiero hacer este pedido:`,
    '',
    ...items.map(({ product, qty }) => `• ${qty} × ${product.name} (${VL.formatPrice(product.price * qty)})`),
    '',
    `Total: ${VL.formatPrice(total)}`,
    city ? `Envío a: ${city}` : ''
  ];

  link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n').trim())}`;
}


/* Un solo escuchador para todos los botones del carrito (delegación) */
box.addEventListener('click', (event) => {
  const stepBtn = event.target.closest('[data-step]');
  const removeBtn = event.target.closest('[data-remove]');

  if (stepBtn) {
    const id = stepBtn.dataset.id;
    const current = VL.cart.get()[id] || 0;
    VL.cart.setQty(id, Math.min(20, current + Number(stepBtn.dataset.step)));   // en 0 se elimina
    render();
  }

  if (removeBtn) {
    VL.cart.setQty(removeBtn.dataset.remove, 0);
    render();
  }
});

// Mientras escribes nombre o ciudad, el mensaje de WhatsApp se actualiza
box.addEventListener('input', updateWhatsAppLink);


render();
