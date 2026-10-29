/* Intro de l'accueil, sur le modèle de The Symphony of Vines. Sur fond noir, le logo sort du flou
   et un sarment de vigne traverse l'écran. Trois feuilles de vigne s'y ouvrent, une par château,
   comme les trois feuilles du logo ; de chacune descend une racine qui écrit le nom du château,
   dans l'ordre où ils sont entrés dans la famille : Coufran (1924), Verdignan (1972), Soudars (1973).
   Les trois racines ne se ressemblent pas (28/10/2026) : chacune annonce l'élément MIAILHE de son logo (trois racines
   de tailles différentes pour Coufran, un pivot qui plonge pour Verdignan, une coulure en S finie par la feuille pour
   Soudars). La feuille est partout celle du logo (assets/js/feuille-miailhe.js).
   La porte d'âge (main.js) appelle MIAILHE.intro(porte) et attend la fin de l'intro. */
(function () {
  const M = (window.MIAILHE = window.MIAILHE || {});
  const NS = 'http://www.w3.org/2000/svg';

  const el = (name, attrs = {}, parent) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const douce = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  /* Catmull-Rom échantillonné : une ligne souple qui passe par tous les points */
  function spline(pts, pas = 4) {
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

  /* Un tracé dont on connaît la longueur cumulée, pour savoir où se trouve sa pointe */
  function trace(poly) {
    const cum = [0];
    for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i].x - poly[i - 1].x, poly[i].y - poly[i - 1].y));
    const d = 'M' + poly.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L');
    const pointA = l => {
      let a = 0, b = cum.length - 1;
      while (b - a > 1) { const m = (a + b) >> 1; if (cum[m] < l) a = m; else b = m; }
      const t = clamp((l - cum[a]) / ((cum[b] - cum[a]) || 1), 0, 1);
      return { x: poly[a].x + (poly[b].x - poly[a].x) * t, y: poly[a].y + (poly[b].y - poly[a].y) * t };
    };
    return { poly, cum, d, L: cum[cum.length - 1], pointA };
  }

  /* Ruban effilé : un polygone construit de part et d'autre de la ligne centrale (largeur w) */
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

  /* La feuille de vigne : celle du logo MIAILHE (28/10/2026, demande de l'utilisateur : partout la même feuille que le
     logo). Son tracé vient de assets/js/feuille-miailhe.js (découpé dans le vrai logo par Logos/source/feuille_site.py :
     pétiole en (0, 0), pointe vers le bas, hauteur 100, nervure en creux, fill-rule evenodd).
     feuille(t, pend) : pétiole en (0, 0) ; la feuille se dresse au-dessus de son point d'attache (sur le sarment, au
     bout d'une racine de l'histoire), ou pend dessous si pend est vrai (au bout d'une racine, comme dans le logo).
     t = taille, comme l'ancienne feuille dessinée (sa hauteur fait environ 1,5 t). */
  const transformer = (d, f) => {
    // les commandes absolues de feuille-miailhe.js : M L C Q H V Z (H et V deviennent des L)
    const out = [];
    let x = 0, y = 0;
    const re = /([MLCQHVZ])([^MLCQHVZ]*)/g;
    let m;
    while ((m = re.exec(d))) {
      const c = m[1], n = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
      if (c === 'Z') { out.push('Z'); continue; }
      if (c === 'H' || c === 'V') {
        n.forEach(v => { if (c === 'H') x = v; else y = v; const [a, b] = f(x, y); out.push(`L${a.toFixed(2)} ${b.toFixed(2)}`); });
        continue;
      }
      const pts = [];
      for (let i = 0; i + 1 < n.length; i += 2) { const [a, b] = f(n[i], n[i + 1]); pts.push(`${a.toFixed(2)} ${b.toFixed(2)}`); x = n[i]; y = n[i + 1]; }
      out.push(c + pts.join(' '));
    }
    return out.join('');
  };
  const FEUILLE = window.MIAILHE_FEUILLE;
  function feuille(t, pend) {
    if (FEUILLE) {
      const k = t * 1.5 / FEUILLE.hauteur, sens = pend ? 1 : -1;
      // dressée : on la tourne d'un demi-tour (pointe vers le haut) ; pendante : telle quelle
      return { limbe: transformer(FEUILLE.d, (x, y) => [x * k * sens, y * k * sens]), nervures: '', petiole: 'M0 0' };
    }
    return feuilleDessinee(t);
  }

  /* L'ancienne feuille dessinée (cinq lobes dentés), si feuille-miailhe.js manque.
     Pétiole en (0, 0), limbe vers le haut ; t = taille. Rayon du contour selon l'angle (0° = pointe du lobe central). */
  const LOBES = [[0, .98], [14, .86], [28, .6], [42, .8], [54, .9], [68, .76], [83, .56], [98, .68], [110, .74], [126, .62], [146, .58], [164, .32], [180, .22]];
  const SINUS = [28, 83, 164];
  function feuilleDessinee(t) {
    const p = t * .3;
    const R = a => {
      const s = Math.abs(a);
      for (let i = 1; i < LOBES.length; i++) if (s <= LOBES[i][0]) {
        const [a0, r0] = LOBES[i - 1], [a1, r1] = LOBES[i], u = (s - a0) / (a1 - a0);
        return r0 + (r1 - r0) * u * u * (3 - 2 * u);
      }
      return .22;
    };
    const pts = [];
    for (let a = -176, i = 0; a <= 176; a += 4, i++) {
      const loin = Math.min(1, Math.min(...SINUS.map(q => Math.abs(Math.abs(a) - q))) / 9); // pas de dents au fond des sinus
      const r = R(a) * (1 + (i % 2 ? -.01 : .06) * loin) * t, rad = a * Math.PI / 180;
      pts.push(`${(Math.sin(rad) * r).toFixed(1)} ${(-p - Math.cos(rad) * r).toFixed(1)}`);
    }
    const nervures = [0, -54, 54, -110, 110].map(a => {
      const rad = a * Math.PI / 180, l = R(a) * t * .78, c = Math.cos(rad), s = Math.sin(rad);
      return `M0 ${(-p).toFixed(1)}Q${(s * l * .5 + c * l * .05).toFixed(1)} ${(-p - c * l * .5 + s * l * .05).toFixed(1)} ${(s * l).toFixed(1)} ${(-p - c * l).toFixed(1)}`;
    }).join('');
    return { limbe: 'M' + pts.join('L') + 'Z', nervures, petiole: `M0 0Q${(t * .05).toFixed(1)} ${(-p * .5).toFixed(1)} 0 ${(-p).toFixed(1)}` };
  }

  // Les mêmes outils servent à l'histoire de la famille (histoire.js) : même sarment, mêmes racines, mêmes feuilles
  M.vigne = { el, clamp, douce, spline, trace, ruban, feuille };

  M.intro = porte => new Promise(fin => {
    const intro = porte.querySelector('.intro-ecran');
    if (!intro) { fin(); return; }
    // pas d'intro si l'on vient de changer de langue sur la porte d'âge (langue.js)
    if (M.reduceMotion || M.introSautee) { intro.remove(); fin(); return; }
    const svg = intro.querySelector('.intro-svg');
    const noms = [...intro.querySelectorAll('.intro-nom')];
    const r = M.rng ? M.rng(1793) : Math.random;

    let fini = false;
    const terminer = () => {
      if (fini) return;
      fini = true;
      document.removeEventListener('keydown', terminer);
      intro.classList.add('is-fini');
      setTimeout(() => intro.remove(), 1000);
      fin();
    };
    // Un clic ou une touche passe l'intro
    intro.addEventListener('click', terminer);
    document.addEventListener('keydown', terminer);

    requestAnimationFrame(() => intro.classList.add('is-joue'));
    const polices = document.fonts ? Promise.race([document.fonts.ready, new Promise(ok => setTimeout(ok, 2500))]) : Promise.resolve();
    polices.then(() => { if (!fini) dessiner(); });

    function dessiner() {
      const zone = svg.getBoundingClientRect();
      const W = zone.width, H = zone.height;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const k = Math.min(1, W / 900);       // boucles des noms plus serrées sur petit écran
      const e = clamp(W / 1200, .6, 1);     // taille des feuilles et épaisseur du sarment

      // Fondu sur les bords de l'écran, comme la ligne de The Symphony of Vines
      const defs = el('defs', {}, svg);
      const grad = el('linearGradient', { id: 'intro-fondu' }, defs);
      [[0, 0], [.08, 1], [.92, 1], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': '#fff', 'stop-opacity': a }, grad));
      el('rect', { width: W, height: H, fill: 'url(#intro-fondu)' }, el('mask', { id: 'intro-masque', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs));
      const gVigne = el('g', { mask: 'url(#intro-masque)' }, svg);

      // Le sarment traverse l'écran de bord à bord en ondulant doucement
      const y0 = H * .2;
      const pas = Math.max(40, W / 28);
      const pts = [];
      for (let x = -20; x <= W + 20 + pas; x += pas) pts.push({ x, y: y0 + Math.sin(x / W * 7.3 + 1) * H * .022 + (r() - .5) * H * .03 });
      const axe = spline(pts);
      const sarment = trace(axe);
      const yA = x => { let i = 1; while (i < axe.length - 1 && axe[i].x < x) i++; return axe[i - 1].y + (axe[i].y - axe[i - 1].y) * clamp((x - axe[i - 1].x) / ((axe[i].x - axe[i - 1].x) || 1), 0, 1); };

      // Une racine par château : elle descend du sarment puis souligne le nom en l'écrivant,
      // comme une plume qui attaque la première lettre et se relève à la fin du mot.
      // Les trois racines ne se ressemblent pas (28/10/2026, demande de l'utilisateur) : chacune annonce l'élément
      // MIAILHE de son logo. Coufran : trois racines de tailles différentes, comme sous son F. Verdignan : un pivot
      // droit qui plonge sous la ligne, comme son I. Soudars : une coulure en S, comme son d, qui finit sur la feuille.
      // La racine souligne toute la boîte du logo (la même pour les trois), mais ne touche jamais les lettres
      // (demande du 28/10/2026) : on vérifie chaque tracé contre l'encre des trois logos ; s'il en approche à moins de
      // `garde`, la racine contourne le mot par la gauche, au-dessus puis le long de sa première lettre.
      const encres = noms.map(nom => nom.querySelector('.mot svg path')).filter(Boolean)
        .map(p => ({ p, inv: p.getScreenCTM() && p.getScreenCTM().inverse() })).filter(x => x.inv);
      const touche = (t, garde) => {
        for (let l = 0; l <= t.L; l += 3) {
          const p = t.pointA(l);
          for (let a = 0; a < 12; a++) {
            const X = p.x + zone.left + garde * Math.cos(a * Math.PI / 6), Y = p.y + zone.top + garde * Math.sin(a * Math.PI / 6);
            for (const { p: e, inv } of encres) if (e.isPointInFill(new DOMPoint(X, Y).matrixTransform(inv))) return true;
          }
        }
        return false;
      };
      let encreDroite = -Infinity;          // le bord droit de l'encre du nom précédent (le pivot de Verdignan passe entre)
      let finPrecedente = -Infinity;        // où finit le soulignement précédent
      const gauches = noms.map(nom => { const e = (nom.querySelector('.mot svg path') || nom.querySelector('.mot')).getBoundingClientRect(); return e.left - zone.left; });
      const pousses = noms.map((nom, i) => {
        const cle = (nom.className.match(/intro-nom--(\w+)/) || [])[1];
        const mot = nom.querySelector('.mot'), encre = mot.querySelector('svg path');
        const b = mot.getBoundingClientRect(), e = (encre || mot).getBoundingClientRect();
        const g = b.left - zone.left, d = b.right - zone.left, bas = b.bottom - zone.top;
        const eg = e.left - zone.left, eh = e.top - zone.top;
        const marge = 10 + 8 * k, garde = 6 + 3 * k;   // marge : où passer ; garde : l'écart minimal vérifié
        const precedent = Math.max(encreDroite, finPrecedente);
        encreDroite = e.right - zone.left;
        // le soulignement s'arrête avant le nom suivant, pour laisser passer sa racine
        const limite = i + 1 < gauches.length ? gauches[i + 1] - 2.6 * garde - 4 : Infinity;
        const cap = q => ({ x: Math.min(q.x, limite), y: q.y });
        let sx = g + (d - g) * (.28 + r() * .1);
        let ys = yA(sx);
        const yb = Math.max(bas + 7, e.bottom - zone.top + garde + 3);
        const h = yb - ys;
        // la fin du soulignement : elle se relève, ou, chez Soudars, coule et porte la feuille
        const bout = cle === 'soudars'
          ? [{ x: d + 5 * k, y: yb + .8 }, { x: d + 10 * k, y: yb + 5 * k }, { x: d + 12 * k, y: yb + 11 * k }]
          : [{ x: d + 4 * k, y: yb - .5 }, { x: d + 10 * k, y: yb - 3 * k }];
        const soulignement = [{ x: g + (d - g) * .5, y: yb + 1.5 }, ...bout.map(cap)];
        finPrecedente = soulignement[soulignement.length - 1].x;
        const po = { nom, mot, cle, g, d, debut: null, fin: false, extras: [] };

        // Verdignan : un pivot droit, du sarment jusque sous la ligne, entre son nom et celui de Coufran
        if (cle === 'verdignan') {
          const mini = precedent + garde + 2, maxi = eg - garde - 2;
          let px = Math.min(eg - marge * .9, g - 2 * k);
          if (px < mini) px = (mini + maxi) / 2;
          if (maxi - mini > 2) {
            const yv = yA(px), r0 = 5 + 4 * k;
            const chute = [{ x: px, y: yv }, { x: px + .4, y: yv + (yb - yv) * .5 }, { x: px, y: yb - r0 }];
            const coude = [{ x: px + r0 * .55, y: yb - r0 * .12 }, { x: px + r0 * 1.6, y: yb + .6 }];
            const t = trace(spline([...chute, ...coude, ...soulignement], 2));
            const piv = trace(spline([{ x: px, y: yb - r0 }, { x: px - .3, y: yb + h * .14 }, { x: px - .5, y: yb + h * .3 }], 2));
            if (!touche(t, garde) && !touche(piv, garde)) {
              Object.assign(po, { sx: px, t, L1: trace(spline(chute, 2)).L });
              po.extras.push({ t: piv, classe: 'pivot', depuis: po.L1 * .97, duree: 900 });
              return po;
            }
          }
        }

        // Soudars : la descente ondule en S avant de contourner le mot, comme la coulure de son d
        const onde = cle === 'soudars';
        let gauche = Math.min(g - 4 * k, eg - marge), descente, t;
        for (let essai = 0; essai < 5; essai++) {
          descente = [{ x: sx, y: ys }];
          if (onde) {
            // un S : la racine part vers la droite au-dessus du mot, puis revient vers la gauche pour le contourner
            const A = ((d - g) * .13 + 4 * k) * (essai > 2 ? .6 : 1), hs = Math.max(h * .18, Math.min(h * .36, eh - ys - garde * 2));
            descente.push({ x: sx + A, y: ys + hs * .42 }, { x: sx - (d - g) * .08, y: ys + hs });
          } else {
            descente.push({ x: sx - (d - g) * .12, y: ys + (yb - ys) * .3 });
          }
          if (essai) descente.push({ x: gauche + marge * .3, y: Math.max(ys + (yb - ys) * .38, Math.min(ys + (yb - ys) * .5, eh - marge)) });
          descente.push({ x: gauche, y: ys + (yb - ys) * .72 }, { x: g + 6 * k, y: yb });
          t = trace(spline([...descente, ...soulignement], 2));
          if (!touche(t, garde)) break;
          if (essai) gauche -= marge * .5;
        }
        const desc = trace(spline(descente, 2));
        Object.assign(po, { sx, t, L1: desc.L });

        // Coufran : trois racines de tailles différentes partent du même nœud, comme sous son F (et comme le I du logo
        // MIAILHE) ; la plus longue va souligner le nom, les deux autres s'arrêtent au-dessus des lettres
        if (cle === 'coufran') {
          const libre = Math.max(12 * k, eh - ys - garde * 1.6);       // la place entre le sarment et le haut des lettres
          const brins = [
            { l: libre * .78, dx: .1, courbe: -.06, duree: 1300 },
            { l: libre * .44, dx: .42, courbe: .05, duree: 900 },
          ];
          brins.forEach(br => {
            for (let essai = 0; essai < 4; essai++) {
              const l = br.l * (1 - essai * .2);
              // une racine souple : elle s'écarte peu à peu, légèrement arquée, et s'arrête en pointe
              const q1 = { x: sx + l * (br.dx * .2 + br.courbe), y: ys + l * .34 };
              const q2 = { x: sx + l * (br.dx * .62 + br.courbe * .6), y: ys + l * .7 };
              const tt = trace(spline([{ x: sx, y: ys }, q1, q2, { x: sx + l * br.dx, y: ys + l }], 2));
              if (!touche(tt, garde)) { po.extras.push({ t: tt, classe: 'radicelle-c', depuis: 0, duree: br.duree }); break; }
            }
          });
        }
        // Soudars : la feuille du logo pend au bout de la racine
        if (onde) po.feuilleBout = soulignement[soulignement.length - 1];
        return po;
      });

      // Un nœud au départ de chaque racine : c'est là que s'ouvre la feuille du château
      const noeuds = pousses.map(po => ({ x: po.sx }));

      // Le sarment s'affine vers sa pointe et s'épaissit à chaque nœud ; un masque le révèle au fil de la pousse
      const sNoeuds = noeuds.map(n => sarment.cum[Math.max(0, axe.findIndex(p => p.x >= n.x))]);
      const epaisseur = axe.map((p, i) => {
        let w = (2.2 - 1.3 * sarment.cum[i] / sarment.L) * e;
        sNoeuds.forEach(s => { w += .7 * e * Math.exp(-Math.pow((sarment.cum[i] - s) / 5, 2)); });
        return { ...p, w };
      });
      el('path', { d: sarment.d, class: 'piste' }, gVigne);
      const revele = el('path', { d: sarment.d, class: 'revele' }, el('mask', { id: 'intro-revele', maskUnits: 'userSpaceOnUse', x: -40, y: -40, width: W + 80, height: H + 80 }, defs));
      revele.style.strokeDasharray = sarment.L;
      revele.style.strokeDashoffset = sarment.L;
      el('path', { d: ruban(epaisseur), class: 'sarment' }, el('g', { mask: 'url(#intro-revele)' }, gVigne));

      // La feuille de vigne du logo, dressée au-dessus du sarment, s'ouvre au passage de la pointe
      noeuds.forEach(n => {
        const y = yA(n.x);
        const g = el('g', { class: 'noeud' }, gVigne);
        const f = feuille((15 + r() * 3) * e);
        const gf = el('g', { class: 'feuille' }, el('g', { transform: `translate(${n.x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-8 + (r() - .5) * 24).toFixed(1)})` }, g));
        el('path', { d: f.petiole, class: 'petiole' }, gf);
        el('path', { d: f.limbe, class: 'limbe' }, gf);
        if (f.nervures) el('path', { d: f.nervures, class: 'nervures' }, gf);
        n.el = g;
      });

      pousses.forEach(po => {
        po.el = el('path', { d: po.t.d, class: `pousse pousse--${po.cle}` }, svg);
        po.el.style.strokeDasharray = po.t.L;
        po.el.style.strokeDashoffset = po.t.L;
        po.extras.forEach(x => {
          if (x.classe === 'pivot') {
            // le pivot s'effile vers sa pointe : un ruban plein, révélé par un masque qui suit son axe
            const id = `intro-pivot-${po.cle}`;
            x.el = el('path', { d: x.t.d, class: 'revele' }, el('mask', { id, maskUnits: 'userSpaceOnUse', x: -40, y: -40, width: W + 80, height: H + 80 }, defs));
            const n = x.t.poly.length;
            el('path', { d: ruban(x.t.poly.map((q, i) => ({ ...q, w: 1.7 - 1.4 * Math.pow(i / (n - 1), 1.3) }))), class: 'pivot' }, el('g', { mask: `url(#${id})` }, svg));
          } else {
            x.el = el('path', { d: x.t.d, class: x.classe }, svg);
          }
          x.el.style.strokeDasharray = x.t.L;
          x.el.style.strokeDashoffset = x.t.L;
        });
        if (po.feuilleBout) {
          const f = feuille(10.5 * Math.max(.75, e), true), q = po.feuilleBout;
          const gf = el('g', { class: 'feuille-bout' }, el('g', { transform: `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(-14)` }, svg));
          el('path', { d: f.limbe, class: 'limbe' }, gf);
          po.feuilleEl = gf;
        }
      });

      intro.classList.add('is-trace');
      const t0 = performance.now();
      const DEBUT = 300, DUREE = 4000, ECRITURE = 1800;
      const boucle = now => {
        if (fini) return;
        const t = now - t0;
        const lm = douce(clamp((t - DEBUT) / DUREE, 0, 1)) * sarment.L;
        revele.style.strokeDashoffset = sarment.L - lm;
        const pointe = sarment.pointA(lm);
        noeuds.forEach(n => { if (!n.on && pointe.x >= n.x) { n.on = true; n.el.classList.add('is-ouvert'); } });
        pousses.forEach(po => {
          if (po.debut === null && pointe.x >= po.sx) po.debut = t;
          if (po.debut === null || po.fin) return;
          const q = clamp((t - po.debut) / ECRITURE, 0, 1);
          const l = douce(q) * po.t.L;
          po.el.style.strokeDashoffset = po.t.L - l;
          if (l > po.L1) po.mot.style.setProperty('--f', clamp((po.t.pointA(l).x - po.g) / (po.d - po.g), 0, 1));
          // les radicelles de Coufran et le pivot de Verdignan poussent quand la racine passe leur départ
          let tout = true;
          po.extras.forEach(x => {
            if (x.t0 === undefined && l >= x.depuis) x.t0 = t;
            const u = x.t0 === undefined ? 0 : clamp((t - x.t0) / x.duree, 0, 1);
            x.el.style.strokeDashoffset = x.t.L * (1 - douce(u));
            if (u < 1) tout = false;
          });
          if (po.feuilleEl && q > .9) po.feuilleEl.classList.add('is-ouverte');
          if (q >= 1 && tout) { po.fin = true; po.mot.style.setProperty('--f', 1); po.nom.classList.add('is-ecrit'); }
        });
        if (lm >= sarment.L && pousses.every(po => po.fin)) { setTimeout(terminer, 1300); return; }
        requestAnimationFrame(boucle);
      };
      requestAnimationFrame(boucle);
    }
  });
})();
