/**
 * Backend del taller en vivo (soyleoai.com/taller) — Google Apps Script pegado en una Google Sheet.
 *
 * - Paso 1 del formulario: guarda la inscripción en la hoja "Inscriptos" y manda la confirmación.
 * - Paso 2: completa el perfil de la misma fila (busca por id) y calcula destino y prioridad.
 * - Recordatorios automáticos: el día anterior y ~1 hora antes (este último con el link del Meet).
 *
 * Puesta en marcha (una sola vez):
 *  1. Crear una Google Sheet nueva → Extensiones → Apps Script → pegar este archivo.
 *  2. Completar MEET_LINK (podés hacerlo después, pero antes del 30/10 a las 17:30 h).
 *  3. Ejecutar `probarEmails` → te llegan los 3 emails de ejemplo a AVISO_EMAIL (autorizá los permisos).
 *  4. Ejecutar `programarRecordatorios` → crea los 2 envíos automáticos.
 *  5. Implementar → Nueva implementación → Aplicación web → Ejecutar como: yo · Acceso: cualquier usuario.
 *     Copiar la URL (termina en /exec) y pegarla en ENDPOINT de taller/taller.js.
 */
const MEET_LINK = '';                        // https://meet.google.com/xxx-xxxx-xxx
const AVISO_EMAIL = 'leodiazdt@gmail.com';   // alertas (falta el Meet, cupo de emails agotado)
const INICIO = new Date('2026-10-30T22:00:00Z');   // viernes 30/10, 19 h Argentina
const ENVIO_24H = new Date('2026-10-29T22:00:00Z'); // jueves 29/10, 19 h Argentina
const ENVIO_1H = new Date('2026-10-30T20:45:00Z');  // 17:45 h Argentina (Google lo dispara dentro de los 15 min siguientes)
const CALENDARIO = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  + '&text=' + encodeURIComponent('Taller en vivo: IA para arquitectos (SoyLeo AI)')
  + '&dates=20261030T220000Z/20261031T000000Z'
  + '&details=' + encodeURIComponent('Taller gratuito por Google Meet. El link de acceso te llega por email 1 hora antes.');
// Qué tienen que tener listo (va en el recordatorio del día anterior). Editalo a gusto.
const PREPARACION = [
  'Conectate desde la compu (no desde el celular): vamos a trabajar en vivo.',
  'Una conexión estable y, si podés, auriculares.',
  'Una cuenta gratuita en claude.ai ya creada, para no perder tiempo en el registro.'
];

const COLUMNAS = [
  'fecha', 'id', 'nombre', 'email', 'whatsapp', 'pais', 'tz', 'consentimiento',
  'perfil', 'equipo', 'stack', 'stack_otros', 'objetivo', 'nivel_ia', 'quiere_llamada',
  'destino', 'prioridad',
  'confirmacion', 'recordatorio_24h', 'recordatorio_1h', 'asistio',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid', 'pagina'
];
const PASO1 = ['nombre', 'email', 'whatsapp', 'pais', 'tz', 'consentimiento',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid', 'pagina'];
const PASO2 = ['perfil', 'equipo', 'stack', 'stack_otros', 'objetivo', 'nivel_ia', 'quiere_llamada'];

const ZONAS = {
  'Argentina': 'America/Argentina/Buenos_Aires', 'México': 'America/Mexico_City', 'Colombia': 'America/Bogota',
  'Chile': 'America/Santiago', 'Perú': 'America/Lima', 'Uruguay': 'America/Montevideo',
  'Paraguay': 'America/Asuncion', 'Bolivia': 'America/La_Paz', 'Ecuador': 'America/Guayaquil',
  'Venezuela': 'America/Caracas', 'Costa Rica': 'America/Costa_Rica', 'Panamá': 'America/Panama',
  'Guatemala': 'America/Guatemala', 'República Dominicana': 'America/Santo_Domingo',
  'España': 'Europe/Madrid', 'Estados Unidos': 'America/New_York'
};

// ---------------------------------------------------------------- formulario

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return ok_(); // honeypot
    const sh = getSheet_();
    if (String(d.etapa) === '1') inscribir_(sh, d);
    else if (String(d.etapa) === '2') completarPerfil_(sh, d);
    return ok_();
  } finally {
    lock.releaseLock();
  }
}

function inscribir_(sh, d) {
  d.email = String(d.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || !d.nombre) return;
  // Si ya estaba inscripto (mismo email), se actualiza su fila y no se repite la confirmación
  let fila = buscarFila_(sh, 'email', d.email);
  if (fila) {
    escribir_(sh, fila, Object.assign(pick_(d, PASO1), { id: d.id }));
  } else {
    sh.appendRow(COLUMNAS.map(c => c === 'fecha' ? new Date() : (c === 'id' || PASO1.includes(c)) ? celda_(String(d[c] || '')) : ''));
    fila = sh.getLastRow();
  }
  if (!leer_(sh, fila).confirmacion && enviar_(d.email, ...emailConfirmacion_(leer_(sh, fila))))
    escribir_(sh, fila, { confirmacion: new Date() });
}

