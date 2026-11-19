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

    // El primer mensaje se va hacia arriba y se desenfoca
    .to('.msg1', { opacity: 0, y: -60, filter: 'blur(6px)', duration: 0.4 }, 0.05)

    // El cielo de noche se apaga
    .to('.night', { opacity: 0, duration: 0.6 }, 0.2)

    // Llega el segundo mensaje
    .fromTo('.msg2',
      { opacity: 0, y: 50, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 }, 0.55)

    // Suben los ositos y la conejita, un poquito desfasados
    .fromTo('.hero-bears',
      { opacity: 0, y: 160, rotation: -10 },
      { opacity: 1, y: 0, rotation: -3, duration: 0.4 }, 0.65)
    .fromTo('.hero-bunny',
      { opacity: 0, y: 160, rotation: 10 },
      { opacity: 1, y: 0, rotation: 4, duration: 0.4 }, 0.72);
}
