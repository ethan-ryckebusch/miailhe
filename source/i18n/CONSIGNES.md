# Traduire le site MIAILHE (anglais, japonais)

27/10/2026. Le site est écrit en français ; `assets/js/langue.js` le traduit dans le navigateur à partir de dictionnaires
`{phrase française: traduction}`. Ce fichier est la consigne commune à toutes les traductions.

## Le site

Le site de concept de la famille Miailhe et de ses trois châteaux du Haut-Médoc (Bordeaux) : la vitrine de la maison
(trois portes, l'histoire de la famille, le terroir, le prêt-à-boire), un test « Quel château vous ressemble ? », un jeu
d'enquête (« Enquête à la racine »), la charte d'identité, et les sites des trois châteaux (accueil, famille, une page
par vin, espace professionnel, coordonnées). Lecteurs : amateurs de vin du monde entier, importateurs et cavistes ;
le Japon est un marché d'export de la famille.

Ton : sobre, littéraire, chaleureux, haut de gamme. Phrases courtes. Jamais de superlatifs publicitaires ni de
clichés (« unique », « exceptionnel », « nestled »…). On vouvoie le lecteur : en anglais, un ton naturel et direct ;
en japonais, le registre poli です／ます, élégant mais simple (pas de keigo appuyé).

## Règles de format (vérifiées par `construire.py`)

- **Balises** : une clé peut contenir `<0>…</0>` (un élément qui entoure du texte : italique, lien, nom en gras) ou `<3/>`
  (un élément sans texte : saut de ligne, icône, logo). La traduction garde **exactement les mêmes balises, chacune une
  fois**, bien imbriquées. On peut les déplacer pour suivre l'ordre des mots (japonais), et changer le texte qu'elles
  entourent. `<0>A</0>` devant une réponse du test est la lettre de la réponse : la garder telle quelle.
- **Valeurs** : `{0}`, `{1}`… sont des nombres (années, pourcentages, compteurs) ou des noms que le site insère. Les
  garder toutes, à la bonne place (`{0} % merlot` → `{0}% Merlot`, `{0}% メルロ`).
- Toutes les clés reçoivent une traduction, même les noms propres et les libellés courts (recopier la clé si elle ne
  change pas : `Château Coufran` → `Château Coufran`).
- Ponctuation : en anglais, apostrophe et guillemets typographiques (’ “ ”), pas d'espace avant : ; ! ? ; les « »
  deviennent “ ”. En japonais, ponctuation pleine chasse （、。「」）, pas d'espace entre les mots, chiffres en demi-chasse,
  les « » deviennent 「」.
- Les clés sont recopiées **à l'identique**, caractère pour caractère (le plus sûr : produire le fichier par script à
  partir du morceau à traduire).

## Ce qui ne se traduit pas

- **MIAILHE** (la marque, en capitales), les noms des châteaux et des vins dans les titres, logos et étiquettes :
  Château Coufran, Château Verdignan, Château Soudars, N°2 de Coufran, N°2 de Verdignan, Château La Rose Maréchale,
  Château Plantey de la Croix ; AOC Haut-Médoc ; les adresses, téléphones, e-mails.
- L'**Enquête** (troisième version, 28/10/2026) : les lettres des étapes (F, R, I, C, H, E), le mot de passe **FRICHE**
  et le code **SOUDARS** restent en capitales latines (ce sont les réponses du jeu) ; là où FRICHE apparaît comme
  solution, on ajoute le sens : *FRICHE (French for “fallow land”)*, *FRICHE（フランス語で「荒れ地」）*. Le nom de
  l'opération « Éric – Fils » reste en français (*“Éric – Fils”*, 「エリック＝フィス」). Les numéros de dossier, de
  lot, de casier, et le sigle « É.-F. » restent tels quels.

## Glossaire

