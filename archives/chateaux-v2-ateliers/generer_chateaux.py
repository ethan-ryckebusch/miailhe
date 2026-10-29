"""Génère les sites des trois châteaux (Coufran, Verdignan, Soudars) d'après la mise en page de privios.com.

Un seul gabarit pour les trois : chaque château a sa couleur forte et sa police (assets/css/chateau.css),
ses textes et ses photos (le dictionnaire CHATEAUX ci-dessous). Pour corriger un texte, modifier ce fichier
puis relancer :  python3 source/generer_chateaux.py
Les pages produites (coufran/, verdignan/, soudars/) ne doivent pas être retouchées à la main.

Sources des faits : les sites officiels (miroirs dans Sites/), le brief et l'inventaire de l'équipe.
Les commentaires de millésimes (cave de Coufran, garde de Verdignan) sont ceux des sites officiels, abrégés ; les
quatre mots et le souvenir de Jacques Boissenot viennent de l'entretien filmé de l'œnologue (à vérifier sur la bande-son).
Les accords mets-vins et les températures de service sont des propositions : les sites officiels n'en donnent pas
(sauf les accords de Soudars). Les dépositions des témoins appartiennent à la fiction de l'Enquête.
"""
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
VITRINE = "../%E2%98%85%20MIAILHE%20Vitrine%20V1.html"
ENQUETE = "../enquete.html"

# La lignée commune, rappelée sur chaque site : la génération du château est mise en avant
LIGNEE = [("Louis", "1924", "coufran"), ("Jean", "1972", "verdignan"), ("Éric", "1973", "soudars"), ("Lovely", "2006", None)]

