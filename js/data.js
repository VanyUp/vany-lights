/* =========================================================
   VANY LIGHTS — data.js
   La "base de datos" del sitio: las líneas y las velas.
   El inicio, el catálogo, el detalle y el carrito leen de aquí.
   Para agregar una vela nueva, solo se agrega un objeto a VL.PRODUCTS.
   ========================================================= */

window.VL = window.VL || {};


/* ---------- Las 4 líneas (cada una es un "mundo" de color) ---------- */
VL.LINES = {
  deco: {
    name: 'Decorativas', num: '01',
    titleA: 'Ternura que', titleB: 'se enciende',
    text: 'Ositos en canastas tejidas y cupcakes de flores, moldeados a mano para adornar tu espacio o sorprender a alguien especial.',
    bg: '#F9DCE5', accent: '#F4C2D2', glow: '#FFF1F5', petal: '#F09AB5', ink: '#A8456E',
    marquee: 'ternura · ositos · flores · '
  },
  aroma: {
    name: 'Aromáticas', num: '02',
    titleA: 'Un jardín', titleB: 'que perfuma',
    text: 'Flores de cera sobre ramekins y vasos de vidrio. Enciéndelas y llena tu casa de aroma y de calma.',
    bg: '#DDF0E4', accent: '#BFE3CB', glow: '#F4FFF7', petal: '#8CCBA2', ink: '#2F7350',
    marquee: 'aroma · calma · jardín · '
  },
  wax: {
    name: 'Wax melts', num: '03',
    titleA: 'Aroma', titleB: 'sin llama',
    text: 'Corazones de cera para derretir en el pebetero. Perfuman tu espacio de forma suave, sin mecha.',
    bg: '#E7DEF5', accent: '#D2C3EE', glow: '#FAF6FF', petal: '#B79BE0', ink: '#6B48A0',
    marquee: 'corazones · pebetero · aroma · '
  },
  rec: {
    name: 'Recuerdos', num: '04',
    titleA: 'Detalles para', titleB: 'recordar',
    text: 'Recuerdos para cumpleaños, baby showers y celebraciones, personalizados con número, color, tarjeta y empaque.',
    bg: '#DCEAF7', accent: '#BFD8EF', glow: '#F5FAFF', petal: '#8DB8E2', ink: '#2F5F92',
    marquee: 'celebra · recuerda · regala · '
  }
};


/* ---------- Las velas ----------
   IMPORTANTE: los precios son DE EJEMPLO para que el carrito funcione.
   Reemplázalos por los precios reales de Vany Lights (en pesos colombianos). */
VL.PRODUCTS = [
  { id: 'osito-rosa', line: 'deco', name: 'Osito en canasta rosa', price: 25000,
    img: 'assets/img/osito-rosa.webp', w: 689, h: 900,
    desc: 'Un osito blanco con moño rosa, sentado en su canasta tejida de cera. Ideal para regalar o para decorar una mesa de noche.' },

  { id: 'ositos-canasta', line: 'deco', name: 'Familia de ositos en canasta', price: 85000,
    img: 'assets/img/ositos-canasta.webp', w: 900, h: 479,
    desc: 'Cuatro ositos en canastas tejidas de colores, cada uno con su moño. Un detalle tierno para compartir o decorar.' },

  { id: 'cupcakes', line: 'deco', name: 'Cupcakes de flores', price: 18000,
    img: 'assets/img/cupcakes.webp', w: 900, h: 418,
    desc: 'Velas en forma de cupcake coronadas con flores de cera en tonos pastel.' },

  { id: 'margarita', line: 'aroma', name: 'Margarita en ramekin', price: 32000,
    img: 'assets/img/margarita.webp', w: 900, h: 868,
    desc: 'Una margarita blanca de centro rosa sobre cera verde, en un ramekin blanco acanalado.' },

  { id: 'trio', line: 'aroma', name: 'Trío de jardín', price: 75000,
    img: 'assets/img/trio.webp', w: 892, h: 900,
    desc: 'Tres ramekins con flores de cera sobre verde, amarillo y celeste. Un pequeño jardín para tu mesa.' },

  { id: 'flores-vaso', line: 'aroma', name: 'Flores en vaso de vidrio', price: 35000,
    img: 'assets/img/flores-vaso.webp', w: 900, h: 895,
    desc: 'Flores blancas y amarillas sobre un cielo de cera azul, en vaso de vidrio.' },

  { id: 'coral', line: 'aroma', name: 'Flores coral en ramekin', price: 30000,
    img: 'assets/img/coral.webp', w: 900, h: 842,
    desc: 'Flores coral con hojas verdes sobre cera amarilla, en un ramekin blanco.' },

  { id: 'pebetero', line: 'wax', name: 'Wax melts con pebetero', price: 45000,
    img: 'assets/img/pebetero.webp', w: 782, h: 900,
    desc: 'Corazones de cera para derretir en el pebetero, con una flor rosa de cera. Aroma suave, sin mecha.' },

  { id: 'corazones', line: 'wax', name: 'Vaso de corazones', price: 22000,
    img: 'assets/img/corazones.webp', w: 739, h: 900,
    desc: 'Un vaso lleno de corazones de cera en rojos, rosas y blancos, listos para el pebetero.' },

  { id: 'conejita', line: 'rec', name: 'Conejita con moño', price: 12000,
    img: 'assets/img/conejita.webp', w: 593, h: 900,
    desc: 'Conejita de orejas largas con moño lila. Perfecta como recuerdo de cumpleaños o baby shower.' },

  { id: 'recuerdo-tarjeta', line: 'rec', name: 'Ositos con tarjeta personalizada', price: 28000,
    img: 'assets/img/recuerdo-tarjeta.webp', w: 900, h: 660,
    desc: 'Ositos en canasta amarilla con una tarjeta personalizada para la celebración.' }
];


/* ---------- Funciones de ayuda ---------- */

// Busca una vela por su id
VL.getProduct = (id) => VL.PRODUCTS.find((p) => p.id === id);

// Devuelve todas las velas de una línea
VL.productsByLine = (line) => VL.PRODUCTS.filter((p) => p.line === line);

// Formatea un número como precio colombiano: 25000 → "$ 25.000"
VL.formatPrice = (n) =>
  n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
