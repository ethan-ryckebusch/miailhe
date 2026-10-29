/* Intro de l'accueil, sur le modèle de The Symphony of Vines. Sur fond noir, le logo sort du flou
   et un sarment de vigne traverse l'écran. Trois feuilles de vigne s'y ouvrent, une par château,
   comme les trois feuilles du logo ; de chacune descend une racine qui écrit le nom du château,
   dans l'ordre où ils sont entrés dans la famille : Coufran (1924), Verdignan (1976), Soudars (1980).
   Les racines sont dessinées à la plume (28/10/2026, proposition A choisie par l'utilisateur dans
   prototypes/intro-racines.html) : pleins dans les descentes, déliés dans les soulignements, un léger tremblé, jamais
   de trait droit. Elles ne se ressemblent pas : Coufran en arc large, Verdignan en long jambage qui plonge sous la
   ligne et remonte en crochet, Soudars en S. La feuille est partout celle du logo (assets/js/feuille-miailhe.js).
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

  /* Un hasard reproductible : l'intro se dessine comme dans la proposition retenue */
  const graine = n => () => {
    n = (n + 0x6D2B79F5) | 0;
    let t = Math.imul(n ^ (n >>> 15), 1 | n);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  /* Une courbe souple qui passe par tous les points : Catmull-Rom centripète, sans boucle ni pointe parasite, même quand
     les points sont inégalement espacés */
  function souple(points, pas) {
    const P = points.filter((q, i) => !i || Math.hypot(q.x - points[i - 1].x, q.y - points[i - 1].y) > .5);
    if (P.length < 2) return P.map(q => ({ ...q }));
    const n = P.length, A = [{ x: 2 * P[0].x - P[1].x, y: 2 * P[0].y - P[1].y }, ...P, { x: 2 * P[n - 1].x - P[n - 2].x, y: 2 * P[n - 1].y - P[n - 2].y }];
    const out = [], lerp = (a, b, ta, tb, t) => ({ x: (tb - t) / (tb - ta) * a.x + (t - ta) / (tb - ta) * b.x, y: (tb - t) / (tb - ta) * a.y + (t - ta) / (tb - ta) * b.y });
    for (let i = 1; i < A.length - 2; i++) {
      const p0 = A[i - 1], p1 = A[i], p2 = A[i + 1], p3 = A[i + 2];
      const t1 = Math.sqrt(Math.hypot(p1.x - p0.x, p1.y - p0.y)) || 1e-3, t2 = t1 + (Math.sqrt(Math.hypot(p2.x - p1.x, p2.y - p1.y)) || 1e-3), t3 = t2 + (Math.sqrt(Math.hypot(p3.x - p2.x, p3.y - p2.y)) || 1e-3);
      const m = Math.max(2, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / pas));
      for (let j = 0; j < m; j++) {
        const t = t1 + (t2 - t1) * j / m;
        const a1 = lerp(p0, p1, 0, t1, t), a2 = lerp(p1, p2, t1, t2, t), a3 = lerp(p2, p3, t2, t3, t);
        out.push(lerp(lerp(a1, a2, 0, t2, t), lerp(a2, a3, t1, t3, t), t1, t2, t));
      }
    }
    out.push({ ...P[n - 1] });
    return out;
  }

  /* La plume : biseau à -21°, large quand on descend, fine quand on file à l'horizontale ; la main tremble un peu et la
     racine serpente d'un seul geste (onde lente) */
  const PLUME = { biseau: -.36, w0: 3.1, w1: .5, trem: .8, onde: 40, lent: 1.8, pression: .12, attaque: 7, pointe: 30 };

  M.intro = porte => new Promise(fin => {
    const intro = porte.querySelector('.intro-ecran');
    if (!intro) { fin(); return; }
    // pas d'intro si l'on vient de changer de langue sur la porte d'âge (langue.js)
    if (M.reduceMotion || M.introSautee) { intro.remove(); fin(); return; }
    const svg = intro.querySelector('.intro-svg');
    const noms = [...intro.querySelectorAll('.intro-nom')];
    const r = graine(1924), rm = graine(1924 * 7 + 1);   // la forme ; la main

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
      const p = clamp(W / 1440, .62, 1.15); // épaisseur des racines

      // Fondu sur les bords de l'écran, comme la ligne de The Symphony of Vines
      const defs = el('defs', {}, svg);
      const grad = el('linearGradient', { id: 'intro-fondu' }, defs);
      [[0, 0], [.08, 1], [.92, 1], [1, 0]].forEach(([o, a]) => el('stop', { offset: o, 'stop-color': '#fff', 'stop-opacity': a }, grad));
      el('rect', { width: W, height: H, fill: 'url(#intro-fondu)' }, el('mask', { id: 'intro-masque', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs));
      const gVigne = el('g', { mask: 'url(#intro-masque)' }, svg);
      // L'encre sur le papier : le bord des racines est à peine irrégulier
      const encre = el('filter', { id: 'intro-encre', filterUnits: 'userSpaceOnUse', x: -40, y: -60, width: W + 80, height: H + 220 }, defs);
      el('feTurbulence', { type: 'fractalNoise', baseFrequency: .85, numOctaves: 2, seed: 7, result: 'bruit' }, encre);
      el('feDisplacementMap', { in: 'SourceGraphic', in2: 'bruit', scale: 1.5, xChannelSelector: 'R', yChannelSelector: 'G' }, encre);

      // Le sarment traverse l'écran de bord à bord en ondulant doucement
      const y0 = H * .2;
      const pas = Math.max(40, W / 28);
      const pts = [];
      for (let x = -20; x <= W + 20 + pas; x += pas) pts.push({ x, y: y0 + Math.sin(x / W * 7.3 + 1) * H * .022 + (r() - .5) * H * .03 });
      const axe = spline(pts);
      const sarment = trace(axe);
      const yA = x => { let i = 1; while (i < axe.length - 1 && axe[i].x < x) i++; return axe[i - 1].y + (axe[i].y - axe[i - 1].y) * clamp((x - axe[i - 1].x) / ((axe[i].x - axe[i - 1].x) || 1), 0, 1); };

      // Aucune racine ne touche les lettres (demande du 28/10/2026) : chaque tracé est vérifié contre l'encre des trois
      // logos, au point même et sur deux cercles autour (un trait fin de lettre ne passe pas entre les échantillons)
      const encres = noms.map(nom => nom.querySelector('.mot svg path')).filter(Boolean)
        .map(q => ({ q, inv: q.getScreenCTM() && q.getScreenCTM().inverse() })).filter(x => x.inv);
      const touche = (t, garde) => {
        for (let i = 0; i < t.poly.length; i += 2) {
          const q = t.poly[i], rr = garde + t.w[i] / 2;
          for (let a = -1; a < 24; a++) {
            const ra = a < 0 ? 0 : a < 12 ? rr * .5 : rr, an = a * Math.PI / 6 + (a >= 12 ? Math.PI / 12 : 0);
            const X = q.x + zone.left + ra * Math.cos(an), Y = q.y + zone.top + ra * Math.sin(an);
            for (const { q: en, inv } of encres) if (en.isPointInFill(new DOMPoint(X, Y).matrixTransform(inv))) return true;
          }
        }
        return false;
      };

      // Le tremblé de la main : trois ondes courtes et une lente, de part et d'autre de la ligne
      function trembler(poly, A, onde, lent) {
        const ph = [rm() * 6.3, rm() * 6.3, rm() * 6.3, rm() * 6.3], cum = [0];
        for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i].x - poly[i - 1].x, poly[i].y - poly[i - 1].y));
        return poly.map((q, i) => {
          const a = poly[Math.max(0, i - 2)], b = poly[Math.min(poly.length - 1, i + 2)];
          let tx = b.x - a.x, ty = b.y - a.y; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
          const s = cum[i], env = Math.min(1, s / 14);
          const n = A * env * (.62 * Math.sin(6.283 * s / onde + ph[0]) + .28 * Math.sin(6.283 * s / (onde * .43) + ph[1]) + .12 * Math.sin(6.283 * s / (onde * .19) + ph[2]))
            + lent * Math.min(1, s / 40) * Math.sin(6.283 * s / 130 + ph[3]);
          return { x: q.x - ty * n, y: q.y + tx * n };
        });
      }
      // Un trait de plume : sa ligne (une courbe souple par les points, tremblée) et sa largeur en chaque point
      function trait(points) {
        const s = PLUME;
        const poly = trembler(souple(points, 1.5), s.trem * Math.max(.7, p), s.onde, s.lent * p);
        const t = trace(poly), n = poly.length, ph = rm() * 6.3;
        const w = poly.map((q, i) => {
          const c = t.cum[i], a = poly[Math.max(0, i - 3)], b = poly[Math.min(n - 1, i + 3)];
          let v = s.w1 + (s.w0 - s.w1) * Math.abs(Math.sin(Math.atan2(b.y - a.y, b.x - a.x) - s.biseau));
          v *= 1 + s.pression * Math.sin(c / 17 + ph);                                // la pression de la main
          v *= Math.min(1, .5 + .5 * c / s.attaque);                                   // l'attaque
          v *= Math.min(1, Math.pow(Math.max(0, t.L - c) / s.pointe, .65));            // la pointe
          return v * p;
        });
        // un lissage : la largeur ne saute pas d'un point à l'autre
        t.w = w.map((v, i) => { let a = 0, m = 0; for (let j = Math.max(0, i - 3); j <= Math.min(n - 1, i + 3); j++) { a += w[j]; m++; } return Math.max(.14, a / m); });
        t.wmax = Math.max(...t.w);
        return t;
      }
      // la longueur parcourue le long d'un trait jusqu'au point le plus proche de q
      const jusqua = (t, q) => { let m = 0, dm = Infinity; t.poly.forEach((a, i) => { const d = (a.x - q.x) ** 2 + (a.y - q.y) ** 2; if (d < dm) { dm = d; m = i; } }); return t.cum[m]; };

      // Ce qu'il faut savoir de chaque nom : la boîte du logo, son encre, où passer
      const ctx = noms.map(nom => {
        const mot = nom.querySelector('.mot'), b = mot.getBoundingClientRect(), en = (mot.querySelector('svg path') || mot).getBoundingClientRect();
        return {
          nom, mot, cle: (nom.className.match(/intro-nom--(\w+)/) || [])[1],
          g: b.left - zone.left, d: b.right - zone.left, bas: b.bottom - zone.top,
          eg: en.left - zone.left, ed: en.right - zone.left, eh: en.top - zone.top, eb: en.bottom - zone.top,
        };
      });
      ctx.forEach((c, i) => {
        c.w = c.d - c.g; c.ew = c.ed - c.eg;
        c.marge = 10 + 8 * k; c.garde = 6 + 3 * k;                    // marge : où passer ; garde : l'écart minimal vérifié
        c.yb = Math.max(c.bas + 7, c.eb + c.garde + 3);               // la ligne du soulignement
        // le soulignement s'arrête avant le nom suivant, pour laisser passer sa racine
        c.limite = i + 1 < ctx.length ? ctx[i + 1].eg - 2.6 * c.garde - 4 : Infinity;
        c.precedent = i ? ctx[i - 1].ed : -Infinity;                  // complété par la racine précédente, une fois tracée
      });
      const borne = (c, q) => ({ x: Math.min(q.x, c.limite), y: q.y });
      // le soulignement suit l'encre du logo, avec un léger ventre, puis se relève
      const souligner = c => [{ x: c.eg + c.ew * .5, y: c.yb + 2.2 }, ...[{ x: c.ed + 6 * k, y: c.yb - .3 }, { x: c.ed + 13 * k, y: c.yb - 4 * k }].map(q => borne(c, q))];

      // La descente contourne la première lettre par la gauche, en arc, puis souligne le nom ; `debut(essai)` donne les
      // premiers points, propres à chaque château. Si la racine approche une lettre, elle repasse plus à gauche.
      function contourner(c, debut) {
        const { eg, eh, yb, marge, garde } = c;
        let xl = Math.min(c.g - 4 * k, eg - marge * 1.5), t = null;
        const u0 = { x: eg + c.ew * .1, y: yb + 1.5 };
        for (let essai = 0; essai < 7; essai++) {
          const pre = debut(essai), S = pre[0], hh = yb - S.y;
          const pts = [...pre];
          if (essai) pts.push({ x: xl + marge * .5, y: clamp(eh - marge * .8, S.y + hh * .3, S.y + hh * .48) });
          pts.push({ x: xl, y: S.y + hh * .72 }, u0, ...souligner(c));
          t = trait(pts);
          if (!touche(t, garde)) break;
          if (essai) xl = Math.max(xl - marge * .45, c.precedent + garde + 2);
        }
        t.L1 = jusqua(t, u0);
        return t;
      }

      // Coufran : la racine quitte le sarment presque à la verticale, puis s'ouvre en arc large autour du C
      function coufran(c) {
        const sx = c.eg + c.ew * (.26 + r() * .06), ys = yA(sx), hh = c.yb - ys;
        const libre = Math.max(10 * k, c.eh - ys - c.garde * 1.6);   // la place entre le sarment et le haut des lettres
        const ny = ys + Math.min(hh * .13, libre * .3);
        return { sx, t: contourner(c, essai => [{ x: sx, y: ys }, { x: sx - 1.5, y: ny }, { x: sx - c.ew * (.14 + essai * .012), y: ys + Math.min(hh * .32, libre * .8) }]) };
      }

      // Verdignan : un long jambage se creuse vers la gauche, plonge sous la ligne, tourne en rond et remonte souligner le
      // nom. Il quitte le sarment entre la racine de Coufran et le V, qui remplit toute sa boîte ; l'arc du haut (b) prend
      // la place libre au-dessus des noms, le bas (bb) ce qui reste entre les deux noms
      function verdignan(c) {
        const mini = c.precedent + c.garde + 2, maxi = c.eg - c.garde - 2;
        let px = Math.min(c.eg - c.marge * .9, c.g - 2 * k);
        if (px < mini) px = (mini + maxi) / 2;
        if (maxi - mini < 3) return null;
        const ys = yA(px), hh = c.yb - ys;
        for (let essai = 0; essai < 5; essai++) {
          const b = (46 * k + 6) * (1 - essai * .2), bb = Math.min(b, (maxi - mini) * .45), yh = Math.min(ys + hh * .55, c.eh - c.garde * 1.4);
          const fond = hh * (.21 - essai * .025), u = (18 + 14 * k) * (1 - essai * .1);
          const joint = { x: Math.max(c.eg + c.ew * .1, px + u * 2.3), y: c.yb + 1.8 };
          const t = trait([{ x: px, y: ys }, { x: px - b * .62, y: ys + (yh - ys) * .42 }, { x: px - b, y: yh }, { x: px - bb * .8, y: c.yb + fond * .4 },
            { x: px - bb * .25, y: c.yb + fond * .95 }, { x: px + u * .6, y: c.yb + fond * .88 }, { x: px + u * 1.5, y: c.yb + fond * .35 }, joint, ...souligner(c)]);
          if (touche(t, c.garde)) continue;
          t.L1 = jusqua(t, joint);
          return { sx: px, t };
        }
        return null;
      }

      // Soudars : la racine part vers la droite au-dessus du mot, puis revient vers la gauche pour le contourner (un S)
      function soudars(c) {
        const sx = c.eg + c.ew * (.3 + r() * .05), ys = yA(sx), hh = c.yb - ys;
        return { sx, t: contourner(c, essai => {
          const A = (c.ew * .16 + 4 * k) * (essai > 2 ? .6 : 1), hs = Math.max(hh * .18, Math.min(hh * .36, c.eh - ys - c.garde * 2));
          return [{ x: sx, y: ys }, { x: sx + A, y: ys + hs * .42 }, { x: sx - c.ew * .08, y: ys + hs }];
        }) };
      }

      const FORMES = { coufran, verdignan, soudars };
      const pousses = [];
      ctx.forEach((c, i) => {
        // la racine suivante passe à droite de la précédente
        if (i) c.precedent = Math.max(c.precedent, ...pousses[i - 1].t.poly.map(q => q.x));
        const po = (FORMES[c.cle] && FORMES[c.cle](c)) || coufran(c);
        pousses.push(Object.assign(po, { c, nom: c.nom, mot: c.mot, debut: null, fin: false, l: -1, duree: clamp(po.t.L / .26, 1700, 2900) }));
      });
      // pour vérifier de l'extérieur qu'aucune racine ne touche une lettre (écart minimal de 3 px)
      intro.dataset.racines = pousses.every(po => !touche(po.t, 3)) ? 'ok' : 'touche';

      // Un nœud au départ de chaque racine : c'est là que s'ouvre la feuille du château
      const noeuds = pousses.map(po => ({ x: po.sx }));

      // Le sarment s'affine vers sa pointe et s'épaissit à chaque nœud ; un masque le révèle au fil de la pousse
      const sNoeuds = noeuds.map(n => sarment.cum[Math.max(0, axe.findIndex(q => q.x >= n.x))]);
      const epaisseur = axe.map((q, i) => {
        let w = (2.2 - 1.3 * sarment.cum[i] / sarment.L) * e;
        sNoeuds.forEach(s => { w += .7 * e * Math.exp(-Math.pow((sarment.cum[i] - s) / 5, 2)); });
        return { ...q, w };
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

      // La racine se dessine comme à la plume : un ruban plein jusqu'à la pointe, qui reste fine en avançant
      const gR = el('g', { class: 'racines', filter: 'url(#intro-encre)' }, svg);
      const rubanJusqua = (t, l) => {
        const s = [], pousse = 16 * p;
        for (let i = 0; i < t.poly.length && t.cum[i] <= l; i++) s.push({ x: t.poly[i].x, y: t.poly[i].y, w: Math.min(t.w[i], t.wmax * (l - t.cum[i]) / pousse) });
        if (l < t.L && s.length) { const q = t.pointA(l); s.push({ x: q.x, y: q.y, w: 0 }); }
        return s.length > 1 ? ruban(s) : '';
      };
      pousses.forEach(po => { po.el = el('path', { class: 'racine' }, gR); });

      intro.classList.add('is-trace');
      const t0 = performance.now();
      const DEBUT = 300, DUREE = 4000;
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
          const q = clamp((t - po.debut) / po.duree, 0, 1);
          const l = douce(q) * po.t.L;
          if (Math.abs(l - po.l) > .05) { po.l = l; po.el.setAttribute('d', rubanJusqua(po.t, l)); }
          if (l > po.t.L1) po.mot.style.setProperty('--f', clamp((po.t.pointA(l).x - po.c.g) / po.c.w, 0, 1));
          if (q >= 1) { po.fin = true; po.mot.style.setProperty('--f', 1); po.nom.classList.add('is-ecrit'); }
        });
        if (lm >= sarment.L && pousses.every(po => po.fin)) { setTimeout(terminer, 1300); return; }
        requestAnimationFrame(boucle);
      };
      requestAnimationFrame(boucle);
    }
  });
})();
