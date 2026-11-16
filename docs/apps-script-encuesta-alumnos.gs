/**
 * Encuesta de resultados de alumnos — Google Apps Script pegado en la Sheet
 * "Encuesta alumnos SoyLeo AI" (Extensiones → Apps Script).
 *
 * Guarda cada respuesta en la primera hoja, ubicando cada dato según el nombre de la
 * columna de la fila 1. Si agregás una columna nueva con el nombre de un campo del
 * formulario, se empieza a llenar sola. No manda emails.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return ok_(); // honeypot anti-bots

    d.fecha = new Date();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const columnas = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
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
