"""Le logo MIAILHE sur les bouteilles du site (27/10/2026, deuxième version).

Sous l'étiquette de chaque bouteille, le logotype MIAILHE (Logos/LOGO_FINAL) est sérigraphié à même le verre, petit,
dans un ivoire champagne : la signature discrète de la maison mère, comme sur les flacons de grandes maisons. Il suit
l'ombrage cylindrique de la bouteille, colonne par colonne. On ne recouvre aucune mention de l'étiquette d'origine.
La première version (une contre-étiquette en papier, encadrée) a été jugée trop présente.

Les photos d'origine sont dans archives/bouteilles-sans-miailhe/ ; les images du site (assets/img/bouteille-*.webp)
sont réécrites à partir d'elles.

    python3 Site_MIAILHE/source/etiquettes_miailhe.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ICI = Path(__file__).resolve().parent
SITE = ICI.parent
ORIGINES = SITE / "archives" / "bouteilles-sans-miailhe"
LOGO = SITE.parent / "Logos" / "LOGO_FINAL" / "PNG" / "miailhe-logotype-noir-2000px.png"
# les étiquettes des N° 2 (sombre, rouge) se confondent avec le verre : leur boîte est relevée à la main
BOITES = {"bouteille-coufran-n2.webp": (10, 470, 268, 838), "bouteille-verdignan-n2.webp": (11, 494, 312, 995)}


def etiquette(rgba):
    """La boîte de l'étiquette : la plus longue suite de lignes dont la majorité des pixels est claire ou colorée
    (les reflets du verre, eux, n'occupent qu'une bande étroite)."""
    a = rgba[..., 3] > 200
    rgb = rgba[..., :3].astype(np.float32)
    lum = rgb @ [.299, .587, .114]
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    clair = a & ((lum > 95) | ((sat > 80) & (lum > 45)))
    h = rgba.shape[0]
    part = clair.sum(axis=1) / np.maximum(a.sum(axis=1), 1)
    lignes = part > .55
    lignes[: int(h * .38)] = False
    meilleur, debut = (0, 0, 0), None
    for y, v in enumerate(list(lignes) + [False]):
        if v and debut is None:
            debut = y
        elif not v and debut is not None:
            if y - debut > meilleur[0]:
                meilleur = (y - debut, debut, y - 1)
            debut = None
    _, y0, y1 = meilleur
    cols = np.nonzero(clair[y0:y1 + 1].mean(axis=0) > .5)[0]
    return int(cols.min()), int(y0), int(cols.max()), int(y1)


def couleurs(rgba, boite):
    x0, y0, x1, y1 = boite
    zone = rgba[y0:y1, x0 + (x1 - x0) // 6: x1 - (x1 - x0) // 6, :3].reshape(-1, 3).astype(np.float32)
    lum = zone @ [.299, .587, .114]
    if np.median(lum) < 115:                       # étiquette sombre (les N° 2) : fond sombre, encre claire
        fond = np.median(zone[lum <= np.percentile(lum, 50)], axis=0)
        encre = np.median(zone[lum >= np.percentile(lum, 93)], axis=0)
    else:                                         # étiquette claire : papier et encre de l'étiquette
        fond = np.median(zone[lum >= np.percentile(lum, 55)], axis=0)
        encre = np.median(zone[lum <= np.percentile(lum, 6)], axis=0)
    return fond, encre


def ombrage(rgba, boite, x0s, x1s):
    """Le profil de lumière de l'étiquette, colonne par colonne (la bouteille est un cylindre)."""
    x0, y0, x1, y1 = boite
    zone = rgba[y0 + (y1 - y0) // 10: y1 - (y1 - y0) // 10, x0s:x1s, :3].astype(np.float32) @ [.299, .587, .114]
    prof = np.percentile(zone, 80, axis=0)
    prof = ndimage.uniform_filter1d(prof, max(3, (x1s - x0s) // 12))
    return np.clip(prof / prof.max(), .55, 1)


def contre_etiquette(rgba, logo, boite=None):
    boite = boite or etiquette(rgba)
    x0, y0, x1, y1 = boite
    lw = x1 - x0
    fond, encre = couleurs(rgba, boite)
    W, H = int(lw * .62), int(lw * .2)
    cx = (x0 + x1) // 2
    xs0, ys0 = cx - W // 2, y1 + int(lw * .035)
    # la bande : le papier de l'étiquette, un filet intérieur, le logotype
    bande = Image.new("RGBA", (W, H), tuple(int(v) for v in fond) + (255,))
    d = ImageDraw.Draw(bande)
    r = max(2, int(H * .06))
    filet = tuple(int(v) for v in encre) + (150,)
    d.rectangle([r, r, W - 1 - r, H - 1 - r], outline=filet, width=max(1, int(H * .018)))
    lb = logo.getbbox()
    lg = logo.crop(lb)
    lwid = int(W * .66)
    lg = lg.resize((lwid, int(lg.height * lwid / lg.width)), Image.LANCZOS)
    if lg.height > H * .78:
        lg = lg.resize((int(lg.width * H * .78 / lg.height), int(H * .78)), Image.LANCZOS)
    alpha = np.asarray(lg)[..., 3]
    ink = np.zeros((lg.height, lg.width, 4), np.uint8)
    ink[..., :3] = encre.astype(np.uint8)
    ink[..., 3] = alpha
    bande.alpha_composite(Image.fromarray(ink, "RGBA"), ((W - lg.width) // 2, (H - lg.height) // 2))
    # l'ombrage cylindrique et le grain du papier
    b = np.asarray(bande).astype(np.float32)
    prof = ombrage(rgba, boite, max(0, xs0), min(rgba.shape[1], xs0 + W))
    if len(prof) != W:
        prof = np.interp(np.linspace(0, len(prof) - 1, W), np.arange(len(prof)), prof)
    b[..., :3] *= prof[None, :, None]
    b[..., :3] += np.random.default_rng(1).normal(0, 2.2, b[..., :3].shape)
    bande = Image.fromarray(np.clip(b, 0, 255).astype(np.uint8), "RGBA")
    out = Image.fromarray(rgba, "RGBA")
    out.alpha_composite(bande, (xs0, ys0))
    return out, boite


IVOIRE = np.array([232, 220, 190], np.float32)   # l'encre de la sérigraphie, un ivoire champagne


def serigraphie(rgba, logo, boite=None):
    """Le logotype imprimé sur le verre, sous l'étiquette : 34 % de sa largeur, centré, ombré comme le cylindre."""
    boite = boite or etiquette(rgba)
    x0, y0, x1, y1 = boite
    lw = x1 - x0
    lg = logo.crop(logo.getbbox())
    W = int(lw * .34)
    lg = lg.resize((W, max(1, int(lg.height * W / lg.width))), Image.LANCZOS)
    m = np.asarray(lg)[..., 3].astype(np.float32) / 255
    H = m.shape[0]
    cx = (x0 + x1) // 2
    xs0, ys0 = cx - W // 2, y1 + int(lw * .1)
    # le profil de lumière du verre : plus clair au centre, plus sombre vers les bords
    xs = np.arange(W) + xs0
    t = (xs - cx) / (lw / 2)
    prof = np.clip(1 - .38 * t ** 2, .55, 1)
    # le verre doit être là : on n'imprime que sur la bouteille
    zone = rgba[ys0:ys0 + H, xs0:xs0 + W]
    m = m[:zone.shape[0], :zone.shape[1]] * (zone[..., 3] > 200)
    a = m * .82 * prof[None, :zone.shape[1]]
    out = rgba.copy().astype(np.float32)
    enc = IVOIRE[None, None, :] * (.86 + .14 * prof[None, :zone.shape[1], None])
    z = out[ys0:ys0 + H, xs0:xs0 + W, :3]
    out[ys0:ys0 + H, xs0:xs0 + W, :3] = z * (1 - a[..., None]) + enc * a[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA"), boite


def main():
    logo = Image.open(LOGO).convert("RGBA")
    if not ORIGINES.exists():
        ORIGINES.mkdir(parents=True)
        for f in sorted((SITE / "assets/img").glob("bouteille-*.webp")):
            (ORIGINES / f.name).write_bytes(f.read_bytes())
    for f in sorted(ORIGINES.glob("bouteille-*.webp")):
        rgba = np.asarray(Image.open(f).convert("RGBA")).copy()
        out, boite = serigraphie(rgba, logo, BOITES.get(f.name))
        out.save(SITE / "assets/img" / f.name, "WEBP", quality=92, method=6)
        print(f.name, "étiquette", boite)


if __name__ == "__main__":
    main()
