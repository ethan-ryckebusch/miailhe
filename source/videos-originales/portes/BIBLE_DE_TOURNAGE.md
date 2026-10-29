# Les trois portes : bible de tournage (27/10/2026, cinquième version)

Demande de l'équipe : refaire les trois portes « selon le plan de tournage : même cadrage, même lumière, ouverture puis
travelling avant ». Les dessins des portes, validés, ne changent pas (Coufran, la porte en chêne blond à grilles Art déco ;
Verdignan, la grande porte bleue cintrée du vieux cuvier, sans date ; Soudars, la porte verte dans le mur de pierres
sèches). Ce qui change : les trois plans deviennent un vrai triptyque, tourné comme par une même équipe, le même jour.

## Les règles communes

| | Règle |
|---|---|
| Format | vertical 9:16, 2K (1536 × 2752) pour les images, 2K pour les films |
| Caméra | à hauteur d'homme (1,60 m), objectif 35 mm, dans l'axe de la porte, centrée ; verticales parfaitement droites, aucune fuyante |
| Cadrage | la porte, huisserie comprise, occupe la moitié de la hauteur : son haut à 24 % de l'image, son seuil à 74 % ; elle occupe la moitié de la largeur, au centre. Au-dessus, la façade ou le mur ; dessous, le sol (marches, pavés, cailloux). Ainsi la porte reste entière quand la colonne s'élargit au survol et quand le téléphone recadre sur les côtés |
| Lumière | fin d'après-midi d'automne, au moment des vendanges : soleil bas (30°) venant de la gauche, lumière dorée rasante sur la pierre, ombres douces portées vers la droite, ciel clair légèrement voilé ; même exposition pour les trois |
| Étalonnage | tons chauds, noirs denses légèrement relevés, saturation retenue, grain argentique fin ; ni lissé ni brillant « IA » |
| Ouverture (film 1) | caméra fixe ; les deux battants s'ouvrent vers l'intérieur, ensemble, lentement, d'un mouvement régulier ; aucun autre mouvement |
| Travelling (film 2) | les battants sont ouverts ; la caméra avance lentement dans l'axe, stable comme sur un rail, franchit le seuil et s'arrête un pas à l'intérieur |
| Intérieur | plus sombre que la façade, éclairé de lampes chaudes et du jour qui entre par la porte ; au fond, toujours, une ouverture lumineuse sur le paysage du château : la même composition en profondeur pour les trois |

## Ce qu'il y a derrière chaque porte

- **Coufran (Louis, 1924)** : un vestibule des années 1920, sol en damier de pierre, une console où est posée une photo de famille ancienne ; au fond, une porte-fenêtre ouverte sur les rangs de merlot et le pigeonnier-belvédère (tour carrée, lanterne vitrée, toit pyramidal, drapeau).
- **Verdignan (Jean, 1972)** : le vieux cuvier, sa charpente de chêne et ses lampes chaudes, devenu la réserve où les
  bouteilles attendent : de chaque côté de l'allée pavée, des casiers grillagés empilés jusqu'aux poutres, pleins de
  bouteilles couchées, culots tournés vers l'allée (comme sur les photos « casiers » et « culots » du site de
  Verdignan) ; au fond, une grande porte ouverte sur l'estuaire de la Gironde, sous la lumière du soir. C'est le vin de
  garde du père, « gardé pour vous » : les bouteilles vieillissent au château et ne partent que prêtes à boire.
  Refait le 28/10/2026 : l'utilisateur a remarqué que Verdignan et Soudars ouvraient sur la même chose (une allée de
  barriques sous des lanternes) ; Soudars garde son chai, demandé par l'utilisateur le 27/10/2026. Ainsi les trois
  portes racontent trois choses : la maison de Louis, les bouteilles qui attendent chez Jean, le chai d'Éric. Les
  barriques de Verdignan sont dans `Archives/v6-verdignan-barriques/`.
- **Soudars (Éric, 1973)** : le chai à barriques aux murs de pierres sèches, éclairé de lanternes ; au fond, une fenêtre ouverte sur les vignes et les murets.

## Sur le site