| Français | English | 日本語 |
|---|---|---|
| la famille Miailhe | the Miailhe family | ミアイユ家 |
| château (le lieu) | château | シャトー |
| Château Coufran / Verdignan / Soudars (dans une phrase) | Château Coufran… | シャトー・クーフラン／シャトー・ヴェルディニャン／シャトー・スダール |
| La Rose Maréchale · Plantey de la Croix | (inchangé) | ラ・ローズ・マレシャル・プランテ・ド・ラ・クロワ |
| Élie, Louis, Jean, Éric, Lovely | (inchangé) | エリー、ルイ、ジャン、エリック、ラブリー |
| le grand-père · le père · le fils · la fille | the grandfather · the father · the son · the daughter | 祖父・父・息子・娘 |
| Haut-Médoc · Médoc · Bordeaux | (inchangé) | オー・メドック・メドック・ボルドー |
| Saint-Seurin-de-Cadourne · Pauillac | (inchangé) | サン・スーラン・ド・カドゥルヌ・ポイヤック |
| l'estuaire de la Gironde | the Gironde estuary | ジロンド河口 |
| la Place de Bordeaux · négociant | the Place de Bordeaux · négociant | ラ・プラス・ド・ボルドー・ネゴシアン |
| terroir | terroir | テロワール |
| cépage · merlot · cabernet-sauvignon · cabernet franc · petit verdot | grape variety · Merlot · Cabernet Sauvignon · Cabernet Franc · Petit Verdot | ブドウ品種・メルロ・カベルネ・ソーヴィニヨン・カベルネ・フラン・プティ・ヴェルド |
| millésime | vintage | ヴィンテージ |
| grand vin · second vin | grand vin · second wine | グラン・ヴァン・セカンドワイン |
| assemblage · élevage · vendanges | blending · ageing · harvest | アッサンブラージュ・熟成・収穫 |
| vin de garde | wine for ageing | 長期熟成型のワイン |
| chai · cuvier · barrique | cellar · vat room · barrel | 醸造蔵（シェ）・醸造所・樽 |
| prêt-à-boire | ready to drink | 飲み頃 |
| « Vigneron du prêt-à-boire » | “The ready-to-drink winegrower” | 「飲み頃をお届けする造り手」 |
| « Le Pomerol du Médoc » | “The Pomerol of the Médoc” | 「メドックのポムロール」 |
| les portes · votre porte | the doors · your door | 扉・あなたの扉 |
| Revenir aux portes | Back to the doors | 扉へ戻る |
| La famille · Le terroir · Prêt-à-boire · Le test (onglets) | The family · The terroir · Ready to drink · The quiz | 家族・テロワール・飲み頃・診断 |
| « Quel château vous ressemble ? » | “Which château is most like you?” | 「あなたに似ているシャトーは？」 |
| le test | the quiz | 診断 |
| L'enquête · « Enquête à la racine » | The Inquiry · “The Root Inquiry” | 謎解き・「ルーツをたどる謎解き」 |
| enquêteur | investigator | 調査員 |
| un indice | a clue | ヒント |
| la porte d'âge : « J'ai l'âge légal, entrer » | “I am of legal drinking age — enter” | 「法定飲酒年齢に達しています。入る」 |
| L'abus d'alcool est dangereux pour la santé, à consommer avec modération. | Alcohol abuse is dangerous for your health. Please drink responsibly. | 飲酒は20歳になってから。お酒は適量を楽しみましょう。 |
| Espace professionnel | Trade area | プロフェッショナル向け |
| devis | quote | お見積もり |
| Maisons du Vin | Maisons du Vin (village wine shops) | メゾン・デュ・ヴァン（村のワインショップ） |
| Production et commercialisation · Administratif et comptabilité | Production and sales · Administration and accounts | 生産・販売・総務・経理 |
| par MIAILHE (signature) | by MIAILHE | by MIAILHE |
| La boutique de la famille · la boutique | The family shop · the shop | ファミリーショップ・ショップ |
| un carton de 6 (bouteilles) | a case of 6 | 6本入りケース |
| double magnum (3 L) | double magnum (3 L) | ダブルマグナム（3L） |
| livraison offerte | free delivery | 送料無料 |
| le panier · commander | the basket · to order | カート・注文する |
| la bouteille · l'unité (prix) | per bottle · each | 1本あたり・1本 |

Dates : « fin du XVIIIe siècle » → *late 18th century*, 18世紀末 ; « en 1924 » → *in 1924*, 1924年に.
Unités : 75 cl, 37,5 cl → 75 cl, 37.5 cl ; en japonais 750ml, 375ml.
