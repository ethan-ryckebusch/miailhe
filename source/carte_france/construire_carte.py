"""Écrit les données de la carte « Où trouver nos vins » (assets/js/carte-magasins.js), 28/10/2026.

Entrées, dans ce dossier :
  - departements.geojson : les 96 départements de métropole, version simplifiée de france-geojson (Grégoire David),
    d'après Admin Express de l'IGN, Licence ouverte Etalab ;
  - magasins_osm.json : les magasins des enseignes, écrit par releve_magasins.py (© OpenStreetMap, ODbL) ;
  - communes.json : le centre, le code postal et la population des communes (geo.api.gouv.fr, d'après l'INSEE et
    l'IGN, Licence ouverte), téléchargé le 28/10/2026 :
    https://geo.api.gouv.fr/communes?fields=nom,code,codesPostaux,centre,population,codeDepartement&format=json

Les départements sont projetés en Lambert-93 (la projection officielle de la France métropolitaine, écrite ici à la
main : ni pyproj ni shapely), en kilomètres, puis simplifiés (Douglas-Peucker) et écrits en tracés SVG que la page
dessine sur un canvas (Path2D). Chaque magasin est rangé dans son département (lancer de rayon ; à défaut, son code
postal, puis le département le plus proche). Les magasins gardent leur latitude et leur longitude : la page les projette
avec les mêmes formules (MIAILHE.lambert93), et s'en sert pour l'itinéraire et « Autour de moi ».
Un magasin sans ville dans OpenStreetMap (c'est fréquent) prend la commune dont le centre est le plus proche, marquée
« près de ». Les communes de métropole sont aussi écrites à part (assets/js/carte-communes.js, chargé seulement quand on
cherche) : on peut taper n'importe quelle commune, ou son code postal, et la carte montre les magasins les plus proches.
Les données sont dans des scripts, pas dans des fichiers JSON : le site s'ouvre aussi en file://, où fetch est bloqué.

    python3 source/carte_france/construire_carte.py
"""
import json
import math
import re
from pathlib import Path

ICI = Path(__file__).resolve().parent
SITE = ICI.parents[1]
TOLERANCE = .35        # km : la simplification des contours (la carte zoomée sur un département en a besoin)

# Lambert-93 (RGF93, ellipsoïde GRS80) : conique conforme sécante, parallèles 44° et 49°
A, E = 6378137.0, 0.0818191910428158
PHI1, PHI2, PHI0, LAM0 = map(math.radians, (44, 49, 46.5, 3))
X0, Y0 = 700000.0, 6600000.0


def _m(p):
    return math.cos(p) / math.sqrt(1 - (E * math.sin(p)) ** 2)


def _t(p):
    return math.tan(math.pi / 4 - p / 2) / ((1 - E * math.sin(p)) / (1 + E * math.sin(p))) ** (E / 2)


N = (math.log(_m(PHI1)) - math.log(_m(PHI2))) / (math.log(_t(PHI1)) - math.log(_t(PHI2)))
F = _m(PHI1) / (N * _t(PHI1) ** N)
RHO0 = A * F * _t(PHI0) ** N


def lambert93(lat, lon):
    rho = A * F * _t(math.radians(lat)) ** N
    th = N * (math.radians(lon) - LAM0)
    return X0 + rho * math.sin(th), Y0 + RHO0 - rho * math.cos(th)


# le cadre de la carte, en km Lambert-93 : la métropole et la Corse, avec un peu de marge
XMIN, XMAX, YMIN, YMAX = 90_000, 1_250_000, 6_030_000, 7_130_000


def km(lat, lon):
    x, y = lambert93(lat, lon)
    return round((x - XMIN) / 1000, 2), round((YMAX - y) / 1000, 2)


def rdp(pts, tol):
    if len(pts) < 3:
        return pts
    (ax, ay), (bx, by) = pts[0], pts[-1]
    n = math.hypot(bx - ax, by - ay) or 1e-12
    dmax, idx = 0, 0
    for i, (x, y) in enumerate(pts[1:-1], 1):
        d = abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / n
        if d > dmax:
            dmax, idx = d, i
    if dmax > tol:
        return rdp(pts[:idx + 1], tol)[:-1] + rdp(pts[idx:], tol)
    return [pts[0], pts[-1]]


