# L'espace professionnel des châteaux, première version (retirée le 28/10/2026)

Chaque site de château avait sa page `professionnels.html`, avec un onglet « Professionnels » dans l'en-tête. On y trouvait :
- les palettes de 400 à 600 bouteilles, sur devis ;
- la palette famille, un tiers de chaque château ;
- les millésimes prêts à boire ;
- le kit importateur ;
- la note « nos partenaires d'abord » ;
- un formulaire de demande de devis, en maquette.

Le 28/10/2026, l'utilisateur a demandé de relier dans la boutique la partie particuliers (B2C) et la partie professionnels (B2B), avec un bouton pour passer de l'une à l'autre : « ça permet d'éliminer l'onglet Professionnel déjà présent sur le site ».

L'espace professionnel vit donc maintenant dans la boutique, côté « Professionnels » (`boutique.html?espace=pro`). Ses données viennent toujours de `source/generer_chateaux.py`, qui les écrit dans `assets/js/boutique-pro.js`. Les liens « Espace professionnel » du pied des châteaux, du menu et de la vitrine y mènent.

Ce dossier garde l'ancienne version :
- `coufran/`, `verdignan/`, `soudars/` : les trois pages telles qu'elles étaient générées ;
- `generer_chateaux.py` : le générateur d'avant le changement ;
- `chateau-pro.css` et `chateau-pro.js` : leurs styles et leur comportement, retirés de `assets/css/chateau.css` et de `assets/js/chateau.js`.
