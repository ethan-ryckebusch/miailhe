"""La carte du Médoc, dans l'esprit de celle de privios.com/about.html : des traits fins pour les côtes et l'estuaire,
les appellations en aplats, quelques villes, et une bulle qui grossit Saint-Seurin-de-Cadourne sur les trois domaines.

Le tracé suit les vraies coordonnées (latitude, longitude) des côtes et des rives, simplifiées et lissées, en projection
équirectangulaire. Les contours des appellations et des domaines sont indicatifs.

Utilisée par generer_chateaux.py (page famille de chaque château, le château de la page mis en avant) ; écrit aussi
assets/img/carte-medoc.svg pour la vitrine :  python3 source/carte.py
"""
from pathlib import Path

LAT0, LON0, KY = 45.66, -1.30, 1000.0
KX = KY * 0.7046                      # cos(45,2°)
W, H = 600, 860

COTE = [(45.574, -1.064), (45.545, -1.095), (45.513, -1.125), (45.47, -1.148), (45.40, -1.162), (45.30, -1.168),
        (45.22, -1.172), (45.13, -1.183), (45.04, -1.197), (44.96, -1.211), (44.88, -1.224), (44.80, -1.236)]
RIVE_GAUCHE = [(45.574, -1.064), (45.56, -1.045), (45.535, -1.03), (45.50, -1.005), (45.465, -0.975), (45.43, -0.94),
               (45.40, -0.895), (45.37, -0.85), (45.335, -0.81), (45.30, -0.782), (45.26, -0.762), (45.225, -0.750),
               (45.19, -0.742), (45.15, -0.728), (45.11, -0.708), (45.07, -0.685), (45.035, -0.655), (45.00, -0.62),
               (44.97, -0.596), (44.93, -0.578), (44.89, -0.568), (44.86, -0.565), (44.80, -0.548)]
RIVE_DROITE = [(45.66, -0.985), (45.625, -1.035), (45.61, -1.00), (45.575, -0.97), (45.55, -0.94), (45.52, -0.89),
               (45.48, -0.82), (45.445, -0.775), (45.40, -0.73), (45.35, -0.70), (45.30, -0.68), (45.25, -0.67),
               (45.20, -0.665), (45.15, -0.66), (45.125, -0.665), (45.09, -0.645), (45.06, -0.61), (45.045, -0.575),
               (45.04, -0.53), (45.035, -0.48), (45.03, -0.45)]
BEC = [(45.015, -0.45), (45.02, -0.50), (45.025, -0.54), (45.03, -0.562), (45.00, -0.574), (44.95, -0.565),
       (44.90, -0.556), (44.86, -0.555), (44.80, -0.538)]
HAUT_MEDOC_TERRE = [(44.91, -0.70), (45.00, -0.78), (45.10, -0.86), (45.20, -0.90), (45.315, -0.905)]
MEDOC_TERRE = [(45.315, -0.93), (45.40, -1.04), (45.47, -1.09), (45.53, -1.09)]

VILLES = [("Royan", 45.622, -1.03, "d"), ("Soulac", 45.513, -1.125, "g"), ("Pauillac", 45.199, -0.748, "g"),
          ("Saint-Estèphe", 45.263, -0.773, "g"), ("Margaux", 45.04, -0.676, "g"), ("Blaye", 45.128, -0.66, "d"),
          ("Lacanau", 45.0, -1.20, "d"), ("Bordeaux", 44.84, -0.58, "g")]
SAINT_SEURIN = (45.29, -0.79)

# Les trois domaines dans la bulle (repère local 600 x 520, comme la carte d'avant), puis réduits
DOMAINES = {
    "coufran": ("M262 92C292 70 344 74 366 98C388 122 380 160 352 176C322 194 274 188 254 162C236 138 236 110 262 92Z", 308, 60),
    "verdignan": ("M356 236C380 220 418 226 430 250C442 276 428 304 400 312C372 320 344 304 340 280C336 262 340 246 356 236Z", 392, 342),
    "soudars": ("M196 356C214 342 244 344 254 362C264 380 252 402 230 406C208 410 186 398 184 380C182 370 186 362 196 356Z", 220, 334),
}
NOMS = {"coufran": "Coufran", "verdignan": "Verdignan", "soudars": "Soudars"}
COULEURS = {"coufran": "#a97d2e", "verdignan": "#0f4366", "soudars": "#0f320a"}


