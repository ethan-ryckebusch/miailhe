/* Microtypographie française, sur toutes les pages du site (27/10/2026).
   Sur chaque nœud de texte visible, y compris ceux qu'écrivent le quiz et l'Enquête :
   - espace fine insécable avant ; ! ? et à l'intérieur des guillemets « », insécable avant : ;
   - espace insécable entre un nombre et son unité (85 %, 16 °C, 75 cl, 600 bouteilles, n° 1) ;
   - apostrophe typographique ’ et points de suspension … ;
   - pas de mot orphelin : le dernier mot court d'un titre ou d'un paragraphe reste avec le précédent.
   Les champs de saisie, les scripts et le code ne sont jamais touchés. Seulement en français (langue.js). */
(function () {
  const FINE = ' ', INSEC = ' ';
  const IGNORES = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE', 'KBD', 'NOSCRIPT']);
  const BLOCS = 'h1, h2, h3, h4, p, li, figcaption, blockquote, dt, dd, .titre-equilibre';
  const UNITES = '(?:%|°C|°|cl|ml|ha|km|m|cm|mm|kg|g|€|ans?|mois|bouteilles?|cols|palettes?|hectares?|mètres?)';

  const corriger = t => t
    .replace(/(\S)[  ]([;!?»])/g, `$1${FINE}$2`)
    .replace(/([A-Za-zÀ-ÿ0-9)\]])([;!?])(?=\s|$)/g, `$1${FINE}$2`)
    .replace(/«[  ]/g, `«${FINE}`)
    .replace(/(\S) :(?=\s|$)/g, `$1${INSEC}:`)
    .replace(new RegExp(`(\\d) ${UNITES}(?![A-Za-zÀ-ÿ])`, 'g'), (m, d) => d + (m.includes('%') ? FINE : INSEC) + m.slice(2))
    .replace(/\b(n°|N°|p\.|t\.) (\d)/g, `$1${INSEC}$2`)
    .replace(/([A-Za-zÀ-ÿ])'(?=[A-Za-zÀ-ÿ]|$)/g, '$1’')   // l'… y compris devant une balise (l'<em>élégance</em>)
    .replace(/\.\.\./g, '…');

  const ignore = n => { for (let e = n.parentElement; e; e = e.parentElement) { if (IGNORES.has(e.tagName) || e.isContentEditable || e.hasAttribute('data-brut')) return true; } return false; };

  const traiterTexte = racine => {
    const w = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.nodeValue.trim() || ignore(n)) continue;
      const v = corriger(n.nodeValue);
      if (v !== n.nodeValue) n.nodeValue = v;
    }
  };

  // Le dernier mot (s'il est court) ne reste jamais seul sur sa ligne
  const sansOrpheline = racine => {
    const blocs = racine.matches && racine.matches(BLOCS) ? [racine] : [];
    (racine.querySelectorAll ? racine.querySelectorAll(BLOCS) : []).forEach(b => blocs.push(b));
    blocs.forEach(b => {
      if (b.closest('[data-brut]')) return;
      const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
      let dernier = null;
      for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue.trim()) dernier = n;
      if (!dernier || ignore(dernier)) return;
      const v = dernier.nodeValue, m = v.match(/ (\S{1,9}\s*)$/);
      if (m && v.trim().includes(' ')) dernier.nodeValue = v.slice(0, m.index) + INSEC + m[1];
    });
  };

  // en anglais et en japonais (langue.js), la microtypographie française ne s'applique pas
  const traiter = racine => { if (!/^fr/.test(document.documentElement.lang)) return; traiterTexte(racine); sansOrpheline(racine); };
  const go = () => {
    traiter(document.body);
    // Ce qu'écrivent ensuite les scripts (quiz, Enquête, formulaires) est corrigé à son tour
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) traiter(n);
      else if (n.nodeType === 3 && n.parentElement) traiter(n.parentElement);
    }))).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
