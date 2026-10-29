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
    if (a) el.insertAdjacentHTML('beforeend', `<svg viewBox="${A.viewBox}" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="${el.dataset.forme === 'petit' ? a.petit : a.complet}"/></svg>`);
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

  /* =====================================================================
     Les ateliers : ce que chaque château raconte à sa façon (sections générées par generer_chateaux.py)
     ===================================================================== */

  /* ---------- Coufran : la roue des quatre mots ---------- */
  document.querySelectorAll('[data-mots]').forEach(roue => {
    const mots = [...roue.querySelectorAll('.mot')], notes = [...roue.querySelectorAll('.mot-note')];
    const choisir = k => {
      mots.forEach((m, j) => { m.classList.toggle('is-actif', j === k); m.setAttribute('aria-pressed', j === k); });
      notes.forEach((n, j) => { n.hidden = j !== k; });
    };
    mots.forEach((m, k) => {
      m.addEventListener('click', () => choisir(k));
      m.addEventListener('mouseenter', () => choisir(k));
      m.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choisir(k); } });
    });
    choisir(0);
  });

  /* ---------- Coufran : la cave de Louis ---------- */
  document.querySelectorAll('[data-cave]').forEach(cave => {
    const culots = [...cave.querySelectorAll('.culot')];
    const note = cave.querySelector('.cave-note');
    culots.forEach(b => b.addEventListener('click', () => {
      culots.forEach(x => x.setAttribute('aria-pressed', x === b));
      note.querySelector('.cave-annee').textContent = b.dataset.annee;
      note.querySelector('.cave-texte').textContent = b.dataset.note;
      note.querySelector('.cave-vedette').hidden = !b.classList.contains('is-vedette');
      note.classList.remove('anime'); void note.offsetWidth; note.classList.add('anime');
    }));
  });

  /* ---------- Coufran : Couffrant devient Coufran (avant/après) ---------- */
  document.querySelectorAll('[data-avant-apres]').forEach(aa => {
    const curseur = aa.querySelector('input');
    const maj = () => aa.style.setProperty('--pos', `${curseur.value}%`);
    curseur.addEventListener('input', maj);
    maj();
  });

  /* ---------- Verdignan : le temps de la garde ---------- */
  document.querySelectorAll('[data-garde]').forEach(g => {
    const choix = g.querySelector('select'), curseur = g.querySelector('.garde-curseur');
    const annee = g.querySelector('.garde-age strong'), age = g.querySelector('.garde-age span');
    const frise = g.querySelector('.garde-frise'), ages = [...frise.querySelectorAll('li')];
    const note = g.querySelector('.garde-note p');
    const maintenant = new Date().getFullYear();
    const maj = a => {
      choix.value = a; curseur.value = a;
      const n = maintenant - a;
      annee.textContent = a;
      age.textContent = `${n} ans en ${maintenant}`;
      let k = ages.findIndex(li => n >= +li.dataset.de && n <= +li.dataset.a);
      if (k < 0) k = ages.length - 1;
      ages.forEach((li, j) => li.classList.toggle('is-ici', j === k));
      const de = +ages[k].dataset.de, duree = Math.min(+ages[k].dataset.a, de + 12) - de + 1;
      frise.style.setProperty('--repere', `${((k + Math.min(1, (n - de + .5) / duree)) / ages.length) * 100}%`);
      note.textContent = choix.selectedOptions[0].dataset.note;
    };
    choix.addEventListener('change', () => maj(+choix.value));
    curseur.addEventListener('input', () => maj(+curseur.value));
    maj(+curseur.value);
  });

  /* ---------- Verdignan : la loupe du linteau ---------- */
  document.querySelectorAll('[data-loupe]').forEach(piece => {
    const zone = piece.querySelector('.linteau');
    const cx = +piece.dataset.x, cy = +piece.dataset.y;
    let trouve = false, pres = 0;
    const reveler = () => {
      if (trouve) return;
      trouve = true;
      piece.classList.add('is-trouve');
      zone.classList.remove('is-actif');
      piece.querySelector('.piece-valeur').textContent = piece.dataset.valeur;
      piece.querySelector('.piece-legende').hidden = false;
      piece.querySelector('.loupe-consigne').textContent = 'Trouvée : la date est gravée dans la pierre.';
      piece.querySelector('.loupe-aide').hidden = true;
    };
    const bouger = e => {
      if (trouve) return;
      const r = zone.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top - (e.pointerType === 'touch' ? 70 : 0);   // au doigt, la loupe se tient au-dessus
      zone.style.setProperty('--lx', `${x}px`);
      zone.style.setProperty('--ly', `${y}px`);
      zone.style.setProperty('--rayon', `${Math.max(42, r.width * .13)}px`);
      zone.classList.add('is-actif');
      // la date est trouvée quand la loupe s'y attarde un instant
      if (Math.abs(x / r.width * 100 - cx) < 11 && Math.abs(y / r.height * 100 - cy) < 9) { if (++pres > 10) reveler(); }
      else pres = Math.max(0, pres - 1);
    };
    zone.addEventListener('pointermove', bouger);
    zone.addEventListener('pointerdown', e => { zone.setPointerCapture(e.pointerId); bouger(e); });
    zone.addEventListener('pointerleave', () => zone.classList.remove('is-actif'));
    zone.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') zone.classList.remove('is-actif'); });
    piece.querySelector('.loupe-aide').addEventListener('click', reveler);
    if (capture) reveler();
  });

  /* ---------- Verdignan : la gabarre remonte l'estuaire au fil de la page ---------- */
  document.querySelectorAll('[data-gabarre]').forEach(fig => {
    const route = fig.querySelector('.route'), bateau = fig.querySelector('.gabarre');
    const longueur = route.getTotalLength();
    const placer = () => {
      const r = fig.getBoundingClientRect(), h = window.innerHeight;
      const p = reduit ? .45 : Math.min(1, Math.max(0, (h * .85 - r.top) / (r.height + h * .25)));
      const pt = route.getPointAtLength(p * longueur);
      bateau.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    };
    window.addEventListener('scroll', placer, { passive: true });
    window.addEventListener('resize', placer);
    placer();
  });

  /* ---------- Soudars : les occasions (onglets) ---------- */
  document.querySelectorAll('[data-partage]').forEach(zone => {
    const onglets = [...zone.querySelectorAll('[role="tab"]')];
    const choisir = (b, focus) => {
      onglets.forEach(o => {
        const ok = o === b;
        o.setAttribute('aria-selected', ok);
        o.tabIndex = ok ? 0 : -1;
        document.getElementById(o.getAttribute('aria-controls')).hidden = !ok;
      });
      if (focus) b.focus();
      document.dispatchEvent(new CustomEvent('soudars:occasion', { detail: b.dataset.occasion }));
    };
    onglets.forEach((b, k) => {
      b.addEventListener('click', () => choisir(b));
      b.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); choisir(onglets[(k + d + onglets.length) % onglets.length], true); }
      });
    });
  });

  /* ---------- Soudars : l'invitation (aperçu, image, partage, e-mail, copie) ---------- */
  document.querySelectorAll('[data-invitation]').forEach(inv => {
    const carte = inv.querySelector('.carte-invitation'), occasion = carte.querySelector('.carte-occasion');
    const champs = [...inv.querySelectorAll('input')];
    const retour = inv.querySelector('.invitation-retour');
    let minuterie;
    const dire = m => { retour.textContent = m; clearTimeout(minuterie); minuterie = setTimeout(() => { retour.textContent = ''; }, 5000); };
    const valeur = nom => { const c = champs.find(i => i.name === nom); return c.value.trim() || c.placeholder; };
    champs.forEach(c => c.addEventListener('input', () => { carte.querySelector(`[data-champ="${c.name}"]`).textContent = valeur(c.name); }));
    document.addEventListener('soudars:occasion', e => { occasion.textContent = e.detail; });
    const SANTE = "Château Soudars · Haut-Médoc. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.";
    const texte = () => `${occasion.textContent}, chez ${valeur('prenom')}.\n${valeur('quand')}\n${valeur('ou')}\n\nOn ouvre un Soudars.\n\n${SANTE}`;

    // L'image : la carte redessinée en 1080 x 1350, dans les polices du site
    const dessiner = async () => {
      const W = 1080, H = 1350, toile = document.createElement('canvas');
      toile.width = W; toile.height = H;
      const g = toile.getContext('2d');
      await Promise.all(['80px "Cooper Black"', 'italic 46px "Bookman"', '36px "Circular"'].map(f => document.fonts.load(f).catch(() => null)));
      const style = getComputedStyle(carte);
      g.fillStyle = style.backgroundColor; g.fillRect(0, 0, W, H);
      g.fillStyle = style.color; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      const A = window.MIAILHE_ARMOIRIES, cle = carte.querySelector('[data-armoirie]').dataset.armoirie;
      if (A && A[cle]) { g.save(); g.translate(W / 2 - 70, 130); g.scale(140 / 160, 140 / 160); g.fill(new Path2D(A[cle].complet), 'evenodd'); g.restore(); }
      const ecrire = (txt, police, y, interligne, max = 880) => {   // texte centré, coupé en lignes de largeur max
        g.font = police;
        const lignes = [''];
        txt.split(' ').forEach(m => {
          const der = lignes.length - 1, essai = lignes[der] ? `${lignes[der]} ${m}` : m;
          if (lignes[der] && g.measureText(essai).width > max) lignes.push(m); else lignes[der] = essai;
        });
        lignes.forEach((l, k) => g.fillText(l, W / 2, y + k * interligne));
        return y + lignes.length * interligne;
      };
      let y = ecrire(occasion.textContent, '86px "Cooper Black", Georgia, serif', 470, 92);
      y = ecrire(`chez ${valeur('prenom')}`, 'italic 48px "Bookman", Georgia, serif', y + 46, 58);
      y = ecrire(valeur('quand'), '38px "Circular", sans-serif', y + 44, 50);
      y = ecrire(valeur('ou'), '38px "Circular", sans-serif', y, 50);
      ecrire('On ouvre un Soudars.', '56px "Cooper Black", Georgia, serif', y + 80, 64);
      g.globalAlpha = .8;
      ecrire(SANTE, '24px "Circular", sans-serif', H - 120, 32, 760);
      return new Promise(r => toile.toBlob(r, 'image/png'));
    };
    const fichier = blob => new File([blob], 'invitation-soudars.png', { type: 'image/png' });

    inv.querySelector('[data-action="image"]').addEventListener('click', async () => {
      const blob = await dessiner();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'invitation-soudars.png';
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      dire("L'image de l'invitation est enregistrée.");
    });
    inv.querySelector('[data-action="partager"]').addEventListener('click', async () => {
      if (!navigator.share) { dire("Le partage n'est pas disponible ici : enregistrez l'image ou envoyez un e-mail."); return; }
      try {
        const f = fichier(await dessiner());
        await navigator.share(navigator.canShare && navigator.canShare({ files: [f] }) ? { files: [f], text: texte() } : { title: 'Invitation', text: texte() });
      } catch (e) { /* partage annulé */ }
    });
    inv.querySelector('[data-action="mail"]').addEventListener('click', e => {
      e.currentTarget.href = `mailto:?subject=${encodeURIComponent(`Invitation : ${occasion.textContent}`)}&body=${encodeURIComponent(texte())}`;
    });
    inv.querySelector('[data-action="copier"]').addEventListener('click', () => {
      (navigator.clipboard ? navigator.clipboard.writeText(texte()) : Promise.reject())
        .then(() => dire("Le texte de l'invitation est copié."), () => dire('Copie impossible ici : sélectionnez le texte de la carte.'));
    });
  });

  /* ---------- Soudars : épierrer la parcelle ---------- */
  document.querySelectorAll('[data-epierrer]').forEach(jeu => {
    const parcelle = jeu.querySelector('.parcelle'), vigne = jeu.querySelector('.vigne');
    const compteur = jeu.querySelector('.compteur'), fin = jeu.querySelector('.epierrer-fin');
    const TEINTES = ['#efe9dd', '#e2d9c8', '#d6cbb7', '#e9dfcd', '#cbbfaa'];
    const hasard = (a, b) => a + Math.random() * (b - a);
    let pierres = [], total = 0;

    // La vigne qui pousse une fois la terre nette : cinq rangs, des ceps et leurs feuilles
    const FEUILLE = 'M0 0C-7-3-11-10-8-17C-4-14-1-14 0-18C1-14 4-14 8-17C11-10 7-3 0 0Z';
    let rangs = '';
    [120, 200, 280, 360, 440].forEach((y, r) => {
      rangs += `<line class="rang" x1="20" y1="${y - 26}" x2="880" y2="${y - 26}"/>`;
      for (let x = 50, i = 0; x < 870; x += 64, i++) {
        const d = (r * .12 + i * .035).toFixed(2);
        rangs += `<g class="cep" style="transition-delay:${d}s"><path d="M${x} ${y}C${x - 4} ${y - 14} ${x + 5} ${y - 22} ${x} ${y - 34}"/>` +
          `<path class="feuille" d="${FEUILLE}" transform="translate(${x - 2} ${y - 26}) rotate(-50) scale(.9)"/>` +
          `<path class="feuille" d="${FEUILLE}" transform="translate(${x + 2} ${y - 30}) rotate(40) scale(1)"/></g>`;
      }
    });
    vigne.innerHTML = rangs;

    const caillou = () => {
      const n = 9, pts = [];
      for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2, r = hasard(36, 48); pts.push([50 + Math.cos(a) * r * 1.15, 50 + Math.sin(a) * r * .78]); }
      const mi = (p, q) => `${((p[0] + q[0]) / 2).toFixed(1)} ${((p[1] + q[1]) / 2).toFixed(1)}`;
      let d = `M${mi(pts[n - 1], pts[0])}`;
      pts.forEach((p, k) => { d += `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${mi(p, pts[(k + 1) % n])}`; });
      return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${d}Z" fill="${TEINTES[Math.floor(Math.random() * TEINTES.length)]}" stroke="rgba(90,70,50,.35)" stroke-width="1.5"/>` +
        `<ellipse cx="${hasard(34, 46).toFixed(0)}" cy="${hasard(32, 40).toFixed(0)}" rx="16" ry="8" fill="#fff" opacity=".35"/></svg>`;
    };
    const maj = () => {
      const n = total - pierres.length;
      compteur.innerHTML = `<strong>${n}</strong>${n > 1 ? 'pierres retirées' : 'pierre retirée'} sur ${total}`;
    };
    const semer = () => {
      parcelle.querySelectorAll('.pierre').forEach(p => p.remove());
      parcelle.classList.remove('is-nette'); fin.hidden = true;
      total = window.innerWidth < 600 ? 24 : 36;
      pierres = [];
      for (let k = 0; k < total; k++) {
        const el = document.createElement('span');
        const x = hasard(5, 95), y = hasard(8, 92), l = hasard(4.5, 8.5);
        el.className = 'pierre';
        el.style.cssText = `--x:${x}%;--y:${y}%;--l:${l}%;--rot:${hasard(0, 360).toFixed(0)}deg;--dx:${((x - 50) * 9).toFixed(0)}px;--dy:${(hasard(-1, 1) * 160 - 120).toFixed(0)}px`;
        el.innerHTML = caillou();
        parcelle.append(el);
        pierres.push({ el, x, y, l });
      }
      maj();
    };
    const retirer = p => {
      p.el.classList.add('is-partie');
      pierres = pierres.filter(q => q !== p);
      maj();
      if (!pierres.length) { parcelle.classList.add('is-nette'); fin.hidden = false; }
    };
    // Touché ou balayé : toute pierre sous le doigt ou la souris s'en va
    let appuye = false;
    const balayer = e => {
      const r = parcelle.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width * 100, py = (e.clientY - r.top) / r.height * 100;
      pierres.filter(p => Math.hypot(px - p.x, (py - p.y) * r.height / r.width) < p.l * .62).forEach(retirer);
    };
    parcelle.addEventListener('pointerdown', e => { appuye = true; parcelle.setPointerCapture(e.pointerId); balayer(e); });
    parcelle.addEventListener('pointermove', e => { if (appuye) balayer(e); });
    ['pointerup', 'pointercancel'].forEach(t => parcelle.addEventListener(t, () => { appuye = false; }));
    parcelle.tabIndex = 0;
    parcelle.setAttribute('aria-label', 'Parcelle à épierrer : appuyez sur Entrée pour retirer une pierre');
    parcelle.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && pierres.length) { e.preventDefault(); retirer(pierres[0]); } });
    jeu.querySelector('[data-recommencer]').addEventListener('click', semer);
    semer();
  });
})();
