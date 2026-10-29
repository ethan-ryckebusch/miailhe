/* L'histoire de la famille (onglet « La famille » de l'accueil, 27/10/2026), racontée comme l'intro du site : sur fond
   noir, une racine de vigne descend au fil du défilement, sa pointe toujours aux deux tiers de l'écran. À chaque
   génération, une racine part vers le récit et s'achève en feuille de vigne ; le récit apparaît quand elle l'atteint.
   Les feuilles des trois châteaux prennent leur couleur. En bas, la racine se divise en trois et rejoint les logos de
   Coufran, Verdignan et Soudars : trois châteaux, une même racine. Mêmes outils de dessin que l'intro (MIAILHE.vigne,
   intro.js), même retenue : un trait, des feuilles, rien d'autre. */
(function () {
  const M = window.MIAILHE || {};
  const V = M.vigne;
  const sec = document.querySelector('[data-histoire]');
  if (!sec || !V) return;
  const { el, clamp, spline, trace, ruban, feuille } = V;
  const svg = sec.querySelector('.histoire-svg');
  const ouverture = sec.querySelector('.histoire-ouverture');
  const chapitres = [...sec.querySelectorAll('.histoire-chapitre')];
  const final = sec.querySelector('.histoire-final');
  const arrivees = [...sec.querySelectorAll('.histoire-chateaux [data-chateau]')];
  const reduit = !!M.reduceMotion;
  const POINTE = .72;          // la pointe de la racine, à cette hauteur de l'écran (le récit apparaît vers le milieu)

  // un hasard qui ne change pas d'une visite à l'autre : la racine garde sa forme
  const hasard = graine => () => { graine = (graine * 16807) % 2147483647; return (graine - 1) / 2147483646; };

  let g = null, cible = 0, actuel = 0, boucle = 0;

  function construire() {
    const W = sec.clientWidth, H = sec.offsetHeight;
    if (!W || !H) return;
    svg.textContent = '';
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.height = `${H}px`;
    const r = hasard(1924);
    const etroit = W < 760;
    const xc = etroit ? 24 : W / 2;
    const s = sec.getBoundingClientRect();
    const rel = e => { const b = e.getBoundingClientRect(); return { x: b.left - s.left, y: b.top - s.top, w: b.width, h: b.height }; };

    // les nœuds : un par génération, à la hauteur du titre de son récit
    const noeuds = chapitres.map(c => {
      const t = rel(c.querySelector('.histoire-texte'));
      const droite = etroit || c.dataset.cote !== 'gauche';
      const y = t.y + 34;
      return { c, y, droite, cle: c.dataset.chateau, bout: { x: droite ? t.x - 26 : t.x + t.w + 26, y: y + 22 } };
    });
    const o = rel(ouverture);
    const y0 = o.y + o.h - 30;
    const fins = arrivees.map(a => { const b = rel(a.querySelector('.logo-chateau') || a); return { cle: a.dataset.chateau, x: b.x + b.w / 2, y: b.y - 18 }; });
    const yFin = (fins.length ? Math.min(...fins.map(f => f.y)) : H) - (etroit ? 110 : 190);

    // la racine maîtresse : elle descend en ondulant, s'incline un peu vers chaque génération
    const amp = etroit ? 3 : 12;
    const pts = [{ x: xc, y: y0 }];
    for (let y = y0 + 110; y < yFin - 40; y += 115) {
      let x = xc + Math.sin(y / 310) * amp + (r() - .5) * amp * .7;
      noeuds.forEach(n => { x += (n.droite ? 1 : -1) * (etroit ? 0 : 7) * Math.exp(-Math.pow((y - n.y) / 90, 2)); });
      pts.push({ x, y });
    }
    pts.push({ x: xc, y: yFin });
    const axe = spline(pts, 5);
    const maitresse = trace(axe);
    const xA = y => { let i = 1; while (i < axe.length - 1 && axe[i].y < y) i++; const a = axe[i - 1], b = axe[i]; return a.x + (b.x - a.x) * clamp((y - a.y) / ((b.y - a.y) || 1), 0, 1); };
    const longueurA = y => {
      if (y <= axe[0].y) return 0;
      let a = 0, b = axe.length - 1;
      if (y >= axe[b].y) return maitresse.L;
      while (b - a > 1) { const m = (a + b) >> 1; if (axe[m].y < y) a = m; else b = m; }
      return maitresse.cum[a] + (maitresse.cum[b] - maitresse.cum[a]) * clamp((y - axe[a].y) / ((axe[b].y - axe[a].y) || 1), 0, 1);
    };
    // elle s'affine en descendant et se renfle à chaque nœud, comme un vrai bois
    const epaisseur = axe.map((p, i) => {
      let w = (etroit ? 2.2 : 3) - 1.4 * maitresse.cum[i] / maitresse.L;
      noeuds.forEach(n => { w += .9 * Math.exp(-Math.pow((p.y - n.y) / 8, 2)); });
      return { ...p, w };
    });
    const defs = el('defs', {}, svg);
    const revele = el('path', { d: maitresse.d, class: 'histoire-revele' }, el('mask', { id: 'histoire-masque', maskUnits: 'userSpaceOnUse', x: -20, y: 0, width: W + 40, height: H }, defs));
    revele.style.strokeDasharray = maitresse.L;
    revele.style.strokeDashoffset = maitresse.L;
    el('path', { d: maitresse.d, class: 'histoire-piste' }, svg);
    el('path', { d: ruban(epaisseur), class: 'histoire-maitresse' }, el('g', { mask: 'url(#histoire-masque)' }, svg));

    // une racine par génération, vers son récit, achevée par une feuille
    const branches = noeuds.map(n => {
      const sx = xA(n.y), sy = n.y, dx = n.bout.x - sx;
      const t = trace(spline([{ x: sx, y: sy }, { x: sx + dx * .22, y: sy + 9 }, { x: sx + dx * .62, y: n.bout.y - 2 + (r() - .5) * 8 }, { x: n.bout.x, y: n.bout.y }], 3));
      const chemin = el('path', { d: t.d, class: 'histoire-branche' + (n.cle ? ` histoire-branche--${n.cle}` : '') }, svg);
      chemin.style.strokeDasharray = t.L;
      chemin.style.strokeDashoffset = t.L;
      const f = feuille(etroit ? 12 : 16 + r() * 3);
      const tourne = (n.droite ? 98 : -98) + (r() - .5) * 16;
      const gf = el('g', { class: 'histoire-feuille' + (n.cle ? ` histoire-feuille--${n.cle}` : '') }, el('g', { transform: `translate(${n.bout.x.toFixed(1)} ${n.bout.y.toFixed(1)}) rotate(${tourne.toFixed(1)})` }, svg));
      el('path', { d: f.petiole, class: 'petiole' }, gf);
      el('path', { d: f.limbe, class: 'limbe' }, gf);
      el('path', { d: f.nervures, class: 'nervures' }, gf);
      return { n, chemin, t, gf };
    });

    // en bas, la racine se divise en trois et rejoint les trois châteaux
    const depart = { x: xA(yFin), y: yFin };
    const finales = fins.map(f => {
      const t = trace(spline([depart, { x: depart.x + (f.x - depart.x) * .12, y: depart.y + 34 }, { x: f.x + (depart.x - f.x) * .12, y: f.y - 46 }, f], 4));
      const chemin = el('path', { d: t.d, class: `histoire-finale histoire-finale--${f.cle}` }, svg);
      chemin.style.strokeDasharray = t.L;
      chemin.style.strokeDashoffset = t.L;
      return { t, chemin };
    });
    const pointe = el('circle', { r: etroit ? 2.4 : 3, class: 'histoire-pointe' }, svg);
    g = { maitresse, revele, longueurA, branches, finales, pointe, yFin, H };
    sec.classList.add('is-pret');
    dessiner();
  }

  // ce que montre le défilement : la pointe descend avec l'écran (à POINTE de sa hauteur)
  const viser = () => {
    const s = sec.getBoundingClientRect();
    return clamp(-s.top + innerHeight * POINTE, 0, sec.offsetHeight);
  };

  function dessiner() {
    if (!g) return;
    const y = actuel;
    const l = g.longueurA(y);
    g.revele.style.strokeDashoffset = g.maitresse.L - l;
    const p = g.maitresse.pointA(l);
    g.pointe.setAttribute('cx', p.x.toFixed(1));
    g.pointe.setAttribute('cy', p.y.toFixed(1));
    g.pointe.classList.toggle('is-cachee', l <= 0 || l >= g.maitresse.L - 1);
    const pas = innerHeight * .16;
    g.branches.forEach(b => {
      const q = clamp((y - b.n.y) / pas, 0, 1);
      b.chemin.style.strokeDashoffset = b.t.L * (1 - q);
      b.gf.classList.toggle('is-ouverte', q >= 1);
      b.n.c.classList.toggle('is-vu', q > .5);
    });
    const qf = clamp((y - g.yFin) / (innerHeight * .28), 0, 1);
    g.finales.forEach(f => { f.chemin.style.strokeDashoffset = f.t.L * (1 - qf); });
    final.classList.toggle('is-vu', qf > .05);
    final.classList.toggle('a-racines', qf >= 1);
  }

  const avancer = () => {
    actuel += (cible - actuel) * (reduit ? 1 : .12);
    if (Math.abs(cible - actuel) < .5) actuel = cible;
    dessiner();
    boucle = actuel !== cible ? requestAnimationFrame(avancer) : 0;
  };
  const suivre = () => {
    if (!g) return;
    cible = viser();
    if (!boucle) boucle = requestAnimationFrame(avancer);
  };

  // la forme dépend de la mise en page : on la reconstruit quand elle change (ouverture de l'onglet, polices, écran)
  let attente = 0;
  const reconstruire = () => {
    clearTimeout(attente);
    attente = setTimeout(() => {
      if (!sec.offsetParent && !sec.getClientRects().length) return;   // onglet fermé
      construire();
      cible = actuel = viser();
      dessiner();
    }, 60);
  };
  if ('ResizeObserver' in window) new ResizeObserver(reconstruire).observe(sec);
  window.addEventListener('resize', reconstruire);
  document.addEventListener('miailhe:onglet', e => {
    if (e.detail !== 'famille') return;
    sec.classList.remove('is-ouvert');
    requestAnimationFrame(() => sec.classList.add('is-ouvert'));
    reconstruire();
  });
  if (document.fonts) document.fonts.ready.then(reconstruire);
  document.addEventListener('scroll', suivre, { passive: true, capture: true });
  if (M.capture) { sec.classList.add('is-ouvert'); setTimeout(() => { construire(); actuel = cible = sec.offsetHeight; dessiner(); }, 300); }
})();