CHATEAUX = {
    "coufran": {
        "nom": "Coufran", "initiale": "C", "membre": "Louis", "role": "le grand-père", "annee": "1924",
        "devise": "Le vin du grand-père", "trait": "Le caractère",
        "description": "Château Coufran, Haut-Médoc. Le vin du grand-père : Louis Miailhe l'a fait entrer dans la famille en 1924 et planté à 85 % de merlot.",
        "intro": {"image": "coufran-hero.jpg", "video": "coufran-intro", "lignes": ["Goûtez", 'le <span class="it">caractère</span> du', "grand-père"]},
        "vins_image": "coufran-pigeonnier.jpg",
        "vins_titre": '<span class="it">découvrez</span><br>nos vins',
        "manifeste": 'Le merlot<br><span class="it">qui a tenu tête</span><br>au cabernet',
        "cercle": "coufran-merlot.jpg",
        "temoin": {
            "numero": "1", "role": "Le grand-père · arrivé en 1924",
            "deposition": "« En 1924, ici, tout le monde plantait du cabernet. J'ai tout arraché pour replanter en merlot. On m'a pris pour un fou. Cent ans plus tard, la part de merlot n'a pas bougé d'un pied. »",
            "valeur": "85 %", "legende": "de merlot dans les vignes de Coufran : la part que Louis a choisie en 1924. Un siècle plus tard, elle n'a pas changé.",
        },
        "acheter": [
            ("Boutique en ligne", "coufran-verdignan.com", "https://www.coufran-verdignan.com/"),
            ("Maisons du Vin", "Saint-Seurin-de-Cadourne et Pauillac", None),
            ("En France", "Monoprix, en bouteille et en demi-bouteille", None),
            ("En Belgique", "Colruyt, depuis plus de soixante-dix ans", None),
            ("Dans le monde", "Les négociants de la Place de Bordeaux", None),
        ],
        "contact": {"tel": "+33 5 56 59 31 02", "mail": "contact@chateau-coufran.com"},
        # Les quatre mots de l'œnologue (entretien filmé pour le château), retrouvés dans les notes officielles
        "quatre_mots": [
            ("La générosité", "Beaucoup de gras et d'éclat, dus aux merlots de vieilles vignes cueillis au moment idéal.", "Château Coufran 2005"),
            ("La force", "Une trame tannique puissante et tendue, qui lui donne sapidité et persistance.", "Château Coufran 2010"),
            ("La délicatesse", "Une palette aromatique très fine, qui mêle des notes grillées, les fruits noirs et le cèdre.", "Château Coufran 2010"),
            ("La rondeur", "Étonnant par son gras, rond et souple à la dégustation ; sa finale est longue et persistante.", "La fiche technique du château"),
        ],
        # La cave de Louis : les millésimes et ce qu'en dit le château (commentaires de dégustation de chateau-coufran.com, abrégés)
        "cave": [
            ("1999", "Rubis, nez de cerise. Très bonne texture et concentration : un vin gourmand. Le premier millésime du nouveau style du cru."),
            ("2000", "Un vin de caractère. Nez intense de fruits rouges et noirs, bouche assez riche, vive et épicée."),
            ("2001", "Gras et gourmand. Une jolie trame qui permet à ce vin un peu austère de s'épanouir avec le temps."),
            ("2002", "Nez légèrement vanillé, fruits rouges flatteurs, tanins denses et fins : une bouteille de caractère, promise à un bel avenir."),
            ("2003", "Nez expressif aux notes délicates de pruneau. Bouche puissante et opulente, sans mollesse."),
            ("2004", "Nez subtil de fruits noirs mûrs. Un vin étonnamment concentré, à la finale persistante."),
            ("2005", "Étonnants arômes de fruits et d'épices, beaucoup de gras et d'éclat. Le plus grand millésime de Coufran jamais produit, qui détrône le fabuleux 1995."),
            ("2006", "Nez complexe et gourmand. Avec le temps, ce grand vin de merlot s'arrondit et sa finale devient de plus en plus soyeuse."),
            ("2007", "Friand et aimable. Il s'épanouit après une heure de carafe, sur une finale de fruits frais."),
            ("2008", "Fruits noirs vifs et intenses, attaque ample, ronde et soyeuse. Un équilibre remarquable."),
            ("2009", "Myrtille, mûre et boisé fin. Une matière charnue, des tanins tendres, une finesse rare : le reflet d'un millésime exceptionnel."),
            ("2010", "Fruits noirs, cèdre, notes grillées. Une trame puissante et tendue : un grand vin, au gros potentiel de vieillissement."),
            ("2011", "Cassis, fruits rouges, torréfié. Vite prêt à être dégusté, il peut aussi attendre quelques années."),
            ("2012", "Fruits noirs, épices, toasté. Beau potentiel de vieillissement, mais sa souplesse permet de l'apprécier vite."),
            ("2013", "Épices et toasté, fraîcheur et souplesse, finale longue et précise. Une belle réussite dans un millésime délicat."),
            ("2014", "Fruits rouges confiturés, boisé fumé. Volume, fraîcheur et puissance : un grand potentiel de vieillissement."),
            ("2015", "Mûre, groseille, boisé toasté. L'opulence des merlots à belle maturité : plein, gourmand et sapide."),
            ("2016", "Fruits rouges mûrs, touches torréfiées. Parfumé, gourmand, puissant et long : un Coufran avec beaucoup d'avenir."),
        ],
        "cave_vedette": "2005",
        "avant_apres": ("acte-coufran-carte-postale.jpg", "Le château vers 1900, encore orthographié Couffrant", "coufran-aujourdhui-cadre.jpg", "Le château Coufran aujourd'hui"),
        "famille": {
            "image": "acte-famille-1931.jpg", "alt": "La famille Miailhe réunie en 1931",
            "titre": "L'<span class=\"it\">histoire</span><br>du grand-père",
            "about_titre": ["Louis,", "1924,", '<span class="it">le pari du merlot</span>'],
            "about": [
                "Au XVIII<sup>e</sup> siècle, les archives de l'abbé Baurein citent déjà la maison noble de « Cousran ». Le domaine passe ensuite entre bien des mains : le baron de Brane, le « Napoléon des vignes », qui imposa le cabernet en Médoc ; l'armateur Jean-Valère Cabarrus après la Révolution ; puis les Célérier, négociants à Bordeaux, qui donnent au château son architecture.",
                "En 1924, Louis Miailhe, courtier en vins comme les siens depuis 1793, l'achète et fixe son nom : Coufran. En pleine crise, le vin, très cabernet, ne se vend plus. Louis arrache et replante en merlot, plus rond, plus charmeur. Un journaliste l'appellera « le Pomerol du Médoc ». Cent ans plus tard, le domaine n'a pas changé de cap.",
            ],
            "galerie": [("coufran-tour.jpg", "Le pigeonnier au bout d'un rang de vigne"), ("coufran-vendangeur.jpg", "Un vendangeur dans les rangs"), ("coufran-chateau.jpg", "La façade du château"), ("coufran-vinification.jpg", "Le vin jaillit d'une cuve"), ("coufran-elevage.jpg", "Les barriques du chai"), ("coufran-stock.jpg", "Les bouteilles qui attendent d'être prêtes"), ("coufran-graves.jpg", "Le sol de graves"), ("acte-coufran-carte-postale.jpg", "Le château vers 1900, encore orthographié Couffrant")],
            "terroir_titre": ["Soixante-seize hectares", '<span class="it">d\'un seul tenant</span>'],
            "terroir": "Au nord de Saint-Seurin-de-Cadourne, une colline de graves et d'argiles culmine à vingt et un mètres et regarde l'estuaire de la Gironde. L'eau et l'océan tout proches tempèrent le climat. Les vieux merlots, cinquante ans en moyenne, donnent au vin sa rondeur et sa tenue.",
            "chiffres": [("76 ha", "d'un seul tenant"), ("85 %", "de merlot"), ("50 ans", "âge moyen des vignes")],
            "lignee_titre": ["Louis l'a planté,", 'Jean l\'a <span class="it">gardé</span>,', "Éric le fait vivre"],
            "lignee": [
                "Jean, le fils de Louis, est le seul de ses enfants à rester vigneron : il reprend Coufran. Depuis les années 1980, ses enfants Éric Miailhe et Marie-Cécile Vicaire ont pris le relais, Éric à la vigne et au chai, Marie-Cécile à l'administration. Depuis 2006, Lovely, la fille d'Éric, travaille à ses côtés.",
                "Ici, on ne vend pas un vin tant qu'il n'est pas prêt : les bouteilles attendent au château, au frais. Cette patience-là se transmet de père en fils.",
            ],
            "photos": [("coufran-chai.jpg", "L'allée du chai à barriques"), ("acte-aujourdhui.jpg", "La famille Miailhe devant le château Coufran")],
            "decouvrir": "coufran-casiers.jpg",
        },
        "vins": [
            {
                "slug": "chateau-coufran", "nom": "Château Coufran", "titre": "Coufran", "sous": "Château · grand vin",
                "categorie": "Le grand vin", "famille": "Le vin du grand-père", "image": "bouteille-coufran.webp",
                "carrousel": "AOC Haut-Médoc · le grand vin",
                "h2": 'Ample, <span class="it">généreux</span>, merlot',
                "notes": "Une robe profonde, un nez de fruits noirs, de cèdre et de cuir. Il prend son temps pour se dévoiler, puis la bouche se montre ample, ronde et généreuse, sur des tanins soyeux et une longue finale. Les vieux merlots lui donnent sa tenue dans le temps.",
                "accords": "Le vin qu'on sert pour recevoir, celui qui plaît à presque tout le monde à table : gigot d'agneau, pièce de bœuf, volaille fermière, fromages affinés.",
                "infos": [("Service", "16 à 17 °C"), ("Garde", "Prêt à boire, jusqu'à 12 ans"), ("Cépages", "85 % merlot, 15 % cabernet-sauvignon")],
                "presse": "Millésime 2023 · Terre de Vins, 94-95/100, coup de cœur",
                "elaboration": [
                    "Les merlots sont vendangés les premiers, les cabernets ensuite, et chaque raisin est trié selon sa parcelle et l'âge de ses vignes. La vinification se fait à la bordelaise, en cuves inox thermorégulées. En décembre, l'assemblage est arrêté avec l'œnologue Éric Boissenot : seuls les deux tiers de la récolte entrent dans le grand vin.",
                    "Puis douze mois en barriques de chêne français, renouvelées par quart chaque année. Les bouteilles attendent ensuite au château, au frais, jusqu'à ce qu'elles soient prêtes à boire. C'est la marque de la maison.",
                ],
                "document": ("Télécharger la fiche technique", "../assets/docs/coufran-fiche-technique.pdf"),
            },
            {
                "slug": "n2-de-coufran", "nom": "N°2 de Coufran", "titre": "N°2", "sous": "de Coufran · second vin",
                "categorie": "Le second vin", "famille": "Le cadet du grand-père", "image": "bouteille-coufran-n2.webp",
                "carrousel": "AOC Haut-Médoc · le second vin",
                "h2": 'Délicat, <span class="it">rond</span>, gourmand',
                "notes": "Une robe sombre. Dès l'ouverture, un nez expressif de griotte, de cerise noire et de cacao. La bouche est pleine, un peu droite d'abord, puis elle s'élargit et s'affine à l'aération, sur les fruits noirs et la griotte.",
                "accords": "Un vin de tous les jours qui sait se tenir à table : volaille rôtie, magret de canard, charcuteries, pâtes aux champignons.",
                "infos": [("Service", "16 °C"), ("Garde", "Souvent prêt à boire, peut attendre"), ("Cépages", "Merlot et cabernet-sauvignon")],
                "presse": None,
                "elaboration": [
                    "Le N°2 naît des cuves que l'on n'a pas retenues pour le grand vin : le tiers de la récolte de Coufran. Mêmes vignes, même chai, même équipe, et la même patience : il est élevé puis attend au château comme son aîné.",
                ],
                "document": None,
            },
            {
                "slug": "la-rose-marechale", "nom": "Château La Rose Maréchale", "titre": "La Rose Maréchale", "sous": "Château · jeunes vignes",
                "categorie": "Les jeunes vignes", "famille": "Les jeunes vignes du grand-père", "image": "bouteille-la-rose-marechale.webp",
                "carrousel": "AOC Haut-Médoc · les jeunes vignes",
                "h2": 'Rond, <span class="it">souple</span>, fruité',
                "notes": "Issu des plus jeunes vignes de merlot et de cabernet-sauvignon de Coufran, c'est un vin rond, souple et fruité, fait pour le plaisir de ses premières années.",
                "accords": "Les repas simples et les tablées d'amis : grillades, pizza, charcuterie, fromages doux.",
                "infos": [("Service", "15 à 16 °C"), ("Garde", "À boire entre 3 et 8 ans"), ("Cépages", "Merlot et cabernet-sauvignon")],
                "presse": None,
                "elaboration": [
                    "Son nom vient du petit port du hameau de Cadourne, « La Maréchale ». On raconte qu'une galère de ce nom, rescapée du combat naval de Gênes en 1638, s'y abrita en 1696 et lui laissa son nom.",
                    "Ses vignes sont les plus jeunes de Coufran : c'est le vin de la relève.",
                ],
                "document": None,
            },
        ],
    },
    "verdignan": {
        "nom": "Verdignan", "initiale": "V", "membre": "Jean", "role": "le père", "annee": "1972",
        "devise": "Le vin du père", "trait": "L'élégance classique",
        "description": "Château Verdignan, Haut-Médoc. Le vin du père : Jean Miailhe l'acquiert en 1972, un château face à l'estuaire, le vin de garde de la famille.",
        "intro": {"image": "verdignan-hero.jpg", "video": "verdignan-intro", "lignes": ["Gardez", 'l\'<span class="it">élégance</span> du', "père"]},
        "vins_image": "verdignan-cabane.jpg",
        "vins_titre": '<span class="it">découvrez</span><br>nos vins',
        "manifeste": 'Le grand classique<br><span class="it">qui regarde l\'eau</span><br>et prend son temps',
        "cercle": "verdignan-main.jpg",
        "temoin": {
            "numero": "2", "role": "Le père · arrivé en 1972",
            "deposition": "« J'ai été le dernier courtier de la famille. Deux ans après avoir arrêté, j'ai acheté le voisin de Coufran. Ici, rien ne se presse : la plus vieille porte du cuvier était déjà là bien avant nous. »",
            "valeur": "1720", "legende": "C'est la date gravée sur le linteau de pierre de la plus vieille porte du cuvier de Verdignan.",
            # La pièce se cherche à la loupe : l'image (illustration) et la zone de la date, en % de l'image
            "loupe": ("verdignan-linteau.jpg", 67.5, 36.5),
        },
        # Le temps de la garde : commentaires de dégustation après la mise en bouteille (chateau-verdignan.com, abrégés)
        "garde": [
            ("1997", "Élégance et équilibre, agréable fraîcheur, tanins goûteux : un classique de l'appellation."),
            ("1998", "Plus de saveur et de concentration. Long, très distingué, d'une aptitude certaine au vieillissement."),
            ("1999", "Épices, mûre, quetsche. Une bouche ronde et riche, un boisé français élégant."),
            ("2000", "Certainement le meilleur millésime jamais produit par le cru : particulièrement vineux, et de garde."),
            ("2001", "Fruits épicés dans un boisé noble. De la complexité et de la longueur."),
            ("2002", "Tanins tendres et fondus, grande persistance, complexité et élégance : une bouteille destinée à un bel avenir."),
            ("2003", "Fruits noirs vifs et intenses, matière riche, attaque souple : un assemblage tourné vers le charme."),
            ("2004", "Élégant et profond, un joli grain de tanins, une belle tenue en longueur."),
            ("2005", "Distingué et puissant, texture serrée. Avec le temps, le boisé s'harmonise avec sa fermeté pour une très belle finale."),
            ("2006", "Dense et concentré, du style stéphanois très cabernet : une pointe d'acidité, gage de vieillissement."),
            ("2007", "Attaque veloutée, structure souple et ronde, tanins sans sécheresse, grande persistance."),
            ("2008", "Cassis et prune. Puissance et densité dans un ensemble rond et onctueux, des tanins longs et savoureux."),
            ("2009", "Prune et cerise, un corps velouté, des tanins fondus : un grand potentiel de vieillissement."),
            ("2010", "Une matière exceptionnelle, qui grâce à sa fraîcheur pourra vieillir très longtemps."),
            ("2011", "Torréfié et fruits rouges, un tanin serré, et la fraîcheur tout au long de la dégustation."),
            ("2012", "Myrtille, mûre et épices : volume, souplesse et raffinement."),
            ("2013", "Fruits noirs et toasté, une structure droite et fraîche : un vin équilibré, au bon potentiel de garde."),
            ("2014", "Un grand vin de garde, qui vieillira longtemps grâce à sa structure tannique et son caractère affirmé."),
            ("2015", "Chocolat, épices, fruits rouges : une grande capacité de garde, sans empêcher de l'ouvrir dès aujourd'hui."),
            ("2016", "Gourmand, puissant, élégant et très long : sans doute un des plus beaux millésimes de Verdignan."),
        ],
        "garde_vedettes": ["2000", "2016"],
        "acheter": [
            ("Boutique en ligne", "coufran-verdignan.com", "https://www.coufran-verdignan.com/"),
            ("Maisons du Vin", "Saint-Seurin-de-Cadourne et Pauillac", None),
            ("En Belgique", "Carrefour, depuis plus de quarante ans", None),
            ("Dans le monde", "Les négociants de la Place de Bordeaux", None),
        ],
        "contact": {"tel": "+33 5 56 59 31 02", "mail": "contact@chateau-verdignan.com"},
        "famille": {
            "image": "verdignan-estuaire.jpg", "alt": "Le château Verdignan dans ses vignes, l'estuaire à l'horizon",
            "titre": "L'<span class=\"it\">histoire</span><br>du père",
            "about_titre": ["Jean,", "1972,", '<span class="it">le gardien</span>'],
            "about": [
                "Verdignan est l'une des plus anciennes propriétés viticoles du canton de Pauillac, et sans doute la plus ancienne de Saint-Seurin-de-Cadourne. Tout près se dressait l'abbaye de Cadourne, halte des pèlerins de Compostelle ; au petit port de La Maréchale, les gabarres chargeaient les barriques pour Bordeaux. La même famille garde le domaine de la fin du XVIII<sup>e</sup> siècle jusqu'en 1934.",
                "En 1972, puis en 1975, Jean Miailhe, le fils de Louis, achète ce voisin de Coufran. Il vient d'arrêter le courtage : il sera le dernier courtier de la famille, et le premier à garder ses vins comme on garde une tradition.",
            ],
            "galerie": [("verdignan-barrique.jpg", "Une barrique qu'on fait rouler dans le chai"), ("verdignan-vendanges.jpg", "Grappes noires aux vendanges"), ("acte-verdignan-carte-postale.jpg", "Le château vers 1900"), ("verdignan-vinification.jpg", "Le vin jaillit d'une cuve"), ("verdignan-chai.jpg", "Barriques empilées"), ("verdignan-culots.jpg", "Les culots des bouteilles en attente"), ("verdignan-chenes.jpg", "Deux chênes devant les vignes d'automne"), ("verdignan-vignes.jpg", "Rangs dorés à l'automne")],
            "terroir_titre": ["Les grands terroirs", '<span class="it">regardent l\'eau</span>'],
            "terroir": "Soixante hectares face à l'estuaire de la Gironde, à la frontière de Saint-Estèphe. Autour du château, quarante hectares de graves et d'argiles portent les vieux cabernets ; plus loin, vingt hectares de jeunes vignes sur argilo-calcaire. L'eau tempère le climat, les graves drainent et réchauffent les racines.",
            "chiffres": [("60 ha", "face à l'estuaire"), ("65 %", "de cabernet-sauvignon"), ("45 ans", "âge moyen des vignes")],
            "lignee_titre": ["Jean l'a choisi,", 'Éric l\'a <span class="it">élevé</span>,', "Lovely le transmettra"],
            "lignee": [
                "Le vin de garde de la famille demande de la patience, et la patience se transmet. Depuis les années 1980, Éric Miailhe, le fils de Jean, veille sur Verdignan avec sa sœur Marie-Cécile Vicaire. Depuis 2006, sa fille Lovely est à ses côtés.",
                "Comme à Coufran, les bouteilles attendent au château que le vin soit prêt. Verdignan ne sort jamais avant son heure.",
            ],
            "photos": [("verdignan-chai.jpg", "Barriques empilées dans le chai"), ("verdignan-vignes.jpg", "Les vignes de Verdignan à l'automne")],
            "decouvrir": "verdignan-casiers.jpg",
        },
        "vins": [
            {
                "slug": "chateau-verdignan", "nom": "Château Verdignan", "titre": "Verdignan", "sous": "Château · grand vin",
                "categorie": "Le grand vin", "famille": "Le vin du père", "image": "bouteille-verdignan.webp",
                "carrousel": "AOC Haut-Médoc · le grand vin",
                "h2": 'Puissant, <span class="it">frais</span>, de garde',
                "notes": "Un grand classique médocain, voisin de Saint-Estèphe. Le nez mêle cassis, épices et chocolat. La bouche allie puissance et fraîcheur, avec des tanins consistants mais soyeux et une belle longueur. Il ne se presse pas : c'est le vin de garde de la famille, et il s'embellit avec les années.",
                "accords": "Le vin des amateurs, qui aime les repas longs et la viande : côte de bœuf, gibier, agneau de sept heures, fromages de caractère.",
                "infos": [("Service", "17 à 18 °C"), ("Garde", "Aujourd'hui ou dans longtemps"), ("Cépages", "Environ 75 % cabernet-sauvignon, merlot, cabernet franc")],
                "presse": "Millésime 2020 · Guide Hachette 2024, deux étoiles et coup de cœur",
                "elaboration": [
                    "Seule une partie des graves qui entourent le château entre dans le grand vin, à majorité de cabernet-sauvignon depuis 1999. Merlots vendangés d'abord, cabernets ensuite ; cuves inox thermorégulées ; assemblage arrêté en décembre avec l'œnologue Éric Boissenot.",
                    "Douze mois en barriques de chêne français renouvelées par quart, puis une longue attente en bouteille, au château. Verdignan sort quand il est prêt, jamais avant.",
                ],
                "document": ("Télécharger la fiche technique", "../assets/docs/verdignan-fiche-technique.pdf"),
            },
            {
                "slug": "n2-de-verdignan", "nom": "N°2 de Verdignan", "titre": "N°2", "sous": "de Verdignan · second vin",
                "categorie": "Le second vin", "famille": "Le cadet du père", "image": "bouteille-verdignan-n2.webp",
                "carrousel": "AOC Haut-Médoc · le second vin",
                "h2": 'Expressif, <span class="it">rond</span>, frais',
                "notes": "Une robe intense. Dès l'ouverture, les fruits noirs et les épices, relevés par la fraîcheur. Les tanins sont fins, le fruit persiste. Prêt à boire, il garde de quoi attendre.",
                "accords": "Viandes grillées, canard, plats mijotés, cuisine de bistrot.",
                "infos": [("Service", "16 à 17 °C"), ("Garde", "Prêt à boire, peut attendre"), ("Cépages", "Cabernet-sauvignon et merlot")],
                "presse": None,
                "elaboration": [
                    "Le N°2 vient en partie des vingt hectares de jeunes vignes sur argilo-calcaire, plantés plus loin du château. Même chai, même équipe, même exigence que le grand vin.",
                ],
                "document": None,
            },
            {
                "slug": "plantey-de-la-croix", "nom": "Château Plantey de la Croix", "titre": "Plantey de la Croix", "sous": "Château · jeunes vignes",
                "categorie": "Les jeunes vignes", "famille": "Les jeunes vignes du père", "image": "bouteille-plantey.webp",
                "carrousel": "AOC Haut-Médoc · les jeunes vignes",
                "h2": 'Souple, <span class="it">fruité</span>, frais',
                "notes": "Les plus jeunes vignes de merlot et de cabernet-sauvignon de Verdignan donnent un vin frais et rond, aux tanins souples.",
                "accords": "Apéritifs dînatoires, grillades, cuisine de tous les jours.",
                "infos": [("Service", "15 à 16 °C"), ("Garde", "À boire entre 3 et 8 ans"), ("Cépages", "Merlot et cabernet-sauvignon")],
                "presse": None,
                "elaboration": [
                    "À la fin du XVIII<sup>e</sup> siècle, quand Bordeaux se met à planter davantage pour exporter, les jeunes plantations prennent le nom de « plantey ».",
                    "Le nom dit tout : c'est le vin des jeunes vignes, celui qui annonce les grands Verdignan de demain.",
                ],
                "document": None,
            },
        ],
    },
    "soudars": {
        "nom": "Soudars", "initiale": "S", "membre": "Éric", "role": "le fils", "annee": "1973",
        "devise": "Le vin du fils", "trait": "Le plaisir partagé",
        "description": "Château Soudars, Haut-Médoc. Le vin du fils : Éric Miailhe l'a bâti en 1973 sur des friches pleines de pierres. Un vin rond et gourmand, à partager.",
        "intro": {"image": "soudars-intro-poster.jpg", "video": "soudars-intro", "lignes": ["Partagez", 'le <span class="it">plaisir</span> du', "fils"]},
        "vins_image": "soudars-terre.jpg",
        "vins_titre": '<span class="it">découvrez</span><br>nos millésimes',
        "manifeste": 'Le vin<br><span class="it">né de la pierre</span>,<br>à partager sans attendre',
        "cercle": "soudars-verre.jpg",
        "temoin": {
            "numero": "3", "role": "Le fils · arrivé en 1973",
            "deposition": "« En 1973, on m'a dit que les grands vins du Médoc ne naissaient que sur les graves. J'ai acheté des friches pleines de pierres et de ronces. On a tout épierré à la main. »",
            "valeur": "Soudar", "legende": "Un vieux mot gallois, du temps des Anglais en Aquitaine : un enclos de murs de pierres sèches qui protégeait le bétail. Soudars n'a pas de château : son monument, c'est cet enclos.",
        },
        "acheter": [
            ("Boutique en ligne", "boutique.chateausoudars.com", "https://boutique.chateausoudars.com/"),
            ("Maisons du Vin", "Saint-Seurin-de-Cadourne et Pauillac", None),
            ("En Belgique", "Delhaize", None),
            ("Dans le monde", "Les négociants de la Place de Bordeaux", None),
        ],
        "contact": {"tel": "+33 5 56 59 36 09", "mail": "contact@chateausoudars.com"},
        # À partager : le château conseille les viandes rouges et blanches, rôties ou grillées ; les occasions sont nos idées
        "occasions": [
            ("barbecue", "Le barbecue aux sarments", "soudars-fagot.jpg",
             "Une entrecôte grillée sur les sarments de la taille, comme on le fait dans le Bordelais, des brochettes d'agneau, des saucisses aux herbes. Servi à 16 °C, son fruit rouge tient tête à la braise."),
            ("dimanche", "Le poulet du dimanche", "soudars-clocher.jpg",
             "Un poulet fermier rôti, des pommes de terre dans le jus, des petits pois. Ouvrez la bouteille quand la volaille entre au four : il aime prendre l'air."),
            ("tablee", "La grande tablée", "soudars-barriques.jpg",
             "Un gigot de sept heures ou un rôti de porc aux herbes, un plateau de fromages au milieu de la table. Une carafe, et chacun se sert."),
            ("aperitif", "L'apéritif dînatoire", "soudars-verre.jpg",
             "Une planche de charcuteries, des rillettes, du magret séché, des croûtons à la tapenade. Rond et juteux, il plaît dès qu'on le rencontre."),
        ],
        "famille": {
            "image": "soudars-vieux-ceps.jpg", "alt": "Vieux ceps tortueux de Soudars",
            "titre": "L'<span class=\"it\">histoire</span><br>du fils",
            "about_titre": ["Éric,", "1973,", '<span class="it">parti de rien</span>'],
            "about": [
                "Il était une fois un homme qui décide de créer un vignoble là où personne ne l'attend. En 1973, Éric Miailhe, le fils de Jean, jette son dévolu sur quinze hectares de friches couvertes de pierres et de ronces, sur un sol argilo-calcaire qui lui rappelle les grands terroirs de Saint-Émilion.",
                "Il faut épierrer, préparer les sols, replanter presque tout. Les premières années, la jeunesse des vignes est un handicap. Dans les années 1980, le vignoble entre dans l'âge adulte et Soudars prend son essor. Créer un cru de toutes pièces : dans le Médoc, les précédents sont rares.",
            ],
            "galerie": [("acte-soudars-racines.jpg", "Racines de vieilles vignes arrachées"), ("soudars-piquets.jpg", "Piquets de vigne taillés en pointe"), ("soudars-barriques.jpg", "Deux rangées de barriques"), ("soudars-fagot.jpg", "Un fagot de bois de taille"), ("soudars-baies.jpg", "Baies noires pruinées"), ("soudars-flaque.jpg", "Les rangs dans une flaque"), ("soudars-clocher.jpg", "Les vignes et le clocher au loin"), ("acte-soudars-pierres.jpg", "Pierres blanches au pied des vignes")],
            "terroir_titre": ["Des racines", '<span class="it">dans la roche</span>'],
            "terroir": "Sur le calcaire, une fine couche d'argile ; par endroits, il a fallu défoncer la roche pour planter. Les racines descendent dans les fissures chercher l'eau, au milieu des fossiles marins. On disait que les grands vins du Médoc ne naissaient que sur les graves : Éric a fait un autre pari, que le réchauffement du climat rend aujourd'hui visionnaire.",
            "chiffres": [("22 ha", "argilo-calcaires"), ("50 %", "de merlot"), ("30 km", "de l'océan")],
            "lignee_titre": ["Éric l'a bâti,", 'Lovely le <span class="it">partage</span>'],
            "lignee": [
                "Soudars, c'est l'histoire d'un fils qui voulait sa propre terre, et qui a gardé de ce départ une énergie communicative. Depuis 2006, sa fille Lovely travaille à ses côtés ; comme lui, elle tient à cet outil de travail et veut le transmettre à la génération suivante.",
                "« Avant, on faisait les vins qu'on pouvait. Désormais, on peut faire ceux que l'on souhaite. »",
            ],
            "photos": [("soudars-fagot.jpg", "Un fagot de bois de taille aux liens bleus"), ("acte-aujourdhui.jpg", "La famille Miailhe")],
            "decouvrir": "soudars-barriques.jpg",
        },
        # Soudars n'a qu'un vin : le carrousel présente ses millésimes
        "millesimes": [
            ("2018", "bouteille-soudars-2018.webp", "Cerise, groseille, framboise. Rond, aérien, friand."),
            ("2017", "bouteille-soudars-2017.webp", "Année de gel, petite récolte. Fruits frais, digeste."),
            ("2016", "bouteille-soudars-2016.webp", "Fruits noirs, boisé raffiné. Gras et onctueux."),
            ("2015", "bouteille-soudars-2015.webp", "Fraise des bois, cassis. Rond, tendu, long."),
            ("2014", "bouteille-soudars-2014.webp", "Cerise, cassis, épices. Souple, gras et frais."),
        ],
        "vins": [
            {
                "slug": "chateau-soudars", "nom": "Château Soudars", "titre": "Soudars", "sous": "Château · grand vin",
                "categorie": "Le grand vin", "famille": "Le vin du fils", "image": "bouteille-soudars.webp",
                "carrousel": "AOC Haut-Médoc",
                "h2": 'Rond, <span class="it">juteux</span>, gourmand',
                "notes": "Ouvert, rond, juteux et gourmand. Des fruits rouges frais, la fraise des bois, la framboise, la cerise, puis des tanins soyeux et une finale épicée. Il est agréable dès qu'on le rencontre.",
                "accords": "Le vin du quotidien et des grandes tablées : viandes rouges, viandes blanches rôties ou grillées, barbecue d'été, poulet du dimanche.",
                "infos": [("Service", "16 °C"), ("Garde", "Tout de suite, ou dans dix ans"), ("Cépages", "50 % merlot, 49 % cabernet-sauvignon, 1 % cabernet franc")],
                "presse": "Millésime 2016 · James Suckling, 93/100",
                "elaboration": [
                    "Longues macérations, de trois à quatre semaines ; élevage en barriques de chêne français à grain fin, renouvelées par quart, voire par tiers selon l'année ; assemblage avec l'œnologue Éric Boissenot. Ici, on refuse les raccourcis : ni thermovinification, ni osmose inverse, ni vin standardisé.",
                    "Comme à Coufran et à Verdignan, presque toutes les bouteilles vieillissent à la propriété avant de partir.",
                ],
                "document": ("Les millésimes 2000-2016 (PDF)", "../assets/docs/soudars-commentaires-2000-2016.pdf"),
            },
        ],
    },
}
ORDRE = ["coufran", "verdignan", "soudars"]


