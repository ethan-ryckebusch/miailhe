/* La boutique de la famille (boutique.html). Deux espaces et un bouton pour passer de l'un à l'autre (28/10/2026,
   demande de l'utilisateur : « lier la partie personnel (B2C) et professionnel (B2B) », ce qui supprime l'onglet
   « Professionnels » des sites des châteaux) :
   - les particuliers : la scène d'ouverture sur les films des trois châteaux ; les doyennes ; la cave, un chapitre par
     château, chaque vin sur sa scène avec la frise de ses millésimes ; le vin de votre année ; le panier commun et la
     commande (maquette, reliée à l'espace client) ;
   - les professionnels (?espace=pro) : l'offre des trois châteaux, les millésimes prêts à boire, les palettes, les
     étapes, le kit importateur et la demande de devis (maquette), d'après assets/js/boutique-pro.js.
   Les produits et les prix viennent de assets/js/boutique-catalogue.js (les anciennes boutiques des châteaux).
   Le même jour, l'utilisateur a demandé le drive (on retire sa commande au château, déposée dans son coffre) et le coffret
   des trois générations (une bouteille de chaque château, posées une à une dans le coffret, puis un nom gravé dessus).
   Rangé dans localStorage : le panier (miailhe-panier, lu aussi par espace.js et compte.js), les coffrets du panier
   (miailhe-coffrets), les commandes (miailhe-commandes), la demande de devis en cours (miailhe-demande) et les demandes
   envoyées (miailhe-devis). */
