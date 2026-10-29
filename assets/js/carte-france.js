/* « Où trouver nos vins » : la grande carte de France de la boutique (boutique.html#ou-trouver), 28/10/2026, demande de
   l'utilisateur : « une très grande carte de France interactive "Où trouver nos vins" et des points pour chaque vin (qui
   prend toute la largeur). Grande distribution Verdignan / Coufran : Auchan, Intermarché, Leclerc, Carrefour. Soudars :
   V and B ».
   - Les données (départements en Lambert-93, magasins des enseignes relevés sur OpenStreetMap) sont dans
     assets/js/carte-magasins.js, écrit par source/carte_france/construire_carte.py.
   - Un point par vin : en grande distribution, une paire de points or (Coufran) et bleu (Verdignan) ; chez V and B, un
     point vert (Soudars). Couleurs exactes de l'équipe.
   - Le fond (départements) est dessiné en Path2D sur un canvas, les points par lots, une couleur à la fois ; les trois
     châteaux et « vous êtes ici » sont des boutons posés sur la carte.
   - Filtres par vin et par enseigne, info-bulle au survol, clic sur un département : zoom animé et liste de ses
     magasins ; recherche par ville, code postal ou département ; « Autour de moi » (les 10 magasins les plus proches).
   - À l'arrivée, les points partent du Médoc et gagnent toute la France.
   - La même carte sert l'onglet « Où nous trouver » de l'accueil : data-boutique sur [data-carte-france] donne la page
     de la boutique pour ses liens (« Commander en ligne », le drive), et la carte défile alors dans son panneau.
   Tout ce que le script écrit passe par MIAILHE.t / tf (zone translate="no"). */
