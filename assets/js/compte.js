/* L'espace client (compte.html, 28/10/2026) : un seul espace pour les trois châteaux.
   - Pas connecté : on entre avec son e-mail (sur miailhe.com, un lien de connexion serait envoyé ; ici on entre
     directement) ou l'on crée son espace (prénom, nom, e-mail, âge légal, la lettre de la famille en option).
   - Connecté : les commandes de la boutique, le panier, l'enquête, le château du test, les coordonnées (reprises par
     la boutique au moment de commander), la lettre, la déconnexion et l'effacement des données.
   Maquette : tout vit dans ce navigateur (localStorage).
     miailhe-client      le client connecté
     miailhe-clients     les espaces créés, par e-mail (sur un serveur en vrai)
     miailhe-commandes   les commandes de la boutique (boutique.js), la plus récente en premier
     miailhe-panier      le panier ; miailhe-enquete-comptes : les parties de l'enquête des inscrits ; miailhe-test-fait : le château du test
   Textes en français ici, traduits par MIAILHE.t / MIAILHE.tf (langue.js) : les zones écrites portent translate="no". */
(function () {
  const M = (window.MIAILHE = window.MIAILHE || {});
  const t = s => (M.t ? M.t(s) : s);
  const tf = (s, ...v) => (M.tf ? M.tf(s, v) : s.replace(/\{(\d+)\}/g, (m, i) => v[i] ?? ''));
  const lire = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } };
  const oublier = k => { try { localStorage.removeItem(k); } catch (e) { /* */ } };
  const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const locale = { fr: 'fr-FR', en: 'en-GB', ja: 'ja-JP' }[M.langue] || 'fr-FR';
  const euros = n => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(n);
  const jour = d => { try { return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d)); } catch (e) { return ''; } };
  const nomPropre = s => esc(String(s || '').trim().slice(0, 40));

  const vue = n => document.querySelectorAll('[data-vue]').forEach(v => { v.hidden = v.dataset.vue !== n; });
  const annonce = document.querySelector('[data-annonce]');
  const dire = s => { if (annonce) { annonce.textContent = ''; setTimeout(() => { annonce.textContent = s; }, 50); } };

  const CHATEAUX = {
    coufran: { nom: 'Château Coufran', qui: 'Chez Louis, le grand-père · 1924' },
    verdignan: { nom: 'Château Verdignan', qui: 'Chez Jean, le père · 1976' },
    soudars: { nom: 'Château Soudars', qui: 'Chez Éric, le fils · 1980' },
  };
  const logo = k => {
    const v = ((window.MIAILHE_LOGOS_CHATEAUX || {})[k] || {}).logo;
    if (!v) return `<span>${CHATEAUX[k].nom}</span>`;
    const [, , w, h] = v.viewBox.split(' ').map(Number);
    return `<span class="logo-chateau cp-logo" data-chateau="${k}"><svg viewBox="${v.viewBox}" style="aspect-ratio:${w} / ${h}" aria-hidden="true"><path fill="currentColor" d="${v.d}"/></svg></span><span class="sr-only">${CHATEAUX[k].nom}</span>`;
  };

  /* ---------- Entrer, créer, sortir ---------- */
  const clients = () => lire('miailhe-clients', {}) || {};
  const garder = c => { const tous = clients(); tous[c.email] = c; ecrire('miailhe-clients', tous); ecrire('miailhe-client', c); };
  const entrer = c => { garder(c); M.majEspace && M.majEspace(); afficher(); window.scrollTo(0, 0); dire(tf('Bonjour, {0}.', c.prenom)); };

  const erreur = (form, s) => { const e = form.querySelector('[data-erreur]'); e.textContent = s; e.hidden = !s; };
  document.querySelectorAll('[data-form]').forEach(f => f.addEventListener('input', () => erreur(f, '')));

  // les deux onglets : « J'ai déjà un espace », « Créer mon espace »
  const onglet = n => {
    document.querySelectorAll('[data-onglet]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.onglet === n)));
    document.querySelectorAll('[data-form]').forEach(f => { f.hidden = f.dataset.form !== n; });
  };
  document.querySelectorAll('[data-onglet]').forEach(b => b.addEventListener('click', () => { onglet(b.dataset.onglet); document.querySelector(`[data-form="${b.dataset.onglet}"] input`).focus(); }));

  const formEntrer = document.querySelector('[data-form="entrer"]');
  formEntrer.addEventListener('submit', e => {
    e.preventDefault();
    const mail = formEntrer.elements.email.value.trim().toLowerCase();
    if (!MAIL.test(mail)) { erreur(formEntrer, t('Indiquez une adresse e-mail valide.')); return; }
    const connu = clients()[mail];
    if (connu) { entrer(connu); return; }
    // inscrit à l'enquête, mais sans espace : on le retrouve par son e-mail
    const partie = (lire('miailhe-enquete-comptes', {}) || {})[mail];
    if (partie && partie.inscrit && partie.inscrit.prenom) {
      entrer({ prenom: partie.inscrit.prenom, nom: '', email: mail, newsletter: !!partie.inscrit.nouvelles, depuis: partie.inscrit.date || new Date().toISOString().slice(0, 10) });
      return;
    }
    onglet('creer');
    formCreer.elements.email.value = mail;
    erreur(formCreer, t("Nous ne trouvons pas d'espace à cette adresse : créez-le en un instant."));
    formCreer.elements.prenom.focus();
  });

  const formCreer = document.querySelector('[data-form="creer"]');
  formCreer.addEventListener('submit', e => {
    e.preventDefault();
    const x = formCreer.elements;
    const mail = x.email.value.trim().toLowerCase();
    if (!x.prenom.value.trim() || !x.nom.value.trim()) { erreur(formCreer, t('Indiquez votre prénom et votre nom.')); return; }
    if (!MAIL.test(mail)) { erreur(formCreer, t('Indiquez une adresse e-mail valide.')); return; }
    if (!x.age.checked) { erreur(formCreer, t("Cochez la case de l'âge légal pour créer votre espace.")); return; }
    const ancien = clients()[mail] || {};
    entrer({ ...ancien, prenom: x.prenom.value.trim().slice(0, 40), nom: x.nom.value.trim().slice(0, 60), email: mail,
      newsletter: x.newsletter.checked, depuis: ancien.depuis || new Date().toISOString().slice(0, 10) });
  });

  /* ---------- Le tableau de bord ---------- */
  const carte = (classe, titre, corps) => `<article class="cp-carte ${classe}"><h2 class="cp-carte-titre">${titre}</h2>${corps}</article>`;

  function commandes(c) {
    const toutes = (lire('miailhe-commandes', []) || []).filter(o => o && (!o.email || o.email === c.email));
    if (!toutes.length) {
      return carte('cp-carte--commandes', t('Mes commandes'), `<p class="cp-vide">${t("Pas encore de commande. Les vins des trois châteaux vous attendent dans la boutique, prêts à boire.")}</p>
        <a class="cp-bouton cp-bouton--petit" href="boutique.html">${t('Découvrir la boutique')}</a>`);
    }
    const lignes = toutes.slice(0, 6).map(o => {
      const vins = (o.lignes || []).map(l => `<li><span class="cp-q">${esc(l.q)} ×</span> ${esc(l.nom)} ${l.millesime ? esc(l.millesime) : ''}${l.gravure ? ` · <em>${esc(l.gravure)}</em>` : ''}</li>`).join('');
      // un coffret des trois générations compte pour trois bouteilles
      const n = (o.lignes || []).reduce((s, l) => s + (+l.bouteilles || +l.q || 0), 0);
      return `<li class="cp-commande">
        <div class="cp-commande-tete"><span class="cp-numero">${esc(o.numero || '')}</span><span>${o.date ? jour(o.date) : ''}</span></div>
        <ul class="cp-commande-vins">${vins}</ul>
        <div class="cp-commande-pied"><span>${n === 1 ? t('1 bouteille') : tf('{0} bouteilles', n)}${o.mode === 'drive' ? ' · ' + t('drive au château') : o.port === 0 ? ' · ' + t('livraison offerte') : ''}</span><strong>${euros(+o.total || 0)}</strong></div>
        <p class="cp-statut"><span class="cp-point" aria-hidden="true"></span>${o.mode === 'drive' && o.drive ? tf('Vous attend au drive du château, {0} à {1}', `<span translate="no">${esc(o.drive.jourLong || o.drive.jour)}</span>`, `<span translate="no">${esc(o.drive.heureCourte || o.drive.heure)}</span>`) : t('Préparée au château, livrée sous 10 à 12 jours ouvrés')}</p>
      </li>`;
    }).join('');
    return carte('cp-carte--commandes', t('Mes commandes'), `<ol class="cp-commandes">${lignes}</ol><p class="cp-maquette">${t('Maquette : ces commandes de démonstration ne sont ni envoyées ni débitées.')}</p>`);
  }

  function panier() {
    const p = lire('miailhe-panier', {}) || {};
    const n = Object.values(p).reduce((s, q) => s + (q > 0 ? +q : 0), 0) + 3 * ((lire('miailhe-coffrets', []) || []).length || 0);
    return carte('cp-carte--panier', t('Mon panier'), n
      ? `<p class="cp-grand">${n === 1 ? t('1 bouteille') : tf('{0} bouteilles', n)}</p><p>${n >= 12 ? t('La livraison est offerte.') : tf('Encore {0} bouteilles et la livraison est offerte.', 12 - n)}</p>
         <a class="cp-bouton cp-bouton--petit" href="boutique.html#panier">${t('Reprendre mon panier')}</a>`
      : `<p class="cp-vide">${t('Votre panier est vide.')}</p><a class="cp-lien" href="boutique.html">${t('Voir les vins')}</a>`);
  }

  function enquete(c) {
    const partie = (lire('miailhe-enquete-comptes', {}) || {})[c.email];
    const etapes = partie ? Object.keys(partie.lettres || {}).length : 0;
    let corps;
    if (partie && partie.resolue) corps = `<p class="cp-grand">${t('Résolue')}</p><p>${tf('Le {0} : vous participez au tirage au sort du trimestre.', jour(partie.resolue))}</p>`;
    else if (partie) corps = `<p class="cp-grand">${tf('Étape {0} sur 6', Math.min(6, etapes + 1))}</p><p>${t("Reprenez-la là où vous l'aviez laissée.")}</p>`;
    else corps = `<p>${t("Des bouteilles ont disparu du chai. Menez l'enquête, de château en château : une bouteille est tirée au sort chaque trimestre.")}</p>`;
    return carte('cp-carte--enquete', t('Mon enquête'), corps + `<a class="cp-bouton cp-bouton--petit" href="enquete.html">${partie ? t('Ouvrir le dossier') : t("Mener l'enquête")}</a>`);
  }

  function chateau() {
    const k = lire('miailhe-test-fait', null) || (() => { try { return localStorage.getItem('miailhe-test-fait'); } catch (e) { return null; } })();
    if (CHATEAUX[k]) {
      return carte(`cp-carte--chateau cp-carte--${k}`, t('Mon château'), `${logo(k)}<p class="cp-qui">${t(CHATEAUX[k].qui)}</p>
        <div class="cp-liens"><a class="cp-lien" href="${k}/index.html?porte">${t('Pousser sa porte')}</a><a class="cp-lien" href="quiz.html">${t('Refaire le test')}</a></div>`);
    }
    return carte('cp-carte--chateau', t('Mon château'), `<p>${t('Coufran, Verdignan ou Soudars : sept questions simples pour savoir lequel vous ressemble.')}</p>
      <a class="cp-lien" href="quiz.html">${t('Faire le test')}</a>`);
  }

  function coordonnees(c) {
    const a = c.adresse || {};
    const champ = (nom, label, val, att = '') => `<label class="cp-champ"><span>${t(label)}</span><input name="${nom}" value="${esc(val || '')}" ${att}></label>`;
    return carte('cp-carte--coordonnees', t('Mes coordonnées'), `<form class="cp-form cp-form--coord" data-coordonnees novalidate>
      <div class="cp-deux">${champ('prenom', 'Prénom', c.prenom, 'autocomplete="given-name" required')}${champ('nom', 'Nom', c.nom, 'autocomplete="family-name"')}</div>
      ${champ('email', 'E-mail', c.email, 'type="email" readonly')}
      ${champ('tel', 'Téléphone', c.tel, 'type="tel" autocomplete="tel"')}
      ${champ('rue', 'Adresse', a.rue, 'autocomplete="street-address"')}
      <div class="cp-deux">${champ('cp', 'Code postal', a.cp, 'autocomplete="postal-code" inputmode="numeric"')}${champ('ville', 'Ville', a.ville, 'autocomplete="address-level2"')}</div>
      <p class="cp-note">${t('La boutique les reprend quand vous commandez. Livraison en France métropolitaine.')}</p>
      <button class="cp-bouton cp-bouton--petit" type="submit">${t('Enregistrer')}</button>
    </form>`);
  }

  function lettre(c) {
    return carte('cp-carte--lettre', t('La lettre de la famille'), `<label class="cp-bascule"><input type="checkbox" data-lettre ${c.newsletter ? 'checked' : ''}>
      <span class="cp-bascule-curseur" aria-hidden="true"></span><span>${t('Une lettre par trimestre : la nouvelle enquête, les millésimes qui sortent de la réserve, les visites au château.')}</span></label>`);
  }

  function actions() {
    return `<div class="cp-actions">
      <button class="cp-lien" type="button" data-sortir>${t('Me déconnecter')}</button>
      <button class="cp-lien cp-lien--discret" type="button" data-effacer>${t('Effacer mes données de ce navigateur')}</button>
    </div>
    <p class="cp-maquette">${t("Maquette : rien n'est envoyé. Votre espace vit dans ce navigateur ; sur miailhe.com, il serait gardé sur nos serveurs.")}</p>`;
  }

  function afficher() {
    const c = lire('miailhe-client', null);
    if (!c || !MAIL.test(c.email || '')) { vue('accueil'); onglet('entrer'); return; }
    vue('tableau');
    document.querySelector('[data-bonjour]').innerHTML = tf('Bonjour, {0}.', `<em>${nomPropre(c.prenom)}</em>`);
    document.querySelector('[data-depuis]').textContent = c.depuis ? tf('Votre espace depuis le {0}', jour(c.depuis)) : '';
    document.querySelector('[data-grille]').innerHTML = commandes(c) + panier() + enquete(c) + chateau() + lettre(c) + coordonnees(c) + actions();
    lier(c);
  }

  function lier(c) {
    const grille = document.querySelector('[data-grille]');
    const f = grille.querySelector('[data-coordonnees]');
    f.addEventListener('submit', e => {
      e.preventDefault();
      const x = f.elements;
      if (!x.prenom.value.trim()) { x.prenom.focus(); return; }
      const neuf = { ...c, prenom: x.prenom.value.trim().slice(0, 40), nom: x.nom.value.trim().slice(0, 60), tel: x.tel.value.trim().slice(0, 30),
        adresse: { rue: x.rue.value.trim().slice(0, 120), cp: x.cp.value.trim().slice(0, 10), ville: x.ville.value.trim().slice(0, 60) } };
      garder(neuf); M.majEspace && M.majEspace();
      document.querySelector('[data-bonjour]').innerHTML = tf('Bonjour, {0}.', `<em>${nomPropre(neuf.prenom)}</em>`);
      const b = f.querySelector('button'); b.textContent = t('Enregistré'); setTimeout(() => { b.textContent = t('Enregistrer'); }, 1800);
      dire(t('Vos coordonnées sont enregistrées.'));
      c = neuf;
    });
    grille.querySelector('[data-lettre]').addEventListener('change', e => {
      c = { ...c, newsletter: e.target.checked }; garder(c);
      dire(e.target.checked ? t('Vous recevrez la lettre de la famille.') : t('Vous ne recevrez plus la lettre de la famille.'));
    });
    grille.querySelector('[data-sortir]').addEventListener('click', () => { oublier('miailhe-client'); M.majEspace && M.majEspace(); afficher(); dire(t('Vous êtes déconnecté.')); });
    // effacer : deux temps, pour ne pas tout perdre d'un clic
    const eff = grille.querySelector('[data-effacer]');
    eff.addEventListener('click', () => {
      if (!eff.dataset.sur) { eff.dataset.sur = '1'; eff.textContent = t("Confirmer : effacer mon espace, mes commandes et mon panier"); return; }
      const tous = clients(); delete tous[c.email]; ecrire('miailhe-clients', tous);
      ecrire('miailhe-commandes', (lire('miailhe-commandes', []) || []).filter(o => o && o.email && o.email !== c.email));
      ['miailhe-client', 'miailhe-panier', 'miailhe-coffrets', 'miailhe-demande', 'miailhe-devis'].forEach(oublier);
      M.majEspace && M.majEspace(); afficher(); dire(t('Vos données sont effacées de ce navigateur.'));
    });
  }

  afficher();
  window.addEventListener('storage', afficher);     // une commande passée dans un autre onglet
})();
