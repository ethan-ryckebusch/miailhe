/* L'espace client et le panier, dans l'en-tête de chaque page (28/10/2026).
   Les deux icônes sont écrites par source/entete.py (et generer_chateaux.py pour les châteaux) ; ce script y met
   l'initiale du client connecté et le nombre de bouteilles du panier, lus dans ce navigateur :
     miailhe-client    le client connecté : {prenom, nom, email, tel, adresse: {rue, cp, ville}, newsletter, depuis}
     miailhe-panier    le panier de la boutique : {identifiant du vin : nombre de bouteilles}
     miailhe-coffrets  les coffrets des trois générations du panier : trois bouteilles chacun
   Maquette : rien n'est envoyé ; sur miailhe.com, le compte vivrait sur un serveur. Sur la boutique, boutique.js
   tient lui-même la pastille à jour à chaque ajout. */
(function () {
  const lire = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const maj = () => {
    const panier = lire('miailhe-panier') || {};
    const n = Object.values(panier).reduce((s, q) => s + (q > 0 ? +q : 0), 0) + 3 * ((lire('miailhe-coffrets') || []).length || 0);
    document.querySelectorAll('.entete-icone [data-panier-compte]').forEach(b => { b.textContent = n; b.hidden = !n; });
    const client = lire('miailhe-client');
    const initiale = client && client.prenom ? String(client.prenom).trim().charAt(0).toUpperCase() : '';
    document.querySelectorAll('[data-compte]').forEach(a => {
      a.classList.toggle('est-connecte', !!initiale);
      const i = a.querySelector('[data-compte-initiale]');
      if (i) { i.textContent = initiale; i.hidden = !initiale; }
    });
  };
  const M = (window.MIAILHE = window.MIAILHE || {});
  M.majEspace = maj;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maj); else maj();
  window.addEventListener('storage', maj);          // un autre onglet a changé le panier ou le compte
  window.addEventListener('pageshow', maj);         // retour arrière : la page sort du cache
})();