(function () {
  const M = (window.MIAILHE = window.MIAILHE || {});
  const C = window.MIAILHE_CARTE;
  const racine = document.querySelector('[data-carte-france]');
  if (!C || !racine || !window.Path2D) return;
  const t = s => (M.t ? M.t(s) : s);
  const tf = (s, ...v) => (M.tf ? M.tf(s, v) : s.replace(/\{(\d+)\}/g, (m, i) => v[i] ?? ''));
  const echapper = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lent = !M.reduceMotion;
  const A = window.MIAILHE_ARMOIRIES;
  const nombre = n => n.toLocaleString(document.documentElement.lang || 'fr');
  const BOUTIQUE = racine.dataset.boutique || '';     // vide sur la boutique, « boutique.html » ailleurs

  const COULEUR = { coufran: '#a97d2e', verdignan: '#0f4366', soudars: '#0f320a' };
  // la carte de nuit (29/10/2026, demande de l'utilisateur : une carte plus cinématographique) : sur le fond sombre, les
  // points prennent les teintes lumineuses des châteaux (les « vif » du site) et une lueur ; la France est tracée d'or
  const LUEUR = { coufran: '#e3b75e', verdignan: '#74b5ea', soudars: '#8fd17f' };
  const NUIT = { terre: '#1a1612', contour: 'rgba(201, 163, 90, .62)', limites: 'rgba(243, 236, 223, .085)', or: '230, 205, 148', ivoire: '246, 242, 233', fond: '13, 11, 9' };
  const VINS = [['coufran', 'Coufran', 'Louis · 1924'], ['verdignan', 'Verdignan', 'Jean · 1976'], ['soudars', 'Soudars', 'Éric · 1980']];
  const ENSEIGNES = [['leclerc', 'E.Leclerc'], ['carrefour', 'Carrefour'], ['intermarche', 'Intermarché'], ['auchan', 'Auchan'], ['vandb', 'V and B']];
  const NOM_ENSEIGNE = Object.fromEntries(ENSEIGNES);
  // ce qu'on trouve dans chaque enseigne (donné par l'utilisateur)
  const CARTE_DES_VINS = { leclerc: ['coufran', 'verdignan'], carrefour: ['coufran', 'verdignan'], intermarche: ['coufran', 'verdignan'], auchan: ['coufran', 'verdignan'], vandb: ['soudars'] };

  /* ---------- Lambert-93 : les mêmes formules que construire_carte.py ---------- */
  const lambert = (() => {
    const a = 6378137, e = 0.0818191910428158, r = Math.PI / 180;
    const m = p => Math.cos(p) / Math.sqrt(1 - (e * Math.sin(p)) ** 2);
    const tt = p => Math.tan(Math.PI / 4 - p / 2) / ((1 - e * Math.sin(p)) / (1 + e * Math.sin(p))) ** (e / 2);
    const p1 = 44 * r, p2 = 49 * r, p0 = 46.5 * r, l0 = 3 * r;
    const n = (Math.log(m(p1)) - Math.log(m(p2))) / (Math.log(tt(p1)) - Math.log(tt(p2)));
    const F = m(p1) / (n * tt(p1) ** n), rho0 = a * F * tt(p0) ** n;
    const { xmin, ymax } = C.projection;
    return (lat, lon) => {
      const rho = a * F * tt(lat * r) ** n, th = n * (lon * r - l0);
      return [(700000 + rho * Math.sin(th) - xmin) / 1000, (ymax - (6600000 + rho0 - rho * Math.cos(th))) / 1000];
    };
  })();
  const km = (a, b) => { const r = Math.PI / 180, d = Math.sin((b[0] - a[0]) * r / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin((b[1] - a[1]) * r / 2) ** 2; return 12742 * Math.asin(Math.sqrt(d)); };
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-'’]/g, ' ').replace(/\s+/g, ' ').trim();

  /* ---------- Les données ---------- */
  const deps = C.departements.map(([code, nom, d, b], i) => ({ i, code, nom, path: new Path2D(d), b }));
  const france = new Path2D();
  deps.forEach(d => france.addPath(d.path));
  const MAISON = C.chateaux.map(([k, lat, lon]) => ({ k, lat, lon, xy: lambert(lat, lon) }));
  const medoc = [MAISON.reduce((s, c) => s + c.lat, 0) / 3, MAISON.reduce((s, c) => s + c.lon, 0) / 3];
  const CENTRE = MAISON.reduce((s, m) => [s[0] + m.xy[0] / 3, s[1] + m.xy[1] / 3], [0, 0]);   // les trois châteaux, sur la carte
  const mags = C.magasins.map(([lat, lon, f, dep, nom, ville, cp, rue, pres], i) => {
    const [e, format] = C.formats[f], [x, y] = lambert(lat, lon);
    return { i, lat, lon, x, y, e, format, dep, nom, ville, cp, rue, pres, vins: CARTE_DES_VINS[e], loin: km(medoc, [lat, lon]), cle: pres ? '' : norm(ville) };
  });
  const LOIN = Math.max(...mags.map(m => m.loin));
  const bornes = (() => { const b = [Infinity, Infinity, -Infinity, -Infinity]; deps.forEach(d => { b[0] = Math.min(b[0], d.b[0]); b[1] = Math.min(b[1], d.b[1]); b[2] = Math.max(b[2], d.b[2]); b[3] = Math.max(b[3], d.b[3]); }); return b; })();
  // une grille de 10 km pour trouver vite le point sous le pointeur
  const GRILLE = 10, grille = new Map();
  mags.forEach(m => { const k = `${Math.floor(m.x / GRILLE)},${Math.floor(m.y / GRILLE)}`; (grille.get(k) || grille.set(k, []).get(k)).push(m); });

  /* ---------- L'état ---------- */
  const etat = {
    vins: new Set(VINS.map(v => v[0])), enseignes: new Set(ENSEIGNES.map(e => e[0])),
    dep: null, liste: null, magasin: null, survol: null, depSurvol: null, vous: null, surligne: null,
    vue: { k: 1, tx: 0, ty: 0 }, cible: null, revele: lent ? 0 : 1,
  };
  const visible = m => etat.enseignes.has(m.e) && m.vins.some(v => etat.vins.has(v));

  /* ---------- Le décor ---------- */
  const armoirie = k => `<span class="armoirie" data-armoirie="${k}">${A && A[k] ? `<svg viewBox="${A.viewBox}" aria-hidden="true" focusable="false"><path class="armoirie-fond" d="${A.bouclier}"/><path fill="currentColor" fill-rule="evenodd" d="${A[k].complet}"/></svg>` : ''}</span>`;
  const points = vins => `<span class="bq-carte-points">${vins.map(v => `<i style="--c:${COULEUR[v]};--l:${LUEUR[v]}"></i>`).join('')}</span>`;
  racine.innerHTML = `
    <div class="bq-carte-outils">
      <div class="bq-carte-vins" role="group" aria-label="${echapper(t('Les vins'))}">
        ${VINS.map(([k, nom, qui]) => `<button type="button" class="bq-carte-vin" data-vin="${k}" aria-pressed="true" style="--c:${COULEUR[k]};--l:${LUEUR[k]}">${armoirie(k)}<span><b>${nom}</b><small>${echapper(t(k === 'soudars' ? 'Chez V and B' : 'En grande distribution'))}</small></span><i class="bq-carte-coche" aria-hidden="true"></i></button>`).join('')}
      </div>
      <div class="bq-carte-enseignes" role="group" aria-label="${echapper(t('Les enseignes'))}">
        ${ENSEIGNES.map(([k, nom]) => `<button type="button" class="bq-carte-enseigne" data-enseigne="${k}" aria-pressed="true">${points(CARTE_DES_VINS[k])}<span>${nom}</span><b data-compte="${k}">0</b></button>`).join('')}
      </div>
      <form class="bq-carte-cherche" role="search" autocomplete="off">
        <label class="sr-only" for="carte-cherche">${echapper(t('Ville, code postal ou département'))}</label>
        <svg class="bq-carte-loupe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>
        <input id="carte-cherche" type="search" placeholder="${echapper(t('Ville, code postal ou département'))}" aria-autocomplete="list" aria-controls="carte-suggestions" data-cherche>
        <button class="bq-carte-ok" type="submit">${t('Chercher')}</button>
        <button class="bq-carte-moi" type="button" data-autour><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="7.5"/></svg>${t('Autour de moi')}</button>
        <ul class="bq-carte-suggestions" id="carte-suggestions" role="listbox" hidden data-suggestions></ul>
      </form>
    </div>
    <div class="bq-carte-scene">
      <div class="bq-carte-cadre" data-scene>
      <canvas class="bq-carte-toile" role="img" aria-label="${echapper(t('Carte de France des magasins où trouver les vins de la famille'))}"></canvas>
      <button class="bq-carte-maison" type="button" data-maison aria-label="${echapper(t('Les trois châteaux, à Saint-Seurin-de-Cadourne'))}"><span class="bq-carte-maison-onde" aria-hidden="true"></span><span class="bq-carte-maison-points" aria-hidden="true"><i style="--c:${COULEUR.coufran}"></i><i style="--c:${COULEUR.verdignan}"></i><i style="--c:${COULEUR.soudars}"></i></span><span class="bq-carte-maison-nom">${t('Les trois châteaux')}</span></button>
      <span class="bq-carte-vous" data-vous hidden aria-hidden="true"></span>
      <div class="bq-carte-bulle" data-bulle hidden></div>
      <div class="bq-carte-legende" aria-live="polite"><b data-total>0</b> <span data-total-mot>${t('magasins')}</span><small>${t('Disponibilité selon les magasins')}</small></div>
      <div class="bq-carte-zoom">
        <button type="button" data-zoom="1" aria-label="${echapper(t('Rapprocher'))}">+</button>
        <button type="button" data-zoom="-1" aria-label="${echapper(t('Éloigner'))}">−</button>
      </div>
      <button class="bq-carte-retour" type="button" data-france hidden><span aria-hidden="true">←</span> ${t('Toute la France')}</button>
      </div>
      <aside class="bq-carte-panneau" data-panneau hidden aria-live="polite"></aside>
    </div>`;

  const scene = racine.querySelector('[data-scene]'), toile = scene.querySelector('canvas'), ctx = toile.getContext('2d');
  const bulle = scene.querySelector('[data-bulle]'), panneau = racine.querySelector('[data-panneau]');
  const maison = scene.querySelector('[data-maison]'), vous = scene.querySelector('[data-vous]');
  const champ = racine.querySelector('[data-cherche]'), suggestions = racine.querySelector('[data-suggestions]');
  const retour = scene.querySelector('[data-france]');
  let W = 0, H = 0, dpr = 1;

  /* ---------- La vue : écran = carte × k + t ---------- */
  const large = () => W >= 900;                                   // le panneau se pose sur la carte, à droite
  const aire = () => { const p = panneau.hidden || !large() ? 0 : panneau.offsetWidth + 40; return { x: 0, w: W - p, h: H }; };
  function cadrer(b, marge = .08, kmax = Infinity) {
    const z = aire(), w = Math.max(b[2] - b[0], 4), h = Math.max(b[3] - b[1], 4);
    const k = Math.min(kmax, (z.w * (1 - 2 * marge)) / w, (z.h * (1 - 2 * marge)) / h);
    return { k, tx: z.x + z.w / 2 - (b[0] + b[2]) / 2 * k, ty: z.h / 2 - (b[1] + b[3]) / 2 * k };
  }
  const kFrance = () => cadrer(bornes, W < 600 ? .03 : .05).k;
  const KMAX = () => kFrance() * 60;
  let anim = null;
  // avant de montrer quelque chose, la carte vient se poser sous la barre de la boutique (sous l'en-tête, dans un
  // panneau de l'accueil, qui défile sur lui-même)
  function amener() {
    const barre = document.querySelector('.bq-barre') || document.querySelector('.site-header'), haut = barre ? Math.max(0, barre.getBoundingClientRect().bottom) : 0;
    const r = scene.getBoundingClientRect();
    if (r.top < haut - 2 || r.bottom > innerHeight + 2) (scene.closest('.panneau-defile') || window).scrollBy({ top: r.top - haut - 8, behavior: lent ? 'smooth' : 'auto' });
  }
  function aller(v, duree = 1000) {
    etat.cible = v;
    if (duree) amener();
    if (!lent || !duree) { etat.vue = v; dessiner(); return; }
    const de = { ...etat.vue }, t0 = performance.now();
    // on glisse le centre et on zoome en échelle logarithmique : le mouvement d'une caméra, pas d'une loupe
    const c0 = [(W / 2 - de.tx) / de.k, (H / 2 - de.ty) / de.k], c1 = [(W / 2 - v.tx) / v.k, (H / 2 - v.ty) / v.k];
    cancelAnimationFrame(anim);
    const pas = now => {
      const p = Math.min(1, (now - t0) / duree), e = p < .5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
      const k = Math.exp(Math.log(de.k) + (Math.log(v.k) - Math.log(de.k)) * e);
      const cx = c0[0] + (c1[0] - c0[0]) * e, cy = c0[1] + (c1[1] - c0[1]) * e;
      etat.vue = { k, tx: W / 2 - cx * k, ty: H / 2 - cy * k };
      dessiner();
      if (p < 1) anim = requestAnimationFrame(pas); else { etat.vue = v; dessiner(); }
    };
    anim = requestAnimationFrame(pas);
  }
  const enFrance = () => etat.vue.k < kFrance() * 1.15;

  /* ---------- Le dessin ---------- */
  function taille() {
    const r = scene.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    toile.width = Math.round(W * dpr); toile.height = Math.round(H * dpr);
    toile.style.width = W + 'px'; toile.style.height = H + 'px';
  }
  // le rayon des points : à l'échelle de la France, il suit la largeur de la carte (4 000 paires saturent un téléphone)
  const rayon = () => Math.min(W < 600 ? 5.5 : 7.5, Math.max(1.1, Math.min(2.1, W / 690)) * Math.sqrt(etat.vue.k / kFrance()));
  function dessiner() {
    const { k, tx, ty } = etat.vue;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, toile.width, toile.height);
    // la terre : une ombre portée, le contour de la France (le trait épais, recouvert à l'intérieur), les départements
    ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * tx, dpr * ty);
    ctx.save();
    ctx.shadowColor = `rgba(${NUIT.or}, .2)`; ctx.shadowBlur = 46 * dpr; ctx.shadowOffsetY = 0;
    ctx.fillStyle = NUIT.terre; ctx.fill(france);
    ctx.restore();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.2 / k; ctx.strokeStyle = NUIT.contour; ctx.stroke(france);
    ctx.fillStyle = NUIT.terre; ctx.fill(france);
    if (etat.dep != null) {
      ctx.fillStyle = `rgba(${NUIT.fond}, .55)`;
      deps.forEach(d => { if (d.i !== etat.dep) ctx.fill(d.path); });
    }
    if (etat.depSurvol != null && etat.depSurvol !== etat.dep) { ctx.fillStyle = `rgba(${NUIT.or}, .1)`; ctx.fill(deps[etat.depSurvol].path); }
    ctx.lineWidth = .7 / k; ctx.strokeStyle = NUIT.limites; ctx.stroke(france);
    if (etat.dep != null) { ctx.lineWidth = 1.6 / k; ctx.strokeStyle = `rgba(${NUIT.or}, .95)`; ctx.stroke(deps[etat.dep].path); }

    // les routes du Médoc : à l'arrivée, un arc d'or part des trois châteaux vers chaque grande ville et la pointe
    // court devant ; il reste ensuite, très fin (seulement à l'échelle de la France, sans recherche ni département)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (enFrance() && etat.dep == null && !etat.surligne) {
      const ax = CENTRE[0] * k + tx, ay = CENTRE[1] * k + ty;
      C.villes.forEach(([nom, x, y], i) => {
        if (nom === 'Bordeaux') return;
        const p = Math.max(0, Math.min(1, etat.revele * 1.7 - i * .06));
        if (!p) return;
        const bx = x * k + tx, by = y * k + ty, dx = bx - ax, dy = by - ay;
        const mx = (ax + bx) / 2 + dy * .22, my = (ay + by) / 2 - dx * .22;
        // l'arc jusqu'à p (de Casteljau) : contrôle q0, extrémité r
        const q0x = ax + (mx - ax) * p, q0y = ay + (my - ay) * p, q1x = mx + (bx - mx) * p, q1y = my + (by - my) * p;
        const rx = q0x + (q1x - q0x) * p, ry = q0y + (q1y - q0y) * p;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(q0x, q0y, rx, ry);
        ctx.lineWidth = 1.2; ctx.strokeStyle = `rgba(${NUIT.or}, ${p < 1 ? .7 : .34})`; ctx.stroke();
        if (p < 1) { ctx.beginPath(); ctx.arc(rx, ry, 2.4, 0, 7); ctx.fillStyle = `rgba(${NUIT.ivoire}, .95)`; ctx.fill(); }
      });
    }

    // les points : un lot par couleur ; une paire or et bleu en grande distribution, le vert chez V and B
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = rayon(), lots = { coufran: [], verdignan: [], soudars: [] }, pales = { coufran: [], verdignan: [], soudars: [] };
    const front = etat.revele * LOIN;
    for (const m of mags) {
      if (!visible(m) || m.loin > front) continue;
      const sx = m.x * k + tx, sy = m.y * k + ty;
      if (sx < -10 || sy < -10 || sx > W + 10 || sy > H + 10) continue;
      const neuf = etat.revele < 1 ? 1 + 1.2 * Math.max(0, 1 - (front - m.loin) / 60) : 1;
      // hors du département choisi, ou hors des magasins listés (autour d'un lieu, d'un code postal) : estompé
      const vins = m.vins.filter(v => etat.vins.has(v)), dehors = etat.surligne ? !etat.surligne.has(m) : etat.dep != null && m.dep !== etat.dep;
      // le vert de Soudars (173 caves parmi 4 000 magasins) un peu plus gros, et dessiné par-dessus
      vins.forEach((v, j) => (dehors ? pales : lots)[v].push(sx + (vins.length > 1 ? (j ? .62 : -.62) * r : 0), sy, r * neuf * (v === 'soudars' ? 1.3 : 1)));
    }
    for (const [v, l] of Object.entries(pales)) peindre(l, LUEUR[v], .16, false);
    for (const [v, l] of Object.entries(lots)) peindre(l, LUEUR[v], .95, true);
    // le magasin choisi ou survolé : un anneau
    for (const m of [etat.magasin, etat.survol]) {
      if (!m) continue;
      const sx = m.x * k + tx, sy = m.y * k + ty;
      ctx.beginPath(); ctx.arc(sx, sy, r * 2.4 + 3, 0, 7); ctx.lineWidth = 1.5; ctx.strokeStyle = `rgba(${NUIT.ivoire}, .95)`; ctx.stroke();
    }

    // les villes repères
    if (etat.revele > .2) {
      ctx.font = `500 ${W < 600 ? 10 : 11.5}px Circular, Jost, "Helvetica Neue", Arial, sans-serif`;
      ctx.textBaseline = 'middle';
      for (const [nom, x, y] of C.villes) {
        const sx = x * k + tx, sy = y * k + ty;
        if (sx < 0 || sy < 0 || sx > W || sy > H || (nom === 'Bordeaux' && !enFrance())) continue;
        ctx.globalAlpha = Math.min(1, (etat.revele - .2) * 3);
        ctx.fillStyle = `rgba(${NUIT.ivoire}, .88)`;
        ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, 7); ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = `rgba(${NUIT.fond}, .9)`; ctx.strokeText(nom, sx + 7, sy);
        ctx.fillText(nom, sx + 7, sy);
        ctx.globalAlpha = 1;
      }
    }
    poser();
  }
  // un lot de points d'une couleur ; allumés, ils ont une lueur (un halo large et pâle, ajouté à la lumière du fond)
  function peindre(l, couleur, alpha, lueur) {
    if (!l.length) return;
    if (lueur) {
      ctx.globalAlpha = .07;
      ctx.beginPath();
      for (let i = 0; i < l.length; i += 3) { const r = l[i + 2] * 2.4; ctx.moveTo(l[i] + r, l[i + 1]); ctx.arc(l[i], l[i + 1], r, 0, 6.2832); }
      ctx.fillStyle = couleur; ctx.fill();
    }
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    for (let i = 0; i < l.length; i += 3) { ctx.moveTo(l[i] + l[i + 2], l[i + 1]); ctx.arc(l[i], l[i + 1], l[i + 2], 0, 6.2832); }
    ctx.fillStyle = couleur; ctx.fill();
    ctx.globalAlpha = 1;
  }
  // les boutons posés sur la carte suivent la vue
  function poser() {
    const { k, tx, ty } = etat.vue, c = MAISON.reduce((s, m) => [s[0] + m.xy[0] / 3, s[1] + m.xy[1] / 3], [0, 0]);
    maison.style.transform = `translate(${c[0] * k + tx}px, ${c[1] * k + ty}px)`;
    maison.classList.toggle('is-visible', etat.revele > .05);
    if (etat.vous) { const [x, y] = lambert(...etat.vous); vous.style.transform = `translate(${x * k + tx}px, ${y * k + ty}px)`; }
  }

  /* ---------- Compter, filtrer ---------- */
  function compter() {
    const n = {}; let total = 0;
    ENSEIGNES.forEach(([e]) => { n[e] = 0; });
    mags.forEach(m => { if (m.vins.some(v => etat.vins.has(v))) { n[m.e]++; if (etat.enseignes.has(m.e)) total++; } });
    ENSEIGNES.forEach(([e]) => {
      racine.querySelector(`[data-compte="${e}"]`).textContent = nombre(n[e]);
      racine.querySelector(`[data-enseigne="${e}"]`).classList.toggle('is-vide', !n[e]);
    });
    racine.querySelector('[data-total]').textContent = nombre(total);
    racine.querySelector('[data-total-mot]').textContent = total > 1 ? t('magasins') : t('magasin');
  }
  racine.querySelectorAll('[data-vin]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.vin, on = !etat.vins.has(v);
    if (!on && etat.vins.size === 1) return;            // il reste toujours un vin
    on ? etat.vins.add(v) : etat.vins.delete(v);
    b.setAttribute('aria-pressed', on);
    compter(); rafraichir(); dessiner();
  }));
  racine.querySelectorAll('[data-enseigne]').forEach(b => b.addEventListener('click', () => {
    const e = b.dataset.enseigne, on = !etat.enseignes.has(e);
    if (!on && etat.enseignes.size === 1) return;
    on ? etat.enseignes.add(e) : etat.enseignes.delete(e);
    b.setAttribute('aria-pressed', on);
    compter(); rafraichir(); dessiner();
  }));

  /* ---------- Le panneau : une liste de magasins, un magasin, les châteaux, un message ---------- */
  // la ville d'OpenStreetMap, ou « près de » la commune dont le centre est le plus proche
  const lieu = m => m.pres ? tf('près de {0}', m.ville) : [m.cp, m.ville].filter(Boolean).join(' ') || deps[m.dep].nom;
  const titreMagasin = m => m.nom ? `${m.format} · ${m.nom}` : m.format;
  const nomsVins = m => m.vins.filter(v => etat.vins.has(v)).map(v => VINS.find(x => x[0] === v)[1]).join(' · ');
  function ouvrir(html, recadrer) {
    const etaitFerme = panneau.hidden;
    panneau.innerHTML = html;
    panneau.hidden = false;
    panneau.scrollTop = 0;
    if (etaitFerme && recadrer && large()) recadrer();
  }
  function fermer() {
    panneau.hidden = true; etat.liste = null; etat.magasin = null; etat.dep = null; etat.surligne = null;
    if (vous.classList.contains('is-lieu')) { etat.vous = null; vous.hidden = true; }   // la commune cherchée s'efface, « vous » reste
    retour.hidden = true;
    aller(cadrer(bornes, W < 600 ? .03 : .05));
  }
  function liste(titre, sous, items, distances, surligne = false) {
    etat.liste = { titre, sous, items, distances, surligne };
    etat.surligne = surligne ? new Set(items) : null;
    const vis = items.filter(visible);
    const groupes = ENSEIGNES.map(([e, nom]) => [e, nom, vis.filter(m => m.e === e)]).filter(g => g[2].length);
    const ligne = m => `<li><button type="button" class="bq-carte-item" data-magasin="${m.i}">
        ${points(m.vins.filter(v => etat.vins.has(v)))}
        <span><b>${echapper(titreMagasin(m))}</b><small>${echapper([m.rue, lieu(m)].filter(Boolean).join(', '))}</small></span>
        ${distances ? `<em>${echapper(tf('{0} km', nombre(Math.round(distances.get(m) * 10) / 10)))}</em>` : ''}</button></li>`;
    ouvrir(`<header class="bq-carte-panneau-tete">
        <p class="bq-sur">${echapper(sous)}</p>
        <h3>${echapper(titre)}</h3>
        <p class="bq-carte-panneau-compte">${echapper(vis.length > 1 ? tf('{0} magasins', nombre(vis.length)) : vis.length ? t('1 magasin') : t('Aucun magasin avec ces filtres'))}</p>
        <button class="bq-carte-fermer" type="button" data-fermer aria-label="${echapper(t('Fermer'))}">×</button>
      </header>
      ${distances ? `<ol class="bq-carte-liste">${vis.map(ligne).join('')}</ol>` : groupes.map(([e, nom, l]) => `<section class="bq-carte-groupe"><h4>${points(CARTE_DES_VINS[e])}${nom}<span>${nombre(l.length)}</span></h4><ul class="bq-carte-liste">${l.map(ligne).join('')}</ul></section>`).join('')}
      <p class="bq-carte-panneau-pied">${t('Disponibilité selon les magasins : appelez avant de vous déplacer.')} <a href="${BOUTIQUE}#la-cave">${t('Ou commandez en ligne')}</a></p>`);
  }
  function fiche(m) {
    etat.magasin = m;
    const dest = `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lon}`;
    const avant = etat.liste;
    ouvrir(`<header class="bq-carte-panneau-tete">
        ${avant ? `<button class="bq-carte-precedent" type="button" data-precedent>← ${echapper(avant.titre)}</button>` : ''}
        <p class="bq-sur">${echapper(m.e === 'vandb' ? t('Caviste') : t('Grande distribution'))}</p>
        <h3>${echapper(titreMagasin(m))}</h3>
        <button class="bq-carte-fermer" type="button" data-fermer aria-label="${echapper(t('Fermer'))}">×</button>
      </header>
      <p class="bq-carte-adresse">${[m.rue, lieu(m)].filter(Boolean).map(echapper).join('<br>')}<br><span>${echapper(deps[m.dep].nom)} (${deps[m.dep].code})</span></p>
      <p class="bq-sur">${t('On y trouve')}</p>
      <ul class="bq-carte-vins-ici">${m.vins.map(v => { const [, nom, qui] = VINS.find(x => x[0] === v); return `<li>${armoirie(v)}<span><b>Château ${nom}</b><small>${echapper(qui)}</small></span></li>`; }).join('')}</ul>
      <a class="bq-bouton bq-carte-itineraire" href="${dest}" target="_blank" rel="noopener">${t('Itinéraire')}</a>
      <p class="bq-carte-panneau-pied">${t('Disponibilité selon les magasins : appelez avant de vous déplacer.')} <a href="${BOUTIQUE}#la-cave">${t('Ou commandez en ligne')}</a></p>`);
    dessiner();
  }
  function chateaux() {
    etat.magasin = null;
    ouvrir(`<header class="bq-carte-panneau-tete">
        <p class="bq-sur">Saint-Seurin-de-Cadourne · Haut-Médoc</p>
        <h3>${t('Au château')}</h3>
        <button class="bq-carte-fermer" type="button" data-fermer aria-label="${echapper(t('Fermer'))}">×</button>
      </header>
      <ul class="bq-carte-vins-ici">${VINS.map(([k, nom, qui]) => `<li>${armoirie(k)}<span><b>Château ${nom}</b><small>${echapper(qui)}</small></span></li>`).join('')}</ul>
      <p class="bq-carte-adresse">${t('Les trois châteaux sont voisins, à Saint-Seurin-de-Cadourne. On les visite sur rendez-vous, et le drive du château vous remet votre commande dans votre coffre.')}</p>
      <a class="bq-bouton" href="${BOUTIQUE}#livraison">${t('Le drive du château')}</a>`);
    const b = MAISON.reduce((s, m) => [Math.min(s[0], m.xy[0]), Math.min(s[1], m.xy[1]), Math.max(s[2], m.xy[0]), Math.max(s[3], m.xy[1])], [Infinity, Infinity, -Infinity, -Infinity]);
    etat.dep = deps.findIndex(d => d.code === '33');
    retour.hidden = false;
    aller(cadrer([b[0] - 40, b[1] - 40, b[2] + 40, b[3] + 40], .08));
  }
  function message(titre, texte) {
    ouvrir(`<header class="bq-carte-panneau-tete"><h3>${echapper(titre)}</h3><button class="bq-carte-fermer" type="button" data-fermer aria-label="${echapper(t('Fermer'))}">×</button></header>
      <p class="bq-carte-adresse">${texte}</p>
      <a class="bq-bouton" href="${BOUTIQUE}#la-cave">${t('Commander en ligne')}</a>`);
  }
  const rafraichir = () => { if (etat.liste && !etat.magasin) liste(etat.liste.titre, etat.liste.sous, etat.liste.items, etat.liste.distances, etat.liste.surligne); };
  panneau.addEventListener('click', e => {
    const b = e.target.closest('button, a');
    if (!b) return;
    if (b.matches('[data-fermer]')) fermer();
    else if (b.matches('[data-precedent]')) { etat.magasin = null; rafraichir(); dessiner(); }
    else if (b.matches('[data-magasin]')) {
      const m = mags[+b.dataset.magasin];
      fiche(m);
      const z = Math.max(etat.vue.k, kFrance() * 9);
      const a = aire();
      aller({ k: z, tx: a.x + a.w / 2 - m.x * z, ty: a.h / 2 - m.y * z }, 800);
    }
  });
  retour.addEventListener('click', fermer);
  maison.addEventListener('click', chateaux);

  /* ---------- Les départements ---------- */
  function departement(i) {
    const d = deps[i];
    etat.dep = i; etat.magasin = null;
    retour.hidden = false;
    liste(d.nom, tf('Département {0}', d.code), mags.filter(m => m.dep === i));   // (liste remet le surlignage à zéro)
    aller(cadrer(d.b, .1, KMAX()));
  }

  /* ---------- Le pointeur : survol d'un point, d'un département ---------- */
  const versCarte = (x, y) => [(x - etat.vue.tx) / etat.vue.k, (y - etat.vue.ty) / etat.vue.k];
  function sous(x, y) {
    const [cx, cy] = versCarte(x, y), r = (rayon() * 1.6 + 4) / etat.vue.k;
    let best = null, bd = r * r;
    const gx = Math.floor(cx / GRILLE), gy = Math.floor(cy / GRILLE), n = Math.ceil(r / GRILLE);
    for (let i = gx - n; i <= gx + n; i++) for (let j = gy - n; j <= gy + n; j++) for (const m of grille.get(`${i},${j}`) || []) {
      if (!visible(m) || m.loin > etat.revele * LOIN) continue;
      const d = (m.x - cx) ** 2 + (m.y - cy) ** 2;
      if (d < bd) { bd = d; best = m; }
    }
    return best;
  }
  function depSous(x, y) {
    const [cx, cy] = versCarte(x, y);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const d = deps.find(d => cx >= d.b[0] && cx <= d.b[2] && cy >= d.b[1] && cy <= d.b[3] && ctx.isPointInPath(d.path, cx, cy));
    return d ? d.i : null;
  }
  function montrerBulle(m, x, y) {
    if (!m) { bulle.hidden = true; return; }
    bulle.innerHTML = `${points(m.vins.filter(v => etat.vins.has(v)))}<b>${echapper(titreMagasin(m))}</b><small>${echapper(lieu(m))}</small><em>${echapper(nomsVins(m))}</em>`;
    bulle.hidden = false;
    const bw = bulle.offsetWidth, bh = bulle.offsetHeight;
    bulle.style.transform = `translate(${Math.min(W - bw - 8, Math.max(8, x - bw / 2))}px, ${y - bh - 16 < 8 ? y + 18 : y - bh - 16}px)`;
  }
  const point = e => { const r = toile.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  toile.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const [x, y] = point(e), m = sous(x, y), d = m ? null : depSous(x, y);
    if (m !== etat.survol || d !== etat.depSurvol) { etat.survol = m; etat.depSurvol = d; dessiner(); }
    montrerBulle(m, x, y);
    toile.style.cursor = m || d != null ? 'pointer' : 'default';
  });
  toile.addEventListener('pointerleave', () => { etat.survol = null; etat.depSurvol = null; bulle.hidden = true; dessiner(); });
  toile.addEventListener('click', e => {
    const [x, y] = point(e), m = sous(x, y);
    if (m) {
      if (e.pointerType === 'touch' || !e.pointerType) montrerBulle(m, x, y);
      // un magasin de la liste en cours la garde (le retour y ramène) ; sinon, on passe à la liste de son département
      const garder = etat.surligne ? etat.surligne.has(m) : etat.dep === m.dep;
      if (!garder) { etat.dep = m.dep; retour.hidden = false; liste(deps[m.dep].nom, tf('Département {0}', deps[m.dep].code), mags.filter(x => x.dep === m.dep)); }
      fiche(m);
      return;
    }
    bulle.hidden = true;
    const d = depSous(x, y);
    if (d != null) departement(d);
  });
  scene.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => {
    const f = +b.dataset.zoom > 0 ? 1.8 : 1 / 1.8, v = etat.vue, a = aire();
    const k = Math.min(KMAX(), Math.max(kFrance(), v.k * f)), cx = (a.x + a.w / 2 - v.tx) / v.k, cy = (a.h / 2 - v.ty) / v.k;
    aller(k <= kFrance() * 1.01 ? cadrer(bornes, W < 600 ? .03 : .05) : { k, tx: a.x + a.w / 2 - cx * k, ty: a.h / 2 - cy * k }, 500);
    retour.hidden = k <= kFrance() * 1.01;
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panneau.hidden && racine.contains(document.activeElement)) fermer(); });

  /* ---------- La recherche : commune, code postal, département ---------- */
  // les communes de métropole (assets/js/carte-communes.js, 1,2 Mo) ne sont chargées que quand on cherche
  let communes = null;
  function chargerCommunes() {
    if (communes || document.querySelector('script[data-communes]')) return;
    const s = document.createElement('script');
    s.src = (document.querySelector('script[src$="carte-france.js"]').getAttribute('src') || '').replace('carte-france.js', 'carte-communes.js');
    s.dataset.communes = '';
    s.onload = () => {
      communes = (window.MIAILHE_COMMUNES || '').split('\n').map(l => { const [nom, cps, la, lo, p] = l.split(';'); const cp = cps.split(','); return { nom, cp: cp[0], cps: cp, lat: la / 1000, lon: lo / 1000, p: +p, cle: norm(nom) }; });
      if (document.activeElement === champ && champ.value) champ.dispatchEvent(new Event('input'));
    };
    document.head.appendChild(s);
  }
  champ.addEventListener('focus', chargerCommunes);
  champ.addEventListener('pointerenter', chargerCommunes);
  const villes = (() => {
    const v = new Map();
    mags.forEach(m => { if (!m.cle) return; const k = `${m.cle}|${(m.cp || '').slice(0, 2)}`; if (!v.has(k)) v.set(k, { nom: m.ville, cp: (m.cp || '').slice(0, 2), cle: m.cle, n: 0 }); v.get(k).n++; });
    return [...v.values()];
  })();
  function trouver(q) {
    const n = norm(q);
    if (!n) return [];
    const out = [];
    deps.forEach(d => { if (norm(d.code) === n || (n.length > 1 && norm(d.nom).startsWith(n))) out.push({ type: 'dep', d, label: `${d.nom} (${d.code})` }); });
    if (communes) {
      // une commune par son nom ou son code postal : la carte montre les magasins les plus proches de son centre
      const cp = /^\d{3,5}$/.test(n);
      const l = cp ? communes.filter(c => c.cps.some(x => x.startsWith(n))) : n.length > 1 ? communes.filter(c => c.cle.startsWith(n)) : [];
      l.sort((a, b) => (b.cle === n || b.cps.includes(n)) - (a.cle === n || a.cps.includes(n)) || b.p - a.p)
        .slice(0, 6).forEach(c => out.push({ type: 'commune', c, label: `${c.nom} (${cp ? c.cps.find(x => x.startsWith(n)) : c.cp})` }));
    } else {
      if (/^\d{3,5}$/.test(n)) {
        const l = mags.filter(m => (m.cp || '').startsWith(n));
        if (l.length) out.unshift({ type: 'cp', cp: n, l, label: tf('Code postal {0}', n) });
      }
      villes.filter(v => v.cle.startsWith(n)).sort((a, b) => (a.cle === n ? -1 : 0) - (b.cle === n ? -1 : 0) || b.n - a.n)
        .slice(0, 6).forEach(v => out.push({ type: 'ville', v, label: `${v.nom}${v.cp ? ` (${v.cp})` : ''}` }));
    }
    return out.slice(0, 7);
  }
  function choisir(r) {
    suggestions.hidden = true;
    if (!r) return;
    champ.value = r.label;
    if (r.type === 'dep') { departement(r.d.i); return; }
    if (r.type === 'commune') { autour([r.c.lat, r.c.lon], tf('Autour de {0}', r.c.nom), t('Les plus proches'), false); return; }
    const l = r.type === 'cp' ? r.l : mags.filter(m => m.cle === r.v.cle && (m.cp || '').slice(0, 2) === r.v.cp);
    zone(l, r.type === 'cp' ? r.label : r.v.nom, r.type === 'cp' ? t('Code postal') : t('Ville'));
  }
  function zone(l, titre, sous) {
    etat.magasin = null;
    const b = l.reduce((s, m) => [Math.min(s[0], m.x), Math.min(s[1], m.y), Math.max(s[2], m.x), Math.max(s[3], m.y)], [Infinity, Infinity, -Infinity, -Infinity]);
    const dep = l.length && l.every(m => m.dep === l[0].dep) ? l[0].dep : null;
    etat.dep = dep;
    retour.hidden = false;
    liste(titre, sous, l, null, true);
    aller(cadrer([b[0] - 3, b[1] - 3, b[2] + 3, b[3] + 3], .12, KMAX() * .6));
  }
  champ.addEventListener('input', () => {
    const r = trouver(champ.value);
    suggestions.innerHTML = r.map((x, i) => `<li role="option"><button type="button" data-suggestion="${i}">${echapper(x.label)}</button></li>`).join('');
    suggestions.hidden = !r.length;
    suggestions._r = r;
  });
  suggestions.addEventListener('click', e => { const b = e.target.closest('[data-suggestion]'); if (b) choisir(suggestions._r[+b.dataset.suggestion]); });
  racine.querySelector('.bq-carte-cherche').addEventListener('submit', e => {
    e.preventDefault();
    const r = trouver(champ.value);
    if (r.length) { choisir(r[0]); return; }
    suggestions.hidden = true;
    message(tf('Rien trouvé pour « {0} »', champ.value.trim()), t('Essayez une ville, un code postal ou un département. La boutique livre aussi partout en France métropolitaine.'));
  });
  document.addEventListener('click', e => { if (!e.target.closest('.bq-carte-cherche')) suggestions.hidden = true; });

  /* ---------- Autour d'un lieu : une commune cherchée, ou vous ---------- */
  function autour(pos, titre, sous, estVous) {
    etat.vous = pos;
    vous.hidden = false;
    vous.classList.toggle('is-lieu', !estVous);
    const d = new Map();
    const proches = mags.filter(visible).map(m => (d.set(m, km(pos, [m.lat, m.lon])), m)).sort((a, b) => d.get(a) - d.get(b)).slice(0, 10);
    etat.dep = null; etat.magasin = null;
    retour.hidden = false;
    liste(titre, sous, proches, d, true);
    const [vx, vy] = lambert(...pos);
    const bb = proches.reduce((s, m) => [Math.min(s[0], m.x), Math.min(s[1], m.y), Math.max(s[2], m.x), Math.max(s[3], m.y)], [vx, vy, vx, vy]);
    aller(cadrer([bb[0] - 2, bb[1] - 2, bb[2] + 2, bb[3] + 2], .12, KMAX() * .75));
  }

  /* ---------- Autour de moi ---------- */
  racine.querySelector('[data-autour]').addEventListener('click', () => {
    if (!navigator.geolocation) { message(t('Autour de moi'), t('Votre navigateur ne donne pas votre position. Cherchez plutôt votre ville ou votre code postal.')); return; }
    const b = racine.querySelector('[data-autour]');
    b.classList.add('is-cherche');
    navigator.geolocation.getCurrentPosition(p => {
      b.classList.remove('is-cherche');
      autour([p.coords.latitude, p.coords.longitude], t('Les plus proches de vous'), t('Autour de moi'), true);
    }, () => {
      b.classList.remove('is-cherche');
      message(t('Autour de moi'), t('Votre position n’a pas pu être obtenue. Cherchez plutôt votre ville ou votre code postal.'));
    }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 600000 });
  });

  /* ---------- L'arrivée : les points partent du Médoc et gagnent la France ---------- */
  function mettreEnPlace() {
    taille();
    etat.vue = cadrer(bornes, W < 600 ? .03 : .05);
    dessiner();
  }
  mettreEnPlace();
  compter();
  let reveleLance = !lent;
  const reveler = () => {
    if (reveleLance) return;
    reveleLance = true;
    const t0 = performance.now(), D = 2600;
    const pas = now => { const p = Math.min(1, (now - t0) / D); etat.revele = 1 - (1 - p) ** 2.2; dessiner(); if (p < 1) requestAnimationFrame(pas); };
    requestAnimationFrame(pas);
  };
  if ('IntersectionObserver' in window && lent) {
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { reveler(); o.disconnect(); } }), { threshold: .35 }).observe(scene);
  } else { etat.revele = 1; dessiner(); }
  // la taille change : on garde ce qu'on regardait
  let attente;
  new ResizeObserver(() => {
    clearTimeout(attente);
    attente = setTimeout(() => {
      const avant = { W, H, v: etat.vue };
      taille();
      if (!avant.W) return mettreEnPlace();
      const cx = (avant.W / 2 - avant.v.tx) / avant.v.k, cy = (avant.H / 2 - avant.v.ty) / avant.v.k;
      const k = enFrance() ? cadrer(bornes, W < 600 ? .03 : .05).k : avant.v.k * W / avant.W;
      etat.vue = enFrance() ? cadrer(bornes, W < 600 ? .03 : .05) : { k, tx: W / 2 - cx * k, ty: H / 2 - cy * k };
      dessiner();
    }, 80);
  }).observe(scene);

  // pour vérifier de l'extérieur (Playwright)
  M.carte = { etat, mags, deps, departement, choisir: q => choisir(trouver(q)[0]), fermer };
})();