def anneau(r):
    """Un anneau fermé simplifié en deux moitiés (son premier et son dernier point sont les mêmes)."""
    m = len(r) // 2
    s = rdp(r[:m + 1], TOLERANCE)[:-1] + rdp(r[m:], TOLERANCE)
    return s if len(s) >= 4 else r


def dedans(x, y, poly):
    c = False
    for i in range(len(poly)):
        (x1, y1), (x2, y2) = poly[i - 1], poly[i]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c


MARQUES = re.compile(r"centre commercial|hypermarch[ée]|supermarch[ée]|e\. ?leclerc|leclerc|carrefour( market)?|"
                     r"intermarch[ée]( super| hyper)?|auchan|v and b|\b(super|hyper|market)\b", re.I)


def nom_propre(nom):
    """Ce que le nom dit de plus que l'enseigne (« E. Leclerc - Coutras » → « Coutras ») ; vide sinon."""
    r = MARQUES.sub(" ", nom or "")
    r = re.sub(r"^[\s\-–·,:/|()]+|[\s\-–·,:/|()]+$", "", re.sub(r"\s+", " ", r))
    return r if len(r) >= 2 else ""


def communes():
    """Les communes de métropole : nom, codes postaux (séparés par des virgules), centre (lat, lon), population."""
    out = []
    for c in json.loads((ICI / "communes.json").read_text()):
        if not c.get("centre") or c["codeDepartement"].startswith("97"):
            continue
        lon, lat = c["centre"]["coordinates"]
        out.append((c["nom"], ",".join(c.get("codesPostaux") or []), lat, lon, c.get("population") or 0))
    return out


def code_postal(cp):
    """Le département d'un code postal (Corse : 200-201 = 2A, 202-206 = 2B)."""
    if not cp or len(cp) < 2 or not cp[:2].isdigit():
        return None
    if cp[:2] == "20":
        return "2A" if cp[:3] in ("200", "201") else "2B"
    return cp[:2]


