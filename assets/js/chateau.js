/* Comportements des sites des châteaux (d'après privios.com) : âge légal, en-tête, carrousel de bouteilles,
   galerie, fiche vin en quatre écrans. Les pages sont générées par source/generer_chateaux.py. */
(function () {
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } },
  };
  const capture = new URLSearchParams(location.search).has('capture');
  if (capture) document.documentElement.classList.add('capture');
  const reduit = capture || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Logo MIAILHE (assets/js/logo.js) : la maison mère signe chaque site ---------- */
  const L = window.MIAILHE_LOGO;
  if (L) document.querySelectorAll('.wordmark').forEach(el => {
    const v = el.dataset.logo === 'complet' ? L.logo : L.logotype;
    el.insertAdjacentHTML('beforeend', `<svg viewBox="${v.viewBox}" aria-hidden="true" focusable="false"><g transform="${v.transform}" fill="currentColor"><path d="${v.d}"/></g></svg>`);
  });

  /* ---------- Armoiries (assets/js/armoiries.js) : emblème du château et sélecteur de l'en-tête ---------- */
  const A = window.MIAILHE_ARMOIRIES;
  if (A) document.querySelectorAll(':is(.armoirie, .embleme)[data-armoirie]').forEach(el => {
    const a = A[el.dataset.armoirie];
    if (a) el.insertAdjacentHTML('beforeend', `<svg viewBox="${A.viewBox}" aria-hidden="true" focusable="false"><path class="armoirie-fond" d="${A.bouclier}"/><path fill="currentColor" fill-rule="evenodd" d="${el.dataset.forme === 'petit' ? a.petit : a.complet}"/></svg>`);
  });

  /* ---------- Âge légal : une seule fois pour toute la famille (même clé que la vitrine) ---------- */
  const age = document.querySelector('.age');
  if (age) {
    if (capture || store.get('miailhe-age') === 'ok') age.remove();
    else {
      document.body.classList.add('is-locked');
      age.querySelector('.oui').addEventListener('click', () => {
        store.set('miailhe-age', 'ok');
        age.classList.add('is-gone');
        document.body.classList.remove('is-locked');
      });
      age.querySelector('.non').addEventListener('click', () => { age.querySelector('.non-message').hidden = false; });
    }
  }

  /* ---------- Vidéo d'intro : arrêtée si l'utilisateur demande moins d'animations ---------- */
  document.querySelectorAll('.intro-fond video').forEach(v => {
    if (reduit) { v.removeAttribute('autoplay'); v.pause(); }
  });

  /* ---------- En-tête ---------- */
  const entete = document.querySelector('.ch-entete');
  const majEntete = () => entete && entete.classList.toggle('is-fixe', window.scrollY > 40);
  window.addEventListener('scroll', majEntete, { passive: true }); majEntete();
  const burger = document.querySelector('.ch-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const ouvert = document.body.classList.toggle('menu-ouvert');
      burger.setAttribute('aria-expanded', ouvert);
      document.body.classList.toggle('is-locked', ouvert);
    });
    document.querySelectorAll('.ch-nav a').forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('menu-ouvert', 'is-locked'); burger.setAttribute('aria-expanded', false);
    }));
  }
  document.querySelectorAll('.haut-page').forEach(b => b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduit ? 'auto' : 'smooth' })));

  /* ---------- Apparitions ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px', threshold: .1 });
  document.querySelectorAll('[data-anime]').forEach(el => (reduit ? el.classList.add('is-in') : io.observe(el)));

  /* ---------- Carrousel de bouteilles ---------- */
  const carrousel = document.querySelector('.bouteilles');
  if (carrousel) {
    const items = [...carrousel.querySelectorAll('.bouteille')];
    const points = carrousel.querySelector('.points');
    const nom = carrousel.querySelector('.bouteille-desc .nom');
    const origine = carrousel.querySelector('.bouteille-desc .origine');
    const lien = carrousel.querySelector('[data-lien-vin]');
    const prec = carrousel.querySelector('.fleche-carrousel--prec');
    const suiv = carrousel.querySelector('.fleche-carrousel--suiv');
    let i = 0;
    points.innerHTML = items.map((_, k) => `<button type="button" aria-label="Bouteille ${k + 1}"></button>`).join('');
    const pas = () => Math.min(window.innerWidth * .2, 290);
    const placer = () => {
      items.forEach((b, k) => {
        const d = k - i, a = Math.abs(d);
        b.style.setProperty('--x', `${d * pas()}px`);
        b.style.setProperty('--r', d === 0 ? '0deg' : `${14 + Math.min(a, 3) * 2}deg`);
        b.style.setProperty('--s', d === 0 ? 1 : .8 - Math.min(a, 3) * .04);
        b.style.setProperty('--o', a > 3 ? 0 : d === 0 ? 1 : .55 - a * .1);
        b.style.setProperty('--b', d === 0 ? 1 : .55);
        b.style.zIndex = 10 - a;
        b.classList.toggle('is-active', d === 0);
        b.setAttribute('aria-current', d === 0);
        b.tabIndex = d === 0 ? -1 : 0;
      });
      const b = items[i];
      nom.textContent = b.dataset.nom; origine.textContent = b.dataset.origine;
      if (lien) lien.href = b.dataset.lien;
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
    carrousel.querySelector('.piste').addEventListener('pointerdown', e => { x0 = e.clientX; });
    window.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) aller(i + (dx < 0 ? 1 : -1)); });
    window.addEventListener('resize', placer);
    carrousel.querySelectorAll('[data-aller-bouteille]').forEach(b => b.addEventListener('click', () => aller(+b.dataset.allerBouteille)));
    placer();
  }

  /* Listes déroulantes du carrousel (« La gamme », « Où l'acheter ») */
  document.querySelectorAll('.filtre').forEach(f => {
    const b = f.querySelector('.pilule');
    b.addEventListener('click', e => {
      e.stopPropagation();
      const ouvert = !f.classList.contains('is-ouvert');
      document.querySelectorAll('.filtre').forEach(x => { x.classList.remove('is-ouvert'); x.querySelector('.pilule').setAttribute('aria-expanded', false); });
      f.classList.toggle('is-ouvert', ouvert); b.setAttribute('aria-expanded', ouvert);
    });
  });
  document.addEventListener('click', () => document.querySelectorAll('.filtre.is-ouvert').forEach(f => f.classList.remove('is-ouvert')));

  /* ---------- Galerie (page famille) ---------- */
  document.querySelectorAll('.galerie').forEach(g => {
    const piste = g.querySelector('.galerie-piste');
    const defiler = s => piste.scrollBy({ left: s * piste.clientWidth * .6, behavior: reduit ? 'auto' : 'smooth' });
    g.querySelector('.fleche-carrousel--prec').addEventListener('click', () => defiler(-1));
    g.querySelector('.fleche-carrousel--suiv').addEventListener('click', () => defiler(1));
    let glisse = null;
    piste.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; glisse = { x: e.clientX, s: piste.scrollLeft }; piste.style.scrollSnapType = 'none'; });
    window.addEventListener('pointermove', e => { if (glisse) piste.scrollLeft = glisse.s - (e.clientX - glisse.x); });
    window.addEventListener('pointerup', () => { if (glisse) { glisse = null; piste.style.scrollSnapType = ''; } });
  });

  /* ---------- Fiche vin : quatre écrans, la bouteille bouge à chaque écran ---------- */
  const vin = document.querySelector('.vin');
  if (vin) {
    const sections = [...vin.querySelectorAll('.vin-section')];
    const bouteille = vin.querySelector('.bouteille-vin');
    const indicateurs = [...vin.querySelectorAll('.indicateurs button')];
    // Position de la bouteille pour chaque écran : décalage x, y (en % de sa taille), rotation, échelle
    const POSES = [[0, 0, -16, 1], [8, 6, 8, 1.08], [-6, -4, -28, .94], [0, 12, 0, .8]];
    const poser = k => {
      const [x, y, r, s] = POSES[k] || POSES[0];
      bouteille.style.setProperty('--bx', `${x}%`); bouteille.style.setProperty('--by', `${y}%`);
      bouteille.style.setProperty('--br', `${r}deg`); bouteille.style.setProperty('--bs', s);
      indicateurs.forEach((b, j) => { b.classList.toggle('is-active', j === k); b.setAttribute('aria-current', j === k); });
    };
    const ioVin = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) poser(sections.indexOf(e.target)); }), { threshold: .55 });
    sections.forEach(s => ioVin.observe(s));
    const versSection = k => sections[k] && sections[k].scrollIntoView({ behavior: reduit ? 'auto' : 'smooth' });
    indicateurs.forEach((b, k) => b.addEventListener('click', () => versSection(k)));
    vin.querySelectorAll('[data-vers]').forEach(b => b.addEventListener('click', () => versSection(+b.dataset.vers)));
    poser(0);
  }

  /* ---------- La porte du château s'ouvre à l'arrivée ----------
     Une fois par visite et par château, ou chaque fois qu'on arrive par une porte de la vitrine (?porte).
     Si l'âge n'a pas encore été confirmé, la porte attend le « Oui, entrer ». */
  const porte = document.querySelector('.porte-chateau');
  if (porte) {
    const params = new URLSearchParams(location.search);
    const parLaVitrine = params.has('porte');
    if (parLaVitrine) { params.delete('porte'); history.replaceState(null, '', location.pathname + (params.toString() ? `?${params}` : '') + location.hash); }
    const cle = `miailhe-porte-${(document.body.className.match(/ch-([a-z]+)/) || [])[1]}`;
    let dejaVue = null;
    try { dejaVue = sessionStorage.getItem(cle); } catch (e) { /* stockage indisponible */ }
    if (capture || reduit || (dejaVue && !parLaVitrine)) porte.remove();
    else {
      porte.classList.add('is-active');
      // par la vitrine, on vient de franchir la porte en film : l'écran s'efface en fondu, sans rejouer de battants
      if (parLaVitrine) porte.classList.add('par-vitrine');
      const ouvrir = () => {
        try { sessionStorage.setItem(cle, 'vue'); } catch (e) { /* stockage indisponible */ }
        // la voix de l'hôte (voix.js) : par la vitrine, elle a déjà été dite au passage de la porte ; sinon on la tente
        // ici (après « Oui, entrer », le navigateur la laisse parler ; sans geste, elle peut se taire)
        const M = window.MIAILHE || {};
        const chateau = (document.body.className.match(/ch-([a-z]+)/) || [])[1];
        if (!parLaVitrine && M.voix && chateau) { const v = M.voix(chateau); setTimeout(v.dire, 650); }
        setTimeout(() => porte.classList.add('is-ouverte'), parLaVitrine ? 350 : 700);
        setTimeout(() => porte.remove(), parLaVitrine ? 1800 : 2700);
      };
      const ageEnAttente = document.querySelector('.age:not(.is-gone)');
      if (ageEnAttente) ageEnAttente.querySelector('.oui').addEventListener('click', ouvrir, { once: true });
      else ouvrir();
    }
  }
})();
