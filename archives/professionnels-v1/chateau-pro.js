/* Le comportement de l'ancienne page professionnels.html des châteaux (demande de devis, « Déjà client »),
   retiré de assets/js/chateau.js le 28/10/2026 : l'espace professionnel vit maintenant dans la boutique. */
  /* ---------- Espace professionnel : la demande de devis (maquette, rien n'est envoyé) ---------- */
  const pro = document.querySelector('main.pro');
  if (pro) {
    const form = pro.querySelector('.pro-form');
    const merci = pro.querySelector('.pro-merci');
    const erreur = pro.querySelector('.pro-erreur');
    const champVins = pro.querySelector('.pro-champ-vins');
    const infoFamille = pro.querySelector('.pro-famille-info');
    const versDemande = () => document.getElementById('demande').scrollIntoView({ behavior: reduit ? 'auto' : 'smooth' });
    const majFormat = () => {
      const famille = form.format.value === 'famille';
      champVins.classList.toggle('is-famille', famille);
      infoFamille.hidden = !famille;
    };
    form.querySelectorAll('[name="format"]').forEach(r => r.addEventListener('change', majFormat));
    // « Ajouter à ma demande » coche le vin dans le formulaire
    pro.querySelectorAll('[data-ajouter]').forEach(b => b.addEventListener('click', () => {
      const coche = form.querySelector(`[name="vins"][value="${b.dataset.ajouter}"]`);
      if (form.format.value === 'famille') form.querySelector('[name="format"][value="chateau"]').checked = true;
      coche.checked = true; majFormat();
      b.classList.add('is-ajoute'); b.textContent = 'Dans ma demande';
      versDemande();
    }));
    pro.querySelectorAll('[data-format]').forEach(b => b.addEventListener('click', () => {
      form.querySelector(`[name="format"][value="${b.dataset.format}"]`).checked = true; majFormat(); versDemande();
    }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.querySelectorAll('.is-faux').forEach(x => x.classList.remove('is-faux'));
      const manquants = [...form.querySelectorAll('[required]')].filter(x => (x.type === 'checkbox' ? !x.checked : !x.checkValidity()));
      manquants.forEach(x => x.classList.add('is-faux'));
      const aucunVin = form.format.value !== 'famille' && !form.querySelector('[name="vins"]:checked');
      if (manquants.length || aucunVin) {
        erreur.textContent = aucunVin ? 'Choisissez au moins un vin, ou la palette famille.' : 'Il manque quelques informations pour préparer le devis.';
        (manquants[0] || champVins).focus?.();
        return;
      }
      erreur.textContent = '';
      const lettre = (document.body.className.match(/ch-([a-z])/) || [])[1].toUpperCase();
      pro.querySelector('.pro-ref').textContent = `${lettre}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      form.hidden = true; merci.hidden = false; merci.focus();
    });
    pro.querySelector('[data-nouvelle]').addEventListener('click', () => {
      form.reset(); majFormat();
      pro.querySelectorAll('[data-ajouter]').forEach(b => { b.classList.remove('is-ajoute'); b.textContent = 'Ajouter à ma demande'; });
      merci.hidden = true; form.hidden = false;
    });

    // « Déjà client » : un lien de connexion par e-mail, pas de mot de passe
    const client = pro.querySelector('.pro-client');
    const fermer = () => { client.hidden = true; document.body.classList.remove('is-locked'); };
    pro.querySelectorAll('[data-client]').forEach(b => b.addEventListener('click', () => {
      client.hidden = false; document.body.classList.add('is-locked'); client.querySelector('input').focus();
    }));
    client.querySelector('.pro-fermer').addEventListener('click', fermer);
    client.addEventListener('click', e => { if (e.target === client) fermer(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !client.hidden) fermer(); });
    client.querySelector('a[href="#demande"]').addEventListener('click', fermer);
    client.querySelector('.pro-lien-form').addEventListener('submit', e => {
      e.preventDefault();
      const champ = e.target.email;
      champ.classList.toggle('is-faux', !champ.checkValidity() || !champ.value);
      if (champ.checkValidity() && champ.value) e.target.querySelector('.pro-lien-ok').hidden = false;
    });
  }

