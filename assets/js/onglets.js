/* Les onglets de l'accueil (27/10/2026) : l'accueil ne montre que les trois portes ; les onglets de l'en-tête
   (« La famille », « Le terroir », « Prêt-à-boire », « Où nous trouver ») ouvrent chacun un panneau plein écran
   au-dessus d'elles, qui défile sur lui-même ; « Le test » ouvre le test (quiz.js). On revient aux portes par « Revenir
   aux portes », le logo, l'onglet ouvert ou Échap. Les adresses suivent : #famille, #terroir, #pret-a-boire,
   #ou-trouver, #test ; une ancre placée dans un panneau (#visiter, #contact…) ouvre le panneau et y descend. Les
   anciennes ancres de la vitrine restent valables. Un panneau peut demander ses scripts à sa première ouverture
   (data-scripts) : la carte de « Où nous trouver » et ses 4 000 magasins ne pèsent pas sur l'arrivée aux portes. */
(function () {
  const M = window.MIAILHE || {};
  const panneaux = [...document.querySelectorAll('[data-panneau]')];
  if (!panneaux.length) return;
  const onglets = [...document.querySelectorAll('.onglets a')];
  const reduit = !!M.reduceMotion;
  const ALIAS = { histoire: 'famille', quiz: 'test' };   // les ancres de la vitrine en six actes (#racine est dans « Le terroir »)
  let ouvert = null;
  let retour = null;

  const marquer = id => onglets.forEach(o => {
    const ici = !!id && (o.dataset.onglet === id || (id === 'test' && o.hasAttribute('data-ouvrir-test')));
    if (ici) o.setAttribute('aria-current', 'page'); else o.removeAttribute('aria-current');
  });
  const adresse = id => { try { history.replaceState(null, '', location.pathname + location.search + (id ? `#${id}` : '')); } catch (e) { /* file:// */ } };
  const signaler = () => document.dispatchEvent(new CustomEvent('miailhe:onglet', { detail: ouvert ? ouvert.id : null }));

  const fermer = (vite = false) => {
    if (!ouvert) return;
    const p = ouvert;
    ouvert = null;
    p.classList.remove('is-ouvert');
    document.body.classList.remove('panneau-ouvert');
    p.inert = true;
    setTimeout(() => { if (!p.classList.contains('is-ouvert')) p.hidden = true; }, vite || reduit ? 0 : 650);
    marquer(null);
    adresse('');
    signaler();
    if (retour && retour.isConnected) retour.focus({ preventScroll: true });
  };

  const ouvrir = (p, cible) => {
    if (ouvert === p) { descendre(p, cible); return; }
    if (ouvert) fermer(true);
    else retour = document.activeElement;
    ouvert = p;
    if (p.dataset.scripts) charger(p);
    p.hidden = false;
    p.inert = false;
    const defile = p.querySelector('.panneau-defile');
    defile.scrollTop = 0;
    document.body.classList.add('panneau-ouvert');
    marquer(p.id);
    adresse(cible && cible !== p ? cible.id : p.id);
    requestAnimationFrame(() => {
      p.classList.add('is-ouvert');
      // le contenu était caché : ce qui se mesure (la planche, l'histoire) se recalcule
      window.dispatchEvent(new Event('resize'));
      signaler();
      descendre(p, cible);
      defile.focus({ preventScroll: true });
    });
  };

  const charger = p => {
    const liste = p.dataset.scripts.split(/\s+/).filter(Boolean);
    delete p.dataset.scripts;
    liste.reduce((suite, src) => suite.then(() => new Promise(fini => {
      const s = document.createElement('script');
      s.src = src; s.onload = s.onerror = fini;
      document.body.appendChild(s);
    })), Promise.resolve());
  };

  const descendre = (p, cible) => {
    if (!cible || cible === p) return;
    const defile = p.querySelector('.panneau-defile');
    const haut = cible.getBoundingClientRect().top - defile.getBoundingClientRect().top + defile.scrollTop - 70;
    defile.scrollTo({ top: Math.max(0, haut), behavior: reduit ? 'auto' : 'smooth' });
  };

  // Une ancre : un panneau, ce qu'il contient, ou les portes
  const aller = id => {
    id = ALIAS[id] || id;
    if (!id || id === 'accueil') { fermer(); return true; }
    if (id === 'test') return false;                       // quiz.js s'en charge ([data-ouvrir-test])
    const cible = document.getElementById(id);
    const p = cible && (cible.matches('[data-panneau]') ? cible : cible.closest('[data-panneau]'));
    if (!p) return false;
    ouvrir(p, cible);
    return true;
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-ouvrir-test') || e.metaKey || e.ctrlKey) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    // l'onglet ouvert se referme si on le reclique
    if (a.closest('.onglets') && ouvert && ouvert.id === id) { e.preventDefault(); fermer(); return; }
    if (aller(id)) e.preventDefault();
  });
  // le logo de l'en-tête ramène aux portes
  const logo = document.querySelector('.site-header > .wordmark');
  if (logo) logo.addEventListener('click', e => { if (ouvert) { e.preventDefault(); fermer(); } });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !ouvert) return;
    const voile = document.querySelector('.test-voile');
    if (document.body.classList.contains('menu-ouvert') || (voile && !voile.hidden)) return;
    fermer();
  });
  // le test choisit une porte : on revient aux portes, que vitrine.js ouvre
  document.addEventListener('miailhe:porte', () => fermer(true));
  document.addEventListener('miailhe:test', () => marquer('test'));
  document.addEventListener('click', e => { if (e.target.closest('[data-fermer-test]')) setTimeout(() => marquer(ouvert ? ouvert.id : null), 0); });

  panneaux.forEach(p => { p.inert = true; });
  // arrivée sur une adresse avec ancre : on l'ouvre une fois entré (porte d'âge, intro)
  const depart = decodeURIComponent(location.hash.slice(1));
  if (depart) (M.quandEntre || (fn => fn()))(() => setTimeout(() => {
    if (depart === 'test' || depart === 'quiz') { const b = document.querySelector('.seuil-consigne [data-ouvrir-test]'); if (b) b.click(); }
    else aller(depart);
  }, 300));
  window.addEventListener('hashchange', () => aller(decodeURIComponent(location.hash.slice(1))));
})();
