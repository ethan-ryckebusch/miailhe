"""Le montage des trois films de portes pour la vitrine (27/10/2026, cinquième version).

Chaque porte est tournée en deux plans (voir source/videos-originales/portes/BIBLE_DE_TOURNAGE.md) :
  <château>-ouverture.mp4   la caméra fixe, les battants s'ouvrent ;
  <château>-travelling.mp4  les battants ouverts, la caméra avance et franchit le seuil.
Le script les met bout à bout (même cadence, même taille, sans le son), puis écrit pour le site :
  assets/video/porte-<château>.mp4 et .webm   une image clé toutes les 8 images pendant l'ouverture, pour que la
                                             lecture à l'envers (quand on quitte une porte) reste fluide ; le
                                             travelling, jamais lu à l'envers, en a moins (le fichier reste léger) ;
  assets/img/portes/<château>-fermee.jpg      la première image (l'affiche du film) ;
  assets/img/portes/<château>-ouverte.jpg     la dernière image de l'ouverture (sans film : la porte ouverte).
Il affiche la durée de l'ouverture : c'est l'attribut data-ouverture de la porte dans la vitrine (le survol s'y arrête).
Il mesure aussi la vitesse du travelling de chaque film (le grossissement apparent de la scène, image par image, en
OpenCV) et en déduit l'attribut data-travelling : la vitesse de lecture qui donne aux trois portes la même avance à
l'écran (demande de l'équipe, 27/10/2026 ; Coufran sert de référence, à TRAVELLING).
Les ouvertures sont calées l'une sur l'autre (demande de l'utilisateur, 28/10/2026 : « les portes doivent s'ouvrir à la
même vitesse ») : le script mesure, dans chaque film, quand les battants commencent et finissent de s'ouvrir (le degré
d'ouverture, image par image, dans le haut de l'embrasure, au-dessus des fleurs), puis recadre et accélère ou ralentit
légèrement l'ouverture pour que, dans les trois, la porte soit ouverte à 10 % à DEBUT et à 90 % DUREE secondes plus tard
(10 et 90 % plutôt que 0 et 100 : le grain et les herbes qui bougent faussent le tout début et la toute fin).
Les trois ouvertures durent alors OUVERTURE secondes : c'est le data-ouverture des trois portes.

    python3 source/monter_portes.py            (ffmpeg requis, ou FFMPEG=chemin)
"""
import json
import os
import subprocess
from pathlib import Path

ICI = Path(__file__).resolve().parent
SITE = ICI.parent
ORIG = ICI / "videos-originales" / "portes"
FF = os.environ.get("FFMPEG", "ffmpeg")
L, H = 720, 1280          # 9:16, assez pour une colonne élargie sur grand écran, et léger
CADENCE = 24
TRAVELLING = 1.7          # la vitesse de lecture du travelling de Coufran, la référence
DEBUT, DUREE, QUEUE = .6, 3.0, 1.3   # ouverte à 10 % à 0,6 s, à 90 % 3 s plus tard, puis 1,3 s pour finir et se poser
OUVERTURE = DEBUT + DUREE + QUEUE


def duree(f):
    out = subprocess.run([FF, "-hide_banner", "-i", str(f)], capture_output=True, text=True).stderr
    h, m, s = out.split("Duration: ")[1].split(",")[0].split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)


def degre_ouverture(mp4):
    """Le degré d'ouverture de la porte, image par image (0 fermée, 1 ouverte) : distance à la première image
    rapportée à la somme des distances à la première et à la dernière, dans le haut de l'embrasure (la porte occupe
    le milieu de l'image, de 24 à 74 % de la hauteur ; on reste au-dessus des fleurs et des herbes qui bougent)."""
    import cv2
    import numpy as np
    cap = cv2.VideoCapture(str(mp4))
    fps = cap.get(cv2.CAP_PROP_FPS)
    g = []
    while True:
        ok, im = cap.read()
        if not ok:
            break
        h, w = im.shape[:2]
        zone = im[int(h * .26):int(h * .58), int(w * .27):int(w * .73)]
        g.append(cv2.cvtColor(cv2.resize(zone, (160, 160)), cv2.COLOR_BGR2GRAY).astype(np.float32))
    a, b = g[0], g[-1]
    o = np.array([np.abs(x - a).mean() / (np.abs(x - a).mean() + np.abs(x - b).mean() + 1e-6) for x in g])
    return fps, np.maximum.accumulate(o)


def calage(mp4):
    """Le recadrage et la vitesse qui ouvrent la porte à 10 % à DEBUT et à 90 % à DEBUT + DUREE."""
    fps, o = degre_ouverture(mp4)
    t10, t90 = float((o >= .1).argmax() / fps), float((o >= .9).argmax() / fps)
    k = DUREE / (t90 - t10)                     # > 1 : on ralentit ; < 1 : on accélère
    debut = t10 - DEBUT / k                     # où commence la prise (négatif : on tient la première image)
    fin = t90 + QUEUE / k
    return {"t10": round(t10, 2), "t90": round(t90, 2), "k": round(k, 3), "debut": debut, "fin": fin,
            "ouvert_a_la_fin": round(float(o[min(len(o) - 1, int(fin * fps))]), 3)}


