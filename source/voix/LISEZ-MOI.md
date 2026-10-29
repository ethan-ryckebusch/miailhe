# Les voix de l'accueil : « Bienvenue dans notre château »

Quand on entre dans un château, l'hôte dit « Bienvenue dans notre château », sur le son de son château.

**Demandes de l'utilisateur, 28/10/2026 :**
1. Trois voix ElevenLabs, la plus juste pour chaque château.
2. Après écoute de la première version : « les voix ne correspondent pas du tout ». Il voulait :
   - une voix très âgée pour le grand-père ;
   - une voix normale pour le père ;
   - une voix jeune pour le fils ;
   - qu'on entende vraiment la différence entre les trois ;
   - un son derrière, pour plus d'immersion.
3. Après écoute de la version 2 : « le son et la voix de Verdignan, on dirait qu'il est dans une piscine ». Verdignan a été remixé (voir plus bas) ; l'ancienne version est dans `Archives/v2-verdignan-piscine/`.

La première version est dans `Archives/v1-voix-bibliotheque/`. Ses voix venaient de la bibliothèque d'ElevenLabs, choisies sur leur fiche. Mesurées après coup par un estimateur d'âge, elles étaient presque à l'envers : le « grand-père » sonnait 20 ans, le « fils » 55 ans.

## La voix de la famille : « Bienvenue dans notre famille » (29/10/2026)

**Demande de l'utilisateur :** « générer une voix quand on clique sur entrer comme les 3 voix des portes, mais une voix féminine d'une cinquantaine d'années qui va dire "Bienvenue dans notre famille" ». Elle se joue au clic sur « J'ai l'âge légal, entrer », sur la porte d'âge de la vitrine (`main.js`, par `voix.js`, comme les portes).

- **La voix :** Opal, une voix prédéfinie d'ElevenLabs, générée par la synthèse vocale de Higgsfield (`text2speech_v2`, variante `elevenlabs`). Ce n'est la voix de personne : on ne clone pas une vraie voix sans l'accord écrit de la personne.
- **Le choix :** les aperçus des voix féminines ont été classés à l'estimateur d'âge (`age.py`). La plupart sonnaient 28 à 34 ans en français. Les plus âgées ont dit la phrase, et Opal a été retenue : environ 50 ans seule, 51 ans mixée.
- **Les fichiers :** toutes les prises dans `prises/famille/`, la prise choisie dans `voix-famille.mp3`. `mixer.py` (entrée `famille`) la pose sur l'ambiance calme de Verdignan, avec un seul reflet de 12 ms, et écrit `assets/audio/bienvenue-famille.mp3` (3,6 s, −16 LUFS).
- **Avant la mise en ligne :** comme les trois autres voix, vérifier les conditions d'usage commercial, ou la faire dire par Lovely.

## Les trois voix (version 2)

Ce sont trois voix dessinées sur mesure avec **ElevenLabs Voice Design**, enregistrées dans le compte de l'utilisateur sous les noms « MIAILHE - … ». La phrase est générée avec le modèle Eleven v4.

| Château | L'hôte | Ce qui a été demandé à Voice Design | Âge perçu (voix seule / mixée) |
|---|---|---|---|
| Coufran | Louis, le grand-père | un homme de 95 ans, voix frêle et chevrotante, tremblement, souffle, lente, avec des pauses ; chaleureux et fier | ≈ 68 / 66 ans ; 3 syllabes/s, voix soufflée |
| Verdignan | Jean, le père | un homme de 50 ans, voix ordinaire, chaleureuse et calme, ni grave ni aiguë, débit de conversation | ≈ 45-49 / 52 ans (sur la phrase) |
| Soudars | Éric, le fils | un jeune homme de 23 ans, voix claire, amicale et souriante, débit vif | ≈ 19 / 32 ans ; 180 Hz |

**Les phrases générées :**
- Louis : `[warmly] Bienvenue... dans notre château.` (un temps après « Bienvenue ») ;
- Jean : `Bienvenue dans notre château.` ;
- Éric : `[warmly] Bienvenue dans notre château !`.

**Le choix.** Je ne peux pas écouter. Chaque proposition de Voice Design (3 par essai, environ 13 s) et chaque prise a donc été passée dans un estimateur d'âge de la voix : `age.py`, modèle de recherche audEERING wav2vec2 âge/genre. Il a été lancé dans un environnement Python à part.
- Le grand-père : un premier essai donnait 63 à 68 ans ; une description plus extrême, 69,8 ans. Le modèle plafonne vers 70-75 ans.
- Le père : on a gardé la proposition estimée à 49 ans.
- Le fils : 25 ans en proposition, 19 ans sur la phrase.

Mixée, la voix du fils paraît plus âgée à l'estimateur (32 ans) : les oiseaux et le vin versé sous la voix le troublent. Seule, avec l'écho du chai, elle reste à 23 ans. L'ambiance s'efface donc pendant que l'hôte parle.

Pour Verdignan (version 3), l'âge est mesuré sur la seule phrase, de 0,7 à 2,4 s.
- **Sur la phrase :** environ 52 ans. La version 2, avec son écho et son eau, tombait à 36 ans.
- **Sur le fichier entier :** environ 55 ans. Là, l'estimateur compte aussi les silences et l'ambiance.
- **Les trois hôtes sur leur phrase :** Louis 66 ans, Jean 52, Éric 27.

