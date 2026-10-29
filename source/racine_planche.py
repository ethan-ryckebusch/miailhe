"""Acte II de la vitrine : la planche gravée des trois châteaux et de leurs racines.

Deux images Higgsfield (Nano Banana Pro) par format, rangées dans source/racine-planche/ :
  planche-<format>.png        la planche sans racines (les trois châteaux, la coupe du sol) ;
  planche-<format>-rouge.png  la même planche, où le modèle n'a ajouté que les racines, à l'encre rouge pure.
Le rouge sert de calque : on en tire le masque des racines, on les recolore (or pour Coufran, bleu pour Verdignan,
vert pour Soudars, encre pour la racine commune) et l'on calcule pour chaque pixel quand il pousse :
la distance le long de la racine depuis le pied de son château, jusqu'au point où les trois se rejoignent, puis la racine
commune qui descend. La page fait pousser les racines au défilement (vitrine.js, WebGL).

Sorties : assets/img/racine/planche-<format>.jpg (le fond) et assets/js/racine-planche.js (racines et carte de pousse,
en data: URI : Chrome refuse à WebGL les images lues sur file://, or le site s'ouvre sans serveur).

    python3 source/racine_planche.py
"""
import base64
import io
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import dijkstra

ICI = Path(__file__).resolve().parent
SITE = ICI.parent
SOURCE = ICI / "racine-planche"

COULEURS = {"coufran": (0xA9, 0x7D, 0x2E), "verdignan": (0x0F, 0x43, 0x66), "soudars": (0x0F, 0x32, 0x0A)}
ENCRE = (0x2E, 0x1E, 0x16)   # la racine commune : l'encre brune de la famille
ORDRE = ["coufran", "verdignan", "soudars"]

# Pour chaque format : largeur publiée, marges rognées (le filet d'encadrement de la gravure, en fractions)
# et bande de recherche du pied de chaque racine (fractions de largeur, après rognage)
FORMATS = {
    "large": {"largeur": 2400, "rognure": (0.014, 0.017), "pieds": [(0.10, 0.36), (0.42, 0.64), (0.74, 0.97)]},
    "haute": {"largeur": 1240, "rognure": (0, 0), "pieds": [(0.02, 0.36), (0.36, 0.64), (0.64, 0.98)]},
}
TRAVAIL = 1400   # largeur de travail pour le graphe des racines


def aligner(fond, rouge):
    """Recale la planche sans racines sur la planche rouge (les deux images diffèrent de quelques pixels)."""
    s = 0.25
    gris = lambda im: cv2.resize(cv2.cvtColor(im, cv2.COLOR_RGB2GRAY), None, fx=s, fy=s).astype(np.float32) / 255
    rougeur = rouge[..., 0].astype(int) - np.maximum(rouge[..., 1], rouge[..., 2])
    masque = (cv2.resize((rougeur < 30).astype(np.uint8), None, fx=s, fy=s) > 0).astype(np.uint8)
    w = np.eye(2, 3, dtype=np.float32)
    _, w = cv2.findTransformECC(gris(rouge), gris(fond), w, cv2.MOTION_AFFINE,
                                (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), masque, 5)
    w[:, 2] /= s
    h, l = rouge.shape[:2]
    return cv2.warpAffine(fond, w, (l, h), flags=cv2.INTER_CUBIC | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REFLECT)


def graphe(masque):
    """Graphe 8-connexe des pixels du masque (poids 1 ou racine de 2)."""
    h, l = masque.shape
    idx = -np.ones(masque.shape, int)
    ys, xs = np.nonzero(masque)
    idx[ys, xs] = np.arange(len(ys))
    lignes, cols, poids = [], [], []
    for dy, dx in [(0, 1), (1, 0), (1, 1), (1, -1)]:
        y2, x2 = ys + dy, xs + dx
        ok = (y2 >= 0) & (y2 < h) & (x2 >= 0) & (x2 < l)
        a = idx[ys[ok], xs[ok]]
        b = idx[y2[ok], x2[ok]]
        v = b >= 0
        lignes += [a[v]]; cols += [b[v]]; poids += [np.full(v.sum(), np.hypot(dy, dx))]
    n = len(ys)
    g = coo_matrix((np.concatenate(poids), (np.concatenate(lignes), np.concatenate(cols))), shape=(n, n)).tocsr()
    return g, idx, ys, xs


