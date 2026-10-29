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
import json
import sys
from urllib.parse import quote
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from carte import carte_medoc  # noqa: E402  (la carte du Médoc, façon privios.com/about)
from entete import icones, BOUTEILLE, LANGUES as LANGUES_REPLIEES  # noqa: E402  (l'espace client, le panier, la langue : comme sur la vitrine)

RACINE = Path(__file__).resolve().parent.parent
VITRINE = "../%E2%98%85%20MIAILHE%20Vitrine%20V1.html"
ENQUETE = "../enquete.html"
# Les vins vendus dans la boutique commune (boutique.html, relevé source/boutique/catalogue.json) : leur page mène à la
# boutique ; les autres (La Rose Maréchale, Plantey de la Croix) aux adresses du pied de page
_CATALOGUE = json.loads((RACINE / "source/boutique/catalogue.json").read_text())["produits"]
VINS_EN_BOUTIQUE = {f"n2-de-{p['chateau']}" if p["vin"] == "n2" else f"chateau-{p['chateau']}" for p in _CATALOGUE}

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
        # Le prêt-à-boire (pages « Vigneron du prêt-à-boire » et « De la vigne à la bouteille » du site du château)
        "pret": {
            "titre": 'Nous l\'avons attendu<br><span class="it">pour vous</span>',
            "texte": "Un grand bordeaux n'est prêt à boire qu'après quelques années de vieillissement. Coufran en a fait sa spécialité : les bouteilles vieillissent au château, dans un local climatisé, et ne sont mises en vente que lorsqu'elles se sont épanouies.",
            "points": ["Gardé au château jusqu'à sa mise en vente", "Numéro de lot gravé sur chaque flacon depuis le millésime 2005", "À ouvrir le soir même : ni cave, ni patience"],
            "image": "coufran-stock.jpg", "alt": "Le local climatisé de Coufran : des casiers de bouteilles jusqu'au plafond",
            "etiquette": "Prêt à boire · gardé au château jusqu'à sa mise en vente",
        },
        "temoin": {
            "numero": "1", "role": "Le grand-père · arrivé en 1924",
            "deposition": "« En 1924, ici, tout le monde plantait du cabernet. J'ai tout arraché pour replanter en merlot. On m'a pris pour un fou. Depuis, la part de merlot n'a pas bougé d'un pied. »",
            "valeur": "85 %", "legende": "de merlot dans les vignes de Coufran : la part que Louis a choisie en 1924, le reste en cabernet-sauvignon. Un siècle plus tard, elle n'a pas changé.",
        },
        "acheter": [
            ("La boutique de la famille", "Les trois châteaux, un seul panier", "../boutique.html#coufran"),
            ("Maisons du Vin", "Saint-Seurin-de-Cadourne et Pauillac", None),
            ("En France", "Monoprix, en bouteille et en demi-bouteille", None),
            ("En Belgique", "Colruyt, depuis plus de soixante-dix ans", None),
            ("Dans le monde", "Les négociants de la Place de Bordeaux", None),
        ],
        # Les coordonnées de l'ancien site (chateau-coufran.com : accueil, « Contacts », mentions légales)
        "contact": {
            "tel": "+33 5 56 59 31 02", "mail": "contact@chateau-coufran.com",
            "visites": "emiailhe@coufran-verdignan.com",
            "personnes": [
                # sources : chateau-coufran.com et chateau-verdignan.com (bloc « Contacts » de l'accueil, 26/10/2026)
                {"role": "Production et commercialisation", "nom": "Éric Miailhe",
                 "adresse": "Château Coufran<br>33180 Saint-Seurin-de-Cadourne",
                 "tel": "+33 5 56 59 31 02", "fax": "+33 5 56 59 72 39", "portable": "+33 6 80 31 68 78",
                 "mail": "emiailhe@coufran-verdignan.com"},
                {"role": "Administratif et comptabilité", "nom": "Marie-Cécile Vicaire",
                 "adresse": "24, cours de Verdun<br>33000 Bordeaux",
                 "tel": "+33 5 56 44 90 84", "fax": "+33 5 56 81 32 35", "mail": "contact@chateau-coufran.com"},
            ],
            "rcs": "782 004 766",
        },
        # L'espace professionnel (plan d'actions, action 3) : commande de palettes sur devis, château par château
        "pro": {
            "image": "coufran-stock.jpg", "alt": "Les bouteilles de Coufran qui attendent au château",
            "titre": 'Le merlot du Médoc,<br><span class="it">par palettes</span>',
            "accroche": "« Le Pomerol du Médoc » : 85 % de merlot, un vin rond qui plaît à presque tout le monde à table. Une valeur sûre pour une carte de restaurant ou un rayon de caviste, avec des millésimes gardés au château jusqu'à ce qu'ils soient prêts.",
            "occasion": "le déjeuner de famille",
            "offre": {"chateau-coufran": ("Millésime en cours et vieux millésimes", "75 cl et 37,5 cl · cartons de 6 ou de 12"),
                      "n2-de-coufran": ("Millésime en cours", "75 cl · cartons de 6"),
                      "la-rose-marechale": ("Millésime en cours", "75 cl · cartons de 6")},
            "vieux": ["2016", "2015", "2014", "2010", "2009"],
        },
        # Les millésimes et ce qu'en dit le château (chateau-coufran.com, abrégés) : servent au « vin de votre année » de la vitrine
        "notes_millesimes": [
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
        "pret": {
            "titre": 'Un vin de garde,<br><span class="it">gardé pour vous</span>',
            "texte": "Verdignan s'embellit avec les années. Plutôt que de vous laisser l'attendre, la famille l'attend à votre place : les bouteilles vieillissent au château, dans un local climatisé, et ne partent que lorsqu'elles sont prêtes à boire.",
            "points": ["Gardé au château jusqu'à sa mise en vente", "Numéro de lot gravé sur chaque flacon depuis le millésime 2005", "À ouvrir le soir même : ni cave, ni patience"],
            "image": "verdignan-casiers.jpg", "alt": "Les casiers de bouteilles de Verdignan",
            "etiquette": "Prêt à boire · gardé au château jusqu'à sa mise en vente",
        },
        "temoin": {
            "numero": "2", "role": "Le père · arrivé en 1972",
            "deposition": "« J'ai été le dernier courtier de la famille. En 1972, j'ai acheté le voisin de Coufran. Ici, rien ne se presse : le cabernet attend son heure, et la plus vieille porte du cuvier porte la date de 1720. »",
            "valeur": "65 %", "legende": "de cabernet-sauvignon dans les vignes de Verdignan, le vin de garde du père. Le merlot en a trente parts, le cabernet franc cinq.",
        },
        # Commentaires de dégustation après la mise en bouteille (chateau-verdignan.com, abrégés) : « vin de votre année »
        "notes_millesimes": [
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
        "acheter": [
            ("La boutique de la famille", "Les trois châteaux, un seul panier", "../boutique.html#verdignan"),
            ("Maisons du Vin", "Saint-Seurin-de-Cadourne et Pauillac", None),
            ("En Belgique", "Carrefour, depuis plus de quarante ans", None),
            ("Dans le monde", "Les négociants de la Place de Bordeaux", None),
        ],
        # Les coordonnées de l'ancien site (chateau-verdignan.com : accueil, « Contacts », mentions légales)
        "contact": {
            "tel": "+33 5 56 59 31 02", "mail": "contact@chateau-verdignan.com",
            "visites": "emiailhe@coufran-verdignan.com",
            "personnes": [
                # sources : chateau-coufran.com et chateau-verdignan.com (bloc « Contacts » de l'accueil, 26/10/2026)
                {"role": "Production et commercialisation", "nom": "Éric Miailhe",
                 "adresse": "Château Verdignan<br>33180 Saint-Seurin-de-Cadourne",
                 "tel": "+33 5 56 59 31 02", "fax": "+33 5 56 59 72 39", "portable": "+33 6 80 31 68 78",
                 "mail": "emiailhe@coufran-verdignan.com"},
                {"role": "Administratif et comptabilité", "nom": "Marie-Cécile Vicaire",
                 "adresse": "24, cours de Verdun<br>33000 Bordeaux",
                 "tel": "+33 5 56 44 90 84", "fax": "+33 5 56 81 32 35", "mail": "contact@chateau-verdignan.com"},
            ],
            "rcs": "782 004 691",
        },
        "pro": {
            "image": "verdignan-culots.jpg", "alt": "Les bouteilles de Verdignan qui attendent leur heure",
            "titre": 'Le vin de garde,<br><span class="it">servi à son heure</span>',
            "accroche": "Le grand classique médocain, voisin de Saint-Estèphe : une majorité de cabernet-sauvignon, de la structure et de la fraîcheur. Pour les cavistes et les cartes qui aiment les vins de garde, avec des millésimes gardés au château jusqu'à leur heure.",
            "occasion": "les grandes occasions",
            "offre": {"chateau-verdignan": ("Millésime en cours et vieux millésimes", "75 cl · cartons de 6 ou de 12"),
                      "n2-de-verdignan": ("Millésime en cours", "75 cl · cartons de 6"),
                      "plantey-de-la-croix": ("Millésime en cours", "75 cl · cartons de 6")},
            "vieux": ["2016", "2015", "2014", "2010", "2009"],
        },
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
                "infos": [("Service", "17 à 18 °C"), ("Garde", "Aujourd'hui ou dans longtemps"), ("Cépages", "Au vignoble, 65 % cabernet-sauvignon, 30 % merlot, 5 % cabernet franc ; le grand vin en assemble environ 75 % de cabernet-sauvignon")],
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
        "pret": {
            "titre": 'Prêt à boire<br><span class="it">dès sa jeunesse</span>',
            "texte": "Dans la famille, un vin se vend quand il est prêt. Soudars l'est tôt : souple, juteux, gourmand, il s'ouvre sur la framboise et la cerise dès ses premières années. Ses aînés, Coufran et Verdignan, attendent au château le temps qu'il leur faut.",
            "points": ["Souple et fruité dès sa jeunesse", "À ouvrir sans attendre", "Coufran et Verdignan, eux, vieillissent au château"],
            "image": "soudars-barriques.jpg", "alt": "Le chai à barriques de Soudars",
            "etiquette": "Prêt à boire dès sa jeunesse",
        },
        "temoin": {
            "numero": "3", "role": "Le fils · arrivé en 1973",
            "deposition": "« En 1973, on m'a dit que les grands vins du Médoc ne naissaient que sur les graves. J'ai acheté des friches pleines de pierres et de ronces. On a tout épierré à la main. »",
            "valeur": "50 %", "legende": "de merlot dans Château Soudars : exactement la moitié. Le cabernet-sauvignon fait presque tout le reste, le cabernet franc une seule part.",
        },
        "acheter": [
            ("La boutique de la famille", "Les trois châteaux, un seul panier", "../boutique.html#soudars"),
            ("Maisons du Vin", "Saint-Seurin-de-Cadourne et Pauillac", None),
            ("En Belgique", "Delhaize", None),
            ("Dans le monde", "Les négociants de la Place de Bordeaux", None),
        ],
        # Les coordonnées de l'ancien site (chateausoudars.com : « Nous contacter », mentions légales) ; il ne nomme personne
        "contact": {
            "tel": "+33 5 56 59 36 09", "mail": "vignoblesmiailhe@orange.fr",
            "visites": "vignoblesmiailhe@orange.fr",
            "personnes": [],
            "rcs": "384 685 541",
            "facebook": "https://fr-fr.facebook.com/chateausoudars",
        },
        "pro": {
            "image": "soudars-barriques.jpg", "alt": "Deux rangées de barriques dans le chai de Soudars",
            "titre": 'Le vin gourmand<br><span class="it">des grandes tablées</span>',
            "accroche": "Rond, juteux et floral : un vin facile à aimer, qui va avec presque tous les plats. Pour le vin au verre, les bistrots et les cavistes qui cherchent un Haut-Médoc à partager, avec des millésimes gardés à la propriété.",
            "occasion": "les repas simples",
            "offre": {"chateau-soudars": ("Millésime en cours et vieux millésimes", "75 cl · cartons de 6 ou de 12")},
            "vieux": ["2016", "2015", "2014", "2010", "2009"],
        },
        # Commentaires de dégustation du château (chateausoudars.com, abrégés) : « vin de votre année » sur la vitrine
        "notes_millesimes": [
            ("2000", "Fruits rouges mûrs et épices douces, puis le tabac ; une bouche ample et charnue, des tanins puissants et soyeux."),
            ("2001", "Grenat, un boisé de chêne français, des tanins fermes : un vin racé, bien dans son appellation."),
            ("2002", "La cerise, une attaque ample et charnue, des tanins soyeux : une aptitude certaine au vieillissement."),
            ("2003", "Une robe presque noire, la cerise mûre, des tanins fondus et des épices en finale : une bouteille de charme."),
            ("2004", "Des fruits mûrs, de la fraîcheur, un bel équilibre : un style très classique."),
            ("2005", "Une richesse jamais atteinte, des tanins satinés : le must de la maison, semblable aux mythiques 1982 et 1961."),
            ("2006", "Une attaque puissante, une belle présence tannique : concentré, élégant et complexe, sur le cassis."),
            ("2007", "De la finesse et du raffinement : un ensemble harmonieux, onctueux et soyeux."),
            ("2008", "Menthe et torréfaction, un boisé fin ; puissance et opulence, sans mollesse."),
            ("2009", "Le must de la maison, comme 2000 et 2005 : du fruit, de la fraîcheur, des notes grillées et de tabac."),
            ("2010", "Fruits noirs mûrs, une puissance et une tension rares : sans doute un des meilleurs vins jamais produits ici."),
            ("2014", "Cerise, cassis et épices : souple, gras et frais."),
            ("2015", "Fraise des bois et cassis : rond, tendu et long."),
            ("2016", "Fruits noirs et boisé raffiné : gras et onctueux."),
            ("2017", "Année de gel, petite récolte : des fruits frais, un vin digeste."),
            ("2018", "Cerise, groseille, framboise : rond, aérien et friand."),
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
                    "Longues macérations, de trois à quatre semaines ; après la fermentation malolactique, assemblage avec l'œnologue Éric Boissenot, puis élevage en barriques de chêne français à grain fin, renouvelées par quart, voire par tiers selon l'année. Ici, on refuse les raccourcis : ni thermovinification, ni osmose inverse, ni vin standardisé.",
                    "Comme à Coufran et à Verdignan, presque toutes les bouteilles vieillissent à la propriété avant de partir.",
                ],
                "document": ("Les millésimes 2000-2016 (PDF)", "../assets/docs/soudars-commentaires-2000-2016.pdf"),
            },
        ],
    },
}
ORDRE = ["coufran", "verdignan", "soudars"]


