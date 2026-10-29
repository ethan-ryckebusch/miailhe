"""Allège les images du site sans changer leur contenu (29/10/2026, demande de l'utilisateur : « optimiser le site pour
son poids et améliorer sa vitesse de chargement, sans modifier le contenu »).

Pour chaque JPEG de assets/img de plus de 180 Ko :
- s'il dépasse 2 400 px de large, il est ramené à 2 400 px (le site ne l'affiche jamais plus grand, même en 2×) ;
- il est réencodé en JPEG progressif, qualité 80, tables optimisées ;
- le nouveau fichier ne remplace l'ancien que s'il est au moins 12 % plus léger.
L'original est d'abord copié dans source/images-originales/ (même chemin), une seule fois : relancer le script repart
toujours des originaux, sans perte cumulée.

Attention : les scripts qui écrivent des images dans assets/img (images_feed.py, generer_blog.py, etc.) les écrivent à
leur propre qualité ; relancer ce script après eux.

    python3 source/optimiser_images.py
"""
import shutil
from pathlib import Path

from PIL import Image

ICI = Path(__file__).resolve().parent
IMG = ICI.parent / 'assets' / 'img'
ORIGINAUX = ICI / 'images-originales'
SEUIL = 180_000
LARGEUR = 2400
QUALITE = 80


def main():
    avant = apres = 0
    for f in sorted(IMG.rglob('*.jpg')):
        orig = ORIGINAUX / f.relative_to(IMG)
        source = orig if orig.exists() else f
        if source.stat().st_size < SEUIL:
            continue
        if not orig.exists():
            orig.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, orig)
        im = Image.open(orig)
        icc = im.info.get('icc_profile')
        im = im.convert('RGB')
        if im.width > LARGEUR:
            im = im.resize((LARGEUR, round(im.height * LARGEUR / im.width)), Image.LANCZOS)
        tmp = f.with_suffix('.tmp.jpg')
        im.save(tmp, quality=QUALITE, optimize=True, progressive=True, subsampling='4:2:0', **({'icc_profile': icc} if icc else {}))
        o, n = orig.stat().st_size, tmp.stat().st_size
        if n < o * .88:
            tmp.replace(f)
            avant += o; apres += n
            print(f'{f.relative_to(IMG)} : {o // 1024} → {n // 1024} Ko')
        else:
            tmp.unlink()
            if f.stat().st_size != o:
                shutil.copy2(orig, f)
    if avant:
        print(f'\n{avant / 1e6:.1f} Mo → {apres / 1e6:.1f} Mo ({100 - apres * 100 / avant:.0f} % de moins)')


if __name__ == '__main__':
    main()
