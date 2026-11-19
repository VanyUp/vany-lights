/* =========================================================
   VANY LIGHTS — nosotros.js
   1. Pone una vela sobre el pedestal junto a la historia.
   2. Convierte el scroll vertical en movimiento horizontal
      en la franja "Así nace cada vela" (técnica "pin").
   ========================================================= */

/* ---------- 1. Pedestal con la familia de ositos ---------- */
const art = document.getElementById('about-art');
const featured = VL.getProduct('ositos-canasta');
const featuredLine = VL.LINES[featured.line];

art.innerHTML = `
  <div class="aura" style="background: radial-gradient(circle, ${featuredLine.glow} 0%, rgba(255,255,255,0) 66%)" aria-hidden="true"></div>
  ${VL.sceneHTML(featured, featuredLine)}`;
VL.initTilt(art);


/* ---------- 2. Franja horizontal ligada al scroll ----------
   Mientras bajas, la sección se queda fija (pin) y la franja
   se mueve hacia la izquierda la misma distancia que sobra de ancho.
   Sin movimiento (o sin GSAP), la franja se recorre con scroll lateral. */
if (!VL.reduceMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const track = document.querySelector('.track');

  // Cuánto hay que mover la franja: su ancho total menos el ancho de la pantalla
  const distance = () => track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.process',
      start: 'top top',
      end: () => '+=' + distance(),   // el scroll dura lo mismo que el recorrido
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true        // recalcula si cambias el tamaño de la ventana
    }
  });
}