# ---------------------------------------------------------------- fragments communs

def embleme(c, cls="embleme"):
    """L'armoirie du château (Logos/ARMOIRIES), injectée par chateau.js depuis assets/js/armoiries.js."""
    return f'<span class="{cls}" data-armoirie="{c["id"]}" aria-hidden="true"></span>'


def familles(c):
    """Les trois armoiries en petit dans l'en-tête : on passe d'un château de la famille à l'autre."""
    def lien(k):
        nom = CHATEAUX[k]["nom"]
        ici = k == c["id"]
        courant = ' aria-current="page"' if ici else ""
        classe = "famille-lien ici" if ici else "famille-lien"
        return (f'<a class="{classe}" href="../{k}/index.html" data-nom="{nom}" aria-label="Château {nom}"{courant}>'
                f'<span class="armoirie" data-armoirie="{k}" data-forme="petit"></span></a>')
    liens = "".join(lien(k) for k in ORDRE)
    return f'<nav class="ch-familles" aria-label="Les trois châteaux de la famille">{liens}</nav>'


def tete(c, titre, description):
    return f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{titre}</title>
  <meta name="description" content="{description}">
  <link rel="stylesheet" href="../assets/css/polices.css">
  <link rel="stylesheet" href="../assets/css/chateau.css">
