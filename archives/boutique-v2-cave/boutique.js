/* La boutique de la famille (boutique.html, 28/10/2026 ; refaite le même jour en cave de famille, cinématique).
   Le catalogue vient des deux anciennes boutiques (assets/js/boutique-catalogue.js, écrit par
   source/boutique/releve_boutiques.py) : mêmes vins, mêmes prix TTC à la bouteille. Les bouteilles de 75 cl se vendent
   par carton de 6, les doubles magnums de Soudars à l'unité. Un seul panier pour les trois châteaux, gardé dans le
   navigateur (localStorage « miailhe-panier ») : tous les cartons comptent ensemble pour la livraison offerte (dès 12
   bouteilles ou un double magnum, sinon 30 €, les conditions des anciennes boutiques).
   Ce que ce script écrit :
   - les doyennes : la plus ancienne bouteille de chaque château encore en vente ;
   - la cave : un chapitre par château, ouvert sur le film de l'accueil de son site (joué quand on le voit), puis ses vins ;
   - la fiche d'un vin (au clic sur sa bouteille), le tiroir du panier (boutique.html#panier l'ouvre à l'arrivée) ;
   - la commande, une maquette : rien n'est envoyé, rien n'est débité. Elle reprend les coordonnées de l'espace client
     (localStorage « miailhe-client », compte.html) et s'y range (« miailhe-commandes », la plus récente d'abord).
   Textes : en français ici, traduits par MIAILHE.t / MIAILHE.tf (langue.js) ; noms, millésimes et prix restent tels quels. */