function completarPerfil_(sh, d) {
  const fila = buscarFila_(sh, 'id', d.id) || buscarFila_(sh, 'email', String(d.email || '').trim().toLowerCase());
  if (!fila) return;
  const p = Object.fromEntries(PASO2.map(c => [c, celda_(String(d[c] || ''))])); // pisa también lo que quedó vacío
  const empresa = ['Estudio o empresa', 'Constructora / MMO'].includes(p.perfil) || ['6-15', '+15'].includes(p.equipo);
  p.destino = p.perfil === 'Estudiante' ? 'estudiante' : empresa ? 'diagnóstico empresa' : 'curso';
  let score = 0;
  if (p.quiere_llamada === 'si') score += 3;
  if (empresa) score += 2;
  if (['2-5', '6-15', '+15'].includes(p.equipo)) score += 1;
  if (/Seguido|automatizo/.test(p.nivel_ia || '')) score += 1;
  p.prioridad = score >= 4 ? 'alta' : score >= 2 ? 'media' : 'baja';
  escribir_(sh, fila, p);
}

// ---------------------------------------------------------------- recordatorios

function programarRecordatorios() {
  ScriptApp.getProjectTriggers()
    .filter(t => ['enviarRecordatorio24h', 'enviarRecordatorio1h'].includes(t.getHandlerFunction()))
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('enviarRecordatorio24h').timeBased().at(ENVIO_24H).create();
  ScriptApp.newTrigger('enviarRecordatorio1h').timeBased().at(ENVIO_1H).create();
  Logger.log('Recordatorios programados: %s y %s', ENVIO_24H, ENVIO_1H);
}

function enviarRecordatorio24h() { envioMasivo_('recordatorio_24h', emailRecordatorio24h_); }

function enviarRecordatorio1h() {
  if (!/^https:\/\/meet\.google\.com\//.test(MEET_LINK)) {
    MailApp.sendEmail(AVISO_EMAIL, '⚠️ Taller: falta el link del Meet',
      'El recordatorio de 1 hora antes NO salió porque MEET_LINK está vacío.\n'
      + 'Pegalo en el Apps Script, guardá y ejecutá a mano la función enviarRecordatorio1h.');
    return;
  }
  envioMasivo_('recordatorio_1h', emailRecordatorio1h_);
}

// Manda a todos los inscriptos que aún no lo recibieron (se puede re-ejecutar sin duplicar).
function envioMasivo_(columna, plantilla) {
  const sh = getSheet_();
  const pendientes = [];
  for (let fila = 2; fila <= sh.getLastRow(); fila++) {
    const r = leer_(sh, fila);
    if (!r.email || r[columna]) continue;
    if (MailApp.getRemainingDailyQuota() <= 1) { pendientes.push(r.email); continue; }
    if (enviar_(r.email, ...plantilla(r))) escribir_(sh, fila, { [columna]: new Date() });
  }
  if (pendientes.length) {
    MailApp.sendEmail(AVISO_EMAIL, `⚠️ Taller: ${pendientes.length} emails sin enviar (${columna})`,
      'Se agotó el cupo diario de emails de Google. Mandalos a mano desde Gmail en CCO:\n\n' + pendientes.join(', '));
  }
}

// ---------------------------------------------------------------- emails

function emailConfirmacion_(r) {
  return ['Tu lugar en el taller está reservado ✓', plantilla_(r, `
    <p>¡Listo! Tu lugar en el <b>taller en vivo de IA para arquitectos</b> está reservado.</p>
    <p style="font-size:17px"><b>${cuando_(r)}</b><br>Por Google Meet · dura unas 2 horas</p>
    ${boton_(CALENDARIO, 'Agregar a mi calendario')}
    <p><b>Lo que vamos a hacer:</b></p>
    <ol>
      <li>Clase rápida: qué es la IA, qué no es y por qué inventa.</li>
      <li>Construimos juntos una skill de presupuestos.</li>
      <li>La metemos en un flujo de trabajo.</li>
      <li>Revit + Claude: le pedís algo en castellano y Revit lo hace.</li>
    </ol>
    <p>El link de acceso te llega <b>por este email, 1 hora antes</b>. El día anterior te mando un recordatorio con lo que conviene tener listo.</p>`)];
}

