/* Le quiz « Quel vin de la Famille Miailhe vous ressemble le plus ? » (texte de l'équipe, 27/10/2026).
   Cinq questions, trois réponses : A = Coufran, B = Verdignan, C = Soudars. La lettre majoritaire donne le profil ;
   à égalité, la réponse la plus récente parmi les ex aequo l'emporte.
   Joué sur la vitrine (#quiz) et sur quiz.html, la page des QR codes. Tout conteneur [data-quiz] reçoit le quiz. */
(function () {
  const A = window.MIAILHE_ARMOIRIES;
  const armoirie = cle => (A && A[cle]
    ? `<span class="armoirie" data-armoirie="${cle}"><svg viewBox="${A.viewBox}" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="${A[cle].complet}"/></svg></span>` : '');

  const ORDRE = ['coufran', 'verdignan', 'soudars'];   // A, B, C
  const QUESTIONS = [
    { q: 'Votre table idéale pour un dîner réussi :', r: [
      'Une grande tablée généreuse, un plat mijoté réconfortant (bœuf bourguignon, gigot confit) et des éclats de rire jusqu\'à minuit.',
      'Un dîner soigné, des mets nobles (côte de bœuf maturée, magret, champignons de saison) et une sélection minutieuse de verres et de plats.',
      'Un apéro dînatoire improvisé, des planches de charcuterie fine, des tapas variées et des amis qui débarquent à l\'improviste.'] },
    { q: 'Face à un projet ou dans la vie de tous les jours, vous êtes plutôt :', r: [
      '<strong>Le roc fiable</strong> : vous avancez avec assurance, fidèle à vos principes et à votre instinct, sans vous soucier des modes éphémères.',
      '<strong>Le stratège patient</strong> : vous aimez la précision, les choses bien faites qui prennent du temps et la valeur du long terme.',
      '<strong>L\'audacieux spontané</strong> : vous partez souvent de zéro, mû par l\'énergie, l\'envie de créer et le plaisir immédiat de l\'action.'] },
    { q: 'Vos saveurs préférées en cuisine :', r: [
      '<strong>Les arômes chauds, boisés et profonds</strong> : chocolat noir intense, épices douces, confitures de mûres ou de prunes.',
      '<strong>Les saveurs corsées et fraîches</strong> : poivre noir moulu, herbes aromatiques, cassis acidulé et jus de viande corsé.',
      '<strong>La fraîcheur et la gourmandise</strong> : fruits rouges croquants (fraise des bois, cerise), agrumes et notes florales délicates.'] },
    { q: 'Votre rapport au temps :', r: [
      'Vous prenez le temps de vous ouvrir : réservé au premier abord, chaleureux et entier une fois en confiance.',
      'Vous bonifiez avec les années : pour vous, les meilleures choses exigent de la maturité et du recul.',
      'Vous vivez l\'instant présent : direct, accessible et prêt à partager sans attendre.'] },
    { q: 'La phrase qui résume votre état d\'esprit :', r: [
      '« La vraie générosité se prouve dans le temps et dans l\'assiette. »',
      '« L\'élégance réside dans la maîtrise et la tenue. »',
      '« Le bonheur est fait de plaisirs simples et partagés. »'] },
  ];
  const PROFILS = {
    coufran: {
      nom: 'Château Coufran', surnom: 'Le Caractère Généreux', qui: 'Louis Miailhe', role: 'le grand-père', portrait: 'portrait-louis.jpg', bouteille: 'bouteille-coufran.webp',
      temperament: "Vous avez de la présence, du cœur et une personnalité affirmée. Comme Louis qui a osé planter 85 % de merlot au pays du cabernet, vous tracez votre propre route sans suivre le troupeau. Vous êtes le pilier sur lequel vos proches s'appuient.",
      pourquoi: "Ample, rond et chaleureux, Coufran offre des notes profondes de fruits noirs, de cuir et de cèdre. C'est le vin réconfortant par excellence, conçu pour les grandes tablées et les moments où l'on prend le temps de refaire le monde.",
    },
    verdignan: {
      nom: 'Château Verdignan', surnom: "L'Élégance Classique", qui: 'Jean Miailhe', role: 'le père', portrait: 'portrait-jean.jpg', bouteille: 'bouteille-verdignan.webp',
      temperament: "Vous appréciez la justesse, la rigueur et le savoir-faire. Vous n'avez pas besoin d'en faire trop pour impressionner : votre force réside dans la maîtrise, l'équilibre et la constance.",
      pourquoi: "Dominé par le cabernet-sauvignon, Verdignan est un grand vin de garde, structuré et racé. Ses touches de cassis, d'épices et sa fraîcheur tannique demandent un peu de patience pour révéler toute leur noblesse. C'est le choix des connaisseurs et des repas soignés.",
    },
    soudars: {
      nom: 'Château Soudars', surnom: 'Le Plaisir Spontané', qui: 'Éric Miailhe', role: 'le fils', portrait: 'portrait-eric.jpg', bouteille: 'bouteille-soudars.webp',
      temperament: "Ouvert, dynamique et solaire. À l'image d'Éric qui a bâti son vignoble sur des parcelles de friches, vous êtes animé par l'envie d'entreprendre et de partager. Votre mot d'ordre : la convivialité sans chichis.",
      pourquoi: "Souple, juteux et gourmand, Soudars s'ouvre immédiatement sur la framboise, la cerise et la fraîcheur. C'est le vin du quotidien et des retrouvailles impromptues, prêt à boire dès aujourd'hui pour célébrer les petits bonheurs de la vie.",
    },
  };

  document.querySelectorAll('[data-quiz]').forEach(quiz => {
    const ancre = quiz.dataset.quiz || '';
    let reponses = [];

    const teinter = () => {   // le fond prend peu à peu la couleur des réponses
      const n = Math.max(1, reponses.length);
      ORDRE.forEach(k => quiz.style.setProperty(`--p${k[0]}`, (reponses.filter(r => r === k).length / n).toFixed(2)));
    };
    const afficher = html => {
      quiz.innerHTML = html;
      const premier = quiz.querySelector('.reponse, .v-bouton');
      if (premier) premier.focus({ preventScroll: true });
      if (quiz.getBoundingClientRect().top < 0) quiz.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
    const progression = i => `<div class="circuit-progression" aria-hidden="true">${QUESTIONS.map((_, k) => `<span class="${k < i ? 'is-fait' : ''}"></span>`).join('')}</div>`;

    const question = i => {
      const Q = QUESTIONS[i];
      afficher(`<div class="circuit-ecran">
        ${progression(i)}
        <p class="v-sur-titre">Question ${i + 1} sur ${QUESTIONS.length}</p>
        <h2 class="circuit-question">${Q.q}</h2>
        <div class="reponses">${Q.r.map((t, k) => `<button class="reponse" type="button" data-k="${k}"><b>${'ABC'[k]}</b><span>${t}</span></button>`).join('')}</div>
        ${i ? '<button class="circuit-retour" type="button" data-retour>← Question précédente</button>' : ''}
      </div>`);
      quiz.querySelectorAll('.reponse').forEach(b => b.addEventListener('click', () => {
        reponses = reponses.slice(0, i);
        reponses[i] = ORDRE[+b.dataset.k];
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
      afficher(`<div class="resultat" data-chateau="${cle}">
        <div class="resultat-visuel"><div class="motif"></div>${armoirie(cle)}<img src="assets/img/${P.bouteille}" alt="${P.nom}"></div>
        <div class="resultat-texte">
          <p class="v-sur-titre">Majorité de ${'ABC'[ORDRE.indexOf(cle)]} · vous êtes</p>
          <h2 class="resultat-nom">${P.nom}</h2>
          <p class="resultat-trait"><em>${P.surnom}</em></p>
          <figure class="resultat-ancetre"><img src="assets/img/enquete/${P.portrait}" alt=""><figcaption><span>Incarné par <strong>${P.qui}</strong>, ${P.role}</span><small>Portrait d'illustration</small></figcaption></figure>
          <div class="resultat-bloc"><p class="titre">Votre tempérament</p><p>${P.temperament}</p></div>
          <div class="resultat-bloc"><p class="titre">Pourquoi ce vin est fait pour vous</p><p>${P.pourquoi}</p></div>
          <p class="resultat-pab"><span>Prêt à boire</span> La famille garde ses bouteilles dans ses chais jusqu'à ce qu'elles soient prêtes : celle-ci vous attend.</p>
          <div class="resultat-actions">
            <a class="v-bouton" href="${cle}/index.html?porte">Pousser la porte de ${P.nom.replace('Château ', '')}</a>
            <button class="v-lien" type="button" data-partager>Partager</button>
            <button class="v-lien" type="button" data-recommencer>Refaire le quiz</button>
          </div>
        </div>
      </div>`);
      ORDRE.forEach(k => quiz.style.setProperty(`--p${k[0]}`, k === cle ? .6 : 0));
      quiz.querySelector('[data-recommencer]').addEventListener('click', commencer);
      quiz.querySelector('[data-partager]').addEventListener('click', async e => {
        const texte = `Je suis ${P.nom}, ${P.surnom.toLowerCase()}. Et vous, quel vin de la famille Miailhe vous ressemble ?`;
        const url = location.href.split('#')[0] + ancre;
        try {
          if (navigator.share) await navigator.share({ title: 'Quel vin de la Famille Miailhe vous ressemble ?', text: texte, url });
          else { await navigator.clipboard.writeText(`${texte} ${url}`); e.target.textContent = 'Lien copié'; }
        } catch (err) { /* partage annulé */ }
      });
    };

    const commencer = () => { reponses = []; teinter(); question(0); };
    quiz.addEventListener('click', e => { if (e.target.closest('[data-commencer]')) commencer(); });
  });
})();
