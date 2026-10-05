// Diagnóstico de procesos e IA — un formulario por empresa.
// Cada empresa y etapa tiene un link con un código secreto: /diagnostico/<código de 16 caracteres>.
// La web NO tiene la lista de empresas: le pregunta al Apps Script por este código y recibe solo
// el nombre, la etapa y las áreas de ese código. Los códigos se manejan en la pestaña "Empresas"
// de la Google Sheet (ver docs/apps-script-diagnosticos.gs).
// En local, sin las reescrituras de Vercel: /diagnostico/_form/?t=<código>
(async () => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clave = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const OTRA = 'Otra';

  function aviso(titulo, texto) {
    $('cargando').classList.add('hidden');
    document.querySelector('.jump').classList.add('hidden');
    $('avisoTitulo').textContent = titulo;
    $('avisoTexto').textContent = texto;
    $('aviso').classList.remove('hidden');
  }

  // ---- código del link ----
  const partes = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const codigo = ((partes[1] === '_form' ? new URLSearchParams(location.search).get('t') : partes[1]) || '').trim().toLowerCase();
  const NO_EXISTE = ['No encontramos este diagnóstico', 'Revisá que el link esté completo o pedíselo de nuevo a quien te lo mandó.'];
  if (!/^[a-z0-9]{16}$/.test(codigo) || partes.length > 2 && partes[1] !== '_form') return aviso(...NO_EXISTE);

  const ENDPOINT = window.CONFIG_DIAG && window.CONFIG_DIAG.ENDPOINT;
  if (!ENDPOINT) return aviso('El formulario todavía no está disponible', 'Avisale a quien te mandó el link.');

  let empresa;
  try {
    empresa = await (await fetch(`${ENDPOINT}?t=${codigo}`, { cache: 'no-store' })).json();
  } catch (e) {
    console.error(e);
    return aviso('No se pudo cargar el formulario', 'Revisá tu conexión y volvé a abrir el link.');
  }
  if (!empresa.ok && empresa.error === 'cerrado') return aviso('Este diagnóstico no está abierto', 'Gracias por tu tiempo. Si creés que es un error, avisale a quien te mandó el link.');
  if (!empresa.ok) return aviso(...NO_EXISTE);
  const etapa = empresa.etapa === 'final' ? 'final' : 'inicial';

  // ---- opciones comunes ----
  const AREAS = empresa.areas || [];
  const PORCENTAJE = ['Menos del 10 %', '10 a 25 %', '25 a 50 %', '50 a 75 %', 'Más del 75 %'];
  const HORAS_SEMANA = ['Menos de 1 h', '1 a 3 h', '3 a 6 h', '6 a 10 h', 'Más de 10 h'];
  const USO_IA = ['Nunca la usé', 'La probé alguna vez', 'La uso algunas veces por semana', 'La uso todos los días'];
  const HERRAMIENTAS_IA = ['ChatGPT', 'Gemini', 'Microsoft Copilot', 'Claude', 'Generadores de imágenes', 'Ninguna'];
  const PROGRAMAS = ['AutoCAD', 'Revit', 'Excel / Google Sheets', 'Word / Google Docs', 'Software de presupuestos',
    'MS Project u otro de cronogramas', 'Email', 'WhatsApp', 'Google Drive / OneDrive'];
  const ENTREGABLES = ['Presupuesto de obra', 'Cómputo de materiales', 'Reporte o certificado de avance de obra',
    'Planos / documentación técnica', 'Informe, minuta o nota formal', 'Planilla de seguimiento o control'];
  const TIEMPOS = ['No lo hago', 'Menos de 1 h', '1 a 4 h', 'Medio día a 1 día', '1 a 2 días', 'Más de 2 días'];

  // ---- preguntas (los id son las columnas de la Sheet) ----
  const sobreVos = (final) => [
    { id: 'nombre', tipo: 'texto', label: 'Nombre y apellido', req: true, auto: 'name' },
    { id: 'email', tipo: 'email', label: 'Email', req: true, auto: 'email',
      hint: final ? 'El mismo que usaste en el diagnóstico inicial.' : 'Usá el mismo email en la medición final, así comparamos tus resultados.' },
    { id: 'area', tipo: 'radio', label: '¿En qué área trabajás?', opciones: AREAS, otra: true, req: true, cols: 2 },
    { id: 'puesto', tipo: 'texto', label: '¿Cuál es tu puesto o rol?', req: true, ph: 'Ej.: jefe de obra, proyectista, administrativa' },
  ];
  const tiemposGrilla = (ahora) => ({
    id: 'tiempo', tipo: 'grilla', req: true, filas: ENTREGABLES, columnas: TIEMPOS,
    label: `¿Cuánto tiempo te lleva${ahora ? ' ahora' : ''} hacer cada uno de estos trabajos, de principio a fin?`,
    hint: 'Si no hacés alguno, elegí "No lo hago".' });
  const metricas = [
    { id: 'pct_repetitivo', tipo: 'radio', label: '¿Qué parte de tu semana se va en tareas manuales o repetitivas?', opciones: PORCENTAJE, req: true,
      hint: 'Copiar datos de un lado a otro, armar planillas, redactar lo mismo varias veces, rearmar documentos parecidos…' },
    { id: 'horas_buscando', tipo: 'radio', label: '¿Cuántas horas por semana pasás buscando información, archivos o pidiendo datos a otros?', opciones: HORAS_SEMANA, req: true, cols: 2 },
    { id: 'horas_corrigiendo', tipo: 'radio', label: '¿Cuántas horas por semana pasás corrigiendo errores o rehaciendo trabajo?', opciones: HORAS_SEMANA, req: true, cols: 2 },
  ];
  const frustracion = { id: 'frustracion', tipo: 'escala', label: '¿Cuánto te cansan o frustran las tareas repetitivas?', min: 1, max: 5, bajo: 'Nada', alto: 'Muchísimo', req: true };
  const comodidad = { id: 'comodidad_ia', tipo: 'escala', label: '¿Qué tan cómodo te sentís usando IA?', min: 1, max: 5, bajo: 'Nada cómodo', alto: 'Muy cómodo', req: true };

  const PASOS = etapa === 'inicial' ? [
    { titulo: 'Sobre vos', preguntas: [
      ...sobreVos(false),
      { id: 'antiguedad', tipo: 'radio', label: '¿Hace cuánto trabajás en la empresa?', opciones: ['Menos de 1 año', '1 a 3 años', '3 a 10 años', 'Más de 10 años'], req: true, cols: 2 },
      { id: 'trabaja_con', tipo: 'check', label: '¿Con quiénes trabajás más seguido?', opciones: AREAS.concat(['Clientes', 'Proveedores', 'Contratistas']), cols: 2 },
    ] },
    { titulo: 'Tu trabajo hoy', intro: 'Pensá en una semana normal de trabajo.', preguntas: [
      { id: 'tareas', tipo: 'parrafo', label: '¿Cuáles son tus principales tareas en una semana normal?', req: true },
      { id: 'programas', tipo: 'check', label: '¿Qué programas usás todos los días?', opciones: PROGRAMAS, otra: true, req: true, cols: 2 },
      ...metricas,
    ] },
    { titulo: 'Lo que más tiempo te lleva', intro: 'Esto es lo que vamos a volver a medir al final, así que tratá de ser preciso con las horas.', preguntas: [
      { id: 'tarea1', tipo: 'texto', label: '¿Cuál es la tarea manual que más tiempo te lleva?', req: true },
      { id: 'tarea1_horas', tipo: 'horas', label: '¿Cuántas horas por semana le dedicás?', req: true },
      { id: 'tarea2', tipo: 'texto', label: 'Otra tarea manual que te lleve mucho tiempo' },
      { id: 'tarea2_horas', tipo: 'horas', label: '¿Cuántas horas por semana le dedicás?' },
      { id: 'tarea3', tipo: 'texto', label: 'Una tercera tarea, si la hay' },
      { id: 'tarea3_horas', tipo: 'horas', label: '¿Cuántas horas por semana le dedicás?' },
      tiemposGrilla(false),
      frustracion,
    ] },
    { titulo: 'Inteligencia artificial', intro: 'No importa si nunca la usaste: también nos sirve saberlo.', preguntas: [
      { id: 'uso_ia', tipo: 'radio', label: '¿Usás inteligencia artificial en tu trabajo hoy?', opciones: USO_IA, req: true },
      { id: 'herramientas_ia', tipo: 'check', label: '¿Qué herramientas de IA usaste?', opciones: HERRAMIENTAS_IA, otra: true, req: true, cols: 2 },
      { id: 'para_que_ia', tipo: 'parrafo', label: 'Si ya usás IA, ¿para qué la usás?' },
      comodidad,
      { id: 'frenos_ia', tipo: 'check', label: '¿Qué te frena para usar más IA en tu trabajo?', otra: true, req: true, opciones: [
        'No sé por dónde empezar', 'No tengo tiempo para aprender', 'No confío en los resultados',
        'Me preocupa la confidencialidad de los datos', 'No sé si está permitido en la empresa',
        'No creo que me sirva para mi trabajo', 'Nada, ya la uso bastante'] },
    ] },
    { titulo: 'Dónde te ayudaría', preguntas: [
      { id: 'automatizar', tipo: 'parrafo', label: 'Si mañana pudieras automatizar una sola tarea, ¿cuál sería?', req: true },
      { id: 'como_usaria_ia', tipo: 'parrafo', label: '¿Cómo te imaginás usando IA en tu trabajo?',
        hint: 'Por ejemplo: armar un presupuesto a partir de un cómputo, redactar reportes de obra, resumir reuniones, revisar planos antes de entregar.' },
      { id: 'urgencia', tipo: 'escala', label: '¿Qué tan urgente es resolver esto para tu área?', min: 1, max: 5, bajo: 'Puede esperar', alto: 'Es urgente', req: true },
      { id: 'comentarios', tipo: 'parrafo', label: '¿Algo más que quieras contarnos?' },
    ] },
  ] : [
    { titulo: 'Sobre vos', preguntas: sobreVos(true) },
    { titulo: 'Tu trabajo ahora', intro: 'Pensá en una semana normal de las últimas semanas.', preguntas: [
      ...metricas,
      { id: 'tarea1', tipo: 'texto', label: 'En el diagnóstico inicial, ¿cuál era la tarea manual que más tiempo te llevaba?', req: true },
      { id: 'tarea1_horas', tipo: 'horas', label: '¿Cuántas horas por semana le dedicás ahora a esa tarea?', req: true },
      tiemposGrilla(true),
      frustracion,
    ] },
    { titulo: 'Uso de IA ahora', preguntas: [
      { id: 'uso_ia', tipo: 'radio', label: '¿Con qué frecuencia usás IA en tu trabajo?', opciones: USO_IA, req: true },
      { id: 'herramientas_ia', tipo: 'check', label: '¿Qué herramientas de IA usás?', otra: true, req: true, cols: 2,
        opciones: HERRAMIENTAS_IA.concat(['Herramientas armadas para la empresa']) },
      { id: 'para_que_ia', tipo: 'parrafo', label: '¿Para qué tareas la usás?', req: true },
      comodidad,
    ] },
    { titulo: 'Qué cambió', preguntas: [
      { id: 'horas_ahorradas', tipo: 'radio', label: '¿Cuántas horas por semana estimás que te ahorra la IA?', opciones: ['Ninguna'].concat(HORAS_SEMANA), req: true, cols: 2 },
      { id: 'calidad', tipo: 'radio', label: '¿Cómo cambió la calidad de tu trabajo?', opciones: ['Empeoró', 'Está igual', 'Mejoró un poco', 'Mejoró mucho'], req: true, cols: 2 },
      { id: 'errores', tipo: 'radio', label: '¿Cómo cambiaron los errores y las correcciones?', opciones: ['Hay más', 'Está igual', 'Hay menos', 'Casi no hay'], req: true, cols: 2 },
      { id: 'conformidad', tipo: 'escala', label: '¿Qué tan conforme estás con las herramientas implementadas?', min: 1, max: 5, bajo: 'Nada conforme', alto: 'Muy conforme', req: true },
      { id: 'que_cambio', tipo: 'parrafo', label: '¿Qué fue lo que más te cambió el trabajo?', req: true },
      { id: 'que_no_funciono', tipo: 'parrafo', label: '¿Qué no funcionó o te costó usar?' },
      { id: 'automatizar_ahora', tipo: 'parrafo', label: '¿Qué tarea te gustaría automatizar ahora?' },
      { id: 'recomendaria', tipo: 'escala', label: '¿Qué tan probable es que le recomiendes estas herramientas a un colega?', min: 0, max: 10, bajo: 'Nada probable', alto: 'Muy probable', req: true },
    ] },
  ];

  // ---- textos de la página ----
  const gold = t => esc(t).replace(/\*(.+?)\*/g, '<em>$1</em>');
  const HERO = etapa === 'inicial' ? {
    titulo: '¿En qué se te va el *tiempo* de trabajo?',
    bajada: `Este diagnóstico nos ayuda a entender cómo trabaja cada área de ${empresa.nombre}: qué tareas hacés, cuánto te llevan y dónde la IA te puede ahorrar horas.`,
    bullets: ['Lleva unos 10 minutos.', 'No hay respuestas correctas: lo que más sirve son los tiempos reales.',
      'Con tus respuestas armamos herramientas a medida de tu trabajo.', 'Al final del proceso vas a completar una medición corta para ver qué cambió.'],
    gracias: 'Con tus respuestas vamos a armar las herramientas para tu área. Más adelante te vamos a mandar una medición corta para ver qué cambió.',
  } : {
    titulo: '¿Qué *cambió* en tu trabajo con la IA?',
    bajada: 'Hace unas semanas completaste el diagnóstico inicial. Ahora medimos los mismos tiempos para ver el impacto real.',
    bullets: ['Lleva unos 8 minutos.', 'Respondé con el mismo criterio que la primera vez.', 'Usá el mismo email del diagnóstico inicial.'],
    gracias: 'Con esto medimos el impacto real de la IA en cada área y definimos los próximos pasos.',
  };
  document.title = `${etapa === 'inicial' ? 'Diagnóstico' : 'Medición final'} · ${empresa.nombre} · SoyLeo AI`;
  $('eyebrow').textContent = `${etapa === 'inicial' ? 'Diagnóstico' : 'Medición final'} · ${empresa.nombre}`;
  $('titulo').innerHTML = gold(HERO.titulo);
  $('bajada').textContent = HERO.bajada;
  $('bullets').innerHTML = HERO.bullets.map(b => `<li>${esc(b)}</li>`).join('');

  // ---- render ----
  const ERRORES = {
    texto: 'Completá este campo.', parrafo: 'Contanos un poco, aunque sea en una línea.', email: 'Revisá el email, parece incompleto.',
    horas: 'Escribí un número de horas entre 0 y 80.', radio: 'Elegí una opción (si es "Otra", escribí cuál).',
    check: 'Elegí al menos una opción (si es "Otra", escribí cuál).', escala: 'Elegí un valor.', grilla: 'Elegí un tiempo para cada fila.',
  };
  const opcional = p => p.req ? '' : ' <span class="hint">(opcional)</span>';

  function campo(p) {
    const q = `q_${p.id}`;
    const hint = p.hint ? `<div class="hint-block">${esc(p.hint)}</div>` : '';
    const abre = `<div class="field" data-id="${p.id}" data-tipo="${p.tipo}"${p.req ? ' data-req' : ''}>`;
    const cierra = `<div class="err">${ERRORES[p.tipo]}</div></div>`;
    const label = `<label for="${q}">${esc(p.label)}${opcional(p)}</label>${hint}`;
    const legend = `<legend>${esc(p.label)}${opcional(p)}</legend>${hint}`;
    switch (p.tipo) {
      case 'texto': case 'email':
        return abre + label + `<input type="${p.tipo === 'email' ? 'email' : 'text'}" id="${q}" name="${p.id}" maxlength="200"` +
          `${p.auto ? ` autocomplete="${p.auto}"` : ''}${p.ph ? ` placeholder="${esc(p.ph)}"` : ''}>` + cierra;
      case 'parrafo':
        return abre + label + `<textarea id="${q}" name="${p.id}" maxlength="2000"></textarea>` + cierra;
      case 'horas':
        return abre + label + `<div class="horas"><input type="text" inputmode="decimal" id="${q}" name="${p.id}" maxlength="5" placeholder="0">` +
          `<span>horas por semana</span></div>` + cierra;
      case 'radio': case 'check': {
        const tipo = p.tipo === 'radio' ? 'radio' : 'checkbox';
        const ops = p.opciones.concat(p.otra ? [OTRA] : []);
        return abre + legend + `<div class="opts${p.cols ? ' two' : ''}">` +
          ops.map(o => `<label class="opt"><input type="${tipo}" name="${p.id}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('') +
          `</div>` + (p.otra ? `<input type="text" class="otra-txt hidden" name="${p.id}__otra" maxlength="120" placeholder="¿Cuál?" aria-label="${esc(p.label)}: otra">` : '') + cierra;
      }
      case 'escala': {
        const n = p.max - p.min + 1;
        return abre + legend + `<div class="escala" style="--n:${n}">` +
          Array.from({ length: n }, (_, i) => p.min + i).map(v =>
            `<label class="opt"><input type="radio" name="${p.id}" value="${v}"><span>${v}</span></label>`).join('') +
          `</div><div class="escala-labels"><span>${esc(p.bajo)}</span><span>${esc(p.alto)}</span></div>` + cierra;
      }
      case 'grilla':
        return abre + legend + `<div class="grilla">` + p.filas.map((f, i) =>
          `<div class="grilla-fila"><label for="${q}_${i}">${esc(f)}</label><select id="${q}_${i}" name="${p.id}__${i}">` +
          `<option value="">Elegí…</option>${p.columnas.map(c => `<option>${esc(c)}</option>`).join('')}</select></div>`).join('') +
          `</div>` + cierra;
    }
    return '';
  }

  const form = $('diag');
  $('pasos').innerHTML = PASOS.map((paso, i) =>
    `<fieldset class="step${i === 0 ? ' active' : ''}" data-step="${i + 1}"><h2>${esc(paso.titulo)}</h2>` +
    (paso.intro ? `<p class="paso-intro">${esc(paso.intro)}</p>` : '') +
    paso.preguntas.map(campo).join('') + `</fieldset>`).join('');
  $('progress').innerHTML = PASOS.map((_, i) => `<span${i === 0 ? ' class="on"' : ''}></span>`).join('');
  $('cargando').classList.add('hidden');
  form.classList.remove('hidden');

  const steps = [...form.querySelectorAll('.step')];
  const bars = [...$('progress').children];
  const back = $('back'), next = $('next');
  let cur = 0;

  // "Otra": muestra el campo de texto cuando está marcada
  function syncOtra(f) {
    const txt = f.querySelector('.otra-txt');
    if (!txt) return;
    const on = [...f.querySelectorAll('input:checked')].some(i => i.value === OTRA);
    txt.classList.toggle('hidden', !on);
  }

  // ---- validación ----
  function valido(f) {
    const tipo = f.dataset.tipo, req = 'req' in f.dataset;
    const inp = f.querySelector('input[type=text]:not(.otra-txt), input[type=email], textarea');
    switch (tipo) {
      case 'texto': case 'parrafo': return !req || inp.value.trim() !== '';
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim());
      case 'horas': {
        const v = inp.value.trim().replace(',', '.');
        if (v === '') return !req;
        const n = Number(v);
        return Number.isFinite(n) && n >= 0 && n <= 80;
      }
      case 'radio': case 'check': case 'escala': {
        const marcados = [...f.querySelectorAll('input:checked')];
        if (!marcados.length) return !req;
        const otra = f.querySelector('.otra-txt');
        return !(otra && marcados.some(m => m.value === OTRA) && !otra.value.trim());
      }
      case 'grilla': return !req || [...f.querySelectorAll('select')].every(s => s.value);
    }
    return true;
  }
  function validar(step) {
    let ok = true;
    step.querySelectorAll('.field').forEach(f => {
      const v = valido(f);
      f.classList.toggle('invalid', !v);
      if (!v && ok) { ok = false; f.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
    return ok;
  }

  // ---- borrador en este dispositivo ----
  const KEY = `diag:${codigo}`;
  const marcable = el => el.type === 'radio' || el.type === 'checkbox';
  const kEl = el => marcable(el) ? `${el.name}=${el.value}` : el.name;
  function guardar() {
    try {
      const s = { _paso: cur };
      form.querySelectorAll('[name]').forEach(el => { if (el.name !== 'website') s[kEl(el)] = marcable(el) ? el.checked : el.value; });
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) { /* sin almacenamiento: el formulario sigue funcionando */ }
  }
  function restaurar() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!s) return 0;
      form.querySelectorAll('[name]').forEach(el => {
        const k = kEl(el);
        if (k in s) { if (marcable(el)) el.checked = !!s[k]; else el.value = s[k]; }
      });
      form.querySelectorAll('.field').forEach(syncOtra);
      return Math.min(Number(s._paso) || 0, steps.length - 1);
    } catch (e) { return 0; }
  }

  form.addEventListener('change', e => {
    const f = e.target.closest('.field');
    if (f) { syncOtra(f); f.classList.remove('invalid'); }
    guardar();
  });
  form.addEventListener('input', guardar);

  // ---- pasos ----
  function show(i, scroll = true) {
    steps[cur].classList.remove('active');
    cur = i;
    steps[cur].classList.add('active');
    bars.forEach((b, j) => b.classList.toggle('on', j <= cur));
    $('stepLabel').textContent = `Paso ${cur + 1} de ${steps.length}`;
    back.classList.toggle('hidden', cur === 0);
    next.textContent = cur === steps.length - 1 ? 'Enviar' : 'Continuar';
    $('errEnvio').classList.add('hidden');
    guardar();
    if (scroll) form.closest('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  back.addEventListener('click', () => show(cur - 1));
  show(restaurar(), false);

  // ---- envío ----
  function respuestas() {
    const d = {};
    PASOS.forEach(paso => paso.preguntas.forEach(p => {
      const f = form.querySelector(`.field[data-id="${p.id}"]`);
      if (p.tipo === 'grilla') {
        const sels = f.querySelectorAll('select');
        p.filas.forEach((fila, i) => { d[`${p.id}_${clave(fila)}`] = sels[i].value; });
      } else if (['radio', 'check', 'escala'].includes(p.tipo)) {
        const otra = f.querySelector('.otra-txt');
        d[p.id] = [...f.querySelectorAll('input:checked')]
          .map(i => i.value === OTRA ? `Otra: ${otra.value.trim()}` : i.value).join(' | ');
      } else {
        const v = f.querySelector('input[type=text]:not(.otra-txt), input[type=email], textarea').value.trim();
        d[p.id] = p.tipo === 'horas' && v !== '' ? Number(v.replace(',', '.')) : v;
      }
    }));
    return d;
  }
  function errorEnvio(texto) {
    $('errEnvio').textContent = texto;
    $('errEnvio').classList.remove('hidden');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validar(steps[cur])) return;
    if (cur < steps.length - 1) return show(cur + 1);
    if (form.elements.website.value) return; // bot

    // La empresa y la etapa las define el Apps Script a partir del código, no este navegador.
    const data = { codigo, ...respuestas(), enviado: new Date().toISOString() };
    next.disabled = true; next.textContent = 'Enviando…';
    try {
      await fetch(ENDPOINT, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error(err);
      next.disabled = false; next.textContent = 'Enviar';
      return errorEnvio('No se pudo enviar. Revisá tu conexión y tocá Enviar de nuevo; tus respuestas siguen guardadas.');
    }
    try { localStorage.removeItem(KEY); } catch (e) { /* nada */ }
    form.classList.add('hidden');
    $('doneName').textContent = (data.nombre || '').split(' ')[0];
    $('doneText').textContent = HERO.gracias;
    $('done').classList.remove('hidden');
    $('done').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
