/* Comportements communs de la vitrine MIAILHE : âge légal, en-tête, menu plein écran, apparitions. */
(function () {
  const M = (window.MIAILHE = window.MIAILHE || {});
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } },
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } },
  };
  M.store = store;
  // ?capture : page entièrement révélée, sans porte d'âge (pour les captures d'écran de présentation)
  M.capture = new URLSearchParams(location.search).has('capture');
  if (M.capture) store.set('miailhe-age', 'ok');
  const reduceMotion = M.capture || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  M.reduceMotion = reduceMotion;
  if (M.capture) document.documentElement.classList.add('capture');

  /* ---------- Logo vectorisé (assets/js/logo.js) : le logotype seul dans l'en-tête, le logo complet ailleurs ---------- */
  const L = window.MIAILHE_LOGO;
  if (L) document.querySelectorAll('.wordmark').forEach(el => {
    const v = el.closest('.site-header') ? L.logotype : L.logo;
    el.insertAdjacentHTML('beforeend', `<svg class="logo-svg" viewBox="${v.viewBox}" aria-hidden="true" focusable="false"><g transform="${v.transform}" fill="currentColor"><path d="${v.d}"/></g></svg>`);
  });

  /* ---------- Âge légal ---------- */
  // L'entrée est un état, pas seulement un événement : un script chargé plus tard peut encore y réagir.
  M.entre = false;
  M.quandEntre = fn => { if (M.entre) fn(); else document.addEventListener('miailhe:entree', fn, { once: true }); };
  const signalerEntree = () => { M.entre = true; document.dispatchEvent(new CustomEvent('miailhe:entree')); };
  const gate = document.querySelector('.age-gate');
  const entrer = () => {
    store.set('miailhe-age', 'ok');
    session.set('miailhe-intro', 'vu');
    gate.classList.add('is-gone');
    document.body.classList.remove('is-locked');
    const entete = document.querySelector('.site-header');
    if (entete && !reduceMotion) entete.animate([{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'none' }],
      { duration: 800, delay: 400, easing: 'cubic-bezier(.2, .7, .1, 1)', fill: 'backwards' });
    setTimeout(signalerEntree, 300);
  };
  if (gate) {
    // L'intro et la porte d'âge se jouent une fois par visite (session), comme sur The Symphony of Vines.
    // Les pages sans intro (l'Enquête) ne redemandent pas l'âge à qui l'a déjà confirmé.
    const dejaVu = session.get('miailhe-intro') === 'vu' || (!gate.querySelector('.intro-ecran') && store.get('miailhe-age') === 'ok');
    if (M.capture || dejaVu) {
      gate.remove();
      requestAnimationFrame(signalerEntree);
    } else {
      document.body.classList.add('is-locked');
      (M.intro ? M.intro(gate) : Promise.resolve()).then(() => gate.classList.add('is-pret'));
      gate.querySelector('[data-entrer]').addEventListener('click', entrer);
      gate.querySelector('.refus').addEventListener('click', () => gate.classList.add('is-refused'));
    }
  } else {
    requestAnimationFrame(signalerEntree);
  }

  /* ---------- En-tête : couleur selon la section dessous ---------- */
  const header = document.querySelector('.site-header');
  const zones = [...document.querySelectorAll('[data-header]')];
  const logoPied = document.querySelector('.site-footer .wordmark');
  const majHeader = () => {
    if (!header) return;
    const y = header.offsetHeight / 2;
    const zone = zones.find(z => { const r = z.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    header.classList.toggle('on-dark', !!zone && zone.dataset.header === 'dark');
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    header.classList.toggle('cede-logo', !!logoPied && logoPied.getBoundingClientRect().top < header.offsetHeight + 24);
  };
  window.addEventListener('scroll', majHeader, { passive: true });
  window.addEventListener('resize', majHeader);
  majHeader();

  /* ---------- Menu plein écran (d'après Château Cheval Blanc) ---------- */
  const bouton = document.querySelector('.ouvrir-menu');
  const menu = document.querySelector('.mainnav');
  if (bouton && menu) {
    const mobile = window.matchMedia('(max-width: 900px)');
    const basculer = ouvert => {
      menu.classList.toggle('active', ouvert);
      header.classList.toggle('active', ouvert);
      document.body.classList.toggle('menu-ouvert', ouvert);
      bouton.setAttribute('aria-expanded', ouvert);
      bouton.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.setAttribute('aria-hidden', !ouvert);
      menu.inert = !ouvert;
      if (ouvert) menu.scrollTop = 0;
    };
    menu.inert = true;
    bouton.addEventListener('click', () => basculer(!menu.classList.contains('active')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('active')) { basculer(false); bouton.focus(); } });
    // Sur mobile, les grands titres déplient leurs sous-menus ; sur ordinateur, ils mènent à la première entrée
    menu.querySelectorAll('.menu-principal > li > a').forEach(a => a.addEventListener('click', e => {
      if (!mobile.matches) return;
      e.preventDefault();
      const li = a.parentElement, etait = li.classList.contains('active');
      menu.querySelectorAll('.menu-principal > li').forEach(x => x.classList.remove('active'));
      li.classList.toggle('active', !etait);
    }));
    menu.querySelectorAll('a:not(.menu-principal > li > a)').forEach(a => a.addEventListener('click', () => basculer(false)));
    menu.querySelectorAll('.menu-principal > li > a').forEach(a => a.addEventListener('click', () => { if (!mobile.matches) basculer(false); }));
  }

  /* ---------- Apparitions au défilement ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .08 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  const ioTrait = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-drawn'); ioTrait.unobserve(e.target); } });
  }, { threshold: .3 });
  M.quandEntre(() => {
    document.querySelectorAll('.vignette:not(.porte .vignette)').forEach(el => ioTrait.observe(el));
  });

  if (reduceMotion) document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
})();