def main():
    geo = json.loads((ICI / "departements.geojson").read_text())
    deps = []
    for f in sorted(geo["features"], key=lambda f: f["properties"]["code"]):
        g = f["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        anneaux = [[km(lat, lon) for lon, lat in r] for p in polys for r in p]
        exterieurs = [[km(lat, lon) for lon, lat in p[0]] for p in polys]
        simples = [anneau(r) for r in anneaux]
        d = "".join("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in r[:-1]) + "Z" for r in simples)
        xs = [x for r in anneaux for x, _ in r]
        ys = [y for r in anneaux for _, y in r]
        deps.append({"code": f["properties"]["code"], "nom": f["properties"]["nom"], "d": d, "polys": exterieurs,
                     "boite": [round(min(xs), 1), round(min(ys), 1), round(max(xs), 1), round(max(ys), 1)]})
    index = {d["code"]: i for i, d in enumerate(deps)}

    source = json.loads((ICI / "magasins_osm.json").read_text())
    villes_fr = communes()
    cases = {}
    for v in villes_fr:   # une grille de 0,1° pour trouver vite la commune la plus proche
        cases.setdefault((int(v[2] * 10), int(v[3] * 10)), []).append(v)

    def plus_proche(lat, lon):
        i, j = int(lat * 10), int(lon * 10)
        l = [v for a in range(i - 1, i + 2) for b in range(j - 1, j + 2) for v in cases.get((a, b), [])]
        return min(l, key=lambda v: (v[2] - lat) ** 2 + ((v[3] - lon) * math.cos(math.radians(lat))) ** 2) if l else None

    formats = []
    magasins, hors = [], 0
    for m in source["magasins"]:
        x, y = km(m["lat"], m["lon"])
        dep = next((i for i, d in enumerate(deps) if any(dedans(x, y, p) for p in d["polys"])), None)
        if dep is None:
            dep = index.get(code_postal(m["cp"]))
        if dep is None:   # sur le trait de côte : le département dont le centre est le plus proche
            hors += 1
            dep = min(range(len(deps)), key=lambda i: (x - (deps[i]["boite"][0] + deps[i]["boite"][2]) / 2) ** 2
                      + (y - (deps[i]["boite"][1] + deps[i]["boite"][3]) / 2) ** 2)
        cle = (m["enseigne"], m["format"])
        if cle not in formats:
            formats.append(cle)
        ville, cp, pres = m["ville"], m["cp"], 0
        if not ville:
            v = plus_proche(m["lat"], m["lon"])
            if v:
                ville, cp, pres = v[0], "", 1
        magasins.append([m["lat"], m["lon"], formats.index(cle), dep, nom_propre(m["nom"]), ville, cp, m["rue"], pres])

    villes = [("Paris", 48.8566, 2.3522), ("Lyon", 45.764, 4.8357), ("Marseille", 43.2965, 5.3698),
              ("Bordeaux", 44.8378, -0.5792), ("Lille", 50.6292, 3.0573), ("Nantes", 47.2184, -1.5536),
              ("Strasbourg", 48.5734, 7.7521), ("Toulouse", 43.6047, 1.4442), ("Nice", 43.7102, 7.262),
              ("Rennes", 48.1173, -1.6778), ("Montpellier", 43.6108, 3.8767)]
    # les trois châteaux, à Saint-Seurin-de-Cadourne (positions indicatives)
    chateaux = [("coufran", 45.3006, -0.7806), ("verdignan", 45.2808, -0.7700), ("soudars", 45.2930, -0.7960)]

    donnees = {
        "cadre": [round((XMAX - XMIN) / 1000), round((YMAX - YMIN) / 1000)],
        "projection": {"xmin": XMIN, "ymax": YMAX},
        "departements": [[d["code"], d["nom"], d["d"], d["boite"]] for d in deps],
        "formats": [[e, f] for e, f in formats],
        "magasins": magasins,
        "villes": [[n, *km(la, lo)] for n, la, lo in villes],
        "chateaux": [[k, la, lo] for k, la, lo in chateaux],
        "source": "Points de vente : © les contributeurs d'OpenStreetMap (ODbL). Fond de carte : IGN Admin Express (Licence ouverte).",
    }
    js = ("/* La carte « Où trouver nos vins » de la boutique : départements de métropole projetés en Lambert-93 (km),\n"
          "   magasins des enseignes (latitude, longitude, format, département, nom, ville, code postal, rue, 1 si la ville\n"
          "   est seulement la commune la plus proche).\n"
          "   Écrit par source/carte_france/construire_carte.py : ne pas modifier à la main. */\n"
          f"window.MIAILHE_CARTE = {json.dumps(donnees, ensure_ascii=False, separators=(',', ':'))};\n")
    sortie = SITE / "assets/js/carte-magasins.js"
    sortie.write_text(js, encoding="utf-8")
    # les communes, pour la recherche : « nom;codes postaux;lat×1000;lon×1000;population », une par ligne, les plus
    # peuplées d'abord
    lignes = "\n".join(f"{n};{cp};{round(la * 1000)};{round(lo * 1000)};{p}" for n, cp, la, lo, p in
                        sorted(villes_fr, key=lambda v: -v[4]))
    (SITE / "assets/js/carte-communes.js").write_text(
        "/* Les communes de métropole (geo.api.gouv.fr, Licence ouverte) pour la recherche de la carte « Où trouver nos vins »,\n"
        "   chargées seulement quand on cherche. Écrit par source/carte_france/construire_carte.py. */\n"
        f"window.MIAILHE_COMMUNES = {json.dumps(lignes, ensure_ascii=False)};\n", encoding="utf-8")
    compte = {}
    for e, _ in formats:
        compte[e] = sum(1 for m in magasins if formats[m[2]][0] == e)
    print(f"{len(deps)} départements, {sum(d['d'].count('L') + d['d'].count('M') for d in deps)} points ; "
          f"{len(magasins)} magasins {compte} ; {hors} rangés au plus proche ; {sortie.stat().st_size // 1024} ko")


if __name__ == "__main__":
    main()