# ---------------------------------------------------------------- fragments communs

def logo(c, forme="logotype", cls=""):
    """Le logo du château (Logos/CHATEAUX), injecté par chateau.js depuis assets/js/logos-chateaux.js."""
    return f'<span class="logo-chateau {cls}" data-logo-chateau="{c["id"]}" data-forme="{forme}" aria-hidden="true"></span>'


def embleme(c, cls="embleme"):
    """L'armoirie du château (Logos/ARMOIRIES), injectée par chateau.js depuis assets/js/armoiries.js."""
    return f'<span class="{cls}" data-armoirie="{c["id"]}" aria-hidden="true"></span>'


# Le sélecteur de langue (langue.js le remplit et traduit la page : français, anglais, japonais)
def langues(cls=""):
    return (f'<ul class="langues{cls}" aria-label="Langue du site"><li><a href="?lang=fr" lang="fr" data-langue="fr" aria-current="true">Fr</a></li>'
            '<li><a href="?lang=en" lang="en" data-langue="en">En</a></li><li><a href="?lang=ja" lang="ja" data-langue="ja">日本語</a></li></ul>')


# Le petit bouton de l'enquête, à côté des armoiries
LOUPE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.2"/><path d="M14.6 14.6L20 20"/></svg>'
# trois petites portes : le test « Quel château vous ressemble ? » (plus dans l'en-tête depuis le 28/10/2026)
PORTES_ICONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 20v-8.2a2.4 2.4 0 0 1 4.8 0V20M9.6 20V9.8a2.4 2.4 0 0 1 4.8 0V20M15.7 20v-8.2a2.4 2.4 0 0 1 4.8 0V20M2 20h20"/></svg>'