`mesure_js.py`, `mesurer.py` et `syllabes.py` mesurent la hauteur, le débit, le souffle et les pauses. Ils servent aussi à vérifier qu'aucune indication entre crochets n'est prononcée.

## Le son derrière

Les effets sonores d'ElevenLabs ne se téléchargent pas sur le forfait gratuit, et je n'ai pas contourné cette limite. Les ambiances sont donc le **son natif de films Kling 2.6 (Higgsfield)**. Chaque film part de l'image de l'intérieur de la porte du château (`../videos-originales/portes/*-3-interieur.png`), caméra fixe, avec la consigne « ambiance seule, ni musique ni voix ». Il y a deux films par château dans `ambiances-films/`. Les spectrogrammes ont servi à choisir :

- **Coufran** (prise b, à partir de 1 s) : le vestibule de 1925. Le tic-tac régulier d'une horloge, environ toutes les 1,1 s, et un feu qui crépite.
- **Verdignan** (version 3, prise c à partir de 5,6 s) : la réserve des bouteilles, au plus près. Une pièce calme et sèche, des moineaux au loin par la porte ouverte, et un seul petit coup de bois, pris dans la prise d, juste avant que Jean parle.
  - La consigne demandait un son sec et proche, sans écho : le tintement des bouteilles dans les casiers, le bois des poutres, des oiseaux dehors. Aucun mot ne parlait d'eau.
  - La version 2 demandait « une pièce réverbérante, une goutte d'eau, les mouettes de l'estuaire ». Elle avait donné un clapotis continu : 63 % de l'énergie entre 500 et 2 000 Hz et environ 7 « bulles » par seconde dans cette bande. La nouvelle ambiance en a moins d'une ; ses sons sont des oiseaux, au-dessus de 2 000 Hz, loin de la voix.
- **Soudars** (prise a, à partir de 0,2 s) : le chai. Un bouchon qui saute juste avant que le fils parle, les oiseaux des vignes, puis du vin versé : le plaisir partagé.

## Le mixage (`mixer.py`)

```bash
python3 Site_MIAILHE/source/voix/mixer.py
```

1. L'ambiance monte en 0,5 s.
2. La voix entre à 0,7 s (à 1 s à Soudars, après le bouchon), avec un écho léger propre au lieu : une pièce boisée à Coufran, le chai à Soudars. À Verdignan, la voix est sèche : un seul reflet à 12 ms, très bas (−22 dB), qui ne s'entend pas comme un écho.
   - La version 2 y mettait deux échos francs, à 70 et 125 ms. Passé 50 ms environ, l'oreille entend un écho séparé : d'où la « piscine ».
   - Après la dernière syllabe, la voix perd maintenant 35 dB en 70 ms, contre 140 ms avant.
3. L'ambiance s'efface d'environ 8 dB pendant que l'hôte parle (compresseur commandé par la voix), puis revient.
4. Tout s'éteint en 0,9 s.

La voix passe environ 12 dB au-dessus de son fond, en sonie intégrée (8,5 à Soudars, où le bouchon et le vin versé portent l'ambiance).

Le volume final est le même pour les trois : −16 LUFS, mesurés puis appliqués d'un bloc, sous un limiteur à −1,5 dB, en MP3 mono 128 kbit/s. Les fichiers sont dans `../../assets/audio/bienvenue-<château>.mp3` et durent de 3,4 à 4,5 s.
- **Ce qui a changé :** le `loudnorm` en un seul passage manquait la cible sur des sons aussi courts. Coufran sortait à −17,2 LUFS et Verdignan à −14,9.
- **Maintenant :** Coufran −16,3, Verdignan −16,0, Soudars −16,0.
- **L'ambiance de Verdignan** est composée par le script (`COMPOSITIONS` : la prise c, plus le coup de bois de la prise d).

**Les dossiers :**
- `prises/` : les prises de la phrase, deux par voix ;
- `propositions/` : les propositions de Voice Design (`gp95-*` pour le grand-père retenu) ;
- `voix-*.mp3` : les prises retenues ;
- `ambiance-*.m4a` : les sons retenus ;
- `ambiances-films/` : les films Kling dont ils viennent (Verdignan : `verdignan-c.mp4`, `verdignan-d.mp4`).

## Sur le site

`assets/js/voix.js` prépare le son au clic (une porte de la vitrine, ou « Oui, entrer » sur un château).
- **Sur la vitrine :** l'ambiance part quand le cercle s'ouvre, l'hôte parle quand son nom paraît, et l'on n'entre qu'une fois le son éteint.
- **Sur le site d'un château :** le son suit « Oui, entrer ». Sans geste de l'utilisateur, il se tait.

La phrase reste en français dans les trois langues du site.

## Avant la mise en ligne

- **Droits ElevenLabs :** le forfait gratuit n'autorise pas l'usage commercial, et il faut citer ElevenLabs. Pour miailhe.com, il faut un forfait payant, ou faire dire la phrase par Éric et Lovely eux-mêmes, ce qui serait plus juste encore.
- **Droits Kling :** les ambiances viennent de Kling via Higgsfield ; leur licence commerciale est à vérifier.
- **Écoute :** la famille doit écouter et valider. L'estimateur d'âge est un outil de recherche, pas une oreille.
