/**
 * Encuesta de resultados de alumnos — Google Apps Script pegado en la Sheet
 * "Encuesta alumnos SoyLeo AI" (Extensiones → Apps Script).
 *
 * Guarda cada respuesta en la primera hoja, ubicando cada dato según el nombre de la
 * columna de la fila 1. Si llega un campo que no tiene columna (una pregunta nueva),
 * la crea sola al final. No manda emails.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return ok_(); // honeypot anti-bots
    delete d.website;

    d.fecha = new Date();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const columnas = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0]
      .filter(String);
    const nuevas = Object.keys(d).filter(k => /^[a-z_]+$/.test(k) && !columnas.includes(k));
    if (nuevas.length) {
      sheet.getRange(1, columnas.length + 1, 1, nuevas.length).setValues([nuevas]);
      columnas.push(...nuevas);
    }
    sheet.appendRow(columnas.map(c => limpiar_(d[c])));
    return ok_();
  } finally {
    lock.releaseLock();
  }
}

// Evita que un texto que empieza con = + - @ se interprete como fórmula
function limpiar_(v) {
  if (v === undefined || v === null) return '';
  if (v instanceof Date) return v;
  const s = String(v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