function emailRecordatorio24h_(r) {
  return ['Mañana: taller en vivo de IA para arquitectos', plantilla_(r, `
    <p>Te recuerdo que <b>mañana</b> es el taller:</p>
    <p style="font-size:17px"><b>${cuando_(r)}</b> · Google Meet</p>
    <p><b>Para aprovecharlo al máximo:</b></p>
    <ul>${PREPARACION.map(p => `<li>${p}</li>`).join('')}</ul>
    <p>Mañana, 1 hora antes, te llega el link para entrar.</p>`)];
}

function emailRecordatorio1h_(r) {
  return ['En 1 hora empezamos: acá está tu link', plantilla_(r, `
    <p>En una hora arrancamos el taller (<b>${cuando_(r)}</b>).</p>
    ${boton_(MEET_LINK, 'Entrar al taller')}
    <p style="font-size:13px;color:#555">Si el botón no funciona, copiá este link: ${MEET_LINK}</p>
    <p>Entrá unos minutos antes, desde la compu. Arrancamos puntual.</p>`)];
}

function plantilla_(r, cuerpo) {
  const nombre = String(r.nombre || '').split(' ')[0];
  return `
    <div style="font-family:Arial,sans-serif;max-width:520px;color:#111;line-height:1.5">
      <p>Hola ${nombre},</p>
      ${cuerpo}
      <p>Si tenés alguna duda, respondé este mail.</p>
      <p>Leo<br><span style="color:#777">Arq. Leonardo Díaz · SoyLeo AI · @soy.leo_ai</span></p>
      <p style="font-size:11px;color:#999">Recibís este correo porque te inscribiste al taller en soyleoai.com. Si no querés recibir más emails, respondé “BAJA”.</p>
    </div>`;
}

function boton_(url, texto) {
  return `<p><a href="${url}" style="background:#C4981F;color:#000;padding:12px 20px;text-decoration:none;font-weight:bold;display:inline-block">${texto}</a></p>`;
}

// "Viernes 30/10, 19:00 h (Argentina)" + la hora local si es distinta
function cuando_(r) {
  const ar = 'Viernes 30/10, 19:00 h (hora de Argentina)';
  let tz = String(r.tz || '');
  if (!/^[A-Za-z]+\/[A-Za-z_\/+-]+$/.test(tz)) tz = ZONAS[r.pais] || '';
  if (!tz) return ar;
  const local = Utilities.formatDate(INICIO, tz, "dd/MM, HH:mm");
  if (local === '30/10, 19:00') return ar;
  return `${ar}<br><span style="font-weight:normal">En tu hora: ${local} h</span>`;
}

function enviar_(to, asunto, html) {
  try {
    MailApp.sendEmail({ to, subject: asunto, htmlBody: html, name: 'Leo · SoyLeo AI' });
    return true;
  } catch (err) {
    console.error('No se pudo enviar a ' + to + ': ' + err);
    return false;
  }
}

// Te manda los 3 emails con datos de ejemplo para revisarlos.
function probarEmails() {
  const r = { nombre: 'Leo Prueba', pais: 'México', tz: 'America/Mexico_City' };
  [emailConfirmacion_, emailRecordatorio24h_, emailRecordatorio1h_].forEach(f => {
    const [asunto, html] = f(r);
    enviar_(AVISO_EMAIL, '[PRUEBA] ' + asunto, html);
  });
}

// ---------------------------------------------------------------- hoja

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Inscriptos');
  if (!sh) {
    sh = ss.insertSheet('Inscriptos');
    sh.appendRow(COLUMNAS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function buscarFila_(sh, columna, valor) {
  if (!valor || sh.getLastRow() < 2) return 0;
  const col = COLUMNAS.indexOf(columna) + 1;
  const vals = sh.getRange(2, col, sh.getLastRow() - 1, 1).getValues();
  for (let i = vals.length - 1; i >= 0; i--) {
    if (String(vals[i][0]).trim().toLowerCase() === String(valor).trim().toLowerCase()) return i + 2;
  }
  return 0;
}

function leer_(sh, fila) {
  const v = sh.getRange(fila, 1, 1, COLUMNAS.length).getValues()[0];
  return Object.fromEntries(COLUMNAS.map((c, i) => [c, v[i]]));
}

function escribir_(sh, fila, datos) {
  Object.keys(datos).forEach(c => {
    const col = COLUMNAS.indexOf(c) + 1;
    if (col) sh.getRange(fila, col).setValue(datos[c]);
  });
}

// Un texto que empieza con + = - @ la Sheet lo toma como fórmula (ej. el WhatsApp "+54 9…")
function celda_(v) {
  return typeof v === 'string' && /^[+=\-@]/.test(v) ? "'" + v : v;
}

function pick_(d, campos) {
  return Object.fromEntries(campos.filter(c => d[c] !== undefined && d[c] !== '').map(c => [c, celda_(String(d[c]))]));
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
