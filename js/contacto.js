/* =========================================================
   VANY LIGHTS — contacto.js
   Netlify recibe el formulario y vuelve a esta página con
   ?enviado=1 en la URL. Si lo vemos, mostramos un agradecimiento.
   ========================================================= */

if (new URLSearchParams(location.search).get('enviado') === '1') {
  const thanks = document.getElementById('gracias');
  thanks.innerHTML = `
    <p style="margin:0; padding:16px 20px; border-radius:18px; background: var(--aroma); color: var(--aroma-tinta)">
      ¡Gracias! Recibimos tu mensaje y te responderemos muy pronto.
    </p>`;
  thanks.scrollIntoView({ block: 'center' });
}
