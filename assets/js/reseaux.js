/* Les réseaux sociaux de la famille, en bas de chaque page : Instagram, Facebook, LinkedIn, TikTok.
   Une seule source pour toutes les pages (vitrine, châteaux, test, identité, Enquête) : le script remplit chaque
   élément [data-reseaux]. Instagram ouvre instagram.html, la copie de la page du compte du groupe avec le bouton
   Avant / Après vers le compte proposé @famillemiailhe (28/10/2026, demande de l'utilisateur) ; Facebook, LinkedIn et TikTok sont les comptes
   proposés pour la marque mère, à créer (voir README), sauf la page Facebook de Soudars, qui existe (data-facebook).
   Depuis le 29/10/2026 (demande de l'utilisateur), Facebook et TikTok ouvrent eux aussi leur maquette : facebook.html
   (la Page, avec le même fil qu'Instagram) et tiktok.html (le profil, avec les seuls reels). Le site de Soudars garde
   sa vraie Page Facebook.
   LinkedIn ajouté le 28/10/2026 (demande de l'utilisateur ; le brief le cite parmi les canaux du groupe, mais aucune
   page n'a été trouvée : remplacer l'adresse si le groupe en a une). */
(function () {
  // les pages instagram.html, facebook.html et tiktok.html sont à la racine du site : leur adresse se déduit de celle de
  // ce script (assets/js/), si bien que le lien marche depuis la vitrine comme depuis les sites des châteaux
  // (coufran/, verdignan/, soudars/)
  const ici = document.currentScript && document.currentScript.src;
  const page = nom => (ici ? new URL('../../' + nom, ici).href : nom);
  const INSTAGRAM = page('instagram.html'), FACEBOOK = page('facebook.html'), TIKTOK = page('tiktok.html');
  const RESEAUX = [
    { nom: 'Instagram', url: INSTAGRAM,
      svg: '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.3" cy="6.7" r="1.15" fill="currentColor"/>' },
    { nom: 'Facebook', url: FACEBOOK,
      svg: '<path fill="currentColor" d="M13.6 21v-7.6h2.6l.4-3.1h-3V8.4c0-.9.3-1.5 1.6-1.5h1.6V4.2c-.3 0-1.2-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.1H7.8v3.1h2.6V21z"/>' },
    { nom: 'LinkedIn', url: 'https://www.linkedin.com/company/famillemiailhe/',
      svg: '<path fill="currentColor" transform="translate(1.7 1.7) scale(.86)" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45z"/>' },
    { nom: 'TikTok', url: TIKTOK,
      svg: '<path fill="currentColor" d="M16.7 3c.3 2.3 1.6 3.7 3.9 3.9v3.1c-1.4.1-2.7-.3-3.9-1.1v6.3c0 3.2-2.5 5.8-5.7 5.8-3.1 0-5.6-2.5-5.6-5.6 0-3.4 2.9-5.9 6.3-5.5v3.2c-1.6-.4-3.2.7-3.2 2.3 0 1.3 1.1 2.4 2.5 2.4 1.5 0 2.6-1.1 2.6-2.8V3z"/>' },
  ];
  document.querySelectorAll('[data-reseaux]').forEach((nav) => {
    if (!nav.getAttribute('aria-label')) nav.setAttribute('aria-label', 'La famille Miailhe sur les réseaux');
    // un château qui a sa propre page (Soudars sur Facebook) la garde : data-facebook
    const propres = { Facebook: nav.dataset.facebook };
    nav.innerHTML = RESEAUX.map((r) => ({ ...r, url: propres[r.nom] || r.url })).map((r) => `<a href="${r.url}" target="_blank" rel="noopener" aria-label="${r.nom} (nouvel onglet)"><svg viewBox="0 0 24 24" aria-hidden="true">${r.svg}</svg></a>`).join('');
  });
})();