def familles(c):
    """Les trois armoiries complètes dans l'en-tête (les mêmes que sur les portes) : on passe d'un château à l'autre."""
    def lien(k):
        nom = CHATEAUX[k]["nom"]
        ici = k == c["id"]
        courant = ' aria-current="page"' if ici else ""
        classe = "famille-lien ici" if ici else "famille-lien"
        return (f'<a class="{classe}" href="../{k}/index.html" data-nom="{nom}" aria-label="Château {nom}"{courant}>'
                f'<span class="armoirie" data-armoirie="{k}"></span></a>')
    liens = "".join(lien(k) for k in ORDRE)
    return f'<nav class="ch-familles" aria-label="Les trois châteaux de la famille">{liens}</nav>'


def tete(c, titre, description):
    return f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <script src="../assets/js/langue.js"></script><!-- la langue d'abord : la page est traduite avant d'être montrée -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{titre}</title>
  <meta name="description" content="{description}">
  <link rel="stylesheet" href="../assets/css/polices.css">
  <link rel="stylesheet" href="../assets/css/typographie.css">
  <link rel="stylesheet" href="../assets/css/motifs.css">
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
    {langues(" langues--porte")}
    <p class="age-bas">En entrant, vous confirmez avoir l'âge légal de consommer de l'alcool dans votre pays. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
  </div>
