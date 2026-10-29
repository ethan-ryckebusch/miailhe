"""Des photos du feed Instagram @famillemiailhe sur le site, à la place des images les plus faibles (29/10/2026, demande de
l'utilisateur : « ajouter des images du feed instagram sur le site (sans texte et logo) car le site comprenait des
images moches »).

On part des prises Higgsfield elles-mêmes (`Recommandation/Instagram/Feed/source/prises*/`), avant que l'exporteur du feed
n'y pose le texte, le logo ou la mention sanitaire. Les remplacées sont surtout des photos des anciens sites des
châteaux : des casiers métalliques d'entrepôt, des images de film floues ou basse définition, une flaque. Les vraies
photos des châteaux et de la famille restent.

Le même jour, l'utilisateur a demandé aussi des photos de Lovely et Fred, les deux cousins du compte (« on veut ressentir
ce sentiment d'appartenance et ce côté affectif familial sur le site ») : ce sont les prises du feed, dont chaque visage a
été vérifié contre la photo de référence (`lovely-fred-*`, `fred-*`). Elles viennent de `prises_v8/` : la première référence
de Lovely avait pris une autre femme, et l'utilisateur a confirmé que la vraie Lovely est celle de la photo avec Éric ;
les prises ont été corrigées dans le feed (seule Lovely change). Leur accord écrit reste à obtenir avant la mise en ligne.

Les grands plans d'ouverture (format paysage) sont recadrés ici, au point d'intérêt choisi ; les autres gardent le 3:4
du feed, et la page les recadre (object-fit). Écrit `assets/img/feed/<nom>.jpg`.

    python3 Site_MIAILHE/source/images_feed.py
"""
from pathlib import Path

from PIL import Image

ICI = Path(__file__).resolve().parent
SITE = ICI.parent
FEED = SITE.parent / 'Recommandation' / 'Instagram' / 'Feed' / 'source'
SORTIE = SITE / 'assets' / 'img' / 'feed'

# nom : (prise du feed, rapport largeur/hauteur du recadrage ou None, centre vertical du recadrage, largeur de sortie)
IMAGES = {
    'medoc-ciel-large': ('prises_v2/C317', 16 / 10, .40, 2400),      # ouverture du Terroir : les rangs jusqu'à l'estuaire
    'culots-large': ('prises_v2/C303', 16 / 10, .50, 2400),          # ouverture du Prêt-à-boire
    'estuaire-carrelets-large': ('prises_v3/C711', 2 / 1, .52, 2400),  # les vins de Verdignan, face à l'estuaire
    'soudars-friche-large': ('prises_v4/C966', 16 / 10, .58, 2400),  # la famille de Soudars : les vignes sur la friche
    'culots': ('prises_v2/C303', None, .5, 1600),
    'graves': ('prises_v6/C1119', None, .5, 1600),
    'ombre-barrique': ('prises/A13', None, .5, 1600),
    'bulles-du-mout': ('prises/A18', None, .5, 1600),
    'bouchons': ('prises_v3/C811', None, .5, 1600),
    'larmes-du-vin': ('prises_v6/C1115', None, .5, 1600),
    'grappe-rosee': ('prises_v7/C1215', None, .5, 1600),
    'ecorce-taille': ('prises_v6/C1118', None, .5, 1600),
    'trinquer-ombre': ('prises/A04', None, .5, 1600),
    # Lovely et Fred
    'lovely-fred-cave-large': ('prises_v8/C1411', 16 / 10, .58, 2400),  # le Prêt-à-boire : « Votre année ? »
    'lovely-fred-drive': ('prises_v8/C1424', None, .5, 1600),          # la boutique : livraison et drive
    'fred-lot-grave': ('prises_v8/C1432', None, .5, 1600),             # Verdignan : le numéro de lot gravé
    'lovely-fred-belvedere': ('prises_v8/C1426', None, .5, 1600),      # Coufran, la lignée
    'lovely-fred-carrelet': ('prises_v8/C1425', None, .5, 1600),       # Verdignan, la lignée
    'lovely-fred-plantation': ('prises_v8/C1430', None, .5, 1600),    # Soudars, la lignée
    'lovely-fred-tri': ('prises_v8/C1422', None, .5, 1600),            # galerie de Coufran
    'lovely-fred-pipette': ('prises_v8/C1408', 3 / 4, .5, 1600),       # galerie de Verdignan
    'lovely-fred-vieille-vigne': ('prises_v8/C1423', None, .5, 1600), # galerie de Soudars
}


def main():
    SORTIE.mkdir(exist_ok=True)
    for nom, (prise, rapport, centre, largeur) in IMAGES.items():
        im = Image.open(FEED / f'{prise}.png').convert('RGB')
        w, h = im.size
        if rapport:
            hc = round(w / rapport)
            y = min(max(round(centre * h - hc / 2), 0), h - hc)
            im = im.crop((0, y, w, y + hc))
        im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
        im.save(SORTIE / f'{nom}.jpg', quality=84, optimize=True, progressive=True)
        print(f'{nom}.jpg', im.size, f'← {prise}')


if __name__ == '__main__':
    main()
