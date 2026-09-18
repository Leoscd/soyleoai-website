// Landing de recursos — rellena la página con los datos de recursos.json
// y maneja el formulario de 3 pasos. No hace falta tocarlo para agregar un recurso.
(async () => {
  const slug = location.pathname.replace(/\/+$/, '').split('/').pop();
  let recurso;
  try {
    const catalogo = await (await fetch('/recursos/recursos.json', { cache: 'no-cache' })).json();
    recurso = catalogo.find(r => r.slug === slug);
  } catch (e) { console.error(e); }
  if (!recurso) { location.replace('/recursos'); return; }

  // ---- contenido de la página ----
  const gold = t => t.replace(/\*(.+?)\*/g, '<em>$1</em>');
  document.title = `${recurso.titulo.replace(/\*/g, '')} · SoyLeo AI`;
  document.querySelector('meta[name=description]').content = recurso.bajada;
  document.getElementById('eyebrow').textContent = recurso.etiqueta || 'Recurso gratuito · PDF';
  document.getElementById('titulo').innerHTML = gold(recurso.titulo);
  document.getElementById('bajada').innerHTML = gold(recurso.bajada);
  document.getElementById('bullets').innerHTML = recurso.bullets.map(b => `<li>${b}</li>`).join('');
  const url = `https://soyleoai.com/recursos/${recurso.slug}`;
  document.head.insertAdjacentHTML('beforeend',
    `<link rel="canonical" href="${url}"><meta property="og:url" content="${url}">` +
    `<meta property="og:title" content="${recurso.titulo.replace(/\*/g, '')}">` +
    `<meta property="og:description" content="${recurso.bajada.replace(/\*/g, '')}">`);
  window.CONFIG.PDF_URL = recurso.pdf;

  const form = document.getElementById('lead');
  form.elements.recurso.value = recurso.slug;
  form.insertAdjacentHTML('beforeend',
    `<input type="hidden" name="titulo" value="${recurso.titulo.replace(/\*/g, '')}">`);
  const steps = [...form.querySelectorAll('.step')];
  const bars = [...document.querySelectorAll('.progress span')];
  const back = document.getElementById('back'), next = document.getElementById('next');
  let cur = 0;

  // UTM / fbclid
  const qs = new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign','utm_content','fbclid'].forEach(k => {
    if (qs.get(k)) form.elements[k].value = qs.get(k);
  });

  // Preguntas condicionales de inversión
  const qCap = document.getElementById('qCap'), qSis = document.getElementById('qSis');
  form.querySelectorAll('input[name=preferencia]').forEach(r => r.addEventListener('change', () => {
    const v = r.value;
    qCap.classList.toggle('hidden', v === 'Contratarlos armados');
    qSis.classList.toggle('hidden', v === 'Aprender a armarlos');
  }));

  // Máximo 3 tareas
  const dolor = [...form.querySelectorAll('input[name=dolor]')];
  dolor.forEach(c => c.addEventListener('change', () => {
    const n = dolor.filter(x => x.checked).length;
    dolor.forEach(x => { if (!x.checked) x.disabled = n >= 3; x.nextElementSibling.style.opacity = x.disabled ? .4 : 1; });
  }));

  function validate(step) {
    let ok = true;
    step.querySelectorAll('.field').forEach(f => {
      if (f.classList.contains('hidden')) return;
      let valid = true;
      const input = f.querySelector('input[required], select[required]');
      if (input) valid = input.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim()) : input.value.trim() !== '';
      if (f.dataset.radio) valid = !!f.querySelector('input:checked');
      if (f.dataset.check) { const n = f.querySelectorAll('input:checked').length; valid = n >= 1 && n <= 3; }
      if ('consent' in f.dataset) valid = document.getElementById('consent').checked;
      f.classList.toggle('invalid', !valid);
      if (!valid && ok) { ok = false; f.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
    return ok;
  }
  form.addEventListener('change', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('invalid'); });

  function show(i) {
    steps[cur].classList.remove('active');
    cur = i;
    steps[cur].classList.add('active');
    bars.forEach((b, j) => b.classList.toggle('on', j <= cur));
    document.getElementById('stepLabel').textContent = `Paso ${cur + 1} de ${steps.length}`;
    back.classList.toggle('hidden', cur === 0);
    next.textContent = cur === steps.length - 1 ? 'Descargar la guía' : 'Continuar';
    form.closest('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  back.addEventListener('click', () => show(cur - 1));

  function collect() {
    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = data[k] ? data[k] + ' | ' + v : v; });
    if (qCap.classList.contains('hidden')) delete data.inversion_capacitacion;
    if (qSis.classList.contains('hidden')) delete data.inversion_sistema;
    data.pagina = location.href.split('?')[0];
    return data;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate(steps[cur])) return;
    if (cur < steps.length - 1) {
      if (cur === 0 && window.fbq) fbq('trackCustom', 'LeadPaso1');
      return show(cur + 1);
    }
    const data = collect();
    if (data.website) return; // bot
    next.disabled = true; next.textContent = 'Enviando…';
    try {
      if (window.CONFIG.ENDPOINT) {
        await fetch(window.CONFIG.ENDPOINT, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(data)
        });
      } else {
        console.warn('Sin ENDPOINT configurado. Datos:', data);
      }
    } catch (err) { console.error(err); }
    if (window.fbq) fbq('track', 'Lead', {
      content_name: 'guia-skill-presupuestos',
      preferencia: data.preferencia, perfil: data.perfil, pais: data.pais,
      inversion_sistema: data.inversion_sistema || '', inversion_capacitacion: data.inversion_capacitacion || ''
    });
    if (window.gtag) gtag('event', 'generate_lead', { lead_source: 'guia-skill-presupuestos', preferencia: data.preferencia || '' });
    form.classList.add('hidden');
    document.getElementById('doneName').textContent = (data.nombre || '').split(' ')[0];
    document.getElementById('dl').href = window.CONFIG.PDF_URL;
    document.getElementById('done').classList.remove('hidden');
  });
})();