'''


def entete(c, actif):
    # quatre liens au centre ; à droite, la boutique et l'enquête, deux liens sobres (une icône, le mot, la racine au
    # survol), comme sur la vitrine. 28/10/2026 : « Le test » quitte l'en-tête (demande de l'utilisateur), la boutique
    # prend sa place. Sur un téléphone, le menu reprend la boutique, l'enquête et l'espace client.
    liens = [("index.html#nos-vins", "Nos vins", "vins"), ("famille.html", "La famille", "famille"),
             ("professionnels.html", "Professionnels", "pro"), ("#contact", "Contact", "contact")]
    mobiles = [(f"../boutique.html#{c['id']}", "La boutique"), (ENQUETE, "L'enquête"), ("../compte.html", "Mon espace client")]
    courant = ' aria-current="page"'
    nav = "\n".join(f'      <a href="{h}"{courant if k == actif else ""}>{t}</a>' for h, t, k in liens)
    nav += "\n" + "\n".join(f'      <a class="ch-nav-mobile" href="{h}">{t}</a>' for h, t in mobiles)
    return f'''  <header class="ch-entete">
    <div class="ch-signature">
      <a class="ch-logo" href="index.html" aria-label="Château {c['nom']}, accueil">{logo(c)}</a>
      <a class="ch-maison" href="{VITRINE}" aria-label="Par MIAILHE : la maison de famille"><i>par</i><span class="wordmark"></span></a>
    </div>
    <nav class="ch-nav" aria-label="Navigation du château">
{nav}
      {langues(" langues--menu")}
    </nav>
    <div class="ch-droite">
      <a class="ch-fort ch-fort--boutique" href="../boutique.html#{c['id']}" aria-label="La boutique de la famille : les vins des trois châteaux">{BOUTEILLE}<span>La boutique</span></a>
      <a class="ch-fort" href="{ENQUETE}" aria-label="L'enquête Miailhe : participer">{LOUPE}<span>L'enquête</span></a>
      {familles(c)}
      <span class="ch-icones">{icones("../")}</span>
      {LANGUES_REPLIEES}
    </div>
    <button class="ch-burger" type="button" aria-expanded="false" aria-label="Menu"><span></span></button>
  </header>
'''


def tel(n, classe=""):
    """Un numéro cliquable (les espaces restent à l'écran, pas dans le lien)."""
    c = f' class="{classe}"' if classe else ""
    return f'<a{c} href="tel:{n.replace(" ", "")}">{n}</a>'


def mail(m):
    return f'<a href="mailto:{m}">{m}</a>'


def contacts(c):
    """Les coordonnées reprises des anciens sites : visites, les personnes à joindre, où acheter."""
    k = c["contact"]
    carte = "https://www.google.com/maps/search/?api=1&query=" + quote(f"Château {c['nom']} Saint-Seurin-de-Cadourne")
    blocs = [f'''      <div class="ch-contact">
        <p class="titre">Nous rendre visite</p>
        <p>Les visites de la propriété se font pour les professionnels et les particuliers, uniquement sur rendez-vous.</p>
        <p>Votre demande : {mail(k["visites"])}</p>
        <p><a class="lien-fleche" href="{carte}" target="_blank" rel="noopener">Itinéraire ↗</a></p>
      </div>''']
    for x in k["personnes"]:
        lignes = [f"Tél. {tel(x['tel'])}"] + ([f"Fax {x['fax']}"] if x.get("fax") else []) + ([f"Portable {tel(x['portable'])}"] if x.get("portable") else [])
        blocs.append(f'''      <div class="ch-contact">
        <p class="titre">{x["role"]}</p>
        <p class="nom">{x["nom"]}</p>
        <p class="gris">{x["adresse"]}</p>
        <p>{"<br>".join(lignes)}</p>
        <p>{mail(x["mail"])}</p>
      </div>''')
    achats = "".join((f'<li><a href="{u}" target="_blank" rel="noopener">{t} ↗</a><small>{st}</small></li>' if u.startswith("http")
                      else f'<li><a href="{u}">{t}</a><small>{st}</small></li>') if u else f"<li>{t}<small>{st}</small></li>"
                     for t, st, u in c["acheter"])
    blocs.append(f'''      <div class="ch-contact">
        <p class="titre">Acheter nos vins</p>
        <ul class="ch-achats">{achats}</ul>
      </div>''')
    if k.get("facebook"):
        blocs.append(f'''      <div class="ch-contact">
        <p class="titre">Suivez-nous</p>
        <p><a href="{k["facebook"]}" target="_blank" rel="noopener">Château {c["nom"]} sur Facebook ↗</a></p>
        <p><a href="https://www.instagram.com/chateauxcoufranverdignan/" target="_blank" rel="noopener">La famille sur Instagram ↗</a></p>
      </div>''')
    return "\n".join(blocs)


def equipe_commerciale(c):
    """L'espace professionnel : la personne chargée de la commercialisation sur l'ancien site, sinon le château."""
    k = c["contact"]
    x = next((p for p in k["personnes"] if p["role"].startswith("Production")), None)
    if not x:
        return f"{tel(k['tel'])}<br>{mail(k['mail'])}"
    return f"{x['nom']}, production et commercialisation<br>Tél. {tel(x['tel'])} · portable {tel(x['portable'])}<br>{mail(x['mail'])}"


def pied(c):
    autres = " · ".join(f'<a href="../{k}/index.html">{CHATEAUX[k]["nom"]}</a>' for k in ORDRE if k != c["id"])
    k = c["contact"]
    return f'''  <footer class="ch-pied" id="contact">
    <div class="ch-pied-haut">
      <div>
        <p class="titre">Adresse</p>
        <p>Château {c['nom']}<br>33180 Saint-Seurin-de-Cadourne, France</p>
        <p class="gris">AOC Haut-Médoc</p>
      </div>
      {logo(c, "logo", "pied-logo")}
      <div>
        <p class="titre">Contact</p>
        <p>{tel(k['tel'])}<br>{mail(k['mail'])}</p>
        <p class="gris">Visites sur rendez-vous</p>
      </div>
    </div>
    <div class="ch-contacts">
{contacts(c)}
    </div>
    <div class="ch-pied-bas">
      <a class="maison" href="{VITRINE}">Château {c['nom']} · une maison de la famille <span class="wordmark"></span></a>
      <nav class="reseaux" data-reseaux{f' data-facebook="{k["facebook"]}"' if k.get("facebook") else ""}></nav>
      {langues(" langues--pied")}
      <nav aria-label="Liens du pied de page">
        <span>Les autres maisons : {autres}</span>
        <a href="{ENQUETE}">L'enquête</a>
        <a href="professionnels.html">Espace professionnel</a>
        <button class="haut-page" type="button">↑ Haut</button>
      </nav>
    </div>
    <p class="sante">L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
    <p class="mentions">Château {c['nom']} · RCS Bordeaux {c['contact']['rcs']} · siège : Château {c['nom']}, 33180 Saint-Seurin-de-Cadourne · directeur de la publication : Éric Miailhe, représentant légal. Maquette de concept, projet étudiant ISCOM 2026, site non officiel. Photographies : sites des châteaux Coufran, Verdignan et Soudars.</p>
  </footer>
  <script src="../assets/js/logo.js"></script>
  <script src="../assets/js/feuille-miailhe.js"></script>
  <script src="../assets/js/armoiries.js"></script>
  <script src="../assets/js/logos-chateaux.js"></script>
  <script src="../assets/js/typographie.js"></script>
  <script src="../assets/js/reseaux.js"></script>
  <script src="../assets/js/espace.js"></script>
  <script src="../assets/js/voix.js"></script>
  <script src="../assets/js/chateau.js"></script>
  <script src="../assets/js/survol.js"></script>
