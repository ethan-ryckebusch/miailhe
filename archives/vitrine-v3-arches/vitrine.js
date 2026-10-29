/* La vitrine après l'entrée : les trois portes, la frise, le circuit « Quel Miailhe êtes-vous ? ».
   main.js gère l'âge légal, l'en-tête, le menu et les apparitions ; armoiries.js et millesimes.js fournissent les données. */
(function () {
  const M = window.MIAILHE || {};
  const page = document.querySelector('main.v');
  if (!page) return;
  const reduit = !!M.reduceMotion;
  // ?capture : la page entière est photographiée d'un coup, les images différées doivent être chargées
  if (M.capture) page.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
  const A = window.MIAILHE_ARMOIRIES;
  const armoirie = (cle, forme = 'complet') => (A && A[cle]
    ? `<span class="armoirie" data-armoirie="${cle}"><svg viewBox="${A.viewBox}" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="${A[cle][forme]}"/></svg></span>` : '');

  /* ---------- Entrée : le titre, puis les trois portes ---------- */
  (M.quandEntre || (fn => fn()))(() => requestAnimationFrame(() => page.classList.add('is-entree')));

  /* ---------- Les films des portes ne tournent que lorsqu'on les voit ---------- */
  const films = [...page.querySelectorAll('.porte video')];
  if (!reduit) {
    const io = new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause())), { threshold: .2 });
    films.forEach(v => io.observe(v));
  }

  /* ---------- Pousser la porte : elle s'ouvre en grand dans la couleur du château, puis on entre ---------- */
  page.querySelectorAll('.porte').forEach(porte => porte.addEventListener('click', e => {
    if (reduit || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const r = porte.querySelector('.porte-arche').getBoundingClientRect();
    const passage = document.createElement('div');
    passage.className = 'passage';
    passage.dataset.chateau = porte.dataset.chateau;
    passage.innerHTML = `<div class="motif"></div>${armoirie(porte.dataset.chateau)}`;
    passage.style.clipPath = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round ${r.width / 2}px ${r.width / 2}px 10px 10px)`;
    document.body.append(passage);
    passage.getBoundingClientRect();
    passage.style.clipPath = 'inset(0 0 0 0 round 0)';
    passage.classList.add('is-ouvert');
    setTimeout(() => { location.href = porte.href; }, 900);
  }));
  // Retour arrière depuis un château : on retire le passage resté dans la page
  window.addEventListener('pageshow', () => document.querySelectorAll('.passage').forEach(p => p.remove()));

  /* ---------- La frise : la racine se trace quand on l'atteint ---------- */
  const frise = page.querySelector('[data-frise]');
  if (frise) {
    if (reduit) frise.classList.add('is-in');
    else new IntersectionObserver((es, io) => es.forEach(e => { if (e.isIntersecting) { frise.classList.add('is-in'); io.disconnect(); } }), { threshold: .3 }).observe(frise);
  }

  /* =====================================================================
     Le circuit : quatre questions, chaque réponse penche vers un château ; puis l'année de naissance (facultative)
     ===================================================================== */
  const circuit = page.querySelector('[data-circuit]');
  if (!circuit) return;

  const QUESTIONS = [
    { q: 'Ce soir, vous ouvrez une bouteille pour…', r: [
      ['Un vrai dîner, une belle pièce de viande et des histoires à raconter', 'coufran'],
      ['Une grande occasion, ou pour la garder encore quelques années', 'verdignan'],
      ["Des amis qui débarquent, et l'apéritif qui s'éternise", 'soudars']] },
    { q: 'Dans le verre, vous cherchez…', r: [
      ['Du fruit, tout de suite : la framboise, la cerise, la fraise des bois', 'soudars'],
      ['De la rondeur, du velours, des fruits noirs', 'coufran'],
      ['De la tenue, de la fraîcheur, de la longueur', 'verdignan']] },
    { q: 'Votre rapport au temps ?', r: [
      ['Je sais attendre : le meilleur est souvent à venir', 'verdignan'],
      ["Le meilleur moment, c'est maintenant", 'soudars'],
      ["J'aime les vins qui ont vécu, ouverts quand ils sont prêts", 'coufran']] },
    { q: 'Dans la famille, vous seriez plutôt…', r: [
      ['Le grand-père, celui qui a toujours une histoire', 'coufran'],
      ["Le fils, celui qui met l'ambiance", 'soudars'],
      ["Le père, celui sur qui l'on peut compter", 'verdignan']] },
  ];
  // Les profils : les faits et les accords viennent des sites des châteaux (source/generer_chateaux.py)
  const PROFILS = {
    coufran: {
      nom: 'Coufran', qui: 'Louis, le grand-père · 1924', trait: 'Le <em>caractère</em>',
      texte: "Vous aimez les vins qui ont du coffre et une histoire. Coufran, c'est le pari de Louis : 85 % de merlot quand tout le Médoc jurait par le cabernet. Ample, rond, généreux, on l'appelle « le Pomerol du Médoc ».",
      vin: 'Château Coufran', bouteille: 'bouteille-coufran.webp', table: "Gigot d'agneau, pièce de bœuf, volaille fermière, fromages affinés.",
    },
    verdignan: {
      nom: 'Verdignan', qui: 'Jean, le père · 1972', trait: "L'élégance <em>classique</em>",
      texte: "Vous savez prendre le temps. Verdignan, c'est le grand classique de la famille, voisin de Saint-Estèphe : du cabernet, de la tenue, de la fraîcheur, un vin qui s'embellit avec les années.",
      vin: 'Château Verdignan', bouteille: 'bouteille-verdignan.webp', table: 'Côte de bœuf, gibier, agneau de sept heures, fromages de caractère.',
    },
    soudars: {
      nom: 'Soudars', qui: 'Éric, le fils · 1973', trait: 'Le plaisir <em>partagé</em>',
      texte: "Vous aimez le vin qui se partage, sans attendre. Soudars, c'est le domaine qu'Éric a bâti sur des friches pleines de pierres : rond, juteux, gourmand, la fraise des bois et la framboise.",
      vin: 'Château Soudars', bouteille: 'bouteille-soudars.webp', table: "Viandes rouges et blanches, rôties ou grillées : le barbecue d'été, le poulet du dimanche.",
    },
  };
  const ORDRE = ['coufran', 'verdignan', 'soudars'];
  const STYLE = k => `data-chateau="${k}"`;   // couleur et motif du château : voir [data-chateau] dans vitrine.css
  let reponses = [];

  const teinter = () => {   // le fond prend peu à peu la couleur des réponses
    const n = Math.max(1, reponses.length);
    ORDRE.forEach(k => circuit.style.setProperty(`--p${k[0]}`, (reponses.filter(r => r === k).length / n).toFixed(2)));
  };
  const afficher = html => {
    circuit.innerHTML = html;
    const premier = circuit.querySelector('.reponse, input, .v-bouton');
    if (premier) premier.focus({ preventScroll: true });
  };
  const progression = i => `<div class="circuit-progression" aria-hidden="true">${QUESTIONS.map((_, k) => `<span class="${k < i ? 'is-fait' : ''}"></span>`).join('')}</div>`;

  const question = i => {
    const Q = QUESTIONS[i];
    afficher(`<div class="circuit-ecran">
      ${progression(i)}
      <p class="v-sur-titre">Question ${i + 1} sur ${QUESTIONS.length}</p>
      <h2 class="circuit-question">${Q.q}</h2>
      <div class="reponses">${Q.r.map(([t], k) => `<button class="reponse" type="button" data-k="${k}"><b>${'ABC'[k]}</b>${t}</button>`).join('')}</div>
      ${i ? '<button class="circuit-retour" type="button" data-retour>← Question précédente</button>' : ''}
    </div>`);
    circuit.querySelectorAll('.reponse').forEach(b => b.addEventListener('click', () => {
      reponses[i] = Q.r[+b.dataset.k][1];
      reponses = reponses.slice(0, i + 1);
      teinter();
      if (i + 1 < QUESTIONS.length) question(i + 1); else annee();
    }));
    const retour = circuit.querySelector('[data-retour]');
    if (retour) retour.addEventListener('click', () => { reponses = reponses.slice(0, i - 1); teinter(); question(i - 1); });
  };

  const annee = () => {
    afficher(`<div class="circuit-ecran circuit-annee">
      ${progression(QUESTIONS.length)}
      <p class="v-sur-titre">Pour finir, si vous le voulez</p>
      <h2 class="circuit-question">Et vous, de quelle <em>année</em> êtes-vous ?</h2>
      <p class="v-chapeau">Nous chercherons le vin de la famille né la même année que vous.</p>
      <label class="sr-only" for="annee-naissance">Votre année de naissance</label>
      <input id="annee-naissance" type="text" inputmode="numeric" maxlength="4" placeholder="1996" autocomplete="bday-year">
      <p class="circuit-erreur" aria-live="polite"></p>
      <div class="circuit-actions">
        <button class="v-bouton" type="button" data-voir>Voir mon résultat</button>
        <button class="circuit-retour" type="button" data-passer>Passer cette question</button>
      </div>
    </div>`);
    const champ = circuit.querySelector('input'), erreur = circuit.querySelector('.circuit-erreur');
    const valider = () => {
      const a = +champ.value, maintenant = new Date().getFullYear();
      if (!/^\d{4}$/.test(champ.value) || a < 1900 || a > maintenant) { erreur.textContent = 'Indiquez une année sur quatre chiffres, par exemple 1996.'; champ.focus(); return; }
      if (a > maintenant - 18) { erreur.textContent = 'Revenez nous voir à vos dix-huit ans : la vigne, elle, sait attendre.'; return; }
      resultat(a);
    };
    circuit.querySelector('[data-voir]').addEventListener('click', valider);
    champ.addEventListener('keydown', e => { if (e.key === 'Enter') valider(); });
    circuit.querySelector('[data-passer]').addEventListener('click', () => resultat(null));
  };

  // Le vin de son année : d'abord chez le château qui vous ressemble, sinon chez les deux autres
  const vinDeLAnnee = (cle, a) => {
    const N = window.MIAILHE_MILLESIMES || {};
    for (const k of [cle, ...ORDRE.filter(x => x !== cle)]) if (N[k] && N[k].notes[a]) return { cle: k, nom: N[k].nom, note: N[k].notes[a] };
    return null;
  };

  const resultat = a => {
    const score = k => reponses.filter(r => r === k).length;
    // à égalité, c'est la place dans la famille (dernière question) qui tranche
    const cle = ORDRE.slice().sort((x, y) => score(y) - score(x) || (y === reponses[3]) - (x === reponses[3]))[0];
    const P = PROFILS[cle];
    let bloc = '';
    if (a) {
      const v = vinDeLAnnee(cle, a);
      bloc = v
        ? `<div class="annee-naissance" ${STYLE(v.cle)}><p class="titre">Le vin de votre année</p><p class="vin">${v.nom} ${a}</p><p class="note">« ${v.note} »</p><small>Ce qu'en dit le château. Disponibilité à vérifier auprès de la famille.</small></div>`
        : `<div class="annee-naissance" ${STYLE(cle)}><p class="titre">Le vin de votre année</p><p class="note">${a} ne figure pas encore dans les notes de dégustation des trois châteaux. Écrivez à la famille : elle vous dira si une bouteille de ${a} dort encore dans ses chais.</p></div>`;
    }
    afficher(`<div class="resultat" ${STYLE(cle)}>
      <div class="resultat-visuel"><div class="motif"></div>${armoirie(cle)}<img src="assets/img/${P.bouteille}" alt="${P.vin}"></div>
      <div class="resultat-texte">
        <p class="v-sur-titre">Vous êtes</p>
        <h2 class="resultat-nom">${P.nom}</h2>
        <p class="resultat-trait">${P.trait} · <span class="porte-qui">${P.qui}</span></p>
        <p>${P.texte}</p>
        <div class="resultat-vin"><strong>Votre vin : ${P.vin}</strong><span>À table : ${P.table}</span></div>
        ${bloc}
        <div class="resultat-actions">
          <a class="v-bouton" href="${cle}/index.html?porte">Pousser la porte de ${P.nom}</a>
          <button class="v-lien" type="button" data-partager>Partager</button>
          <button class="v-lien" type="button" data-recommencer>Refaire le circuit</button>
        </div>
      </div>
    </div>`);
    ORDRE.forEach(k => circuit.style.setProperty(`--p${k[0]}`, k === cle ? .6 : 0));
    circuit.querySelector('[data-recommencer]').addEventListener('click', commencer);
    circuit.querySelector('[data-partager]').addEventListener('click', async e => {
      const texte = `Je suis ${P.nom} : ${P.trait.replace(/<[^>]+>/g, '').toLowerCase()}. Et vous, quel Miailhe êtes-vous ?`;
      const url = `${location.href.split('#')[0]}#circuit`;
      try {
        if (navigator.share) await navigator.share({ title: 'Quel Miailhe êtes-vous ?', text: texte, url });
        else { await navigator.clipboard.writeText(`${texte} ${url}`); e.target.textContent = 'Lien copié'; }
      } catch (err) { /* partage annulé */ }
    });
  };

  const commencer = () => { reponses = []; teinter(); question(0); };
  circuit.addEventListener('click', e => { if (e.target.closest('[data-commencer]')) commencer(); });
})();
