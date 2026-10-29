"""Tire de courtes boucles silencieuses des vrais films des domaines pour la vitrine.

Sources, à la racine du projet : « Château COUFRAN.mp4 » et « Château VERDIGNAN.mp4 » (films promotionnels des
châteaux, 1920 x 1080 en letterbox : l'image utile fait 1920 x 850 à partir de y = 114, les sous-titres anglais
sont dans la bande noire du bas). Le logo doré « CHÂTEAU COUFRAN » est incrusté en haut à droite de presque tous
les plans de Coufran (x 1737 à 1903) : chaque recadrage s'arrête avant. Verdignan n'a pas de logo.
Le relevé complet des plans et des sous-titres a servi à choisir les extraits ci-dessous (temps en secondes).

Sorties : assets/video/<nom>.mp4 et .webm (sans son) et assets/img/<nom>.jpg (image d'attente).
Lancer depuis Site_MIAILHE : python3 source/decouper_films.py  (ffmpeg requis, ou FFMPEG=chemin)
"""
import os
import subprocess
from pathlib import Path

ICI = Path(__file__).resolve().parent
SITE = ICI.parent
FILMS = {"coufran": SITE.parent / "Château COUFRAN.mp4", "verdignan": SITE.parent / "Château VERDIGNAN.mp4",
         "soudars": ICI / "videos-originales/soudars-film-original.mp4"}
FF = os.environ.get("FFMPEG", "ffmpeg")
LETTERBOX = "crop=1920:850:0:114"

# Boucles en portrait 4:5 (chapitres et galerie) : film, début, fin, x du recadrage 680 x 850, aller-retour
PORTRAITS = {
    "vitrine-coufran-ciel": ("coufran", 22.9, 26.0, 600, True),       # le château et son drapeau, en drone
    "vitrine-verdignan-ciel": ("verdignan", 16.5, 21.1, 380, True),   # la tour à flèche dans la lumière dorée
    "savoir-feuille": ("verdignan", 25.1, 28.0, 640, True),           # feuilles à contre-jour
    "savoir-grappe": ("verdignan", 47.5, 52.7, 800, False),           # grappes noires, puis le soleil
    "savoir-vendange": ("coufran", 53.9, 58.4, 620, False),           # la machine vide sa trémie, vue du ciel
    "savoir-cuvier": ("verdignan", 71.4, 73.1, 620, True),            # les raisins versés au ralenti
    "savoir-barrique": ("coufran", 68.3, 71.2, 560, True),            # la barrique Seguin Moreau
    "savoir-attente": ("coufran", 75.5, 80.2, 640, False),            # les millésimes qui attendent d'être prêts à boire
}
# Le film d'ouverture : les trois domaines vus du ciel, en fondus (Coufran et l'estuaire, Verdignan, Soudars)
OUVERTURE = [("coufran", 17.8, 21.0, "crop=1512:850:0:114"),
             ("verdignan", 16.5, 21.1, "crop=1512:850:204:114"),
             ("soudars", 0.0, 4.5, "")]
FONDU = .6


def ff(*args):
    subprocess.run([FF, "-v", "error", "-y", *args], check=True)


def encoder(entree, nom, filtre=None):
    """MP4 (H.264) + WebM (VP9) sans son, plus l'image d'attente."""
    vf = ["-vf", filtre] if filtre else []
    ff("-i", entree, "-an", *vf, "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-profile:v", "high",
       "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(SITE / f"assets/video/{nom}.mp4"))
    ff("-i", entree, "-an", *vf, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
       "-deadline", "good", "-cpu-used", "2", str(SITE / f"assets/video/{nom}.webm"))
    ff("-i", str(SITE / f"assets/video/{nom}.mp4"), "-frames:v", "1", "-q:v", "3", str(SITE / f"assets/img/{nom}.jpg"))


def portraits():
    tmp = ICI / "_tmp.mp4"
    for nom, (film, t0, t1, x, aller_retour) in PORTRAITS.items():
        base = f"{LETTERBOX},crop=680:850:{x}:0,scale=640:800:flags=lanczos,setsar=1,fps=25"
        if aller_retour:   # l'aller puis le retour : la boucle ne saute pas
            graphe = f"[0:v]trim={t0}:{t1},setpts=PTS-STARTPTS,{base},split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]"
        else:
            graphe = f"[0:v]trim={t0}:{t1},setpts=PTS-STARTPTS,{base}[v]"
        ff("-i", str(FILMS[film]), "-filter_complex", graphe, "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "14",
           "-preset", "fast", str(tmp))
        encoder(str(tmp), nom)
        print("  ", nom)
    tmp.unlink(missing_ok=True)


def ouverture():
    tmp = ICI / "_tmp.mp4"
    entrees, graphe, durees = [], [], []
    for k, (film, t0, t1, recadrage) in enumerate(OUVERTURE):
        entrees += ["-i", str(FILMS[film])]
        pre = f"{recadrage}," if recadrage else ""
        graphe.append(f"[{k}:v]trim={t0}:{t1},setpts=PTS-STARTPTS,{pre}scale=1440:810:force_original_aspect_ratio=increase:flags=lanczos,"
                      f"crop=1440:810,setsar=1,fps=25,format=yuv420p[p{k}]")
        durees.append(t1 - t0)
    courant, decalage = "p0", 0.0
    for k in range(1, len(OUVERTURE)):
        decalage += durees[k - 1] - FONDU
        graphe.append(f"[{courant}][p{k}]xfade=transition=fade:duration={FONDU}:offset={decalage:.2f}[x{k}]")
        courant = f"x{k}"
    total = sum(durees) - FONDU * (len(OUVERTURE) - 1)
    # un passage au noir aux deux bouts : la boucle respire au lieu de sauter
    graphe.append(f"[{courant}]fade=t=in:st=0:d=0.5,fade=t=out:st={total - .5:.2f}:d=0.5[v]")
    ff(*entrees, "-filter_complex", ";".join(graphe), "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "14",
       "-preset", "fast", str(tmp))
    encoder(str(tmp), "vitrine-estuaire")
    # l'image d'attente : le premier plan, sans le noir du début
    ff("-ss", "1", "-i", str(tmp), "-frames:v", "1", "-q:v", "3", str(SITE / "assets/img/vitrine-estuaire.jpg"))
    tmp.unlink(missing_ok=True)
    print("   vitrine-estuaire", f"{total:.1f} s")


def oenologue():
    """Éric Boissenot, œnologue conseil, dans l'entretien du film de Coufran (le logo et la bande noire coupés)."""
    ff("-ss", "113", "-i", str(FILMS["coufran"]), "-frames:v", "1",
       "-vf", f"{LETTERBOX},crop=680:850:150:0,scale=800:1000:flags=lanczos", "-q:v", "3",
       str(SITE / "assets/img/vitrine-oenologue.jpg"))


if __name__ == "__main__":
    ouverture()
    portraits()
    oenologue()
