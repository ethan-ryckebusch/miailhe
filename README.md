# Site vitrine MIAILHE et sites des trois châteaux (maquette de concept)

Site statique en HTML, CSS et JavaScript. Pas d'installation. Les pages des châteaux sont produites par un petit script Python (voir plus bas).

## Ouvrir le site

Double-cliquer sur `★ MIAILHE Vitrine V1.html` : il s'ouvre dans le navigateur. Toutes les polices sont dans `assets/fonts/` : aucune connexion n'est nécessaire.

Pour le servir en local (recommandé pour une démo) :

```bash
python3 -m http.server 4173
```

puis ouvrir http://localhost:4173 dans le navigateur et cliquer sur `★ MIAILHE Vitrine V1.html`. La commande se lance depuis ce dossier.

- **Mode capture :** ajouter `?capture` à l'adresse, par exemple `★ MIAILHE Vitrine V1.html?capture`. L'intro et les portes d'âge disparaissent, tout est visible d'emblée. Cela sert aux captures d'écran de présentation et marche sur toutes les pages.
- **Revoir l'intro :** elle se joue une fois par visite (mémorisé dans le `sessionStorage`). Pour la revoir, ouvrir le site dans un nouvel onglet. Un clic ou une touche la passe.
- **Rejouer l'Enquête :** la progression est gardée dans le navigateur. Le bouton « Rejouer l'enquête », à la fin, remet tout à zéro.
- **Langues :** « Fr / En / 日本語 » en haut à droite, dans le menu, sur la porte d'âge et en pied de page ; ou `?lang=en`, `?lang=ja` dans l'adresse. Le choix est gardé pour les visites suivantes (voir « Les langues » plus bas).

## Pages

| Fichier | Contenu |
|---|---|
| `★ MIAILHE Vitrine V1.html` | La marque mère. L'intro (sarment, trois feuilles, logos des châteaux) et la porte d'âge, puis l'accueil : les trois portes filmées, et rien d'autre. Les onglets de l'en-tête ouvrent chacun un panneau au-dessus des portes : « La famille » (une histoire en racines de vigne), « Le terroir » (la planche de la racine et la carte), « Prêt-à-boire », « Où nous trouver » (la carte de France des magasins). Le test s'ouvre depuis l'invitation et le menu (voir plus bas). |
| `boutique.html` | La boutique de la famille, en deux espaces et un bouton pour passer de l'un à l'autre : les particuliers (les vins des trois châteaux, un seul panier) et les professionnels (palettes sur devis, l'ancien onglet « Professionnels » des châteaux) ; voir plus bas. |
| `compte.html` | L'espace client : connexion par e-mail, les commandes de la boutique, le panier, l'enquête, le château du test, les coordonnées (voir plus bas). Maquette, tout vit dans le navigateur. |
| `quiz.html` | Le test de découverte « Quel château vous ressemble ? » seul, pensé pour le téléphone : c'est la page des QR codes (`Recommandation/Quiz_QR/`). |
| `identite.html` | La charte de la marque, à montrer à la cliente : le logo, les armoiries, les couleurs, les motifs et la typographie, et pourquoi. |
| `instagram.html` | Le compte Instagram de la famille, avant et après : la copie fidèle de la page @chateauxcoufranverdignan et, au bouton « Après », le même compte renommé @famillemiailhe (il garde ses 1 905 abonnés) (voir `Recommandation/Instagram/LISEZ-MOI.md`). L'icône Instagram de toutes les pages y mène. |
| `enquete.html` | L'« Enquête à la racine », jouable : un livret de six étapes ouvert sur un bureau, une double page par étape (voir plus bas). |
| `coufran/`, `verdignan/`, `soudars/` | Les sites des trois châteaux, mis en page d'après privios.com. Chacun a un accueil (`index.html`), une page `famille.html` et une fiche par vin ; leur espace professionnel est passé dans la boutique le 28/10/2026 (`archives/professionnels-v1/`). |
| `prototypes/` | Deux intros alternatives, non retenues (voir plus bas). |
| `archives/chateaux-v1/` | Les premières pages château (avant Privios), pour l'historique. |
| `archives/vitrine-v1/` | La première vitrine (la surface, la descente sous terre en cinq actes, les racines procédurales), avec ses scripts `racines.js` et `vignettes.js`. |
| `archives/vitrine-v2-privios-sombre/` | La deuxième vitrine, sombre, d'après Privios (film, cinq chapitres, galerie, œnologue, Enquête, carrousel), jugée trop longue et trop sombre. |
| `archives/vitrine-v3-arches/` | La troisième vitrine (trois arches aux films d'intro, titre centré), jugée « très IA » et pas assez cinématique le 27/10/2026. |
| `archives/vitrine-v4-six-actes/` | La quatrième vitrine : les portes, puis six actes qui défilaient dessous (la racine, la frise, le prêt-à-boire, le test, la carte), remplacée le 27/10/2026 par l'accueil aux portes seules et ses onglets. |
| `archives/enquete-v1-page-arrachee/` | La première Enquête, « La page arrachée » (le carnet d'Élie, trois témoins, RACINE en trois morceaux). |
| `archives/chateaux-v2-ateliers/` | Les sites des châteaux en version sombre, avec leurs « ateliers » interactifs (roue, cave, garde, loupe, gabarres, invitation, épierrage), retirés le 27/10/2026. |

## La vitrine après l'entrée : les portes, et des onglets

Refaite le 27/10/2026 (cinquième version), à la demande de l'équipe : l'accueil ne montre que les trois portes (la page ne défile plus), et l'en-tête porte quatre onglets propres à l'accueil, à côté du menu : **La famille**, **Le terroir**, **Prêt-à-boire**, **Où nous trouver** (le quatrième était « Le test » jusqu'au 28/10/2026). Au survol d'un onglet, une fine racine pousse sous le mot, lâche une radicelle et s'achève en feuille de vigne rouge, comme les racines du logo ; l'onglet ouvert la garde (`assets/js/survol.js`, le même sur le menu des châteaux, feuille dans la couleur du château). Elle remplace le trait de soulignement. Chacun ouvre un panneau plein écran au-dessus des portes, qui défile sur lui-même (`assets/js/onglets.js`) ; « Le test » ouvre le test. Le 28/10/2026, « Le test » a quitté l'en-tête et **« Où nous trouver »** y est entré, à la demande de l'utilisateur (« un onglet pour la carte ») : son panneau clair porte la grande carte de France de la boutique (`#ou-trouver`), la même, dessinée par `carte-france.js`. Ses deux scripts (la carte, 400 Ko de magasins) ne se chargent qu'à la première ouverture du panneau (`data-scripts`, lu par `onglets.js`), et ses liens « Commander en ligne » et le drive mènent à la boutique (`data-boutique`). Les styles de la carte sont sortis de `boutique.css` dans `assets/css/carte-france.css`, chargé par les deux pages. Avec quatre onglets, l'en-tête les resserre sous 1 360 px et les passe sous la barre sous 1 120 px, avant qu'ils ne touchent le logo. On revient aux portes par « Revenir aux portes » (en bas de chaque panneau, avec l'onglet suivant), par le logo, en recliquant l'onglet ou avec Échap. Les adresses suivent (`#famille`, `#terroir`, `#pret-a-boire`, `#ou-trouver`, `#test`), et les anciennes ancres restent valables : une ancre placée dans un panneau (`#racine`, `#visiter`, `#contact`) ouvre le panneau et y descend, `#histoire` mène à « La famille ». Sous les portes, une fine bande noire, comme le bas d'un plan de cinéma (`.seuil-bas`), porte la consigne « Approchez-vous d'une porte · ou laissez-vous guider » et, dessous, la mention sanitaire, chacune sur une seule ligne ; les réseaux de la famille sont au bout de la bande, à droite (sous la mention sur téléphone, demande de l'utilisateur, 28/10/2026) : la consigne ne passe plus sur la porte du milieu, elle reste donc toujours visible, même porte ouverte, et ne gêne plus le bouton « Entrer ». La version précédente, en six actes qui défilaient sous les portes, est dans `archives/vitrine-v4-six-actes/`.

- **La famille** (`assets/js/histoire.js`) : l'histoire de la famille racontée comme l'intro du site, avec les mêmes outils de dessin (`MIAILHE.vigne`, exposés par `intro.js`). Sur fond noir, une racine de vigne descend au fil du défilement, sa pointe lumineuse toujours aux deux tiers de l'écran ; à chaque génération, une racine part vers le récit et s'achève en feuille (rouge pour Élie et Lovely, dans la couleur du château pour Louis, Jean et Éric), et le récit sort du flou quand elle l'atteint : Élie, courtier à Bordeaux à la fin du XVIIIe siècle (date d'Élie à vérifier, d'où pas d'année), Louis et Coufran (1924), Jean et Verdignan (1976), Éric et Soudars (1980), Lovely (2006). En bas, la racine se divise en trois, chacune dans la couleur de son château, et rejoint les logos de Coufran, Verdignan et Soudars : « Trois châteaux, une même racine. » Puis la famille en 1931 et aujourd'hui, et « Pousser une porte ». La forme se recalcule à chaque changement de mise en page ; sur téléphone, la racine longe le bord gauche.
- **Le terroir** et **Prêt-à-boire** ont été refaits le 28/10/2026 en séquences cinématiques (l'utilisateur les trouvait « moches » : « je veux du cinématique et du beau visuellement avec ce côté famille très important pour la cliente »). Vraies photos et vrais films des sites des châteaux, menés par le défilement dans `assets/js/plans.js` (`[data-plan]` : un plan qui s'approche ; `[data-sequence]` : des étapes épinglées ; `[data-apparait]` : un texte qui sort du flou). La version précédente est dans `archives/onglets-v1-terroir-pret-test/`.
  - **Le terroir** (clair) : l'estuaire en ouverture, « Avant le vin, il y a la terre » ; la phrase de Verdignan « Les grands terroirs regardent l'eau » ; trois sols racontés par génération (Louis 1924 et la colline de graves de Coufran, Jean 1976 et les graves face à l'eau de Verdignan, Éric 1980 et l'argile sur le calcaire de Soudars) ; la planche de la racine (ci-dessous) ; la carte avec les hectares de chaque domaine ; « La famille vous ouvre ses portes » sur la photo d'Éric et Lovely ; le pied de page (contact, adresse, réseaux). Faits tirés des sites miroirs des trois châteaux.
  - **Prêt-à-boire** (sombre) : « Nous attendons pour vous » sur le local climatisé de Coufran, puis « L'histoire d'une bouteille » : un Verdignan 2005 (premier millésime au numéro de lot gravé) en six étapes, les vendanges, l'assemblage de décembre, douze mois en barriques, la mise en bouteille, les années de garde au château (un compteur d'années, avec Lovely en 2006 et le centenaire de Coufran en 2024), et prêt à boire aujourd'hui. Une frise en bas marque « Ailleurs, il part ici » et « Chez les Miailhe, ici ». Puis « La cave de la famille » : le plus vieux millésime encore en boutique de chaque château, avec un lien vers la boutique. Le début du compteur en 2007 est déduit du processus décrit par les sites (assemblage en décembre, douze mois en barriques), il n'est pas sourcé.
