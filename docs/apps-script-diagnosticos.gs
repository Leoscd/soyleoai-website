/**
 * Backend de los diagnósticos por empresa — Google Apps Script pegado en una Google Sheet.
 *
 * Cada empresa y etapa tiene un link con un código secreto: soyleoai.com/diagnostico/<código>.
 * Los códigos viven SOLO en la pestaña "Empresas" de esta Sheet (privada). La web no tiene la lista:
 * le pregunta a este script por un código y recibe únicamente los datos de ese código. Así nadie
 * puede cambiar la URL para entrar al formulario de otra empresa ni cargar respuestas en su pestaña.
 *
 * Cada respuesta va a la pestaña "<empresa> · <etapa>" (por ejemplo "saez-sanchez · inicial").
 * La pestaña se crea sola con la primera respuesta, y si el formulario suma preguntas nuevas
 * se agregan las columnas al final.
 *
 * Instalación (una sola vez):
 *   1. Creá una Google Sheet nueva llamada "Diagnósticos SoyLeo AI".
 *   2. Extensiones → Apps Script. Borrá lo que haya, pegá este archivo y guardá.
 *   3. Arriba, elegí la función "configurar" y tocá Ejecutar. Aceptá los permisos.
 *      Crea la pestaña "Empresas" con Sáez Sánchez (inicial y final) y sus links.
 *   4. Implementar → Nueva implementación → tipo "Aplicación web".
 *      Ejecutar como: Yo. Quién tiene acceso: Cualquier persona.
 *   5. Copiá la URL que termina en /exec y pegala en diagnostico/_assets/config.js (ENDPOINT).
 * Si después cambiás este código: Implementar → Gestionar implementaciones → editar → Versión nueva.
 *
 * Sumar una empresa: en la pestaña "Empresas" agregá dos filas (una "inicial" y una "final") con
 * empresa, nombre, etapa, abierta y áreas, y usá el menú Diagnósticos → Generar links faltantes.
 * Cerrar un formulario: destildá "abierta". No hace falta tocar la web ni volver a implementar.
 */
const AVISO_EMAIL = 'leodiazdt@gmail.com'; // te avisa de cada respuesta. Vacío = sin aviso
const SITIO = 'https://soyleoai.com/diagnostico/';
const HOJA_EMPRESAS = 'Empresas';
const CABECERA = ['codigo', 'empresa', 'nombre', 'etapa', 'abierta', 'areas', 'link'];
const PRIMERAS = ['fecha', 'empresa', 'empresa_nombre', 'etapa', 'nombre', 'email', 'area', 'puesto'];
const IGNORAR = ['website', 'codigo'];

// ---------- web ----------

// La página pide los datos de su código: ?t=<código>. Devuelve solo esa empresa y etapa.
function doGet(e) {
  const t = e && e.parameter && e.parameter.t;
  if (!t) return json_({ ok: true, servicio: 'Diagnósticos SoyLeo AI' });
  const f = buscar_(t);
  if (!f) return json_({ ok: false, error: 'no_existe' });
  if (!f.abierta) return json_({ ok: false, error: 'cerrado' });
  return json_({ ok: true, nombre: f.nombre, etapa: f.etapa, areas: f.areas });
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.website) return json_({ ok: true }); // honeypot

  // La empresa y la etapa salen del código, nunca de lo que manda el navegador.
  const f = buscar_(d.codigo);
  if (!f || !f.abierta) return json_({ ok: false });
  d.empresa = f.empresa;
  d.empresa_nombre = f.nombre;
  d.etapa = f.etapa;
  d.fecha = new Date();

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  let columnas;
  try {
    const hoja = hoja_(`${f.empresa} · ${f.etapa}`);
    columnas = columnas_(hoja, d);
    hoja.appendRow(columnas.map(c => (c in d ? limpiar_(d[c]) : '')));
  } finally {
    lock.releaseLock();
  }

  if (AVISO_EMAIL) {
    MailApp.sendEmail(AVISO_EMAIL,
      `Nueva respuesta · ${f.nombre} (${f.etapa}): ${d.nombre || ''}`,
      columnas.filter(c => c in d).map(c => `${c}: ${d[c]}`).join('\n'));
  }
  return json_({ ok: true });
}