(function () {
  const M = (window.MIAILHE = window.MIAILHE || {});
  const B = window.MIAILHE_BOUTIQUE;
  const PRO = window.MIAILHE_PRO;
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
    verdignan: { nom: 'Château Verdignan', n2: 'N°2 de Verdignan', qui: 'Chez Jean, le père · 1976', trait: "L'élégance classique",
      img: 'bouteille-verdignan.webp', img2: 'bouteille-verdignan-n2.webp', film: 'verdignan-intro', affiche: 'verdignan-hero.jpg', garde: true,
      ligne: ["Gardez l'{0} du père.", 'élégance'],
      histoire: "En 1976, Jean, dernier courtier de la famille, achète Verdignan, le château voisin qui regarde l'estuaire. Un vin classique et droit, fait pour la garde : nous le gardons pour vous jusqu'à ce qu'il soit prêt." },
    soudars: { nom: 'Château Soudars', n2: 'N°2 de Soudars', qui: 'Chez Éric, le fils · 1980', trait: 'Le plaisir partagé',
      img: 'bouteille-soudars.webp', img2: 'bouteille-soudars.webp', film: 'soudars-intro', affiche: 'soudars-intro-poster.jpg', garde: false,
      ligne: ['Partagez le {0} du fils.', 'plaisir'],
      histoire: "En 1980, Éric bâtit Soudars sur des friches encombrées de pierres et replante presque tout le vignoble. Un vin gourmand, qui se partage dès sa jeunesse ; ses doubles magnums attendent les grandes tablées." },
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

  // ce que la fiche professionnelle dit de chaque vin (cépages, garde), quand elle le connaît
  const infoVin = (k, slug) => ((PRO && PRO.chateaux[k] && PRO.chateaux[k].vins) || []).find(v => v.slug === slug) || {};

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
  // dans le petit compteur, le double magnum (déjà nommé) n'est qu'un nombre
  const compteur = (p, q) => (p.pas === CARTON ? quantite(p, q) : String(q));
  const ligne = c => tf(c.ligne[0], `<em>${t(c.ligne[1])}</em>`);
  const voirFiche = p => tf('Voir la fiche : {0} {1}', p.nom, p.millesime);
  const noteDe = p => (p.note ? t(p.note) : dm(p) ? t('Un double magnum de trois litres, pour les grandes tablées : la bouteille de la famille qui se partage.') : t(CHATEAUX[p.chateau].histoire));

  /* ---------- Le panier ---------- */
  let panier = lireJSON('miailhe-panier', {}) || {};
  Object.keys(panier).forEach(id => { if (!parId[id] || !(panier[id] > 0)) delete panier[id]; });
  const garder = () => store.set('miailhe-panier', JSON.stringify(panier));
  // les coffrets des trois générations : trois bouteilles (une par château) et le nom gravé ; le coffret est offert
  let coffrets = (lireJSON('miailhe-coffrets', []) || []).filter(c => c && Array.isArray(c.bouteilles) && c.bouteilles.length === 3 && c.bouteilles.every(id => parId[id]));
  const garderCoffrets = () => store.set('miailhe-coffrets', JSON.stringify(coffrets));
  const prixCoffret = c => c.bouteilles.reduce((s, id) => s + parId[id].prix, 0);
  // livrée chez soi, ou prête au drive du château (gratuit)
  let mode = 'livraison';
  const totaux = () => {
    let bouteilles = 0, magnums = 0, sousTotal = 0;
    for (const [id, q] of Object.entries(panier)) {
      const p = parId[id];
      if (dm(p)) magnums += q; else bouteilles += q;
      sousTotal += q * p.prix;
    }
    coffrets.forEach(c => { bouteilles += 3; sousTotal += prixCoffret(c); });
    const offerte = bouteilles >= L.gratuite_des_bouteilles || (L.gratuite_avec_double_magnum && magnums > 0);
    const port = (bouteilles || magnums) && !offerte && mode !== 'drive' ? L.forfait_6_bouteilles : 0;
    return { bouteilles, magnums, sousTotal, port, offerte, drive: mode === 'drive', total: sousTotal + port, articles: bouteilles + magnums };
  };

  /* ---------- Le choix d'une quantité, l'ajout ---------- */
  const ajout = p => (p.stock ? `<div class="bq-ajout">
          <div class="bq-qte" data-qte="${p.pas}">
            <button type="button" data-moins aria-label="${t('Un de moins')}">−</button>
            <output>${compteur(p, p.pas)}</output>
            <button type="button" data-plus aria-label="${t('Un de plus')}">+</button>
          </div>
          <button class="bq-ajouter" type="button" data-ajouter>${dm(p) ? t('Ajouter au panier') : t('Ajouter un carton')}</button>
        </div>
        <p class="bq-dans-panier" data-dans-panier${panier[p.id] ? '' : ' hidden'}>${panier[p.id] ? tf('Dans votre panier : {0}', quantite(p, panier[p.id])) : ''}</p>`
    : `<p class="bq-rupture">${t('Épuisé')}</p>`);

  /* ---------- Logos et armoiries écrits après le chargement (logos-chateaux.js et main.js ne voient que la page de départ) ---------- */
  const LG = window.MIAILHE_LOGOS_CHATEAUX, A = window.MIAILHE_ARMOIRIES;
  const habiller = el => {
    el.querySelectorAll('[data-logo-chateau]').forEach(s => {
      const v = LG && LG[s.dataset.logoChateau] && LG[s.dataset.logoChateau].logo;
      if (!v || s.querySelector('svg')) return;
      s.style.setProperty('--retrait', v.retrait || 0);
      s.style.setProperty('--encre', v.encre || 1);
      s.insertAdjacentHTML('beforeend', `<svg viewBox="${v.viewBox}" aria-hidden="true" focusable="false"><path fill="currentColor" d="${v.d}"/></svg>`);
    });
    el.querySelectorAll('.armoirie[data-armoirie]').forEach(s => {
      const a = A && A[s.dataset.armoirie];
      if (a && !s.querySelector('svg')) s.insertAdjacentHTML('beforeend', `<svg viewBox="${A.viewBox}" aria-hidden="true" focusable="false"><path class="armoirie-fond" d="${A.bouclier}"/><path fill="currentColor" fill-rule="evenodd" d="${s.dataset.forme === 'petit' ? a.petit : a.complet}"/></svg>`);
    });
  };

  /* ---------- Les apparitions et les films : on joue ce qu'on voit ---------- */
  const apparition = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    apparition.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px', threshold: .06 }) : null;
  const observer = el => el.querySelectorAll('.bq-apparait').forEach((x, i) => {
    if (!lent || !apparition) { x.classList.add('is-in'); return; }
    x.style.transitionDelay = `${(i % 3) * 90}ms`;
    apparition.observe(x);
  });
  const charger = v => {
    if (v.querySelector('source')) return;
    v.innerHTML = `<source src="assets/video/${v.dataset.film}.webm" type="video/webm"><source src="assets/video/${v.dataset.film}.mp4" type="video/mp4">`;
    v.load();
  };
  const films = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => {
    const chap = e.target, v = chap.querySelector('video[data-film]');
    if (e.isIntersecting) {
      chap.classList.add('is-vu');
      if (!v || !lent) return;
      charger(v);
      v.play().catch(() => { /* lecture refusée : l'affiche reste */ });
    } else if (v && !v.paused) v.pause();
  }), { threshold: .2 }) : null;

  /* ---------- Les doyennes : la plus ancienne bouteille de chaque château ---------- */
  const doyennes = document.querySelector('[data-doyennes]');
  const doyenne = k => produits.filter(p => p.chateau === k && p.stock && p.vin !== 'n2').sort((a, b) => a.millesime - b.millesime)[0];
  const carteDoyenne = p => {
    const c = CHATEAUX[p.chateau];
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
        <p class="bq-doyenne-note">${noteDe(p)}</p>
        <div class="bq-doyenne-bas">
          <p class="bq-doyenne-prix">${prixHtml(dm(p) ? p.prix : p.prix * CARTON)}<small>${dm(p) ? t('le double magnum') : tf('le carton de 6, soit {0} la bouteille', `<span translate="no">${euros(p.prix)}</span>`)}</small></p>
          <button class="bq-ajouter" type="button" data-ajouter>${dm(p) ? t('Ajouter au panier') : t('Ajouter un carton')}</button>
        </div>
      </div>
    </article>`;
  };
  if (doyennes) { doyennes.innerHTML = ORDRE.map(doyenne).filter(Boolean).map(carteDoyenne).join(''); habiller(doyennes); observer(doyennes); }
  habiller(document.querySelector('.bq-famille') || document.createElement('i'));
  habiller(document.querySelector('.bq-barre') || document.createElement('i'));

  /* ---------- La cave : un chapitre par château ; chaque vin (un format) sur sa scène, avec la frise de ses millésimes ---------- */
  const CUVEES = [];
  ORDRE.forEach(k => [['grand-vin', 'bouteille'], ['grand-vin', 'double-magnum'], ['n2', 'bouteille']].forEach(([vin, forme]) => {
    const ps = produits.filter(p => p.chateau === k && p.vin === vin && p.forme === forme).sort((a, b) => b.millesime - a.millesime);
    if (ps.length) CUVEES.push({ cle: `${k}-${vin}-${forme}`, chateau: k, vin, forme, ps, choisi: (ps.find(p => p.stock) || ps[0]).id });
  }));
  const parCle = Object.fromEntries(CUVEES.map(cu => [cu.cle, cu]));
  const etiquette = cu => (cu.vin === 'n2' ? t('Le second vin') : cu.forme === 'double-magnum' ? t('Le grand vin, en double magnum') : t('Le grand vin'));

  const scene = p => `
        <span class="motif" aria-hidden="true"></span>
        <span class="bq-cuvee-an" aria-hidden="true" translate="no">${p.millesime}</span>
        <button class="bq-cuvee-bouteille" type="button" data-fiche aria-label="${echapper(voirFiche(p))}"><img src="assets/img/${p.img}" alt="" loading="lazy"></button>
        <span class="bq-cuvee-sceau"><b>${age(p)}</b>${CHATEAUX[p.chateau].garde ? `<small>${t('de cave au château')}</small>` : `<small>${t('de cave')}</small>`}</span>`;
  const detail = p => `
        <p class="bq-cuvee-annee"><span translate="no">${p.millesime}</span><small>${CHATEAUX[p.chateau].garde ? t('Vieilli au château, prêt à boire') : dm(p) ? t('Pour les grandes tablées') : t('À partager dès sa jeunesse')}</small></p>
        <blockquote class="bq-cuvee-note">${noteDe(p)}</blockquote>
        <div class="bq-cuvee-achat">
          <div class="bq-cuvee-prix"><p>${prixHtml(p.prix)} <small>${unite(p)}</small></p>${carton(p)}</div>
          ${ajout(p)}
        </div>
        <button class="bq-lien" type="button" data-fiche>${t('Voir la fiche du vin')}</button>`;
  const cuvee = cu => {
    const p = parId[cu.choisi], info = infoVin(cu.chateau, p.slug);
    const ms = cu.ps.map(x => x.millesime);
    const de = ms.length > 1 ? tf('{0} millésimes, de {1} à {2}', ms.length, Math.min(...ms), Math.max(...ms)) : t('Un seul millésime en cave');
    return `<article class="bq-cuvee bq-apparait${cu.vin === 'n2' ? ' bq-cuvee--second' : ''}${cu.forme === 'double-magnum' ? ' bq-cuvee--dm' : ''}" data-cuvee="${cu.cle}" data-chateau="${cu.chateau}" data-id="${p.id}" data-vin="${p.slug}">
      <div class="bq-cuvee-scene" data-scene>${scene(p)}</div>
      <div class="bq-cuvee-texte">
        <p class="bq-cuvee-sur">${etiquette(cu)} <span translate="no">· Haut-Médoc</span></p>
        <h3 class="bq-cuvee-nom" translate="no">${p.nom}</h3>
        <dl class="bq-cuvee-infos">
          ${info.cepages ? `<div><dt>${t('Cépages')}</dt><dd>${t(info.cepages)}</dd></div>` : ''}
          ${info.garde ? `<div><dt>${t('Garde')}</dt><dd>${t(info.garde)}</dd></div>` : ''}
          <div><dt>${t('Format')}</dt><dd>${format(p)}</dd></div>
        </dl>
        <div class="bq-frise">
          <p class="bq-frise-titre"><span>${t('Le millésime')}</span><small>${de}</small></p>
          <div class="bq-frise-rail" role="radiogroup" aria-label="${t('Le millésime')}">${cu.ps.map(x => `<button type="button" role="radio" aria-checked="${x.id === p.id}" data-choisir="${x.id}"${x.stock ? '' : ' data-epuise'}><b translate="no">${x.millesime}</b><small>${age(x)}</small></button>`).join('')}</div>
        </div>
        <div class="bq-cuvee-detail" data-detail>${detail(p)}</div>
      </div>
    </article>`;
  };
  const chapitre = k => {
    const c = CHATEAUX[k], ps = produits.filter(p => p.chateau === k), ms = ps.map(p => p.millesime);
    const n = ps.length === 1 ? t('1 vin') : tf('{0} vins', ps.length);
    return `<section class="bq-chateau" id="${k}" data-chateau="${k}" aria-labelledby="titre-${k}">
      <header class="bq-chapitre">
        <video class="bq-chapitre-film" muted loop playsinline preload="none" poster="assets/img/${c.affiche}" aria-hidden="true" data-film="${c.film}"></video>
        <div class="bq-chapitre-texte">
          <span class="armoirie" data-armoirie="${k}"></span>
          <p class="bq-chapitre-qui">${t(c.qui)}</p>
          <h2 id="titre-${k}" class="bq-chapitre-nom"><span class="logo-chateau" data-logo-chateau="${k}" data-forme="logo"></span><span class="sr-only">${c.nom}</span></h2>
          <p class="bq-chapitre-ligne">${ligne(c)}</p>
          <p class="bq-chapitre-histoire">${t(c.histoire)}</p>
          <a class="bq-lien bq-lien--clair" href="${k}/index.html">${t('Découvrir le château')}</a>
        </div>
        <p class="bq-chapitre-compte"><span translate="no">${n} · ${tf('de {0} à {1}', Math.min(...ms), Math.max(...ms))}</span></p>
      </header>
      ${CUVEES.filter(cu => cu.chateau === k).map(cuvee).join('')}
    </section>`;
  };
  racine.innerHTML = ORDRE.map(chapitre).join('');
  habiller(racine);
  observer(racine);
  if (films) racine.querySelectorAll('.bq-chapitre').forEach(c => films.observe(c));

  // Choisir un millésime sur la frise : la bouteille, l'année, la note et le prix changent, en fondu
  const choisir = (art, id) => {
    const p = parId[id];
    if (!p || art.dataset.id === id) return;
    parCle[art.dataset.cuvee].choisi = id;
    art.dataset.id = id;
    art.querySelectorAll('[data-choisir]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.choisir === id)));
    const maj = () => { art.querySelector('[data-scene]').innerHTML = scene(p); art.querySelector('[data-detail]').innerHTML = detail(p); };
    if (!lent) { maj(); return; }
    art.classList.add('is-change');
    setTimeout(() => { maj(); requestAnimationFrame(() => requestAnimationFrame(() => art.classList.remove('is-change'))); }, 230);
  };
  // la frise suit le millésime choisi (elle défile seule quand elle est plus large que la place)
  const centrer = (art, lisse) => {
    const rail = art.querySelector('.bq-frise-rail'), b = rail && rail.querySelector('[aria-checked="true"]');
    if (b && rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: b.offsetLeft - rail.clientWidth / 2 + b.offsetWidth / 2, behavior: lisse && lent ? 'smooth' : 'auto' });
  };
  racine.querySelectorAll('.bq-cuvee').forEach(a => centrer(a, false));
  racine.addEventListener('click', e => {
    const b = e.target.closest('[data-choisir]');
    if (!b) return;
    const art = b.closest('.bq-cuvee');
    choisir(art, b.dataset.choisir);
    centrer(art, true);
  });
  // au clavier, les flèches passent d'un millésime à l'autre (un groupe de boutons radio)
  racine.addEventListener('keydown', e => {
    const b = e.target.closest('[data-choisir]');
    if (!b || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const suivant = e.key === 'ArrowRight' ? b.nextElementSibling : b.previousElementSibling;
    if (!suivant) return;
    e.preventDefault();
    suivant.focus();
    suivant.click();
  });

  /* ---------- Le vin de votre année ---------- */
  const annees = document.querySelector('[data-annees]');
  const resultat = document.querySelector('[data-annee-resultat]');
  const parAnnee = {};
  produits.filter(p => p.stock).forEach(p => { (parAnnee[p.millesime] = parAnnee[p.millesime] || []).push(p); });
  const lesAnnees = Object.keys(parAnnee).map(Number).sort((a, b) => a - b);
  if (annees) {
    const decennies = {};
    lesAnnees.forEach(a => { (decennies[Math.floor(a / 10) * 10] = decennies[Math.floor(a / 10) * 10] || []).push(a); });
    annees.innerHTML = Object.entries(decennies).map(([d, as]) => `<div class="bq-decennie">
        <p>${tf('Les années {0}', d)}</p>
        <div>${as.map(a => `<button type="button" data-annee="${a}" aria-pressed="false"><b>${a}</b><small>${parAnnee[a].length === 1 ? t('1 vin') : tf('{0} vins', parAnnee[a].length)}</small></button>`).join('')}</div>
      </div>`).join('');
  }
  const montrerAnnee = a => {
    annees.querySelectorAll('[data-annee]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.annee === a)));
    const ps = (parAnnee[a] || []).slice().sort((x, y) => ORDRE.indexOf(x.chateau) - ORDRE.indexOf(y.chateau) || x.prix - y.prix);
    resultat.innerHTML = `<p class="bq-annee-phrase">${ps.length === 1 ? tf('Un vin de {0} vous attend.', `<b translate="no">${a}</b>`) : tf('{0} vins de {1} vous attendent.', ps.length, `<b translate="no">${a}</b>`)}</p>
      <div class="bq-annee-vins">${ps.map(p => `<article class="bq-annee-vin bq-apparait" data-id="${p.id}" data-chateau="${p.chateau}">
        <button class="bq-annee-image" type="button" data-fiche aria-label="${echapper(voirFiche(p))}"><span class="motif" aria-hidden="true"></span><img src="assets/img/${p.img}" alt="" loading="lazy"></button>
        <div class="bq-annee-texte">
          <p class="bq-annee-qui">${t(CHATEAUX[p.chateau].qui)}</p>
          <h3 translate="no">${p.nom} ${p.millesime}</h3>
          <p class="bq-annee-format">${format(p)} · ${age(p)}</p>
          <p class="bq-annee-prix">${prixHtml(dm(p) ? p.prix : p.prix * CARTON)} <small>${dm(p) ? t('le double magnum') : t('le carton de 6')}</small></p>
          <div class="bq-annee-actions">
            <button class="bq-ajouter" type="button" data-ajouter>${dm(p) ? t('Ajouter au panier') : t('Ajouter un carton')}</button>
            <button class="bq-lien" type="button" data-voir-cave="${p.id}">${t('Voir dans la cave')}</button>
          </div>
          <p class="bq-dans-panier" data-dans-panier${panier[p.id] ? '' : ' hidden'}>${panier[p.id] ? tf('Dans votre panier : {0}', quantite(p, panier[p.id])) : ''}</p>
        </div>
      </article>`).join('')}</div>`;
    observer(resultat);
  };
  if (annees) annees.addEventListener('click', e => { const b = e.target.closest('[data-annee]'); if (b) montrerAnnee(+b.dataset.annee); });
  // à l'arrivée, une année est déjà ouverte : 2005, le plus grand millésime de Coufran et de Soudars selon les châteaux
  if (annees && lesAnnees.length) montrerAnnee(parAnnee[2005] ? 2005 : lesAnnees[Math.floor(lesAnnees.length / 2)]);
  // « Voir dans la cave » : la scène du vin, sur ce millésime
  const allerAuVin = (id, lisse = true) => {
    const p = parId[id], cu = p && CUVEES.find(x => x.ps.includes(p));
    if (!cu) return;
    const art = racine.querySelector(`.bq-cuvee[data-cuvee="${cu.cle}"]`);
    choisir(art, id);
    centrer(art, false);
    art.classList.add('is-in', 'is-vise');
    setTimeout(() => art.classList.remove('is-vise'), 2400);
    viser(art, lisse);
  };
  document.addEventListener('click', e => { const b = e.target.closest('[data-voir-cave]'); if (b) allerAuVin(b.dataset.voirCave); });

  /* ---------- Le coffret des trois générations ---------- */
  // Un vrai coffret, vu de trois quarts (28/10/2026, demande de l'utilisateur : « vraiment incroyable et beau ») : la face
  // aux trois fenêtres en arche (une par château, cadre au motif du château, armoiries officielles), le côté avec la lignée,
  // le dessus. On choisit une bouteille de chaque château : chacune vole jusqu'à sa fenêtre, une à une. Les trois posées,
  // on valide : le coffret se tourne vers nous, on écrit la dédicace (« Pour mon père », « Pour ma grand-mère »…) et la
  // signature, dorées à chaud sur la face ; un sceau de cire le ferme et il part au panier. Le coffret est offert
  // (proposition à valider par la famille).
  const atelier = document.querySelector('[data-coffret]');
  const GENERATIONS = { coufran: ['Le grand-père', 'Louis · 1924'], verdignan: ['Le père', 'Jean · 1976'], soudars: ['Le fils', 'Éric · 1980'] };
  const LIGNEE = [['1924', 'Louis', 'coufran'], ['1976', 'Jean', 'verdignan'], ['1980', 'Éric', 'soudars'], ['2006', 'Lovely', null]];
  const coffret = { coufran: null, verdignan: null, soudars: null };
  const pourCoffret = k => produits.filter(p => p.chateau === k && p.vin === 'grand-vin' && p.forme === 'bouteille' && p.stock).sort((a, b) => b.millesime - a.millesime);
  const SILHOUETTE = '<svg viewBox="0 0 40 140" aria-hidden="true"><path d="M16.5 3h7v30c0 4.5 9.5 8.5 9.5 21v79a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V54c0-12.5 9.5-16.5 9.5-21z"/></svg>';
  const IDEES = ['Pour mon père', 'Pour mon grand-père', 'Pour ma grand-mère', 'Pour ma mère', 'Pour mon fils', 'Pour ma fille', 'Pour mon parrain', 'Pour Papa', 'Pour Papi', 'Pour Mamie'];
  // le logo MIAILHE doré à chaud : un dégradé d'or posé sur le tracé du logo
  let nOr = 0;
  const logoOr = cl => {
    const lg = window.MIAILHE_LOGO, id = `bq-or-${++nOr}`;
    return lg ? `<svg class="${cl}" viewBox="${lg.logo.viewBox}" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#8a6320"/><stop offset=".36" stop-color="#e8cd86"/><stop offset=".52" stop-color="#a97d2e"/><stop offset=".74" stop-color="#f0dba0"/><stop offset="1" stop-color="#8a6320"/></linearGradient></defs><g transform="${lg.logo.transform}" fill="url(#${id})"><path d="${lg.logo.d}"/></g></svg>` : '';
  };
  // le sceau de cire : un disque au bord irrégulier, et la feuille du logo en creux
  const sceau = () => {
    const pts = [];
    for (let i = 0; i < 72; i++) { const a = i / 72 * Math.PI * 2, r = 50 + 2.6 * Math.sin(a * 9 + 1) + 1.6 * Math.sin(a * 23); pts.push(`${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`); }
    const F = window.MIAILHE_FEUILLE;
    return `<svg viewBox="-60 -60 120 120" aria-hidden="true"><defs><radialGradient id="bq-cire" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#c2364f"/><stop offset=".55" stop-color="#8f1230"/><stop offset="1" stop-color="#5c0a1f"/></radialGradient></defs>
      <path d="M${pts.join('L')}Z" fill="url(#bq-cire)"/><circle r="35" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="2.4"/><circle r="35" fill="none" stroke="rgba(255,190,200,.25)" stroke-width="1" transform="translate(-.8 -.8)"/>
      ${F ? `<g transform="translate(0 -26) scale(.5)"><path d="${F.d}" fill-rule="evenodd" fill="rgba(60,4,18,.55)" transform="translate(1.2 1.6)"/><path d="${F.d}" fill-rule="evenodd" fill="#b8324c"/></g>` : ''}</svg>`;
  };
  if (atelier) {
    atelier.innerHTML = `
      <div class="bq-coffret-scene" data-scene>
        <div class="bq-studio">
          <div class="bq-boite3d" data-boite>
            <div class="bq-face bq-face--dessus" aria-hidden="true"><span class="bq-dessus-filet"></span>${logoOr('bq-dessus-logo')}</div>
            <div class="bq-face bq-face--cote" aria-hidden="true">
              <p class="bq-cote-titre">${t('La lignée')}</p>
              <ol class="bq-cote-frise">${LIGNEE.map(([a, qui, k]) => `<li${k ? ` data-chateau="${k}"` : ''}><b translate="no">${a}</b><span>${qui}${k ? ` · <span translate="no">${CHATEAUX[k].nom.replace('Château ', '')}</span>` : ''}</span></li>`).join('')}</ol>
              ${logoOr('bq-cote-logo')}
            </div>
            <div class="bq-face bq-face--avant">
              ${logoOr('bq-coffret-logo')}
              <p class="bq-coffret-titre">${t('Trois générations')}</p>
              <div class="bq-dedicace" aria-live="polite"><p class="bq-dedicace-pour" data-gravure></p><p class="bq-dedicace-de" data-signature></p></div>
              <div class="bq-coffret-fenetres">${ORDRE.map(k => `
                <div class="bq-fenetre is-vide" data-chateau="${k}" data-fenetre="${k}">
                  <div class="bq-fenetre-arche"><span class="motif" aria-hidden="true"></span><div class="bq-fenetre-creux"><span class="bq-fenetre-vide">${SILHOUETTE}</span><img data-dans alt=""></div></div>
                  <span class="armoirie" data-armoirie="${k}"></span>
                  <p class="bq-fenetre-nom">${CHATEAUX[k].nom.replace('Château ', '')}</p>
                  <p class="bq-fenetre-qui"><span>${t(GENERATIONS[k][1])}</span><b data-fenetre-an></b></p>
                </div>`).join('')}</div>
              <p class="bq-coffret-pied">${t('Le grand-père · le père · le fils')}</p>
              <span class="bq-reflet" aria-hidden="true"></span>
              <span class="bq-sceau" aria-hidden="true">${sceau()}</span>
            </div>
          </div>
          <span class="bq-sol" aria-hidden="true"></span>
        </div>
      </div>
      <div class="bq-coffret-panneau">
        <ol class="bq-coffret-etapes">${ORDRE.map(k => `
          <li data-chateau="${k}" data-etape="${k}">
            <p class="bq-coffret-qui"><span class="armoirie" data-armoirie="${k}"></span><span class="bq-coffret-qui-texte"><small>${t(GENERATIONS[k][0])}</small><b translate="no">${CHATEAUX[k].nom}</b></span><i class="bq-coffret-ok" aria-hidden="true"></i></p>
            <div class="bq-coffret-millesimes" role="radiogroup" aria-label="${echapper(CHATEAUX[k].nom)}">${pourCoffret(k).map(p => `<button type="button" role="radio" aria-checked="false" data-coffret-vin="${p.id}"><b translate="no">${p.millesime}</b><small translate="no">${euros(p.prix)}</small></button>`).join('')}</div>
          </li>`).join('')}</ol>
        <div class="bq-coffret-bas">
          <div class="bq-coffret-total"><p>${t('Les trois bouteilles')}</p><p class="bq-coffret-prix" data-coffret-prix translate="no">—</p><small>${t('Le coffret est offert.')}</small></div>
          <div class="bq-coffret-actions" data-coffret-actions>
            <button class="bq-bouton" type="button" data-coffret-valider disabled>${t('Valider le coffret')}</button>
            <button class="bq-lien" type="button" data-coffret-hasard>${t('Laisser la famille choisir')}</button>
          </div>
          <div class="bq-coffret-graver" data-coffret-graver hidden>
            <label class="bq-coffret-label" for="coffret-nom">${t('La dédicace, dorée sur le coffret')}</label>
            <input id="coffret-nom" type="text" maxlength="26" autocomplete="off" placeholder="${echapper(t('Pour mon père'))}" data-coffret-saisie>
            <div class="bq-coffret-idees">${IDEES.map(x => `<button type="button" data-coffret-idee="${echapper(t(x))}">${t(x)}</button>`).join('')}</div>
            <label class="bq-coffret-label" for="coffret-de">${t('De la part de')} <small>${t('facultatif')}</small></label>
            <input id="coffret-de" class="bq-coffret-de" type="text" maxlength="24" autocomplete="given-name" placeholder="${echapper(t('Votre prénom'))}" data-coffret-signature>
            <div class="bq-coffret-actions">
              <button class="bq-bouton" type="button" data-coffret-ajouter>${t('Sceller et ajouter au panier')}</button>
              <button class="bq-lien" type="button" data-coffret-retour>${t('Changer une bouteille')}</button>
            </div>
          </div>
          <div class="bq-coffret-fait" data-coffret-fait hidden tabindex="-1"></div>
        </div>
      </div>`;
    habiller(atelier);

    const boite = atelier.querySelector('[data-boite]'), scene = atelier.querySelector('[data-scene]');
    const gravure = atelier.querySelector('[data-gravure]'), signature = atelier.querySelector('[data-signature]');
    const saisie = atelier.querySelector('[data-coffret-saisie]'), saisieDe = atelier.querySelector('[data-coffret-signature]');
    // le coffret suit un peu la souris, comme posé sur une table qu'on contourne
    if (lent && matchMedia('(hover: hover)').matches) {
      scene.addEventListener('pointermove', e => {
        const r = scene.getBoundingClientRect();
        boite.style.setProperty('--px', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
        boite.style.setProperty('--py', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
      });
      scene.addEventListener('pointerleave', () => { boite.style.setProperty('--px', 0); boite.style.setProperty('--py', 0); });
    }
    const majCoffret = () => {
      const n = ORDRE.filter(k => coffret[k]).length;
      atelier.querySelector('[data-coffret-prix]').textContent = n ? euros(ORDRE.reduce((s, k) => s + (coffret[k] ? parId[coffret[k]].prix : 0), 0)) : '—';
      atelier.querySelector('[data-coffret-valider]').disabled = n < 3;
      atelier.querySelectorAll('[data-etape]').forEach(li => li.classList.toggle('is-choisi', !!coffret[li.dataset.etape]));
      atelier.querySelectorAll('[data-coffret-vin]').forEach(b => b.setAttribute('aria-checked', String(Object.values(coffret).includes(b.dataset.coffretVin))));
      atelier.classList.toggle('is-complet', n === 3);
    };
    // la bouteille quitte le millésime choisi, monte, puis descend dans sa fenêtre
    const poser = (id, depuis) => new Promise(fin => {
      const p = parId[id], k = p.chateau, fen = atelier.querySelector(`[data-fenetre="${k}"]`), img = fen.querySelector('[data-dans]');
      coffret[k] = id;
      majCoffret();
      const arrivee = () => {
        img.style.visibility = '';
        fen.querySelector('[data-fenetre-an]').textContent = String(p.millesime);
        fen.classList.remove('is-vide');
        fen.classList.add('is-pose');
        boite.classList.remove('is-recoit'); void boite.offsetWidth; boite.classList.add('is-recoit');
        setTimeout(() => fen.classList.remove('is-pose'), 900);
        dire(tf('{0} {1} est dans le coffret.', p.nom, p.millesime));
        fin();
      };
      img.style.visibility = 'hidden';
      img.onload = () => {
        img.onload = null;
        const b = img.getBoundingClientRect(), a = depuis && depuis.getBoundingClientRect();
        if (!lent || !a || !b.width || b.bottom < 0 || b.top > innerHeight) { arrivee(); return; }
        const vol = document.createElement('img');
        vol.src = img.src;
        vol.className = 'bq-vol';
        vol.style.cssText = `left:${b.left}px;top:${b.top}px;width:${b.width}px;height:${b.height}px`;
        document.body.appendChild(vol);
        const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
        const s0 = Math.min(.6, Math.max(.2, a.height * 1.6 / b.height));
        const haut = Math.min(-90, Math.min(dy, 0) * .5 - 110);
        vol.animate([
          { transform: `translate(${dx}px, ${dy}px) scale(${s0}) rotate(-12deg)`, opacity: 0 },
          { transform: `translate(${dx * .92}px, ${dy * .92 - 24}px) scale(${s0 * 1.25}) rotate(-10deg)`, opacity: 1, offset: .12 },
          { transform: `translate(${dx * .42}px, ${haut}px) scale(.82) rotate(7deg)`, offset: .52 },
          { transform: 'translate(0, -70px) scale(1) rotate(-2deg)', offset: .78 },
          { transform: 'translate(0, 5px) scale(1) rotate(0)', offset: .93 },
          { transform: 'none' },
        ], { duration: 1250, easing: 'cubic-bezier(.33, .1, .25, 1)' }).onfinish = () => { vol.remove(); arrivee(); };
      };
      img.src = `assets/img/${p.img}`;
      if (img.complete && img.naturalWidth && img.onload) img.onload();
    });
    const graver = () => {
      gravure.textContent = saisie.value;
      const de = saisieDe.value.trim();
      signature.textContent = de ? tf('de la part de {0}', de) : '';
      boite.classList.toggle('a-un-nom', !!saisie.value.trim());
    };
    let occupe = false;
    atelier.addEventListener('click', async e => {
      const b = e.target.closest('[data-coffret-vin]');
      if (b) { if (atelier.classList.contains('is-grave')) return; await poser(b.dataset.coffretVin, b); return; }
      if (e.target.closest('[data-coffret-hasard]')) {
        if (occupe) return;
        occupe = true;
        // la famille choisit, pour chaque château encore vide, le millésime le plus proche de dix ans d'âge
        for (const k of ORDRE.filter(x => !coffret[x])) {
          const p = pourCoffret(k).sort((x, y) => Math.abs(x.age - 10) - Math.abs(y.age - 10))[0];
          if (!p) continue;
          await poser(p.id, atelier.querySelector(`[data-coffret-vin="${p.id}"]`));
          await new Promise(r => setTimeout(r, 160));
        }
        occupe = false;
        return;
      }
      if (e.target.closest('[data-coffret-valider]')) {
        atelier.classList.add('is-grave');
        boite.classList.add('is-grave');
        atelier.querySelector('[data-coffret-actions]').hidden = true;
        atelier.querySelector('[data-coffret-graver]').hidden = false;
        saisie.focus({ preventScroll: true });
        viser(atelier);
        return;
      }
      const idee = e.target.closest('[data-coffret-idee]');
      if (idee) { saisie.value = idee.dataset.coffretIdee; graver(); saisie.focus({ preventScroll: true }); return; }
      if (e.target.closest('[data-coffret-retour]')) {
        atelier.classList.remove('is-grave');
        boite.classList.remove('is-grave');
        atelier.querySelector('[data-coffret-actions]').hidden = false;
        atelier.querySelector('[data-coffret-graver]').hidden = true;
        return;
      }
      if (e.target.closest('[data-coffret-ajouter]')) {
        const nom = saisie.value.trim(), de = saisieDe.value.trim();
        coffrets.push({ id: `c${Date.now()}`, bouteilles: ORDRE.map(k => coffret[k]), nom, de });
        garderCoffrets();
        majPanier();
        // le sceau de cire tombe sur le coffret, la dorure accroche la lumière
        boite.classList.add('is-scelle');
        atelier.querySelector('[data-coffret-graver]').hidden = true;
        viser(atelier);
        setTimeout(() => {
          document.querySelectorAll('[data-panier-compte]').forEach(c => { if (lent) c.animate([{ transform: 'scale(1.6)' }, { transform: 'none' }], { duration: 450, easing: 'ease-out' }); });
          const fait = atelier.querySelector('[data-coffret-fait]');
          fait.innerHTML = `<p class="bq-coffret-merci">${nom ? tf('Le coffret {0} est scellé et dans votre panier.', `<span translate="no">« ${echapper(nom)} »</span>`) : t('Le coffret est scellé et dans votre panier.')}</p>
            <div class="bq-coffret-actions"><button class="bq-bouton" type="button" data-voir-panier>${t('Voir mon panier')}</button><button class="bq-lien" type="button" data-coffret-nouveau>${t('Composer un autre coffret')}</button></div>`;
          fait.hidden = false;
          fait.focus({ preventScroll: true });
          dire(t('Le coffret est scellé et dans votre panier.'));
        }, lent ? 1100 : 0);
        return;
      }
      if (e.target.closest('[data-coffret-nouveau]')) {
        ORDRE.forEach(k => {
          coffret[k] = null;
          const fen = atelier.querySelector(`[data-fenetre="${k}"]`);
          fen.classList.add('is-vide');
          fen.querySelector('[data-dans]').removeAttribute('src');
          fen.querySelector('[data-fenetre-an]').textContent = '';
        });
        saisie.value = '';
        saisieDe.value = '';
        graver();
        boite.classList.remove('is-grave', 'is-scelle', 'a-un-nom');
        atelier.classList.remove('is-grave');
        atelier.querySelector('[data-coffret-fait]').hidden = true;
        atelier.querySelector('[data-coffret-actions]').hidden = false;
        majCoffret();
      }
    });
    // la dédicace et la signature se dorent sur le coffret à mesure qu'on les écrit
    saisie.addEventListener('input', graver);
    saisieDe.addEventListener('input', graver);
    [saisie, saisieDe].forEach(x => x.addEventListener('keydown', e => { if (e.key === 'Enter') atelier.querySelector('[data-coffret-ajouter]').click(); }));
  }
  document.addEventListener('click', e => { if (e.target.closest('[data-voir-panier]')) ouvrir(); });

  /* ---------- Ajouter, retirer : sur une scène, une doyenne, une année ou la fiche ---------- */
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
    if (e.target.closest('[data-choisir], [data-voir-cave], [data-coffret]')) return;
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
    const c = CHATEAUX[p.chateau], info = infoVin(p.chateau, p.slug);
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
        ${info.cepages ? `<dl class="bq-fiche-infos"><div><dt>${t('Cépages')}</dt><dd>${t(info.cepages)}</dd></div>${info.garde ? `<div><dt>${t('Garde')}</dt><dd>${t(info.garde)}</dd></div>` : ''}</dl>` : ''}
        <div class="bq-fiche-note">
          <p>${p.note ? t("Ce qu'en dit le château") : t('Le château')}</p>
          <blockquote>${noteDe(p)}</blockquote>
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
    if (location.hash === '#panier') try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* file:// */ }
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
        <div><dt>${s.drive ? t('Drive au château') : t('Livraison')}</dt><dd>${s.port ? `<span translate="no">${euros(s.port)}</span>` : s.drive ? t('Gratuit') : t('Offerte')}</dd></div>
        <div class="bq-total"><dt>${t('Total TTC')}</dt><dd translate="no">${euros(s.total)}</dd></div>
      </dl>`;
  const lignesTriees = () => Object.keys(panier).sort((a, b) => ORDRE.indexOf(parId[a].chateau) - ORDRE.indexOf(parId[b].chateau) || parId[b].millesime - parId[a].millesime);

  const majPanier = () => {
    const s = totaux();
    document.querySelectorAll('[data-panier-compte]').forEach(c => { c.textContent = s.articles; c.hidden = !s.articles; });
    const ids = lignesTriees();
    if (!ids.length && !coffrets.length) {
      corps.innerHTML = `<div class="bq-panier-vide">
        <img class="bq-panier-vide-image" src="assets/img/verdignan-culots.jpg" alt="">
        <p>${t('Votre panier est vide.')}</p>
        <p>${t('Un carton de 6 suffit pour commencer, et vous pouvez mélanger les trois châteaux.')}</p>
        <button class="bq-lien" type="button" data-choisir-vin>${t('Choisir un vin')}</button>
      </div>`;
      return;
    }
    const manque = s.offerte ? 0 : L.gratuite_des_bouteilles - s.bouteilles;
    const jauge = Math.min(1, s.offerte ? 1 : s.bouteilles / L.gratuite_des_bouteilles);
    corps.innerHTML = `
      <div class="bq-port${s.offerte ? ' is-offert' : ''}">
        <p>${s.offerte ? t('La livraison vous est offerte.') : tf('Encore {0} bouteilles pour la livraison offerte : tous les châteaux comptent ensemble.', manque)}</p>
        <span class="bq-jauge" aria-hidden="true"><span style="width:${(jauge * 100).toFixed(0)}%"></span></span>
        ${s.offerte ? '' : `<p class="bq-port-drive">${t('Ou le drive au château : gratuit, dès un carton.')}</p>`}
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
      }).join('')}${coffrets.map((c, i) => `<li class="bq-ligne bq-ligne--coffret" data-coffret-ligne="${i}">
          <span class="bq-ligne-coffret" aria-hidden="true">${c.bouteilles.map(id => `<img src="assets/img/${parId[id].img}" alt="">`).join('')}</span>
          <div>
            <p class="bq-ligne-nom">${t('Coffret des trois générations')}</p>
            ${c.nom ? `<p class="bq-ligne-gravure">${tf('Gravé : {0}', `<span translate="no">${echapper(c.nom)}</span>`)}</p>` : ''}${c.de ? `<p class="bq-ligne-format">${tf('de la part de {0}', `<span translate="no">${echapper(c.de)}</span>`)}</p>` : ''}
            <p class="bq-ligne-format" translate="no">${c.bouteilles.map(id => `${parId[id].nom.replace('Château ', '')} ${parId[id].millesime}`).join(' · ')}</p>
          </div>
          <div class="bq-ligne-droite">
            <p translate="no">${euros(prixCoffret(c))}</p>
            <button class="bq-retirer" type="button" data-retirer-coffret>${t('Retirer')}</button>
          </div>
        </li>`).join('')}</ul>
      ${resume(s)}
      <button class="bq-bouton bq-commander" type="button" data-commander>${t('Commander')}</button>
      <p class="bq-panier-note">${t('Livraison en France métropolitaine, sous 10 à 12 jours ouvrés.')}</p>`;
  };
  corps.addEventListener('click', e => {
    if (e.target.closest('[data-choisir-vin]')) {
      fermer();
      if (espace !== 'particulier') basculer('particulier', '#la-cave');
      else setTimeout(() => viser(document.querySelector('#la-cave')), 120);
      return;
    }
    if (e.target.closest('[data-commander]')) { montrer('commande'); preparerCommande(); return; }
    const lc = e.target.closest('[data-coffret-ligne]');
    if (lc && e.target.closest('[data-retirer-coffret]')) { coffrets.splice(+lc.dataset.coffretLigne, 1); garderCoffrets(); majPanier(); return; }
    const li = e.target.closest('.bq-ligne:not(.bq-ligne--coffret)');
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
  const recap = () => { const s = totaux(); form.querySelector('[data-recap]').innerHTML = `<p class="bq-recap-titre">${s.articles === 1 ? t('1 article') : tf('{0} articles', s.articles)}</p>${resume(s)}`; };
  // Le drive : les jours (deux jours pour préparer la commande, pas le dimanche) et les heures, proposés à la famille
  const jourLong = d => new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const heureCourte = h => new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(new Date(2026, 0, 1, +h.slice(0, 2), +h.slice(3)));
  const lesJours = () => { const out = [], d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 2); while (out.length < 12) { if (d.getDay()) out.push(new Date(d)); d.setDate(d.getDate() + 1); } return out; };
  const lesHeures = d => (d.getDay() === 6 ? ['10:00', '11:00'] : ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00']);
  const selJour = form.querySelector('[data-drive-jours]'), creneaux = form.querySelector('[data-drive-creneaux]');
  const jourChoisi = () => { const [a, m, j] = selJour.value.split('-').map(Number); return new Date(a, m - 1, j); };
  const remplirHeures = () => {
    creneaux.innerHTML = lesHeures(jourChoisi()).map(h => `<label class="bq-creneau"><input type="radio" name="drive-heure" value="${h}"${mode === 'drive' ? ' required' : ''}> <span>${heureCourte(h)}</span></label>`).join('');
  };
  if (selJour) {
    selJour.innerHTML = lesJours().map(d => `<option value="${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}">${jourLong(d)}</option>`).join('');
    remplirHeures();
    selJour.addEventListener('change', remplirHeures);
  }
  const changerMode = m => {
    mode = m;
    form.querySelector('[data-drive]').hidden = m !== 'drive';
    form.querySelectorAll('[data-adresse]').forEach(x => { x.hidden = m === 'drive'; const i = x.querySelector('input'); if (i) i.required = m !== 'drive'; });
    creneaux.querySelectorAll('input').forEach(i => { i.required = m === 'drive'; });
    recap();
    majPanier();
  };
  form.addEventListener('change', e => { if (e.target.name === 'mode') changerMode(e.target.value); });
  const preparerCommande = () => {
    recap();
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
      erreur.textContent = invalide.name === 'drive-heure' ? t("Choisissez l'heure de votre passage au drive.")
        : invalide.type === 'checkbox' ? t('Cochez les deux cases pour valider la commande.')
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
      lignes: [
        ...lignesTriees().map(id => { const p = parId[id]; return { id, nom: p.nom, millesime: p.millesime, forme: p.forme, q: panier[id], prix: p.prix }; }),
        ...coffrets.map(c => ({ id: 'coffret', nom: t('Coffret des trois générations'), gravure: c.nom, signature: c.de, q: 1, bouteilles: 3, contenu: c.bouteilles, prix: prixCoffret(c) })),
      ],
      sousTotal: s.sousTotal, port: s.port, total: s.total, mode,
      livraison: mode === 'drive' ? { prenom: v('prenom'), nom: v('nom') } : { prenom: v('prenom'), nom: v('nom'), adresse: v('adresse'), cp: v('cp'), ville: v('ville') },
    };
    if (mode === 'drive') {
      const h = (form.querySelector('input[name="drive-heure"]:checked') || {}).value;
      commande.drive = { chateau: champ('drive-chateau').value, jour: selJour.value, heure: h, jourLong: jourLong(jourChoisi()), heureCourte: heureCourte(h) };
    }
    const commandes = lireJSON('miailhe-commandes', []);
    store.set('miailhe-commandes', JSON.stringify([commande, ...(Array.isArray(commandes) ? commandes : [])]));
    // la commande passée, le panier se vide (comme une vraie boutique)
    panier = {};
    garder();
    coffrets = [];
    garderCoffrets();
    form.reset();
    changerMode('livraison');
    majDansPanier();
    const client = lireJSON('miailhe-client', null);
    const connecte = client && client.email && client.email.toLowerCase() === commande.email;
    merci.innerHTML = `
      <p class="bq-sur">${t('Commande de démonstration')}</p>
      <h3>${tf('Merci, {0}.', `<span translate="no">${echapper(commande.livraison.prenom)}</span>`)}</h3>
      <p>${commande.drive
        ? tf('Votre commande de {0} vous attendrait au drive du château {1}, {2} à {3} : donnez votre numéro, nous la déposons dans votre coffre.', `<span translate="no">${euros(s.total)}</span>`, `<span translate="no">${CHATEAUX[commande.drive.chateau].nom.replace('Château ', '')}</span>`, `<span translate="no">${commande.drive.jourLong}</span>`, `<span translate="no">${commande.drive.heureCourte}</span>`)
        : tf('Votre commande de {0} serait préparée au château et livrée sous 10 à 12 jours ouvrés.', `<span translate="no">${euros(s.total)}</span>`)}</p>
      <p class="bq-merci-numero">${t('Numéro de commande')}<b translate="no">${numero}</b></p>
      ${connecte
        ? `<div class="bq-merci-espace"><p>${t('Votre commande est rangée dans votre espace client.')}</p><a class="bq-lien" href="compte.html">${t('Voir mon espace client')}</a></div>`
        : `<div class="bq-merci-espace"><p>${t('Retrouvez vos commandes, vos adresses et votre enquête au même endroit.')}</p><a class="bq-lien" href="compte.html">${t('Créer mon espace client')}</a></div>`}
      <p class="bq-maquette">${t("Maquette : aucune commande n'est passée, rien n'est envoyé ni débité.")}</p>
      <button class="bq-bouton" type="button" data-fermer-panier>${t('Revenir à la boutique')}</button>`;
    montrer('merci');
    merci.focus();
  });

  /* ---------- L'espace des professionnels ---------- */
  // Écrit en français : langue.js traduit ces zones comme le reste de la page (pas de translate="no" ici)
  let proPret = false;
  let demande = (lireJSON('miailhe-demande', []) || []).filter(x => x && x.slug);
  const tousLesVinsPro = () => (PRO ? ORDRE.flatMap(k => (PRO.chateaux[k] ? PRO.chateaux[k].vins.map(v => ({ ...v, chateau: k })) : [])) : []);
  const garderDemande = () => store.set('miailhe-demande', JSON.stringify(demande));
  const majDemande = () => {
    document.querySelectorAll('[data-demande-compte]').forEach(c => { c.textContent = demande.length; });
    document.querySelectorAll('[data-demande]').forEach(b => {
      const oui = demande.some(x => x.slug === b.dataset.demande);
      b.setAttribute('aria-pressed', String(oui));
      b.querySelector('span').textContent = oui ? 'Dans ma demande' : 'Ajouter à ma demande';
    });
    document.querySelectorAll('[data-pro-vins] input[name="vins"]').forEach(c => { c.checked = demande.some(x => x.slug === c.value); });
  };
  const basculerVin = (slug, oui) => {
    demande = demande.filter(x => x.slug !== slug);
    if (oui) demande.push({ slug, millesime: 'Millésime en cours' });
    garderDemande();
    majDemande();
  };

  // Une palette vue en perspective : des cartons sur leur palette de bois, en couches ; la couleur dit ce qu'elle porte
  const palette = (colonnes, couches) => {
    const nx = 3, ny = 3, h = .62, u = 22;
    const P = (x, y, z) => [(x - y) * .866 * u, (x + y) * .5 * u - z * u];
    const poly = (pts, cl) => `<polygon class="${cl}" points="${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}"/>`;
    let s = '';
    // la palette de bois
    s += poly([P(0, 0, 0), P(nx, 0, 0), P(nx, ny, 0), P(0, ny, 0)], 'pal-dessus');
    s += poly([P(nx, 0, 0), P(nx, ny, 0), P(nx, ny, -.28), P(nx, 0, -.28)], 'pal-cote');
    s += poly([P(0, ny, 0), P(nx, ny, 0), P(nx, ny, -.28), P(0, ny, -.28)], 'pal-face');
    const cubes = [];
    for (let k = 0; k < couches; k++) for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) cubes.push([i, j, k]);
    cubes.sort((a, b) => a[2] - b[2] || (a[0] + a[1]) - (b[0] + b[1]));
    cubes.forEach(([i, j, k]) => {
      const z = k * h, c = colonnes[i] || colonnes[0];
      s += `<g class="carton carton--${c}">`;
      s += poly([P(i, j, z + h), P(i + 1, j, z + h), P(i + 1, j + 1, z + h), P(i, j + 1, z + h)], 'c-dessus');
      s += poly([P(i + 1, j, z), P(i + 1, j + 1, z), P(i + 1, j + 1, z + h), P(i + 1, j, z + h)], 'c-droite');
      s += poly([P(i, j + 1, z), P(i + 1, j + 1, z), P(i + 1, j + 1, z + h), P(i, j + 1, z + h)], 'c-gauche');
      s += '</g>';
    });
    const x0 = -ny * .866 * u - 2, x1 = nx * .866 * u + 2, y0 = -4 * h * u - 4, y1 = (nx + ny) * .5 * u + .28 * u + 4;
    return `<svg class="pro-palette" viewBox="${x0.toFixed(0)} ${y0.toFixed(0)} ${(x1 - x0).toFixed(0)} ${(y1 - y0).toFixed(0)}" aria-hidden="true">${s}</svg>`;
  };

  const construirePro = () => {
    if (proPret || !PRO) return;
    proPret = true;
    const C = PRO.chateaux;
    const offre = document.querySelector('[data-pro-offre]');
    if (offre) {
      offre.innerHTML = ORDRE.filter(k => C[k]).map((k, n) => {
        const c = C[k];
        return `<article class="pro-chateau bq-apparait" data-chateau="${k}" id="pro-${k}">
          <figure class="pro-chateau-image">
            <img src="assets/img/${c.image}" alt="${echapper(c.alt)}" loading="lazy">
            <figcaption><span class="armoirie" data-armoirie="${k}"></span><span class="logo-chateau" data-logo-chateau="${k}" data-forme="logo"></span></figcaption>
          </figure>
          <div class="pro-chateau-texte">
            <p class="bq-sur">Pour ${echapper(c.occasion)}</p>
            <h3 class="pro-chateau-titre">${c.titre}</h3>
            <p class="pro-chateau-accroche">${echapper(c.accroche)}</p>
            <ul class="pro-vins">${c.vins.map(v => `<li class="pro-vin">
              <img src="assets/img/${v.image}" alt="" loading="lazy">
              <div class="pro-vin-texte">
                <p class="pro-vin-cat">${echapper(v.categorie)}</p>
                <h4>${echapper(v.nom)}</h4>
                <dl>
                  <div><dt>Cépages</dt><dd>${echapper(v.cepages)}</dd></div>
                  <div><dt>Garde</dt><dd>${echapper(v.garde)}</dd></div>
                  <div><dt>Millésimes</dt><dd>${echapper(v.millesimes)}</dd></div>
                  <div><dt>Formats</dt><dd>${echapper(v.conditionnement)}</dd></div>
                </dl>
                <p class="pro-vin-liens"><a href="${v.fiche}">La fiche du vin</a>${v.document ? ` <a href="${v.document.url}" target="_blank" rel="noopener">${echapper(v.document.titre)}</a>` : ''}</p>
              </div>
              <button class="pro-ajouter" type="button" data-demande="${v.slug}" aria-pressed="false"><i aria-hidden="true"></i><span>Ajouter à ma demande</span></button>
            </li>`).join('')}</ul>
          </div>
        </article>`;
      }).join('');
      habiller(offre);
    }
    // Les millésimes prêts à boire : un onglet par château
    const vieux = document.querySelector('[data-pro-vieux]');
    if (vieux) {
      vieux.innerHTML = `<div class="pro-onglets" role="tablist" aria-label="Le château">${ORDRE.filter(k => C[k]).map((k, n) => `<button type="button" role="tab" id="onglet-vieux-${k}" aria-controls="vieux-${k}" aria-selected="${!n}" data-onglet-vieux="${k}" data-chateau="${k}"><span class="armoirie" data-armoirie="${k}"></span>${echapper(C[k].nom)}</button>`).join('')}</div>
        ${ORDRE.filter(k => C[k]).map((k, n) => `<ol class="pro-frise" role="tabpanel" id="vieux-${k}" aria-labelledby="onglet-vieux-${k}" data-chateau="${k}"${n ? ' hidden' : ''}>${C[k].vieux.map(x => `<li><strong>${x.annee}</strong><span class="pro-frise-age">${ANNEE - +x.annee} ans</span><p>${echapper(x.note)}</p></li>`).join('')}</ol>`).join('')}`;
      habiller(vieux);
      vieux.addEventListener('click', e => {
        const b = e.target.closest('[data-onglet-vieux]');
        if (!b) return;
        vieux.querySelectorAll('[data-onglet-vieux]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
        vieux.querySelectorAll('.pro-frise').forEach(f => { f.hidden = f.id !== `vieux-${b.dataset.ongletVieux}`; });
      });
    }
    // Les trois façons de remplir une palette
    const formats = document.querySelector('[data-pro-formats]');
    if (formats) {
      const dessins = { chateau: palette(['kraft'], 4), demi: palette(['kraft'], 2), famille: palette(['coufran', 'verdignan', 'soudars'], 4) };
      formats.innerHTML = PRO.formats.map(f => `<article class="pro-format bq-apparait${f.cle === 'famille' ? ' pro-format--famille' : ''}">
          <div class="pro-format-dessin">${dessins[f.cle] || dessins.chateau}</div>
          <p class="pro-format-quantite">${echapper(f.quantite)}</p>
          <h3>${echapper(f.nom)}</h3>
          <p>${echapper(f.texte)}</p>
          <button class="bq-lien" type="button" data-choisir-format="${f.cle}">${f.cle === 'famille' ? 'Demander la palette famille' : 'Choisir ce format'}</button>
        </article>`).join('');
    }
    const etapes = document.querySelector('[data-pro-etapes]');
    if (etapes) etapes.innerHTML = PRO.etapes.map((x, n) => `<li class="bq-apparait"><span class="pro-etape-num" translate="no">${String(n + 1).padStart(2, '0')}</span><h3>${echapper(x.titre)}</h3><p>${echapper(x.texte)}</p></li>`).join('');
    const kit = document.querySelector('[data-pro-kit]');
    if (kit) kit.innerHTML = PRO.kit.map(x => `<li>${echapper(x)}</li>`).join('');
    const langues = document.querySelector('[data-pro-langues]');
    if (langues) langues.innerHTML = PRO.langues.map(x => `<span>${echapper(x)}</span>`).join('');
    // L'équipe commerciale : une seule personne pour Coufran et Verdignan, le standard pour Soudars
    const equipe = document.querySelector('[data-pro-equipe]');
    if (equipe) {
      const groupes = [];
      ORDRE.filter(k => C[k]).forEach(k => { const g = groupes.find(x => x.html === C[k].equipe); if (g) g.noms.push(C[k].nom); else groupes.push({ html: C[k].equipe, noms: [C[k].nom] }); });
      equipe.innerHTML = `<p class="bq-sur">L'équipe commerciale</p>${groupes.map(g => `<div class="pro-contact"><p class="pro-contact-qui" translate="no">${g.noms.join(' · ')}</p><p>${g.html}</p></div>`).join('')}`;
    }
    // Le formulaire : les formats, les vins de la demande et leur millésime, les métiers et les pays
    const radios = document.querySelector('[data-pro-radios]');
    if (radios) radios.innerHTML = PRO.formats.map((f, n) => `<label class="pro-radio"><input type="radio" name="format" value="${f.cle}"${n ? '' : ' checked'}> <span>${echapper(f.nom)}<small>${echapper(f.quantite)}</small></span></label>`).join('');
    const vins = document.querySelector('[data-pro-vins]');
    if (vins) vins.innerHTML = ORDRE.filter(k => C[k]).map(k => `<div class="pro-choix-chateau" data-chateau="${k}">
        <p class="pro-choix-nom"><span class="armoirie" data-armoirie="${k}"></span>${echapper(C[k].nom)}</p>
        ${C[k].vins.map(v => `<label class="pro-coche"><input type="checkbox" name="vins" value="${v.slug}"> <span>${echapper(v.nom)}</span><select name="millesime-${v.slug}" aria-label="Millésime : ${echapper(v.nom)}"><option value="Millésime en cours">Millésime en cours</option>${v.vieux ? C[k].vieux.map(x => `<option value="${x.annee}">${x.annee}</option>`).join('') : ''}</select></label>`).join('')}
      </div>`).join('');
    const remplir = (sel, liste) => { const s = document.querySelector(sel); if (s) s.insertAdjacentHTML('beforeend', liste.map(x => `<option value="${echapper(x)}">${echapper(x)}</option>`).join('')); };
    remplir('[data-pro-metiers]', PRO.metiers);
    remplir('[data-pro-pays]', PRO.pays);
    habiller(document.querySelector('.bq-pro'));
    observer(document.querySelector('.bq-pro'));
    majDemande();
    // le millésime choisi dans le formulaire suit la demande
    demande.forEach(x => { const s = document.querySelector(`[name="millesime-${x.slug}"]`); if (s && x.millesime) s.value = x.millesime; });
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-demande]');
    if (b) {
      const oui = b.getAttribute('aria-pressed') !== 'true';
      basculerVin(b.dataset.demande, oui);
      if (oui) {
        const v = tousLesVinsPro().find(x => x.slug === b.dataset.demande);
        if (v) dire(tf('{0} : ajouté à votre demande de devis.', v.nom));
        const bouton = document.querySelector('.bq-barre-demande');
        if (bouton && lent) bouton.animate([{ transform: 'scale(1.08)' }, { transform: 'none' }], { duration: 420, easing: 'ease-out' });
      }
      return;
    }
    const f = e.target.closest('[data-choisir-format]');
    if (f) {
      const r = document.querySelector(`[data-pro-form] input[name="format"][value="${f.dataset.choisirFormat}"]`);
      if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
      viser(document.querySelector('#demande'));
    }
  });

  const proForm = document.querySelector('[data-pro-form]');
  const proMerci = document.querySelector('[data-pro-merci]');
  if (proForm) {
    proForm.addEventListener('change', e => {
      if (e.target.name === 'vins') basculerVin(e.target.value, e.target.checked);
      if (e.target.name && e.target.name.startsWith('millesime-')) {
        const slug = e.target.name.slice(10), x = demande.find(y => y.slug === slug);
        if (x) { x.millesime = e.target.value; garderDemande(); }
        else { basculerVin(slug, true); demande.find(y => y.slug === slug).millesime = e.target.value; garderDemande(); }
      }
      if (e.target.name === 'format') {
        const famille = proForm.querySelector('input[name="format"]:checked').value === 'famille';
        proForm.querySelector('[data-famille-info]').hidden = !famille;
        proForm.querySelector('[data-pro-vins]').classList.toggle('is-famille', famille);
      }
      proForm.querySelector('[data-pro-erreur]').hidden = true;
    });
    proForm.addEventListener('input', () => { proForm.querySelector('[data-pro-erreur]').hidden = true; });
    proForm.addEventListener('submit', e => {
      e.preventDefault();
      const erreur = proForm.querySelector('[data-pro-erreur]');
      const fmt = proForm.querySelector('input[name="format"]:checked');
      const famille = fmt && fmt.value === 'famille';
      const dire = (m, el) => { erreur.textContent = m; erreur.hidden = false; if (el) el.focus(); };
      if (!famille && !demande.length) { dire('Choisissez au moins un vin pour votre palette.', proForm.querySelector('[data-pro-vins] input')); return; }
      const invalide = [...proForm.elements].find(x => x.willValidate && !x.checkValidity());
      if (invalide) {
        dire(invalide.name === 'pro' ? 'Cochez la case : la demande de devis est réservée aux professionnels.'
          : invalide.name === 'email' && invalide.value ? "L'adresse e-mail semble incomplète."
          : 'Il manque une information sur vous ou votre société.', invalide);
        return;
      }
      erreur.hidden = true;
      const v = n => (proForm.elements[n].value || '').trim();
      const maintenant = new Date();
      const numero = `D${maintenant.toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const devis = {
        numero, date: maintenant.toISOString(), email: v('email').toLowerCase(), societe: v('societe'), metier: v('metier'), pays: v('pays'),
        format: fmt ? fmt.value : '', vins: famille ? [] : demande.slice(), carton: v('carton'), livraison: v('livraison'), message: v('message'),
      };
      const anciens = lireJSON('miailhe-devis', []);
      store.set('miailhe-devis', JSON.stringify([devis, ...(Array.isArray(anciens) ? anciens : [])]));
      demande = [];
      garderDemande();
      proForm.reset();
      majDemande();
      proForm.querySelector('[data-famille-info]').hidden = true;
      proForm.hidden = true;
      proMerci.innerHTML = `<span class="wordmark" aria-hidden="true"></span>
        <h3>Merci, votre demande est partie.</h3>
        <p>Demande n° <strong translate="no">${numero}</strong>. L'équipe commerciale de la famille vous répond sous deux jours ouvrés, avec un devis complet.</p>
        <p class="bq-maquette">Maquette : rien n'est envoyé.</p>
        <button class="bq-lien" type="button" data-nouvelle-demande>Faire une autre demande</button>`;
      const lg = window.MIAILHE_LOGO;
      const w = proMerci.querySelector('.wordmark');
      if (lg && w) w.innerHTML = `<svg class="logo-svg" viewBox="${lg.logo.viewBox}" aria-hidden="true" focusable="false"><g transform="${lg.logo.transform}" fill="currentColor"><path d="${lg.logo.d}"/></g></svg>`;
      proMerci.hidden = false;
      proMerci.focus();
    });
    proMerci.addEventListener('click', e => {
      if (!e.target.closest('[data-nouvelle-demande]')) return;
      proMerci.hidden = true;
      proForm.hidden = false;
      proForm.querySelector('input, select').focus();
    });
  }

  /* ---------- La scène d'ouverture : les films des trois châteaux, l'un après l'autre ; l'estuaire pour les pros ---------- */
  const filmsScene = [...document.querySelectorAll('.bq-film[data-pour="particulier"]')];
  const filmPro = document.querySelector('.bq-film[data-pour="pro"]');
  const chapitresScene = [...document.querySelectorAll('.bq-scene-chapitres li')];
  const sceneEl = document.querySelector('.bq-scene');
  let actifFilm = -1, sceneVue = true, enRoute = false;
  const jouerFilm = i => {
    actifFilm = i;
    filmsScene.forEach((v, j) => {
      v.classList.toggle('is-actif', j === i);
      if (j !== i && !v.paused) setTimeout(() => { if (!v.classList.contains('is-actif')) { v.pause(); try { v.currentTime = 0; } catch (e) { /* pas encore chargé */ } } }, 1500);
    });
    chapitresScene.forEach((li, j) => { li.classList.toggle('is-actif', j === i); li.classList.toggle('is-passe', j < i); });
    const v = filmsScene[i];
    if (!lent) return;
    charger(v);
    try { v.currentTime = 0; } catch (e) { /* pas encore chargé */ }
    v.play().catch(() => { /* lecture refusée : l'affiche reste */ });
    charger(filmsScene[(i + 1) % filmsScene.length]);   // le suivant se prépare
  };
  filmsScene.forEach((v, i) => {
    const suivant = () => { if (actifFilm === i && espace === 'particulier') jouerFilm((i + 1) % filmsScene.length); };
    v.addEventListener('timeupdate', () => { if (v.duration && v.currentTime > v.duration - 1.2) suivant(); });
    v.addEventListener('ended', suivant);
  });
  // la progression du film en cours, sous le nom de son château
  const avancer = () => {
    const v = filmsScene[actifFilm], li = chapitresScene[actifFilm];
    if (v && li && v.duration) li.style.setProperty('--avance', Math.min(1, v.currentTime / (v.duration - 1.2)).toFixed(3));
    requestAnimationFrame(avancer);
  };
  const lancerScene = () => {
    if (!sceneVue) return;
    if (espace === 'particulier') {
      if (filmPro && !filmPro.paused) filmPro.pause();
      if (actifFilm < 0) jouerFilm(0);
      else if (lent) filmsScene[actifFilm].play().catch(() => {});
    } else {
      filmsScene.forEach(v => { if (!v.paused) v.pause(); });
      if (filmPro && lent) { charger(filmPro); filmPro.classList.add('is-actif'); filmPro.play().catch(() => {}); }
    }
  };
  const arreterScene = () => { [...filmsScene, filmPro].forEach(v => { if (v && !v.paused) v.pause(); }); };
  if (sceneEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => { sceneVue = e.isIntersecting; if (enRoute) (sceneVue ? lancerScene : arreterScene)(); }), { threshold: .15 }).observe(sceneEl);
  }

  /* ---------- Les deux espaces, et le passage de l'un à l'autre ---------- */
  const ANCRES_PRO = ['pro-offre', 'pro-vieux', 'pro-formats', 'pro-etapes', 'pro-kit', 'demande', 'pro-coufran', 'pro-verdignan', 'pro-soudars'];
  const params = new URLSearchParams(location.search);
  const ancre = location.hash.slice(1);
  let espace = params.get('espace') === 'pro' || ANCRES_PRO.includes(ancre) ? 'pro' : 'particulier';
  // le curseur glisse sous l'espace choisi
  const curseurs = () => document.querySelectorAll('[data-espace-choix]').forEach(g => {
    const b = g.querySelector(`[data-espace="${espace}"]`);
    if (!b || !b.offsetWidth) return;
    g.style.setProperty('--x', `${b.offsetLeft}px`);
    g.style.setProperty('--w', `${b.offsetWidth}px`);
  });
  const appliquer = e => {
    espace = e;
    document.body.dataset.espace = e;
    document.querySelectorAll('[data-pour]').forEach(el => { el.hidden = el.dataset.pour !== e; });
    document.querySelectorAll('[data-espace-choix] [data-espace]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.espace === e)));
    document.title = e === 'pro' ? t('Espace professionnel · La boutique de la famille · MIAILHE') : t('La boutique de la famille · MIAILHE');
    try {
      const u = new URL(location.href);
      if (e === 'pro') u.searchParams.set('espace', 'pro'); else u.searchParams.delete('espace');
      history.replaceState(null, '', u.pathname + u.search + (location.hash && location.hash !== '#panier' ? location.hash : ''));
    } catch (er) { /* file:// selon le navigateur */ }
    if (e === 'pro') construirePro();
    if (enRoute) lancerScene();
    requestAnimationFrame(curseurs);
  };
  // le rideau : on ferme sur le nom de l'espace, on change de décor, on rouvre sur la nouvelle scène
  const rideau = document.querySelector('.bq-rideau');
  let bascule = false;
  const basculer = (e, cible) => {
    if (bascule) return;
    if (e === espace) { if (cible) viser(document.querySelector(cible)); return; }
    const arrivee = () => {
      const el = cible && document.querySelector(cible);
      if (el) viser(el, false); else window.scrollTo(0, 0);
    };
    if (!lent || !rideau) { appliquer(e); arrivee(); return; }
    bascule = true;
    rideau.dataset.espace = e;
    rideau.querySelector('.bq-rideau-mot').textContent = e === 'pro' ? t('Espace professionnel') : t('Espace particuliers');
    rideau.classList.add('is-ferme');
    setTimeout(() => {
      appliquer(e);
      arrivee();
      rideau.classList.add('is-ouvre');
      setTimeout(() => { rideau.classList.remove('is-ferme', 'is-ouvre'); bascule = false; }, 800);
    }, 780);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-espace]');
    if (!b) return;
    // depuis la barre, on arrive au début du nouvel espace ; depuis la scène ou un lien, en haut de la page
    basculer(b.dataset.espace, b.closest('.bq-barre') ? '#boutique' : null);
  });
  // un lien vers une ancre de l'autre espace (le panier vide, une conversation…) y passe d'abord
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.matches('[data-espace]')) return;
    const id = a.getAttribute('href').slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    const pour = el.closest('[data-pour]');
    e.preventDefault();
    if (pour && pour.dataset.pour !== espace) basculer(pour.dataset.pour, '#' + id);
    else viser(el);
  });

  /* ---------- La hauteur de l'en-tête et de la racine du logo qui pend dessous (la barre se cale dessous) ---------- */
  const entete = document.querySelector('.site-header');
  const barre = document.querySelector('.bq-barre');
  const mesurer = () => {
    if (!entete) return;
    const h = entete.getBoundingClientRect(), w = entete.querySelector('.wordmark');
    const bas = w ? w.getBoundingClientRect().bottom : h.bottom;
    document.body.style.setProperty('--entete', `${Math.round(h.height)}px`);
    document.body.style.setProperty('--racine', `${Math.max(0, Math.round(bas - h.bottom + 6))}px`);
    curseurs();
  };
  mesurer();
  window.addEventListener('resize', mesurer);
  if (document.fonts) document.fonts.ready.then(mesurer);
  M.quandEntre && M.quandEntre(() => setTimeout(mesurer, 900));
  document.addEventListener('miailhe:langue', () => requestAnimationFrame(curseurs));
  // la barre colle sous l'en-tête : elle devient pleine quand elle y arrive
  if (barre && 'IntersectionObserver' in window) {
    const sonde = document.createElement('i');
    sonde.className = 'bq-sonde';
    barre.before(sonde);
    new IntersectionObserver(([e]) => barre.classList.toggle('is-collee', !e.isIntersecting && e.boundingClientRect.top < 0), { rootMargin: '-140px 0px 0px 0px' }).observe(sonde);
  }

  // aller à un élément : juste sous l'en-tête et la barre
  function viser(el, lisse = true) {
    if (!el) return;
    const haut = barre ? (parseFloat(getComputedStyle(barre).top) || 0) + barre.offsetHeight : 0;
    // la barre est collante : sa vraie place est celle de la sonde posée juste avant elle
    const sonde = document.querySelector('.bq-sonde');
    const cible = el === barre ? (sonde || el).getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(barre).top) || 0) : el.getBoundingClientRect().top + scrollY - haut - 12;
    window.scrollTo({ top: Math.max(0, cible), behavior: lisse && lent ? 'smooth' : 'auto' });
  }

  /* ---------- Arrivée : ?espace=pro, #coufran, ?vin=n2-de-coufran, #panier, #demande… ---------- */
  appliquer(espace);
  majPanier();
  const quand = fn => (M.quandEntre ? M.quandEntre(fn) : fn());
  quand(() => { enRoute = true; lancerScene(); requestAnimationFrame(avancer); });
  const vin = params.get('vin');
  const cible = vin && produits.filter(p => p.slug === vin).sort((a, b) => (dm(a) - dm(b)) || b.millesime - a.millesime)[0];
  if (cible && espace === 'particulier') quand(() => setTimeout(() => allerAuVin(cible.id), 350));
  else if (ancre && ancre !== 'panier' && document.getElementById(ancre)) quand(() => setTimeout(() => viser(document.getElementById(ancre)), 350));
  if (ancre === 'panier') quand(() => setTimeout(() => ouvrir(), 450));
  window.addEventListener('hashchange', () => { if (location.hash === '#panier') ouvrir(); });

  /* ---------- Le mouvement des scènes (29/10/2026, demande de l'utilisateur : une boutique plus cinématographique et
     interactive) : au défilement, le millésime géant glisse plus lentement que la bouteille, qui monte un peu (une
     profondeur, comme un travelling) ; au survol, la bouteille s'incline vers le curseur et un reflet la suit. Tout passe
     par des variables CSS (--p, --tx, --ty) sur la scène, lues par boutique.css. Rien sans mouvement réduit. ---------- */
  if (lent) {
    const scenes = new Set();
    const vues = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) scenes.add(e.target); else scenes.delete(e.target);
    }), { rootMargin: '10% 0px' }) : null;
    const suivre = racine => racine.querySelectorAll('.bq-cuvee-scene, .bq-doyenne-scene, .bq-chapitre').forEach(x => vues && vues.observe(x));
    suivre(document);
    // les scènes sont réécrites quand on change d'espace ou de millésime : on observe les nouvelles
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && suivre(n)))).observe(document.body, { childList: true, subtree: true });
    let attente = false;
    const caler = () => {
      attente = false;
      const h = innerHeight;
      scenes.forEach(x => {
        const r = x.getBoundingClientRect();
        // -1 quand la scène entre par le bas, 0 au milieu de l'écran, 1 quand elle sort par le haut
        const p = Math.max(-1, Math.min(1, (h / 2 - (r.top + r.height / 2)) / ((h + r.height) / 2)));
        x.style.setProperty('--p', p.toFixed(3));
      });
    };
    const demander = () => { if (!attente) { attente = true; requestAnimationFrame(caler); } };
    addEventListener('scroll', demander, { passive: true });
    addEventListener('resize', demander);
    demander();
    // l'inclinaison au survol (souris seulement : au doigt, la bouteille reste droite)
    document.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const x = e.target.closest && e.target.closest('.bq-cuvee-scene, .bq-doyenne-scene');
      document.querySelectorAll('.is-incline').forEach(y => { if (y !== x) { y.classList.remove('is-incline'); y.style.setProperty('--tx', 0); y.style.setProperty('--ty', 0); } });
      if (!x) return;
      const r = x.getBoundingClientRect();
      x.classList.add('is-incline');
      x.style.setProperty('--tx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
      x.style.setProperty('--ty', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
    }, { passive: true });
  }
})();
