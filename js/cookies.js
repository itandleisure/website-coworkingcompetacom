/* Cookiemelding + Google Analytics (AVG-proof)
   - Google Analytics wordt pas geladen NA toestemming.
   - Keuze wordt bewaard in localStorage ('cookie-keuze' = 'ja' of 'nee').
   - Een link met data-cookie-instellingen opent de melding opnieuw. */
(function () {
  var GA_ID = 'G-T5HDEV8EP7';
  var SLEUTEL = 'cookie-keuze';

  var TEKST = {
    nl: {
      titel: 'Cookies',
      tekst: 'We gebruiken Google Analytics om te zien hoe bezoekers onze website gebruiken. Dit doen we alleen als je daar toestemming voor geeft.',
      meer: 'Lees onze privacyverklaring', link: '/privacy/',
      ja: 'Accepteren', nee: 'Weigeren'
    },
    en: {
      titel: 'Cookies',
      tekst: 'We use Google Analytics to understand how visitors use our website. We only do this with your permission.',
      meer: 'Read our privacy policy', link: '/en/privacy/',
      ja: 'Accept', nee: 'Decline'
    },
    es: {
      titel: 'Cookies',
      tekst: 'Usamos Google Analytics para saber cómo usan los visitantes nuestra web. Solo lo hacemos si nos das tu consentimiento.',
      meer: 'Lee nuestra política de privacidad', link: '/es/privacidad/',
      ja: 'Aceptar', nee: 'Rechazar'
    },
    de: {
      titel: 'Cookies',
      tekst: 'Wir verwenden Google Analytics, um zu verstehen, wie Besucher unsere Website nutzen. Das tun wir nur mit deiner Zustimmung.',
      meer: 'Lies unsere Datenschutzerklärung', link: '/de/datenschutz/',
      ja: 'Akzeptieren', nee: 'Ablehnen'
    }
  };
  var taal = (document.documentElement.lang || 'nl').slice(0, 2);
  var t = TEKST[taal] || TEKST.nl;

  function leesKeuze() { try { return localStorage.getItem(SLEUTEL); } catch (e) { return null; } }
  function bewaarKeuze(v) { try { localStorage.setItem(SLEUTEL, v); } catch (e) {} }

  function laadAnalytics() {
    if (window.__gaGeladen) return;
    window.__gaGeladen = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  function verwijderAnalyticsCookies() {
    var domein = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var naam = c.split('=')[0].trim();
      if (/^_ga/.test(naam)) {
        document.cookie = naam + '=; Max-Age=0; path=/';
        document.cookie = naam + '=; Max-Age=0; path=/; domain=.' + domein;
      }
    });
  }

  function sluit() {
    var b = document.getElementById('cookiemelding');
    if (b) b.remove();
  }

  function toonMelding() {
    sluit();
    var b = document.createElement('div');
    b.id = 'cookiemelding';
    b.className = 'cookiemelding';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-live', 'polite');
    b.setAttribute('aria-label', t.titel);
    b.innerHTML =
      '<p><strong>' + t.titel + '</strong> ' + t.tekst +
      ' <a href="' + t.link + '">' + t.meer + '</a>.</p>' +
      '<div class="cookieknoppen">' +
      '<button type="button" class="knop" data-keuze="nee">' + t.nee + '</button>' +
      '<button type="button" class="knop" data-keuze="ja">' + t.ja + '</button>' +
      '</div>';
    b.addEventListener('click', function (e) {
      var knop = e.target.closest('[data-keuze]');
      if (!knop) return;
      var keuze = knop.getAttribute('data-keuze');
      var vorige = leesKeuze();
      bewaarKeuze(keuze);
      sluit();
      if (keuze === 'ja') {
        laadAnalytics();
      } else {
        verwijderAnalyticsCookies();
        // Analytics was al actief: pagina herladen zodat het echt stopt
        if (vorige === 'ja') location.reload();
      }
    });
    document.body.appendChild(b);
  }

  // Link "Cookie-instellingen" in de footer
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-instellingen]')) {
      e.preventDefault();
      toonMelding();
    }
  });

  var keuze = leesKeuze();
  if (keuze === 'ja') laadAnalytics();
  else if (!keuze) {
    if (document.body) toonMelding();
    else document.addEventListener('DOMContentLoaded', toonMelding);
  }
})();