</body>
</html>
'''


def tous_les_vins():
    """Les vins de la famille, dans l'ordre des générations, pour les liens « vin suivant » et « dans la même famille »."""
    return [(k, v) for k in ORDRE for v in CHATEAUX[k]["vins"]]


def piece(t):
    """La pièce à conviction du témoin de l'Enquête."""
    return f'''        <div class="piece" data-anime="3">
          <p class="piece-etiquette">Pièce à conviction</p>
          <p class="piece-valeur">{t['valeur']}</p>
          <p class="piece-legende">{t['legende']}</p>
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
        if not u:
            return f"              <li>{texte}</li>"
        cible = ' target="_blank" rel="noopener"' if u.startswith("http") else ""
        return f'              <li><a href="{u}"{cible}>{texte}</a></li>'
    liste_achat = "\n".join(achat(*a) for a in c["acheter"])
    t = c["temoin"]
    p = c["pret"]
    points_pret = "\n".join(f"          <li>{x}</li>" for x in p["points"])
    return tete(c, f"Château {c['nom']} · {c['devise']} · Haut-Médoc", c["description"]) + age(c) + entete(c, "accueil") + f'''
  <main>
    <!-- La porte du château s'ouvre à l'arrivée (une fois par visite, chateau.js) : on entre chez {c['membre']} -->
    <div class="porte-chateau" aria-hidden="true">
      <div class="porte-fond"><div class="motif"></div></div>
      <div class="vantail vantail--g"><div class="motif"></div></div>
      <div class="vantail vantail--d"><div class="motif"></div></div>
      <div class="porte-seuil">
        {embleme(c)}
        <p class="porte-nom">{logo(c, "logo")}<span class="sr-only">Château {c['nom']}</span></p>
        <p class="porte-qui">Chez {c['membre']}, {c['role']}</p>
      </div>
    </div>
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
      <div class="motif" aria-hidden="true"></div>
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
    <section class="manifeste">
      <div class="motif" aria-hidden="true"></div>
      <h2 class="manifeste-titre" data-anime>{c['manifeste']}</h2>
      <a class="cercle" href="famille.html" data-anime="2">
        <img src="../assets/img/{c['cercle']}" alt="" loading="lazy">
        <p><span class="it">découvrez</span><br>la famille</p>
      </a>
    </section>

    <!-- Le prêt-à-boire, ce qui distingue la famille : elle garde ses vins jusqu'à ce qu'ils soient prêts -->
    <section class="pret" id="pret-a-boire" aria-labelledby="pret-titre">
      <figure class="pret-photo" data-anime><img src="../assets/img/{p['image']}" alt="{p['alt']}" loading="lazy"></figure>
      <div class="pret-texte">
        <p class="pret-sur">Vigneron du prêt-à-boire</p>
        <h2 id="pret-titre" data-anime>{p['titre']}</h2>
        <p data-anime="2">{p['texte']}</p>
        <ul class="pret-points" data-anime="3">
{points_pret}
        </ul>
        <a class="pilule" href="{VITRINE}#pret-a-boire" data-anime="4">Pourquoi la famille attend</a>
      </div>
    </section>

    <!-- Le témoin de l'Enquête à la racine : sa pièce à conviction sert à l'étape 4 (enquete.html) -->
    <section class="relance-test" aria-labelledby="relance-test-titre">
      <div class="motif"></div>
      <p class="relance-test-sur">Trois châteaux voisins, une même famille</p>
      <h2 id="relance-test-titre" data-anime>Coufran, Verdignan ou Soudars : <span class="it">lequel vous ressemble ?</span></h2>
      <p>Sept questions simples, sur ce que vous aimez et ce que vous aimez boire, sans rien connaître au vin.</p>
      <a class="pilule pilule--pleine" href="../quiz.html">Faire le test</a>
    </section>

    <section class="temoin" id="temoin" aria-labelledby="temoin-nom">
      <div class="temoin-grille">
        <div>
          <span class="cachet">Enquête à la racine · Témoin n° {t['numero']}</span>
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

    <section class="galerie" aria-label="Galerie">
      <div class="galerie-piste">
{galerie}
      </div>
      <button class="fleche-carrousel fleche-carrousel--prec" type="button" aria-label="Photos précédentes"></button>
      <button class="fleche-carrousel fleche-carrousel--suiv" type="button" aria-label="Photos suivantes"></button>
    </section>

    <section class="terroir">
      <figure class="carte-terroir" data-anime>
        {carte_medoc(c['id'])}
      </figure>
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
    # la boutique commune (boutique.html) vend le grand vin et le N°2 : on y arrive sur ce vin ; les autres s'achètent
    # par les adresses du pied de page
    en_boutique = v["slug"] in VINS_EN_BOUTIQUE
    boutique = f"../boutique.html?vin={v['slug']}#{c['id']}" if en_boutique else "#contact"
    # le grand vin de chaque château porte la mention prêt-à-boire (celle des sites de Coufran et de Verdignan)
    pret = f'<p class="vin-pret"><a href="index.html#pret-a-boire">{c["pret"]["etiquette"]}</a></p>' if v is c["vins"][0] else ""

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
          <div class="vin-format"><p>{v['categorie']} · bouteille de 75 cl</p><p>{v['famille']}</p>{pret}</div>
          <a class="pilule pilule--pleine" href="{boutique}">{"L'acheter" if en_boutique else "Où l'acheter"}</a>
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
      <div class="motif"></div>
      <img class="bouteille-vin" src="../assets/img/{v['image']}" alt="">
      <div class="indicateurs">
        <button type="button" tabindex="-1"></button><button type="button" tabindex="-1"></button><button type="button" tabindex="-1"></button><button type="button" tabindex="-1"></button>
      </div>
    </div>
  </main>
''' + pied(c)