</head>
<body class="ch ch-{c['id']}">
'''


def age(c):
    return f'''  <!-- Âge légal, comme sur privios.com ; confirmé une seule fois pour toute la famille -->
  <div class="age" role="dialog" aria-modal="true" aria-labelledby="age-question">
    <div class="age-centre">
      {embleme(c)}
      <p class="age-question" id="age-question">Avez-vous l'âge légal pour boire du vin ?</p>
      <button class="pilule pilule--pleine oui" type="button">Oui, entrer</button>
      <button class="non" type="button">Non</button>
      <p class="non-message" hidden>Revenez plus tard : la vigne, elle, sait attendre.</p>
    </div>
    <p class="age-bas">En entrant, vous confirmez avoir l'âge légal de consommer de l'alcool dans votre pays. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
  </div>
'''


def entete(c, actif):
    liens = [("index.html#nos-vins", "Nos vins", "vins"), ("famille.html", "La famille", "famille"),
             ("index.html#temoin", "L'enquête", "enquete"), ("#contact", "Contact", "contact")]
    courant = ' aria-current="page"'
    nav = "\n".join(f'      <a href="{h}"{courant if k == actif else ""}>{t}</a>' for h, t, k in liens)
    return f'''  <header class="ch-entete">
    <a class="ch-logo" href="index.html" aria-label="Château {c['nom']}, accueil">{c['nom']}</a>
    <nav class="ch-nav" aria-label="Navigation du château">
{nav}
    </nav>
    <div class="ch-droite">
      {familles(c)}
      <a class="ch-maison" href="{VITRINE}" aria-label="Une maison de la famille MIAILHE">Une maison <span class="wordmark"></span></a>
    </div>
    <button class="ch-burger" type="button" aria-expanded="false" aria-label="Menu"><span></span></button>
  </header>
'''


def pied(c):
    autres = " · ".join(f'<a href="../{k}/index.html">{CHATEAUX[k]["nom"]}</a>' for k in ORDRE if k != c["id"])
    return f'''  <footer class="ch-pied" id="contact">
    <div class="ch-pied-haut">
      <div>
        <p class="titre">Contact</p>
        <p><a href="tel:{c['contact']['tel'].replace(' ', '')}">{c['contact']['tel']}</a> &nbsp; <a href="mailto:{c['contact']['mail']}">{c['contact']['mail']}</a></p>
        <p class="gris">Visites sur rendez-vous, pour les particuliers et les professionnels.</p>
      </div>
      {embleme(c)}
      <div>
        <p class="titre">Adresse</p>
        <p>Château {c['nom']}, 33180 Saint-Seurin-de-Cadourne</p>
        <p class="gris">AOC Haut-Médoc</p>
      </div>
    </div>
    <div class="ch-pied-bas">
      <a class="maison" href="{VITRINE}">Château {c['nom']} · une maison de la famille <span class="wordmark"></span></a>
      <nav aria-label="Liens du pied de page">
        <span>Les autres maisons : {autres}</span>
        <a href="{ENQUETE}">L'enquête</a>
        <button class="haut-page" type="button">↑ Haut</button>
      </nav>
    </div>
    <p class="sante">L'abus d'alcool est dangereux pour la santé, à consommer avec modération. Maquette de concept, projet étudiant ISCOM 2026, site non officiel. Photographies : sites des châteaux Coufran, Verdignan et Soudars.</p>
  </footer>
  <script src="../assets/js/logo.js"></script>
  <script src="../assets/js/armoiries.js"></script>
  <script src="../assets/js/chateau.js"></script>
