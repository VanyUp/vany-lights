/* =========================================================
   VANY LIGHTS — main.js
   Lo que comparten TODAS las páginas:
   1. Detectar si se permite movimiento
   2. El carrito guardado en el navegador (localStorage)
   3. El contador del carrito en el menú
   4. Los avisos (toast)
   5. Los botones "Agregar al carrito"
   6. El menú del celular
   7. Marcar la página actual en el menú
   8. Aparición de elementos al hacer scroll
   ========================================================= */

/* Todo lo que otras páginas necesitan usar lo guardamos en un
   solo objeto global llamado VL, para no ensuciar el código. */
window.VL = window.VL || {};


/* ---------- 1. ¿Se permite movimiento? ----------
   matchMedia pregunta al navegador si la persona activó
   "reducir movimiento" en su sistema operativo. */
VL.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!VL.reduceMotion) {
  // Esta clase activa en el CSS las animaciones de aparición
  document.documentElement.classList.add('motion-ok');
}


/* ---------- 2. El carrito ----------
   localStorage guarda texto en el navegador y no se borra
   al cambiar de página. Guardamos un objeto { idVela: cantidad }
   convertido a texto con JSON. try/catch evita errores si el
   navegador bloquea el almacenamiento (por ejemplo, en modo privado). */
VL.cart = {
  KEY: 'vany-lights-carrito',

  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || {};
    } catch (e) {
      return {};
    }
  },

  save(items) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
    } catch (e) { /* si no se puede guardar, seguimos sin romper la página */ }
    VL.updateBadge(true);
  },

  add(id, qty = 1) {
    const items = this.get();
    items[id] = (items[id] || 0) + qty;
    this.save(items);
  },

  setQty(id, qty) {
    const items = this.get();
    if (qty <= 0) delete items[id];
    else items[id] = qty;
    this.save(items);
  },

  count() {
    // Suma todas las cantidades: { a: 2, b: 1 } → 3
    return Object.values(this.get()).reduce((total, n) => total + n, 0);
  }
};


/* ---------- 3. Contador del carrito en el menú ---------- */
VL.updateBadge = function (bump = false) {
  document.querySelectorAll('[data-cart-count]').forEach((badge) => {
    badge.textContent = VL.cart.count();
    if (bump) {
      // Quitar y volver a poner la clase reinicia la animación de rebote
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }
  });
};


/* ---------- 4. Avisos (toast) ----------
   Crea un mensaje arriba de la pantalla y lo quita a los 2.6 s.
   role="status" hace que los lectores de pantalla lo lean. */
VL.toast = function (message) {
  document.querySelector('.toast')?.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4C6D6" stroke-width="2.4"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>
    <span></span>
    <a href="carrito.html">Ver carrito</a>`;
  toast.querySelector('span').textContent = message;   // textContent: seguro contra código inyectado
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2600);
};


/* ---------- 5. Botones "Agregar al carrito" ----------
   En vez de poner un evento en cada botón, escuchamos los clics en
   todo el documento (delegación de eventos). Así también funcionan los
   botones que JavaScript crea después, como los del catálogo. */
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;

  const id = button.dataset.add;                   // data-add="osito-rosa"
  const qty = Number(button.dataset.qty || 1);     // data-qty (opcional)
  const name = button.dataset.name || 'Tu vela';   // data-name para el aviso

  VL.cart.add(id, qty);
  VL.toast(`${name} está en tu carrito`);

  // Micro-interacción: el botón se pone verde con un check por 1.5 s
  if (button.classList.contains('is-added')) return;
  const original = button.innerHTML;
  button.classList.add('is-added');
  button.innerHTML = `
    <svg class="check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>
    ${button.classList.contains('mini') ? '<span class="sr-only">Agregada</span>' : '<span>Agregada</span>'}`;
  setTimeout(() => {
    button.classList.remove('is-added');
    button.innerHTML = original;
  }, 1500);
});


/* ---------- 6. Menú del celular ---------- */
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');

toggle?.addEventListener('click', () => {
  const open = header.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});


/* ---------- 7. Marcar la página actual en el menú ----------
   aria-current="page" le dice al lector de pantalla dónde estás,
   y el CSS lo usa para resaltar el enlace. */
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach((link) => {
  if (link.getAttribute('href') === currentPage) {
    link.setAttribute('aria-current', 'page');
  }
});


/* ---------- 8. Aparición al hacer scroll ----------
   IntersectionObserver avisa cuando un elemento entra en pantalla.
   Entonces le agregamos .is-visible y el CSS hace la animación. */
VL.observeReveals = function (root = document) {
  const elements = root.querySelectorAll('.reveal:not(.is-visible)');

  if (VL.reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);   // solo se anima una vez
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((el) => observer.observe(el));
};


/* ---------- 9. Inclinación 3D con el mouse ----------
   Calcula dónde está el mouse dentro del escenario (de 0 a 1)
   y lo convierte en grados de giro para .scene.
   requestAnimationFrame limita los cálculos a uno por cuadro de pantalla,
   así el efecto es fluido y no recarga el navegador. */
VL.initTilt = function (stage, maxDeg = 14) {
  const scene = stage.querySelector('.scene');
  const canHover = window.matchMedia('(hover: hover)').matches;   // no en celulares
  if (!scene || VL.reduceMotion || !canHover) return;

  let frame = null;

  stage.addEventListener('mousemove', (event) => {
    const box = stage.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;   // 0 = izquierda, 1 = derecha
    const y = (event.clientY - box.top) / box.height;   // 0 = arriba, 1 = abajo

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      scene.classList.add('is-tilting');
      scene.style.transform =
        `rotateX(${((0.5 - y) * maxDeg).toFixed(2)}deg) rotateY(${((x - 0.5) * maxDeg).toFixed(2)}deg)`;
    });
  });

  stage.addEventListener('mouseleave', () => {
    cancelAnimationFrame(frame);
    scene.classList.remove('is-tilting');   // vuelve despacio a su lugar
    scene.style.transform = '';
  });
};


/* ---------- Al cargar la página ---------- */
VL.updateBadge();
VL.observeReveals();
