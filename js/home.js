/* =========================================================
   VANY LIGHTS — home.js
   Animaciones de la página de inicio.
   Usa GSAP (librería de animación) y su plugin ScrollTrigger,
   que conecta las animaciones con el scroll.

   Parte 1 (paso D): las estrellas y el amanecer.
   ========================================================= */


/* ---------- Estrellas del cielo de noche ----------
   Creamos 40 puntos con JavaScript en vez de escribirlos a mano en el HTML.
   Las fórmulas con % reparten las estrellas sin que queden en fila. */
const night = document.querySelector('.night');

for (let i = 0; i < 40; i++) {
  const star = document.createElement('span');
  star.className = 'star-dot';
  star.style.left = ((i * 37) % 100) + '%';
  star.style.top = ((i * 53) % 70) + '%';
  star.style.animationDelay = ((i * 0.37) % 3.6).toFixed(2) + 's';
  night.appendChild(star);
}


/* ---------- El amanecer ligado al scroll ----------
   Solo se activa si GSAP cargó y la persona NO pidió reducir movimiento. */
if (!VL.reduceMotion && window.gsap && window.ScrollTrigger) {

  gsap.registerPlugin(ScrollTrigger);

  /* Una "timeline" es una línea de tiempo: varias animaciones en orden.
     Con scrollTrigger, en vez de avanzar con el reloj, AVANZA CON EL SCROLL.
     - trigger: el elemento que dispara la animación
     - start: 'top top' → empieza cuando el inicio del hero toca el borde superior
     - end: '+=130%' → termina después de bajar 1.3 pantallas
     - pin: true → el hero se queda fijo mientras dura la animación
     - scrub: 1 → la animación sigue al scroll con 1 segundo de suavizado */
  /* El arco se "dibuja": su línea punteada tiene un solo trazo tan largo
     como el arco (dasharray) y empieza corrida (dashoffset) para que no se vea.
     Al animar el dashoffset a 0, la línea aparece como si se trazara a mano. */
  const archLines = document.querySelectorAll('.arch-line');
  archLines.forEach((line) => {
    const length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
  });

  // La luz aparece suave cuando la llama se enciende (al cargar, no con el scroll)
  gsap.to('.dawn', { opacity: 0.6, duration: 1.6, delay: 2.4, ease: 'power2.out' });

  const amanecer = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=130%',
      pin: true,
      scrub: 1
    }
  });

  /* El último número de cada línea es el MOMENTO en que empieza,
     en una escala de 0 a 1 (0 = inicio del scroll, 1 = final). */
  amanecer
    // La indicación "Desliza para encender" desaparece apenas empiezas
    .to('.hint', { autoAlpha: 0, duration: 0.1 }, 0)

    // La luz nace en la llama y crece hasta llenar la pantalla
    .to('.dawn', { scale: 12, ease: 'power1.in', duration: 1 }, 0)
    .to('.dawn', { opacity: 1, duration: 0.3 }, 0)

    // El primer mensaje se va hacia arriba y se desenfoca
    .to('.msg1', { opacity: 0, y: -60, filter: 'blur(6px)', duration: 0.4 }, 0.05)

    // El cielo de noche se apaga
    .to('.night', { opacity: 0, duration: 0.6 }, 0.2)

    // Llega el segundo mensaje (autoAlpha = opacidad + visibilidad, así sus enlaces no se pueden tocar mientras está oculto)
    .fromTo('.msg2',
      { autoAlpha: 0, y: 50, filter: 'blur(8px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.4 }, 0.55)

    // Se dibuja el arco alrededor de la vela
    .to(archLines, { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.45, stagger: 0.08 }, 0.5)

    // Aparecen los destellos y los pétalos
    .fromTo('.hero-deco', { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.35 }, 0.7);
}


/* =========================================================
   Parte 2 (paso E): los capítulos de color.
   En vez de escribir 4 secciones casi iguales en el HTML,
   JavaScript las arma a partir de los datos de data.js.
   ========================================================= */

/* Arma el HTML de UN capítulo. Recibe la clave de la línea (ej. 'deco')
   y su posición, para alternar el lado de la vela. */
function chapterHTML(key, index, keys) {
  const line = VL.LINES[key];
  const products = VL.productsByLine(key);
  const first = products[0];

  // El fondo se mezcla con el color del capítulo anterior y del siguiente
  const prev = index === 0 ? '#FBF3EE' : VL.LINES[keys[index - 1]].bg;
  const next = index === keys.length - 1 ? '#FBF3EE' : VL.LINES[keys[index + 1]].bg;
  const background = `linear-gradient(180deg, ${prev} 0%, ${line.bg} 16%, ${line.bg} 84%, ${next} 100%)`;

  // Una miniatura por cada vela de la línea
  const thumbs = products.map((p, i) => `
    <button class="thumb" type="button" data-index="${i}" aria-pressed="${i === 0}" aria-label="Ver ${p.name}">
      <img src="${p.img}" alt="" width="${p.w}" height="${p.h}" loading="lazy">
    </button>`).join('');

  return `
  <section class="chapter" id="${key}" style="background:${background}" aria-labelledby="titulo-${key}">
    <div class="marquee" aria-hidden="true">${line.marquee.repeat(6)}</div>

    <div class="chapter-inner ${index % 2 ? 'rev' : ''}">

      <!-- Escenario: arco + pedestal + vela -->
      <div class="stage reveal" id="stage-${key}">
        <div class="aura" style="background: radial-gradient(circle, ${line.glow} 0%, rgba(255,255,255,0) 66%)" aria-hidden="true"></div>
        <span class="petal" style="left:2%; top:12%" aria-hidden="true">${VL.icons.petal(34, line.petal, 0)}</span>
        <span class="petal" style="right:4%; top:20%" aria-hidden="true">${VL.icons.petal(22, line.petal, -2)}</span>
        <span class="petal" style="right:10%; bottom:18%" aria-hidden="true">${VL.icons.petal(26, line.petal, -5)}</span>

        ${VL.sceneHTML(first, line)}

        <span class="zoom-hint" aria-hidden="true">Toca la vela para ver el detalle</span>
      </div>

      <!-- Texto, compra y miniaturas -->
      <div class="copy reveal">
        <div class="num" style="color:${line.ink}">
          <b>${line.num}</b><span class="line"></span><span class="script">${line.name}</span>
        </div>
        <h2 class="titulo" id="titulo-${key}">${line.titleA} <span class="script" style="color:${line.ink}">${line.titleB}</span></h2>
        <p class="ctext">${line.text}</p>

        <div class="buy">
          <div class="buy-info">
            <span class="buy-label">Estás viendo</span>
            <span class="buy-name">${first.name}</span>
            <span class="price">${VL.formatPrice(first.price)}</span>
          </div>
          <button class="btn btn-dark" type="button" data-add="${first.id}" data-name="${first.name}">Agregar al carrito</button>
        </div>

        <div class="thumbs" role="group" aria-label="Velas de la línea ${line.name}">${thumbs}</div>
      </div>
    </div>
  </section>`;
}


/* Inserta los 4 capítulos en <div id="colecciones"> */
const collections = document.getElementById('colecciones');
const lineKeys = Object.keys(VL.LINES);   // ['deco', 'aroma', 'wax', 'rec']
collections.innerHTML = lineKeys.map(chapterHTML).join('');


/* Le da vida a cada capítulo: miniaturas e inclinación 3D */
collections.querySelectorAll('.chapter').forEach((chapter) => {
  const products = VL.productsByLine(chapter.id);
  const stage = chapter.querySelector('.stage');
  const img = chapter.querySelector('.product-img');
  const link = chapter.querySelector('.product-link');
  const name = chapter.querySelector('.buy-name');
  const price = chapter.querySelector('.buy .price');
  const addButton = chapter.querySelector('[data-add]');
  let swapToggle = false;

  VL.initTilt(stage);

  chapter.querySelectorAll('.thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (thumb.getAttribute('aria-pressed') === 'true') return;
      const p = products[Number(thumb.dataset.index)];

      // 1. Marcar la miniatura elegida
      chapter.querySelectorAll('.thumb').forEach((t) => t.setAttribute('aria-pressed', t === thumb));

      // 2. Cambiar la vela, el nombre, el precio, el enlace y el botón
      img.src = p.img;
      img.alt = p.name;
      img.width = p.w;
      img.height = p.h;
      link.href = `/html/producto.html?id=${p.id}`;
      link.setAttribute('aria-label', `Ver detalle de ${p.name}`);
      name.textContent = p.name;
      price.textContent = VL.formatPrice(p.price);
      addButton.dataset.add = p.id;
      addButton.dataset.name = p.name;

      // 3. Animación de entrada: alternamos dos clases iguales para reiniciarla
      swapToggle = !swapToggle;
      img.classList.remove('swap-a', 'swap-b');
      img.classList.add(swapToggle ? 'swap-a' : 'swap-b');

      // 4. Si la vela grande no se ve (por ejemplo en celular), subir hasta ella
      const box = stage.getBoundingClientRect();
      if (box.top < 70 || box.bottom > window.innerHeight) {
        stage.scrollIntoView({ behavior: VL.reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
    });
  });
});

/* Galería de celebraciones: una figura por foto de VL.GALLERY */
const gallery = document.getElementById('galeria');
gallery.innerHTML = VL.GALLERY.map((photo, i) => `
  <figure class="shot reveal ${photo.size || ''}" style="transition-delay:${(i % 3) * 0.12}s">
    <img src="${photo.img}" alt="${photo.title}: ${photo.text}" width="${photo.w}" height="${photo.h}" loading="lazy" style="object-position:${photo.pos || 'center'}">
    <figcaption><strong>${photo.title}</strong><span>${photo.text}</span></figcaption>
  </figure>`).join('');

// Activa la aparición al hacer scroll en todo lo que acabamos de crear
VL.observeReveals(document);


/* Pétalos en parallax: se mueven a otra velocidad que el scroll */
if (!VL.reduceMotion && window.gsap && window.ScrollTrigger) {
  collections.querySelectorAll('.petal').forEach((petal, i) => {
    gsap.fromTo(petal,
      { y: 140 + (i % 3) * 60 },
      { y: -(140 + (i % 3) * 60), ease: 'none',
        scrollTrigger: { trigger: petal.closest('.chapter'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  // Recalcula posiciones ahora que la página es más larga
  ScrollTrigger.refresh();
}
