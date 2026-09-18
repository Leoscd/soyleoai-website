/**
 * Backend del formulario — Google Apps Script pegado en una Google Sheet.
 * Guarda cada lead en la hoja "Leads", calcula un segmento/score y manda la guía por email.
 *
 * Configurá PDF_LINK con un link público (Drive "cualquiera con el link" o la URL del PDF en tu subdominio).
 */
// El PDF de cada recurso vive en https://soyleoai.com/recursos/archivos/<recurso>.pdf
// (lo copia ahí el script nuevo-recurso.py). No hay que tocar nada al agregar un recurso.
const PDF_BASE = 'https://soyleoai.com/recursos/archivos/';
const AVISO_EMAIL = 'leodiazdt@gmail.com'; // te avisa de leads calientes. Vacío = sin aviso

const COLUMNAS = [
  'fecha', 'nombre', 'email', 'whatsapp', 'pais', 'ciudad',
  'perfil', 'equipo', 'nivel_ia', 'dolor', 'software',
  'preferencia', 'inversion_capacitacion', 'inversion_sistema', 'plazo',
  'quiere_llamada', 'origen', 'consentimiento',
  'segmento', 'score',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid', 'recurso', 'pagina'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return ok_(); // honeypot

    d.fecha = new Date();
    const s = scoreLead_(d);
    d.segmento = s.segmento;
    d.score = s.score;

    const sheet = getSheet_();
    sheet.appendRow(COLUMNAS.map(c => d[c] || ''));

    enviarGuia_(d);
    if (AVISO_EMAIL && s.score >= 7) {
      MailApp.sendEmail(AVISO_EMAIL, `🔥 Lead caliente: ${d.nombre} (${d.pais})`,
        COLUMNAS.map(c => `${c}: ${d[c] || ''}`).join('\n'));
    }
    return ok_();
  } finally {
    lock.releaseLock();
  }
}

function scoreLead_(d) {
  let score = 0;
  const sis = { '<1000': 1, '1000-2000': 2, '2000-3000': 3, '3000+': 4 }[d.inversion_sistema] || 0;
  const cap = { '<300': 1, '300-500': 2, '500-800': 3, '800+': 4 }[d.inversion_capacitacion] || 0;
  score += Math.max(sis, cap);
  score += { 'Este mes': 3, '1-3 meses': 2, '+3 meses': 0, 'Sin fecha': 0 }[d.plazo] || 0;
  if (d.quiere_llamada === 'si') score += 2;
  if (['2-5', '6-15', '+15'].includes(d.equipo)) score += 1;

  let segmento = 'explorador';
  if (d.preferencia === 'Contratarlos armados') segmento = 'cliente-sistema';
  else if (d.preferencia === 'Aprender a armarlos') segmento = 'alumno';
  else if (d.preferencia === 'Ambas') segmento = 'cliente-sistema+alumno';
  return { score, segmento };
}

function enviarGuia_(d) {
  const nombre = (d.nombre || '').split(' ')[0];
  const titulo = d.titulo || 'Armá tu propia Skill de Presupuestos';
  const link = PDF_BASE + (d.recurso || 'presupuestos') + '.pdf';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;color:#111">
      <p>Hola ${nombre},</p>
      <p>Acá tenés tu guía <b>“${titulo}”</b>:</p>
      <p><a href="${link}" style="background:#C4981F;color:#000;padding:12px 20px;text-decoration:none;font-weight:bold;display:inline-block">Descargar la guía</a></p>
      <p>Si te trabás en algún paso, respondé este mail y te doy una mano.</p>
      <p>Leo<br><span style="color:#777">Arq. Leonardo Díaz · SoyLeo AI · @soy.leo_ai</span></p>
      <p style="font-size:11px;color:#999">Recibís este correo porque lo pediste en soyleoai.com. Si no querés recibir más emails, respondé “BAJA”.</p>
    </div>`;
  MailApp.sendEmail({ to: d.email, subject: 'Tu guía: ' + titulo, htmlBody: html, name: 'Leo · SoyLeo AI' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Leads');
  if (!sh) {
    sh = ss.insertSheet('Leads');
    sh.appendRow(COLUMNAS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
