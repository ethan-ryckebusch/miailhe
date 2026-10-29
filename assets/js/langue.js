/* Les langues du site (27/10/2026) : français, anglais, japonais. Le français est la langue d'écriture : les pages,
   le générateur des châteaux et les scripts restent en français, et la traduction se fait dans le navigateur.
   - Ce script est le premier de chaque page (dans le <head>). Il choisit la langue : ?lang=en ou ja dans l'adresse,
     sinon celle choisie à la visite précédente (localStorage miailhe-langue), sinon le français.
   - En anglais ou en japonais, il charge le dictionnaire (assets/js/i18n/en.js ou ja.js, écrits par
     source/i18n/construire.py) et traduit la page dès qu'elle est lue, avant de l'afficher. Ce que les scripts écrivent
     ensuite (le test, l'Enquête, les bouteilles, l'histoire…) est traduit à mesure (MutationObserver).
   - L'unité de traduction est le bloc de texte : un élément qui ne contient que du texte et des balises de texte
     (a, em, span…). Sa clé est son texte, ses balises notées <0>…</0> ou <1/> ; la traduction peut les déplacer
     (l'ordre des mots change en japonais) mais les garde toutes, et les éléments d'origine sont réutilisés tels quels.
   - Un chiffre qui change (compteurs, années) : si la phrase exacte manque, on cherche la même avec {0}, {1}…
   - Changer de langue recharge la page (le sélecteur .langues, dans chaque en-tête et sur la porte d'âge).
   Les clés introuvables sont notées dans MIAILHE.manquants (contrôle : source/i18n/extraire.py). */