(function () {
  const M = (window.MIAILHE = window.MIAILHE || {});
  const B = window.MIAILHE_BOUTIQUE;
  const NOTES = window.MIAILHE_MILLESIMES || {};
  const racine = document.querySelector('[data-catalogue]');
  if (!B || !racine) return;
  const t = s => (M.t ? M.t(s) : s);
  const tf = (s, ...v) => (M.tf ? M.tf(s, v) : s.replace(/\{(\d+)\}/g, (m, i) => v[i] ?? ''));
  const store = M.store || { get: () => null, set: () => {} };
  const lireJSON = (k, defaut) => { try { return JSON.parse(store.get(k) || 'null') ?? defaut; } catch (e) { return defaut; } };
  const echapper = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lent = !M.reduceMotion;

  // Chaque château : sa génération, son film (celui de l'accueil de son site), sa phrase et son histoire (faits des sites)
  const CHATEAUX = {
    coufran: { nom: 'Château Coufran', n2: 'N°2 de Coufran', qui: 'Chez Louis, le grand-père · 1924', trait: 'Le caractère',
      img: 'bouteille-coufran.webp', img2: 'bouteille-coufran-n2.webp', film: 'coufran-intro', affiche: 'coufran-hero.jpg', garde: true,
      ligne: ['Goûtez le {0} du grand-père.', 'caractère'],
      histoire: "En 1924, Louis achète Coufran et le replante en merlot, quand ses voisins ne jurent que par le cabernet. Un vin rond et charnu, qu'on surnomme le Pomerol du Médoc." },
    verdignan: { nom: 'Château Verdignan', n2: 'N°2 de Verdignan', qui: 'Chez Jean, le père · 1972', trait: "L'élégance classique",
      img: 'bouteille-verdignan.webp', img2: 'bouteille-verdignan-n2.webp', film: 'verdignan-intro', affiche: 'verdignan-hero.jpg', garde: true,
      ligne: ["Gardez l'{0} du père.", 'élégance'],
      histoire: "En 1972, Jean, dernier courtier de la famille, achète Verdignan, le château voisin qui regarde l'estuaire. Un vin classique et droit, fait pour la garde : nous le gardons pour vous jusqu'à ce qu'il soit prêt." },
    soudars: { nom: 'Château Soudars', n2: 'N°2 de Soudars', qui: 'Chez Éric, le fils · 1973', trait: 'Le plaisir partagé',
      img: 'bouteille-soudars.webp', img2: 'bouteille-soudars.webp', film: 'soudars-intro', affiche: 'soudars-intro-poster.jpg', garde: false,
      ligne: ['Partagez le {0} du fils.', 'plaisir'],
      histoire: "En 1973, Éric bâtit Soudars sur des friches encombrées de pierres et replante presque tout le vignoble. Un vin gourmand, qui se partage dès sa jeunesse ; ses doubles magnums attendent les grandes tablées." },
  };
  const ORDRE = ['coufran', 'verdignan', 'soudars'];
  const SOUDARS_MILLESIMES = [2014, 2015, 2016, 2017, 2018];   // les bouteilles photographiées une à une
  const L = B.livraison;
  const CARTON = 6;
  const ANNEE = new Date().getFullYear();

  const produits = B.produits.map(p => {
    const c = CHATEAUX[p.chateau];
    const n2 = p.vin === 'n2';
    const slug = n2 ? `n2-de-${p.chateau}` : `chateau-${p.chateau}`;
    let img = n2 ? c.img2 : c.img;
    if (p.chateau === 'soudars' && SOUDARS_MILLESIMES.includes(p.millesime)) img = `bouteille-soudars-${p.millesime}.webp`;
    const note = !n2 && NOTES[p.chateau] && NOTES[p.chateau].notes ? NOTES[p.chateau].notes[p.millesime] : null;
    return { ...p, id: `${p.chateau}-${p.vin}-${p.forme}-${p.millesime}`, slug, nom: n2 ? c.n2 : c.nom, img, note,
      pas: p.forme === 'double-magnum' ? 1 : CARTON, age: ANNEE - p.millesime };
  });
  const parId = Object.fromEntries(produits.map(p => [p.id, p]));

  // La plage des millésimes, dans l'ouverture
  const ans = produits.map(p => p.millesime).filter(Boolean);
  const plage = document.querySelector('[data-bq-plage]');
  if (plage && ans.length) plage.textContent = tf('de {0} à {1}', Math.min(...ans), Math.max(...ans));

  /* ---------- Les prix, les mots ---------- */
  const locale = { fr: 'fr-FR', en: 'en-GB', ja: 'ja-JP' }[M.langue] || 'fr-FR';
  const euros = n => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(n);
  const prixHtml = n => `<span class="bq-prix-valeur" translate="no">${euros(n)}</span>`;
  const dm = p => p.forme === 'double-magnum';
  const format = p => (dm(p) ? t('Double magnum · 3 L') : t('Bouteille 75 cl · carton de 6'));
  const unite = p => (dm(p) ? t("l'unité") : t('la bouteille'));
  const carton = p => (dm(p) ? '' : `<p class="bq-carton">${tf('{0} le carton de 6', `<span translate="no">${euros(p.prix * CARTON)}</span>`)}</p>`);
  const age = p => (p.age === 1 ? t('1 an') : tf('{0} ans', p.age));
  const quantite = (p, q) => p.pas === CARTON
    ? (q / CARTON === 1 ? t('1 carton') : tf('{0} cartons', q / CARTON))
    : (q === 1 ? t('1 double magnum') : tf('{0} doubles magnums', q));
  // dans le petit compteur d'une fiche, le double magnum (déjà nommé sur la fiche) n'est qu'un nombre
  const compteur = (p, q) => (p.pas === CARTON ? quantite(p, q) : String(q));
  const ligne = c => tf(c.ligne[0], `<em>${t(c.ligne[1])}</em>`);
  const voirFiche = p => tf('Voir la fiche : {0} {1}', p.nom, p.millesime);

  /* ---------- Le panier ---------- */
  let panier = lireJSON('miailhe-panier', {}) || {};
  Object.keys(panier).forEach(id => { if (!parId[id] || !(panier[id] > 0)) delete panier[id]; });
  const garder = () => store.set('miailhe-panier', JSON.stringify(panier));
  const totaux = () => {
    let bouteilles = 0, magnums = 0, sousTotal = 0;
    for (const [id, q] of Object.entries(panier)) {
      const p = parId[id];
      if (dm(p)) magnums += q; else bouteilles += q;
      sousTotal += q * p.prix;
    }
    const offerte = bouteilles >= L.gratuite_des_bouteilles || (L.gratuite_avec_double_magnum && magnums > 0);
    const port = (bouteilles || magnums) && !offerte ? L.forfait_6_bouteilles : 0;
    return { bouteilles, magnums, sousTotal, port, offerte, total: sousTotal + port, articles: bouteilles + magnums };
  };

  /* ---------- Le choix d'une quantité, l'ajout ---------- */
  const ajout = p => (p.stock ? `<div class="bq-ajout">
          <div class="bq-qte" data-qte="${p.pas}">
            <button type="button" data-moins aria-label="${t('Un de moins')}">−</button>
            <output>${compteur(p, p.pas)}</output>
            <button type="button" data-plus aria-label="${t('Un de plus')}">+</button>
          </div>
          <button class="bq-ajouter" type="button" data-ajouter>${t('Ajouter')}</button>
        </div>
        <p class="bq-dans-panier" data-dans-panier${panier[p.id] ? '' : ' hidden'}>${panier[p.id] ? tf('Dans votre panier : {0}', quantite(p, panier[p.id])) : ''}</p>`
    : `<p class="bq-rupture">${t('Épuisé')}</p>`);

  /* ---------- Les doyennes : la plus ancienne bouteille de chaque château ---------- */
  const doyennes = document.querySelector('[data-doyennes]');
  const doyenne = k => produits.filter(p => p.chateau === k && p.stock && p.vin !== 'n2').sort((a, b) => a.millesime - b.millesime)[0];
  const carteDoyenne = p => {
    const c = CHATEAUX[p.chateau];
    const texte = p.note ? t(p.note) : (dm(p) ? t('Un double magnum de trois litres, pour les grandes tablées : la bouteille de la famille qui se partage.') : t(c.histoire));
    return `<article class="bq-doyenne bq-apparait${dm(p) ? ' bq-doyenne--dm' : ''}" data-chateau="${p.chateau}" data-id="${p.id}">
      <button class="bq-doyenne-scene" type="button" data-fiche aria-label="${echapper(voirFiche(p))}">
        <span class="motif" aria-hidden="true"></span>
        <span class="bq-doyenne-an" aria-hidden="true" translate="no">${p.millesime}</span>
        <img src="assets/img/${p.img}" alt="" loading="lazy">
        <span class="bq-doyenne-age">${age(p)}</span>
      </button>
      <div class="bq-doyenne-texte">
        <p class="bq-doyenne-qui">${t(c.qui)}</p>
        <h3 class="bq-doyenne-nom"><span translate="no">${p.nom} ${p.millesime}</span><small>${format(p)}</small></h3>
        <p class="bq-doyenne-note">${texte}</p>
        <div class="bq-doyenne-bas">
          <p class="bq-doyenne-prix">${prixHtml(dm(p) ? p.prix : p.prix * CARTON)}<small>${dm(p) ? t('le double magnum') : tf('le carton de 6, soit {0} la bouteille', `<span translate="no">${euros(p.prix)}</span>`)}</small></p>
          <button class="bq-ajouter" type="button" data-ajouter>${dm(p) ? t('Ajouter au panier') : t('Ajouter un carton')}</button>
        </div>
      </div>
    </article>`;
  };
  if (doyennes) doyennes.innerHTML = ORDRE.map(doyenne).filter(Boolean).map(carteDoyenne).join('');

  /* ---------- La cave : un chapitre par château ---------- */
  const carte = p => `<article class="bq-vin bq-apparait${dm(p) ? ' bq-vin--dm' : ''}" data-id="${p.id}" data-vin="${p.slug}"${p.stock ? '' : ' data-rupture'}>
      <button class="bq-vin-image" type="button" data-fiche aria-label="${echapper(voirFiche(p))}">
        <img src="assets/img/${p.img}" alt="" loading="lazy">
        <span class="bq-vin-age">${age(p)}</span>
        ${dm(p) ? '<span class="bq-badge" translate="no">3 L</span>' : ''}
        <span class="bq-vin-voir" aria-hidden="true">${t('Voir la fiche')}</span>
      </button>
      <div class="bq-vin-texte">
        <p class="bq-vin-nom" translate="no">${p.nom}</p>
        <p class="bq-vin-an" translate="no">${p.millesime}</p>
        <p class="bq-vin-format">${format(p)}</p>
        ${p.note ? `<p class="bq-vin-note">${t(p.note)}</p>` : ''}
        <div class="bq-vin-prix"><p>${prixHtml(p.prix)} <small>${unite(p)}</small></p>${carton(p)}</div>
        ${ajout(p)}
      </div>
    </article>`;

  const section = (k, liste) => {
    const c = CHATEAUX[k];
    const groupe = (titre, ps) => ps.length ? `${titre ? `<h3 class="bq-groupe">${titre}</h3>` : ''}<div class="bq-grille">${ps.map(carte).join('')}</div>` : '';
    const btl = liste.filter(p => !dm(p)), mag = liste.filter(dm);
    const deux = btl.length && mag.length;
    const ms = liste.map(p => p.millesime);
    const n = liste.length === 1 ? t('1 vin') : tf('{0} vins', liste.length);
    const de = Math.min(...ms) === Math.max(...ms) ? String(ms[0]) : tf('de {0} à {1}', Math.min(...ms), Math.max(...ms));
    return `<section class="bq-chateau" id="${k}" data-chateau="${k}" aria-labelledby="titre-${k}">
      <header class="bq-chapitre${etat.q ? ' bq-chapitre--sobre' : ''}">
        ${etat.q ? '' : `<video class="bq-chapitre-film" muted loop playsinline preload="none" poster="assets/img/${c.affiche}" aria-hidden="true" data-film="${c.film}"></video>`}
        <div class="bq-chapitre-texte">
          <span class="armoirie" data-armoirie="${k}"></span>
          <p class="bq-chapitre-qui">${t(c.qui)}</p>
          <h2 id="titre-${k}" class="bq-chapitre-nom"><span class="logo-chateau" data-logo-chateau="${k}" data-forme="logo"></span><span class="sr-only">${c.nom}</span></h2>
          <p class="bq-chapitre-ligne">${ligne(c)}</p>
          <p class="bq-chapitre-histoire">${t(c.histoire)}</p>
          <a class="bq-lien" href="${k}/index.html">${t('Découvrir le château')}</a>
        </div>
        <p class="bq-chapitre-compte"><span translate="no">${n} · ${de}</span></p>
      </header>
      <div class="bq-rayon">${groupe(deux ? t('Bouteilles 75 cl') : '', btl)}${groupe(deux ? t('Doubles magnums 3 L') : '', mag)}</div>
    </section>`;
  };

  const LG = window.MIAILHE_LOGOS_CHATEAUX, A = window.MIAILHE_ARMOIRIES;
  const habiller = el => {
    // logos et armoiries écrits après le chargement (logos-chateaux.js et main.js ne voient que la page de départ)
    el.querySelectorAll('[data-logo-chateau]').forEach(s => {
      const v = LG && LG[s.dataset.logoChateau] && LG[s.dataset.logoChateau].logo;
      if (v && !s.querySelector('svg')) s.insertAdjacentHTML('beforeend', `<svg viewBox="${v.viewBox}" aria-hidden="true" focusable="false"><path fill="currentColor" d="${v.d}"/></svg>`);
    });
    el.querySelectorAll('.armoirie[data-armoirie]').forEach(s => {
      const a = A && A[s.dataset.armoirie];
      if (a && !s.querySelector('svg')) s.insertAdjacentHTML('beforeend', `<svg viewBox="${A.viewBox}" aria-hidden="true" focusable="false"><path class="armoirie-fond" d="${A.bouclier}"/><path fill="currentColor" fill-rule="evenodd" d="${s.dataset.forme === 'petit' ? a.petit : a.complet}"/></svg>`);
    });
  };

  /* ---------- Les apparitions et les films : on joue ce qu'on voit ---------- */
  const apparition = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    apparition.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px', threshold: .06 });
  const observer = el => el.querySelectorAll('.bq-apparait').forEach((x, i) => {
    if (!lent) { x.classList.add('is-in'); return; }
    x.style.transitionDelay = `${(i % 4) * 70}ms`;
    apparition.observe(x);
  });
  const films = new IntersectionObserver(entries => entries.forEach(e => {
    const chap = e.target, v = chap.querySelector('video[data-film]');
    if (e.isIntersecting) {
      chap.classList.add('is-vu');
      if (!v || !lent) return;
      if (!v.querySelector('source')) {
        v.innerHTML = `<source src="assets/video/${v.dataset.film}.webm" type="video/webm"><source src="assets/video/${v.dataset.film}.mp4" type="video/mp4">`;
        v.load();
      }
      v.play().catch(() => { /* lecture refusée : l'affiche reste */ });
    } else if (v && !v.paused) v.pause();
  }), { threshold: .2 });

  if (doyennes) { habiller(doyennes); observer(doyennes); }
  habiller(document.querySelector('.bq-famille') || document.createElement('i'));

  const compte = document.querySelector('[data-bq-compte]');
  const cave = document.querySelector('#la-cave');
  const barre = document.querySelector('.bq-filtres');
  const etat = { chateau: 'tous', forme: 'tout', tri: 'jeune', q: '' };
  // la recherche : sans accents ni casse, « N°2 », « n° 2 » et « n2 » se valent ; tous les mots doivent se trouver
  const plat = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\bn\s*[°º.]?\s*2\b/g, 'n2').replace(/[^a-z0-9]+/g, ' ').trim();
  const fouilles = Object.fromEntries(produits.map(p => [p.id, ` ${plat([p.nom, CHATEAUX[p.chateau].nom, p.millesime, dm(p) ? 'double magnum 3 l' : 'bouteille 75 cl', p.vin === 'n2' ? 'second vin' : 'grand vin', t(CHATEAUX[p.chateau].qui)].join(' '))} `]));
  const trouve = p => !etat.q || plat(etat.q).split(' ').every(m => fouilles[p.id].includes(` ${m}`));
  const trier = (a, b) => ({
    jeune: b.millesime - a.millesime || a.prix - b.prix,
    ancien: a.millesime - b.millesime || a.prix - b.prix,
    prix: a.prix - b.prix || b.millesime - a.millesime,
    'prix-desc': b.prix - a.prix || b.millesime - a.millesime,
  })[etat.tri];
  const afficher = () => {
    const choisis = produits.filter(p => (etat.chateau === 'tous' || p.chateau === etat.chateau) && (etat.forme === 'tout' || p.forme === etat.forme) && trouve(p)).sort(trier);
    racine.querySelectorAll('.bq-chapitre').forEach(c => films.unobserve(c));
    racine.innerHTML = ORDRE.filter(k => choisis.some(p => p.chateau === k)).map(k => section(k, choisis.filter(p => p.chateau === k))).join('')
      || (etat.q ? `<div class="bq-introuvable">
          <p>${tf('Aucun vin ne répond à « {0} ».', `<span translate="no">${echapper(etat.q)}</span>`)}</p>
          <p>${t('Essayez un château, un millésime ou un format : tous les vins des trois châteaux sont ici.')}</p>
          <div class="bq-suggestions"><button type="button" data-suggestion="Soudars">Soudars</button><button type="button" data-suggestion="2005">2005</button><button type="button" data-suggestion="N°2">N°2</button><button type="button" data-suggestion="${echapper(t('double magnum'))}">${t('double magnum')}</button></div>
          <button class="bq-lien" type="button" data-effacer-recherche>${t('Effacer la recherche')}</button>
        </div>` : `<p class="bq-vide">${t('Aucun vin pour ce choix.')}</p>`);
    habiller(racine);
    observer(racine);
    racine.querySelectorAll('.bq-chapitre').forEach(c => films.observe(c));
    if (compte) compte.textContent = choisis.length === 1 ? t('1 vin') : tf('{0} vins', choisis.length);
    document.querySelectorAll('[data-filtre]').forEach(g => g.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.valeur === etat[g.dataset.filtre]))));
  };
  // après un changement de filtre, si la cave est déjà passée, on revient à son début, sous la barre des filtres
  const revenirALaCave = () => {
    if (!barre || racine.getBoundingClientRect().top >= barre.getBoundingClientRect().bottom) return;
    window.scrollTo({ top: racine.getBoundingClientRect().top + scrollY - barre.getBoundingClientRect().bottom + 1, behavior: 'auto' });
  };

  document.querySelectorAll('[data-filtre]').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button[data-valeur]');
    if (!b) return;
    etat[g.dataset.filtre] = b.dataset.valeur;
    if (g.dataset.filtre === 'chateau') history.replaceState(null, '', b.dataset.valeur === 'tous' ? location.pathname + location.search.replace(/[?&]vin=[^&]*/, '') : '#' + b.dataset.valeur);
    afficher();
    revenirALaCave();
  }));
  const champRecherche = document.querySelector('[data-recherche]');
  let attente = null;
  const chercher = q => {
    etat.q = q.trim();
    if (champRecherche && champRecherche.value !== q) champRecherche.value = q;
    afficher();
    revenirALaCave();
  };
  if (champRecherche) {
    champRecherche.addEventListener('input', () => { clearTimeout(attente); attente = setTimeout(() => chercher(champRecherche.value), 140); });
    champRecherche.addEventListener('keydown', e => { if (e.key === 'Escape' && champRecherche.value) { e.stopPropagation(); chercher(''); } });
  }
  racine.addEventListener('click', e => {
    const s = e.target.closest('[data-suggestion]');
    if (s) { chercher(s.dataset.suggestion); champRecherche && champRecherche.focus(); }
    if (e.target.closest('[data-effacer-recherche]')) { chercher(''); champRecherche && champRecherche.focus(); }
  });
  const tri = document.querySelector('[data-tri]');
  if (tri) tri.addEventListener('change', () => { etat.tri = tri.value; afficher(); revenirALaCave(); });

  /* ---------- Ajouter, retirer : sur une carte, une doyenne ou la fiche ---------- */
  const annonce = document.querySelector('[data-annonce]');
  const dire = s => { if (annonce) { annonce.textContent = ''; requestAnimationFrame(() => { annonce.textContent = s; }); } };
  const majDansPanier = () => document.querySelectorAll('[data-id] [data-dans-panier]').forEach(d => {
    const id = d.closest('[data-id]').dataset.id, n = panier[id] || 0;
    d.hidden = !n;
    d.textContent = n ? tf('Dans votre panier : {0}', quantite(parId[id], n)) : '';
  });
  const ajouter = (p, q, bouton) => {
    panier[p.id] = (panier[p.id] || 0) + q;
    garder();
    majPanier();
    majDansPanier();
    if (bouton) {
      const avant = bouton.textContent;
      bouton.classList.add('is-ajoute');
      bouton.textContent = t('Ajouté');
      setTimeout(() => { bouton.classList.remove('is-ajoute'); bouton.textContent = avant; }, 1600);
    }
    dire(tf('{0} {1} ajouté au panier : {2}.', p.nom, p.millesime, quantite(p, q)));
    document.querySelectorAll('[data-panier-compte]').forEach(c => { if (lent) c.animate([{ transform: 'scale(1.6)' }, { transform: 'none' }], { duration: 450, easing: 'ease-out' }); });
  };
  document.addEventListener('click', e => {
    const bloc = e.target.closest('[data-id]');
    if (!bloc || bloc.closest('.bq-panier')) return;
    const p = parId[bloc.dataset.id];
    if (!p) return;
    if (e.target.closest('[data-fiche]')) { ouvrirFiche(p); return; }
    const boite = bloc.querySelector('[data-qte]');
    let q = boite ? (+boite.dataset.q || p.pas) : p.pas;
    if (boite && e.target.closest('[data-plus]')) q += p.pas;
    if (boite && e.target.closest('[data-moins]')) q = Math.max(p.pas, q - p.pas);
    if (boite) { boite.dataset.q = q; boite.querySelector('output').textContent = compteur(p, q); }
    const bouton = e.target.closest('[data-ajouter]');
    if (bouton && p.stock) {
      ajouter(p, q, bouton);
      if (boite) { boite.dataset.q = p.pas; boite.querySelector('output').textContent = compteur(p, p.pas); }
    }
  });

  /* ---------- La fiche d'un vin ---------- */
  const fiche = document.querySelector('[data-fiche-panneau]');
  const ficheVoile = document.querySelector('.bq-fiche-voile');
  let ficheFocus = null, ficheEfface = null;
  const ouvrirFiche = p => {
    const c = CHATEAUX[p.chateau];
    ficheFocus = document.activeElement;
    clearTimeout(ficheEfface);
    const reperes = [`<li class="fort">${age(p)}</li>`, c.garde ? `<li>${t('Vieilli au château')}</li>` : '', `<li translate="no">Haut-Médoc</li>`].join('');
    fiche.className = `bq-fiche${dm(p) ? ' bq-fiche--dm' : ''}`;
    fiche.dataset.chateau = p.chateau;
    fiche.innerHTML = `
      <button class="bq-fiche-fermer" type="button" data-fermer-fiche aria-label="${t('Fermer la fiche')}"><span aria-hidden="true">×</span></button>
      <div class="bq-fiche-scene">
        <span class="motif" aria-hidden="true"></span>
        <span class="bq-doyenne-an" aria-hidden="true">${p.millesime}</span>
        <img src="assets/img/${p.img}" alt="${echapper(tf('{0} {1}, la bouteille signée MIAILHE', p.nom, p.millesime))}">
      </div>
      <div class="bq-fiche-corps" data-id="${p.id}">
        <span class="bq-fiche-logo logo-chateau" data-logo-chateau="${p.chateau}" data-forme="logo"></span>
        <p class="bq-fiche-qui">${t(c.qui)}</p>
        <h2 id="fiche-titre"><span translate="no">${p.nom} ${p.millesime}</span><small>${format(p)}</small></h2>
        <ul class="bq-reperes">${reperes}</ul>
        <div class="bq-fiche-note">
          <p>${p.note ? t("Ce qu'en dit le château") : t('Le château')}</p>
          <blockquote>${p.note ? t(p.note) : t(c.histoire)}</blockquote>
        </div>
        <div class="bq-fiche-prix"><p>${prixHtml(p.prix)} <small>${unite(p)}</small></p>${carton(p)}</div>
        ${ajout(p)}
        <p class="bq-fiche-port">${t('Livraison offerte dès 12 bouteilles ou un double magnum : les trois châteaux comptent ensemble.')}</p>
        <div class="bq-fiche-liens">
          <a class="bq-lien" href="${p.chateau}/${p.slug}.html">${t('La page du vin')}</a>
          <a class="bq-lien" href="${p.chateau}/index.html">${t('Découvrir le château')}</a>
        </div>
      </div>`;
    habiller(fiche);
    ficheVoile.hidden = false;
    fiche.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => { fiche.classList.add('is-ouvert'); ficheVoile.classList.add('is-ouvert'); });
    document.body.classList.add('bq-bloque');
    setTimeout(() => fiche.querySelector('.bq-fiche-fermer').focus(), 60);
  };
  const fermerFiche = () => {
    if (!fiche.classList.contains('is-ouvert')) return;
    fiche.classList.remove('is-ouvert');
    ficheVoile.classList.remove('is-ouvert');
    fiche.setAttribute('aria-hidden', 'true');
    if (!tiroir.classList.contains('is-ouvert')) document.body.classList.remove('bq-bloque');
    ficheEfface = setTimeout(() => { ficheVoile.hidden = true; }, 450);
    if (ficheFocus && ficheFocus.isConnected) ficheFocus.focus();
  };
  document.addEventListener('click', e => { if (e.target.closest('[data-fermer-fiche]')) fermerFiche(); });

  /* ---------- Le tiroir du panier ---------- */
  const tiroir = document.querySelector('.bq-panier');
  const voile = document.querySelector('.bq-voile');
  const corps = document.querySelector('[data-panier-corps]');
  const form = document.querySelector('[data-commande]');
  const merci = document.querySelector('[data-merci]');
  let dernierFocus = null, effacer = null;
  const ouvrir = (etape = 'panier') => {
    fermerFiche();
    dernierFocus = document.activeElement;
    clearTimeout(effacer);   // rouvert pendant que le voile s'efface : il reste
    voile.hidden = false;
    tiroir.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => { tiroir.classList.add('is-ouvert'); voile.classList.add('is-ouvert'); });
    document.body.classList.add('bq-bloque');
    montrer(etape);
    setTimeout(() => (tiroir.querySelector('.bq-fermer') || tiroir).focus(), 60);
  };
  const fermer = () => {
    tiroir.classList.remove('is-ouvert');
    voile.classList.remove('is-ouvert');
    tiroir.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('bq-bloque');
    effacer = setTimeout(() => { voile.hidden = true; }, 400);
    if (location.hash === '#panier') history.replaceState(null, '', location.pathname + location.search);
    if (dernierFocus && dernierFocus.isConnected) dernierFocus.focus();
  };
  const montrer = etape => {
    corps.hidden = etape !== 'panier';
    form.hidden = etape !== 'commande';
    merci.hidden = etape !== 'merci';
    tiroir.querySelector('#panier-titre').textContent = etape === 'panier' ? t('Votre panier') : etape === 'commande' ? t('Votre commande') : t('Merci');
  };
  document.querySelectorAll('[data-ouvrir-panier]').forEach(b => b.addEventListener('click', () => ouvrir()));
  document.addEventListener('click', e => { if (e.target.closest('[data-fermer-panier]')) fermer(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (fiche.classList.contains('is-ouvert')) fermerFiche();
    else if (tiroir.classList.contains('is-ouvert')) fermer();
  });

  const resume = s => `
      <dl class="bq-totaux">
        <div><dt>${t('Sous-total')}</dt><dd translate="no">${euros(s.sousTotal)}</dd></div>
        <div><dt>${t('Livraison')}</dt><dd>${s.port ? `<span translate="no">${euros(s.port)}</span>` : t('Offerte')}</dd></div>
        <div class="bq-total"><dt>${t('Total TTC')}</dt><dd translate="no">${euros(s.total)}</dd></div>
      </dl>`;
  const lignesTriees = () => Object.keys(panier).sort((a, b) => ORDRE.indexOf(parId[a].chateau) - ORDRE.indexOf(parId[b].chateau) || parId[b].millesime - parId[a].millesime);

  const majPanier = () => {
    const s = totaux();
    document.querySelectorAll('[data-panier-compte]').forEach(c => { c.textContent = s.articles; c.hidden = !s.articles; });
    const ids = lignesTriees();
    if (!ids.length) {
      corps.innerHTML = `<div class="bq-panier-vide">
        <img class="bq-panier-vide-image" src="assets/img/verdignan-culots.jpg" alt="">
        <p>${t('Votre panier est vide.')}</p>
        <p>${t('Un carton de 6 suffit pour commencer, et vous pouvez mélanger les trois châteaux.')}</p>
        <button class="bq-lien" type="button" data-choisir>${t('Choisir un vin')}</button>
      </div>`;
      return;
    }
    const manque = s.offerte ? 0 : L.gratuite_des_bouteilles - s.bouteilles;
    const jauge = Math.min(1, s.offerte ? 1 : s.bouteilles / L.gratuite_des_bouteilles);
    corps.innerHTML = `
      <div class="bq-port${s.offerte ? ' is-offert' : ''}">
        <p>${s.offerte ? t('La livraison vous est offerte.') : tf('Encore {0} bouteilles pour la livraison offerte : tous les châteaux comptent ensemble.', manque)}</p>
        <span class="bq-jauge" aria-hidden="true"><span style="width:${(jauge * 100).toFixed(0)}%"></span></span>
      </div>
      <ul class="bq-lignes">${ids.map(id => {
        const p = parId[id], q = panier[id];
        return `<li class="bq-ligne" data-ligne="${id}" data-chateau="${p.chateau}">
          <span class="bq-ligne-image"><img src="assets/img/${p.img}" alt=""></span>
          <div>
            <p class="bq-ligne-nom"><span translate="no">${p.nom} ${p.millesime}</span></p>
            <p class="bq-ligne-format">${format(p)}</p>
            <div class="bq-qte bq-qte--petit">
              <button type="button" data-moins aria-label="${t('Un de moins')}">−</button>
              <output>${quantite(p, q)}</output>
              <button type="button" data-plus aria-label="${t('Un de plus')}">+</button>
            </div>
          </div>
          <div class="bq-ligne-droite">
            <p translate="no">${euros(q * p.prix)}</p>
            <button class="bq-retirer" type="button" data-retirer>${t('Retirer')}</button>
          </div>
        </li>`;
      }).join('')}</ul>
      ${resume(s)}
      <button class="bq-bouton bq-commander" type="button" data-commander>${t('Commander')}</button>
      <p class="bq-panier-note">${t('Livraison en France métropolitaine, sous 10 à 12 jours ouvrés.')}</p>`;
  };
  corps.addEventListener('click', e => {
    if (e.target.closest('[data-choisir]')) {
      fermer();
      if (cave) setTimeout(() => cave.scrollIntoView({ behavior: lent ? 'smooth' : 'auto' }), 120);
      return;
    }
    if (e.target.closest('[data-commander]')) { montrer('commande'); preparerCommande(); return; }
    const li = e.target.closest('.bq-ligne');
    if (!li) return;
    const p = parId[li.dataset.ligne];
    if (e.target.closest('[data-plus]')) panier[p.id] += p.pas;
    if (e.target.closest('[data-moins]')) panier[p.id] -= p.pas;
    if (e.target.closest('[data-retirer]') || panier[p.id] <= 0) delete panier[p.id];
    garder();
    majPanier();
    majDansPanier();
  });

  /* ---------- La commande (maquette), reliée à l'espace client ---------- */
  const champ = n => form.elements[n];
  const preparerCommande = () => {
    const s = totaux();
    form.querySelector('[data-recap]').innerHTML = `<p class="bq-recap-titre">${s.articles === 1 ? t('1 article') : tf('{0} articles', s.articles)}</p>${resume(s)}`;
    // les coordonnées du client connecté (compte.html), sans écraser ce qu'on a déjà tapé
    const client = lireJSON('miailhe-client', null);
    const note = form.querySelector('[data-client]');
    if (client && client.email) {
      const a = client.adresse || {};
      const valeurs = { prenom: client.prenom, nom: client.nom, email: client.email, tel: client.tel, adresse: a.rue, cp: a.cp, ville: a.ville };
      Object.entries(valeurs).forEach(([k, v]) => { if (v && champ(k) && !champ(k).value) champ(k).value = v; });
      note.textContent = t('Vos coordonnées sont reprises de votre espace client.');
      note.hidden = false;
    } else note.hidden = true;
    const vide = [...form.querySelectorAll('.bq-champs input')].find(x => !x.value);
    (vide || form.querySelector('input')).focus();
  };
  form.querySelector('[data-retour-panier]').addEventListener('click', () => montrer('panier'));
  form.addEventListener('input', () => { form.querySelector('[data-erreur]').hidden = true; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const erreur = form.querySelector('[data-erreur]');
    const invalide = [...form.elements].find(x => x.willValidate && !x.checkValidity());
    if (invalide) {
      erreur.hidden = false;
      erreur.textContent = invalide.type === 'checkbox' ? t('Cochez les deux cases pour valider la commande.')
        : invalide.name === 'cp' ? t('Le code postal compte cinq chiffres.')
        : invalide.name === 'email' && invalide.value ? t("L'adresse e-mail semble incomplète.") : t('Il manque une information de livraison.');
      invalide.focus();
      return;
    }
    erreur.hidden = true;
    const s = totaux();
    const v = n => champ(n).value.trim();
    const maintenant = new Date();
    const numero = `M${maintenant.toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const commande = {
      numero, date: maintenant.toISOString(), email: v('email').toLowerCase(),
      lignes: lignesTriees().map(id => { const p = parId[id]; return { id, nom: p.nom, millesime: p.millesime, forme: p.forme, q: panier[id], prix: p.prix }; }),
      sousTotal: s.sousTotal, port: s.port, total: s.total,
      livraison: { prenom: v('prenom'), nom: v('nom'), adresse: v('adresse'), cp: v('cp'), ville: v('ville') },
    };
    const commandes = lireJSON('miailhe-commandes', []);
    store.set('miailhe-commandes', JSON.stringify([commande, ...(Array.isArray(commandes) ? commandes : [])]));
    // la commande passée, le panier se vide (comme une vraie boutique)
    panier = {};
    garder();
    majPanier();
    majDansPanier();
    form.reset();
    const client = lireJSON('miailhe-client', null);
    const connecte = client && client.email && client.email.toLowerCase() === commande.email;
    merci.innerHTML = `
      <p class="bq-sur">${t('Commande de démonstration')}</p>
      <h3>${tf('Merci, {0}.', `<span translate="no">${echapper(commande.livraison.prenom)}</span>`)}</h3>
      <p>${tf('Votre commande de {0} serait préparée au château et livrée sous 10 à 12 jours ouvrés.', `<span translate="no">${euros(s.total)}</span>`)}</p>
      <p class="bq-merci-numero">${t('Numéro de commande')}<b translate="no">${numero}</b></p>
      ${connecte
        ? `<div class="bq-merci-espace"><p>${t('Votre commande est rangée dans votre espace client.')}</p><a class="bq-lien" href="compte.html">${t('Voir mon espace client')}</a></div>`
        : `<div class="bq-merci-espace"><p>${t('Retrouvez vos commandes, vos adresses et votre enquête au même endroit.')}</p><a class="bq-lien" href="compte.html">${t('Créer mon espace client')}</a></div>`}
      <p class="bq-maquette">${t("Maquette : aucune commande n'est passée, rien n'est envoyé ni débité.")}</p>
      <button class="bq-bouton" type="button" data-fermer-panier>${t('Revenir à la boutique')}</button>`;
    montrer('merci');
    merci.focus();
  });

  /* ---------- La hauteur de l'en-tête et de la racine du logo qui pend dessous (la barre des filtres se cale dessous) ---------- */
  const entete = document.querySelector('.site-header');
  const mesurer = () => {
    if (!entete) return;
    const h = entete.getBoundingClientRect(), w = entete.querySelector('.wordmark');
    const bas = w ? w.getBoundingClientRect().bottom : h.bottom;
    document.body.style.setProperty('--entete', `${Math.round(h.height)}px`);
    document.body.style.setProperty('--racine', `${Math.max(0, Math.round(bas - h.bottom + 6))}px`);
  };
  mesurer();
  window.addEventListener('resize', mesurer);
  if (document.fonts) document.fonts.ready.then(mesurer);
  M.quandEntre && M.quandEntre(() => setTimeout(mesurer, 900));

  /* ---------- Arrivée : #coufran, ?vin=n2-de-coufran, #panier ---------- */
  const params = new URLSearchParams(location.search);
  const ancre = location.hash.slice(1);
  if (CHATEAUX[ancre]) etat.chateau = ancre;
  const vin = params.get('vin');
  const cible = vin && produits.find(p => p.slug === vin);
  if (cible) etat.chateau = cible.chateau;
  afficher();
  majPanier();
  const viser = () => {
    const el = cible ? racine.querySelector(`.bq-vin[data-vin="${vin}"]`) : (CHATEAUX[ancre] && document.getElementById(ancre));
    if (!el) return;
    const haut = barre ? parseFloat(getComputedStyle(barre).top) + barre.offsetHeight : 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - haut - 16, behavior: lent ? 'smooth' : 'auto' });
    if (cible) racine.querySelectorAll(`.bq-vin[data-vin="${vin}"]`).forEach(a => a.classList.add('is-vise'));
  };
  const quand = fn => (M.quandEntre ? M.quandEntre(fn) : fn());
  if (cible || CHATEAUX[ancre]) quand(() => setTimeout(viser, 350));
  if (ancre === 'panier') quand(() => setTimeout(() => ouvrir(), 450));
  window.addEventListener('hashchange', () => { if (location.hash === '#panier') ouvrir(); });
})();