def xy(lat, lon):
    return (lon - LON0) * KX, (LAT0 - lat) * KY


def lisse(points, ferme=False):
    """Courbe de Catmull-Rom passant par les points, convertie en cubiques SVG."""
    p = [xy(*q) for q in points]
    if ferme:
        p = p + p[:3]
    d = f"M{p[0][0]:.1f} {p[0][1]:.1f}"
    for i in range(len(p) - (3 if ferme else 1)):
        p0 = p[i - 1] if i > 0 else p[i]
        p1, p2 = p[i], p[i + 1]
        p3 = p[i + 2] if i + 2 < len(p) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}"
    return d + ("Z" if ferme else "")


def suite(points):
    """Les points, sans le M : pour enchaîner plusieurs rives dans un même contour."""
    return lisse(points)[1:].split("C", 1)


STYLE = """<style>
.cm-terre{fill:var(--cm-terre,#ffffff)}.cm-eau{fill:var(--cm-eau,#e9eefb)}
.cm-trait{fill:none;stroke:var(--cm-trait,#16120f);stroke-width:1.1;stroke-linejoin:round;opacity:.75}
.cm-zone{fill:var(--cm-zone,#16120f);opacity:.07}.cm-zone--hm{opacity:.13}
.cm-label{font-family:"Circular",Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:.14em;text-transform:uppercase;fill:var(--cm-texte,#16120f)}
.cm-label--zone{font-size:11px;font-weight:500;letter-spacing:.3em;opacity:.55}
.cm-eau-label{font-family:"Canela","Cormorant Garamond",Georgia,serif;font-style:italic;font-size:17px;fill:var(--cm-texte,#16120f);opacity:.6}
.cm-ville{fill:var(--cm-texte,#16120f)}.cm-ici{fill:var(--cm-fort,#a97d2e)}
.cm-bulle{fill:var(--cm-terre,#ffffff);stroke:var(--cm-trait,#16120f);stroke-width:1.2}
.cm-lien{fill:none;stroke:var(--cm-trait,#16120f);stroke-width:1;stroke-dasharray:3 4;opacity:.7}
.cm-domaine{opacity:.95}.cm-domaine-nom{font-family:"Circular",Helvetica,Arial,sans-serif;font-size:19px;font-weight:500;letter-spacing:.12em;text-transform:uppercase}
.cm-route{fill:none;stroke:var(--cm-trait,#16120f);stroke-width:1.3;stroke-dasharray:3 6;opacity:.45}
.carte-medoc .cm-domaine:not(.cm-ici-domaine){opacity:.35}
</style>"""