# ---------------------------------------------------------------- espace professionnel (B2B)

# Les formats de palette : les mêmes pour les trois châteaux (la logistique est commune)
FORMATS = [
    ("chateau", "La palette du château", "400 à 600 bouteilles", "Un vin, ou les vins du château panachés, en cartons de 6 ou de 12."),
    ("demi", "La demi-palette", "200 à 300 bouteilles", "Pour un premier ordre, un caviste ou un groupe de restaurants."),
    ("famille", "La palette famille", "400 à 600 bouteilles", "Un tiers de chaque château : Coufran, Verdignan et Soudars, aux tarifs habituels."),
]
ETAPES = [
    ("Ouvrir un compte", "La famille valide chaque compte professionnel. Il donne accès aux tarifs, au kit et à l'historique de vos commandes."),
    ("Composer la palette", "Un vin ou plusieurs, un millésime, un conditionnement. Pas de panier ni de prix publics : chaque palette se chiffre."),
    ("Recevoir le devis", "L'équipe commerciale, commune aux trois châteaux, chiffre le vin, le transport, les droits et les documents d'export."),
    ("Expédier", "La palette part du château, à Saint-Seurin-de-Cadourne, ou rejoint votre transitaire à Bordeaux."),
]
KIT = [
    "Les trois personnalités de la famille, et l'occasion de chaque vin",
    "Les fiches techniques et les commentaires de millésimes",
    "Les photos des bouteilles, des châteaux et de la famille",
    "Les visuels pour les rayons et les réseaux sociaux",
    "Le lien vers l'enquête et ses vidéos sous-titrées",
]
LANGUES = ["Français", "English", "Nederlands", "日本語", "Norsk"]
PAYS = ["Belgique", "États-Unis", "Japon", "Norvège", "Canada", "France", "Un autre pays"]
METIERS = ["Importateur", "Distributeur", "Négociant", "Caviste", "Restaurant ou hôtel", "Cadeaux d'entreprise"]


def carte_pro(c, v):
    """Un vin de l'offre professionnelle : ce qu'un acheteur doit savoir, et le bouton pour l'ajouter au devis."""
    mill, cond = c["pro"]["offre"][v["slug"]]
    cepages = next((b for a, b in v["infos"] if a == "Cépages"), "")
    garde = next((b for a, b in v["infos"] if a == "Garde"), "")
    doc = (f'<a class="pro-lien" href="{v["document"][1]}" target="_blank" rel="noopener">{v["document"][0]}</a>'
           if v["document"] else f'<a class="pro-lien" href="{v["slug"]}.html">La fiche du vin</a>')
    return f'''        <article class="pro-vin" data-anime>
          <img src="../assets/img/{v['image']}" alt="{v['nom']}" loading="lazy">
          <div>
            <p class="pro-sur">{v['categorie']}</p>
            <h3>{v['nom']}</h3>
            <dl>
              <div><dt>Cépages</dt><dd>{cepages}</dd></div>
              <div><dt>Garde</dt><dd>{garde}</dd></div>
              <div><dt>Millésimes</dt><dd>{mill}</dd></div>
              <div><dt>Formats</dt><dd>{cond}</dd></div>
            </dl>
            <div class="pro-actions">
              <button class="pilule pilule--pleine" type="button" data-ajouter="{v['slug']}">Ajouter à ma demande</button>
              {doc}
            </div>
          </div>
        </article>'''