</body>
</html>
'''


def tous_les_vins():
    """Les vins de la famille, dans l'ordre des générations, pour les liens « vin suivant » et « dans la même famille »."""
    return [(k, v) for k in ORDRE for v in CHATEAUX[k]["vins"]]


# ---------------------------------------------------------------- sections propres à chaque château

def quatre_mots(c):
    """Coufran : les quatre mots de l'œnologue, sur une roue ; chaque mot renvoie à une note officielle."""
    n = len(c["quatre_mots"])
    def arc(k):
        # quart de couronne de 2 pi k/n à 2 pi (k+1)/n, avec un petit jour entre les quartiers
        import math
        a0, a1 = math.radians(k * 360 / n - 90 + 1.2), math.radians((k + 1) * 360 / n - 90 - 1.2)
        R, r = 200, 128
        p = lambda rr, a: f"{200 + rr * math.cos(a):.1f} {200 + rr * math.sin(a):.1f}"
        return f"M{p(R, a0)}A{R} {R} 0 0 1 {p(R, a1)}L{p(r, a1)}A{r} {r} 0 0 0 {p(r, a0)}Z"
    def etiquette(k, mot):
        import math
        a = math.radians((k + .5) * 360 / n - 90)
        return f'<text x="{200 + 164 * math.cos(a):.1f}" y="{200 + 164 * math.sin(a) + 5:.1f}" text-anchor="middle">{mot.replace("La ", "")}</text>'
    quartiers = "\n".join(
        f'          <g class="mot{" is-actif" if k == 0 else ""}" data-mot="{k}" tabindex="0" role="button" aria-label="{mot}"><path d="{arc(k)}"/>{etiquette(k, mot)}</g>'
        for k, (mot, _, _) in enumerate(c["quatre_mots"]))
    notes = "\n".join(
        f'          <div class="mot-note" data-note="{k}"{"" if k == 0 else " hidden"}><p class="mot-titre">{mot}</p><p class="mot-texte">« {txt} »</p><p class="mot-source">{src}</p></div>'
        for k, (mot, txt, src) in enumerate(c["quatre_mots"]))
    return f'''
    <!-- Les quatre mots de l'œnologue : la roue (assets/js/chateau.js, [data-mots]) -->
    <section class="atelier atelier--mots" aria-labelledby="mots-titre">
      <div class="atelier-texte">
        <h2 class="titre-65" id="mots-titre" data-anime><span>En quatre</span><span class="it">mots</span></h2>
        <p class="paragraphe" data-anime="2">Interrogé pour le film du château, l'œnologue conseil Éric Boissenot résume Coufran en quatre mots : la générosité, la force, la délicatesse et la rondeur. On les retrouve, millésime après millésime, dans les notes de dégustation du château. Touchez un mot.</p>
      </div>
      <div class="roue" data-mots data-anime="2">
        <svg viewBox="0 0 400 400" aria-hidden="false" role="group" aria-label="Les quatre mots de Coufran">
{quartiers}
        </svg>
        <div class="roue-centre" aria-live="polite">
{notes}
        </div>
      </div>
    </section>
'''


def cave(c):
    """Coufran : la cave de Louis, un casier de culots de bouteilles ; chacun ouvre la note du millésime."""
    vedette = c["cave_vedette"]
    culots = "\n".join(
        f'          <button class="culot{" is-vedette" if a == vedette else ""}" type="button" data-annee="{a}" data-note="{txt}"'
        f' aria-pressed="{"true" if a == vedette else "false"}"><span>{a}</span></button>' for a, txt in c["cave"])
    note = dict(c["cave"])[vedette]
    return f'''
    <!-- La cave de Louis : les millésimes et ce qu'en dit le château ([data-cave]) -->
    <section class="atelier atelier--cave" aria-labelledby="cave-titre">
      <div class="atelier-texte">
        <h2 class="titre-65" id="cave-titre" data-anime><span>La cave</span><span>de <span class="it">Louis</span></span></h2>
        <p class="paragraphe" data-anime="2">Ici, on ne vend pas un vin tant qu'il n'est pas prêt : les bouteilles attendent au château, au frais, parfois des années. Dix-huit millésimes, de 1999 à 2016, et ce que le château en dit. Choisissez une bouteille.</p>
      </div>
      <div class="cave" data-cave data-anime="2">
        <div class="casier" role="group" aria-label="Les millésimes de Château Coufran">
{culots}
        </div>
        <div class="cave-note" aria-live="polite">
          <p class="cave-annee">{vedette}</p>
          <p class="cave-texte">{note}</p>
          <p class="cave-vedette">Le plus grand millésime de Coufran</p>
          <p class="cave-source">D'après les commentaires de dégustation du château</p>
        </div>
      </div>
    </section>
'''


def garde(c):
    """Verdignan : le temps de la garde. On choisit son millésime, la page dit où il en est (repères indicatifs)."""
    annees = [a for a, _ in c["garde"]]
    notes = "".join(f'<option value="{a}" data-note="{txt}"{" data-vedette" if a in c["garde_vedettes"] else ""}>{a}</option>' for a, txt in c["garde"])
    return f'''
    <!-- Le temps de la garde : où en est votre bouteille ? ([data-garde]) -->
    <section class="atelier atelier--garde" aria-labelledby="garde-titre">
      <div class="atelier-texte">
        <h2 class="titre-65" id="garde-titre" data-anime><span>Le temps</span><span>de la <span class="it">garde</span></span></h2>
        <p class="paragraphe" data-anime="2">L'œnologue Éric Boissenot se souvient de ce que lui disait son père, Jacques, qui conseillait déjà la famille : Verdignan avait de l'avenir, c'était un vignoble qui se révélerait avec les années. Le château ne vend un millésime que lorsqu'il est prêt ; à vous de choisir quand l'ouvrir. Quel est le vôtre ?</p>
      </div>
      <div class="garde" data-garde data-anime="2">
        <label class="garde-choix"><span>Mon millésime</span>
          <select>{notes}</select>
        </label>
        <input class="garde-curseur" type="range" min="{annees[0]}" max="{annees[-1]}" step="1" value="2010" aria-label="Millésime">
        <p class="garde-age"><strong>2010</strong><span></span></p>
        <ol class="garde-frise" aria-label="Les âges d'un Verdignan">
          <li data-de="0" data-a="5"><strong>La jeunesse</strong>Le fruit domine, les tanins sont encore fermes : une à deux heures en carafe.</li>
          <li data-de="6" data-a="12"><strong>L'ouverture</strong>Les tanins s'assouplissent, le bouquet se dessine : cassis, épices, cèdre.</li>
          <li data-de="13" data-a="22"><strong>La plénitude</strong>Le bouquet s'épanouit : cuir, sous-bois, tabac. Le moment des grandes tablées.</li>
          <li data-de="23" data-a="99"><strong>Le grand âge</strong>Pour les amateurs de vins évolués : ouvrez-le peu avant de servir, sans carafe.</li>
        </ol>
        <blockquote class="garde-note"><p></p><cite>Le château, à la mise en bouteille</cite></blockquote>
        <p class="garde-avertissement">Les âges sont des repères indicatifs pour un Haut-Médoc à dominante de cabernet-sauvignon ; tout dépend de la conservation de la bouteille.</p>
      </div>
    </section>
