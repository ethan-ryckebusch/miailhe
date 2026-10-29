/* L'Enquête « La page arrachée » : couverture, prologue, tableau des trois témoins, page à remettre dans l'ordre.
   Chaque réponse se trouve dans l'histoire réelle du château, sur son site (section #temoin).
   La progression reste dans le navigateur (localStorage), rien n'est envoyé. */
(function () {
  const M = window.MIAILHE || {};
  const CLE = 'miailhe-enquete';
  const lire = () => { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { return {}; } };
  const ecrire = () => { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { /* stockage indisponible */ } };
  let etat = Object.assign({ nom: '', resolus: [], code: '', fini: false, date: '' }, lire());

  // Les réponses sont comparées sans accents, sans ponctuation ni articles
  const nettoyer = v => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\b(un|une|le|la|les|l|d|de|des)\b/g, ' ').replace(/\s+/g, '');
  const chiffres = v => v.replace(/\D/g, '');

  const TEMOINS = {
    coufran: {
      ref: 'Témoin n° 1 · Château Coufran', nom: 'Louis', role: 'Le grand-père · arrivé en 1924',
      photo: 'assets/img/coufran-pigeonnier.jpg', alt: 'Le pigeonnier de Coufran au milieu des vignes',
      deposition: 'Quand j\'ai acheté Couffran, en 1924, le vin ne se vendait plus. Ici, tout le monde ne jurait que par le cabernet. Moi, j\'ai regardé la terre, et j\'ai tout arraché pour replanter en merlot, comme à Pomerol. On m\'a pris pour un fou. Mon morceau de page, je l\'ai rangé avec ce qui ne change jamais chez moi : la part de merlot dans mes vignes. Cent ans plus tard, elle n\'a pas bougé.',
      question: 'Quelle part du vignoble Louis a-t-il donnée au merlot ? (en %)',
      juste: v => chiffres(v) === '85',
      erreur: '« Non. Je ne le répéterai pas deux fois : allez voir à Coufran. »',
      indice: 'Louis ne le dit pas, mais le site de Coufran l\'écrit en grand, là où il parle de son vin.',
      lien: 'coufran/index.html#temoin', lienTexte: 'Aller à Coufran', morceau: 'RA', signature: 'Louis',
    },
    verdignan: {
      ref: 'Témoin n° 2 · Château Verdignan', nom: 'Jean', role: 'Le père · arrivé en 1972',
      photo: 'assets/img/verdignan-hero.jpg', alt: 'Le château Verdignan et sa tour à flèche, vus du ciel',
      deposition: 'Mon père m\'a appris à goûter avant de m\'apprendre à planter. J\'ai été le dernier courtier de la famille. J\'ai arrêté en 1970 et, deux ans plus tard, j\'ai acheté Verdignan, le voisin. Ici, rien ne se presse. La plus vieille porte du cuvier porte une date gravée dans la pierre, bien avant nous. J\'ai glissé mon morceau derrière ce linteau : le cadenas s\'ouvre avec cette date.',
      question: 'Quelle date est gravée sur le linteau de la plus vieille porte du cuvier ?',
      juste: v => chiffres(v) === '1720',
      erreur: '« Pas si vite. Cette porte est bien plus vieille que la famille. »',
      indice: 'Jean est un homme de tradition : la date figure dans l\'histoire du château, sur le site de Verdignan.',
      lien: 'verdignan/index.html#temoin', lienTexte: 'Aller à Verdignan', morceau: 'CI', signature: 'Jean',
    },
    soudars: {
      ref: 'Témoin n° 3 · Château Soudars', nom: 'Éric', role: 'Le fils · arrivé en 1973',
      photo: 'assets/img/soudars-vieux-ceps.jpg', alt: 'Vieux ceps tortueux de Soudars',
      deposition: 'En 1973, tout le monde m\'a dit que les grands vins du Médoc ne naissaient que sur les graves. J\'ai acheté quinze hectares de friches, de pierres et de ronces, sur de l\'argile et du calcaire. On a tout épierré à la main. Avec ces pierres, on aurait pu bâtir des murs, et c\'est d\'ailleurs de là que vient le nom du domaine : un vieux mot pour un mur de pierres sèches autour des bêtes. Dites-moi ce mot en français d\'aujourd\'hui, et mon morceau est à vous.',
      question: 'Que désignait le vieux mot « soudar » ? (un seul mot)',
      juste: v => nettoyer(v).includes('enclos'),
      erreur: '« Presque ! Mais ce n\'est pas le mot. Passez à Soudars, je vous montrerai les pierres. »',
      indice: 'Éric raconte l\'origine du nom sur le site de Soudars, là où il explique pourquoi le domaine n\'a pas de château.',
      lien: 'soudars/index.html#temoin', lienTexte: 'Aller à Soudars', morceau: 'NE', signature: 'Éric',
    },
  };
  const ORDRE = ['coufran', 'verdignan', 'soudars'];

  /* ---------- Navigation entre les étapes ---------- */
  const etapes = [...document.querySelectorAll('.etape')];
  const aller = (nom, defiler = true) => {
    document.body.dataset.etape = nom;
    etapes.forEach(e => { e.hidden = e.dataset.pour !== nom; });
    if (defiler) window.scrollTo({ top: 0, behavior: 'auto' });
    if (nom === 'tableau') requestAnimationFrame(tracerFils);
    if (nom === 'final') preparerAssemblage();
    if (nom === 'fin') remplirFin();
  };
  document.querySelectorAll('[data-aller]').forEach(b => b.addEventListener('click', () => aller(b.dataset.aller)));

  const majNom = () => {
    const n = etat.nom.trim();
    document.querySelectorAll('[data-enqueteur]').forEach(el => {
      el.textContent = n || (el.classList.contains('cert-nom') ? 'Enquêteur anonyme' : el.closest('.lettre-lovely') ? 'à vous' : 'anonyme');
    });
  };

  /* ---------- 1. Couverture ---------- */
  const formNom = document.querySelector('[data-form="nom"]');
  formNom.nom.value = etat.nom;
  formNom.addEventListener('submit', e => {
    e.preventDefault();
    etat.nom = formNom.nom.value.trim().slice(0, 40);
    ecrire(); majNom();
    aller(etat.resolus.length ? 'tableau' : 'prologue');
  });

  /* ---------- 3. Tableau ---------- */
  const tableau = document.querySelector('.tableau');
  const svgFils = document.querySelector('.fils');
  function tracerFils() {
    if (!tableau || document.body.dataset.etape !== 'tableau') return;
    const r0 = tableau.getBoundingClientRect();
    const page = document.querySelector('.page-centrale').getBoundingClientRect();
    const cx = page.left + page.width / 2 - r0.left, cy = page.top + 18 - r0.top;
    svgFils.setAttribute('viewBox', `0 0 ${r0.width} ${r0.height}`);
    svgFils.innerHTML = ORDRE.map(id => {
      const f = document.querySelector(`.fiche--${id} .punaise`).getBoundingClientRect();
      const x = f.left + f.width / 2 - r0.left, y = f.top + f.height / 2 - r0.top;
      const mx = (x + cx) / 2, my = Math.max(y, cy) + 40; // le fil pend un peu
      return `<path class="${etat.resolus.includes(id) ? 'tendu' : ''}" d="M${x.toFixed(1)} ${y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)}"/>`;
    }).join('');
  }
  window.addEventListener('resize', tracerFils);

  const majTableau = () => {
    ORDRE.forEach(id => {
      const ok = etat.resolus.includes(id);
      const fiche = document.querySelector(`.fiche--${id}`);
      fiche.classList.toggle('is-resolu', ok);
      fiche.querySelector('.statut').textContent = ok ? 'Témoignage vérifié' : 'À interroger';
      const m = document.querySelector(`.page-centrale [data-morceau="${id}"]`);
      m.classList.toggle('is-trouve', ok);
      m.querySelector('b').textContent = ok ? TEMOINS[id].morceau : '?';
    });
    const n = etat.resolus.length;
    document.querySelector('[data-compte]').textContent = n;
    document.querySelector('[data-pluriel]').textContent = n > 1 ? 's' : '';
    document.querySelector('.reconstituer').disabled = n < 3;
    tracerFils();
  };

  /* ---------- Interrogatoire ---------- */
  const modale = document.querySelector('.interrogatoire');
  const form = modale.querySelector('[data-form="reponse"]');
  let courant = null, declencheur = null;
  const ouvrir = (id, bouton) => {
    const t = TEMOINS[id]; courant = id; declencheur = bouton;
    modale.className = `interrogatoire interrogatoire--${id}`;
    modale.querySelector('.interro-photo img').src = t.photo;
    modale.querySelector('.interro-photo img').alt = t.alt;
    modale.querySelector('.interro-ref').textContent = t.ref;
    modale.querySelector('#interro-nom').textContent = t.nom;
    modale.querySelector('.interro-role').textContent = t.role;
    modale.querySelector('.deposition').textContent = `« ${t.deposition} »`;
    modale.querySelector('.question').textContent = t.question;
    modale.querySelector('.indice-texte').textContent = t.indice;
    const lien = modale.querySelector('.indice-lien'); lien.href = t.lien; lien.textContent = t.lienTexte;
    modale.querySelector('.indice').open = false;
    form.reponse.value = '';
    form.querySelector('.retour').textContent = '';
    const deja = etat.resolus.includes(id);
    form.hidden = deja;
    modale.querySelector('.indice').hidden = deja;
    montrerMorceau(deja);
    modale.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => { modale.classList.add('is-ouverte'); (deja ? modale.querySelector('.morceau-trouve .btn') : form.reponse).focus(); });
  };
  const fermer = () => {
    modale.classList.remove('is-ouverte');
    document.body.classList.remove('is-locked');
    setTimeout(() => { modale.hidden = true; }, M.reduceMotion ? 0 : 400);
    if (declencheur) declencheur.focus();
    majTableau();
    if (etat.resolus.length === 3 && !etat.fini) document.querySelector('.reconstituer').focus();
  };
  const montrerMorceau = vrai => {
    const bloc = modale.querySelector('.morceau-trouve');
    bloc.hidden = !vrai;
    if (vrai) {
      bloc.querySelector('.qui').textContent = TEMOINS[courant].nom;
      bloc.querySelector('b').textContent = TEMOINS[courant].morceau;
    }
  };
  document.querySelectorAll('[data-temoin]').forEach(b => b.addEventListener('click', () => ouvrir(b.dataset.temoin, b)));
  modale.querySelectorAll('[data-fermer]').forEach(b => b.addEventListener('click', fermer));
  modale.addEventListener('click', e => { if (e.target === modale) fermer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modale.hidden) fermer(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const t = TEMOINS[courant], retour = form.querySelector('.retour');
    if (t.juste(form.reponse.value)) {
      if (!etat.resolus.includes(courant)) etat.resolus.push(courant);
      ecrire();
      form.hidden = true; modale.querySelector('.indice').hidden = true;
      montrerMorceau(true);
      modale.querySelector('.morceau-trouve .btn').focus();
    } else {
      retour.textContent = t.erreur;
      form.classList.remove('is-faux'); void form.offsetWidth; form.classList.add('is-faux');
    }
  });

  /* ---------- 4. Remettre la page dans l'ordre ---------- */
  const paquet = document.querySelector('.paquet');
  const cases = [...document.querySelectorAll('.case')];
  const retourFinal = document.querySelector('.assemblage .retour');
  let poses = [];
  function preparerAssemblage() {
    poses = [];
    cases.forEach(c => { c.innerHTML = ''; c.classList.remove('is-pleine'); });
    retourFinal.textContent = '';
    // Les morceaux arrivent mélangés, mais jamais déjà dans le bon ordre
    let melange = [...ORDRE];
    do { melange.sort(() => Math.random() - .5); } while (melange.join() === ORDRE.join());
    paquet.innerHTML = melange.map(id => `<button class="morceau-carte morceau-carte--${id}" type="button" data-id="${id}"><b>${TEMOINS[id].morceau}</b><span>${TEMOINS[id].signature}</span></button>`).join('');
    paquet.querySelectorAll('button').forEach(b => b.addEventListener('click', () => poser(b)));
  }
  function poser(b) {
    if (poses.length >= 3) return;
    const c = cases[poses.length];
    poses.push(b.dataset.id);
    c.appendChild(b); c.classList.add('is-pleine'); b.disabled = true;
    if (poses.length < 3) return;
    if (poses.join() === ORDRE.join()) {
      retourFinal.textContent = 'R A C I N E';
      document.querySelector('.assemblage').classList.add('is-juste');
      etat.fini = true;
      if (!etat.code) etat.code = 'RACINE-1793-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      if (!etat.date) etat.date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      ecrire();
      setTimeout(() => aller('fin'), M.reduceMotion ? 300 : 2200);
    } else {
      retourFinal.textContent = '« Ce n\'est pas l\'ordre de la famille. Qui est arrivé le premier ? »';
      document.querySelector('.assemblage').classList.add('is-faux');
      setTimeout(() => { document.querySelector('.assemblage').classList.remove('is-faux'); preparerAssemblage(); retourFinal.textContent = '« Ce n\'est pas l\'ordre de la famille. Qui est arrivé le premier ? »'; }, 1400);
    }
  }
  document.querySelector('[data-vider]').addEventListener('click', preparerAssemblage);

  /* ---------- 5. Fin ---------- */
  function remplirFin() {
    majNom();
    document.querySelector('[data-code]').textContent = etat.code;
    document.querySelector('[data-date]').textContent = etat.date ? `Saint-Seurin-de-Cadourne, le ${etat.date}` : '';
  }
  document.querySelector('[data-recommencer]').addEventListener('click', () => {
    etat = { nom: etat.nom, resolus: [], code: '', fini: false, date: '' };
    ecrire(); majTableau();
    document.querySelector('.assemblage').classList.remove('is-juste');
    aller('couverture');
  });

  /* ---------- Démarrage ---------- */
  majNom(); majTableau();
  const depart = location.hash.slice(1);
  if (etat.fini) aller('fin', false);
  else if (['prologue', 'tableau'].includes(depart)) aller(depart, false);
  else if (etat.resolus.length) aller('tableau', false);
  else aller('couverture', false);
})();