def traiter(nom, cfg):
    fond = np.asarray(Image.open(SOURCE / f"planche-{nom}.png").convert("RGB"))
    rouge = np.asarray(Image.open(SOURCE / f"planche-{nom}-rouge.png").convert("RGB"))
    fond = aligner(fond, rouge)
    mx, my = cfg["rognure"]
    h0, l0 = rouge.shape[:2]
    cadre = (slice(round(my * h0), round((1 - my) * h0)), slice(round(mx * l0), round((1 - mx) * l0)))
    fond, rouge = np.ascontiguousarray(fond[cadre]), np.ascontiguousarray(rouge[cadre])
    H, L = rouge.shape[:2]

    # 1. Le masque des racines : l'encre rouge pure
    # le rouge pur se distingue du sépia et de l'ocre par l'écart entre le rouge et les deux autres canaux
    # (et seul compte le rouge ajouté : les lavis orangés déjà présents sur la planche sans racines ne comptent pas)
    rougeur = lambda im: im[..., 0].astype(np.float32) - np.maximum(im[..., 1], im[..., 2])
    ajout = rougeur(rouge) - cv2.GaussianBlur(rougeur(fond), (0, 0), 3)
    alpha = np.clip((rougeur(rouge) - 35) / 60, 0, 1) * np.clip((ajout - 15) / 30, 0, 1)
    # les reflets clairs à l'intérieur d'une racine (rose pâle) font partie de la racine : on bouche les trous
    plein = ndimage.binary_fill_holes(ndimage.binary_closing(alpha > 0.5, structure=np.ones((5, 5)), iterations=2))
    alpha = np.maximum(alpha, plein.astype(np.float32))
    # le fond, là où passent les racines, est pris sur la planche sans racines (déjà recalée)

    # 2. Échelle publiée
    lo = cfg["largeur"]; ho = round(H * lo / L)
    taille = lambda im, interp=cv2.INTER_AREA: cv2.resize(im, (lo, ho), interpolation=interp)
    fond_o = taille(fond)
    alpha_o = taille(alpha)
    rouge_o = taille(rouge)
    # on retire les poussières rouges isolées
    etiq, n = ndimage.label(alpha_o > 0.25)
    aires = ndimage.sum(np.ones_like(alpha_o), etiq, index=np.arange(1, n + 1))
    garde = np.isin(etiq, 1 + np.nonzero(aires >= 30)[0])
    alpha_o = alpha_o * ndimage.binary_dilation(garde, iterations=2)

    # 3. Le graphe, à l'échelle de travail
    lw = TRAVAIL; hw = round(H * lw / L)
    a_w = cv2.resize(alpha, (lw, hw), interpolation=cv2.INTER_AREA)
    m_w = ndimage.binary_dilation(a_w > 0.2, iterations=1)
    etiq, n = ndimage.label(m_w, structure=np.ones((3, 3)))
    aires = ndimage.sum(m_w, etiq, index=np.arange(1, n + 1))
    m_w = np.isin(etiq, 1 + np.nonzero(aires >= 40)[0])
    g, idx, ys, xs = graphe(m_w)

    # le pied de chaque racine : le pixel le plus haut dans la bande de son château
    pieds = []
    for x0, x1 in cfg["pieds"]:
        sel = np.nonzero((xs >= x0 * lw) & (xs <= x1 * lw))[0]
        k = sel[np.argmin(ys[sel])]
        pieds.append(k)
    d = dijkstra(g, indices=pieds, directed=False)          # 3 x n
    atteint = np.isfinite(d).all(axis=0)
    somme = np.where(atteint, d.sum(axis=0), np.inf)
    j = int(np.argmin(somme))                                 # la jonction : là où les trois chemins se retrouvent
    dJ = dijkstra(g, indices=j, directed=False)
    D = d[:, j]
    # la racine commune : tout ce qui est sous la jonction
    tronc = ys >= ys[j] - 0.004 * hw
    # chaque pixel appartient au château dont il est le plus près, en proportion de la longueur de sa racine
    label = np.argmin(np.where(np.isfinite(d), d / D[:, None], np.inf), axis=0)
    pousse = np.empty(len(ys))
    for s in range(3):
        sel = (label == s) & ~tronc
        pousse[sel] = 0.78 * d[s, sel] / D[s]
    dJt = np.where(np.isfinite(dJ), dJ, 0)
    tmax = dJt[tronc].max() if tronc.any() else 1
    pousse[tronc] = 0.80 + 0.19 * dJt[tronc] / tmax
    pousse = np.clip(np.nan_to_num(pousse, nan=0.99, posinf=0.99), 0, 0.99)
    lab = np.where(tronc, 3, label)

    G_w = np.full((hw, lw), np.nan); G_w[ys, xs] = pousse
    L_w = np.full((hw, lw), -1); L_w[ys, xs] = lab
    # chaque pixel de la grille prend la valeur du pixel de racine le plus proche
    _, (iy, ix) = ndimage.distance_transform_edt(np.isnan(G_w), return_indices=True)
    G_w = G_w[iy, ix]; L_w = L_w[iy, ix]
    G_w = ndimage.gaussian_filter(G_w, 1.2)

    # 4. Retour à l'échelle publiée
    G_o = cv2.resize(G_w.astype(np.float32), (lo, ho), interpolation=cv2.INTER_LINEAR)
    L_o = cv2.resize(L_w.astype(np.uint8), (lo, ho), interpolation=cv2.INTER_NEAREST)

    # 5. La couleur : celle du château, modulée par le trait de la gravure rouge ; la racine commune à l'encre
    lum = rouge_o.astype(np.float32).mean(axis=2) / 255
    dans = alpha_o > 0.5
    lmin, lmax = np.percentile(lum[dans], [5, 95])
    ombre = np.clip((lum - lmin) / max(lmax - lmin, 1e-3), 0, 1)   # 0 = trait sombre
    pal = np.array([COULEURS[k] for k in ORDRE] + [ENCRE], np.float32) / 255
    # à l'approche de la jonction, la couleur du château se fond dans l'encre de la racine commune
    fusion = np.clip((G_o - 0.66) / 0.14, 0, 1)[..., None]
    fusion = fusion * fusion * (3 - 2 * fusion)
    base = pal[np.minimum(L_o, 2)] * (1 - fusion) + pal[3] * fusion
    base[L_o == 3] = pal[3]
    coul = base * (0.72 + 0.5 * ombre[..., None])
    coul = np.clip(coul, 0, 1)

    # un fin liseré couleur papier détache la racine des cailloux
    papier = np.median(fond_o[: ho // 10].reshape(-1, 3), axis=0) / 255
    halo = cv2.GaussianBlur(cv2.dilate(alpha_o, np.ones((5, 5), np.uint8)), (0, 0), 1.2) * 0.85
    a_tot = alpha_o + halo * (1 - alpha_o)
    rgb = (coul * alpha_o[..., None] + papier * (halo * (1 - alpha_o))[..., None]) / np.maximum(a_tot, 1e-4)[..., None]
    racines = np.dstack([np.clip(rgb * 255, 0, 255), np.clip(a_tot * 255, 0, 255)]).astype(np.uint8)
    racines[a_tot < 1 / 255] = 0

    # carte de pousse sur 8 bits : la page fond le front sur quelques centièmes, les marches de 1/255 ne se voient pas
    q = np.round(np.clip(G_o, 0, 1) * 254).astype(np.uint8)
    q[a_tot < 1 / 255] = 255
    carte = q

    # 6. Fichiers
    Image.fromarray(fond_o).save(SITE / f"assets/img/racine/planche-{nom}.jpg", quality=84, optimize=True, progressive=True)
    def uri(im, fmt, **kw):
        b = io.BytesIO(); im.save(b, fmt, **kw)
        return f"data:image/{fmt.lower()};base64," + base64.b64encode(b.getvalue()).decode()
    pied_xy = [(xs[k] / lw, ys[k] / hw) for k in pieds]
    infos = {
        "largeur": lo, "hauteur": ho,
        "racines": uri(Image.fromarray(racines, "RGBA"), "WEBP", quality=88, method=6),
        "pousse": uri(Image.fromarray(carte, "L"), "PNG", optimize=True),
        "pieds": [[round(float(x), 4), round(float(y), 4)] for x, y in pied_xy],
        "jonction": [round(float(xs[j] / lw), 4), round(float(ys[j] / hw), 4)],
        # là où la racine commune sort de la planche, en bas : le logo s'y accroche
        "sortie": round(float(np.nonzero(alpha_o[-ho // 30:] > 0.5)[1].mean() / lo), 4),
    }
    # aperçus de contrôle
    apercu = SOURCE / "apercus"; apercu.mkdir(exist_ok=True)
    for p in (0.35, 0.7, 1.0):
        vis = np.clip((p - q / 254) / 0.02, 0, 1) * (racines[..., 3] / 255)
        comp = fond_o * (1 - vis[..., None]) + racines[..., :3] * vis[..., None]
        Image.fromarray(comp.astype(np.uint8)).save(apercu / f"{nom}-{int(p * 100):03d}.jpg", quality=80)
    print(nom, (lo, ho), "pieds", infos["pieds"], "jonction", infos["jonction"], "sortie", infos["sortie"],
          f"racines {len(infos['racines']) // 1024} ko, pousse {len(infos['pousse']) // 1024} ko")
    return infos


def main():
    donnees = {nom: traiter(nom, cfg) for nom, cfg in FORMATS.items() if (SOURCE / f"planche-{nom}-rouge.png").exists()}
    js = ("/* Écrit par source/racine_planche.py : les racines recolorées et leur carte de pousse (data: URI, voir le script). */\n"
          "window.MIAILHE_RACINE = " + json.dumps(donnees, separators=(",", ":")) + ";\n")
    (SITE / "assets/js/racine-planche.js").write_text(js, encoding="utf-8")


if __name__ == "__main__":
    main()
