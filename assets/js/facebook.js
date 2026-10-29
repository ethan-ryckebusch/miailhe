/* facebook.html : la Page Facebook proposée à la famille, @famillemiailhe (29/10/2026, demande de l'utilisateur :
   « duplique pour Facebook aussi, avec le même feed qu'Insta »).
   Le fil reprend les 69 publications de la grille d'instagram.js, dans le même ordre (assets/img/instagram/
   apres-post-NN.jpg) : le triptyque épinglé en tête, publié en une seule fois avec ses trois photos côte à côte, puis
   de la plus récente à la plus ancienne. Les textes alternatifs sont repris tels quels d'instagram.js, les dates du
   calendrier de Recommandation/Instagram/Feed/source/exporter_feed.py : à reprendre si ce calendrier change. Chaque
   publication a une légende courte tirée de son texte alternatif. Les J'aime, commentaires et partages sont des
   chiffres de maquette, modestes, tirés une fois pour toutes. */
(function () {
  // [place dans la grille Instagram, date de publication, genre, légende, texte alternatif (trois pour le triptyque),
  //  [J'aime, commentaires, partages]]
  const PUBLICATIONS = [
    ['01', '2026-11-03', 'triptyque', '1 famille, 3 châteaux, 1 même racine. Coufran, Verdignan et Soudars, dans le même paysage du Haut-Médoc.', ['Triptyque épinglé, 1 sur 3 : Château Coufran dans le paysage du Haut-Médoc, le début du logo MIAILHE et « 3 châteaux, 1 même racine »', 'Triptyque épinglé, 2 sur 3 : Château Verdignan, la racine du logo MIAILHE qui plonge derrière sa flèche', 'Triptyque épinglé, 3 sur 3 : Château Soudars, la fin du logo MIAILHE, « Haut-Médoc, depuis 1924 »'], [84, 5, 5]],
    ['04', '2027-10-28', 'photo', 'Coufran, 85 % merlot. On l’appelle le Pomerol du Médoc.', 'Sur un fond or, la bouteille de Château Coufran, une grappe de merlot et des galets : 85 % merlot, le Pomerol du Médoc', [29, 2, 2]],
    ['05', '2027-10-21', 'photo', 'Trois semaines de vendanges, et des mains qui s’en souviennent.', 'Lovely et Fred montrent leurs mains violettes après les vendanges', [45, 3, 1]],
    ['06', '2027-10-14', 'photo', 'Le moût commence sa fermentation. Ça bulle au cuvier.', 'Les bulles du moût en fermentation, en très gros plan', [25, 0, 0]],
    ['07', '2027-10-08', 'reel', 'Les coulisses, épisode 2 : trois semaines de vendanges avec Lovely et Fred.', 'Reel Les coulisses : trois semaines de vendanges, Lovely et Fred et leur panier de merlot', [67, 3, 3]],
    ['08', '2027-10-01', 'photo', 'Cabernet mûr, pruine et rosée du matin.', 'Une grappe de cabernet mûre, couverte de pruine et de rosée, dans la lumière du matin', [53, 3, 3]],
    ['09', '2027-09-24', 'photo', 'À la table de tri, chaque grappe passe entre nos mains avant la cuve.', 'Lovely et Fred trient les grappes à la table de tri', [38, 2, 0]],
    ['10', '2027-09-17', 'photo', 'Coufran et Verdignan sont de retour en rayon, chez Auchan, E.Leclerc, Carrefour et Intermarché.', 'Coufran et Verdignan dans un panier de courses entre les rangs : de retour en rayon chez Auchan, E.Leclerc, Carrefour et Intermarché', [114, 7, 7]],
    ['11', '2027-09-10', 'reel', 'Vin contre vin, partie 2 : l’entrecôte grillée sur les sarments. Coufran ou Verdignan ?', 'Reel Vin contre vin : l’entrecôte grillée sur les sarments, à même la grave, Coufran ou Verdignan ?', [40, 2, 2]],
    ['12', '2027-09-03', 'photo', 'Un verre de vin en 4 étapes : le raisin, le moût, la barrique, le verre.', 'Sur le fond bleu de Verdignan, en ligne : du raisin, un flacon de moût, une douelle de barrique et un verre de rouge, les quatre étapes du vin', [26, 2, 0]],
    ['13', '2027-08-28', 'photo', 'Chez Louis, le grand-père. Coufran, depuis 1924.', 'Château Coufran en fin d’après-midi, la porte ouverte, un chapeau de paille sur une chaise : chez Louis, le grand-père', [42, 4, 2]],
    ['14', '2027-08-22', 'photo', 'Soudars est né d’une friche : Éric a replanté ces pierres en 1980.', 'Sur un fond vert, la bouteille de Château Soudars, des pierres blanches de la friche et un coquelicot : né d’une friche', [58, 4, 2]],
    ['15', '2027-08-17', 'reel', 'Gardé pour vous, épisode 2 : la plus vieille bouteille de la cave. Devinez l’année.', 'Reel Gardé pour vous : la plus vieille bouteille de la cave, devinez l’année', [78, 7, 2]],
    ['16', '2027-08-12', 'photo', 'Une grappe tendue, sur le mur du chai.', 'L’ombre d’une main qui tend une grappe, sur le mur du chai', [40, 3, 1]],
    ['17', '2027-08-07', 'photo', 'Une vieille vigne chargée de raisin, et Lovely et Fred à son pied.', 'Lovely et Fred accroupis au pied d’une vieille vigne chargée de raisin, la main de Fred sur le tronc', [58, 4, 4]],
    ['18', '2027-08-01', 'photo', 'Le dossier est à Bordeaux : le flyer de l’Enquête à la racine vous attend à l’Office de tourisme.', 'Au comptoir de l’Office de tourisme de Bordeaux, le logo de la ville au mur et le flyer de l’Enquête à la racine : le dossier est à Bordeaux', [44, 3, 1]],
    ['19', '2027-07-27', 'reel', 'Des bouteilles ont disparu. L’Enquête à la racine se joue sur miailhe.com.', 'Reel Enquête à la racine : des bouteilles ont disparu, Lovely à la loupe, Fred à la lanterne ; l’enquête se joue sur le site, une bouteille à gagner', [222, 16, 7]],
    ['20', '2027-07-22', 'photo', 'Chez Jean, le père. Verdignan, depuis 1976.', 'La tour et la flèche de Verdignan à l’heure bleue, au-dessus des rangs : chez Jean, le père', [43, 4, 2]],
    ['21', '2027-07-17', 'photo', 'Vous commandez sur miailhe.com, on charge. Retrait gratuit au château.', 'Lovely porte une caisse de vin, Fred charge un coffre devant la grille du château : vous commandez sur miailhe.com, on charge, retrait gratuit au château', [26, 2, 2]],
    ['22', '2027-07-12', 'photo', 'Soudars, au ras des pierres de l’ancienne friche.', 'Château Soudars au ras des pierres, ses jeunes vignes sur l’ancienne friche', [40, 3, 0]],
    ['23', '2027-07-07', 'reel', 'Visites guidées : Lovely raconte, Fred porte la caisse. Sur réservation, tout l’été.', 'Reel Visites guidées : Lovely raconte, Fred porte la caisse de dégustation, des visiteurs de dos, le belvédère de Coufran au bout des rangs', [85, 5, 3]],
    ['24', '2027-07-02', 'photo', 'Une bouteille de Coufran levée au-dessus des vignes.', 'Deux mains sortent du feuillage des vignes et lèvent une bouteille de Château Coufran et un verre de rouge contre le ciel', [51, 1, 2]],
    ['25', '2027-06-27', 'photo', 'Un soir au bout du carrelet, face à la Gironde.', 'Lovely et Fred au bout d’un carrelet, face à l’estuaire de la Gironde', [47, 4, 3]],
    ['26', '2027-06-22', 'photo', 'Fred cache quelque chose dans son dos.', 'Fred de dos, chemise rayée, contre un mur de pierre et de vigne, une bouteille de Château Verdignan et deux verres tenus dans le dos', [50, 3, 2]],
    ['27', '2027-06-17', 'reel', 'La carte de la famille : trois châteaux reliés par une même racine.', 'Reel : les mains d’un vigneron tiennent une carte au trésor ; Coufran, Verdignan et Soudars reliés par une même racine au sceau de la famille Miailhe', [79, 6, 2]],
    ['28', '2027-06-12', 'photo', 'Fête des pères : le coffret des trois générations. De père en fils.', 'Fête des pères : le coffret des trois générations, Coufran, Verdignan et Soudars, offert de mains en mains. De père en fils', [48, 2, 3]],
    ['29', '2027-06-08', 'photo', 'À l’ombre du belvédère de Coufran.', 'Lovely et Fred au pied du belvédère de Coufran, dans son ombre', [60, 4, 3]],
    ['30', '2027-06-03', 'photo', 'Chez Éric, le fils. Soudars, depuis 1980.', 'Les chais de Soudars aux volets rouges, des coquelicots et des pierres blanches au pied des jeunes vignes : chez Éric, le fils', [57, 4, 2]],
    ['31', '2027-05-30', 'reel', 'Vin contre vin, partie 1 : le gigot d’agneau de Pauillac. Coufran ou Verdignan ?', 'Reel Vin contre vin : un gigot d’agneau de Pauillac servi dans les vignes du Médoc, Coufran ou Verdignan ?', [46, 1, 2]],
    ['32', '2027-05-24', 'photo', 'Verdignan, sa tour et sa flèche, vues depuis les rangs.', 'Château Verdignan en contre-plongée depuis les rangs, sa tour et sa flèche', [32, 0, 1]],
    ['33', '2027-05-18', 'photo', 'Lovely et Fred, sous le ciel bleu du Médoc.', 'Lovely et Fred dans les vignes, sous un ciel bleu', [34, 3, 1]],
    ['34', '2027-05-12', 'photo', 'Le Médoc vu du ciel, des rangs de vigne jusqu’à l’estuaire.', 'Le Médoc vu du ciel : les rangs de vigne jusqu’à l’estuaire de la Gironde', [58, 6, 2]],
    ['35', '2027-05-06', 'reel', 'Gardé pour vous : nos bouteilles attendent au château d’être prêtes.', 'Reel Gardé pour vous : Lovely entre les casiers où les bouteilles attendent', [74, 4, 3]],
    ['36', '2027-04-29', 'photo', 'Soudars s’invite chez V and B, C10 et les Traiteurs de France.', 'Une bouteille de Soudars sur une table de réception devant le château : Soudars s’invite chez V and B, C10 et les Traiteurs de France', [51, 4, 2]],
    ['37', '2027-04-25', 'photo', 'À vélo entre les rangs.', 'Lovely et Fred à vélo entre les rangs de vigne', [35, 2, 2]],
    ['38', '2027-04-20', 'photo', 'Coufran vu du ciel, sur sa croupe de graves.', 'Château Coufran vu du ciel, sur sa croupe de graves entourée de merlot', [18, 0, 1]],
    ['39', '2027-04-15', 'reel', 'Du chai au verre : on goûte avant vous.', 'Reel Du chai au verre : Fred tire le vin de la barrique à la pipette, Lovely tient le verre', [83, 7, 4]],
    ['40', '2027-04-08', 'photo', 'L’estuaire de la Gironde et ses carrelets.', 'L’estuaire de la Gironde, ses carrelets sur pilotis et les vignes au premier plan', [22, 1, 1]],
    ['41', '2027-04-01', 'photo', 'Le premier bourgeon de l’année.', 'Lovely et Fred regardent le premier bourgeon de l’année', [57, 4, 4]],
    ['42', '2027-03-25', 'photo', 'Vous sentez la cerise ? Alors vous avez raison. Pas besoin d’être expert.', 'Sur le fond vert de Soudars, un tas de cerises, mûres, framboises et cassis : vous sentez la cerise ? Alors vous avez raison, pas besoin d’être expert', [50, 3, 2]],
    ['43', '2027-03-18', 'reel', 'Fred explique, épisode 3 : trop tôt ou prêt ?', 'Reel Fred explique : deux verres du même vin, l’un jeune et violet, l’autre grenat ; Lovely sceptique, Fred montre le plus vieux. Trop tôt ou prêt ?', [81, 8, 4]],
    ['44', '2027-03-11', 'photo', 'Un château, c’est une ferme. Pas de donjon, pas de douves.', 'Sur le fond or de Coufran, des gants de travail, un sécateur et une vieille clé : un château, c’est une ferme ; pas de donjon, pas de douves', [47, 3, 2]],
    ['45', '2027-03-04', 'photo', 'Lovely et Fred plantent un jeune pied de vigne.', 'Lovely et Fred, à genoux sur la grave, plantent ensemble un jeune pied de vigne', [26, 2, 0]],
    ['46', '2027-02-18', 'photo', 'Devinez le château. Indice : il regarde l’estuaire.', 'La pointe d’une flèche d’ardoise contre le ciel bleu. Devinez le château ; indice : il regarde l’estuaire', [20, 0, 1]],
    ['47', '2027-02-11', 'reel', 'Fred explique, épisode 2 : l’assemblage, trois parcelles pour un seul vin.', 'Reel Fred explique : l’assemblage, trois parcelles pour un seul vin', [49, 4, 1]],
    ['48', '2027-02-04', 'photo', 'Trois verres, une seule ombre.', 'Trois verres de vin rouge sur une table de pierre, leurs ombres qui se rejoignent', [30, 3, 1]],
    ['49', '2027-01-28', 'photo', 'Les graves du Haut-Médoc, et la vigne qui plonge entre les galets.', 'Au ras du sol, les galets de grave du Haut-Médoc, et un pied de vigne qui plonge entre eux', [63, 4, 3]],
    ['50', '2027-01-21', 'photo', 'Quatre mains, quatre générations, une même vigne.', 'Quatre mains de quatre âges posées l’une au-dessus de l’autre sur le tronc d’une vieille vigne', [34, 2, 1]],
    ['51', '2027-01-14', 'reel', 'Votre année de naissance ? On la cherche pour vous dans la cave.', 'Reel : Fred sort une vieille bouteille des casiers, Lovely montre l’objectif. Votre année de naissance ?', [40, 1, 2]],
    ['52', '2027-01-09', 'photo', 'Les larmes du vin.', 'Les larmes d’un vin rouge qui coulent sur la paroi d’un verre', [25, 1, 0]],
    ['53', '2027-01-05', 'photo', 'L’hiver, c’est la taille.', 'L’écorce d’un vieux cep givré et la coupe fraîche de la taille', [27, 0, 2]],
    ['54', '2026-12-29', 'photo', 'Les bouchons des millésimes, sur la table du chai.', 'Les bouchons des millésimes sur la table du chai, un verre couché', [41, 2, 1]],
    ['55', '2026-12-22', 'reel', 'Fred explique, épisode 1 : le verre change tout.', 'Reel Fred explique : le verre idéal', [44, 2, 3]],
    ['56', '2026-12-16', 'photo', 'Dans la lumière du chai.', 'Le vin rouge versé dans un grand verre, dans la lumière du chai', [34, 2, 2]],
    ['57', '2026-12-10', 'photo', 'Verdignan prend son temps : c’est le vin de garde de la famille.', 'Sur un fond bleu, la bouteille de Château Verdignan et une vieille bouteille poussiéreuse couchée : il prend son temps, le vin de garde de la famille', [34, 3, 1]],
    ['58', '2026-12-05', 'photo', 'On est à l’aéroport de Bordeaux. Vous nous avez vus ?', 'Le caisson MIAILHE dans un couloir de Bordeaux Aéroport, des voyageurs passent devant : on est à l’aéroport', [19, 2, 1]],
    ['59', '2026-12-01', 'reel', 'Les coulisses, épisode 1 : on vous ouvre le chai.', 'Reel Les coulisses : Lovely et Fred ouvrent la porte du chai', [83, 5, 3]],
    ['60', '2026-11-26', 'photo', 'La boutique de la famille est en ligne, sur miailhe.com.', 'Une main tient un téléphone qui montre la boutique de miailhe.com, une caisse de vin livrée ouverte sur la table : la boutique est en ligne', [33, 3, 2]],
    ['61', '2026-11-22', 'photo', '1931, aujourd’hui. Même façade, même famille.', 'Une main tient la photo de famille de 1931 devant la même façade, où Lovely et Fred sont assis aujourd’hui : même place, quatre générations plus tard', [110, 8, 6]],
    ['62', '2026-11-19', 'photo', 'On s’exporte : Belgique, Norvège, Japon, Canada, États-Unis.', 'Un vrai tableau des départs dans un hall d’aéroport : Belgique, Norvège, Japon, Canada, États-Unis, statut prêt à boire. On s’exporte', [54, 4, 2]],
    ['63', '2026-11-17', 'reel', 'Quel château êtes-vous ? Faites le test sur miailhe.com.', 'Reel Le test : Lovely et Fred tendent Soudars et Coufran, Verdignan entre eux. Quel château êtes-vous ?', [109, 9, 5]],
    ['64', '2026-11-15', 'photo', 'Deux verres qui trinquent, sur un mur de calcaire.', 'L’ombre de deux verres qui trinquent sur un mur de calcaire', [59, 3, 2]],
    ['65', '2026-11-12', 'photo', 'Depuis 2005, chaque bouteille porte son numéro de lot gravé.', 'Fred montre le numéro de lot gravé sur une bouteille de Verdignan', [49, 2, 2]],
    ['66', '2026-11-10', 'photo', 'Elles attendent d’être prêtes.', 'Les culots des bouteilles couchées dans les casiers, qui attendent d’être prêtes', [32, 0, 1]],
    ['67', '2026-11-08', 'reel', 'Wine family, épisode 1 : on vous présente la famille.', 'Reel Wine family : Lovely et Fred, deux cousins, dans les vignes sous un ciel bleu', [88, 7, 3]],
    ['68', '2026-11-06', 'photo', '4 générations, 1 même racine : Louis en 1924, Jean en 1976, Éric en 1980, Lovely en 2006.', 'Deux bandes de pellicule noir et blanc sur une table lumineuse : Louis et Coufran en 1924, Jean et Verdignan en 1976, Éric en 1980, Lovely en 2006, entourée au crayon rouge', [40, 4, 1]],
    ['69', '2026-11-04', 'photo', '2005, à la craie sur la barrique.', 'L’ombre d’un verre sur le fond d’une barrique marquée 2005 à la craie', [57, 3, 2]],
  ];
  // la Page est montrée au lendemain de sa dernière publication : un an après la relance de novembre 2026
  const MAINTENANT = new Date(2027, 9, 29, 10, 0);
  const NOM = 'Famille Miailhe – Vins de Bordeaux';   // le nom de la Page ne se traduit pas (translate="no")
  const IMG = 'assets/img/instagram/';
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const echapper = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  // la date à la manière de Facebook : « 3 h », « 6 j », puis « 21 octobre », et l'année si ce n'est pas celle-ci
  const quand = iso => {
    const [a, m, j] = iso.split('-').map(Number), d = new Date(a, m - 1, j, 18, 30);
    const heures = (MAINTENANT - d) / 36e5;
    if (heures < 24) return `${Math.max(1, Math.round(heures))} h`;
    if (heures < 24 * 7) return `${Math.floor(heures / 24)} j`;
    return a === MAINTENANT.getFullYear() ? `${j} ${MOIS[m - 1]}` : `${j} ${MOIS[m - 1]} ${a}`;
  };
  // Facebook fait un lien de chaque adresse écrite dans une publication
  const liens = s => echapper(s).replace(/miailhe\.com/g, '<a href="%E2%98%85%20MIAILHE%20Vitrine%20V1.html" target="_blank" rel="noopener" translate="no">miailhe.com</a>');

  const ICONES = {
    monde: '<svg viewBox="0 0 16 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="6.3"/><path d="M1.8 8h12.4M8 1.7c1.8 1.7 2.6 3.9 2.6 6.3S9.8 12.6 8 14.3C6.2 12.6 5.4 10.4 5.4 8S6.2 3.4 8 1.7Z"/></g></svg>',
    points: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></g></svg>',
    epingle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.4 2.6a1 1 0 0 0-1.6.3l-1.3 2.9-4.3 2.7-3.1-.4a1 1 0 0 0-.8 1.7l3.6 3.6-5.4 5.4a1 1 0 1 0 1.4 1.4l5.4-5.4 3.6 3.6a1 1 0 0 0 1.7-.8l-.4-3.1 2.7-4.3 2.9-1.3a1 1 0 0 0 .3-1.6l-4.8-4.8Z" fill="currentColor"/></svg>',
    certifie: '<span role="img" aria-label="Compte vérifié"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fill="#0866ff" fill-rule="evenodd"/></svg></span>',
    aime: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#0866ff"/><path d="M6.8 10.6h2.1v7H6.8a.6.6 0 0 1-.6-.6v-5.8c0-.3.3-.6.6-.6Zm3.1 0 2.4-4.1c.4-.6 1.4-.4 1.5.4l-.4 2.7h3.4c.9 0 1.5.8 1.3 1.6l-1.1 5c-.2.8-.9 1.4-1.7 1.4H9.9v-7Z" fill="#fff"/></svg>',
    adore: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#f33e58"/><path d="M12 18s-5.6-3.3-5.6-7c0-1.8 1.3-3.2 3-3.2 1.1 0 2 .6 2.6 1.6.6-1 1.5-1.6 2.6-1.6 1.7 0 3 1.4 3 3.2 0 3.7-5.6 7-5.6 7Z" fill="#fff"/></svg>',
    jaime: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 10.5H4.8a.8.8 0 0 0-.8.8v8.4c0 .4.4.8.8.8h2.7m0-10 3.6-6.1c.6-1 2.2-.6 2.2.6l-.6 4h4.6c1.4 0 2.4 1.3 2.1 2.6l-1.6 6.9c-.3 1.2-1.3 2-2.5 2H7.5v-10Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    commenter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5c-5 0-9 3.5-9 7.9 0 2.3 1.1 4.3 2.9 5.8L5.3 21l4.1-2.2c.8.2 1.7.3 2.6.3 5 0 9-3.5 9-7.8s-4-7.8-9-7.8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    partager: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 4.5 21 11.3l-7.5 6.8v-3.9c-4.9 0-8.1 1.5-10.5 5.3.9-5.3 3.9-9.5 10.5-10.3V4.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    lecture: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.6v14.8c0 .8.9 1.3 1.6.9l11.7-7.4c.6-.4.6-1.3 0-1.7L8.6 3.8C7.9 3.3 7 3.8 7 4.6Z" fill="currentColor"/></svg>',
  };

  const media = (nn, genre, alt) => {
    if (genre === 'triptyque') return `<div class="fb-pub-media fb-pub-media--triptyque">${['01', '02', '03'].map((n, i) => `<img src="${IMG}apres-post-${n}.jpg" alt="${echapper(alt[i])}" loading="lazy">`).join('')}</div>`;
    return `<div class="fb-pub-media"><img src="${IMG}apres-post-${nn}.jpg" alt="${echapper(alt)}" loading="lazy">${genre === 'reel' ? `<span class="fb-lecture">${ICONES.lecture}</span>` : ''}</div>`;
  };
  const compteurs = ([j, c, p]) => `
    <div class="fb-pub-compteurs">
      <div class="fb-reactions"><span>${ICONES.aime}${j > 30 ? ICONES.adore : ''}</span>${j}</div>
      ${c ? `<span>${c} ${c > 1 ? 'commentaires' : 'commentaire'}</span>` : ''}
      ${p ? `<span>${p} ${p > 1 ? 'partages' : 'partage'}</span>` : ''}
    </div>`;
  const publication = ([nn, date, genre, legende, alt, chiffres]) => `
    <article class="carte fb-pub">
      ${genre === 'triptyque' ? `<div class="fb-epingle">${ICONES.epingle}<span>Publication épinglée</span></div>` : ''}
      <div class="fb-pub-tete">
        <img class="fb-pub-avatar" src="assets/img/facebook/profil.jpg" alt="">
        <div class="fb-pub-qui">
          <div class="fb-pub-nom"><a href="#" data-inerte translate="no">${NOM}</a>${ICONES.certifie}</div>
          <div class="fb-pub-date"><a href="#" data-inerte>${quand(date)}</a><span aria-hidden="true">&nbsp;·&nbsp;</span>${ICONES.monde}</div>
        </div>
        <button class="fb-pub-options" type="button" aria-label="Actions pour cette publication">${ICONES.points}</button>
      </div>
      <p class="fb-pub-texte">${liens(legende)}</p>
      ${media(nn, genre, alt)}
      ${compteurs(chiffres)}
      <div class="fb-pub-actions">
        <button type="button">${ICONES.jaime}<span>J’aime</span></button>
        <button type="button">${ICONES.commenter}<span>Commenter</span></button>
        <button type="button">${ICONES.partager}<span>Partager</span></button>
      </div>
    </article>`;
  document.querySelector('[data-fil]').insertAdjacentHTML('beforeend', PUBLICATIONS.map(publication).join(''));

  // le bloc « Photos » : les neuf dernières photos (sans les reels)
  document.querySelector('[data-photos]').innerHTML = PUBLICATIONS.filter(p => p[2] === 'photo').slice(0, 9)
    .map(([nn, , , , alt]) => `<img src="${IMG}apres-post-${nn}.jpg" alt="${echapper(alt)}" loading="lazy">`).join('');

  // la colonne de gauche colle en haut si elle tient dans l'écran, sinon par le bas, comme sur Facebook
  const gauche = document.querySelector('.fb-colonne--gauche');
  const coller = () => { gauche.style.top = Math.min(72, innerHeight - gauche.offsetHeight - 16) + 'px'; };
  coller();
  window.addEventListener('resize', coller);
  document.addEventListener('miailhe:langue', coller);

  // maquette : les liens de Facebook ne mènent nulle part
  document.addEventListener('click', e => { if (e.target.closest('[data-inerte]')) e.preventDefault(); });
})();