(function () {
  const M = (window.MIAILHE = window.MIAILHE || {});
  const LANGUES = { fr: 'Français', en: 'English', ja: '日本語' };
  const COURT = { fr: 'Fr', en: 'En', ja: '日本語' };
  const lire = (s, k) => { try { return window[s].getItem(k); } catch (e) { return null; } };
  const ecrire = (s, k, v) => { try { window[s].setItem(k, v); } catch (e) { /* stockage indisponible */ } };

  const demandee = new URLSearchParams(location.search).get('lang');
  if (demandee in LANGUES) ecrire('localStorage', 'miailhe-langue', demandee);
  const langue = demandee in LANGUES ? demandee : (lire('localStorage', 'miailhe-langue') in LANGUES ? lire('localStorage', 'miailhe-langue') : 'fr');
  M.langue = langue;
  M.langues = LANGUES;
  document.documentElement.lang = langue;
  // changement de langue depuis la porte d'âge : on ne rejoue pas l'intro (intro.js)
  if (lire('sessionStorage', 'miailhe-intro-sautee')) { M.introSautee = true; try { sessionStorage.removeItem('miailhe-intro-sautee'); } catch (e) { /* */ } }

  /* ---------- Le sélecteur de langue ---------- */
  const adresse = l => {
    const u = new URL(location.href);
    u.searchParams.set('lang', l);
    return u.href;
  };
  const changer = l => {
    ecrire('localStorage', 'miailhe-langue', l);
    const porte = document.querySelector('.age-gate:not(.is-gone), .age:not([hidden])');
    if (porte && porte.isConnected) ecrire('sessionStorage', 'miailhe-intro-sautee', '1');
    location.href = adresse(l);
  };
  M.changerLangue = changer;
  const remplirSelecteurs = () => document.querySelectorAll('.langues').forEach(ul => {
    ul.setAttribute('translate', 'no');
    ul.innerHTML = Object.keys(LANGUES).map(l => `<li><a href="${adresse(l)}" lang="${l}" hreflang="${l}" data-langue="${l}"`
      + `${l === langue ? ' aria-current="true"' : ''} title="${LANGUES[l]}">${COURT[l]}</a></li>`).join('');
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('.langues a[data-langue]');
    if (!a) return;
    e.preventDefault();
    if (a.dataset.langue !== langue) changer(a.dataset.langue);
  });

  if (langue === 'fr') {
    document.addEventListener('DOMContentLoaded', remplirSelecteurs);
    M.t = s => s;
    M.tf = (s, v = []) => s.replace(/\{(\d+)\}/g, (m, i) => v[i] ?? '');
    return;
  }

  /* ---------- La traduction ---------- */
  const racine = (document.currentScript && document.currentScript.src || '').replace(/langue\.js(\?.*)?$/, '');
  // ?collecte : sans dictionnaire, pour relever toutes les phrases de la page (source/i18n/extraire.py)
  const collecte = new URLSearchParams(location.search).has('collecte');
  document.write('<style id="trad-attente">html.trad-attente body{opacity:0!important}</style>'
    + (collecte ? '' : `<script src="${racine}i18n/${langue}.js"><\/script>`));
  document.documentElement.classList.add('trad-attente');
  const montrer = () => document.documentElement.classList.remove('trad-attente');
  setTimeout(montrer, 2500);   // jamais de page blanche, même si quelque chose échoue

  const INLINE = new Set(['A', 'ABBR', 'B', 'BDI', 'BDO', 'CITE', 'DFN', 'EM', 'I', 'MARK', 'Q', 'S', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'TIME', 'U', 'VAR']);
  const OPAQUE = new Set(['BR', 'WBR', 'IMG', 'SVG', 'PICTURE', 'VIDEO', 'CANVAS']);
  const IGNORES = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TEXTAREA', 'SVG', 'CODE', 'PRE']);
  // les éléments de texte : un bloc même sans texte direct (un titre fait de deux <span>) ; les autres conteneurs
  // (une rangée de liens, les portes) ne forment un bloc que s'ils portent eux-mêmes du texte
  const TEXTES = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI', 'BUTTON', 'LABEL', 'FIGCAPTION', 'BLOCKQUOTE', 'DT', 'DD', 'TD', 'TH', 'LEGEND', 'SUMMARY', 'CAPTION', 'OPTION']);
  const ATTRIBUTS = ['title', 'alt', 'aria-label', 'placeholder', 'aria-description'];
  const LETTRE = /\p{L}/u;
  const nom = n => n.nodeName.toUpperCase();

  // la clé : espaces de toutes sortes ramenées à une, apostrophe droite (la microtypographie ne compte pas)
  const norm = s => s.replace(/[     ]/g, ' ').replace(/[’]/g, "'").replace(/…/g, '...').replace(/\s+/g, ' ').trim();
  M.normaliserCle = norm;

  // le dictionnaire arrive juste après ce script (document.write) : les scripts de la page peuvent s'en servir dès leur lancement
  let D = null;
  const dico = () => D || (window.MIAILHE_TRAD && window.MIAILHE_TRAD[langue] ? (D = window.MIAILHE_TRAD[langue]) : {});
  const manquants = (M.manquants = new Set());
  const produits = new Set();   // ce que les scripts ont déjà traduit (M.t, M.tf) : rien à chercher
  const vues = (M.cles = new Map());   // toutes les phrases rencontrées, et où (pour extraire.py)
  const chercher = (cle, ou) => {
    if (!cle || !LETTRE.test(cle)) return null;
    if (collecte && !vues.has(cle)) vues.set(cle, ou || '');
    const D = dico();
    if (Object.prototype.hasOwnProperty.call(D, cle)) return D[cle];
    if (produits.has(cle)) return null;
    // un chiffre qui change : la même phrase avec {0}, {1}…
    const nombres = [];
    const modele = cle.replace(/(?<![<\/\w{])\d+(?:[.,]\d+)?(?![\w>\/}])/g, n => `{${nombres.push(n) - 1}}`);
    if (nombres.length && Object.prototype.hasOwnProperty.call(D, modele)) return D[modele].replace(/\{(\d+)\}/g, (m, i) => nombres[i] ?? m);
    manquants.add(cle);
    return null;
  };
  // pour les scripts : une phrase, ou une phrase avec des valeurs à insérer ({0}, {1}…)
  M.t = s => { const t = chercher(norm(s)); if (t == null) return s; produits.add(norm(t)); return t; };
  M.tf = (s, v = []) => { const r = (chercher(norm(s)) ?? s).replace(/\{(\d+)\}/g, (m, i) => v[i] ?? ''); produits.add(norm(r)); return r; };

  const ou = e => `${e.nodeName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}`;
  const ignore = e => { for (let x = e; x && x.nodeType === 1; x = x.parentElement) { if (IGNORES.has(nom(x)) || x.getAttribute('translate') === 'no') return true; } return false; };
  // un élément translate="no" (le prénom du joueur…) reste tel quel, à sa place dans la phrase
  const fige = n => OPAQUE.has(nom(n)) || n.getAttribute('translate') === 'no';
  const aDuTexte = e => {
    for (const n of e.childNodes) {
      if (n.nodeType === 3 && LETTRE.test(n.nodeValue)) return true;
      if (n.nodeType === 1 && !fige(n) && aDuTexte(n)) return true;
    }
    return false;
  };
  // un bloc de texte : seulement du texte et des balises de texte
  const phrase = e => {
    for (const n of e.childNodes) {
      if (n.nodeType !== 1) continue;
      if (fige(n)) { if (INLINE.has(nom(n)) || OPAQUE.has(nom(n))) continue; return false; }
      if (!INLINE.has(nom(n)) || !phrase(n)) return false;
    }
    return true;
  };
  const serialiser = (e, els) => {
    let s = '';
    for (const n of e.childNodes) {
      if (n.nodeType === 3) s += n.nodeValue.replace(/</g, '&lt;');
      else if (n.nodeType === 1) {
        const i = els.push(n) - 1;
        s += fige(n) || !aDuTexte(n) ? `<${i}/>` : `<${i}>${serialiser(n, els)}</${i}>`;
      }
    }
    return s;
  };
  // la traduction remonte le bloc avec ses propres éléments
  const construire = (e, trad, els) => {
    const pile = [e];
    e.replaceChildren();
    const re = /<(\/?)(\d+)(\/?)>/g;
    let fin = 0, m;
    const texte = t => { if (t) pile[pile.length - 1].appendChild(document.createTextNode(t.replace(/&lt;/g, '<'))); };
    while ((m = re.exec(trad))) {
      texte(trad.slice(fin, m.index));
      fin = re.lastIndex;
      const x = els[+m[2]];
      if (!x) continue;
      if (m[1]) { if (pile.length > 1) pile.pop(); continue; }
      if (m[3]) { pile[pile.length - 1].appendChild(x); continue; }
      x.replaceChildren();
      pile[pile.length - 1].appendChild(x);
      pile.push(x);
    }
    texte(trad.slice(fin));
  };
  // la clé et les éléments doivent correspondre : sinon on laisse le français
  const valide = (cle, trad) => {
    const b = s => (s.match(/<\/?\d+\/?>/g) || []).sort().join();
    return b(cle) === b(trad);
  };

  let occupe = false;
  const traduireBloc = e => {
    const els = [];
    const cle = norm(serialiser(e, els));
    const trad = chercher(cle, collecte && ou(e));
    if (trad == null || trad === cle) return;
    if (!valide(cle, trad)) { manquants.add(cle); return; }
    construire(e, trad, els);
  };
  const traduireTexte = n => {
    const v = n.nodeValue, cle = norm(v);
    const trad = chercher(cle, collecte && n.parentElement && ou(n.parentElement));
    if (trad == null || trad === cle) return;
    const debut = v.match(/^\s*/)[0], fin = v.match(/\s*$/)[0];
    n.nodeValue = debut + trad + fin;
  };
  const traduireAttributs = e => {
    for (const a of ATTRIBUTS) {
      const v = e.getAttribute(a);
      if (!v) continue;
      const trad = chercher(norm(v), collecte && `${ou(e)} @${a}`);
      if (trad != null && trad !== v) e.setAttribute(a, trad);
    }
  };
  const parcourir = e => {
    if (e.nodeType !== 1 || ignore(e)) return;
    traduireAttributs(e);
    e.querySelectorAll('[title], [alt], [aria-label], [placeholder], [aria-description]').forEach(x => { if (!ignore(x)) traduireAttributs(x); });
    marcher(e);
  };
  const texteDirect = e => { for (const n of e.childNodes) if (n.nodeType === 3 && LETTRE.test(n.nodeValue)) return true; return false; };
  const marcher = e => {
    if (IGNORES.has(nom(e)) || e.getAttribute('translate') === 'no') return;
    if (aDuTexte(e) && phrase(e) && (TEXTES.has(nom(e)) || texteDirect(e))) { traduireBloc(e); return; }
    for (const n of [...e.childNodes]) {
      if (n.nodeType === 3) { if (LETTRE.test(n.nodeValue)) traduireTexte(n); }
      else if (n.nodeType === 1) marcher(n);
    }
  };
  // ce que les scripts écrivent après coup : le nouvel élément, ou le bloc dont le texte a changé
  const apres = m => {
    if (m.type === 'attributes') { if (!ignore(m.target)) traduireAttributs(m.target); return; }
    if (m.type === 'characterData') {
      const p = m.target.parentElement;
      if (!p || ignore(p)) return;
      if (phrase(p)) traduireBloc(p); else if (LETTRE.test(m.target.nodeValue)) traduireTexte(m.target);
      return;
    }
    if (ignore(m.target)) return;
    let texte = false;
    m.addedNodes.forEach(n => { if (n.nodeType === 1) parcourir(n); else if (n.nodeType === 3 && n.isConnected && LETTRE.test(n.nodeValue)) texte = true; });
    if (texte) { if (phrase(m.target) && aDuTexte(m.target)) traduireBloc(m.target); else m.addedNodes.forEach(n => { if (n.nodeType === 3 && n.isConnected) traduireTexte(n); }); }
  };

  const tout = () => {
    occupe = true;
    const titre = chercher(norm(document.title));
    if (titre) document.title = titre;
    document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]').forEach(m => {
      const t = chercher(norm(m.content || '')); if (t) m.content = t;
    });
    remplirSelecteurs();
    parcourir(document.body);
    occupe = false;
    const obs = new MutationObserver(ms => {
      if (occupe) return;
      occupe = true;
      ms.forEach(apres);
      obs.takeRecords();   // nos propres changements
      occupe = false;
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTS });
    document.dispatchEvent(new CustomEvent('miailhe:langue', { detail: langue }));
    requestAnimationFrame(montrer);
  };
  document.addEventListener('DOMContentLoaded', tout);
})();