'''


def partage(c):
    """Soudars : les accords par occasion, puis l'invitation à composer et à envoyer."""
    def onglet(n, k, titre):
        choisi = "true" if n == 0 else "false"
        hors_tab = "" if n == 0 else ' tabindex="-1"'
        return (f'          <button type="button" role="tab" id="onglet-{k}" aria-controls="occasion-{k}" aria-selected="{choisi}"{hors_tab}'
                f' data-occasion="{titre}">{titre}</button>')
    onglets = "\n".join(onglet(n, k, titre) for n, (k, titre, _, _) in enumerate(c["occasions"]))
    panneaux = "\n".join(
        f'        <div class="occasion" role="tabpanel" id="occasion-{k}" aria-labelledby="onglet-{k}"{"" if n == 0 else " hidden"}>'
        f'<figure><img src="../assets/img/{img}" alt="" loading="lazy"></figure><div><h3>{titre}</h3><p>{txt}</p></div></div>'
        for n, (k, titre, img, txt) in enumerate(c["occasions"]))
    premier = c["occasions"][0][1]
    return f'''
    <!-- À partager : les accords par occasion et l'invitation ([data-partage], [data-invitation]) -->
    <section class="atelier atelier--partage" id="a-partager" aria-labelledby="partage-titre">
      <div class="atelier-texte atelier-texte--large">
        <h2 class="titre-65" id="partage-titre" data-anime><span>À partager</span><span class="it">sans attendre</span></h2>
        <p class="paragraphe" data-anime="2">Le château conseille Soudars avec les viandes rouges et les viandes blanches, rôties ou grillées. Voici nos idées pour l'ouvrir, selon l'occasion.</p>
      </div>
      <div class="partage" data-partage data-anime="2">
        <div class="onglets" role="tablist" aria-label="Les occasions">
{onglets}
        </div>
{panneaux}
      </div>

      <div class="invitation" data-invitation>
        <div class="invitation-form">
          <h3 class="invitation-titre">Invitez vos amis</h3>
          <p class="invitation-intro">Composez votre invitation, puis envoyez-la ou enregistrez-la en image.</p>
          <label>Votre prénom<input type="text" name="prenom" maxlength="30" placeholder="Lovely" autocomplete="given-name"></label>
          <label>Le jour<input type="text" name="quand" maxlength="40" placeholder="Samedi 12, vers 19 h"></label>
          <label>L'adresse<input type="text" name="ou" maxlength="60" placeholder="Au fond du jardin"></label>
          <div class="invitation-actions">
            <button class="pilule pilule--pleine" type="button" data-action="image">Enregistrer l'image</button>
            <button class="pilule" type="button" data-action="partager">Partager</button>
            <a class="pilule" href="#" data-action="mail">Envoyer par e-mail</a>
            <button class="pilule" type="button" data-action="copier">Copier le texte</button>
          </div>
          <p class="invitation-retour" aria-live="polite"></p>
        </div>
        <figure class="carte-invitation" aria-label="Aperçu de l'invitation">
          <span class="embleme" data-armoirie="{c['id']}" aria-hidden="true"></span>
          <p class="carte-occasion">{premier}</p>
          <p class="carte-chez">chez <span data-champ="prenom">Lovely</span></p>
          <p class="carte-details"><span data-champ="quand">Samedi 12, vers 19 h</span><br><span data-champ="ou">Au fond du jardin</span></p>
          <p class="carte-mot">On ouvre un Soudars.</p>
          <p class="carte-sante">Château Soudars · Haut-Médoc. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
        </figure>
      </div>
    </section>
'''


def avant_apres(c):
    """Coufran : Couffrant vers 1900 et Coufran aujourd'hui, l'un sur l'autre ; on fait glisser la frontière."""
    av, av_alt, ap, ap_alt = c["avant_apres"]
    return f'''
    <!-- Avant et après 1924 ([data-avant-apres]) -->
    <section class="atelier atelier--avant-apres" aria-labelledby="avant-titre">
      <div class="atelier-texte atelier-texte--large">
        <h2 class="titre-65" id="avant-titre" data-anime><span>Couffrant</span><span>devient <span class="it">Coufran</span></span></h2>
        <p class="paragraphe" data-anime="2">En 1924, Louis achète « Couffrant » et en fixe l'orthographe. Le vignoble est alors planté de cabernet-sauvignon ; il le replante en merlot. Faites glisser pour passer d'une époque à l'autre.</p>
      </div>
      <div class="avant-apres" data-avant-apres data-anime="2" style="--pos: 50%">
        <img class="apres" src="../assets/img/{ap}" alt="{ap_alt}" loading="lazy">
        <div class="avant"><img src="../assets/img/{av}" alt="{av_alt}" loading="lazy"></div>
        <span class="poignee" aria-hidden="true"></span>
        <input type="range" min="0" max="100" value="50" aria-label="Passer de la carte postale de 1900 à la photo d'aujourd'hui">
        <p class="etiquette etiquette--avant">Vers 1900 · surtout du cabernet-sauvignon</p>
        <p class="etiquette etiquette--apres">Aujourd'hui · 85 % merlot, 15 % cabernet-sauvignon</p>
      </div>
    </section>
'''


def gabarres(c):
    """Verdignan : la route des gabarres, du port de La Maréchale aux quais de Bordeaux ; un bateau suit le défilement."""
    return '''
    <!-- La route des gabarres ([data-gabarre]) : carte indicative, non à l'échelle -->
    <section class="atelier atelier--gabarres" aria-labelledby="gabarres-titre">
      <div class="atelier-texte">
        <h2 class="titre-65" id="gabarres-titre" data-anime><span>La route</span><span>des <span class="it">gabarres</span></span></h2>
        <div class="paragraphe" data-anime="2">
          <p>Avant les camions, le vin partait par l'eau. Au petit port de La Maréchale, dans le hameau de Cadourne, les gabarres, ces bateaux à fond plat, chargeaient les barriques de Verdignan, puis remontaient l'estuaire avec la marée jusqu'aux quais de Bordeaux, où attendaient négociants et courtiers.</p>
          <p>Le port a donné son nom à un vin de la famille, La Rose Maréchale : on raconte qu'une galère de ce nom, rescapée du combat naval de Gênes en 1638, vint s'y abriter en 1696.</p>
        </div>
      </div>
      <figure class="carte-gabarres" data-gabarre data-anime="2">
        <svg viewBox="-70 0 490 640" role="img" aria-label="Carte indicative de l'estuaire de la Gironde, du port de La Maréchale à Bordeaux">
          <path class="eau" d="M60 0H250C232 70 226 120 236 170C250 240 262 300 262 360C262 420 270 470 286 520C296 560 300 600 304 640H284C278 600 270 560 258 524C238 470 226 420 222 360C218 300 196 240 168 176C140 116 100 56 60 0Z"/>
          <path class="eau eau--dordogne" d="M262 360C300 372 340 380 420 372V392C340 402 300 396 268 386Z"/>
          <text class="riviere" x="150" y="96" transform="rotate(58 150 96)">Estuaire de la Gironde</text>
          <text class="riviere" x="352" y="368">Dordogne</text>
          <text class="riviere" x="312" y="600" transform="rotate(78 312 600)">Garonne</text>
          <path class="route" d="M118 70C150 120 176 170 196 230C214 290 236 330 244 380C254 440 266 500 292 600"/>
          <g class="etapes">
            <circle cx="118" cy="70" r="5" class="depart"/><text x="104" y="66" text-anchor="end" class="fort">La Maréchale</text><text x="104" y="82" text-anchor="end">Saint-Seurin-de-Cadourne</text>
            <circle cx="150" cy="122" r="3"/><text x="138" y="126" text-anchor="end">Saint-Estèphe</text>
            <circle cx="180" cy="180" r="3"/><text x="168" y="184" text-anchor="end">Pauillac</text>
            <circle cx="200" cy="240" r="3"/><text x="188" y="244" text-anchor="end">Saint-Julien</text>
            <circle cx="240" cy="360" r="3"/><text x="228" y="364" text-anchor="end">Margaux</text>
            <circle cx="258" cy="236" r="3"/><text x="270" y="240">Blaye</text>
            <circle cx="292" cy="600" r="5" class="arrivee"/><text x="280" y="604" text-anchor="end" class="fort">Bordeaux</text><text x="280" y="620" text-anchor="end">les quais des négociants</text>
          </g>
          <g class="gabarre" aria-hidden="true"><path d="M-14 0H14L9 6H-9Z"/><path d="M0 0V-18M0 -17L10 -3H0" /></g>
        </svg>
        <figcaption>Carte indicative, sans échelle. Une soixantaine de kilomètres d'estuaire séparent le port de La Maréchale des quais de Bordeaux.</figcaption>
      </figure>
    </section>
'''


def epierrer(c):
    """Soudars : le petit jeu de l'épierrage (assets/js/chateau.js, [data-epierrer])."""
    return '''
    <!-- Épierrer la parcelle : les pierres sont semées par le script ; une fois la terre nette, la vigne pousse -->
    <section class="atelier atelier--epierrer" aria-labelledby="epierrer-titre">
      <div class="atelier-texte atelier-texte--large">
        <h2 class="titre-65" id="epierrer-titre" data-anime><span>À vous</span><span>d'<span class="it">épierrer</span></span></h2>
        <p class="paragraphe" data-anime="2">En 1973, les parcelles de Soudars étaient couvertes de pierres et de ronces. Avant de planter, il a fallu tout enlever, une pierre après l'autre. Essayez sur ce petit carré de terre : touchez les pierres, ou passez dessus en gardant le doigt ou le bouton appuyé.</p>
      </div>
      <div class="epierrer" data-epierrer data-anime="2">
        <div class="parcelle" role="application" aria-label="Parcelle à épierrer">
          <svg class="vigne" viewBox="0 0 900 500" preserveAspectRatio="none" aria-hidden="true"></svg>
        </div>
        <div class="epierrer-bas">
          <p class="compteur" aria-live="polite"><strong>0</strong> pierre retirée</p>
          <button class="pilule" type="button" data-recommencer>Recommencer</button>
        </div>
        <p class="epierrer-fin" hidden>La terre est nette, la vigne peut pousser. En 1973, il a fallu faire la même chose sur quinze hectares. Cinquante ans plus tard, ces vignes donnent Soudars.</p>
      </div>
    </section>
