/* Le test de découverte « Quel château vous ressemble ? » (27/10/2026, troisième version).
   Sept questions simples : le rapport à la découverte, à la tradition, à l'histoire, à la dégustation et au lieu, puis
   deux questions de goût sur ce qu'on aime et qu'on a l'habitude de boire (le café, le thé, les jus ; le vin qu'on
   aime), avec des mots de tous les jours, sans rien demander de l'œnologie. Les réponses de goût reprennent les vraies notes de dégustation des châteaux (generer_chateaux.py).
   Chaque réponse penche vers un château ; le plus choisi l'emporte, et à égalité la réponse la plus récente parmi les
   ex aequo. Le résultat présente le château (son histoire, son univers, son goût, une clé pour comprendre) et oriente
   vers le site : c'est un outil de découverte, pas un conseil de consommation.
   Sur la vitrine, le test s'ouvre au seuil, au-dessus des portes ([data-ouvrir-test] ouvre .test-voile) : le résultat
   ouvre la porte du château (événement miailhe:porte, repris par vitrine.js). Sur quiz.html (la page des QR codes),
   il est dans la page. Tout conteneur [data-quiz] reçoit le test. Versions précédentes : archives/quiz-v1-texte-equipe/.
   Mise en scène (28/10/2026) : derrière les questions, les trois portes fermées et leur hôte (Louis, Jean, Éric) ; à
   chaque réponse, la porte du château qui l'emporte s'éclaire. Au résultat, sa porte s'ouvre et prend tout l'écran,
   comme à l'accueil, avec sa légende (armoirie, logo, hôte), et le château se présente à côté (vitrine.css). */
