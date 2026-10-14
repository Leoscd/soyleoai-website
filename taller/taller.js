// Inscripción al taller en vivo (2 pasos).
// El paso 1 ya guarda la inscripción y dispara el email de confirmación;
// el paso 2 completa el perfil de la misma fila (se buscan por `id`).
(() => {
  const CONFIG = {
    // Web App del Apps Script del taller (docs/apps-script-taller.gs), termina en /exec
    ENDPOINT: "https://script.google.com/macros/s/AKfycbzx3b-DbvtP9ohkN3TJCY-iWd5Xshjld5LEANLaFZvmCo8y9D3r-LvOsGPJKCKpgu0/exec",
    // Viernes 30/10/2026, 19 a 21 h de Argentina (UTC-3)
    INICIO: '2026-10-30T22:00:00Z',
    FIN: '2026-10-31T00:00:00Z',
    TITULO: 'Taller en vivo: IA para arquitectos (SoyLeo AI)'
  };

  const form = document.getElementById('lead');
  const steps = [...form.querySelectorAll('.step')];
  const bars = [...document.querySelectorAll('.progress span')];
  const next = document.getElementById('next');
  let cur = 0;

  // ---- hora local del visitante (si no está en la hora de Argentina) ----
  const inicio = new Date(CONFIG.INICIO);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const fmt = zona => inicio.toLocaleString('es', { timeZone: zona, weekday: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  try {
    if (tz && fmt(tz) !== fmt('America/Argentina/Buenos_Aires'))
      document.getElementById('horaLocal').textContent = `En tu hora: ${fmt(tz)} h`;
  } catch (e) { /* zona horaria desconocida: no mostramos nada */ }

  // ---- ocultos ----
  form.elements.id.value = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()) + Math.random().toString(16).slice(2);
  form.elements.tz.value = tz;
  const qs = new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign','utm_content','fbclid'].forEach(k => {
    if (qs.get(k)) form.elements[k].value = qs.get(k);
  });
  form.addEventListener('focusin', () => {
    if (window.gtag) gtag('event', 'form_paso', { paso: 1, recurso: 'taller' });
  }, { once: true });

  function validate(step) {
    let ok = true;
    step.querySelectorAll('.field').forEach(f => {
      let valid = true;
      const input = f.querySelector('input[required], select[required]');
      if (input) valid = input.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim()) : input.value.trim() !== '';
      if (f.dataset.radio !== undefined) valid = !!f.querySelector('input:checked');
      if (f.dataset.check !== undefined) valid = !!f.querySelector('input:checked') || !!(f.querySelector('.otro') || {}).value;
      if ('consent' in f.dataset) valid = document.getElementById('consent').checked;
      f.classList.toggle('invalid', !valid);
      if (!valid && ok) { ok = false; f.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
    return ok;
  }
  form.addEventListener('change', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('invalid'); });
  form.addEventListener('input', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('invalid'); });

  // Junta los campos de un paso (+ id, tz y atribución)
  function collect(step, etapa) {
    const data = { etapa, id: form.elements.id.value };
    step.querySelectorAll('input, select').forEach(el => {
      if (!el.name || ((el.type === 'checkbox' || el.type === 'radio') && !el.checked)) return;
      const v = el.value.trim();
      if (v) data[el.name] = data[el.name] ? data[el.name] + ' | ' + v : v;
    });
    data.email = form.elements.email.value.trim(); // el paso 2 también lo manda, por si no se encuentra el id
    if (etapa === 1) ['tz','utm_source','utm_medium','utm_campaign','utm_content','fbclid','website']
      .forEach(k => { if (form.elements[k].value) data[k] = form.elements[k].value; });
    data.pagina = location.href.split('?')[0];
    return data;
  }

  async function send(data) {
    if (!CONFIG.ENDPOINT) { console.warn('Sin ENDPOINT configurado. Datos:', data); return; }
    try {
      await fetch(CONFIG.ENDPOINT, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
    } catch (err) { console.error(err); }
  }

  function show(i) {
    steps[cur].classList.remove('active');
    cur = i;
    steps[cur].classList.add('active');
    bars.forEach((b, j) => b.classList.toggle('on', j <= cur));
    document.getElementById('stepLabel').textContent = `Paso ${cur + 1} de ${steps.length}`;
    if (window.gtag) gtag('event', 'form_paso', { paso: cur + 1, recurso: 'taller' });
    form.closest('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function calendarUrl() {
    const d = s => s.replace(/[-:]/g, '').replace('.000', '');
    const p = new URLSearchParams({
      action: 'TEMPLATE',
      text: CONFIG.TITULO,
      dates: `${d(CONFIG.INICIO)}/${d(CONFIG.FIN)}`,
      details: 'Taller gratuito por Google Meet. El link de acceso te llega por email 1 hora antes. Conectate desde la compu.'
    });
    return 'https://calendar.google.com/calendar/render?' + p;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate(steps[cur])) return;
    if (form.elements.website.value) return; // bot
    next.disabled = true;
    const label = next.textContent;
    next.textContent = 'Enviando…';

    if (cur === 0) {
      const data = collect(steps[0], 1);
      await send(data);
      if (window.fbq) fbq('track', 'Lead', { content_name: 'taller', pais: data.pais });
      if (window.gtag) gtag('event', 'generate_lead', { lead_source: 'taller' });
      next.disabled = false;
      next.textContent = 'Enviar y terminar';
      return show(1);
    }

    await send(collect(steps[1], 2));
    if (window.gtag) gtag('event', 'taller_perfil', { perfil: form.querySelector('input[name=perfil]:checked').value });
    next.textContent = label;
    form.classList.add('hidden');
    document.getElementById('doneName').textContent = form.elements.nombre.value.trim().split(' ')[0];
    document.getElementById('cal').href = calendarUrl();
    document.getElementById('done').classList.remove('hidden');
  });
})();