'''


# Où chaque château place ses sections : sur l'accueil après le carrousel, sur la page famille après le récit ou la galerie
EXTRAS = {
    "coufran": {"accueil": [quatre_mots, cave], "famille_recit": [avant_apres], "famille_galerie": []},
    "verdignan": {"accueil": [garde], "famille_recit": [], "famille_galerie": [gabarres]},
    "soudars": {"accueil": [partage], "famille_recit": [epierrer], "famille_galerie": []},
}


def extras(c, ou):
    return "".join(f(c) for f in EXTRAS[c["id"]][ou])


def piece(t):
    """La pièce à conviction du témoin ; à Verdignan, elle se cherche à la loupe sur le linteau."""
    if not t.get("loupe"):
        return f'''        <div class="piece" data-anime="3">
          <p class="piece-etiquette">Pièce à conviction</p>
          <p class="piece-valeur">{t['valeur']}</p>
          <p class="piece-legende">{t['legende']}</p>
        </div>'''
    img, x, y = t["loupe"]
    return f'''        <div class="piece piece--loupe" data-anime="3" data-loupe data-x="{x}" data-y="{y}" data-valeur="{t['valeur']}">
          <p class="piece-etiquette">Pièce à conviction</p>
          <p class="loupe-consigne">Passez la loupe sur le linteau de la plus vieille porte du cuvier : une date y est gravée.</p>
          <div class="linteau" style="--lx: 30%; --ly: 50%">
            <img class="linteau-ombre" src="../assets/img/{img}" alt="" loading="lazy">
            <img class="linteau-net" src="../assets/img/{img}" alt="Le linteau de pierre de la vieille porte du cuvier, avec une date gravée" loading="lazy">
            <span class="loupe-cercle" aria-hidden="true"></span>
          </div>
          <p class="piece-valeur" aria-live="polite">· · · ·</p>
          <p class="piece-legende" hidden>{t['legende']}</p>
          <button class="loupe-aide" type="button">Je ne trouve pas</button>
          <p class="loupe-credit">Illustration : le linteau n'a pas encore été photographié.</p>
        </div>'''


# ---------------------------------------------------------------- accueil d'un château

def accueil(c):
    lignes = "\n".join(f'          <span data-anime="{n + 1}">{l}</span>' for n, l in enumerate(c["intro"]["lignes"]))
    if c.get("millesimes"):
        vin = c["vins"][0]
        items = [(f"{vin['nom']} {a}", f"Haut-Médoc · {note}", f"{vin['slug']}.html", img, a) for a, img, note in c["millesimes"]]
        gamme_titre, gamme = "Millésimes", [(a, None) for a, _, _ in c["millesimes"]]
    else:
        items = [(v["nom"], v["carrousel"], f"{v['slug']}.html", v["image"], v["categorie"]) for v in c["vins"]]
        gamme_titre, gamme = "La gamme", [(v["nom"], v["categorie"]) for v in c["vins"]]
    bouteilles = "\n".join(
        f'        <button class="bouteille" type="button" data-nom="{n}" data-origine="{o}" data-lien="{l}" aria-label="{n}">'
        f'<img src="../assets/img/{img}" alt="" loading="lazy"></button>' for n, o, l, img, _ in items)
    liste_gamme = "\n".join(
        f'              <li><button type="button" data-aller-bouteille="{k}">{t}{f"<small>{s}</small>" if s else ""}</button></li>'
        for k, (t, s) in enumerate(gamme))
    def achat(t, s, u):
        texte = f"{t}<small>{s}</small>"
        return f'              <li><a href="{u}" target="_blank" rel="noopener">{texte}</a></li>' if u else f"              <li>{texte}</li>"
    liste_achat = "\n".join(achat(*a) for a in c["acheter"])
    t = c["temoin"]
    return tete(c, f"Château {c['nom']} · {c['devise']} · Haut-Médoc", c["description"]) + age(c) + entete(c, "accueil") + f'''
  <main>
    <section class="intro" aria-label="Château {c['nom']}">
      <!-- Film d'intro en boucle, comme sur privios.com : la photo du château sert d'affiche pendant le chargement -->
      <div class="intro-fond">
        <video autoplay muted loop playsinline preload="auto" poster="../assets/img/{c['intro']['image']}" aria-hidden="true">
          <source src="../assets/video/{c['intro']['video']}.webm" type="video/webm">
          <source src="../assets/video/{c['intro']['video']}.mp4" type="video/mp4">
        </video>
      </div>
      <div class="intro-contenu">
        {embleme(c)}
        <h1 class="intro-texte">
{lignes}
        </h1>
      </div>
      <a class="fleche-bas" href="#nos-vins" aria-label="Découvrir nos vins"></a>
    </section>

    <section class="vins-titre" id="nos-vins">
      <img src="../assets/img/{c['vins_image']}" alt="" loading="lazy">
      <p data-anime>{c['vins_titre']}</p>
    </section>

    <section class="bouteilles" aria-label="Nos vins" tabindex="-1">
      <div class="piste">
{bouteilles}
      </div>
      <button class="fleche-carrousel fleche-carrousel--prec" type="button" aria-label="Bouteille précédente"></button>
      <button class="fleche-carrousel fleche-carrousel--suiv" type="button" aria-label="Bouteille suivante"></button>
      <div class="bouteille-desc" aria-live="polite"><p class="nom"></p><p class="origine"></p></div>
      <div class="points"></div>
      <div class="bouteilles-bas">
        <div class="filtre">
          <button class="pilule" type="button" aria-expanded="false">{gamme_titre} <span class="chevron"></span></button>
          <ul class="filtre-liste">
{liste_gamme}
          </ul>
        </div>
        <a class="pilule pilule--pleine" href="#" data-lien-vin>Le découvrir</a>
        <div class="filtre">
          <button class="pilule" type="button" aria-expanded="false">Où l'acheter <span class="chevron"></span></button>
          <ul class="filtre-liste">
{liste_achat}
          </ul>
        </div>
      </div>
    </section>
{extras(c, "accueil")}
    <section class="manifeste">
      <h2 class="manifeste-titre" data-anime>{c['manifeste']}</h2>
      <a class="cercle" href="famille.html" data-anime="2">
        <img src="../assets/img/{c['cercle']}" alt="" loading="lazy">
        <p><span class="it">découvrez</span><br>la famille</p>
      </a>
    </section>

    <!-- Le témoin de l'Enquête « La page arrachée » (la vitrine MIAILHE renvoie ici) -->
    <section class="temoin" id="temoin" aria-labelledby="temoin-nom">
      <div class="temoin-grille">
        <div>
          <span class="cachet">L'enquête Miailhe · Témoin n° {t['numero']}</span>
          <h2 id="temoin-nom" data-anime>{c['membre']}</h2>
          <p class="role">{t['role']}</p>
          <blockquote data-anime="2">{t['deposition']}</blockquote>
          <a class="pilule" href="{ENQUETE}">Reprendre l'enquête</a>
        </div>
{piece(t)}
      </div>
    </section>
  </main>
''' + pied(c)


# ---------------------------------------------------------------- page famille

def carte_terroir(ici):
    """Carte indicative des trois domaines de Saint-Seurin-de-Cadourne, le château de la page en couleur."""
    domaines = {
        "coufran": ("M262 92C292 70 344 74 366 98C388 122 380 160 352 176C322 194 274 188 254 162C236 138 236 110 262 92Z", 308, 66),
        "verdignan": ("M356 236C380 220 418 226 430 250C442 276 428 304 400 312C372 320 344 304 340 280C336 262 340 246 356 236Z", 388, 210),
        "soudars": ("M196 356C214 342 244 344 254 362C264 380 252 402 230 406C208 410 186 398 184 380C182 370 186 362 196 356Z", 220, 334),
    }
    def forme(k, d, x, y):
        en_avant = k == ici
        return (f'          <path class="domaine{" ici" if en_avant else ""}" d="{d}"/>\n'
                f'          <text x="{x}" y="{y}" text-anchor="middle" class="{"ici" if en_avant else ""}">{CHATEAUX[k]["nom"]}</text>')
    formes = "\n".join(forme(k, *v) for k, v in domaines.items())
    return f'''      <figure class="carte-terroir" data-anime>
        <svg viewBox="0 0 600 520" role="img" aria-label="Carte indicative : les trois domaines de la famille à Saint-Seurin-de-Cadourne, au bord de l'estuaire">
          <path class="estuaire" d="M372 0H600V520H572C548 430 516 352 476 286C444 232 410 150 372 0Z"/>
          <text x="540" y="210" class="petit" transform="rotate(66 540 210)">Estuaire de la Gironde</text>
          <path class="route" d="M120 40C200 140 300 220 320 300S300 440 330 520"/>
          <circle cx="306" cy="226" r="3.5" fill="currentColor" opacity=".6"/>
          <text x="296" y="230" text-anchor="end" class="petit">Saint-Seurin-de-Cadourne</text>
          <text x="306" y="498" class="petit">Saint-Estèphe ↓</text>
          <text x="20" y="306" class="petit">← Océan, 30 km</text>
{formes}
        </svg>
      </figure>'''


def famille(c):
    f = c["famille"]
    titre_about = "\n".join(f'        <span>{s}</span>' for s in f["about_titre"])
    about = "\n".join(f'        <p>{p}</p>' for p in f["about"])
    galerie = "\n".join(f'        <figure><img src="../assets/img/{img}" alt="{alt}" loading="lazy"></figure>' for img, alt in f["galerie"])
    terroir_titre = "\n".join(f'          <span>{s}</span>' for s in f["terroir_titre"])
    chiffres = "\n".join(f'          <div><strong>{a}</strong>{b}</div>' for a, b in f["chiffres"])
    lignee_titre = "\n".join(f'            <span>{s}</span>' for s in f["lignee_titre"])
    lignee = "\n".join(f'            <p>{p}</p>' for p in f["lignee"])
    generations = "\n".join(f'            <li class="{"ici" if k == c["id"] else ""}"><strong>{n}</strong>{a}</li>' for n, a, k in LIGNEE)
    (pa, pa_alt), (pb, pb_alt) = f["photos"]
    return tete(c, f"La famille · Château {c['nom']} · {c['devise']}", f"L'histoire du château {c['nom']} et de la famille Miailhe.") + age(c) + entete(c, "famille") + f'''
  <main>
    <section class="histoire-intro">
      <img src="../assets/img/{f['image']}" alt="{f['alt']}">
      <h1 class="intro-texte" data-anime><span>{f['titre']}</span></h1>
      <a class="fleche-bas" href="#recit" aria-label="Lire l'histoire"></a>
    </section>

    <section class="bloc-texte" id="recit">
      <h2 class="titre-65" data-anime>
{titre_about}
      </h2>
      <div class="paragraphe" data-anime="2">
{about}
      </div>
    </section>
{extras(c, "famille_recit")}
    <section class="galerie" aria-label="Galerie">
      <div class="galerie-piste">
{galerie}
      </div>
      <button class="fleche-carrousel fleche-carrousel--prec" type="button" aria-label="Photos précédentes"></button>
      <button class="fleche-carrousel fleche-carrousel--suiv" type="button" aria-label="Photos suivantes"></button>
    </section>
{extras(c, "famille_galerie")}
    <section class="terroir">
{carte_terroir(c['id'])}
      <div class="bloc">
        <h2 class="titre-65" data-anime>
{terroir_titre}
        </h2>
        <p class="paragraphe" data-anime="2">{f['terroir']}</p>
        <div class="chiffres" data-anime="3">
{chiffres}
        </div>
      </div>
    </section>

    <section class="lignee">
      <div class="lignee-grille">
        <figure class="photo-a" data-anime><img src="../assets/img/{pa}" alt="{pa_alt}" loading="lazy"></figure>
        <div class="centre">
          <h2 class="titre-65" data-anime>
{lignee_titre}
          </h2>
          <div class="paragraphe" data-anime="2">
{lignee}
          </div>
          <ol class="generations" aria-label="Quatre générations de vignerons" data-anime="3">
{generations}
          </ol>
          <div class="signe" data-anime="4">
            <p>Le vigneron :</p>
            <p class="signature">Éric Miailhe</p>
            <p>Œnologue-conseil : Éric Boissenot</p>
          </div>
        </div>
        <figure class="photo-b" data-anime="2"><img src="../assets/img/{pb}" alt="{pb_alt}" loading="lazy"></figure>
      </div>
    </section>

    <a class="decouvrir" href="index.html#nos-vins">
      <img src="../assets/img/{f['decouvrir']}" alt="" loading="lazy">
      <p data-anime><span class="it">Découvrez</span><br>nos vins</p>
    </a>
  </main>
