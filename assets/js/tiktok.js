/* tiktok.html : le compte TikTok proposé à la famille, @famillemiailhe (29/10/2026, demande de l'utilisateur :
   « duplique le même feed Insta version TikTok, avec uniquement les posts des réels »).
   Les 16 reels de la grille d'instagram.js, du plus récent au plus ancien ; le numéro est leur place dans cette grille
   (assets/img/tiktok/reel-NN.jpg, couvertures 9:16 réduites à 720 px depuis VISUELS_FINALISES/02_Instagram/Reels/4K).
   Les lignes et leurs textes alternatifs sont repris tels quels d'instagram.js (dont l'ordre suit le calendrier de
   Recommandation/Instagram/Feed/source/exporter_feed.py) : à reprendre si ce calendrier change. Les vues sont des
   chiffres de maquette, plausibles et modestes pour un compte qui démarre ; les J'aime en découlent. */
(function () {
  // [place dans la grille Instagram, vues (maquette), texte alternatif]
  const REELS = [
    ['07', 3214, 'Reel Les coulisses : trois semaines de vendanges, Lovely et Fred et leur panier de merlot'],
    ['11', 12400, 'Reel Vin contre vin : l’entrecôte grillée sur les sarments, à même la grave, Coufran ou Verdignan ?'],
    ['15', 8902, 'Reel Gardé pour vous : la plus vieille bouteille de la cave, devinez l’année'],
    ['19', 21700, 'Reel Enquête à la racine : des bouteilles ont disparu, Lovely à la loupe, Fred à la lanterne ; l’enquête se joue sur le site, une bouteille à gagner'],
    ['23', 4105, 'Reel Visites guidées : Lovely raconte, Fred porte la caisse de dégustation, des visiteurs de dos, le belvédère de Coufran au bout des rangs'],
    ['27', 6388, 'Reel : les mains d’un vigneron tiennent une carte au trésor ; Coufran, Verdignan et Soudars reliés par une même racine au sceau de la famille Miailhe'],
    ['31', 15100, 'Reel Vin contre vin : un gigot d’agneau de Pauillac servi dans les vignes du Médoc, Coufran ou Verdignan ?'],
    ['35', 2976, 'Reel Gardé pour vous : Lovely entre les casiers où les bouteilles attendent'],
    ['39', 5512, 'Reel Du chai au verre : Fred tire le vin de la barrique à la pipette, Lovely tient le verre'],
    ['43', 18300, 'Reel Fred explique : deux verres du même vin, l’un jeune et violet, l’autre grenat ; Lovely sceptique, Fred montre le plus vieux. Trop tôt ou prêt ?'],
    ['47', 7240, 'Reel Fred explique : l’assemblage, trois parcelles pour un seul vin'],
    ['51', 9815, 'Reel : Fred sort une vieille bouteille des casiers, Lovely montre l’objectif. Votre année de naissance ?'],
    ['55', 31200, 'Reel Fred explique : le verre idéal'],
    ['59', 3670, 'Reel Les coulisses : Lovely et Fred ouvrent la porte du chai'],
    ['63', 11800, 'Reel Le test : Lovely et Fred tendent Soudars et Coufran, Verdignan entre eux. Quel château êtes-vous ?'],
    ['67', 4433, 'Reel Wine family : Lovely et Fred, deux cousins, dans les vignes sous un ciel bleu'],
  ];
  // les séries, en listes de lecture (du premier épisode au dernier), la plus récemment complétée d'abord
  const LISTES = [
    ['Les coulisses', ['59', '07']],
    ['Vin contre vin', ['31', '11']],
    ['Gardé pour vous', ['35', '15']],
    ['Fred explique', ['55', '47', '43']],
  ];
  const ABONNEMENTS = 41, ABONNES = 2318;
  const IMG = 'assets/img/tiktok/';

  // les nombres à la manière de TikTok : 3214 → 3.2K, 31200 → 31.2K (même en français, sur la vraie page)
  const nombre = n => n < 1000 ? String(n) : n < 1e6 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  // les J'aime de chaque vidéo : entre 6 et 9 % des vues
  const jaime = REELS.reduce((s, [nn, vues], i) => s + Math.round(vues * (0.06 + ((i * 7) % 10) * 0.003)), 0);
  const echapper = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  document.querySelector('[data-chiffres]').innerHTML = [
    [ABONNEMENTS, 'Suivis'], [ABONNES, 'Followers'], [jaime, 'J’aime'],
  ].map(([n, mot]) => `<li><strong translate="no">${nombre(n)}</strong> <span>${mot}</span></li>`).join('');

  /* ---------- La grille, et son tri ---------- */
  const VUE = '<svg viewBox="0 0 48 48" fill="#fff" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 10.554V37.4459L38.1463 24L16 10.554ZM12 8.77702C12 6.43812 14.5577 4.99881 16.5569 6.21266L41.6301 21.4356C43.5542 22.6038 43.5542 25.3962 41.6301 26.5644L16.5569 41.7873C14.5577 43.0012 12 41.5619 12 39.223V8.77702Z"></path></svg>';
  const grille = document.querySelector('[data-grille]');
  const TRIS = {
    recents: () => REELS.slice(),
    populaire: () => REELS.slice().sort((a, b) => b[1] - a[1]),
    ancienne: () => REELS.slice().reverse(),
  };
  const dessiner = tri => {
    grille.innerHTML = TRIS[tri]().map(([nn, vues, alt]) => `<li><div class="tt-video"><img src="${IMG}reel-${nn}.jpg" alt="${echapper(alt)}" loading="lazy"><span class="tt-vues" translate="no">${VUE}${nombre(vues)}</span></div></li>`).join('');
  };
  dessiner('recents');
  document.querySelectorAll('[data-tri]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-tri]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    dessiner(b.dataset.tri);
  }));

  /* ---------- Les listes de lecture ---------- */
  const alt = nn => REELS.find(r => r[0] === nn)[2];
  const listes = document.querySelector('[data-listes]');
  listes.innerHTML = LISTES.map(([titre, nns]) => `<li class="tt-liste"><img src="${IMG}reel-${nns[0]}.jpg" alt="${echapper(alt(nns[0]))}" loading="lazy"><div><b>${titre}</b><span>${nns.length} publications</span></div></li>`).join('');
  const fleches = () => {
    const [g, d] = document.querySelectorAll('.tt-listes-fleche');
    g.hidden = listes.scrollLeft <= 1;
    d.hidden = listes.scrollLeft + listes.clientWidth >= listes.scrollWidth - 1;
  };
  listes.addEventListener('scroll', fleches, { passive: true });
  document.querySelectorAll('.tt-listes-fleche').forEach(b => b.addEventListener('click', () => listes.scrollBy({ left: b.dataset.sens * (listes.clientWidth - 120) })));

  /* ---------- Le trait sous l'onglet actif ---------- */
  const trait = document.querySelector('.tt-onglet-trait');
  const placer = () => {
    const actif = document.querySelector('.tt-onglet[aria-selected="true"]');
    trait.style.width = actif.offsetWidth + 'px';
    trait.style.transform = `translateX(${actif.offsetLeft + (actif.offsetWidth - trait.offsetWidth) / 2}px)`;
    fleches();
  };
  placer();
  window.addEventListener('resize', placer);
  document.addEventListener('miailhe:langue', placer);   // les onglets changent de largeur une fois traduits
  if (document.fonts) document.fonts.ready.then(placer);
})();
