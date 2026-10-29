/* L'Enquête à la racine : un livret de six étapes. Chaque étape résolue donne une lettre ; les six forment FRICHE,
   le mot de passe du dernier dossier, l'opération « Éric – Fils » (troisième version, 28/10/2026, déroulé de l'équipe :
   six Soudars 2018 ont quitté le chai pour faire entrer Soudars dans de nouveaux points de vente, les caves V and B).
   Chaque étape a trois indices, à révéler un par un (difficile, plus facile, presque la réponse).
   Deux façons de jouer (27/10/2026) :
   - avec inscription (prénom, e-mail, règlement accepté) : la partie est sauvegardée, ne recule jamais (un second
     onglet ne peut pas effacer une lettre gagnée), se reprend avec son e-mail, et l'enquête résolue participe au
     tirage au sort du trimestre ; c'est aussi la base de contacts de la famille (nouvelles seulement si on l'accepte) ;
   - sans inscription : on joue tout de suite, rien n'est gardé ; on peut s'inscrire à la fin pour que la victoire compte.
   Maquette : aucune donnée n'est envoyée ; les « comptes » vivent dans ce navigateur (localStorage). */
(function () {
  const M = window.MIAILHE || {};
  const reduit = !!M.reduceMotion;
  // une phrase qui contient un nom ou un mot du joueur : traduite avec ses {0}, {1}… (langue.js)
  const T = (s, ...v) => (M.tf ? M.tf(s, v) : s.replace(/\{(\d+)\}/g, (m, i) => v[i] ?? ''));
  const CLE = 'miailhe-enquete-racine';          // la partie en cours, si l'on est inscrit
  const COMPTES = 'miailhe-enquete-comptes';     // maquette : les parties des inscrits, par e-mail (sur un serveur en vrai)
  const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const livret = document.querySelector('.livret');
  const planches = [...document.querySelectorAll('.planche')];
  const DERNIERE = planches.length - 1;

  // L'état lu est toujours borné : une partie ancienne ou modifiée à la main ne peut pas casser le livret
  const propre = s => {
    const lettres = {};
    Object.entries((s && s.lettres) || {}).forEach(([k, v]) => { if (/^[1-6]$/.test(k) && planches[+k] && v === planches[+k].dataset.lettre) lettres[k] = v; });
    const indices = {};
    Object.entries((s && s.indices) || {}).forEach(([k, v]) => { if (/^[1-6]$/.test(k)) indices[k] = Math.max(0, Math.min(3, parseInt(v, 10) || 0)); });
    const max = Math.max(0, Math.min(DERNIERE, parseInt(s && s.max, 10) || 0));
    const i = s && s.inscrit;
    const inscrit = i && typeof i.mail === 'string' && MAIL.test(i.mail)
      ? { prenom: String(i.prenom || '').slice(0, 40), mail: i.mail.toLowerCase().slice(0, 120), nouvelles: !!i.nouvelles, date: String(i.date || '').slice(0, 10) } : null;
    return {
      planche: Math.max(0, Math.min(DERNIERE, parseInt(s && s.planche, 10) || 0)),
      max: Math.max(max, ...Object.keys(lettres).map(k => Math.min(DERNIERE, +k + 1)), 0),
      lettres, indices, nom: typeof (s && s.nom) === 'string' ? s.nom.slice(0, 40) : '',
      inscrit, resolue: typeof (s && s.resolue) === 'string' ? s.resolue.slice(0, 10) : '',
    };
  };
  const lire = () => { try { return propre(JSON.parse(localStorage.getItem(CLE)) || {}); } catch (e) { return propre({}); } };
  const lireComptes = () => { try { return JSON.parse(localStorage.getItem(COMPTES)) || {}; } catch (e) { return {}; } };
  // Seule la partie d'un inscrit est gardée : une partie sans inscription, ou d'avant l'inscription, repart de zéro
  const garde = lire();
  const etat = garde.inscrit ? garde : propre({});
  const memeCompte = s => !!(s.inscrit && etat.inscrit && s.inscrit.mail === etat.inscrit.mail);
  // On écrit en fusionnant avec ce qui est déjà gardé pour ce compte : les lettres et les indices s'additionnent,
  // l'avancée ne recule pas. Sans inscription, on n'écrit rien.
  const ecrire = () => {
    if (!etat.inscrit) return;
    const s = lire();
    if (memeCompte(s)) {
      etat.lettres = Object.assign({}, s.lettres, etat.lettres);
      Object.keys(s.indices).forEach(k => { etat.indices[k] = Math.max(etat.indices[k] || 0, s.indices[k]); });
      etat.max = Math.max(etat.max, s.max);
      if (!etat.nom && s.nom) etat.nom = s.nom;
      if (!etat.resolue && s.resolue) etat.resolue = s.resolue;
    }
    try {
      localStorage.setItem(CLE, JSON.stringify(etat));
      const c = lireComptes(); c[etat.inscrit.mail] = etat; localStorage.setItem(COMPTES, JSON.stringify(c));
    } catch (e) { /* stockage indisponible */ }
  };
  // Le trimestre en cours, et la date de fin (le tirage a lieu dans les quinze jours qui suivent)
  const maintenant = new Date();
  const q = Math.floor(maintenant.getMonth() / 3) + 1;
  const TRIMESTRE = q === 1 ? T('1er trimestre {0}', maintenant.getFullYear()) : T('{1}e trimestre {0}', maintenant.getFullYear(), q);
  const FIN = new Date(maintenant.getFullYear(), q * 3, 0).toLocaleDateString({ en: 'en-GB', ja: 'ja-JP' }[M.langue] || 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const carnet = document.querySelectorAll('.progression-lettres li');
  const precedent = document.querySelector('[data-precedent]');
  const avancer = document.querySelector('[data-avancer]');
  const tourne = window.matchMedia('(min-width: 901px)');
  let actuelle = 0, enCours = false;

  /* ---------- Nom de l'enquêteur ---------- */
  const afficherNom = () => document.querySelectorAll('[data-enqueteur]').forEach(el => { el.textContent = etat.nom || T('enquêteur'); });
  afficherNom();

  /* ---------- Carnet et flèches ---------- */
  const majCarnet = () => {
    carnet.forEach(li => {
      const k = li.dataset.etape, l = etat.lettres[k];
      li.classList.toggle('is-trouvee', !!l);
      li.classList.toggle('is-ici', +k === actuelle);
      li.querySelector('span').textContent = l || '·';
    });
    precedent.disabled = actuelle === 0;
    avancer.disabled = actuelle >= etat.max || actuelle === DERNIERE;
  };

  /* ---------- La page qui se tourne ---------- */
  const copie = (page, classe) => {
    const c = page.cloneNode(true);
    // cloneNode ne recopie pas ce que le joueur a saisi : on reporte les valeurs pour que rien ne s'efface pendant le geste
    const src = page.querySelectorAll('input, select'), dst = c.querySelectorAll('input, select');
    src.forEach((x, i) => { if (x.type === 'radio' || x.type === 'checkbox') dst[i].checked = x.checked; else dst[i].value = x.value; });
    c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
    c.querySelectorAll('[name]').forEach(x => x.removeAttribute('name'));
    c.removeAttribute('aria-labelledby');
    c.setAttribute('aria-hidden', 'true');
    if (classe) c.classList.add(classe);
    return c;
  };
  const aller = n => {
    n = Math.max(0, Math.min(DERNIERE, n));
    if (n === actuelle || enCours) return;
    const ancien = planches[actuelle], nouveau = planches[n];
    const avant = n > actuelle;
    const tourner = tourne.matches && !reduit;
    if (tourner) {
      enCours = true;
      livret.classList.add('is-tourne');      // aucun clic ne traverse le livret pendant le geste
      const feuille = document.createElement('div');
      feuille.className = 'feuille' + (avant ? '' : ' is-retour');
      const cache = document.createElement('div');
      cache.className = 'cache';
      cache.style.left = avant ? '0' : '50%';
      const face = copie(ancien.querySelector(avant ? '.page--d' : '.page--g'));
      const dos = copie(nouveau.querySelector(avant ? '.page--g' : '.page--d'), 'feuille-dos');
      const reste = copie(ancien.querySelector(avant ? '.page--g' : '.page--d'));
      reste.style.cssText = 'position:absolute;inset:0';
      cache.append(reste);
      feuille.append(face, dos);
      livret.append(cache, feuille);
      requestAnimationFrame(() => feuille.classList.add('is-tourne'));
      feuille.addEventListener('animationend', e => {
        if (e.target !== feuille) return;
        feuille.remove(); cache.remove(); enCours = false; livret.classList.remove('is-tourne');
      });
    }
    ancien.classList.remove('is-active');
    nouveau.classList.add('is-active');
    actuelle = n; etat.planche = n; ecrire(); majCarnet();
    // le livret prend la hauteur de sa page : on remonte en haut du dossier, et l'on annonce la nouvelle étape
    const dossier = document.getElementById('dossier');
    if (!tourne.matches || dossier.getBoundingClientRect().top < -8) dossier.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth' });
    const titre = nouveau.querySelector('h1, h2');
    if (titre) { titre.setAttribute('tabindex', '-1'); setTimeout(() => titre.focus({ preventScroll: true }), tourner ? 1150 : 50); }
  };
  precedent.addEventListener('click', () => aller(actuelle - 1));
  avancer.addEventListener('click', () => aller(actuelle + 1));
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, select, textarea')) return;
    if (e.key === 'ArrowRight' && !avancer.disabled) aller(actuelle + 1);
    if (e.key === 'ArrowLeft' && !precedent.disabled) aller(actuelle - 1);
  });
  document.querySelectorAll('[data-suivant]').forEach(b => b.addEventListener('click', () => aller(actuelle + 1)));
  document.querySelector('[data-vers-livret]').addEventListener('click', () => document.getElementById('dossier').scrollIntoView({ behavior: reduit ? 'auto' : 'smooth' }));

  /* ---------- L'inscription, ou le jeu sans inscription ---------- */
  const depart = document.querySelector('[data-commencer]');
  const radios = [...document.querySelectorAll('.inscription-choix input')];
  const statut = document.querySelector('[data-statut]');
  const mode = () => (radios.find(r => r.checked) || {}).value || 'inscrit';
  const majMode = () => {
    const ins = mode() === 'inscrit';
    depart.querySelectorAll('[data-si-inscrit]').forEach(el => { el.hidden = !ins; el.querySelectorAll('input').forEach(x => { x.disabled = !ins; }); });
    depart.querySelectorAll('[data-si-invite]').forEach(el => { el.hidden = ins; });
    const b = depart.querySelector('button[type="submit"]');
    b.textContent = ins ? b.dataset.libelleInscrit : b.dataset.libelleInvite;
    depart.querySelector('.retour').textContent = '';
  };
  radios.forEach(r => r.addEventListener('change', majMode));
  const majStatut = () => {
    if (!statut) return;
    const ok = !!etat.inscrit;
    statut.hidden = !ok && !etat.max;      // rien à signaler avant d'avoir ouvert le dossier
    statut.textContent = ok ? 'Partie sauvegardée' : 'Sans sauvegarde';
    statut.classList.toggle('is-sauvee', ok);
    statut.title = ok ? `Inscrit : ${etat.inscrit.mail}` : 'Sans inscription, la partie recommence si vous fermez la page';
  };
  const erreur = (form, texte, champ) => {
    const r = form.querySelector('.retour');
    r.textContent = texte; r.classList.remove('is-ok');
    if (champ) champ.focus();
  };
  depart.addEventListener('submit', e => {
    e.preventDefault();
    const f = depart.elements, nom = f.nom.value.trim().slice(0, 40);
    if (!nom) return erreur(depart, 'Indiquez votre prénom pour ouvrir le dossier.', f.nom);
    if (mode() === 'inscrit') {
      const mail = f.mail.value.trim().toLowerCase();
      if (!MAIL.test(mail)) return erreur(depart, 'Cette adresse e-mail ne semble pas complète.', f.mail);
      if (!f.reglement.checked) return erreur(depart, 'Cochez la case du règlement pour vous inscrire, ou jouez sans inscription.', f.reglement);
      // déjà inscrit avec cette adresse : on reprend sa partie plutôt que de l'écraser
      const ancien = lireComptes()[mail];
      if (ancien && propre(ancien).inscrit && Object.keys(propre(ancien).lettres).length && !Object.keys(etat.lettres).length) {
        try { localStorage.setItem(CLE, JSON.stringify(propre(ancien))); } catch (err) { /* stockage indisponible */ }
        location.hash = 'dossier'; location.reload(); return;
      }
      etat.inscrit = { prenom: nom, mail, nouvelles: f.nouvelles.checked, date: new Date().toISOString().slice(0, 10) };
    } else etat.inscrit = null;
    etat.nom = nom;
    etat.max = Math.max(etat.max, 1);
    ecrire(); afficherNom(); majStatut(); majRecompense(); aller(1);
  });
  // Reprendre une partie avec son e-mail
  const reprise = document.querySelector('[data-reprise]');
  reprise.addEventListener('submit', e => {
    e.preventDefault();
    const mail = reprise.elements.mail.value.trim().toLowerCase();
    if (!MAIL.test(mail)) return erreur(reprise, 'Cette adresse e-mail ne semble pas complète.', reprise.elements.mail);
    const ancien = lireComptes()[mail];
    if (!ancien || !propre(ancien).inscrit) return erreur(reprise, "Aucune enquête n'est enregistrée à cette adresse sur ce navigateur. Inscrivez-vous pour commencer.");
    try { localStorage.setItem(CLE, JSON.stringify(propre(ancien))); } catch (err) { /* stockage indisponible */ }
    const r = reprise.querySelector('.retour'); r.textContent = 'Partie retrouvée : le dossier se rouvre.'; r.classList.add('is-ok');
    setTimeout(() => { location.hash = 'dossier'; location.reload(); }, 600);
  });
  // Sans inscription, on prévient avant de quitter une enquête commencée
  window.addEventListener('beforeunload', e => {
    if (!etat.inscrit && Object.keys(etat.lettres).length && !etat.lettres[6]) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- Messages ---------- */
  const dire = (zone, texte, ok) => {
    const r = zone.querySelector('.retour');
    r.textContent = texte; r.classList.toggle('is-ok', !!ok);
    if (!ok && !reduit) { zone.classList.remove('is-faux'); void zone.offsetWidth; zone.classList.add('is-faux'); }
  };
  // « 1 information sur 4 est juste », « 2 informations sur 4 sont justes », « Aucune information n'est juste »
  const compte = (n, total, nom, verbeSing, verbePlur, aucune) => (n === 0 ? aucune
    : `${n} ${nom}${n > 1 ? 's' : ''} sur ${total} ${n > 1 ? verbePlur : verbeSing}`);
  const liste = noms => (noms.length < 2 ? noms.join('') : T('{0} et {1}', noms.slice(0, -1).join(', '), noms[noms.length - 1]));

  /* ---------- Les indices : trois par étape, révélés un par un ---------- */
  // Le bouton « + » reste sous le dernier indice ouvert : chaque clic en demande un nouveau, plus facile
  const NIVEAUX = ['Un indice', 'Un indice plus facile', 'Le dernier indice, presque la réponse'];
  const montrerIndices = (bloc, n) => {
    const items = bloc.querySelectorAll('li');
    items.forEach((li, i) => { li.hidden = i >= n; });
    const b = bloc.querySelector('.indices-bouton');
    b.hidden = n >= items.length;
    b.innerHTML = `<span class="indices-plus" aria-hidden="true">+</span><span>${NIVEAUX[Math.min(n, NIVEAUX.length - 1)]}</span><small>${Math.min(n + 1, items.length)} sur ${items.length}</small>`;
    b.setAttribute('aria-label', `${NIVEAUX[Math.min(n, NIVEAUX.length - 1)]}, indice ${Math.min(n + 1, items.length)} sur ${items.length}`);
  };
  document.querySelectorAll('[data-indices]').forEach(bloc => {
    const k = bloc.dataset.indices;
    montrerIndices(bloc, etat.indices[k] || 0);
    bloc.querySelector('.indices-bouton').addEventListener('click', () => {
      etat.indices[k] = Math.min(3, (etat.indices[k] || 0) + 1);
      ecrire(); montrerIndices(bloc, etat.indices[k]);
      const li = bloc.querySelectorAll('li')[etat.indices[k] - 1];
      if (li) { li.setAttribute('tabindex', '-1'); li.focus({ preventScroll: true }); li.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'nearest' }); }
    });
  });

  /* ---------- Les réponses ---------- */
  const ARBRE = { louis: ['1924', 'Coufran'], jean: ['1976', 'Verdignan'], eric: ['1980', 'Soudars'] };
  const MOT = 'FRICHE';

  /* ---------- Résoudre une étape ---------- */
  // Une étape résolue montre sa solution (même après un rechargement) et ses contrôles sont désactivés
  const SOLUTIONS = {
    1: p => { const f = p.querySelector('[data-enigme="1"]'); f.chateau.value = 'soudars'; f.millesime.value = '2018'; f.total.value = '6'; },
    2: p => { const f = p.querySelector('[data-enigme="2"]'); Object.entries(ARBRE).forEach(([qui, [an, ch]]) => { f.elements[`a-${qui}`].value = an; f.elements[`c-${qui}`].value = ch; }); },
    3: p => {
      const z = p.querySelector('[data-enigme="3"]'), ol = z.querySelector('.ordre-choisi'), code = z.querySelectorAll('.code-cuverie li');
      const cartes = [...z.querySelectorAll('.cartes-ordre button')].sort((a, b) => a.dataset.rang - b.dataset.rang);
      ol.innerHTML = '';
      cartes.forEach((b, i) => { b.classList.add('is-pris'); ol.insertAdjacentHTML('beforeend', `<li translate="no">${b.textContent}</li>`); code[i].textContent = b.dataset.code; code[i].classList.add('is-pleine'); });
    },
    4: p => { const f = p.querySelector('[data-enigme="4"]'); Object.entries(ASSEMBLAGES).forEach(([ch, v]) => ['m', 'cs', 'cf'].forEach((c, i) => { f.elements[`${ch}-${c}`].value = v[i]; })); majTotaux(); },
    5: p => { const f = p.querySelector('[data-enigme="5"]'); f.querySelector('[value="dossier"]').checked = true; f.elements.qui.value = 'eric'; },
    6: p => { p.querySelectorAll('.cases-mot li').forEach((c, i) => { c.textContent = MOT[i]; c.classList.add('is-pleine'); }); p.querySelectorAll('.tuiles button').forEach(b => b.classList.add('is-pris')); },
  };
  const resoudre = (k, animer = true) => {
    const p = planches[k];
    p.classList.add('is-resolue');
    if (!animer && SOLUTIONS[k]) SOLUTIONS[k](p);
    p.querySelectorAll('.enigme :is(input, select, button:not([data-suivant]))').forEach(x => { x.disabled = true; });
    const gain = p.querySelector('.lettre-gagnee');
    if (gain) {
      gain.hidden = false;
      if (animer && !reduit) setTimeout(() => gain.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
    }
    etat.lettres[k] = p.dataset.lettre;
    etat.max = Math.max(etat.max, Math.min(DERNIERE, k + 1));
    if (k === 6 && !etat.resolue) etat.resolue = new Date().toISOString().slice(0, 10);
    ecrire(); majCarnet();
  };

  // 1 · Le signalement : l'inventaire attend douze Soudars 2018, le casier n'en garde qu'une rangée de six. Les deux
  //     trous du casier sont expliqués à la craie ; la rangée disparue, elle, ne laisse aucun trou.
  const f1 = document.querySelector('[data-enigme="1"]');
  f1.addEventListener('submit', e => {
    e.preventDefault();
    if (planches[1].classList.contains('is-resolue')) return;
    const v = f1.elements;
    const bons = [v.chateau.value === 'soudars', v.millesime.value === '2018', parseInt(v.total.value, 10) === 6];
    const n = bons.filter(Boolean).length;
    if (n === 3) { dire(f1, 'Signalement enregistré : six bouteilles de Soudars 2018, parties sans laisser de trou dans le casier.', true); resoudre(1); }
    else if (!v.chateau.value || !v.millesime.value || !v.total.value.trim()) dire(f1, 'Le signalement est incomplet : il manque encore des informations.');
    else dire(f1, `${compte(n, 3, 'information', 'est juste', 'sont justes', "Aucune information n'est juste")}. Comparez encore l'inventaire et le casier.`);
  });

  // 2 · L'arbre de la famille : pour chaque génération, l'année et le château
  const f2 = document.querySelector('[data-enigme="2"]');
  f2.addEventListener('submit', e => {
    e.preventDefault();
    if (planches[2].classList.contains('is-resolue')) return;
    let justes = 0, vides = 0;
    Object.entries(ARBRE).forEach(([qui, [an, ch]]) => {
      const a = f2.elements[`a-${qui}`].value, c = f2.elements[`c-${qui}`].value;
      if (!a || !c) vides++;
      if (a === an) justes++;
      if (c === ch) justes++;
    });
    if (justes === 6) { dire(f2, "L'arbre tient : Louis, puis Jean, puis Éric. Et le fils est le seul à être parti de rien.", true); resoudre(2); }
    else if (vides) dire(f2, 'Placez une année et un château pour chaque génération.');
    else dire(f2, `${compte(justes, 6, 'réponse', 'tient', 'tiennent', 'Aucune réponse ne tient')}. Relisez les archives.`);
  });

  // 3 · L'ordre de production : on touche les étapes dans l'ordre ; un faux pas, et tout est à refaire. Chaque carte
  //     bien placée se retourne et donne une lettre du code du registre de cuverie : SOUDARS.
  const z3 = document.querySelector('[data-enigme="3"]');
  const choisi = z3.querySelector('.ordre-choisi');
  const code3 = [...z3.querySelectorAll('.code-cuverie li')];
  const NB3 = z3.querySelectorAll('.cartes-ordre button').length;
  let attendu = 1, minuteur3 = 0;
  const reprendre3 = () => {
    clearTimeout(minuteur3); minuteur3 = 0; z3.classList.remove('is-bloque'); attendu = 1; choisi.innerHTML = '';
    z3.querySelectorAll('.cartes-ordre button').forEach(b => b.classList.remove('is-pris'));
    code3.forEach(c => { c.textContent = ''; c.classList.remove('is-pleine'); });
  };
  z3.querySelectorAll('.cartes-ordre button').forEach(b => b.addEventListener('click', () => {
    if (planches[3].classList.contains('is-resolue') || minuteur3 || b.classList.contains('is-pris')) return;
    if (+b.dataset.rang === attendu) {
      b.classList.add('is-pris');
      choisi.insertAdjacentHTML('beforeend', `<li translate="no">${b.textContent}</li>`);
      code3[attendu - 1].textContent = b.dataset.code; code3[attendu - 1].classList.add('is-pleine');
      attendu++;
      dire(z3, '', true);
      if (attendu > NB3) { dire(z3, "Code SOUDARS : le registre de cuverie s'ouvre. On assemble avant l'élevage en barriques : la fiche était fausse.", true); resoudre(3); }
    } else {
      dire(z3, attendu === 1 ? 'Tout commence dans la vigne.' : T('Pas encore « {0} ». Reprenons depuis le début.', b.textContent.trim()));
      z3.classList.add('is-bloque');
      minuteur3 = setTimeout(reprendre3, 900);
    }
  }));
  z3.querySelector('[data-reprendre]').addEventListener('click', () => { reprendre3(); dire(z3, '', true); });

  // 4 · Les vignobles : trois cépages qui font 100 %
  const f4 = document.querySelector('[data-enigme="4"]');
  const ASSEMBLAGES = { coufran: [85, 15, 0], verdignan: [30, 65, 5], soudars: [50, 49, 1] };
  const NOMS = { coufran: 'Coufran', verdignan: 'Verdignan', soudars: 'Soudars' };
  const valeurs = ch => ['m', 'cs', 'cf'].map(c => parseInt(f4.elements[`${ch}-${c}`].value, 10) || 0);
  const majTotaux = () => f4.querySelectorAll('.assemblage').forEach(fs => {
    const t = valeurs(fs.dataset.chateau).reduce((a, b) => a + b, 0);
    const out = fs.querySelector('.total');
    out.textContent = `${t} %`; out.classList.toggle('is-cent', t === 100);
  });
  f4.addEventListener('input', e => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); majTotaux(); });
  f4.addEventListener('submit', e => {
    e.preventDefault();
    if (planches[4].classList.contains('is-resolue')) return;
    const pasCent = Object.keys(ASSEMBLAGES).filter(ch => valeurs(ch).reduce((a, b) => a + b, 0) !== 100).map(ch => NOMS[ch]);
    if (pasCent.length) { dire(f4, T('Trois cépages font toujours 100 % : vérifiez {0}.', liste(pasCent))); return; }
    const faux = Object.entries(ASSEMBLAGES).filter(([ch, bon]) => valeurs(ch).some((v, i) => v !== bon[i])).map(([ch]) => NOMS[ch]);
    if (!faux.length) { dire(f4, 'Trois vignobles, trois caractères : le merlot de Louis, le cabernet de Jean, l\'équilibre d\'Éric.', true); resoudre(4); }
    else dire(f4, T('Les totaux sont bons, mais pas encore le vignoble de {0}.', liste(faux)));
  });

  // 5 · Le registre : où, et qui
  const f5 = document.querySelector('[data-enigme="5"]');
  f5.addEventListener('submit', e => {
    e.preventDefault();
    if (planches[5].classList.contains('is-resolue')) return;
    const ou = (f5.querySelector('[name="ou"]:checked') || {}).value, qui = f5.elements.qui.value;
    if (!ou || !qui) { dire(f5, 'Répondez aux deux questions.'); return; }
    if (ou === 'dossier' && qui === 'eric') { dire(f5, 'Six bouteilles de Soudars 2018, sorties le 7 par Éric, pour un dossier marqué « É.-F. ».', true); resoudre(5); }
    else if (ou === 'norvege') dire(f5, 'Fausse piste : la demi-palette de Norvège compte trois cents bouteilles, pas six.');
    else if (ou === 'salon') dire(f5, "Fausse piste : le salon a emporté deux Verdignan 2010, et la craie l'avait noté.");
    else if (ou === 'chai') dire(f5, 'Le registre dit le contraire : ces bouteilles sont sorties du chai.');
    else dire(f5, 'Le lieu est juste. Regardez le visa de la ligne du 07.');
  });

  // 6 · Le mot de passe du dossier « É.-F. » : les six lettres dans l'ordre
  const z6 = document.querySelector('[data-enigme="6"]');
  const cases = [...z6.querySelectorAll('.cases-mot li')];
  const tuiles = z6.querySelector('.tuiles');
  let mot = [], minuteur6 = 0;
  const MELANGE = ['H', 'E', 'R', 'C', 'F', 'I'];
  const reprendre6 = () => { clearTimeout(minuteur6); minuteur6 = 0; z6.classList.remove('is-bloque'); mot = []; cases.forEach(c => { c.textContent = ''; c.classList.remove('is-pleine'); }); tuiles.querySelectorAll('button').forEach(b => b.classList.remove('is-pris')); };
  tuiles.innerHTML = MELANGE.map((l, i) => `<button type="button" data-i="${i}" translate="no" aria-label="${T('Lettre {0}', l)}">${l}</button>`).join('');
  tuiles.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    if (planches[6].classList.contains('is-resolue') || minuteur6 || b.classList.contains('is-pris') || mot.length >= 6) return;
    b.classList.add('is-pris');
    mot.push(b.textContent);
    cases[mot.length - 1].textContent = b.textContent; cases[mot.length - 1].classList.add('is-pleine');
    if (mot.length === 6) {
      if (mot.join('') === MOT) { dire(z6, "FRICHE : la terre d'où Éric est parti, presque de rien. Le dossier s'ouvre.", true); resoudre(6); }
      else { dire(z6, T("« {0} » n'est pas le mot de passe. Essayez encore.", mot.join(''))); z6.classList.add('is-bloque'); minuteur6 = setTimeout(reprendre6, 1100); }
    }
  }));
  z6.querySelector('[data-reprendre]').addEventListener('click', () => { reprendre6(); dire(z6, '', true); });

  /* ---------- La récompense : l'accès à la vente privée ---------- */
  // Inscrit : la victoire est enregistrée pour le tirage. Sans inscription : on propose de s'inscrire pour qu'elle compte.
  const acces = document.querySelector('[data-acces]');
  const accesOk = document.querySelector('[data-acces-ok]');
  function majRecompense() {
    const ins = etat.inscrit;
    acces.hidden = !!ins; accesOk.hidden = !ins;
    if (ins) accesOk.textContent = T("C'est enregistré{0} : vous participez au tirage au sort du {1} (une bouteille offerte, tirage dans les quinze jours qui suivent le {2}). Votre accès à la vente privée arrive à {3}.",
      ins.prenom ? ', ' + ins.prenom : '', TRIMESTRE, FIN, ins.mail) + (ins.nouvelles ? ' ' + T('Vous recevrez aussi la prochaine enquête.') : '');
  }
  acces.addEventListener('submit', e => {
    e.preventDefault();
    const f = acces.elements, mail = f.mail.value.trim().toLowerCase();
    if (!MAIL.test(mail)) return erreur(acces, 'Cette adresse e-mail ne semble pas complète.', f.mail);
    if (!f.reglement.checked) return erreur(acces, 'Cochez la case du règlement pour enregistrer votre victoire.', f.reglement);
    etat.inscrit = { prenom: etat.nom, mail, nouvelles: f.nouvelles.checked, date: new Date().toISOString().slice(0, 10) };
    ecrire(); majStatut(); majRecompense();
    accesOk.setAttribute('tabindex', '-1'); accesOk.focus();
  });
  // Rejouer : l'inscrit garde son inscription, la partie repart de zéro
  document.querySelector('[data-recommencer]').addEventListener('click', () => {
    if (etat.inscrit) {
      const neuf = propre({ inscrit: etat.inscrit, nom: etat.nom });
      try {
        localStorage.setItem(CLE, JSON.stringify(neuf));
        const c = lireComptes(); c[etat.inscrit.mail] = neuf; localStorage.setItem(COMPTES, JSON.stringify(c));
      } catch (e) { /* stockage indisponible */ }
    } else etat.lettres = {};    // rien à effacer : on évite seulement l'avertissement de sortie
    location.href = location.pathname + '#dossier';
    location.reload();
  });

  /* ---------- Reprise d'une partie commencée ---------- */
  Object.keys(etat.lettres).forEach(k => resoudre(+k, false));
  if (etat.nom) document.getElementById('nom-enqueteur').value = etat.nom;
  if (etat.inscrit) { depart.elements.mail.value = etat.inscrit.mail; depart.elements.reglement.checked = true; depart.elements.nouvelles.checked = etat.inscrit.nouvelles; }
  majMode(); majStatut(); majRecompense();
  const reprendreA = Math.min(etat.planche, etat.max);
  if (reprendreA) { planches[0].classList.remove('is-active'); planches[reprendreA].classList.add('is-active'); actuelle = reprendreA; }
  // ?capture : ouvre directement une planche (?capture&planche=3) pour les aperçus
  const demandee = new URLSearchParams(location.search).get('planche');
  if (demandee !== null && M.capture) {
    planches[actuelle].classList.remove('is-active');
    actuelle = Math.max(0, Math.min(DERNIERE, parseInt(demandee, 10) || 0));
    planches[actuelle].classList.add('is-active');
  }
  majCarnet();

  // Les liens du menu : #inscription ramène à la lettre d'ouverture, #reglement déplie le règlement
  const suivreAncre = () => {
    if (location.hash === '#reglement') document.querySelector('#reglement details').open = true;
    if (location.hash === '#inscription') {
      if (actuelle !== 0) aller(0);
      setTimeout(() => document.getElementById('inscription').scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'center' }), actuelle === 0 ? 0 : 1200);
    }
  };
  window.addEventListener('hashchange', suivreAncre);
  document.querySelectorAll('a[href="#reglement"]').forEach(a => a.addEventListener('click', () => { document.querySelector('#reglement details').open = true; }));
  suivreAncre();

  // Une lettre gagnée dans un autre onglet arrive ici aussi
  window.addEventListener('storage', e => {
    if (e.key !== CLE) return;
    const s = lire();
    if (!memeCompte(s)) return;
    Object.keys(s.lettres).forEach(k => { if (!etat.lettres[k]) resoudre(+k, false); });
    etat.max = Math.max(etat.max, s.max);
    document.querySelectorAll('[data-indices]').forEach(bloc => {
      const k = bloc.dataset.indices;
      etat.indices[k] = Math.max(etat.indices[k] || 0, s.indices[k] || 0);
      montrerIndices(bloc, etat.indices[k]);
    });
    majCarnet();
  });
})();