''' + pied(c)


# ---------------------------------------------------------------- fiche d'un vin

MOTIFS = {
    # Coufran : des éventails Art déco, l'époque où Louis arrive (1924)
    "coufran": '<pattern id="m" width="80" height="40" patternUnits="userSpaceOnUse"><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M0 40A40 40 0 0 1 80 40M10 40A30 30 0 0 1 70 40M20 40A20 20 0 0 1 60 40M40 0V40M40 40L12 12M40 40L68 12"/></g></pattern>',
    # Verdignan : les vagues de l'estuaire que le château regarde
    "verdignan": '<pattern id="m" width="120" height="36" patternUnits="userSpaceOnUse"><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M0 12C20 4 40 20 60 12S100 4 120 12M0 28C20 20 40 36 60 28S100 20 120 28"/></g></pattern>',
    # Soudars : le mur de pierres sèches de l'enclos
    "soudars": '<pattern id="m" width="120" height="60" patternUnits="userSpaceOnUse"><g fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="50" height="24" rx="10"/><rect x="58" y="3" width="59" height="24" rx="11"/><rect x="-27" y="33" width="54" height="24" rx="10"/><rect x="32" y="33" width="44" height="24" rx="10"/><rect x="81" y="33" width="54" height="24" rx="10"/></g></pattern>',
}


def fiche_vin(c, v):
    liste = tous_les_vins()
    rang = next(k for k, (cid, x) in enumerate(liste) if cid == c["id"] and x["slug"] == v["slug"])
    cid_suiv, suiv = liste[(rang + 1) % len(liste)]
    lien_suiv = f"{suiv['slug']}.html" if cid_suiv == c["id"] else f"../{cid_suiv}/{suiv['slug']}.html"
    texte_suiv = "Vin suivant" if cid_suiv == c["id"] else f"Chez {CHATEAUX[cid_suiv]['membre']}, à {CHATEAUX[cid_suiv]['nom']}"
    infos = "\n".join(f'            <div><h3>{a}</h3><p>{b}</p></div>' for a, b in v["infos"])
    elaboration = "\n".join(f'            <p>{p}</p>' for p in v["elaboration"])
    document = f'\n          <a class="pilule" href="{v["document"][1]}" target="_blank" rel="noopener" data-anime="3">{v["document"][0]}</a>' if v["document"] else ""
    presse = f'\n          <p class="presse" data-anime="4">{v["presse"]}</p>' if v["presse"] else ""
    boutique = next((u for _, _, u in c["acheter"] if u), "#contact")

    if c.get("millesimes"):
        titre4 = 'Les millésimes se suivent,<br>mais <span class="it">ne se ressemblent pas</span>'
        contenu4 = '<div class="millesimes">\n' + "\n".join(
            f'            <div class="millesime"><img src="../assets/img/{img}" alt="Château Soudars {a}" loading="lazy"><strong>{a}</strong><p>{n}</p></div>'
            for a, img, n in c["millesimes"]) + '\n          </div>'
        retour4 = "Les millésimes"
    else:
        titre4 = 'Dans la même <span class="it">famille</span>'
        contenu4 = ""
        retour4 = "La famille"
    # Les frères : les autres vins du château, puis les grands vins des deux autres générations
    freres = [(c["id"], x) for x in c["vins"] if x["slug"] != v["slug"]] + [(k, CHATEAUX[k]["vins"][0]) for k in ORDRE if k != c["id"]]
    def frere(k, x):
        lien = f"{x['slug']}.html" if k == c["id"] else f"../{k}/{x['slug']}.html"
        return f'            <a class="frere" href="{lien}"><img src="../assets/img/{x["image"]}" alt="" loading="lazy"><p>{x["nom"]}<small>{x["famille"]}</small></p></a>'
    freres_html = "\n".join(frere(k, x) for k, x in freres)
    contenu4 += f'\n          <h3 style="margin-top:44px">Ses frères</h3>\n          <div class="freres">\n{freres_html}\n          </div>' if c.get("millesimes") else f'\n          <div class="freres">\n{freres_html}\n          </div>'

    return tete(c, f"{v['nom']} · {v['famille']} · Château {c['nom']}", f"{v['nom']}, {v['categorie'].lower()} du château {c['nom']} (Haut-Médoc). {v['famille']}.") + age(c) + entete(c, "vins") + f'''
  <main class="vin">
    <div class="vin-texte">
      <section class="vin-section" aria-label="{v['nom']}">
        <div class="vin-haut">
          <a href="index.html#nos-vins"><span class="chev chev--g"></span> Nos vins</a>
          <a href="{lien_suiv}">{texte_suiv} <span class="chev chev--d"></span></a>
        </div>
        <h1 class="vin-nom" data-anime>{v['titre']}<small>{v['sous']}</small></h1>
        <p class="vin-origine" data-anime="2">Haut-Médoc<br>Appellation d'origine protégée</p>
        <div class="vin-achat" data-anime="3">
          <div class="vin-format"><p>{v['categorie']} · bouteille de 75 cl</p><p>{v['famille']}</p></div>
          <a class="pilule pilule--pleine" href="{boutique}" target="_blank" rel="noopener">Où l'acheter</a>
        </div>
        <button class="vin-lien-bas" type="button" data-vers="1"><span class="chev chev--b"></span> Découvrir son caractère</button>
      </section>

      <section class="vin-section" aria-label="Son caractère">
        <button class="vin-lien-haut" type="button" data-vers="0"><span class="chev chev--h"></span> {v['titre']}</button>
        <h2 data-anime>{v['h2']}</h2>
        <div class="bloc" data-anime="2"><h3>Notes de dégustation</h3><p class="serif">{v['notes']}</p></div>
        <div class="bloc" data-anime="2"><h3>À table</h3><p class="serif">{v['accords']}</p></div>
        <div class="infos" data-anime="3">
{infos}
        </div>{presse}
        <button class="vin-lien-bas" type="button" data-vers="2"><span class="chev chev--b"></span> Son élaboration</button>
      </section>

      <section class="vin-section" aria-label="Son élaboration">
        <button class="vin-lien-haut" type="button" data-vers="1"><span class="chev chev--h"></span> Son caractère</button>
        <h2 data-anime>L'<span class="it">élaboration</span></h2>
        <div class="bloc" data-anime="2">
          <div class="serif">
{elaboration}
          </div>
        </div>{document}
        <button class="vin-lien-bas" type="button" data-vers="3"><span class="chev chev--b"></span> {retour4}</button>
      </section>

      <section class="vin-section" aria-label="{retour4}">
        <button class="vin-lien-haut" type="button" data-vers="2"><span class="chev chev--h"></span> Son élaboration</button>
        <h2 data-anime>{titre4}</h2>
        <div data-anime="2">
          {contenu4}
        </div>
      </section>
    </div>

    <div class="vin-visuel" aria-hidden="true">
      <div class="motif"><svg><defs>{MOTIFS[c['id']]}</defs><rect width="100%" height="100%" fill="url(#m)"/></svg></div>
      <img class="bouteille-vin" src="../assets/img/{v['image']}" alt="">
      <div class="indicateurs">
        <button type="button" tabindex="-1"></button><button type="button" tabindex="-1"></button><button type="button" tabindex="-1"></button><button type="button" tabindex="-1"></button>
      </div>
    </div>
  </main>
''' + pied(c)


def main():
    for cid in ORDRE:
        c = CHATEAUX[cid]
        c["id"] = cid
        dossier = RACINE / cid
        dossier.mkdir(exist_ok=True)
        pages = {"index.html": accueil(c), "famille.html": famille(c)}
        for v in c["vins"]:
            pages[f"{v['slug']}.html"] = fiche_vin(c, v)
        for nom, html in pages.items():
            (dossier / nom).write_text(html, encoding="utf-8")
        print(f"{cid}/ : {', '.join(pages)}")


if __name__ == "__main__":
    main()
