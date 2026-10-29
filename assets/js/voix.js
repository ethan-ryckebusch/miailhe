/* La voix de l'hôte (28/10/2026, demande de l'utilisateur) : quand on entre dans un château, on l'entend dire
   « Bienvenue dans notre château », sur le son de son château. Une voix par génération, dessinée sur ElevenLabs (Voice
   Design) pour que l'écart s'entende : Louis le grand-père, très âgé, à Coufran ; Jean le père, une voix ordinaire
   d'homme de cinquante ans, à Verdignan ; Éric le fils, jeune, à Soudars. Fichiers : assets/audio/bienvenue-<château>.mp3,
   mixés par source/voix/mixer.py (voir source/voix/LISEZ-MOI.md).
   Un navigateur ne laisse une page parler qu'après un geste : la voix est préparée au clic (une porte de la vitrine,
   « Oui, entrer » sur le site d'un château), puis dite quand l'écran du château apparaît. Sans geste, elle se tait.
   La voix reste en français dans les trois langues du site : c'est la famille qui accueille, chez elle. */
(function () {
  const M = (window.MIAILHE = window.MIAILHE || {});
  const racine = (document.currentScript && document.currentScript.src || '').replace(/js\/voix\.js(\?.*)?$/, '');
  M.voix = cle => {
    const a = new Audio(`${racine}audio/bienvenue-${cle}.mp3`);
    a.preload = 'auto';
    a.volume = .9;
    // pendant le geste : une lecture muette aussitôt arrêtée, pour que la page ait le droit de parler ensuite (Safari)
    a.muted = true;
    const pret = a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {}).then(() => { a.muted = false; });
    return {
      // dit la phrase ; rend sa durée en secondes (0 si le navigateur l'a refusée ou si le fichier manque)
      dire: () => pret.then(() => a.play()).then(() => (isFinite(a.duration) ? a.duration : 2.4)).catch(() => 0),
    };
  };
})();
