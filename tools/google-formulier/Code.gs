/* Contactformulier Co Working Cómpeta → Google Sheet + e-mail
   ---------------------------------------------------------------
   Dit script hoort bij een Google Sheet (Extensies → Apps Script).
   - Elk bericht van het websiteformulier komt als nieuwe regel in het tabblad "Berichten".
   - Er gaat meteen een e-mail naar ONTVANGER (antwoorden gaat rechtstreeks naar de afzender).
   - Berichten ouder dan BEWAAR_MAANDEN worden elke nacht automatisch verwijderd (privacy).

   Eenmalig: kies bovenin de functie "installeer" en klik op Uitvoeren (geeft toestemming
   en zet de nachtelijke opruimtaak aan). Daarna: Implementeren → Nieuwe implementatie → Web-app. */

var ONTVANGER = 'info@coworkingcompeta.com';
var BEWAAR_MAANDEN = 12;
var TABBLAD = 'Berichten';
var KOLOMMEN = ['Datum', 'Taal', 'Pagina', 'Naam', 'E-mail', 'Telefoon', 'Bedrijf / website', 'Bericht'];

// Ontvangt het formulier van de website
function doPost(e) {
  var p = (e && e.parameter) || {};

  // Verborgen veld ingevuld = spambot: doen alsof het gelukt is, niets opslaan
  if (p._honey) return antwoord({ ok: true });

  var naam = schoon(p.naam, 200);
  var email = schoon(p.email, 200);
  if (!naam || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return antwoord({ ok: false, fout: 'ongeldig' });
  }

  var gegevens = {
    taal: schoon(p.taal, 5),
    pagina: schoon(p.pagina, 300),
    naam: naam,
    email: email,
    telefoon: schoon(p.telefoon, 50),
    bedrijf: schoon(p.bedrijf, 300),
    bericht: schoon(p.bericht, 5000)
  };

  // 1. Opslaan in de spreadsheet (slot voorkomt dat twee berichten tegelijk botsen)
  var slot = LockService.getScriptLock();
  slot.waitLock(10000);
  try {
    blad().appendRow([new Date(), gegevens.taal, gegevens.pagina, veiligVoorSheet(naam), veiligVoorSheet(email),
      veiligVoorSheet(gegevens.telefoon), veiligVoorSheet(gegevens.bedrijf), veiligVoorSheet(gegevens.bericht)]);
  } finally {
    slot.releaseLock();
  }

  // 2. E-mail sturen. Lukt dat niet, dan staat het bericht in ieder geval al in de spreadsheet.
  try {
    stuurMail(schoon(p._subject, 150) || 'Nieuwe aanvraag via coworkingcompeta.com', gegevens);
  } catch (fout) {
    console.error('Mail versturen mislukt: ' + fout);
  }

  return antwoord({ ok: true });
}

// Openen van de web-app-link in de browser: laat zien dat het script werkt
function doGet() {
  return ContentService.createTextOutput('Formulier-ontvanger Co Working Cómpeta is actief.');
}

// Eenmalig uitvoeren: maakt het tabblad aan en zet de nachtelijke opruimtaak aan
function installeer() {
  blad();
  var bestaat = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === 'opruimen';
  });
  if (!bestaat) {
    ScriptApp.newTrigger('opruimen').timeBased().everyDays(1).atHour(3).create();
  }
  opruimen();
}

// Verwijdert berichten die ouder zijn dan BEWAAR_MAANDEN
function opruimen() {
  var sheet = blad();
  var laatste = sheet.getLastRow();
  if (laatste < 2) return;
  var grens = new Date();
  grens.setMonth(grens.getMonth() - BEWAAR_MAANDEN);
  var datums = sheet.getRange(2, 1, laatste - 1, 1).getValues();
  // Van onder naar boven, zodat regelnummers niet verschuiven
  for (var i = datums.length - 1; i >= 0; i--) {
    var d = datums[i][0];
    if (d instanceof Date && d < grens) sheet.deleteRow(i + 2);
  }
}

function blad() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(TABBLAD);
  if (!sheet) {
    sheet = ss.insertSheet(TABBLAD);
    sheet.appendRow(KOLOMMEN);
    sheet.getRange(1, 1, 1, KOLOMMEN.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('dd-mm-yyyy hh:mm');
  }
  return sheet;
}

function stuurMail(onderwerp, g) {
  var rijen = [
    ['Naam', g.naam], ['E-mail', g.email], ['Telefoon', g.telefoon],
    ['Bedrijf / website', g.bedrijf], ['Bericht', g.bericht],
    ['Taal', g.taal], ['Pagina', g.pagina]
  ];
  var html = '<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
    rijen.map(function (r) {
      return '<tr><th align="left" valign="top" style="background:#F1F1F1">' + r[0] + '</th><td>' +
        html_(r[1]).replace(/\n/g, '<br>') + '</td></tr>';
    }).join('') + '</table>' +
    '<p style="font-family:Arial,sans-serif;font-size:12px;color:#777">Dit bericht staat ook in de Google Sheet "' +
    html_(SpreadsheetApp.getActiveSpreadsheet().getName()) + '".</p>';
  MailApp.sendEmail({
    to: ONTVANGER,
    replyTo: g.email,
    name: 'Website Co Working Cómpeta',
    subject: onderwerp,
    htmlBody: html
  });
}

function antwoord(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function schoon(waarde, max) {
  return String(waarde || '').trim().slice(0, max);
}

// Voorkomt dat tekst die met = + - @ begint als formule wordt uitgevoerd in de spreadsheet
function veiligVoorSheet(tekst) {
  return /^[=+\-@]/.test(tekst) ? "'" + tekst : tekst;
}

function html_(tekst) {
  return String(tekst || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
