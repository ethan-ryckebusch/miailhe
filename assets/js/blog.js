/* Le blog (29/10/2026) : les filtres par catégorie sur la page du blog ; dans un article, la barre de lecture, le
   sommaire qui suit la lecture et qui se replie sur téléphone. Tout le texte est déjà dans la page (pour Google) :
   ce script ne fait que montrer, cacher et souligner. */
(function () {
  // Sur un téléphone, la rangée d'onglets peut défiler : l'onglet « Le blog » reste en vue
  const ici = document.querySelector('.onglets [aria-current]');
  if (ici && ici.parentElement.scrollWidth > ici.parentElement.clientWidth) ici.parentElement.scrollLeft = ici.offsetLeft - 12;

  // Les filtres : une catégorie, ou tous les articles
  const filtres = [...document.querySelectorAll('[data-filtre]')];
  const cartes = [...document.querySelectorAll('.bl-liste .bl-carte')];
  filtres.forEach(b => b.addEventListener('click', () => {
    const cat = b.dataset.filtre;
    filtres.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    cartes.forEach(c => { c.hidden = !!cat && c.dataset.categorie !== cat; });
  }));

  // La barre de lecture
  const barre = document.querySelector('.ar-progression span');
  const texte = document.querySelector('.ar-texte');
  if (barre && texte) {
    const suivre = () => {
      const r = texte.getBoundingClientRect();
      const fait = Math.min(1, Math.max(0, (innerHeight * .35 - r.top) / r.height));
      barre.style.transform = `scaleX(${fait})`;
    };
    addEventListener('scroll', suivre, { passive: true });
    addEventListener('resize', suivre);
    suivre();
  }

  // Le sommaire : replié sur téléphone, il souligne l'intertitre en cours de lecture
  const sommaire = document.querySelector('.ar-sommaire details');
  if (sommaire && matchMedia('(max-width: 960px)').matches) sommaire.open = false;
  if (sommaire && !matchMedia('(max-width: 960px)').matches) sommaire.querySelector('summary').addEventListener('click', e => e.preventDefault());
  const liens = [...document.querySelectorAll('.ar-sommaire a')];
  const titres = liens.map(a => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  if (titres.length && 'IntersectionObserver' in window) {
    const vus = new Map();
    const marquer = () => {
      let actif = titres[0];
      titres.forEach(t => { if (t.getBoundingClientRect().top < innerHeight * .3) actif = t; });
      liens.forEach(a => { if (a.hash === '#' + actif.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    };
    const obs = new IntersectionObserver(es => { es.forEach(e => vus.set(e.target, e.isIntersecting)); marquer(); }, { rootMargin: '0px 0px -60% 0px' });
    titres.forEach(t => obs.observe(t));
    addEventListener('scroll', marquer, { passive: true });
    liens.forEach(a => a.addEventListener('click', () => { if (matchMedia('(max-width: 960px)').matches) sommaire.open = false; }));
  }
})();
