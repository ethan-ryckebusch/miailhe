/* La vitrine après l'entrée (mise en page d'après privios.com) : films, racine rouge du récit,
   galerie du savoir-faire et carrousel des trois châteaux. main.js gère l'âge légal, le menu et les apparitions. */
(function () {
  const M = window.MIAILHE || {};
  const page = document.querySelector('main.v');
  if (!page) return;
  const reduit = !!M.reduceMotion;
  // ?capture : la page entière est photographiée d'un coup, les images différées doivent être chargées
  if (M.capture) page.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });

  /* ---------- Ouverture : armoiries et titre apparaissent une fois entré ---------- */
  (M.quandEntre || (fn => fn()))(() => requestAnimationFrame(() => page.classList.add('is-entree')));

  /* ---------- Films : ils ne tournent que lorsqu'on les voit ---------- */
  const films = [...page.querySelectorAll('video')];
  if (reduit) films.forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
  else {
    const ioFilm = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); }
      else v.pause();
    }), { rootMargin: '200px 0px' });
    films.forEach(v => ioFilm.observe(v));
  }

  /* ---------- La racine du récit pousse au fil des chapitres ---------- */
  const recit = page.querySelector('.v-recit');
  const racine = recit && recit.querySelector('.v-racine span');
  if (racine) {
    const pousser = () => {
      const r = recit.getBoundingClientRect(), h = window.innerHeight;
      const p = Math.min(1, Math.max(0, (h * .55 - r.top) / (r.height - 120)));
      racine.style.setProperty('--p', reduit ? 1 : p.toFixed(4));
    };
    window.addEventListener('scroll', pousser, { passive: true });
    window.addEventListener('resize', pousser);
    pousser();
  }

  /* ---------- Galerie : flèches et glisser à la souris ---------- */
  page.querySelectorAll('[data-galerie]').forEach(g => {
    const piste = g.querySelector('.v-galerie-piste');
    const prec = g.querySelector('.v-fleche--prec'), suiv = g.querySelector('.v-fleche--suiv');
    const defiler = s => piste.scrollBy({ left: s * piste.clientWidth * .6, behavior: reduit ? 'auto' : 'smooth' });
    const bornes = () => {
      prec.disabled = piste.scrollLeft < 4;
      suiv.disabled = piste.scrollLeft > piste.scrollWidth - piste.clientWidth - 4;
    };
    prec.addEventListener('click', () => defiler(-1));
    suiv.addEventListener('click', () => defiler(1));
    piste.addEventListener('scroll', bornes, { passive: true });
    window.addEventListener('resize', bornes);
    bornes();
    let glisse = null;
    piste.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; glisse = { x: e.clientX, s: piste.scrollLeft }; piste.style.scrollSnapType = 'none'; });
    window.addEventListener('pointermove', e => { if (glisse) piste.scrollLeft = glisse.s - (e.clientX - glisse.x); });
    window.addEventListener('pointerup', () => { if (glisse) { glisse = null; piste.style.scrollSnapType = ''; } });
  });

  /* ---------- Carrousel des trois châteaux (le même que celui des bouteilles de Privios) ---------- */
  const carrousel = page.querySelector('[data-carrousel]');
  if (carrousel) {
    const items = [...carrousel.querySelectorAll('.v-bouteille')];
    const points = carrousel.querySelector('.v-points');
    const desc = carrousel.querySelector('.v-bouteille-desc');
    const lien = carrousel.querySelector('[data-lien-chateau]');
    const prec = carrousel.querySelector('.v-fleche--prec'), suiv = carrousel.querySelector('.v-fleche--suiv');
    const A = window.MIAILHE_ARMOIRIES;
    let i = 1;   // on commence au milieu : le père, entre le grand-père et le fils
    points.innerHTML = items.map(b => `<button type="button" aria-label="${b.dataset.nom}"></button>`).join('');
    const pas = () => Math.min(window.innerWidth * .2, 290);
    const placer = () => {
      items.forEach((b, k) => {
        const d = k - i, a = Math.abs(d);
        b.style.setProperty('--x', `${d * pas()}px`);
        b.style.setProperty('--r', d === 0 ? '0deg' : `${14 + a * 2}deg`);
        b.style.setProperty('--s', d === 0 ? 1 : .8 - a * .04);
        b.style.setProperty('--o', d === 0 ? 1 : .55 - a * .1);
        b.style.setProperty('--b', d === 0 ? 1 : .55);
        b.style.zIndex = 10 - a;
        b.classList.toggle('is-active', d === 0);
        b.setAttribute('aria-current', d === 0);
      });
      const b = items[i], a = A && A[b.dataset.chateau];
      desc.querySelector('.armoirie-active').innerHTML = a
        ? `<span class="armoirie" data-armoirie="${b.dataset.chateau}"><svg viewBox="${A.viewBox}" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="${a.complet}"/></svg></span>` : '';
      desc.querySelector('.nom').textContent = b.dataset.nom;
      desc.querySelector('.origine').textContent = `${b.dataset.generation} · ${b.dataset.trait}`;
      lien.href = b.dataset.lien;
      lien.textContent = `Entrer à ${b.dataset.nom.replace('Château ', '')}`;
      points.querySelectorAll('button').forEach((p, k) => p.classList.toggle('is-active', k === i));
      prec.disabled = i === 0; suiv.disabled = i === items.length - 1;
    };
    const aller = k => { i = Math.max(0, Math.min(items.length - 1, k)); placer(); };
    items.forEach((b, k) => b.addEventListener('click', () => (k === i ? (location.href = b.dataset.lien) : aller(k))));
    points.querySelectorAll('button').forEach((p, k) => p.addEventListener('click', () => aller(k)));
    prec.addEventListener('click', () => aller(i - 1));
    suiv.addEventListener('click', () => aller(i + 1));
    carrousel.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') aller(i - 1); if (e.key === 'ArrowRight') aller(i + 1); });
    let x0 = null;
    carrousel.querySelector('.v-piste').addEventListener('pointerdown', e => { x0 = e.clientX; });
    window.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) aller(i + (dx < 0 ? 1 : -1)); });
    window.addEventListener('resize', placer);
    placer();
  }
})();