def avance(mp4, debut):
    """L'avance de la caméra pendant le travelling : le logarithme du grossissement de la scène par seconde de film,
    mesuré entre images voisines (ORB, similitude estimée par RANSAC)."""
    import math
    import cv2
    import numpy as np
    cap = cv2.VideoCapture(str(mp4))
    fps = cap.get(cv2.CAP_PROP_FPS)
    images, i = [], 0
    while True:
        ok, f = cap.read()
        if not ok:
            break
        if i / fps >= debut:
            images.append(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY))
        i += 1
    orb, total, pas = cv2.ORB_create(3000), 0.0, 3
    for j in range(0, len(images) - pas, pas):
        ka, da = orb.detectAndCompute(images[j], None)
        kb, db = orb.detectAndCompute(images[j + pas], None)
        if da is None or db is None:
            continue
        m = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True).match(da, db)
        if len(m) < 20:
            continue
        M, _ = cv2.estimateAffinePartial2D(np.float32([ka[x.queryIdx].pt for x in m]), np.float32([kb[x.trainIdx].pt for x in m]),
                                           method=cv2.RANSAC, ransacReprojThreshold=2.5)
        if M is not None:
            total += math.log(math.hypot(M[0, 0], M[1, 0]))
    return total / ((len(images) - 1) / fps)


def main():
    rapport = {}
    for k in ("coufran", "verdignan", "soudars"):
        a, b = ORIG / f"{k}-ouverture.mp4", ORIG / f"{k}-travelling.mp4"
        c = calage(a)
        print(k, "ouverture :", {x: c[x] for x in ("t10", "t90", "k", "ouvert_a_la_fin")})
        ouv = OUVERTURE
        debut, attente = max(0, c["debut"]), max(0, -c["debut"]) * c["k"]
        fin = min(c["fin"], duree(a))
        filtre = (f"[0:v]trim=start={debut:.3f}:end={fin:.3f},setpts=(PTS-STARTPTS)*{c['k']:.4f},fps={CADENCE},"
                  f"tpad=start_duration={attente:.3f}:start_mode=clone:stop_mode=clone:stop_duration=2,trim=duration={ouv:.3f},"
                  f"scale={L}:{H}:flags=lanczos,setsar=1,format=yuv420p[a];"
                  f"[1:v]fps={CADENCE},scale={L}:{H}:flags=lanczos,setsar=1,format=yuv420p[b];"
                  f"[a][b]concat=n=2:v=1:a=0[v]")
        mp4, webm = SITE / f"assets/video/porte-{k}.mp4", SITE / f"assets/video/porte-{k}.webm"
        # une image clé toutes les 8 images pendant l'ouverture, puis toutes les 48
        cles = ["-force_key_frames", f"expr:if(lt(t,{ouv + .1:.2f}),eq(mod(n,8),0),eq(mod(n,48),0))"]
        base = [FF, "-loglevel", "error", "-y", "-i", str(a), "-i", str(b), "-filter_complex", filtre, "-map", "[v]", "-an"]
        subprocess.run(base + cles + ["-c:v", "libx264", "-preset", "slow", "-crf", "27", "-g", "48", "-bf", "0",
                                      "-movflags", "+faststart", str(mp4)], check=True)
        subprocess.run(base + cles + ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-g", "48", "-row-mt", "1",
                                      "-deadline", "good", "-cpu-used", "2", str(webm)], check=True)
        # les affiches : la porte fermée (première image) et la porte ouverte (fin de l'ouverture)
        # (tirées de la prise originale en 2K, plus nettes que l'encodage web)
        for nom, t in (("fermee", 0), ("ouverte", max(0, ouv - .06))):
            subprocess.run([FF, "-loglevel", "error", "-y", "-ss", f"{t:.2f}", "-i", str(a), "-frames:v", "1",
                            "-vf", "scale=900:1600:flags=lanczos", "-q:v", "3",
                            str(SITE / f"assets/img/portes/{k}-{nom}.jpg")], check=True)
        rapport[k] = {"ouverture_s": round(ouv, 2), "total_s": round(duree(mp4), 2),
                      "mp4_Mo": round(mp4.stat().st_size / 1e6, 1), "webm_Mo": round(webm.stat().st_size / 1e6, 1)}
        print(k, rapport[k])
    print(json.dumps({k: v["ouverture_s"] for k, v in rapport.items()}))
    # la même avance à l'écran pour les trois travellings : data-travelling de chaque porte dans la vitrine
    try:
        vitesses = {k: avance(SITE / f"assets/video/porte-{k}.mp4", rapport[k]["ouverture_s"]) for k in rapport}
        print("data-travelling", json.dumps({k: round(TRAVELLING * vitesses["coufran"] / v, 2) for k, v in vitesses.items()}))
    except ImportError:
        print("(OpenCV absent : data-travelling non mesuré)")


if __name__ == "__main__":
    main()