(function () {
  const A = window.MIAILHE_ARMOIRIES;
  const armoirie = (cle, forme = 'complet') => (A && A[cle]
    ? `<span class="armoirie" data-armoirie="${cle}"><svg viewBox="${A.viewBox}" aria-hidden="true"><path class="armoirie-fond" d="${A.bouclier}"/><path fill="currentColor" fill-rule="evenodd" d="${A[cle][forme]}"/></svg></span>` : '');
  const LG = window.MIAILHE_LOGOS_CHATEAUX;
  const logo = (cle, forme = 'logo') => {
    const v = LG && LG[cle] && LG[cle][forme];
    return v ? `<span class="logo-chateau" aria-hidden="true"><svg viewBox="${v.viewBox}" aria-hidden="true"><path fill="currentColor" d="${v.d}"/></svg></span>` : '';
  };

  // Chaque réponse : [texte, château]. L'ordre d'affichage varie d'une question à l'autre.
  const QUESTIONS = [
    { theme: 'La découverte', q: 'En voyage, vous êtes plutôt du genre à…', r: [
      ['Retourner dans le lieu que vous aimez, et y emmener ceux que vous aimez.', 'coufran'],
      ['Visiter le monument incontournable, en connaissant déjà son histoire.', 'verdignan'],
      ['Pousser la porte que personne n\'avait remarquée.', 'soudars']] },
    { theme: 'La tradition', q: 'Une tradition, pour vous, c\'est…', r: [
      ['Un savoir-faire exigeant, que l\'on transmet avec patience.', 'verdignan'],
      ['Quelque chose que l\'on peut aussi inventer soi-même.', 'soudars'],
      ['Un héritage que l\'on garde vivant, avec son caractère et ses habitudes.', 'coufran']] },
    { theme: 'L\'histoire', q: 'Quelle histoire vous donne envie d\'en savoir plus ?', r: [
      ['Celle d\'un domaine bâti de toutes pièces, sur des friches couvertes de pierres.', 'soudars'],
      ['Celle d\'un homme qui, en 1924, a osé faire autrement que tous ses voisins.', 'coufran'],
      ['Celle d\'un château qui regarde l\'estuaire depuis plus d\'un siècle.', 'verdignan']] },
    { theme: 'La dégustation', q: 'Une dégustation, pour vous, c\'est d\'abord…', r: [
      ['Un moment de partage, autour d\'une grande table.', 'coufran'],
      ['Une rencontre simple et spontanée, sans protocole.', 'soudars'],
      ['Une découverte que l\'on prend le temps de comprendre.', 'verdignan']] },
    { theme: 'Le lieu', q: 'Pour une journée au vignoble, vous choisiriez…', r: [
      ['La visite du cuvier et du chai, face à l\'estuaire.', 'verdignan'],
      ['Une promenade jusqu\'au pigeonnier, au milieu des vignes.', 'coufran'],
      ['Une balade entre les murets de pierres sèches, à la recherche de fossiles.', 'soudars']] },
    // Le goût : ce qu'on aime et qu'on a l'habitude de boire, dit avec des mots de tous les jours ; les réponses
    // recoupent les notes de dégustation de chaque château (rond et velouté, droit et intense, frais et fruité)
    { theme: 'Le goût', q: 'Au quotidien, ce que vous aimez boire, c\'est plutôt…', r: [
      ['Un café serré, noir, qui a du corps et de la longueur.', 'verdignan'],
      ['Un café crème ou un chocolat chaud, rond et doux.', 'coufran'],
      ['Un jus de fruits pressés ou un thé aux fruits rouges.', 'soudars']] },
    { theme: 'Le vin', q: 'Le vin que vous aimez, c\'est plutôt…', r: [
      ['Un vin rond et souple, qui fond en bouche.', 'coufran'],
      ['Un vin plein et droit, avec du caractère, qui gagne à attendre.', 'verdignan'],
      ['Un vin fruité et frais, déjà bon dans sa jeunesse.', 'soudars']] },
  ];
  // Les faits viennent des sites des châteaux (source/generer_chateaux.py) et de leurs pages officielles
  const PROFILS = {
    coufran: {
      nom: 'Coufran', surnom: 'Le caractère généreux', qui: 'Louis', role: 'le grand-père', annee: '1924', portrait: 'portrait-louis.jpg',
      histoire: "En 1924, Louis Miailhe achète Coufran, à Saint-Seurin-de-Cadourne. Le vin d'alors, presque tout en cabernet, se vend mal : Louis décide de tout replanter en merlot. Le pari a tenu, et un journaliste a fini par surnommer Coufran « le Pomerol du Médoc ».",
      univers: "Une façade de la fin du XIXᵉ siècle, des orangers en caisses de Versailles, et au milieu des vignes un pigeonnier-belvédère, devenu l'emblème du domaine.",
      gout: "Une robe profonde, un nez de fruits noirs et de griotte, puis une bouche ample, ronde et généreuse, aux tanins soyeux : la marque du merlot.",
      cle: ['Merlot ou cabernet ?', "Ce sont deux cépages, deux variétés de raisin. Le Médoc plante surtout du cabernet-sauvignon, qui donne des vins plus fermes. Coufran est fait d'environ 85 % de merlot, qui donne des vins plus ronds : c'est ce qui le rend à part."],
    },
    verdignan: {
      nom: 'Verdignan', surnom: "L'élégance classique", qui: 'Jean', role: 'le père', annee: '1976', portrait: 'portrait-jean.jpg',
      histoire: "En 1976, Jean Miailhe, le fils de Louis, achète Verdignan, le voisin de Coufran. Il vient d'arrêter le courtage : il sera le dernier courtier de la famille, et le premier à garder ses vins comme on garde une tradition.",
      univers: "Une tour coiffée d'une flèche d'ardoise qu'on voit de loin, un vieux cuvier de pierre, et l'estuaire de la Gironde au bout des rangs, à la frontière de Saint-Estèphe.",
      gout: "Le cassis, les épices et le chocolat. Une bouche qui allie puissance et fraîcheur, des tanins consistants mais soyeux, une belle longueur : il s'embellit avec les années.",
      cle: ['Que veut dire « vin de garde » ?', "C'est un vin qui gagne à vieillir quelques années avant d'être ouvert. Chez les Miailhe, c'est le château qui attend : les bouteilles vieillissent sur place et ne partent que lorsqu'elles sont prêtes."],
    },
    soudars: {
      nom: 'Soudars', surnom: 'Le plaisir spontané', qui: 'Éric', role: 'le fils', annee: '1980', portrait: 'portrait-eric.jpg',
      histoire: "En 1980, Éric Miailhe, le fils de Jean, se lance à son tour. Pas de château à reprendre : il défriche des terres couvertes de pierres et de ronces, et crée Soudars de toutes pièces.",
      univers: "Un vignoble entouré de murets de pierres sèches, sur un sol d'argile et de calcaire où l'on trouve encore des oursins fossiles, souvenirs de la mer qui couvrait le Médoc.",
      gout: "Des fruits rouges frais, la fraise des bois, la framboise, la cerise. Un vin ouvert, rond et juteux, aux tanins soyeux et à la finale épicée, agréable dès sa jeunesse.",
      cle: ["Qu'est-ce qu'un terroir ?", "C'est le sol, le climat et le savoir-faire d'un lieu. Chaque parcelle a le sien : c'est pour cela que trois châteaux voisins, à Saint-Seurin-de-Cadourne, ne donnent pas le même vin."],
    },
  };
  const ORDRE = ['coufran', 'verdignan', 'soudars'];
  // l'hôte de chaque porte, comme sur les portes de l'accueil
  const HOTES = { coufran: 'Chez Louis, le grand-père', verdignan: 'Chez Jean, le père', soudars: 'Chez Éric, le fils' };

  document.querySelectorAll('[data-quiz]').forEach(quiz => {
    const ancre = quiz.dataset.quiz || '';
    const racine = quiz.dataset.racine || '';   // chemin vers la racine du site (quiz.html et la vitrine y sont déjà)
    const auSeuil = !!quiz.closest('.test-voile');   // au-dessus des portes : le résultat ouvre la porte
    let reponses = [];
    // hors de la vitrine (quiz.html), le test prend les couleurs, les polices et les marges de la vitrine (.v)
    if (!quiz.closest('.v')) quiz.classList.add('v');
    // le décor : les trois portes, derrière ; les écrans du test passent devant (.circuit-scene)
    const portes = document.createElement('div');
    portes.className = 'circuit-portes';
    portes.setAttribute('aria-hidden', 'true');
    portes.innerHTML = ORDRE.map(k => `<div class="circuit-porte" data-chateau="${k}">`
      + `<img class="fermee" src="${racine}assets/img/portes/${k}-fermee.jpg" alt="">`
      + `<img class="ouverte" src="${racine}assets/img/portes/${k}-ouverte.jpg" alt="" loading="lazy">`
      + `<div class="circuit-porte-legende">${logo(k)}<p class="circuit-porte-qui">${HOTES[k]}</p></div></div>`).join('');
    const scene = document.createElement('div');
    scene.className = 'circuit-scene';
    while (quiz.firstChild) scene.append(quiz.firstChild);
    quiz.append(portes, scene);
    const ouvrirPorte = cle => {
      if (cle) quiz.dataset.resultat = cle; else delete quiz.dataset.resultat;
      portes.querySelectorAll('.circuit-porte').forEach(d => d.classList.toggle('is-vous', d.dataset.chateau === cle));
    };

    const teinter = () => {   // le fond prend peu à peu la couleur des réponses
      const n = Math.max(1, reponses.length);
      ORDRE.forEach(k => quiz.style.setProperty(`--p${k[0]}`, (reponses.filter(r => r === k).length / n).toFixed(2)));
    };
    const afficher = html => {
      scene.innerHTML = html;
      const premier = quiz.querySelector('.reponse, .v-bouton');
      if (premier) premier.focus({ preventScroll: true });
      if (quiz.getBoundingClientRect().top < 0) quiz.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
    const progression = i => `<div class="circuit-progression" aria-hidden="true">${QUESTIONS.map((_, k) => `<span class="${k < i ? 'is-fait' : ''}"></span>`).join('')}</div>`;

    const question = i => {
      const Q = QUESTIONS[i];
      afficher(`<div class="circuit-ecran">
        ${progression(i)}
        <p class="v-sur-titre">${Q.theme} · ${i + 1} sur ${QUESTIONS.length}</p>
        <h2 class="circuit-question">${Q.q}</h2>
        <div class="reponses">${Q.r.map(([t], k) => `<button class="reponse" type="button" data-k="${k}"><b>${'ABC'[k]}</b><span>${t}</span></button>`).join('')}</div>
        ${i ? '<button class="circuit-retour" type="button" data-retour>← Question précédente</button>' : ''}
      </div>`);
      quiz.querySelectorAll('.reponse').forEach(b => b.addEventListener('click', () => {
        reponses = reponses.slice(0, i);
        reponses[i] = Q.r[+b.dataset.k][1];
        teinter();
        if (i + 1 < QUESTIONS.length) question(i + 1); else resultat();
      }));
      const retour = quiz.querySelector('[data-retour]');
      if (retour) retour.addEventListener('click', () => { reponses = reponses.slice(0, i - 1); teinter(); question(i - 1); });
    };

    const resultat = () => {
      const score = k => reponses.filter(r => r === k).length;
      const max = Math.max(...ORDRE.map(score));
      const cle = reponses.slice().reverse().find(k => score(k) === max);
      const P = PROFILS[cle];
      const famille = ORDRE.map(k => {
        const F = PROFILS[k];
        return `<a class="famille-chateau${k === cle ? ' is-vous' : ''}" data-chateau="${k}" href="${racine}${k}/index.html?porte">${armoirie(k, 'petit')}<span><b>${F.nom}</b><small>${F.qui}, ${F.role} · ${F.annee}</small></span></a>`;
      }).join('');
      ouvrirPorte(cle);
      afficher(`<div class="resultat resultat--decouverte" data-chateau="${cle}">
        <div class="resultat-visuel">${armoirie(cle)}${logo(cle)}<p class="resultat-visuel-qui">${HOTES[cle]} · ${P.annee}</p></div>
        <div class="resultat-texte">
          <p class="v-sur-titre">Le château qui vous ressemble</p>
          <h2 class="resultat-nom">${P.nom}</h2>
          <p class="resultat-trait"><em>${P.surnom}</em></p>
          <figure class="resultat-ancetre"><img src="${racine}assets/img/enquete/${P.portrait}" alt=""><figcaption><span>La maison de <strong>${P.qui}</strong>, ${P.role}, depuis ${P.annee}</span><small>Portrait d'illustration</small></figcaption></figure>
          <div class="resultat-bloc"><p class="titre">Son histoire</p><p>${P.histoire}</p></div>
          <div class="resultat-bloc"><p class="titre">Son univers</p><p>${P.univers}</p></div>
          <div class="resultat-bloc"><p class="titre">Son goût</p><p>${P.gout}</p></div>
          <div class="resultat-cle"><p class="titre">Une clé pour comprendre</p><p><strong>${P.cle[0]}</strong> ${P.cle[1]}</p></div>
          <div class="resultat-actions">
            ${auSeuil ? `<button class="v-bouton" type="button" data-choisir-porte="${cle}">Ouvrir la porte de ${P.nom}</button>`
              : `<a class="v-bouton" href="${racine}${cle}/index.html?porte">Pousser la porte de ${P.nom}</a>`}
            <a class="v-lien" href="${racine}${cle}/famille.html">Son histoire de famille</a>
            <a class="v-lien" href="${racine}${cle}/index.html#temoin">Son témoin de l'enquête</a>
          </div>
          <div class="resultat-famille">
            <p class="titre">Trois châteaux voisins, une même famille</p>
            <div class="famille-chateaux">${famille}</div>
          </div>
          <div class="resultat-pied">
            <button class="v-lien" type="button" data-partager>Partager</button>
            <button class="v-lien" type="button" data-recommencer>Refaire le test</button>
          </div>
          <p class="resultat-mention">Un jeu pour découvrir les châteaux, pas un conseil de consommation. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
        </div>
      </div>`);
      ORDRE.forEach(k => quiz.style.setProperty(`--p${k[0]}`, k === cle ? .6 : 0));
      try { localStorage.setItem('miailhe-test-fait', cle); } catch (e) { /* stockage indisponible */ }
      quiz.querySelector('[data-recommencer]').addEventListener('click', commencer);
      quiz.querySelector('[data-partager]').addEventListener('click', async e => {
        const M = window.MIAILHE || {};
        const tf = (m, ...v) => (M.tf ? M.tf(m, v) : m.replace(/\{(\d+)\}/g, (x, i) => v[i]));
        const texte = tf('Le château qui me ressemble : {0}, {1}. Et vous ?', P.nom, (M.t ? M.t(P.surnom) : P.surnom).toLowerCase());
        const url = location.href.split('#')[0] + ancre;
        try {
          if (navigator.share) await navigator.share({ title: tf('Quel château vous ressemble ?'), text: texte, url });
          else { await navigator.clipboard.writeText(`${texte} ${url}`); e.target.textContent = tf('Lien copié'); }
        } catch (err) { /* partage annulé */ }
      });
    };

    const commencer = () => { reponses = []; ouvrirPorte(null); teinter(); question(0); };
    quiz.miailheCommencer = commencer;
    quiz.addEventListener('click', e => {
      if (e.target.closest('[data-commencer]')) commencer();
      const porte = e.target.closest('[data-choisir-porte]');
      if (porte) document.dispatchEvent(new CustomEvent('miailhe:porte', { detail: porte.dataset.choisirPorte }));
    });
  });

  /* ---------- Au seuil de la vitrine : le test s'ouvre au-dessus des portes, sans jamais être obligatoire ---------- */
  const voile = document.querySelector('.test-voile');
  let retourFocus = null;
  const fermerTest = () => {
    if (!voile || voile.hidden) return;
    voile.classList.remove('is-ouvert');
    document.body.classList.remove('test-ouvert');
    setTimeout(() => { voile.hidden = true; }, 450);
    if (retourFocus && retourFocus.isConnected) retourFocus.focus({ preventScroll: true });
  };
  const ouvrirTest = () => {
    retourFocus = document.activeElement;
    voile.hidden = false;
    document.body.classList.add('test-ouvert');
    requestAnimationFrame(() => voile.classList.add('is-ouvert'));
    voile.scrollTop = 0;
    const q = voile.querySelector('[data-quiz]');
    if (q && q.miailheCommencer) q.miailheCommencer();
    document.dispatchEvent(new CustomEvent('miailhe:test'));
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-ouvrir-test]');
    if (b && voile) {
      e.preventDefault();
      if (document.body.classList.contains('menu-ouvert')) { const m = document.querySelector('.ouvrir-menu'); if (m) m.click(); }
      ouvrirTest();
    }
    if (e.target.closest('[data-fermer-test]')) fermerTest();
  });
  if (voile) {
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !voile.hidden) fermerTest(); });
    document.addEventListener('miailhe:porte', fermerTest);
  }
})();
