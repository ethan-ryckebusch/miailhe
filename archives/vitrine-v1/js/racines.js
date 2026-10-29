/* La descente : un réseau de racines généré à la taille réelle de la page.
   Trois racines partent des trois châteaux et rejoignent la racine familiale
   à la date où chaque domaine est entré dans la famille. Elles poussent au défilement. */
(function () {
  const M = window.MIAILHE;
  const NS = 'http://www.w3.org/2000/svg';
  const descente = document.querySelector('.descente');
  if (!descente) return;
  const svg = descente.querySelector('.racines-svg');
  const portes = [...document.querySelectorAll('.surface .porte')];
  const actes = [...descente.querySelectorAll('.acte')];
  const finale = descente.querySelector('.finale');
  const jauge = document.querySelector('.profondeur');
  const reduce = M.reduceMotion;

  const el = (name, attrs = {}, parent) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);

  /* Catmull-Rom : passe par tous les points de contrôle, échantillonné finement */
  function spline(pts, pas = 5) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const n = Math.max(2, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / pas));
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        out.push({
          x: .5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          y: .5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        });
      }
    }
    out.push({ ...pts[pts.length - 1] });
    return out;
  }

  /* Ruban effilé : un polygone construit de part et d'autre de la ligne centrale */
  function ruban(s) {
    const g = [], d = [];
    for (let i = 0; i < s.length; i++) {
      const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
      let tx = b.x - a.x, ty = b.y - a.y; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      const h = s[i].w / 2;
      g.push(`${(s[i].x - ty * h).toFixed(1)} ${(s[i].y + tx * h).toFixed(1)}`);
      d.push(`${(s[i].x + ty * h).toFixed(1)} ${(s[i].y - tx * h).toFixed(1)}`);
    }
    return `M${g.join('L')}L${d.reverse().join('L')}Z`;
  }

  /* Radicelle : pousse vers le bas en ondulant, s'affine, peut se ramifier */
  function radicelle(r, x, y, angle, longueur, w0, profondeur, sortie) {
    const pts = [{ x, y, w: w0 }];
    const n = Math.max(4, Math.round(longueur / 6));
    let a = angle;
    for (let i = 1; i <= n; i++) {
      a += (r() - .5) * .38;
      a += (Math.PI / 2 - a) * .035; // la gravité ramène vers le bas
      x += Math.cos(a) * 6; y += Math.sin(a) * 6;
      pts.push({ x, y, w: Math.max(.45, w0 * (1 - i / n) + .35) });
      if (profondeur < 2 && i > n * .3 && r() < .045) {
        const cote = r() < .5 ? -1 : 1;
        radicelle(r, x, y, a + cote * (.5 + r() * .5), longueur * (.35 + r() * .25), pts[i].w * .8, profondeur + 1, sortie);
      }
    }
    sortie.push(ruban(pts));
  }

  let geo = null, maxFront = 0, ratio = 0;
  const rect = { pousse: null, seve: null };

  function construire() {
    const r = M.rng(1924);
    const W = descente.clientWidth, H = descente.offsetHeight;
    const top = descente.getBoundingClientRect().left;
    const mobile = W < 760, k = mobile ? .62 : 1;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = '';

    const defs = el('defs', {}, svg);
    const halo = el('radialGradient', { id: 'halo' }, defs);
    el('stop', { offset: '0', 'stop-color': '#fbe3d2', 'stop-opacity': '.95' }, halo);
    el('stop', { offset: '.3', 'stop-color': '#ecccb6', 'stop-opacity': '.38' }, halo);
    el('stop', { offset: '1', 'stop-color': '#ecccb6', 'stop-opacity': '0' }, halo);
    const cp = el('clipPath', { id: 'pousse' }, defs);
    rect.pousse = el('rect', { x: 0, y: 0, width: W, height: 0 }, cp);
    const cs = el('clipPath', { id: 'seve-bande' }, defs);
    rect.seve = el('rect', { x: 0, y: -999, width: W, height: 0 }, cs);

    // repères verticaux
    const ancres = actes.map(a => ({ id: a.id, noeud: a.dataset.noeud, y: a.offsetTop + a.offsetHeight * .5 }));
    const yN = id => (ancres.find(a => a.noeud === id) || {}).y;
    const yFin = finale.offsetTop + 70;
    const xs = portes.map(p => { const b = p.querySelector('.vignette').getBoundingClientRect(); return b.left + b.width / 2 - top; });
    const [xC, xV, xS] = xs.length === 3 ? xs : [W * .17, W * .5, W * .83];
    const xc = W / 2;

    // ---- décor : strates, galets, fossiles ----
    const decor = el('g', {}, svg);
    const bornes = [0, ...actes.map(a => a.offsetTop), finale.offsetTop];
    const noms = ['Terre vivante', 'Graves', 'Argile', 'Calcaire', 'Fossiles marins', 'La roche mère'];
    for (let i = 1; i < bornes.length; i++) {
      const y = bornes[i] - 30;
      let d = `M0 ${y}`;
      for (let x = 0; x <= W + 80; x += 80) d += `L${x} ${(y + Math.sin(x * .013 + i) * 7 + (r() - .5) * 6).toFixed(1)}`;
      el('path', { class: 'strate', d }, decor);
      const t = el('text', { class: 'strate-label', x: 18, y: y - 12 }, decor);
      t.textContent = noms[i] || '';
    }
    const bandeGraves = [bornes[1], bornes[2]], bandeCalc = [bornes[3], bornes[5]];
    const nG = Math.round(W / (mobile ? 18 : 12));
    for (let i = 0; i < nG; i++) {
      const y = lerp(bandeGraves[0], bandeGraves[1], r());
      el('ellipse', { class: 'galet', cx: (r() * W).toFixed(1), cy: y.toFixed(1), rx: (2 + r() * 6).toFixed(1), ry: (1.5 + r() * 3.5).toFixed(1) }, decor);
    }
    for (let i = 0; i < (mobile ? 4 : 9); i++) {
      const cx = r() * W, cy = lerp(bandeCalc[0], bandeCalc[1], r()), s = 8 + r() * 16;
      let d = `M${cx.toFixed(1)} ${cy.toFixed(1)}`;
      for (let a = 0; a < Math.PI * 5.2; a += .22) {
        const rad = s * .06 * Math.exp(.17 * a);
        d += `L${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad).toFixed(1)}`;
      }
      el('path', { class: 'fossile', d }, decor);
    }

    // ---- les racines principales ----
    const pousse = el('g', { 'clip-path': 'url(#pousse)' }, svg);
    const amp = Math.min(34, W * .03);
    // sur grand écran, le tronc passe dans la colonne laissée libre entre le texte et l'image de chaque acte
    const couloirs = mobile ? [] : actes.map(a => {
      const t = a.querySelector('.acte-texte').getBoundingClientRect(), m = a.querySelector('.acte-media').getBoundingClientRect();
      const x = a.classList.contains('acte--gauche') ? (t.right + m.left) / 2 : (m.right + t.left) / 2;
      return { x: x - top, y0: a.offsetTop + a.offsetHeight * .18, y1: a.offsetTop + a.offsetHeight * .82 };
    });
    const xCouloir = y => {
      for (const c of couloirs) if (y >= c.y0 && y <= c.y1) return c.x;
      return null;
    };
    const tronc = [];
    for (let y = 0; y <= yFin; y += 120) {
      const xCo = xCouloir(y);
      const x = xCo !== null ? xCo + Math.sin(y * .01) * 6 : (y < 300 ? lerp(xV, xc, y / 300) : xc) + Math.sin(y * .004) * amp + (r() - .5) * amp * .6;
      tronc.push({ x, y });
    }
    tronc.push({ x: xc, y: yFin + 40 });
    const troncS = spline(tronc);
    const xTronc = y => { let i = troncS.findIndex(p => p.y >= y); if (i < 1) return troncS[0].x; const a = troncS[i - 1], b = troncS[i]; return lerp(a.x, b.x, (y - a.y) / ((b.y - a.y) || 1)); };

    const lateral = (x0, yArr, cote, nom) => {
      const pts = [{ x: x0, y: 0 }];
      const xA = xTronc(yArr);
      for (let y = 150; y < yArr - 340; y += 160) pts.push({ x: x0 + Math.sin(y * .005 + cote) * amp * 1.2 + (r() - .5) * amp + (xc - x0) * .06 * (y / yArr), y });
      pts.push({ x: lerp(x0, xA, .5), y: yArr - 190 });
      pts.push({ x: xA - cote * 18, y: yArr - 50 });
      pts.push({ x: xA, y: yArr });
      return { nom, s: spline(pts) };
    };
    const yS = yN('soudars'), yV = yN('verdignan'), yC = yN('coufran'), yO = yN('origine');
    const principales = [
      { nom: 'tronc', s: troncS },
      lateral(xS, yS, 1, 'soudars'),
      lateral(xC, yC, -1, 'coufran'),
    ];
    // épaisseurs : le tronc grossit à chaque greffe, puis s'effile vers la roche mère
    const pas = (y, y0) => smooth(clamp((y - y0 + 80) / 160, 0, 1));
    principales[0].s.forEach(p => {
      let w = 7 + 2.2 * pas(p.y, yS) + 2.6 * pas(p.y, yV) + 3.6 * pas(p.y, yC);
      const t = clamp((p.y - yO) / (yFin - yO), 0, 1); w *= 1 - .72 * t;
      p.w = w * k;
    });
    principales.slice(1).forEach(R => R.s.forEach((p, i) => { p.w = (4.2 + 1.4 * (i / R.s.length)) * k; }));

    const chemins = [];
    principales.forEach(R => {
      chemins.push({ d: ruban(R.s), cls: 'racine' });
      // radicelles le long de chaque racine
      let suivant = 60 + r() * 80;
      R.s.forEach(p => {
        if (p.y < suivant || p.y > yFin - 40) return;
        suivant = p.y + 80 + r() * 150;
        const cote = r() < .5 ? -1 : 1;
        const prof = p.y / H;
        const out = [];
        radicelle(r, p.x, p.y, Math.PI / 2 + cote * (.65 + r() * .55), (40 + r() * 120 + prof * 140) * k, p.w * .42, 0, out);
        out.forEach(d => chemins.push({ d, cls: 'racine fine' }));
      });
    });
    // le chevelu de la racine mère, au plus profond
    for (let i = 0; i < 18; i++) {
      const p = troncS[Math.max(0, troncS.length - 1 - Math.floor(r() * 40))];
      const a = .2 + (i / 17) * (Math.PI - .4) + (r() - .5) * .2;
      const out = [];
      radicelle(r, p.x, p.y, a, (180 + r() * 340) * k, (2.4 + r() * 2) * k, 0, out);
      out.forEach(d => chemins.push({ d, cls: 'racine fine' }));
    }
    chemins.forEach(c => el('path', { class: c.cls, d: c.d }, pousse));

    // sève : copie lumineuse des racines principales, visible dans une bande
    const seve = el('g', { 'clip-path': 'url(#seve-bande)', opacity: 0, class: 'seve-groupe' }, svg);
    principales.forEach(R => el('path', { class: 'seve', d: ruban(R.s) }, seve));

    // nœuds de greffe
    const annees = { soudars: '1973', verdignan: '1972', coufran: '1924', origine: '1793' };
    const noeuds = ['soudars', 'verdignan', 'coufran', 'origine'].map(id => {
      const y = yN(id), x = xTronc(y);
      const g = el('g', { class: 'noeud' }, svg);
      el('circle', { class: 'halo', cx: x, cy: y, r: 54 }, g);
      el('circle', { class: 'coeur', cx: x, cy: y, r: 6.5 }, g);
      const t = el('text', { x, y: y - 22, 'text-anchor': 'middle' }, g);
      t.textContent = annees[id];
      return { id, y, g, lit: false };
    });

    // pointes lumineuses au front de croissance
    const pointes = principales.map(() => {
      const g = el('g', { opacity: 0 }, svg);
      el('circle', { class: 'pointe', r: 26 }, g);
      el('circle', { class: 'pointe-coeur', r: 2.6 }, g);
      return g;
    });
    const gouttes = principales.map(() => {
      const g = el('g', { opacity: 0 }, svg);
      el('circle', { class: 'pointe', r: 46 }, g);
      el('circle', { class: 'pointe-coeur', r: 4 }, g);
      return g;
    });

    geo = { W, H, principales, noeuds, pointes, gouttes, seve };
    maxFront = reduce ? H : ratio * H;
    maj(true);
  }

  const xA = (s, y) => {
    if (y < s[0].y || y > s[s.length - 1].y) return null;
    let lo = 0, hi = s.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m].y < y) lo = m; else hi = m; }
    const a = s[lo], b = s[hi];
    return lerp(a.x, b.x, (y - a.y) / ((b.y - a.y) || 1));
  };

  /* ---------- Mise à jour au défilement ---------- */
  let attente = false;
  function maj(force) {
    attente = false;
    if (!geo) return;
    const haut = descente.getBoundingClientRect().top;
    const vh = window.innerHeight;
    const front = -haut + vh * .7;
    if (front > maxFront || force) {
      maxFront = Math.max(maxFront, front);
      ratio = maxFront / geo.H;
      rect.pousse.setAttribute('height', Math.max(0, maxFront));
      geo.principales.forEach((R, i) => {
        const x = xA(R.s, maxFront);
        const g = geo.pointes[i];
        if (x === null || maxFront < 20 || reduce) { g.setAttribute('opacity', 0); return; }
        g.setAttribute('opacity', 1);
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${maxFront.toFixed(1)})`);
      });
      geo.noeuds.forEach(n => {
        if (!n.lit && maxFront >= n.y) {
          n.lit = true; n.g.classList.add('is-lit');
        }
      });
    }
    // jauge
    if (jauge) {
      const dedans = haut < vh * .5 && haut + geo.H > vh * .5;
      jauge.classList.toggle('is-visible', dedans);
      let actif = -1;
      actes.forEach((a, i) => { if (a.getBoundingClientRect().top < vh * .55) actif = i; });
      jauge.querySelectorAll('button').forEach((b, i) => b.classList.toggle('is-active', i === actif));
    }
    // les années gravées glissent légèrement
    if (!reduce) actes.forEach(a => {
      const r = a.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const t = (r.top + r.height / 2 - vh / 2) / vh;
      a.querySelector('.annee-fond').style.translate = `0 ${(t * -60).toFixed(1)}px`;
    });
  }
  const demander = () => { if (!attente) { attente = true; requestAnimationFrame(() => maj(false)); } };
  window.addEventListener('scroll', demander, { passive: true });

  /* ---------- Jauge de profondeur ---------- */
  if (jauge) {
    const ol = jauge.querySelector('ol');
    actes.forEach(a => {
      const li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button'; b.textContent = a.dataset.acte;
      b.addEventListener('click', () => window.scrollTo({ top: a.getBoundingClientRect().top + window.scrollY - 40, behavior: reduce ? 'auto' : 'smooth' }));
      li.appendChild(b); ol.appendChild(li);
    });
  }

  /* ---------- La sève remonte ---------- */
  const bouton = document.querySelector('[data-seve]');
  let enCours = null;
  const stop = () => { if (enCours) { cancelAnimationFrame(enCours.raf); fin(false); } };
  function fin(arrivee) {
    if (!enCours) return;
    enCours = null;
    geo.seve.setAttribute('opacity', 0);
    geo.gouttes.forEach(g => g.setAttribute('opacity', 0));
    ['wheel', 'touchstart', 'keydown'].forEach(e => window.removeEventListener(e, stop));
    if (arrivee) document.body.classList.add('seve-arrivee');
  }
  if (bouton) bouton.addEventListener('click', () => {
    document.body.classList.remove('seve-arrivee');
    const depart = window.scrollY, duree = reduce ? 1 : Math.min(9000, 2200 + depart * .9);
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let t0 = null;
    enCours = { raf: 0 };
    geo.seve.setAttribute('opacity', .95);
    ['wheel', 'touchstart', 'keydown'].forEach(e => window.addEventListener(e, stop, { passive: true }));
    const tick = ts => {
      if (!enCours) return;
      if (t0 === null) t0 = ts;
      const p = clamp((ts - t0) / duree, 0, 1);
      window.scrollTo(0, depart * (1 - ease(p)));
      const ySeve = -descente.getBoundingClientRect().top + window.innerHeight * .55;
      rect.seve.setAttribute('y', ySeve - 30);
      rect.seve.setAttribute('height', 260);
      geo.principales.forEach((R, i) => {
        const x = xA(R.s, ySeve), g = geo.gouttes[i];
        if (x === null) { g.setAttribute('opacity', 0); return; }
        g.setAttribute('opacity', 1); g.setAttribute('transform', `translate(${x.toFixed(1)} ${ySeve.toFixed(1)})`);
      });
      if (p < 1) enCours.raf = requestAnimationFrame(tick); else fin(true);
    };
    enCours.raf = requestAnimationFrame(tick);
  });

  /* ---------- Entrée en scène de la surface ---------- */
  M.quandEntre(() => {
    portes.forEach((p, i) => p.querySelectorAll('.trait').forEach((t, j) => { t.style.transitionDelay = `${(i * .45 + j * .025).toFixed(3)}s`; }));
    requestAnimationFrame(() => document.querySelector('.surface').classList.add('is-drawn'));
  });

  /* ---------- Construction et reconstruction ---------- */
  let minuteur;
  const reconstruire = () => { clearTimeout(minuteur); minuteur = setTimeout(construire, 200); };
  construire();
  window.addEventListener('resize', reconstruire);
  window.addEventListener('load', construire);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(construire);
})();