// ---------- empresas y códigos ----------

function buscar_(codigo) {
  const c = String(codigo || '').trim().toLowerCase();
  if (!/^[a-z0-9]{16}$/.test(c)) return null;
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_EMPRESAS);
  if (!hoja || hoja.getLastRow() < 2) return null;
  const fila = hoja.getRange(2, 1, hoja.getLastRow() - 1, CABECERA.length).getValues()
    .find(r => String(r[0]).trim().toLowerCase() === c);
  if (!fila) return null;
  return {
    empresa: slug_(fila[1]),
    nombre: String(fila[2]).trim(),
    etapa: String(fila[3]).trim().toLowerCase() === 'final' ? 'final' : 'inicial',
    abierta: fila[4] === true || String(fila[4]).toUpperCase() === 'TRUE',
    areas: String(fila[5]).split(',').map(s => s.trim()).filter(Boolean),
  };
}

// Crea la pestaña "Empresas" con Sáez Sánchez y genera sus links. Correrla una sola vez.
function configurar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(HOJA_EMPRESAS);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_EMPRESAS, 0);
    hoja.getRange(1, 1, 1, CABECERA.length).setValues([CABECERA]).setFontWeight('bold');
    hoja.setFrozenRows(1);
    const areas = 'Gerencia, Gestión de Obras, Gestión Administrativa, Gestión de Proyectos, Desarrollo de Proyectos, Dirección Técnica';
    hoja.getRange(2, 2, 2, 5).setValues([
      ['saez-sanchez', 'Sáez Sánchez', 'inicial', true, areas],
      ['saez-sanchez', 'Sáez Sánchez', 'final', false, areas],
    ]);
    hoja.getRange('E2:E').insertCheckboxes();
    hoja.setColumnWidth(6, 420);
    hoja.setColumnWidth(7, 380);
  }
  generarLinks();
}

// Pone un código nuevo a cada fila que no tenga, y arma su link.
function generarLinks() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_EMPRESAS);
  if (!hoja || hoja.getLastRow() < 2) return;
  const n = hoja.getLastRow() - 1;
  const datos = hoja.getRange(2, 1, n, CABECERA.length).getValues();
  datos.forEach(r => {
    if (!String(r[1]).trim()) return; // fila sin empresa
    if (!/^[a-z0-9]{16}$/.test(String(r[0]).trim())) r[0] = codigo_();
    r[6] = SITIO + r[0];
  });
  hoja.getRange(2, 1, n, CABECERA.length).setValues(datos);
  hoja.getRange('E2:E').insertCheckboxes();
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Diagnósticos')
    .addItem('Generar links faltantes', 'generarLinks')
    .addToUi();
}

// 16 caracteres al azar (a-z, 0-9): unos 82 bits, imposible de adivinar probando.
function codigo_() {
  const abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid() + Math.random() + Date.now());
  return bytes.slice(0, 16).map(b => abc[(b + 256) % abc.length]).join('');
}

// ---------- hojas de respuestas ----------

function hoja_(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(nombre) || ss.insertSheet(nombre);
}

// Devuelve las columnas de la hoja, agregando al final las que la respuesta trae y la hoja no tiene.
function columnas_(hoja, d) {
  const actuales = hoja.getLastColumn()
    ? hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(String)
    : [];
  const deseadas = PRIMERAS.concat(Object.keys(d).filter(k => !PRIMERAS.includes(k) && !IGNORAR.includes(k)));
  const nuevas = deseadas.filter(k => !actuales.includes(k));
  if (!nuevas.length) return actuales;
  const todas = actuales.concat(nuevas);
  hoja.getRange(1, actuales.length + 1, 1, nuevas.length).setValues([nuevas]);
  hoja.getRange(1, 1, 1, todas.length).setFontWeight('bold');
  hoja.setFrozenRows(1);
  return todas;
}

// Evita que un texto que empieza con = + - @ se interprete como fórmula, y corta textos enormes.
function limpiar_(v) {
  if (v instanceof Date || typeof v === 'number') return v;
  const s = String(v == null ? '' : v).slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function slug_(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
