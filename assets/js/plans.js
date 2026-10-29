/* Les plans de cinéma des onglets « Le terroir » et « Prêt-à-boire » de l'accueil (28/10/2026).
   - [data-plan] : une image plein écran qui s'approche lentement pendant qu'on défile ; --p va de 0 (le plan entre par
     le bas de l'écran) à 1 (il sort par le haut).
   - [data-sequence] : l'histoire d'une bouteille. La scène reste à l'écran (sticky) et chaque tranche du défilement
     montre une étape ([data-etape]) et son film ([data-etape-media], lu seulement quand il est à l'écran) ; --q va de 0 à 1
     d'une étape à l'autre, pour la frise. L'année de l'étape (data-annee) s'affiche en grand ([data-annee-grande]) ; un compteur court pendant
     l'étape qui en porte un (data-compteur-de, data-compteur-a), et ce qui porte data-des="2024" apparaît à cette année.
     Ce qui porte data-des-etape="3" apparaît à partir de cette étape.
   - [data-apparait] : sort du flou une fois à l'écran, comme les récits de « La famille ».
   Les panneaux défilent sur eux-mêmes : on écoute le défilement de toute la page (capture). */
(function () {
  const M = window.MIAILHE || {};
  const reduit = !!M.reduceMotion;
  const plans = [...document.querySelectorAll('[data-plan]')];
  const sequences = [...document.querySelectorAll('[data-sequence]')];
  const apparitions = [...document.querySelectorAll('[data-apparait]')];
  if (!plans.length && !sequences.length && !apparitions.length) return;

  const io = 'IntersectionObserver' in window && !M.capture ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-vu'); io.unobserve(e.target); }
  }), { threshold: .18, rootMargin: '0px 0px -6% 0px' }) : null;
  apparitions.forEach(el => (io ? io.observe(el) : el.classList.add('is-vu')));

  const ouvert = el => { const p = el.closest('[data-panneau]'); return !p || p.classList.contains('is-ouvert'); };

  const majPlan = el => {
    const r = el.getBoundingClientRect(), h = innerHeight;
    if (r.bottom < 0 || r.top > h) return;
    el.style.setProperty('--p', Math.min(1, Math.max(0, (h - r.top) / (h + r.height))).toFixed(4));
  };

  const seqs = sequences.map(s => ({
    s,
    etapes: [...s.querySelectorAll('[data-etape]')],
    medias: [...s.querySelectorAll('[data-etape-media]')],
    frise: [...s.querySelectorAll('.attente-frise li')],
    reperes: [...s.querySelectorAll('[data-des-etape]')],
    annee: s.querySelector('[data-annee-grande]'),
    actif: -1,
  }));
  const lire = (m, oui) => {
    if (m.tagName !== 'VIDEO') return;
    if (oui && !reduit) { m.preload = 'auto'; m.play().catch(() => {}); } else m.pause();
  };
  const majSequence = S => {
    const r = S.s.getBoundingClientRect(), h = innerHeight;
    const proche = r.bottom > -h && r.top < 2 * h && ouvert(S.s);
    if (!proche) { if (S.actif !== -1) { S.medias.forEach(m => lire(m, false)); S.actif = -1; } return; }
    const n = S.etapes.length;
    const q = M.capture ? 1 : Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - h)));
    const x = Math.min(n - .0001, q * n);
    const k = Math.floor(x), local = x - k;
    S.s.style.setProperty('--q', Math.min(1, x / (n - 1)).toFixed(4));
    if (k !== S.actif) {
      S.actif = k;
      S.s.dataset.etape = k;
      S.etapes.forEach((e, i) => e.classList.toggle('is-active', i === k));
      S.medias.forEach(m => { const oui = +m.dataset.etapeMedia === k; m.classList.toggle('is-active', oui); lire(m, oui); });
      S.frise.forEach((li, i) => li.classList.toggle('is-passe', i <= k));
      S.reperes.forEach(el => el.classList.toggle('is-la', k >= +el.dataset.desEtape));
    }
    // l'année de l'étape, ou le compteur qui court pendant les années de garde
    const e = S.etapes[k];
    let an = e.dataset.annee || '';
    if (e.dataset.compteurDe) {
      const de = +e.dataset.compteurDe, a = +e.dataset.compteurA;
      const v = Math.round(de + (a - de) * Math.min(1, local / .8));
      an = String(v);
      e.querySelectorAll('[data-des]').forEach(f => f.classList.toggle('is-la', v >= +f.dataset.des));
    }
    if (S.annee && S.annee.textContent !== an) S.annee.textContent = an;
  };

  let attente = 0;
  const maj = () => {
    attente = 0;
    plans.forEach(el => { if (ouvert(el)) majPlan(el); });
    seqs.forEach(majSequence);
  };
  const demander = () => { if (!attente) attente = requestAnimationFrame(maj); };
  document.addEventListener('scroll', demander, { passive: true, capture: true });
  window.addEventListener('resize', demander);
  // un onglet s'ouvre ou se ferme : on recalcule (les films d'un onglet fermé s'arrêtent)
  document.addEventListener('miailhe:onglet', () => setTimeout(maj, 30));
  maj();
})();