- **Le test** : le test de découverte, au-dessus des portes (voir plus bas). Refait le 28/10/2026 : plein écran, les trois portes fermées derrière les questions, chacune avec son logo et son hôte ; la porte du château en tête s'éclaire à chaque réponse ; au résultat, elle s'ouvre en plein écran avec sa légende et le château se présente à côté. `quiz.html` reprend la même mise en scène dans une carte. Questions et décompte inchangés.

### Le seuil, la planche et les contenus des onglets

Refaite le 27/10/2026 (troisième version) : l'équipe trouvait la page précédente « très IA », sans storytelling cinématique, et voulait mettre en valeur les trois grandes portes, qui s'ouvrent au survol sur l'univers de chaque château.

1. **Le seuil.** Trois vraies portes, côte à côte sur toute la hauteur de l'écran, chacune dans le style de l'histoire de son château et dans sa couleur. Refaites le 27/10/2026 selon une bible de tournage commune (`source/videos-originales/portes/BIBLE_DE_TOURNAGE.md`) : même caméra à hauteur d'homme, même objectif, même cadrage (la porte occupe la moitié de la hauteur, au même endroit), même lumière dorée de fin d'après-midi venue de la gauche, même étalonnage. Les trois plans forment un triptyque :
   - **Coufran** : la porte en chêne blond aux grilles Art déco dorées, la façade de la fin du XIXe, le balcon, les orangers en caisses de Versailles. Elle s'ouvre sur un vestibule des années 1920 au damier noir et blanc, la photo de famille sur la console, et au fond, par la porte-fenêtre, le pigeonnier-belvédère au bout de l'allée de merlot ;
   - **Verdignan** : la grande porte bleue cintrée du vieux cuvier, sans date, la flèche du château au-dessus du toit. Ses battants s'ouvrent vers l'intérieur, comme ceux des deux autres portes (ils s'ouvraient vers l'extérieur jusqu'au 28/10/2026), sur le cuvier devenu la réserve où les bouteilles attendent : des casiers grillagés jusqu'aux poutres, pleins de bouteilles couchées, culots vers l'allée, et l'estuaire au bout. C'est le vin de garde du père, « gardé pour vous » (refait le 28/10/2026 : Verdignan et Soudars ouvraient tous deux sur une allée de barriques ; Soudars garde son chai, demandé le 27/10/2026) ;
   - **Soudars** : la porte verte dans le mur de pierres sèches, coquelicots et cailloux blancs au pied. Elle s'ouvre sur le chai à barriques éclairé de lanternes, et au fond une fenêtre sur les vignes.
   **Deux plans par porte.** Au survol, l'ouverture (caméra fixe) se joue et s'arrête porte ouverte (`data-ouverture`, en secondes ; les trois ouvertures sont calées par `monter_portes.py` pour partir au même moment et s'ouvrir au même rythme, demande du 28/10/2026) ; quand on s'en va, le film se rembobine. Au clic, le film enchaîne un travelling avant qui franchit le seuil et s'arrête un pas à l'intérieur ; la lumière au bout du passage grandit alors en cercle et devient la couleur du château, avec son motif, son armoirie, son logo et son hôte (« Chez Jean, le père ») : exactement l'écran par lequel s'ouvre le site du château quand on arrive par la vitrine (`?porte`), qui n'a plus qu'à s'effacer en fondu sur son film. Le site du château ne rejoue donc pas de battants (corrigé le 27/10/2026 : on franchissait deux portes de suite, la seconde s'ouvrant par saccades). Pendant l'entrée, les autres portes ne réagissent plus au survol. **Même vitesse de travelling pour les trois portes** : la caméra n'avance pas de la même distance dans les trois films (la scène grossit de 2,2 fois chez Coufran, 2,6 chez Verdignan, 2,5 chez Soudars, en autant de temps) ; `source/monter_portes.py` mesure cette avance image par image (OpenCV) et en déduit la vitesse de lecture de chaque travelling, `data-travelling` sur la porte (Coufran 1,7, la référence ; Verdignan 1,39 ; Soudars 1,48), que `vitrine.js` applique. Sur téléphone, la porte qu'on regarde s'ouvre seule ; un toucher fait entrer.
   **Fabrication :** images Nano Banana Pro (la porte fermée de Coufran sert de référence de cadrage et de lumière aux deux autres ; les portes ouvertes sont des retouches des portes fermées), films MiniMax H3 en 2K (image de départ, image de fin), montage par `python3 source/monter_portes.py` (720 × 1280, une image clé toutes les 8 images pendant l'ouverture, pour que le retour en arrière reste fluide). Originaux et prises dans `source/videos-originales/portes/` ; les versions précédentes dans son dossier `Archives/`.
   **La carte invisible (corrigé le 27/10/2026).** La carte « Première visite ? » restait posée, invisible, sur le bas de la porte du milieu une fois refermée : sa règle `display: grid` l'emportait sur l'attribut `hidden`. En descendant vers « Entrer », la souris la touchait, la porte se refermait et la consigne « Approchez-vous d'une porte » revenait. `main.css` cache désormais tout `[hidden]` (`display: none !important`), et la consigne ne capte plus la souris quand une porte est ouverte.
   **L'invitation, avant les portes.** Après la porte d'âge, une carte se pose sur les portes : « Première visite ? Trois portes, trois châteaux. Laquelle est la vôtre ? », avec « Me laisser guider » et « Je connais la maison, je choisis ma porte ». Elle n'est jamais obligatoire : un clic à côté, une porte survolée ou Échap la referment pour la visite (`sessionStorage`) ; la croix la referme pour de bon (`localStorage`, clé `miailhe-guide`), et elle ne revient plus une fois le test fait (`miailhe-test-fait`). Le test s'ouvre alors au-dessus des portes (`.test-voile`) ; son résultat ferme le voile, marque la bonne porte « Votre porte » et l'ouvre. En bas du seuil, « ou laissez-vous guider » le rouvre à tout moment.
2. **La racine.** Une planche gravée et aquarellée, comme une coupe de géologue : les trois châteaux côte à côte (Coufran et son pigeonnier, Verdignan et sa flèche, Soudars et son enclos), chacun avec son cartouche (nom, année, génération), et sous eux leur sol commun : graves, argile, calcaire à fossiles marins. Au défilement, une racine pousse sous chaque château, dans sa couleur (or, bleu, vert), traverse les sols, et les trois se rejoignent ; leurs couleurs se fondent dans l'encre de la racine commune, qui sort de la planche et devient le I-racine du logo. Le sens du concept (trois châteaux différents en surface, une même famille dessous) se lit d'un coup d'œil : l'équipe trouvait le film précédent trop cinématique, sans que l'on comprenne que la racine relie les trois châteaux. La planche tient toujours entière dans l'écran ; sur téléphone, une planche haute la remplace.
   - **Fabrication :** deux images Higgsfield (Nano Banana Pro) par format, d'après les cartes postales des châteaux : la planche sans racines, puis la même où seules les racines ont été ajoutées à l'encre rouge pure (`source/racine-planche/`). `source/racine_planche.py` en tire le masque des racines, les recolore, calcule pour chaque pixel quand il pousse (la distance le long de la racine depuis le pied de son château, puis la racine commune) et écrit `assets/img/racine/planche-*.jpg` et `assets/js/racine-planche.js`. La page dessine la pousse en WebGL ; les images du calque y sont en data: URI, car Chrome refuse à WebGL les images lues sur `file://`.
   - Les versions précédentes : le film de la descente sous terre (`source/videos-originales/racine/Archives/v1-film-descente/`), et avant lui les racines dessinées en SVG, jugées « moches ».
3. **La famille :** « Avant de faire du vin, les Miailhe l'ont goûté ». La frise des cinq générations, puis la famille en 1931 et aujourd'hui.
4. **Le temps : le prêt-à-boire.** Ce qui distingue la famille de ses concurrents : « Nous attendons pour vous ». Un grand bordeaux n'est prêt qu'après quelques années ; d'ordinaire il quitte le château jeune, chez les Miailhe il vieillit au château et ne part que lorsqu'il est prêt. Sur la photo du local climatisé de Coufran, une courbe (schéma indicatif) montre où le vin part ailleurs et où il part chez eux, puis trois points : le temps pris au château (Coufran et Verdignan, local climatisé), le vin à ouvrir le soir même, le numéro de lot gravé sur chaque flacon depuis le millésime 2005. Soudars, lui, se boit dès sa jeunesse. Les faits viennent des pages « Vigneron du prêt-à-boire » et « De la vigne à la bouteille » des sites de Coufran et de Verdignan.
5. **Le test de découverte « Quel château vous ressemble ? »** (`assets/js/quiz.js`, refait le 27/10/2026 d'après la consigne de l'équipe) : sept questions simples, cinq sur la découverte, la tradition, l'histoire, l'expérience et le lieu, puis deux sur le goût, sur ce qu'on aime et ce qu'on a l'habitude de boire (demande de l'équipe) : au quotidien, un café serré et noir (Verdignan), un café crème ou un chocolat chaud (Coufran), un jus de fruits pressés ou un thé aux fruits rouges (Soudars) ; puis le vin qu'on aime, rond et souple (Coufran), plein et droit, qui gagne à attendre (Verdignan), fruité et frais, déjà bon jeune (Soudars). Rien ne demande de connaître l'œnologie. Le résultat ajoute « Son goût ».
   **Mis en avant partout (27/10/2026, l'équipe trouvait le test trop peu visible) :** « Le test » dans l'en-tête (un onglet sur la vitrine, un lien à gauche sur l'Enquête, une pilule sur les sites des châteaux ; depuis le 28/10/2026, la droite de l'en-tête de la maison est à la boutique et à l'enquête) ; l'invitation avant les portes ; une petite pastille « Quel château vous ressemble ? » en bas de l'écran pendant la descente de la vitrine (cachée sur le seuil, l'acte V et le pied de page, refermable, absente une fois le test fait) ; l'acte V, avec les trois portes en vignette ; et sur chaque site de château, un bandeau « Coufran, Verdignan ou Soudars : lequel vous ressemble ? » avant le témoin. Sur la vitrine, tous ces boutons ouvrent le test au-dessus des portes (`[data-ouvrir-test]`) ; ailleurs, ils mènent à `quiz.html`. Les réponses sont mélangées à chaque question ; la majorité donne le château, et à égalité la réponse la plus récente parmi les ex aequo l'emporte. Le résultat est une découverte, pas une recommandation de consommation : la carte du château (armoirie et logo), son histoire, son univers, « une clé pour comprendre » (une notion expliquée simplement : le terroir, l'assemblage, le vin de garde), puis où aller sur le site (la porte du château, sa page famille, son témoin de l'Enquête) et les trois châteaux voisins d'une même famille. Une mention le rappelle sous le bouton de départ et sous le résultat. Le même test a sa page pour les QR codes : `quiz.html`. La première version (le quiz de l'équipe, « Quel vin de la Famille Miailhe vous ressemble le plus ? ») est dans `archives/quiz-v1-texte-equipe/`.
6. **Le Médoc :** la carte (`assets/img/carte-medoc.svg`) et les rendez-vous.

Titres en Cormorant, le mot fort en Canela italique ; chaque acte a son sur-titre en Cinzel. Sur les portes et la planche de la racine, le nom de chaque château est son logo (voir « Typographie et logos des châteaux »).

L'Enquête n'a plus de section sur la vitrine : on y accède par le bouton « L'enquête », en haut de chaque page, par le menu et par le pied de page.

**Les vrais films des domaines :** `Château COUFRAN.mp4` et `Château VERDIGNAN.mp4`, à la racine du projet, sont les films promotionnels des châteaux. `source/decouper_films.py` en tire des boucles silencieuses (`assets/video/vitrine-*`, `savoir-*`), qui ne sont plus utilisées depuis la refonte mais restent prêtes pour les réseaux. Ces fichiers sont en basse définition : demander les originaux aux châteaux, et leur accord.

## Les armoiries des châteaux

Deuxième version, du 27/10/2026 (`Logos/ARMOIRIES/`, première version dans `Logos/ARMOIRIES/Archives/v1/`). Les trois armoiries partagent tout, sauf leur couleur, leur lettre et leur année :

- le même bouclier, à pans coupés en haut et en pointe douce en bas, avec un filet gravé ;
- en chef, les trois feuilles de vigne du logo : la feuille du château est pleine, les deux autres au trait ;
- la lettre (C, V, S) et l'année d'entrée dans la famille (1924, 1976, 1980), en Cinzel, la romaine cousine du logotype.

`assets/js/armoiries.js` contient leurs tracés : le site les injecte dans chaque élément `.armoirie[data-armoirie]` ou `.embleme[data-armoirie]`, comme le logo. Depuis le 28/10/2026, les armoiries ne sont plus dans l'en-tête que sur les sites des châteaux (demande de l'utilisateur : ni sur l'accueil, ni sur la boutique, l'Enquête, le test ou l'espace client). Partout sur le site, ce sont les armoiries complètes, les officielles de la marque (demande de l'utilisateur, 28/10/2026 : « quand tu mets les armoiries sur le site je veux les armoiries officiels qu'on a fait ») : sélecteur de l'en-tête des châteaux, portes, boutique, coffret, pieds de page, Enquête ; en pleine couleur, jamais estompées. La version « petit » (bouclier et lettre) n'est plus utilisée sur le site. **Une armoirie garde toujours la couleur exacte de son château** (or `#a97d2e`, bleu `#0f4366`, vert `#0f320a`), jamais sa version claire : sur un fond sombre (en-têtes sur les films, portes, film d'ouverture et pied de page des châteaux, couverture de l'Enquête), le bouclier est posé sur son contour en ivoire (`bouclier` dans `armoiries.js`, injecté en `.armoirie-fond` ; `--armoirie-fond: #f6f2e9`), si bien que la lettre, les feuilles et le filet restent lisibles. Seule exception, l'armoirie blanche posée sur la couleur du château (passage d'une porte, écran d'arrivée). Ne pas modifier `armoiries.js` à la main : il est régénéré par `Logos/source/construire_armoiries.py`.

## Les couleurs et les motifs

Les trois couleurs ont été choisies par l'équipe le 27/10/2026 : or `#a97d2e` (Coufran), bleu estuaire `#0f4366` (Verdignan), vert bouteille `#0f320a` (Soudars). Le même jour, le rouge sang-de-bœuf a été remplacé par le bleu, donné à Verdignan. Chacune a, calculées en OKLCH dans la même teinte, une encre pour le texte, une teinte très claire et une teinte claire pour les fonds, un fond sombre, et une version lumineuse (`--coufran-vif`…, `--vif` sur les sites) pour les fonds sombres, où le bleu et le vert s'éteindraient. Elles sont dans `main.css` (`--coufran`, `--coufran-teinte`…) et dans `chateau.css` (`.ch-coufran`…). La justification est dans `identite.html`.

Les motifs (quatrième version, 27/10/2026) partent chacun d'un élément réel de l'histoire du château, et sont gravés de la même main, en taille-douce, comme les gravures des étiquettes (un trait, des hachures, des aplats) :
- **Coufran, le pigeonnier dans les rangs :** la tour-belvédère à ses vraies proportions (corps carré, lanterne vitrée, toit d'ardoise, mât et drapeau) au bout de l'allée de vigne, dont les rangs fuient vers elle en éventail, le soleil levant de l'Art déco de 1924 ; quelques pigeons ;
- **Verdignan, l'estuaire gravé :** le vrai trait de côte de la Gironde (OpenStreetMap, ODbL), l'eau gravée de hachures horizontales comme le ciel de l'étiquette de Verdignan, les îles en blanc, le château marqué du signe des cartes (`Logos/MOTIFS/Estuaire_vectoriel/estuaire.py`) ;
- **Soudars, les jeunes ceps sur la friche :** en 1980, Éric choisit des parcelles « en friche et encombrées de tonnes de pierres » et replante presque tout le vignoble (site du château). Chaque jeune plant a sa butte de terre, son piquet, son point de greffe, son rameau attaché au piquet et trois feuilles de vigne pleines, dessinées comme celles du logo MIAILHE ; au pied, des touffes d'herbe et des pierres. Plantés en quinconce. Il remplace l'oursin fossile de la v3, que l'équipe trouvait sans rapport avec le vin (`Logos/MOTIFS/Archives/v3_oursin_soudars/`).

Ce sont des tuiles SVG raccordables (`assets/img/motifs/`), générées par `Logos/source/construire_motifs.py`, que le site utilise comme masques CSS (classe `.motif`), donc dans n'importe quelle couleur. Le même script écrit `assets/css/motifs.css`, où les tuiles sont intégrées en data: URI (`--motif-coufran`, `--motif-verdignan`, `--motif-soudars`) : Chrome refuse un masque chargé depuis un fichier quand on ouvre le site sans serveur (`file://`). Les feuilles de style pointent donc sur ces variables, jamais sur les fichiers `.svg`. La deuxième version (les mêmes sujets au trait seul) est dans `Logos/MOTIFS/Archives/v2_pigeonnier_estuaire_oursin/`, la première (éventails, vagues, pierres sèches) dans `Logos/MOTIFS/Archives/v1_ecailles_et_pierres/`.

## La carte du Médoc

`source/carte.py` dessine la carte dans l'esprit de privios.com/about.html, d'après les vraies coordonnées des côtes et des rives de l'estuaire. Elle montre les appellations Médoc et Haut-Médoc, quelques villes, et une bulle qui grossit Saint-Seurin-de-Cadourne sur les trois domaines (contours indicatifs). Le générateur l'insère dans la page famille de chaque château, aux couleurs du château, et `python3 source/carte.py` écrit `assets/img/carte-medoc.svg` pour la vitrine.

## Le menu (d'après Château Cheval Blanc)

La vitrine et l'Enquête reprennent le menu de chateau-cheval-blanc.com. Il est écrit dans les deux pages par `source/menu_principal.py` : le modifier là, puis relancer `python3 source/menu_principal.py`. Mis à jour le 27/10/2026 : « Une même racine », « S'inscrire », les trois témoins (un lien par château), « Le règlement », « Trouver mon château » (qui ouvre le test au seuil), les réseaux sociaux. Le 28/10/2026 : « La boutique » (en tête de la colonne de droite) et « La boutique des trois châteaux » sous « Nos châteaux ».

- en-tête : le burger à gauche, le logotype au centre ; à droite, depuis le 28/10/2026, la boutique, l'enquête, l'espace client, le panier et la langue repliée (voir « L'en-tête, l'espace client et le panier ») ;
- le menu glisse depuis la gauche sur fond blanc, avec quatre grands titres numérotés en capitales Felix Titling : I. Nos châteaux, II. La famille, III. L'enquête, IV. Visiter ;
- sous chaque titre, des liens soulignés ; à droite, « Où trouver nos vins » et « Contact & accès » ; en bas à droite, « Espace professionnel », qui mène à l'espace professionnel de la boutique (`boutique.html?espace=pro`) ;
- en bas à gauche, à la place du podcast de Cheval Blanc, la couverture de l'Enquête.

Sur mobile, les titres déplient leurs liens en accordéon ; le choix de la langue est en bas du menu. Le 28/10/2026 : « Mon panier » sous « La boutique », « Mon espace client » et le choix de la langue en bas à droite.

## L'« Enquête à la racine » (campagne phare)

Refaite le 27/10/2026 d'après le déroulé et la planche du livret de l'équipe, puis réécrite le 28/10/2026 sur le nouveau déroulé de l'équipe (même nom, mêmes six étapes, nouvelle fin : l'opération « Éric – Fils »). La première version, « La page arrachée », est dans `archives/enquete-v1-page-arrachee/` ; la deuxième (neuf bouteilles, la dégustation de Lovely, le mot RACINE) dans `archives/enquete-v2-racine/`.

- **Mise en scène.** Une ouverture plein écran (le chai, la nuit : « Des bouteilles ont disparu du chai »), puis un livret ouvert sur un bureau sombre : la couverture et la lettre, puis une double page par étape. La page se tourne quand on avance (en 3D sur ordinateur, en fondu sur téléphone). En bas, le carnet des six lettres trouvées.
- **L'histoire.** L'inventaire du chai attend douze Soudars 2018 ; le casier n'en garde qu'une rangée de six. Les bouteilles n'ont pas été volées : Éric les a sorties pour le dossier « É.-F. », l'opération « Éric – Fils », qui doit faire entrer Soudars dans de nouveaux points de vente (les caves V and B) et faire découvrir son histoire à un nouveau public. Car Soudars est à part : Coufran et Verdignan se sont transmis de génération en génération, Éric a créé Soudars en 1980 sur quinze hectares de friches, en partant de presque rien. La bouteille recherchée, Château Soudars 2018, raconte l'histoire d'un fils qui a construit son propre domaine.
- **Les six étapes,** chacune donne une lettre du mot de passe FRICHE :
  1. L'ouverture de l'affaire (observation et déduction) : comparer l'inventaire du 1er octobre et le casier. Les deux trous du casier sont expliqués à la craie (boutique, salon des vins) ; la rangée de Soudars 2018 disparue ne laisse aucun trou. Signalement : Soudars, 2018, six bouteilles (F) ;
  2. Les témoins de l'histoire (chronologie et arbre généalogique) : compléter l'arbre de la famille, l'année et le château de Louis, Jean et Éric, avec Lovely en 2006 (R) ;
  3. Les indices dans la vigne (associer les étapes de production et résoudre un code) : la fiche de production de Soudars 2018 met l'élevage avant l'assemblage, alors que Soudars assemble après les macérations, avant la barrique (site de Soudars). Remettre les sept étapes dans l'ordre : chaque carte bien placée se retourne et donne une lettre du code du registre de cuverie, SOUDARS (I) ;
  4. Le mystère de l'assemblage (proportions qui font 100 %) : les trois assemblages, Coufran 85/15/0, Verdignan 30/65/5 dans les vignes, Soudars 50/49/1 (C) ;
  5. Les registres ne mentent pas (recoupement) : le registre du chai a trois fausses pistes (la demi-palette de Norvège, le salon, la boutique) ; une seule ligne reprend le signalement, le 07 : six Soudars 2018 sorties pour le dossier « É.-F. », visa É. M. (H) ;
  6. La révélation : le bordereau du 07 retrace le trajet (le chai de Soudars, le transporteur, une livraison cachée sous le cachet) ; le mot de passe du dossier, ce sont les cinq lettres du carnet et l'initiale d'Éric : FRICHE (E). Le dossier s'ouvre sur l'opération « Éric – Fils », puis la bouteille : Château Soudars 2018, fruité, souple et convivial, arrivé le 9 dans les caves V and B, avec deux liens (la carte « Où trouver nos vins » de la boutique, et la commande en ligne).
- **Les indices sont sur les sites des châteaux :** pages « La famille », fiche de Château Soudars (« Son élaboration »), et la pièce à conviction de chaque accueil (section `#temoin`, la part du cépage principal).
- **La récompense :** l'accès à la vente privée des vieux millésimes prêts à boire, contre une adresse e-mail (plan d'actions, action 5). Pas de remise, pas de repas.
- **Visuels :** Higgsfield, d'après la planche de l'équipe (`assets/img/enquete/`, originaux dans `Recommandation/Enquete_a_la_racine/visuels_higgsfield/`). Les portraits de Louis, Jean et Éric sont des **portraits d'illustration** : à remplacer par de vraies photos fournies par la famille, avec son accord (Éric est vivant). Les dates sont les vraies (famillemiailhe.com) : Louis 1892-1982, Jean 1925-2009, Éric né en 1950.
- **À faire valider :** le règlement et la récompense au regard de la loi Évin ; l'accord de la famille, puisque des personnes réelles apparaissent dans une fiction.
- **Trois indices par étape** (27/10/2026) : « Un indice ? » ouvre le premier, difficile ; puis un plus facile ; le troisième dit presque la réponse. Les indices ouverts restent ouverts (gardés avec la progression). Aux étapes 2 à 4, des liens mènent aux pièces à conviction des sites.
- **Relu comme un escape game professionnel** (27/10/2026) : textes et énoncés corrigés (accords, chiffres, ordre des étapes conforme aux châteaux), étapes résolues réaffichées avec leur solution au rechargement, saisie « 09 » acceptée, clic bloqué quelques secondes après une erreur aux étapes 3 et 6 pour éviter de tout essayer au hasard, progression partagée entre plusieurs onglets, case de consentement obligatoire pour l'accès à la vente privée, page de livret qui grandit avec son contenu. L'étape 6 reste volontairement facile : c'est le dénouement.
- **Le « + » des indices** : le bouton se place sous le dernier indice ouvert et en propose un autre, plus facile, avec son compte (« 2 sur 3 »).
- **L'inscription** (27/10/2026, pour constituer une base de contacts) : avant de jouer, « Avec inscription » (prénom, e-mail, règlement accepté, nouvelles de la famille en option, décochée) garde la partie, la reprend avec son e-mail (« Déjà inscrit ? Reprendre ma partie ») et fait participer l'enquête résolue au tirage au sort du trimestre : une bouteille offerte à l'un des enquêteurs ; une nouvelle enquête chaque trimestre. « Sans inscription » : on joue tout de suite, rien n'est gardé (un avertissement avant de quitter), et l'on peut s'inscrire à la fin pour que la victoire compte. Le carnet indique « Partie sauvegardée » ou « Sans sauvegarde ». **Maquette : rien n'est envoyé**, les « comptes » vivent dans le navigateur (`localStorage`, clé `miailhe-enquete-comptes`) ; en vrai, il faut un serveur et un outil d'e-mailing.
- **Le règlement** (`enquete.html#reglement`, déplié par le menu) : organisateur, participation gratuite réservée aux majeurs, durée trimestrielle, tirage, dotation, données personnelles. **Indicatif** : à faire valider par un juriste, en particulier la bouteille offerte au regard de la loi Évin.
- **Code :** `enquete.html`, `assets/js/enquete.js` (les réponses, les indices, l'inscription, la page qui tourne, la progression) et `assets/css/enquete.css`. Le livret imprimable (`Recommandation/Enquete_a_la_racine/`) se refait avec `python3 ../Recommandation/Enquete_a_la_racine/source/livret.py`.

## Les sites des châteaux (d'après Privios)

Le même gabarit sert aux trois châteaux, comme sur privios.com :

- **Accueil :**
  - porte d'âge sur la teinte du château, avec son armoirie ;
  - à l'arrivée, une porte à deux battants dans la couleur du château, avec son motif, qui s'ouvre sur le film (une fois par visite, ou chaque fois qu'on vient d'une porte de la vitrine, `?porte`) ;
  - une boucle vidéo plein écran, comme sur Privios, avec trois lignes (« Goûtez le caractère du grand-père », « Gardez l'élégance du père », « Partagez le plaisir du fils ») ;
  - « découvrez nos vins » ;
  - carrousel de bouteilles, avec « La gamme » et « Où l'acheter » ;
  - une phrase sur un aplat de la couleur du château et son motif, avec le cercle « découvrez la famille » ;
  - « Vigneron du prêt-à-boire » (`#pret-a-boire`, entrée `pret` de `CHATEAUX`) : la photo du stock, le texte et trois points ; Coufran et Verdignan gardent leurs bouteilles au château jusqu'à leur mise en vente, Soudars est prêt à boire dès sa jeunesse. La fiche du grand vin de chaque château porte la même mention ;
  - le témoin de l'Enquête, avec sa pièce à conviction (un indice de l'étape 4) ;
  - le pied de page, avec **les coordonnées reprises des anciens sites** (27/10/2026, demande de l'équipe ; source : les blocs « Contacts », « Nous contacter » et les mentions légales de chateau-coufran.com, chateau-verdignan.com et chateausoudars.com, dont les e-mails étaient masqués par un script) : l'adresse et le standard ; « Nous rendre visite » (visites sur rendez-vous, l'adresse de la demande, l'itinéraire) ; pour Coufran et Verdignan, **Éric Miailhe**, production et commercialisation (téléphone, fax, portable, emiailhe@coufran-verdignan.com) et **Marie-Cécile Vicaire**, administratif et comptabilité (24, cours de Verdun, Bordeaux ; contact@chateau-coufran.com ou contact@chateau-verdignan.com) ; pour Soudars, qui ne nomme personne, le standard et vignoblesmiailhe@orange.fr, et sa vraie page Facebook ; « Acheter nos vins » ; et le numéro RCS de chaque château avec le directeur de la publication. Les données sont dans l'entrée `contact` de `CHATEAUX` ; l'espace professionnel affiche la même personne pour l'équipe commerciale.
- **L'espace professionnel** : il avait sa page sur chaque château (`professionnels.html`, onglet « Professionnels » de l'en-tête). Le 28/10/2026, l'utilisateur a demandé de « lier la partie personnel (B2C) et professionnel (B2B) » dans la boutique, avec un bouton pour passer de l'une à l'autre, ce qui supprime cet onglet. Les trois pages sont archivées dans `archives/professionnels-v1/` ; tout est maintenant dans `boutique.html?espace=pro` (voir « La boutique de la famille »). Le pied de page des châteaux (« Espace professionnel ») y mène. Les textes et l'offre restent dans `generer_chateaux.py` (l'entrée `pro` de `CHATEAUX`, `FORMATS`, `ETAPES`, `KIT`…), qui les écrit dans `assets/js/boutique-pro.js`.
- **La famille :** l'histoire du domaine, une galerie, le terroir avec la carte du Médoc, la transmission sur quatre générations, puis « découvrez nos vins ».
- **Fiche vin :**
  - quatre écrans : le vin, son caractère (dégustation, accords, service, garde, cépages, presse), son élaboration (avec la fiche technique en PDF), puis « dans la même famille » ;
  - la bouteille inclinée sur un panneau de la couleur du château, avec un motif propre à chacun ;
  - pour Soudars, le dernier écran présente ses millésimes 2014 à 2018.

Les sites sont clairs depuis le 27/10/2026 : fond blanc, teinte claire du château, aplats de sa couleur avec son motif, pied de page dans sa couleur sombre. En haut à droite, le test, l'enquête, les trois armoiries, l'espace client, le panier et la langue (voir « L'en-tête, l'espace client et le panier »). Les « ateliers » interactifs ajoutés puis retirés le même jour sont archivés dans `archives/chateaux-v2-ateliers/` ; leurs notes de millésimes restent dans `assets/js/millesimes.js` (pour le coffret « Votre année »).

Chaque château a sa couleur, son motif et son logo ; le texte des pages est le même pour les trois (voir « Typographie et logos des châteaux ») :

| Château | Génération | Couleur | Logo | Motif |
|---|---|---|---|---|
| Coufran | Louis, le grand-père (1924) | or `#a97d2e` | Albertus, et les trois racines du logo MIAILHE sous le nom | le pigeonnier-belvédère et ses pigeons |
| Verdignan | Jean, le père (1976) | bleu estuaire `#0f4366` | le logo officiel de l'étiquette, en une couleur | le vrai tracé de l'estuaire de la Gironde (OSM) |
| Soudars | Éric, le fils (1980) | vert bouteille `#0f320a` | le logo officiel de l'étiquette, en une couleur | les jeunes ceps plantés sur la friche |

L'interface est en Circular, la police de Privios. En pied de page, les réseaux : Instagram (le vrai compte du groupe, @chateauxcoufranverdignan), Facebook, LinkedIn et TikTok (@famillemiailhe, comptes proposés, à créer ; LinkedIn ajouté le 28/10/2026 à la demande de l'utilisateur : le brief le cite parmi les canaux du groupe, mais aucune page n'a été trouvée, donc l'adresse est à remplacer si le groupe en a une), injectés par `assets/js/reseaux.js` dans chaque `[data-reseaux]`. Chaque site est signé « par MIAILHE », en petit à côté du logo du château dans l’en-tête (dans le menu ouvert sur téléphone), et « une maison de la famille MIAILHE » en pied de page, renvoie aux deux autres châteaux et à l'Enquête. La porte d'âge n'est demandée qu'une fois pour toute la famille.

**Films d'intro :**
- Chaque accueil s'ouvre sur un film original de 12 secondes, joué en boucle. Les trois films suivent la même grammaire en trois temps : le domaine, un geste de métier, puis une image signature.
- Les vraies photos des châteaux servent seulement de référence, pour que l'architecture reste fidèle ; le reste est créé par IA (Higgsfield, 26 et 27/10/2026) :
  - **Coufran, le grand-père :** travelling vers le château dans son parc d'automne, une grappe de merlot coupée au sécateur, puis un drone qui s'approche du pigeonnier dans les vignes dorées (Cinema Studio).
  - **Verdignan, le père :** drone vers la flèche avec l'estuaire à l'horizon, une barrique qu'on roule dans le chai, puis un verre de cabernet servi face à l'estuaire, à l'heure bleue (Cinema Studio). C'est la référence de style.
  - **Soudars, le fils :** refait le 27/10/2026 sur le modèle de Verdignan. Un drone glisse au ras des rangs dorés vers le clocher du village, des mains déposent une grappe de merlot dans un panier à contre-jour, puis le vin est versé dans deux verres posés sur un mur de pierres sèches, au coucher du soleil (Cinema Studio). Il part d'une vue aérienne du vignoble à l'heure dorée (`soudars-image-de-depart.png`), créée d'après la vraie photo du vignoble et du clocher. L'encodage se refait avec `zsh source/monter_soudars.sh`.
- Fichiers web dans `assets/video/` : WebM et MP4, mêmes réglages pour les trois (1440 × 810 en 16:9, 24 images/s, sans son, 1,7 à 3,7 Mo). Les originaux sont dans `source/videos-originales/`, les essais écartés de Soudars dans `source/videos-originales/Archives/`.
- La photo d'intro s'affiche pendant le chargement. Le film reste arrêté sur elle si le visiteur a demandé moins d'animations, et en mode `?capture`.
- Écartés : des boucles quasi fixes (même photo en début et en fin), un plan de fossile, un essai de Soudars au chai trop proche de Verdignan, puis le film de nuit aux bougies antigel, jugé sans rapport avec les deux autres.
- Ce sont des images créées par IA, pas des prises de vue : à préciser si le site est montré à la famille.

**Photos du feed Instagram (29/10/2026).** À la demande de l'utilisateur (« le site comprenait des images moches »),
les images les plus faibles reprises des anciens sites ont été remplacées par des photos du feed @famillemiailhe. Les
anciennes étaient surtout des casiers d'entrepôt, des images de film floues ou basse définition, et une flaque.

- **Ce qu'on reprend :** les prises Higgsfield elles-mêmes, sans texte, sans logo et sans visage. `python3
  source/images_feed.py` les écrit dans `assets/img/feed/`, en recadrant en paysage les grands plans d'ouverture.
- **Où elles vont :**
  - les ouvertures du Terroir et du Prêt-à-boire ;
  - le sol de graves de Coufran ;
  - la photo des conditions de la boutique ;
  - le prêt-à-boire de Coufran et de Verdignan ;
  - le bandeau des vins de Verdignan ;
  - la grande photo de la famille de Soudars ;
  - quelques vues des galeries.
- **Ce qui reste :** les vraies photos des châteaux et de la famille.
- **À savoir :** ce sont des images créées par IA, comme les films.
- **Lovely et Fred (même jour).** À la demande de l'utilisateur (« ressentir ce sentiment d'appartenance et ce côté affectif familial »), les photos du feed avec les deux cousins sont aussi sur le site :
  - un plan « Votre année ? *On la cherche pour vous.* » dans le Prêt-à-boire, avant la cave ;
  - la livraison et le drive de la boutique ;
  - le prêt-à-boire de Verdignan, avec Fred qui montre le numéro de lot gravé ;
  - la photo de la lignée de chaque château, et une photo par galerie.
  L'utilisateur a confirmé que la vraie Lovely est la femme de la photo avec Éric. La première référence du feed avait
  pris une autre femme : les prises ont été corrigées dans le feed (`prises_v8/`) et remplacées ici. Il faut
  l'accord écrit de Lovely et Fred avant la mise en ligne.

**Modifier un texte :** les pages des châteaux sont générées par `source/generer_chateaux.py`. Tous les textes, photos et vins sont dans le dictionnaire `CHATEAUX` en tête du fichier. Après une modification, relancer :

```bash
python3 source/generer_chateaux.py
```

Ne pas retoucher les fichiers de `coufran/`, `verdignan/` et `soudars/` à la main : ils seraient écrasés à la prochaine génération. Le style est dans `assets/css/chateau.css`, le comportement dans `assets/js/chateau.js`.

**Sources :**
- les faits viennent des sites officiels (miroirs dans `../Sites/`), du brief et des textes de la cliente sur la personnalité des trois vins ;
- les accords mets-vins et les températures de service sont des propositions, sauf les accords de Soudars, qui viennent de son site ;
- les fiches techniques PDF sont dans `assets/docs/`.

## Typographie et logos des châteaux

Refaits le 27/10/2026 : l'équipe voulait la même typographie de texte sur les trois sites, et un logo SVG propre à chaque château, chacun différent, mais qui reprenne chacun un élément distinct du logo MIAILHE. Le 28/10/2026, ces logos dessinés ont quitté le site : les châteaux y portent leurs logos officiels (voir plus bas).

- **Le système** (`assets/css/typographie.css`, sur toutes les pages) : quatre polices, quatre rôles.
  - **Cormorant** (SIL OFL), de 300 à 700, pour les titres et le texte éditorial : vraies petites capitales, chiffres elzéviriens dans le texte, chiffres alignés dans les tableaux et les champs ;
  - **Canela italique** pour le mot qui compte dans un titre ;
  - **Cinzel**, la romaine du logotype, pour les inscriptions (sur-titres, millésimes, armoiries) ;
  - **Circular** pour l'interface (menus, boutons, formulaires).
  Une échelle modulaire fluide (`--t--1` à `--t-7`), l'œil du texte aligné par `font-size-adjust`, les titres équilibrés ligne à ligne (`text-wrap: balance`), le texte sans veuve (`pretty`) et césuré en français.
- **La microtypographie française** (`assets/js/typographie.js`) : espace fine insécable avant ; ! ? et dans les guillemets, insécable avant les deux-points, entre un nombre et son unité et après « n° », apostrophe typographique (même devant une balise : l'<em>élégance</em>), points de suspension, pas de mot orphelin en fin de paragraphe. Le script repasse sur le texte ajouté par le test, l'Enquête ou le menu. Pour qu'un élément n'y passe pas : `data-brut`.
- **Les logos des châteaux : les logos officiels** (28/10/2026, demande de l'utilisateur : « les logos officiels des 3 châteaux qu'il faut remplacer par ceux que tu as fait […] monochrome blanc »). Ce sont les logos des étiquettes, tirés des fichiers de la famille (`Éléments graphiques/VISUEL COUFRAN.ai`, `VISUEL VERDIGNAN.ai`, `VISUEL SOUDARS .ai`) par `Logos/source/logos_officiels.py`, qui les met en **une seule couleur** et les cale dans un même cadre (`0 0 1000 220`), tous trois sur deux lignes et à la même hauteur :
  - **Coufran** : les capitales Art déco à filets, sans l'ombre portée de l'étiquette ;
  - **Verdignan** : « Château » en capitales espacées, « Verdignan » en grandes capitales classiques ;
  - **Soudars** : les capitales étroites de l'étiquette, pleines (le filet doré intérieur, évidé, devenait illisible en petit). L'étiquette les met sur une ligne ; « Soudars » est passé sur une seconde ligne comme chez les deux autres (28/10/2026, demande de l'utilisateur) : « CHATEAU », dans les mêmes lettres réduites et espacées, est centré au-dessus, comme le « CHÂTEAU » de Verdignan.
  Sur le site, ils sont dessinés en `currentColor` : **en blanc** sur les photos, les films et la couleur du château (le « monochrome blanc » demandé), dans la couleur du château sur le blanc. Fichiers (blanc, noir, couleur, SVG et PNG) et planche dans `Logos/CHATEAUX/`. `assets/js/logos-chateaux.js` est écrit par ce script ; il donne aussi à chaque logo `--retrait` et `--encre` (la marge de l'encre à gauche et sa largeur, en part du cadre) : là où le logo est calé à gauche (en-tête des châteaux, chapitres et offre professionnelle de la boutique), sa boîte épouse l'encre, qui part alors du même bord que le texte. Les logos dessinés pour le projet (quatrième version, grille commune, éléments du logo MIAILHE) sont gardés dans `Logos/CHATEAUX/Archives/v4_wordmarks_grille_commune/`, hors du site, avec l'« osmose » ; l'ancienne page d'identité est dans `archives/identite-v1-logos-osmose/`.

## Le logo MIAILHE sur les bouteilles

Sous l'étiquette de chaque bouteille du site, le logotype MIAILHE est sérigraphié à même le verre, petit, en ivoire champagne, avec l'ombrage du cylindre (deuxième version : la contre-étiquette en papier de la première a été jugée trop présente) : `python3 source/etiquettes_miailhe.py` réécrit `assets/img/bouteille-*.webp` à partir des photos d'origine, gardées dans `archives/bouteilles-sans-miailhe/`. Aucune mention de l'étiquette d'origine n'est recouverte. Les boîtes des étiquettes sombres des N° 2 sont relevées à la main (`BOITES`).

## Vitesse, poids et audit (29/10/2026)

Demande de l'utilisateur : alléger le site et accélérer son chargement sans en changer le contenu, corriger les bugs de lecture et d'affichage, soigner le téléphone.

- **Images :** `python3 source/optimiser_images.py`. Chaque JPEG de plus de 180 Ko est réencodé en progressif, qualité 80, 2 400 px de large au plus, et n'est remplacé que s'il gagne au moins 12 %. Les originaux sont dans `source/images-originales/`. Relancer le script après tout script qui écrit des images dans `assets/img`.
- **Films des portes :** déclarés `preload="metadata"`, ils passent à `auto` après le chargement de la page. Ne jamais appeler `load()` sur eux : cela interrompt les requêtes.
- **Planche de la racine :** ses données (`racine-planche.js`, 0,8 Mo) se chargent quand le navigateur est libre.
- **Carte de la boutique :** ses scripts se chargent à l'approche de `#ou-trouver`.
- **Film de l'estuaire :** réencodé en VP9 profil 0. L'ancien était en 4:4:4, ce qui risquait de ne pas se lire partout ; l'original est dans `source/videos-avant-optimisation/`.
- **Résultat :** la vitrine charge environ 4,4 Mo au lieu de 18 Mo.
- **Audit :** `python3 source/audit.py <dossier> [filtre]` ouvre 19 pages sur ordinateur et sur téléphone (390 px). Il les fait défiler et relève les erreurs JavaScript, les ressources manquantes, les images cassées, les débordements horizontaux et le poids, avec une capture pleine page de chaque vue. Le lancer après chaque modification. Une requête de film WebM interrompue par Chrome est normale : il lâche la première requête une fois le début reçu, puis demande l'index à la fin du fichier.

## Prototypes d'intro

Le dossier `prototypes/` contient deux intros alternatives, étudiées le 26/10/2026. Après comparaison, l'intro de base (sarment et trois feuilles de vigne) a été conservée. Ces prototypes restent pour mémoire : ils ne sont pas branchés sur le site et ont chacun un bouton « Rejouer » et une vidéo MP4.

- `intro-goutte.html` : une goutte de vin tombe sur le papier blanc et s'étale en tache. Le logo apparaît dedans en blanc, puis la tache se résorbe et le logo reste en rouge.
- `intro-millesimes.html` : un compteur fait défiler 1793, 1924, 1972, 1973 et 2006, avec une ligne d'histoire par date, puis tout se resserre sur le logo.

**Les racines de l'intro, propositions (28/10/2026).** Une page `intro-racines.html` montrait sept propositions de racines dessinées à la main. L'utilisateur a choisi la proposition A, « À la plume » (voir « Les trois racines de l'intro »), puis a demandé de supprimer la page : elle a été mise à la corbeille du Mac le 28/10/2026.

## La boutique de la famille (`boutique.html`)

Ajoutée le 28/10/2026, à la demande de l'utilisateur : « supprimer la boutique qui existe déjà et recréer une boutique qui va unir les 3 châteaux », avec les mêmes produits et les mêmes tarifs. Jusque-là, nos sites renvoyaient vers les deux boutiques en ligne de la famille : www.coufran-verdignan.com (Coufran et Verdignan) et boutique.chateausoudars.com (Soudars). Ces liens ont disparu ; tout mène à `boutique.html`.

- **Le catalogue** : 54 vins, relevés sur les deux boutiques par `python3 source/boutique/releve_boutiques.py`, qui écrit `source/boutique/catalogue.json` (le relevé daté, avec ses sources) et `assets/js/boutique-catalogue.js` (ce que lit la page). Coufran : 9 millésimes de 2007 à 2020 et le N°2 2014 ; Verdignan : 9 millésimes de 2005 à 2019 et le N°2 2013 ; Soudars : 14 millésimes de 2000 à 2019 en bouteille, 20 doubles magnums de 1982 à 2015. Prix TTC à la bouteille, tels qu'affichés (de 9,50 € le N°2 de Verdignan à 175 € le double magnum de Soudars 1982). Relancer le script quand les tarifs changent ; si une boutique ne répond plus, il garde le relevé précédent.
- **Les règles, celles des anciennes boutiques** : bouteilles de 75 cl par carton de 6, doubles magnums (3 L) à l'unité ; livraison 30 € pour 6 bouteilles, offerte dès 12 bouteilles ou un double magnum ; France métropolitaine (Corse sur demande), sous 10 à 12 jours ouvrés ; retrait au château en prévenant avant. Ce qui change : **un seul panier pour les trois châteaux**, où tous les cartons comptent ensemble (un carton de Coufran et un de Soudars : livraison offerte). La boutique Coufran-Verdignan affichait « Conditionnement : 6 » avec un prix à la bouteille ; on le lit comme la caisse de 6 de Soudars, à faire confirmer par la famille.
- **Deux espaces, un bouton** (troisième version, 28/10/2026 ; demande de l'utilisateur : lier la partie particuliers (B2C) et professionnels (B2B), un bouton pour passer de l'une à l'autre, et une boutique « incroyable et cinématique, digne d'une boutique viticole très professionnelle »). Un interrupteur « Particuliers · Professionnels » est posé sur la scène d'ouverture et repris dans la barre qui suit la lecture. On passe d'un espace à l'autre derrière un rideau, qui se ferme sur le nom de l'espace et se rouvre sur la nouvelle scène. L'adresse suit (`?espace=pro`) ; une ancre de l'autre espace y fait passer (`boutique.html#demande` ouvre les professionnels). La deuxième version est dans `archives/boutique-v2-cave/`.
- **La scène d'ouverture**, plein écran : chez les particuliers, les films des trois châteaux l'un après l'autre (ceux de l'accueil de leurs sites), avec sous le titre la progression du film et le nom de son château ; chez les professionnels, l'estuaire vu du ciel (`vitrine-estuaire`). Le titre sort du flou : « Ce que nous avons gardé pour vous » ou « Trois châteaux, un seul fournisseur » ; dessous, les promesses de l'espace.
- **Les particuliers** (`assets/js/boutique.js`, `assets/css/boutique.css`) :
  - « Les doyennes de la cave » : la plus ancienne bouteille encore en vente de chaque château, devant son millésime géant ;
  - la famille (1931, Louis, Jean et Éric, puis Éric et Lovely) ;
  - **le coffret des trois générations** (28/10/2026, demande de l'utilisateur ; refait le même jour en volume : « le coffret doit être vraiment incroyable et beau visuellement ») : on choisit une bouteille de chaque château (le grand vin, 75 cl). Chacune quitte le millésime choisi et vole jusqu'à sa fenêtre du coffret, une à une. Le coffret est un vrai volume en CSS (`preserve-3d`, faces en unités du conteneur, léger parallaxe au pointeur) : la face avant porte le logo MIAILHE en dorure, « Trois générations », trois fenêtres en arche avec les armoiries officielles complètes et le grain du papier ; le côté porte la lignée (Louis 1924, Jean 1976, Éric 1980, Lovely 2006). « Laisser la famille choisir » remplit les fenêtres vides avec le millésime le plus proche de dix ans. Les trois posées, « Valider le coffret » ouvre la dédicace : le nom s'écrit en lettres d'or sur la face à mesure qu'on le tape (« Pour mon père », « Pour mon grand-père », « Pour ma grand-mère », « Pour Papi »…), avec une signature facultative (« De la part de »). « Sceller et ajouter au panier » pose un cachet de cire à la feuille du logo, puis le coffret part au panier (`localStorage` `miailhe-coffrets` : `bouteilles`, `nom`, `de`) ; il compte pour trois bouteilles dans la livraison offerte, et la commande garde `gravure` et `signature`. Le cachet se pose dans le coin haut de la face (tailles en part de la face), où il ne couvre ni la dédicace ni les fenêtres ; sur téléphone, le studio devient lui-même le conteneur des unités `cqw`, si bien que tout le coffret rapetisse d'un bloc (rétrécir la seule boîte laissait le contenu trop grand et écrasait le logo). **Le coffret est offert, et vendu par trois bouteilles alors que la boutique vend par six : deux propositions à faire valider par la famille** ;
  - **la cave** : un chapitre par château, qui s'ouvre sur son film, puis **un vin par scène** (le grand vin, le N°2, les doubles magnums de Soudars). La bouteille est debout devant son millésime géant, avec son âge sur un sceau. En face : les cépages et la garde (repris de l'offre professionnelle), puis la **frise de ses millésimes**. Choisir une année fait changer en fondu la bouteille, l'année, la note du château et le prix. Les 54 vins du catalogue tiennent ainsi en 8 scènes, au lieu d'une grille de cartes presque identiques ;
  - **le vin de votre année** : toutes les années de la cave, par décennie ; une année montre ce que la cave en a gardé dans les trois châteaux, avec « Voir dans la cave » qui ouvre la scène du vin sur ce millésime (2005 est ouvert à l'arrivée) ;
  - **où trouver nos vins** (`#ou-trouver`, 28/10/2026, demande de l'utilisateur : « une très grande carte de France interactive "Où trouver nos vins" et des points pour chaque vin (qui prend toute la largeur). Grande distribution Verdignan / Coufran : Auchan, Intermarché, Leclerc, Carrefour. Soudars : V and B ») : une carte de toute la largeur de l'écran, la mer gravée en traits fins, la France et ses départements en blanc. **Un point par vin** : en grande distribution une paire or (Coufran) et bleu (Verdignan), chez V and B un point vert (Soudars), aux couleurs exactes ; les trois châteaux marqués dans le Médoc (visite et drive). À l'arrivée, les points partent du Médoc et gagnent la France. Filtres par vin et par enseigne (avec leurs comptes), info-bulle au survol, clic sur un département : zoom animé et liste de ses magasins par enseigne, puis la fiche d'un magasin (ce qu'on y trouve, armoiries, itinéraire). Recherche de n'importe quelle commune ou code postal (les centres des communes, chargés seulement quand on cherche) et « Autour de moi » (géolocalisation) : les dix magasins les plus proches, avec leur distance. Le fond est dessiné en Path2D sur un canvas, les points par lots ; tout est dans `assets/js/carte-france.js`. Les données viennent de `source/carte_france/` : `releve_magasins.py` relève sur OpenStreetMap (Overpass, par curl) les supermarchés et hypermarchés des quatre enseignes (sans les formats de proximité, City, Express, Contact, My Auchan, ni les drives) et les caves V and B → `magasins_osm.json` ; `construire_carte.py` projette les départements (france-geojson, IGN Admin Express, Licence ouverte) en Lambert-93 écrit à la main, range chaque magasin dans son département, donne aux magasins sans ville la commune la plus proche (« près de ») et écrit `assets/js/carte-magasins.js` et `assets/js/carte-communes.js` (communes de geo.api.gouv.fr). **OpenStreetMap donne tous les magasins de ces enseignes : la liste réelle des magasins qui référencent les vins doit venir de la famille** (et le dossier stratégie dit que la famille veut sortir Soudars de la grande distribution : la carte suit ce que l'utilisateur a donné). Reliée depuis la barre (« En magasin »), le menu principal, le pied des sites des châteaux (« Où trouver nos vins ») et l'onglet « Où nous trouver » de l'accueil, qui montre la même carte ;
  - la livraison et le retrait, avec un passage vers l'espace professionnel ;
  - **le drive du château** (28/10/2026, demande de l'utilisateur) : dans la commande, « Livraison à domicile » ou « Drive au château ». Le drive est gratuit : on choisit le château, le jour (deux jours après la commande, sans le dimanche) et l'heure (10 h, 11 h, puis de 14 h à 17 h ; le samedi le matin seulement), et la commande est déposée dans le coffre de la voiture. L'adresse n'est alors plus demandée. La commande garde `mode` et `drive` (château, jour, heure), que l'espace client affiche. **Jours et heures sont une proposition à faire valider par la famille** ;
  - la fiche d'un vin, le tiroir du panier (`localStorage` `miailhe-panier`, avec la jauge vers la livraison offerte), puis la commande.
- **Les professionnels** (l'ancien onglet des châteaux, mis en page par `boutique.js` d'après `assets/js/boutique-pro.js`) :
  - « Trois châteaux, trois occasions » : pour chaque château, sa photo et son argument, puis ses vins (cépages, garde, millésimes, formats, fiche, document) avec « Ajouter à ma demande » ;
  - « Des millésimes prêts à boire » : un onglet par château, une frise des vieux millésimes et leurs notes ;
  - « Trois façons de remplir une palette » : la palette du château, la demi-palette et la palette famille, dessinées en perspective (la palette famille aux trois couleurs) ;
  - les quatre étapes, du compte validé à l'expédition ; le kit importateur (réservé aux comptes validés, langues) ;
  - **la demande de devis** : le format, les vins des trois châteaux et leur millésime (repris de « Ma demande », que la barre compte), le conditionnement, la livraison, la société. Les partenaires d'abord (Place de Bordeaux, importateurs exclusifs) et l'équipe commerciale sont rappelés à côté. **Maquette : rien n'est envoyé.** La demande en cours est gardée dans `miailhe-demande`, les demandes « envoyées » dans `miailhe-devis`.
  La page ne charge pas `vitrine.css` : tout est dans `boutique.css`. `boutique.html#panier` ouvre le panier (l'icône panier des autres pages y mène). La commande reprend les coordonnées de l'espace client (`miailhe-client`) et range chaque commande en tête de `miailhe-commandes` (numéro, date, e-mail, lignes, totaux, adresse) ; le panier se vide ensuite. **La commande est une maquette** : elle demande l'adresse, l'âge légal et l'accord des conditions de vente, n'a aucun champ de paiement, n'envoie et ne débite rien. Mentions : prix TTC, vente d'alcool interdite aux mineurs, abus d'alcool.
- **Où elle est reliée** : la pilule pleine « La boutique » en haut de chaque page de la maison, et l'icône panier (voir ci-dessous), le bouton de fin du panneau Prêt-à-boire, le menu plein écran ; sur chaque château, « Boutique » dans le menu, « La boutique de la famille » dans « Où l'acheter » et le pied de page (`boutique.html#coufran`…), et « L'acheter » sur la fiche du grand vin et du N°2 (`boutique.html?vin=n2-de-coufran#coufran` : la boutique s'ouvre sur ce vin). La Rose Maréchale et Plantey de la Croix, absents des boutiques en ligne, gardent « Où l'acheter » vers le pied de page. Les vins vendus sont lus dans `catalogue.json` par `generer_chateaux.py`.
- **Les vraies boutiques** restent en ligne : ce sont les sites de la famille, que nous ne pouvons pas fermer. Quand miailhe.com sera en ligne, il faudra les rediriger vers `miailhe.com/boutique` et brancher un vrai paiement (et la vente à distance d'alcool : licence, mentions, vérification de l'âge).

## La feuille de vigne du logo, partout

28/10/2026, demande de l'utilisateur : « la feuille de vigne, je veux la même que le logo MIAILHE (pareil sur les armoiries) ».

- **Un seul dessin :** `Logos/source/feuille_site.py` découpe la grande feuille dans le vrai tracé du logo (`miailhe_elements.feuille()`, sa nervure en creux) et écrit `assets/js/feuille-miailhe.js` : pétiole en (0, 0), pointe vers le bas, hauteur 100.
- **Où elle sert :**
  - la racine de survol des liens de l'en-tête (`survol.js`), qui pend désormais sous le mot seul et non plus sous l'icône (le bogue de « Boutique » : la règle des icônes écrasait la racine) ;
  - les trois feuilles du sarment de l'intro et les feuilles de « La famille » (`MIAILHE.vigne.feuille`, `intro.js`) ;
  - le chef des armoiries (`Logos/source/construire_armoiries.py`, qui produit aussi désormais les PNG et `00_PLANCHE_ARMOIRIES.png` aux couleurs exactes de l'équipe).

## Les trois racines de l'intro

28/10/2026, deux demandes de l'utilisateur : « les 3 racines dessinées doivent être différentes », puis des racines « dessinées à la main », « jamais de formes droites ». Parmi sept propositions (une page d'aperçu, supprimée depuis à sa demande), il a choisi **A, « À la plume »**, sans les deux petites racines de Coufran ni la feuille au bout de Soudars. Elle est dans `assets/js/intro.js` :
- **Le dessin :** une plume taillée en biseau. Le trait est plein dans les descentes et délié dans les soulignements, la main tremble à peine et le bord de l'encre est légèrement irrégulier. Aucun trait n'est droit : les courbes passent par des points espacés (Catmull-Rom centripète), avec une ondulation lente.
- **Coufran :** la racine quitte le sarment presque à la verticale, puis s'ouvre en arc large autour du nom.
- **Verdignan :** un long jambage part entre Coufran et le V, se creuse vers la gauche, plonge sous la ligne, tourne en rond et remonte souligner le nom.
- **Soudars :** un S au-dessus du mot, puis le contour et le soulignement.

Le soulignement suit l'encre du logo, pas sa boîte. L'intro est dessinée avec un hasard fixe : elle est la même à chaque visite, celle que l'utilisateur a choisie.

La règle tient toujours : aucune racine ne touche les lettres. Chaque tracé est vérifié contre l'encre des trois logos, au point même et sur deux cercles autour. L'intro le note dans `data-racines` (« ok » ou « touche ») ; contrôlé à 390, 768, 1 280, 1 440, 1 920 et 2 560 px. La version précédente (racines au trait fin, pivot droit, feuille au bout de Soudars) est dans `archives/intro-v2-racines-pivot/`.

## L'en-tête, l'espace client et le panier

28/10/2026, demande de l'utilisateur : « Réarrange le haut de page pour que ce soit plus clean. Je pense que les 3 armoiries ne doivent pas être visibles sur la home page mais uniquement sur les pages des châteaux. La boutique doit être mise en avant et l'enquête aussi. Oublie pas les icônes espace client pour la boutique et toutes les icônes obligatoires et pertinentes. »

- **La droite de l'en-tête** est la même sur la vitrine, l'Enquête, le test, la boutique et l'espace client. Elle est écrite par `python3 source/entete.py` : la modifier là, puis relancer le script. Dans l'ordre :
  - « La boutique » et « L'enquête » : deux liens sobres, une icône (bouteille, loupe) et le mot, sans cadre ; au survol, la racine pousse sous le mot et finit sur la feuille du logo, comme les onglets (le même jour, l'utilisateur n'a pas aimé les pilules d'abord essayées) ;
  - l'espace client (une silhouette ; l'initiale du client une fois connecté) ;
  - le panier (un sac et le nombre de bouteilles) ;
  - la langue, repliée sur la langue en cours ; les deux autres descendent au survol ou au toucher.
  Plus d'armoiries hors des sites des châteaux, et plus de « Le test » en haut des pages (demande du 28/10/2026) : le test reste dans le menu, l'invitation et la consigne du seuil (« ou laissez-vous guider »), `#test`, et le bandeau des sites des châteaux. Les icônes et la langue repliée sont communes à toutes les pages (`typographie.css`) ; `assets/js/espace.js` y met l'initiale et le nombre de bouteilles. Le logo MIAILHE de l'en-tête reste toujours visible : il s'effaçait en bas des pages quand le logo du pied de page passait dessous, ce que l'utilisateur a pris pour un défaut (retiré le 28/10/2026).
- **Téléphone** : les pilules gardent leur icône seule ; la langue, puis l'espace client sous 440 px, passent dans le menu (« Mon espace client », « Mon panier » et la langue y sont depuis le 28/10/2026), sauf sur la boutique et l'Enquête où la pilule de la page s'efface et laisse sa place.
- **Les sites des châteaux** gardent leurs armoiries. Leur en-tête est allégé : trois liens (« Nos vins », « La famille », « Contact » ; « Professionnels » est passé dans la boutique le 28/10/2026), puis « La boutique » (qui a remplacé « Le test », demande du 28/10/2026) et « L'enquête » dans le même style sobre, les armoiries, l'espace client, le panier (pastille à la couleur du château) et la langue repliée. Sur téléphone, les deux liens gardent leur icône et le menu reprend la boutique, l'enquête et l'espace client.
- **L'espace client** (`compte.html`, `assets/js/compte.js`, `assets/css/compte.css`) : un seul espace pour les trois châteaux.
  - Sans être connecté : la photo d'Éric et Lovely devant Coufran, « Bienvenue chez nous », et deux onglets. « J'ai déjà un espace » demande l'e-mail ; sans mot de passe, un lien de connexion serait envoyé sur miailhe.com, ici on entre directement. « Créer mon espace » demande le prénom, le nom, l'e-mail, l'âge légal, et la lettre de la famille en option. Un e-mail inconnu bascule vers la création ; un inscrit de l'Enquête est retrouvé par son e-mail.
  - Une fois connecté : les commandes de la boutique, le panier (et ce qu'il manque pour la livraison offerte), l'enquête (pas commencée, l'étape en cours, ou résolue et dans le tirage), le château du test avec son logo, les coordonnées (que la boutique reprend), la lettre de la famille, « Me déconnecter » et « Effacer mes données de ce navigateur » (en deux temps).
  - **Maquette** : tout vit dans le navigateur (`localStorage` : `miailhe-client`, le client connecté ; `miailhe-clients`, les espaces créés ; `miailhe-commandes`). Sur miailhe.com, il faudrait un vrai compte sur un serveur, avec le RGPD.

## Les voix de l'accueil

28/10/2026, demande de l'utilisateur : quand on entre dans un château, on entend « Bienvenue dans notre château ». Refait le jour même : les premières voix « ne correspondaient pas du tout ».

**Les voix.** L'utilisateur voulait :
- une voix très âgée pour le grand-père ;
- une voix normale pour le père ;
- une voix jeune pour le fils ;
- une vraie différence entre les trois, et un son derrière.

Les trois voix sont donc dessinées sur ElevenLabs (Voice Design) :

| Château | L'hôte | La voix | Âge perçu |
|---|---|---|---|
| **Coufran** | Louis, le grand-père | frêle, chevrotante, lente, avec un temps après « Bienvenue… » | ≈ 66-68 ans |
| **Verdignan** | Jean, le père | ordinaire et calme, sèche et proche | ≈ 45-52 ans |
| **Soudars** | Éric, le fils | jeune, claire, souriante | ≈ 19-23 ans |

L'âge perçu vient d'un estimateur d'âge de la voix, qui a servi à choisir les prises.

**Le son derrière.** C'est le son de films Kling (Higgsfield) tournés depuis l'intérieur de chaque porte :
- **Coufran :** l'horloge et le feu du vestibule ;
- **Verdignan :** la réserve des bouteilles, une pièce calme et sèche, des moineaux au loin et un petit coup de bois avant que Jean parle (refait le 28/10/2026 : l'utilisateur trouvait que Jean parlait « dans une piscine ») ;
- **Soudars :** un bouchon qui saute, les oiseaux des vignes, le vin versé.

**Le mixage.** `source/voix/mixer.py` fait monter l'ambiance, puis l'hôte parle avec l'écho du lieu ; l'ambiance s'efface sous la voix, puis le tout s'éteint. Les fichiers sont dans `assets/audio/bienvenue-<château>.mp3`, tous à −16 LUFS (mesuré en deux passages).

**La « piscine » de Verdignan (28/10/2026).** Deux causes, mesurées : le mixage ajoutait deux échos francs à 70 et 125 ms (au-delà de 50 ms, l'oreille les entend séparés), et l'ambiance Kling portait un clapotis d'eau continu. La voix de Jean est maintenant sèche (un seul reflet à 12 ms, à −22 dB, inaudible comme écho) et l'ambiance vient de deux nouveaux films Kling sans eau. L'ancienne version est dans `source/voix/Archives/v2-verdignan-piscine/`.

**Où trouver le reste.** Tout est dans `source/voix/LISEZ-MOI.md` : les prises, les propositions, les mesures et comment changer une voix. La première version est dans `source/voix/Archives/v1-voix-bibliotheque/`.

**Sur le site.** `assets/js/voix.js` prépare le son au clic (un navigateur ne laisse une page parler qu'après un geste) :
- sur la vitrine, l'ambiance part quand le cercle s'ouvre, l'hôte parle quand son nom paraît, et l'on n'entre qu'une fois le son éteint ;
- sur un château, le son passe après « Oui, entrer ».

La phrase reste en français dans les trois langues.

**Avant la mise en ligne :**
- un forfait ElevenLabs payant, ou faire dire la phrase par la famille ;
- vérifier les conditions de Kling ;
- faire écouter les voix à la famille.

## Les langues : français, anglais, japonais

27/10/2026, demande de l'équipe. Le site est écrit en français ; il est traduit dans le navigateur, ce qui évite trois copies des pages et du générateur.

- `assets/js/langue.js`, premier script de chaque page : il choisit la langue (`?lang=` dans l'adresse, sinon le choix gardé dans `localStorage` `miailhe-langue`, sinon le français), charge le dictionnaire (`assets/js/i18n/en.js` ou `ja.js`), traduit la page avant de l'afficher, puis ce que les scripts écrivent ensuite (le test, l'Enquête, les bouteilles, l'histoire). Changer de langue recharge la page ; depuis la porte d'âge, l'intro ne se rejoue pas.
- **La clé est la phrase française.** L'unité est le bloc de texte (un élément qui ne contient que du texte et des balises de texte) ; ses balises sont notées `<0>…</0>`, `<1/>` et la traduction peut les déplacer (l'ordre des mots change en japonais) ; les éléments d'origine sont réutilisés, avec leurs liens et leurs écouteurs. Les nombres deviennent `{0}`, `{1}` (années, compteurs). Les scripts qui insèrent un nom ou un mot du joueur passent par `MIAILHE.tf('… {0} …', [valeur])`. `translate="no"` garde un élément tel quel (le prénom du joueur, les lettres de FRICHE).
- **Quand un texte change** (une page, le générateur des châteaux, un script) : `python3 source/i18n/extraire.py` relève toutes les phrases (Chromium, chaque page et les parcours : test, portes, Enquête, devis, boutique avec fiche, recherche et commande, espace client) dans `source/i18n/cles.json` ; traduire les nouvelles dans `source/i18n/en.json` et `ja.json` en suivant `source/i18n/CONSIGNES.md` (ton, glossaire, noms qui ne se traduisent pas) ; puis `python3 source/i18n/construire.py`, qui vérifie chaque traduction (mêmes balises, mêmes valeurs) et écrit les dictionnaires. `extraire.py --verifier` rejoue tout en anglais et en japonais et liste ce qui manque encore (`source/i18n/manquants-en.json`, `-ja.json`).
- **Le japonais** a ses polices (Hiragino Mincho pour les titres et le texte, comme le Cormorant ; Hiragino Sans pour l'interface ; repli Yu Mincho et Noto), sans italique ni capitales, avec un interlignage plus ouvert et des retours à la ligne entre les mots (`typographie.css`). La microtypographie française (`typographie.js`) ne s'applique qu'en français.
- **À savoir :** la traduction a été faite par IA d'après les consignes ; elle est à faire relire par un traducteur natif avant toute mise en ligne, surtout le japonais et les textes juridiques (porte d'âge, règlement de l'Enquête, mentions). Le texte gravé dans les images (couverture de l'Enquête, étiquettes) reste en français. La mention sanitaire suit l'usage de chaque langue.

## Comment c'est construit

- `assets/js/intro.js` joue l'intro de l'accueil, sur le modèle de [The Symphony of Vines](https://symphonyofvines.unseen.co/) :
  - sur fond noir, le logo sort du flou ;
  - un sarment de vigne traverse l'écran sur une piste en pointillés. Il s'affine vers sa pointe. Trois feuilles de vigne s'y déplient, une par château, comme les trois feuilles du logo (cinq lobes dentés, dessinées par le script). Volontairement sobre : ni grappes ni vrilles ;
  - au passage du sarment, une racine descend vers chaque château et souligne son nom en l'écrivant de gauche à droite. L'ordre suit l'entrée dans la famille : Coufran (1924), Verdignan (1976), Soudars (1980). Chaque nom est le logo de son château, les trois à la même échelle ;
  - l'intro laisse ensuite place à l'écran d'entrée (la porte d'âge, un seul bouton), posé sur la photo de famille de 1931.
  Les tracés sont calculés à la taille de l'écran. Le script est ignoré si l'utilisateur a demandé moins d'animations.
- `assets/js/main.js` gère, pour la vitrine et l'Enquête :
  - l'insertion du logo et des armoiries ;
  - la porte d'âge (avec le message sanitaire obligatoire en France), qui attend la fin de l'intro pour s'afficher ;
  - le menu plein écran ;
  - la couleur de l'en-tête selon le fond ;
  - les apparitions au défilement.
  Le son d'ambiance et les boutons « avec le son / en silence » ont été retirés le 26/10/2026.
- `assets/js/vitrine.js` gère la page après l'entrée : les portes (le film lu en avant au survol, en arrière quand on s'en va), le passage d'une porte au site du château (avec la voix de l'hôte, `voix.js`), la pousse des racines au défilement (WebGL) et la frise. `assets/js/plans.js` mène les plans du Terroir et du Prêt-à-boire. `assets/js/espace.js` (toutes les pages) tient l'en-tête à jour : l'initiale du client, le nombre de bouteilles. Le test de découverte est dans `assets/js/quiz.js`, partagé avec `quiz.html`. Le style est dans `assets/css/vitrine.css`.
- `assets/css/polices.css` déclare toutes les polices locales (`assets/fonts/`, converties en WOFF2 depuis le Livre de polices). **Vérifier les licences web avant toute mise en ligne** : la plupart sont des polices de bureau.
- `assets/css/main.css` : le système commun de la vitrine en haut du fichier, puis les armoiries, le menu, l'intro, la porte d'âge et l'Enquête.
  - La palette de la marque mère est dans les variables en tête de fichier. Depuis le 27/10/2026, la vitrine est claire : blanc (`--paper`), encre (`--ink`), et les trois couleurs des châteaux, qui forment ensemble la signature de la marque (le petit trait tricolore des sur-titres, le liseré du pied de page). Le rouge `#e50041` (`--vigne`) et les noirs graphite (`--earth-1` à `--earth-5`) de la palette « Rouge Bordeaux » ne servent plus qu'à l'intro, à la porte d'âge et à l'Enquête, restées sombres.
  - Les transparences passent par trois variables RVB : `--voile`, `--lueur` et `--clair` (par exemple `rgba(var(--voile), .5)`). Pour changer de palette, il suffit donc de modifier ces variables.
  - Les couleurs des châteaux (`--coufran`, etc.) sont aussi des variables, partagées avec leurs sites. Les polices historiques (`--f-coufran`…) ne servent plus qu'à quelques accents (témoins de l'Enquête, page identité) : l'intro écrit désormais les logos des châteaux.
- `apercus/` : captures pleine page (1440 px de large) prêtes pour une présentation, deux captures de l'intro et la comparaison des palettes étudiées.

## À savoir

- **Logo.** Le logo MIAILHE final (le I-racine dont les trois racines se terminent par des feuilles de vigne) est injecté par `assets/js/logo.js` : le logotype seul dans les en-têtes, le logo complet ailleurs. Sa couleur suit le texte (`currentColor`). Ne pas modifier `logo.js` à la main : il est régénéré par `Logos/source/vectoriser_feuilles.py`. Les fichiers du logo pour tous les autres supports sont dans `Logos/LOGO_FINAL/`.
- **Usage interne uniquement.** Les photos viennent des sites officiels des châteaux. Les quatre cartes postales de 1900-1905 sont dans le domaine public. Le site est une **maquette non officielle** (mention en pied de page) : à ne pas mettre en ligne sous ce nom sans l'accord de la famille.
- **Non fait :**
  - pas de formulaire de réservation : le bouton appelle le numéro du château ;
  - la boutique commune est une maquette : le panier marche, la commande n'envoie rien et ne débite rien (pas de paiement en ligne) ;
  - l'espace professionnel et l'accès à la vente privée de l'Enquête n'envoient rien : ce sont des maquettes.

## Le blog (29/10/2026)

À la demande de l'utilisateur (« un onglet blog dans le site avec des articles de blog rédigés pour le SEO »), le site a
un blog : `blog/index.html` et une page par article.

- **L'onglet.** « Le blog » est le cinquième onglet de l'en-tête de l'accueil. C'est un simple lien vers la page du
  blog, pas un panneau. On le retrouve aussi dans le menu, le pied de page de l'accueil et les pieds de page des
  châteaux.
- **Écrire ou modifier un article.** Chaque article est un fichier texte : `source/blog/articles/<adresse>.md`.
  - L'en-tête du fichier contient le titre (avec un mot entre astérisques, en italique), le titre pour Google (60
    signes au plus), la description (155 signes au plus), la date, la catégorie (`famille`, `vin` ou `terroir`), l'image
    de couverture et son cadrage, le texte alternatif, la légende, le chapeau, les requêtes visées et l'appel à
    l'action.
  - Le texte utilise un Markdown simple : `##` pour un intertitre, des listes, `[lien](blog:autre-article)`, des
    images, les encadrés `::: bref` et `::: astuce`, et une section « Questions fréquentes ».
  - Ensuite, relancer `python3 source/generer_blog.py`.
- **Le référencement.** Chaque page a :
  - un titre et une description propres, et son adresse canonique (`https://miailhe.com/blog/<adresse>`) ;
  - les balises Open Graph et les données structurées : Blog, BlogPosting, BreadcrumbList et FAQPage ;
  - un seul h1, un sommaire, des liens internes vers les châteaux, la boutique et les autres articles ;
  - des images avec leurs dimensions et leur texte alternatif.

  Le script écrit aussi `sitemap.xml` et `robots.txt` à la racine du site.
- **Les sept articles.**
  - L'histoire de la famille.
  - Le vin prêt à boire et comment le servir.
  - La différence entre merlot et cabernet-sauvignon.
  - Lire une étiquette en magasin.
  - L'appellation Haut-Médoc.
  - Offrir le vin de son année.
  - Visiter le Médoc.

  Les faits sur les châteaux viennent de `generer_chateaux.py`, et aucune citation n'est inventée.
- **Les langues.** Les articles sont en français. En anglais et en japonais, une note le signale ; l'en-tête, le menu
  et le pied de page restent traduits.
- **À faire avant la mise en ligne.**
  - Mesurer le volume des requêtes visées avec un outil SEO (Ahrefs, Semrush, Search Console).
  - Faire relire les textes au regard de la loi Évin.
  - Prévoir que le serveur réponde aux adresses sans `.html`.
# miailhe
