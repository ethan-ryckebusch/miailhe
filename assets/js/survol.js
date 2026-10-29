/* La racine des liens de l'en-tête (27/10/2026) : au survol d'un onglet de l'accueil, d'un lien du menu des châteaux ou
   des liens « La boutique » et « L'enquête », une fine racine pousse sous le mot, lâche une radicelle et s'achève sur la
   feuille de vigne du logo MIAILHE, qui pend à son bout comme dans le logo. Elle remplace le trait qui soulignait le lien ;
   le lien de la page ouverte garde sa racine.
   28/10/2026 : la feuille est celle du logo (feuille-miailhe.js, demande de l'utilisateur), et la racine suit le mot seul :
   quand le lien porte une icône, elle part sous la première lettre, pas sous l'icône (elle s'y tassait). */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const liens = [...document.querySelectorAll('.onglets > a, .ch-nav > a, .entete-fort, .ch-fort')];
  if (!liens.length) return;
  const FEUILLE = window.MIAILHE_FEUILLE;

  const el = (nom, attrs, parent) => {
    const n = document.createElementNS(NS, nom);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  function pousser(a) {
    // le mot : le texte du lien, sans son icône
    const mot = a.querySelector(':scope > span:not(.sr-only)') || a;
    const w = Math.round(mot.getBoundingClientRect().width);
    const x0 = mot === a ? 0 : Math.round(mot.getBoundingClientRect().left - a.getBoundingClientRect().left);
    const cle = `${w}/${x0}`;
    if (!w || a.dataset.racine === cle) return;
    a.dataset.racine = cle;
    const ancien = a.querySelector('.racine-survol');
    if (ancien) ancien.remove();
    const H = 22, y = 3, fin = w - 2;
    const svg = el('svg', { class: 'racine-survol', viewBox: `-2 0 ${w + 16} ${H}`, width: w + 16, height: H, 'aria-hidden': 'true', focusable: 'false' }, a);
    svg.style.left = `${x0 - 2}px`;
    // la racine : presque droite, une légère ondulation, elle plonge un peu vers sa fin
    const q = w / 4;
    el('path', { class: 'brin', pathLength: 1, d: `M0 ${y}C${q} ${y + 1.4} ${2 * q} ${y - .6} ${3 * q} ${y + .8}S${fin - 3} ${y + 2.6} ${fin} ${y + 4.2}` }, svg);
    // une radicelle part vers le bas, aux deux tiers
    const xr = Math.round(w * .58);
    el('path', { class: 'radicelle', pathLength: 1, d: `M${xr} ${y + .7}q${4} ${2.2} ${6.5} ${7.5}` }, svg);
    // la feuille du logo, qui pend au bout de la racine, un peu penchée vers l'avant
    const g = el('g', { transform: `translate(${fin} ${y + 4.2}) rotate(-28)` }, svg);
    const f = el('g', { class: 'feuille' }, g);
    if (FEUILLE) el('path', { class: 'limbe', d: FEUILLE.d, 'fill-rule': 'evenodd', transform: 'scale(.105)' }, f);
  }

  const tout = () => liens.forEach(pousser);
  tout();
  if (document.fonts) document.fonts.ready.then(() => { liens.forEach(a => delete a.dataset.racine); tout(); });
  if ('ResizeObserver' in window) { const o = new ResizeObserver(tout); liens.forEach(a => o.observe(a)); }
  document.addEventListener('miailhe:langue', () => requestAnimationFrame(tout));
})();
