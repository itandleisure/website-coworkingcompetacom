/* Contactformulier: bericht opslaan in Google Sheets + e-mail (via Google Apps Script).
   - Lukt dat, dan gaat de bezoeker naar de bedankpagina uit het veld _next.
   - Lukt het niet (of is GOOGLE_URL leeg), dan verstuurt het formulier gewoon via
     FormSubmit (de action in de HTML). Zo gaat er nooit een aanvraag verloren. */
(function () {
  // Web-app-URL van het Google Apps Script (eindigt op /exec). Leeg = alleen FormSubmit.
  var GOOGLE_URL = 'https://script.google.com/macros/s/AKfycbzt9w8HchDBZYWda5NxI5vueK_dus7dAaWKbFtk25P7PlKYszyO4zdrLCLhH-QRQuNjAA/exec';

  if (!GOOGLE_URL || !window.fetch || !window.URLSearchParams) return;

  var taal = (document.documentElement.lang || 'nl').slice(0, 2);

  document.querySelectorAll('form.formulier').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var knop = form.querySelector('[type="submit"]');
      if (knop) knop.disabled = true;

      var data = new URLSearchParams(new FormData(form));
      data.append('taal', taal);
      data.append('pagina', location.pathname);

      fetch(GOOGLE_URL, { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.fout || 'mislukt');
          var volgende = form.querySelector('[name="_next"]');
          location.href = volgende ? new URL(volgende.value).pathname : '/';
        })
        .catch(function () {
          // Reservepad: gewoon versturen via FormSubmit
          form.submit();
        });
    });
  });
})();