Le film 1 (l'ouverture) se joue au survol et se rejoue à l'envers quand on s'en va ; le film 2 (le travelling) se joue
au clic, à la suite, puis l'écran prend la couleur du château. Les deux films sont montés bout à bout dans un seul
fichier ; le site s'arrête à la fin de l'ouverture au survol.

## Contrôle avant livraison

- mesurer le mouvement image par image (pas de plan figé, pas de saut) ;
- vérifier la géométrie des battants (pas de déformation, pas de troisième battant, gonds cohérents) et la continuité
  entre la fin du film 1 et le début du film 2 ;
- encodage web avec une image clé toutes les 8 images, pour une lecture à l'envers fluide.

## Ce qui a été tourné (27/10/2026)

- **Images clés** (Nano Banana Pro, 2K) : `<château>-1-fermee.png`, `-2-ouverte.png`, `-3-interieur.png`. La porte fermée
  de Coufran a servi de référence de cadrage et de lumière pour les deux autres ; les portes ouvertes sont des retouches
  des portes fermées (rien ne bouge hors de l'embrasure), les intérieurs prolongent ce qu'on voit par la porte.
  Les trois portes s'ouvrent vers l'intérieur. Celle de Verdignan s'ouvrait d'abord vers l'extérieur, comme une porte de
  chai, pour garder son bleu à l'image ; l'utilisateur l'a remarqué le 28/10/2026 (« Pourquoi la porte du château du
  milieu s'ouvre dans le sens inverse des autres ? ») : ses battants se replient maintenant contre l'embrasure, côté
  intérieur, comme à Coufran et à Soudars.
- **Films** : MiniMax H3 en 2K (image de départ et image de fin), retenu après comparaison avec FLUX 3 Video sur la porte
  de Verdignan : mouvement plus régulier (aucun saut d'image), départs et arrêts en douceur, définition plus haute.
  `<château>-ouverture.mp4` (caméra fixe, 5,17 s) et `<château>-travelling.mp4` (5,17 s). Toutes les prises, retenues ou
  non (dont celles de FLUX), sont dans `prises/`.
- **Verdignan vers l'intérieur (28/10/2026)** : `verdignan-2-ouverte.png` retouche la porte fermée, battants repliés
  contre l'embrasure côté intérieur, la réserve de bouteilles et l'estuaire derrière ; ouverture et travelling retournés
  (prises A, `prises/verdignan-interieur-*` ; l'image de fin du travelling ne change pas). La version aux battants
  ouverts vers l'extérieur est dans `Archives/v7-verdignan-vers-l-exterieur/`.
- **Même vitesse d'ouverture** (28/10/2026, demande de l'utilisateur : « les portes doivent s'ouvrir à la même vitesse ») :
  les prises ne partaient pas au même moment (Coufran à 0,5 s, Soudars à 0,9 s) ni au même rythme. `monter_portes.py`
  mesure le degré d'ouverture de chaque porte, image par image, et cale les trois ouvertures : ouvertes à 10 % à 0,6 s,
  à 90 % trois secondes plus tard, posées à 4,9 s (le data-ouverture des trois portes).
- **Montage** : `python3 source/monter_portes.py` (720 × 1280, 24 i/s, sans son ; une image clé toutes les 8 images
  pendant l'ouverture ; 3,4 à 5,3 Mo par film). Contrôle : mouvement mesuré image par image, géométrie des battants
  vérifiée sur les planches contact.
- La version précédente (portes tournées séparément, cadrages et lumières différents) est dans
  `Archives/v5-avant-bible-de-tournage/`.
- **Verdignan, seconde prise (28/10/2026)** : `verdignan-2-ouverte.png` et `verdignan-3-interieur.png` sont des retouches
  des images précédentes où seules les barriques deviennent des casiers de bouteilles (références : `verdignan-casiers.jpg`
  et `verdignan-culots.jpg` du site) ; la porte, la façade et le cadrage ne bougent pas. Prises écartées dans `prises/`.
- **Verdignan, travelling repris (28/10/2026)** : l'utilisateur voyait les casiers rétrécir quand on franchit la porte.
  L'image de fin, retouchée de l'ancien intérieur aux barriques, ne prolongeait pas ce qu'on voit par la porte : casiers
  à cases plus petites, porte du fond trop lointaine ; MiniMax « reculait » donc en avançant (la porte du fond
  rétrécissait 19 fois pendant le plan, la vitesse d'avancée chutait de moitié au seuil). Nouvelle image de fin tirée
  de la porte ouverte (« plan suivant du même film », mêmes casiers, même taille de bouteilles, porte du fond deux fois
  plus grande) ; prise C retenue : la porte du fond grandit sans à-coup et l'avancée reste régulière au seuil. Vitesse
  de lecture 1,44. L'ancienne image de fin et les prises écartées sont dans `prises/`.
- Une variante de Soudars ouvrant sur ses vignes (allée enherbée, pierres blanches, clocher au loin) a été tournée le
  28/10/2026 puis écartée : l'utilisateur avait demandé le 27/10/2026 que Soudars ouvre sur un chai intérieur, après une
  version qui ouvrait déjà sur un enclos de vignes. Ses images et films sont dans `prises/soudars-vignoble-*`.