def carte_medoc(ici=None):
    """Le SVG de la carte. ici = slug du château à mettre en avant (les deux autres en retrait), ou None (les trois égaux)."""
    # L'eau : rive gauche du nord au sud, rive droite de la Garonne et du bec d'Ambès, rive droite de l'estuaire vers le nord
    g = lisse(RIVE_GAUCHE)
    bec = lisse(list(reversed(BEC)))[1:]
    droite = lisse(list(reversed(RIVE_DROITE)))[1:]
    eau = f"{g}L{bec.split('C', 1)[0]}C{bec.split('C', 1)[1]}L{droite.split('C', 1)[0]}C{droite.split('C', 1)[1]}L{W} 0L{xy(45.66, -1.10)[0]:.1f} 0Z"
    terre_hm = lisse([q for q in RIVE_GAUCHE if 44.91 <= q[0] <= 45.315] + HAUT_MEDOC_TERRE, ferme=True)
    terre_m = lisse([q for q in RIVE_GAUCHE if q[0] >= 45.315][::-1] + MEDOC_TERRE[::-1], ferme=True)
    villes = []
    for nom, lat, lon, cote in VILLES:
        x, y = xy(lat, lon)
        dx, ancre = (-8, "end") if cote == "g" else (8, "start")
        villes.append(f'<circle class="cm-ville" cx="{x:.1f}" cy="{y:.1f}" r="2.4"/><text class="cm-label" x="{x + dx:.1f}" y="{y + 3.5:.1f}" text-anchor="{ancre}">{nom}</text>')
    sx, sy = xy(*SAINT_SEURIN)
    bx, by, br = 168, 505, 122
    domaines = []
    for k, (dd, lx, ly) in DOMAINES.items():
        mis = " cm-ici-domaine" if (ici is None or k == ici) else ""
        domaines.append(f'<path class="cm-domaine{mis}" fill="{COULEURS[k]}" d="{dd}"/>'
                        f'<text class="cm-domaine-nom" fill="{COULEURS[k]}" x="{lx}" y="{ly}" text-anchor="middle">{NOMS[k]}</text>')
    aria = "Carte du Médoc : les trois domaines de la famille Miailhe à Saint-Seurin-de-Cadourne, au bord de l'estuaire de la Gironde"
    return f'''<svg class="carte-medoc" viewBox="0 0 {W} {H}" role="img" aria-label="{aria}">{STYLE}
  <defs><clipPath id="cm-clip"><circle cx="{bx}" cy="{by}" r="{br}"/></clipPath></defs>
  <path class="cm-eau" d="{eau}"/>
  <path class="cm-zone" d="{terre_m}"/><path class="cm-zone cm-zone--hm" d="{terre_hm}"/>
  <path class="cm-trait" d="{lisse(COTE)}"/><path class="cm-trait" d="{g}"/><path class="cm-trait" d="{lisse(RIVE_DROITE)}"/><path class="cm-trait" d="{lisse(BEC)}"/>
  <text class="cm-label cm-label--zone" x="{xy(45.44, -1.005)[0]:.0f}" y="{xy(45.44, -1.005)[1]:.0f}">Médoc</text>
  <text class="cm-label cm-label--zone" x="{xy(45.0, -0.80)[0]:.0f}" y="{xy(45.0, -0.80)[1]:.0f}" transform="rotate(-58 {xy(45.0, -0.80)[0]:.0f} {xy(45.0, -0.80)[1]:.0f})">Haut-Médoc</text>
  <text class="cm-eau-label" x="{xy(45.52, -0.985)[0]:.0f}" y="{xy(45.52, -0.985)[1]:.0f}" transform="rotate(52 {xy(45.52, -0.985)[0]:.0f} {xy(45.52, -0.985)[1]:.0f})">Estuaire de la Gironde</text>
  <text class="cm-eau-label" x="{xy(45.30, -1.25)[0]:.0f}" y="{xy(45.30, -1.25)[1]:.0f}" transform="rotate(-90 {xy(45.30, -1.25)[0]:.0f} {xy(45.30, -1.25)[1]:.0f})">Océan Atlantique</text>
  {"".join(villes)}
  <path class="cm-lien" d="M{sx:.1f} {sy:.1f}L{bx + br * .62:.1f} {by - br * .79:.1f}"/>
  <circle class="cm-ici" cx="{sx:.1f}" cy="{sy:.1f}" r="5"/>
  <text class="cm-label" x="{sx - 9:.1f}" y="{sy - 9:.1f}" text-anchor="end" font-weight="500">Saint-Seurin-de-Cadourne</text>
  <circle class="cm-bulle" cx="{bx}" cy="{by}" r="{br}"/>
  <g clip-path="url(#cm-clip)"><g transform="translate({bx} {by}) scale(.5) translate(-318 -236)">
    <path class="cm-eau" d="M372 -40H660V560H572C548 430 516 352 476 286C444 232 410 150 372 -40Z"/>
    <path class="cm-trait" d="M372 -40C410 150 444 232 476 286C516 352 548 430 572 560"/>
    <path class="cm-route" d="M120 20C200 140 300 220 320 300S300 440 330 540"/>
    {"".join(domaines)}
    <circle class="cm-ville" cx="306" cy="226" r="5"/><text class="cm-label" x="294" y="231" text-anchor="end" font-size="15">Le village</text>
  </g></g>
</svg>'''


if __name__ == "__main__":
    sortie = Path(__file__).resolve().parent.parent / "assets/img/carte-medoc.svg"
    svg = carte_medoc().replace('class="carte-medoc"', 'xmlns="http://www.w3.org/2000/svg" class="carte-medoc"', 1)
    sortie.write_text(svg + "\n", encoding="utf-8")
    print("écrit", sortie)
