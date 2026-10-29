/* La vitrine après l'entrée : le seuil (trois portes filmées) et la planche des racines (onglet « Le terroir ») ;
   les onglets de l'accueil sont dans onglets.js, l'histoire de la famille dans histoire.js.
   main.js gère l'âge légal, l'en-tête, le menu et les apparitions ; armoiries.js et racine-planche.js fournissent les données ;
   le quiz est dans quiz.js. */
(function () {
  const M = window.MIAILHE || {};
  const page = document.querySelector('main.v');
  if (!page) return;
  const reduit = !!M.reduceMotion;
  // ?capture : la page entière est photographiée d'un coup, les images différées doivent être chargées
  if (M.capture) page.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
  const A = window.MIAILHE_ARMOIRIES;
  const armoirie = (cle, forme = 'complet') => (A && A[cle]
    ? `<span class="armoirie" data-armoirie="${cle}"><svg viewBox="${A.viewBox}" aria-hidden="true"><path class="armoirie-fond" d="${A.bouclier}"/><path fill="currentColor" fill-rule="evenodd" d="${A[cle][forme]}"/></svg></span>` : '');

  /* ---------- Entrée : le titre, puis les trois portes ---------- */
  (M.quandEntre || (fn => fn()))(() => requestAnimationFrame(() => page.classList.add('is-entree')));

  /* =====================================================================
     I. Le seuil : la porte s'ouvre au survol (le film avance), se referme quand on s'en va (le film recule),
     et l'on entre d'un clic. Sur téléphone, la porte qu'on regarde s'ouvre seule ; un toucher fait entrer.
     ===================================================================== */
  const battants = page.querySelector('.battants');
  const portes = battants ? [...battants.querySelectorAll('.battant')] : [];
  const survol = window.matchMedia('(hover: hover) and (pointer: fine)');
  const etats = new Map();
  // Chaque film est monté en deux plans (source/videos-originales/portes/BIBLE_DE_TOURNAGE.md) : l'ouverture, caméra
  // fixe, puis le travelling avant à travers la porte. Le survol joue l'ouverture et s'arrête porte ouverte ;
  // le clic enchaîne le travelling, puis l'écran passe à la couleur du château.
  const FIN_OUVERTURE = b => parseFloat(b.dataset.ouverture || '5');
  let verrou = 0;   // juste après le test, la porte trouvée reste ouverte même si le pointeur repose sur une autre
  let entree = false;   // on franchit une porte : plus aucune autre ne s'ouvre ni ne se ferme
  // les films des portes (près de 12 Mo) se chargent quand la page est affichée, pas avant (29/10/2026, vitesse de
  // chargement) : la page les déclare en preload="metadata" ; l'intro et la porte d'âge laissent le temps de les recevoir
  const chargerFilms = () => portes.forEach(b => { const v = b.querySelector('video'); if (v && v.preload !== 'auto') v.preload = 'auto'; });
  if (document.readyState === 'complete') chargerFilms(); else addEventListener('load', chargerFilms, { once: true });
  portes.forEach(b => {
    const v = b.querySelector('video');
    const e = { v, recul: 0, garde: 0, entre: false };
    etats.set(b, e);
    // Sans film (aucune source lisible), la porte ouverte apparaît en fondu sous la porte fermée
    const sources = [...v.querySelectorAll('source')];
    sources.forEach(s => s.addEventListener('error', () => {
      if (sources.every(x => x.dataset.echec || x === s) && v.readyState === 0) b.classList.add('sans-film');
      s.dataset.echec = '1';
    }));
  });
  const reculer = e => {
    cancelAnimationFrame(e.recul);
    const v = e.v;
    v.pause();
    let avant = performance.now();
    const pas = maintenant => {
      v.currentTime = Math.max(0, v.currentTime - (maintenant - avant) / 1000 * 1.8);
      avant = maintenant;
      if (v.currentTime > 0.01) e.recul = requestAnimationFrame(pas);
    };
    e.recul = requestAnimationFrame(pas);
  };
  // Au survol, le film ne va pas plus loin que la fin de l'ouverture
  const garder = (b, e) => {
    cancelAnimationFrame(e.garde);
    const fin = FIN_OUVERTURE(b);
    const pas = () => {
      if (e.entre || e.v.paused) return;
      if (e.v.currentTime >= fin) { e.v.pause(); e.v.currentTime = fin; return; }
      e.garde = requestAnimationFrame(pas);
    };
    e.garde = requestAnimationFrame(pas);
  };
  const ouvrir = b => {
    if (reduit || entree || b.classList.contains('is-ouvert')) return;
    portes.forEach(x => x !== b && fermer(x));
    const e = etats.get(b);
    b.classList.add('is-ouvert'); battants.classList.add('a-ouvert');
    cancelAnimationFrame(e.recul);
    e.v.playbackRate = 1;
    if (e.v.currentTime >= FIN_OUVERTURE(b) - .05) { e.v.currentTime = FIN_OUVERTURE(b); return; }
    e.v.play().then(() => garder(b, e)).catch(() => b.classList.add('sans-film'));
  };
  const fermer = b => {
    if (entree || !b.classList.contains('is-ouvert')) return;
    const e = etats.get(b);
    if (e.entre) return;
    b.classList.remove('is-ouvert');
    if (!portes.some(x => x.classList.contains('is-ouvert'))) battants.classList.remove('a-ouvert');
    cancelAnimationFrame(e.garde);
    reculer(e);
  };
  // Entrer : la porte finit de s'ouvrir, la caméra avance à travers elle (le second plan du film) ; la lumière au bout
  // du passage grandit en cercle et devient la couleur du château, avec son armoirie, son logo et son hôte : exactement
  // l'écran par lequel s'ouvre le site du château (chateau.js, arrivée « par la vitrine »), qui n'a plus qu'à s'effacer.
  const LG = window.MIAILHE_LOGOS_CHATEAUX;
  const entrer = b => {
    const e = etats.get(b);
    if (e.entre || entree) return;
    ouvrir(b);
    entree = true;
    e.entre = true;
    cancelAnimationFrame(e.garde);
    b.classList.add('is-franchie');
    const fin = FIN_OUVERTURE(b);
    // chaque film a sa vitesse de lecture (data-travelling, mesurée par source/monter_portes.py) : la caméra avance
    // à la même vitesse à l'écran derrière les trois portes
    const vitesse = parseFloat(b.dataset.travelling || '1.7');
    e.v.playbackRate = e.v.currentTime < fin - .2 ? 2.4 : vitesse;
    e.v.play().catch(() => {});
    // le temps qu'il reste à jouer, en secondes réelles : l'ouverture (si elle n'est pas finie) puis le travelling
    const duree = isFinite(e.v.duration) && e.v.duration > fin ? e.v.duration : fin + 5;
    const reste = Math.min(8, Math.max(0, fin - e.v.currentTime) / 2.4 + Math.max(0, duree - Math.max(fin, e.v.currentTime)) / vitesse);
    const surveille = () => { if (e.v.currentTime >= fin && e.v.playbackRate !== vitesse) e.v.playbackRate = vitesse; if (!e.v.ended && document.body.contains(b)) requestAnimationFrame(surveille); };
    requestAnimationFrame(surveille);
    const cle = b.dataset.chateau;
    // la voix de l'hôte (voix.js), préparée pendant le clic, dite quand l'écran du château apparaît
    const voix = M.voix ? M.voix(cle) : null;
    const lg = LG && LG[cle] && LG[cle].logo;
    const qui = (b.querySelector('.battant-qui') || {}).textContent || '';
    const passage = document.createElement('div');
    passage.className = 'passage';
    passage.dataset.chateau = cle;
    passage.innerHTML = `<div class="motif"></div><div class="passage-seuil">${armoirie(cle)}`
      + (lg ? `<p class="passage-nom"><span class="logo-chateau"><svg viewBox="${lg.viewBox}" aria-hidden="true"><path fill="currentColor" d="${lg.d}"/></svg></span></p>` : '')
      + `<p class="passage-qui" translate="no">${qui.split(/[·・]/)[0].trim()}</p></div>`;   // déjà dans la langue de la page
    document.body.append(passage);
    const tCercle = Math.max(250, reste * 1000 - 900);
    const tPartir = Math.max(1500, reste * 1000 + 650);
    const partir = () => { location.href = b.href; };
    setTimeout(() => {
      // le centre du cercle : le bout du couloir, au fond de la porte ouverte
      const r = b.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * .46;
      const R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 2;
      passage.style.clipPath = `circle(0px at ${cx}px ${cy}px)`;
      passage.getBoundingClientRect();
      passage.style.transition = 'clip-path 1.05s cubic-bezier(.55, 0, .2, 1)';
      passage.style.clipPath = `circle(${R}px at ${cx}px ${cy}px)`;
      passage.classList.add('is-ouvert');
      // l'ambiance du château monte avec le cercle, puis l'hôte dit « Bienvenue dans notre château » quand son nom
      // paraît ; on ne part qu'une fois la phrase dite et l'ambiance éteinte (l'écran du château est le même des deux
      // côtés : il reste simplement un peu plus longtemps)
      if (!voix) { setTimeout(partir, tPartir - tCercle); return; }
      const secours = setTimeout(partir, 8000);
      setTimeout(() => voix.dire().then(d => { clearTimeout(secours); setTimeout(partir, Math.max(tPartir - tCercle - 120, d * 1000 - 100)); }), 120);
    }, tCercle);
  };
  portes.forEach(b => {
    b.addEventListener('pointerenter', () => { if (survol.matches && performance.now() > verrou) ouvrir(b); });
    b.addEventListener('pointerleave', () => { if (survol.matches && performance.now() > verrou) fermer(b); });
    b.addEventListener('focus', () => ouvrir(b));
    b.addEventListener('blur', () => fermer(b));
    b.addEventListener('click', ev => {
      if (reduit || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
      ev.preventDefault();
      if (!survol.matches && !b.classList.contains('is-ouvert')) { ouvrir(b); return; }
      entrer(b);
    });
  });
  // Téléphone : la porte au centre de l'écran s'ouvre d'elle-même
  let ioPorte = null;
  if (battants && !reduit) {
    ioPorte = new IntersectionObserver(es => es.forEach(en => {
      if (survol.matches) return;
      if (en.isIntersecting) ouvrir(en.target); else fermer(en.target);
    }), { root: battants, threshold: .7 });
    portes.forEach(b => ioPorte.observe(b));
  }
  // Retour arrière depuis un château (page restaurée du cache) : on retire le passage resté dans la page,
  // on referme les portes, et sur téléphone la porte regardée se rouvre
  window.addEventListener('pageshow', ev => {
    if (!ev.persisted) return;
    document.querySelectorAll('.passage').forEach(p => p.remove());
    entree = false;
    portes.forEach(b => { b.classList.remove('is-ouvert', 'is-franchie'); const e = etats.get(b); e.entre = false; e.v.pause(); e.v.playbackRate = 1; e.v.currentTime = 0; });
    if (battants) battants.classList.remove('a-ouvert');
    if (ioPorte) portes.forEach(b => { ioPorte.unobserve(b); ioPorte.observe(b); });
  });

  /* ---------- Avant les portes : l'invitation au test, jamais obligatoire ---------- */
  // Elle s'affiche après la porte d'âge, à chaque visite, tant qu'on n'a ni fait le test ni répondu « Je connais la
  // maison » (gardé pour toujours). Un clic à côté, une porte survolée ou Échap la ferment pour la visite seulement.
  // Le test (quiz.js) ouvre ensuite la porte de son château.
  const seuil = page.querySelector('.seuil');
  const guide = seuil && seuil.querySelector('[data-guide]');
  const lire = (st, k) => { try { return st.getItem(k); } catch (e) { return null; } };
  const ecrire = (st, k, v) => { try { st.setItem(k, v); } catch (e) { /* stockage indisponible */ } };
  const testFait = () => !!lire(localStorage, 'miailhe-test-fait');
  const guideFerme = () => lire(localStorage, 'miailhe-guide') === 'ferme' || !!lire(sessionStorage, 'miailhe-guide') || testFait();
  const fermerGuide = (pourToujours) => {
    if (!guide || guide.hidden) return;
    ecrire(sessionStorage, 'miailhe-guide', 'ferme');
    if (pourToujours) ecrire(localStorage, 'miailhe-guide', 'ferme');
    guide.classList.remove('is-visible');
    seuil.classList.remove('guide-ouvert');
    setTimeout(() => { guide.hidden = true; }, 600);
  };
  if (guide && !M.capture && !guideFerme()) {
    (M.quandEntre || (fn => fn()))(() => setTimeout(() => {
      if (guideFerme()) return;
      guide.hidden = false;
      seuil.classList.add('guide-ouvert');
      requestAnimationFrame(() => guide.classList.add('is-visible'));
    }, reduit ? 0 : 1300));
    guide.querySelector('[data-guide-fermer]').addEventListener('click', () => fermerGuide(true));
    // un geste vers les portes vaut réponse pour cette visite : le connaisseur passe sans rien lire
    seuil.addEventListener('pointerdown', e => { if (!e.target.closest('[data-guide]')) fermerGuide(false); });
    portes.forEach(b => b.addEventListener('pointerenter', () => { if (survol.matches) fermerGuide(false); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fermerGuide(false); });
  }
  document.addEventListener('miailhe:test', () => fermerGuide(false));

  // Le résultat du test ouvre la bonne porte : on revient au seuil, la porte est marquée « Votre porte » et s'ouvre
  document.addEventListener('miailhe:porte', e => {
    const b = portes.find(x => x.dataset.chateau === e.detail);
    if (!b) return;
    portes.forEach(x => x.classList.toggle('is-suggeree', x === b));
    verrou = performance.now() + 2200;
    seuil.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth' });
    if (!survol.matches) b.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    setTimeout(() => { b.focus({ preventScroll: true }); ouvrir(b); }, reduit ? 0 : 650);
  });

  /* =====================================================================
     II. La racine : la planche gravée des trois châteaux. Au défilement, une racine pousse sous chacun, dans sa couleur,
     jusqu'à ce que les trois n'en fassent qu'une. Les racines et leur carte de pousse viennent de racine-planche.js
     (source/racine_planche.py) ; la pousse est dessinée en WebGL. Sans WebGL, les racines apparaissent en fondu.
     ===================================================================== */
  const racine = document.querySelector('.racine');   // dans l'onglet « Le terroir », hors de main
  // les données de la planche (racine-planche.js, 800 Ko) arrivent après l'affichage des portes (29/10/2026, vitesse de
  // chargement) : le script est demandé quand la page est prête, puis la planche se met en place
  const planterRacine = () => {
    const RP = window.MIAILHE_RACINE;
    if (racine && RP) {
      const planche = racine.querySelector('.racine-planche');
      const toile = racine.querySelector('.racine-pousse');
      const titres = [...racine.querySelectorAll('.racine-t')];
      const chateaux = [...racine.querySelectorAll('.racine-chateau')];
      const sols = [...racine.querySelectorAll('.racine-sol')];
      // Repères relevés sur chaque planche (fractions de la largeur et de la hauteur) : rangée des cartouches,
      // sommet de chaque château, milieu de chaque sol
      const REPERES = {
        large: { rang: [.13, .105, .13], toits: [[.212, .246], [.50, .164], [.85, .376]], sols: [.557, .66, .80] },
        // sur la planche haute, les châteaux sont serrés : Verdignan a son cartouche une rangée plus haut
        haute: { rang: [.14, .065, .14], toits: [[.19, .265], [.44, .175], [.82, .32]], sols: [.48, .60, .76] },
      };
      const portrait = window.matchMedia('(max-aspect-ratio: 4/5)');
      let format = '', gl = null, uT = null, pret = false, calque = null;
      let cible = 0, actuel = 0, boucle = 0;

      const placer = () => {
        const R = REPERES[format], D = RP[format];
        planche.classList.toggle('is-haute', format === 'haute');
        planche.style.setProperty('--r', (D.largeur / D.hauteur).toFixed(4));
        planche.style.setProperty('--sortie', D.sortie);
        chateaux.forEach((c, k) => {
          const [x, y] = R.toits[k], rang = [].concat(R.rang)[k] ?? R.rang;
          c.style.setProperty('--x', x); c.style.setProperty('--y', rang);
          c.style.setProperty('--fil', `${((y - rang) * planche.clientHeight - 10).toFixed(0)}px`);
        });
        sols.forEach((c, k) => { c.style.setProperty('--x', .012); c.style.setProperty('--y', R.sols[k]); });
      };

      const image = src => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; });
      const ombrage = (type, code) => { const o = gl.createShader(type); gl.shaderSource(o, code); gl.compileShader(o); return o; };
      const preparer = async () => {
        const D = RP[format];
        pret = false;
        if (!gl) {
          gl = toile.getContext('webgl', { premultipliedAlpha: true, antialias: false });
          if (gl) {
            const prog = gl.createProgram();
            gl.attachShader(prog, ombrage(gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 uv; void main() { uv = vec2(p.x * .5 + .5, .5 - p.y * .5); gl_Position = vec4(p, 0., 1.); }'));
            // une racine n'apparaît que là où le front de pousse est passé ; à la pointe, l'encre est un peu plus vive
            gl.attachShader(prog, ombrage(gl.FRAGMENT_SHADER, `precision mediump float; uniform sampler2D racines, pousse; uniform float t; varying vec2 uv;
              void main() { vec4 c = texture2D(racines, uv); float k = texture2D(pousse, uv).r;
                float a = c.a * clamp((t - k) / .02, 0., 1.); float pointe = 1. - clamp((t - k) / .07, 0., 1.);
                gl_FragColor = vec4(mix(c.rgb, min(c.rgb * 1.35 + .05, 1.), pointe) * a, a); }`));
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) gl = null;
            else {
              gl.useProgram(prog);
              gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
              const a = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
              gl.uniform1i(gl.getUniformLocation(prog, 'racines'), 0);
              gl.uniform1i(gl.getUniformLocation(prog, 'pousse'), 1);
              uT = gl.getUniformLocation(prog, 't');
            }
          }
        }
        if (!gl) {   // repli : le calque des racines, en fondu
          toile.hidden = true;
          if (!calque) { calque = document.createElement('img'); calque.className = 'racine-calque'; calque.alt = ''; toile.after(calque); }
          calque.src = D.racines; pret = true; dessiner(); return;
        }
        const [r, k] = await Promise.all([image(D.racines), image(D.pousse)]);
        [r, k].forEach((im, n) => {
          gl.activeTexture(gl.TEXTURE0 + n);
          gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        });
        pret = true; dimensionner();
      };
      const dimensionner = () => {
        if (!gl) return;
        const d = Math.min(2, window.devicePixelRatio || 1);
        toile.width = Math.round(planche.clientWidth * d); toile.height = Math.round(planche.clientHeight * d);
        gl.viewport(0, 0, toile.width, toile.height);
        dessiner();
      };
      // la pousse occupe le milieu de l'acte : on voit d'abord les trois châteaux, à la fin la famille
      const pousse = p => Math.min(1, Math.max(0, (p - .1) / .64)) * 1.03;
      const dessiner = () => {
        if (!pret) return;
        const t = pousse(actuel);
        if (gl) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uT, t); gl.drawArrays(gl.TRIANGLES, 0, 3); }
        else if (calque) calque.style.opacity = Math.min(1, t);
      };
      const choisir = () => {
        const f = portrait.matches ? 'haute' : 'large';
        if (f !== format) { format = f; placer(); preparer(); } else { placer(); dimensionner(); }
      };

      const progression = () => {
        const r = racine.getBoundingClientRect();
        return M.capture ? 1 : Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      };
      const avancer = () => {
        // la pousse rattrape la page avec un peu d'inertie
        actuel += (cible - actuel) * (reduit ? 1 : .1);
        if (Math.abs(cible - actuel) < .0005) actuel = cible;
        dessiner();
        boucle = actuel !== cible ? requestAnimationFrame(avancer) : 0;
      };
      const majRacine = () => {
        cible = progression();
        const haut = racine.getBoundingClientRect().top;
        titres.forEach(x => x.classList.toggle('is-vu', cible >= +x.dataset.de && cible < +x.dataset.a && haut < innerHeight * .6));
        racine.classList.toggle('a-chateaux', haut < innerHeight * .5);
        racine.classList.toggle('a-sols', cible > .16);
        racine.classList.toggle('a-famille', pousse(cible) > .97);
        if (!boucle) boucle = requestAnimationFrame(avancer);
      };
      choisir();
      portrait.addEventListener('change', choisir);
      window.addEventListener('resize', () => { choisir(); majRacine(); });
      document.addEventListener('scroll', majRacine, { passive: true, capture: true });   // la planche défile dans son onglet
      majRacine();
    }
  };
  if (racine) {
    if (window.MIAILHE_RACINE) planterRacine();
    else {
      const demander = () => {
        const s = document.createElement('script');
        s.src = 'assets/js/racine-planche.js';
        s.onload = planterRacine;
        document.head.appendChild(s);
      };
      const plusTard = () => (window.requestIdleCallback ? requestIdleCallback(demander, { timeout: 1500 }) : setTimeout(demander, 300));
      if (document.readyState === 'complete') plusTard(); else addEventListener('load', plusTard, { once: true });
    }
  }
})();