def professionnels(c):
    p = c["pro"]
    vins = c["vins"]
    notes = dict(c["notes_millesimes"])
    chiffres = [("400 à 600", "bouteilles par palette"),
                (str(len(vins)), "vins du château") if len(vins) > 1 else (str(len(p["vieux"]) + 1), "millésimes au choix"),
                ("Sur devis", "aucun prix public"), ("Une équipe", "pour les trois châteaux")]
    chiffres_html = "\n".join(f'      <div data-anime="{k + 1}"><strong>{a}</strong>{b}</div>' for k, (a, b) in enumerate(chiffres))
    etapes = "\n".join(f'        <li data-anime="{k + 1}"><span class="pro-num">{k + 1:02d}</span><h3>{a}</h3><p>{b}</p></li>' for k, (a, b) in enumerate(ETAPES))
    cartes = "\n".join(carte_pro(c, v) for v in vins)
    vieux = "\n".join(f'        <li><strong>{a}</strong><p>{notes[a]}</p></li>' for a in p["vieux"] if a in notes)
    formats = "\n".join(f'        <div class="pro-format" data-anime="{k + 1}"><p class="pro-sur">{b}</p><strong>{q}</strong><p>{d}</p></div>'
                        for k, (_, b, q, d) in enumerate(FORMATS))
    trio = "\n".join(
        f'''        <a class="pro-trio-vin{' ici' if k == c['id'] else ''}" href="../{k}/professionnels.html">
          <img src="../assets/img/{CHATEAUX[k]['vins'][0]['image']}" alt="" loading="lazy">
          <strong>{CHATEAUX[k]['nom']}</strong><small>{CHATEAUX[k]['pro']['occasion']}</small>
        </a>''' for k in ORDRE)
    kit = "\n".join(f'          <li>{x}</li>' for x in KIT)
    langues = "".join(f'<span>{x}</span>' for x in LANGUES)

    def option_vin(v):
        vieux_ok = "vieux" in p["offre"][v["slug"]][0]
        choix = '<option value="Millésime en cours">Millésime en cours</option>' + ("".join(f'<option value="{a}">{a}</option>' for a in p["vieux"]) if vieux_ok else "")
        return (f'          <label class="pro-coche"><input type="checkbox" name="vins" value="{v["slug"]}"> <span>{v["nom"]}</span>'
                f'<select name="millesime-{v["slug"]}" aria-label="Millésime de {v["nom"]}">{choix}</select></label>')
    options_vins = "\n".join(option_vin(v) for v in vins)
    options_formats = "\n".join(
        f'            <label class="pro-radio"><input type="radio" name="format" value="{k}"{" checked" if k == "chateau" else ""}> <span>{b}<small>{q}</small></span></label>'
        for k, b, q, _ in FORMATS)
    pays = "".join(f'<option value="{x}">{x}</option>' for x in PAYS)
    metiers = "".join(f'<option value="{x}">{x}</option>' for x in METIERS)
    return tete(c, f"Espace professionnel · Château {c['nom']} · palettes sur devis",
                f"Château {c['nom']} pour les professionnels : importateurs, distributeurs, négociants, cavistes et restaurateurs. Palettes sur devis, fiches techniques, kit importateur.") + age(c) + entete(c, "pro") + f'''
  <main class="pro" data-chateau="{c['id']}">
    <section class="pro-intro">
      <img src="../assets/img/{p['image']}" alt="{p['alt']}">
      <div class="pro-intro-texte">
        <p class="pro-cachet" data-anime>Espace professionnel · Château {c['nom']}</p>
        <h1 data-anime="2">{p['titre']}</h1>
        <p class="pro-accroche" data-anime="3">Importateurs, distributeurs, négociants, cavistes et restaurateurs : commandez {c['nom']} sur devis, au départ du château.</p>
        <div class="pro-boutons" data-anime="4">
          <a class="pilule pilule--blanche" href="#demande">Demander un devis</a>
          <button class="pilule pilule--contour" type="button" data-client>Déjà client</button>
        </div>
      </div>
    </section>

    <section class="pro-chiffres" aria-label="En bref">
{chiffres_html}
    </section>

    <section class="pro-argument">
      <div class="motif" aria-hidden="true"></div>
      <p class="pro-sur" data-anime>Pourquoi {c['nom']}</p>
      <p class="pro-grand" data-anime="2">{p['accroche']}</p>
    </section>

    <section class="pro-etapes" aria-labelledby="etapes-titre">
      <h2 class="titre-65" id="etapes-titre" data-anime><span>Comment</span><span class="it">commander</span></h2>
      <ol>
{etapes}
      </ol>
    </section>

    <section class="pro-offre" id="offre" aria-labelledby="offre-titre">
      <h2 class="titre-65" id="offre-titre" data-anime><span>L'offre</span><span class="it">du château</span></h2>
      <div class="pro-vins">
{cartes}
      </div>
    </section>

    <section class="pro-vieux" aria-labelledby="vieux-titre">
      <div class="pro-vieux-texte">
        <p class="pro-sur" data-anime>La marque de la maison</p>
        <h2 class="titre-65" id="vieux-titre" data-anime="2"><span>Des millésimes</span><span class="it">prêts à boire</span></h2>
        <p class="paragraphe" data-anime="3">Ici, on ne vend pas un vin tant qu'il n'est pas prêt : les bouteilles attendent au château, au frais. Vos clients reçoivent des millésimes plus anciens, à ouvrir dès leur arrivée. Disponibilités selon le stock, sur demande.</p>
      </div>
      <ol class="pro-frise" data-anime="2">
{vieux}
      </ol>
    </section>

    <section class="pro-formats" aria-labelledby="formats-titre">
      <h2 class="titre-65" id="formats-titre" data-anime><span>Trois façons</span><span class="it">de remplir une palette</span></h2>
      <div class="pro-formats-grille">
{formats}
      </div>
    </section>

    <section class="pro-famille" aria-labelledby="famille-titre">
      <div class="motif" aria-hidden="true"></div>
      <p class="pro-sur" data-anime>La palette famille</p>
      <h2 id="famille-titre" data-anime="2">Trois châteaux,<br><span class="it">une même racine</span></h2>
      <p class="pro-famille-texte" data-anime="3">Un tiers de chaque château, aux tarifs habituels. Vous ne vendez plus trois vins séparés mais une famille, et vous couvrez trois occasions avec un seul fournisseur.</p>
      <div class="pro-trio" data-anime="3">
{trio}
      </div>
      <button class="pilule pilule--blanche" type="button" data-format="famille" data-anime="4">Demander la palette famille</button>
    </section>

    <section class="pro-kit" aria-labelledby="kit-titre">
      <div>
        <p class="pro-sur" data-anime>Pour vos équipes et vos clients</p>
        <h2 class="titre-65" id="kit-titre" data-anime="2"><span>Le kit</span><span class="it">importateur</span></h2>
        <ul data-anime="3">
{kit}
        </ul>
        <p class="pro-langues" data-anime="4">{langues}</p>
      </div>
      <div class="pro-kit-boite" data-anime="2">
        <div class="motif" aria-hidden="true"></div>
        {embleme(c)}
        <p class="pro-kit-nom">Le kit<br>importateur</p>
        <span class="wordmark"></span>
        <p class="pro-kit-cle"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg> Réservé aux comptes validés</p>
        <button class="pilule pilule--blanche" type="button" data-client>Se connecter pour le télécharger</button>
      </div>
    </section>

    <section class="pro-demande" id="demande" aria-labelledby="demande-titre">
      <div class="pro-demande-texte">
        <h2 class="titre-65" id="demande-titre" data-anime><span>Votre demande</span><span class="it">de devis</span></h2>
        <p class="paragraphe" data-anime="2">Choisissez les vins, le millésime et le format : l'équipe commerciale de la famille vous répond avec un devis complet, transport, droits et documents d'export compris.</p>
        <div class="pro-note" data-anime="3">
          <p class="pro-sur">Nos partenaires d'abord</p>
          <p>Vous achetez déjà nos vins auprès d'un négociant de la Place de Bordeaux, ou votre pays a un importateur exclusif ? Dites-le-nous : nous vous mettons en relation avec lui, pour que rien ne change dans vos habitudes.</p>
        </div>
        <div class="pro-contact" data-anime="4">
          <p class="pro-sur">L'équipe commerciale</p>
          <p>{equipe_commerciale(c)}</p>
          <p class="pro-gris">Visites et dégustations sur rendez-vous. Chaque année, aux vendanges, une journée au domaine réunit nos importateurs.</p>
        </div>
      </div>

      <div class="pro-demande-cadre">
        <form class="pro-form" novalidate>
          <fieldset>
            <legend>Le format</legend>
            <div class="pro-radios">
{options_formats}
            </div>
          </fieldset>
          <fieldset class="pro-champ-vins">
            <legend>Les vins de {c['nom']}</legend>
{options_vins}
            <p class="pro-famille-info" hidden>La palette famille réunit les grands vins des trois châteaux, Coufran, Verdignan et Soudars, un tiers de chacun. Précisez les millésimes dans votre message.</p>
          </fieldset>
          <fieldset>
            <legend>Le conditionnement et la livraison</legend>
            <div class="pro-ligne">
              <label>Cartons<select name="carton"><option value="Cartons de 6">Cartons de 6</option><option value="Cartons de 12">Cartons de 12</option></select></label>
              <label>Livraison<select name="livraison"><option value="Départ du château">Départ du château</option><option value="Chez mon transitaire à Bordeaux">Chez mon transitaire à Bordeaux</option><option value="Rendu chez moi, à chiffrer">Rendu chez moi, à chiffrer</option></select></label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Vous</legend>
            <div class="pro-ligne">
              <label>Société<input name="societe" required autocomplete="organization"></label>
              <label>Vous êtes<select name="metier" required><option value="">Choisir</option>{metiers}</select></label>
            </div>
            <div class="pro-ligne">
              <label>Nom<input name="nom" required autocomplete="name"></label>
              <label>Pays<select name="pays" required><option value="">Choisir</option>{pays}</select></label>
            </div>
            <div class="pro-ligne">
              <label>E-mail professionnel<input name="email" type="email" required autocomplete="email"></label>
              <label>Téléphone<input name="tel" type="tel" autocomplete="tel"></label>
            </div>
            <label>Message<textarea name="message" rows="3" placeholder="Vos quantités, votre importateur ou négociant actuel, vos délais…"></textarea></label>
            <label class="pro-coche pro-coche--seule"><input type="checkbox" name="pro" required> <span>J'achète à titre professionnel.</span></label>
          </fieldset>
          <p class="pro-erreur" role="alert"></p>
          <button class="pilule pilule--pleine" type="submit">Envoyer ma demande de devis</button>
        </form>
        <div class="pro-merci" hidden tabindex="-1">
          {embleme(c)}
          <h3>Merci, votre demande est partie.</h3>
          <p>Demande n° <strong class="pro-ref"></strong>. L'équipe commerciale de la famille vous répond sous deux jours ouvrés, avec un devis complet.</p>
          <button class="pilule" type="button" data-nouvelle>Faire une autre demande</button>
        </div>
      </div>
    </section>

    <div class="pro-client" role="dialog" aria-modal="true" aria-labelledby="client-titre" hidden>
      <div class="pro-client-boite">
        <button class="pro-fermer" type="button" aria-label="Fermer"></button>
        {embleme(c)}
        <h3 id="client-titre">Espace client</h3>
        <p>Recevez un lien de connexion par e-mail : vos tarifs, votre historique et le réassort de votre dernière palette en quelques clics.</p>
        <form class="pro-lien-form" novalidate>
          <label>E-mail professionnel<input type="email" name="email" required autocomplete="email"></label>
          <button class="pilule pilule--pleine" type="submit">Recevoir le lien</button>
          <p class="pro-lien-ok" hidden>Si ce compte existe, le lien vient de partir. Pas encore de compte ? <a href="#demande">Faites une demande</a> : la famille valide chaque compte.</p>
        </form>
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
        pages = {"index.html": accueil(c), "famille.html": famille(c), "professionnels.html": professionnels(c)}
        for v in c["vins"]:
            pages[f"{v['slug']}.html"] = fiche_vin(c, v)
        for nom, html in pages.items():
            (dossier / nom).write_text(html, encoding="utf-8")
        print(f"{cid}/ : {', '.join(pages)}")
    # Les notes de millésimes (« le vin de votre année ») : l'ancien circuit de la vitrine s'en servait ; gardées pour le coffret « Votre année »
    notes = {cid: {"nom": f"Château {CHATEAUX[cid]['nom']}", "notes": dict(CHATEAUX[cid]["notes_millesimes"])} for cid in ORDRE}
    (RACINE / "assets/js/millesimes.js").write_text(
        "/* Millésimes des trois châteaux et ce qu'en dit chacun (sites officiels, abrégés). Généré par source/generer_chateaux.py. */\n"
        f"window.MIAILHE_MILLESIMES = {json.dumps(notes, ensure_ascii=False)};\n", encoding="utf-8")


if __name__ == "__main__":
    main()
