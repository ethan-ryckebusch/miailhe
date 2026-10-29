"""Le mixage des voix d'accueil (28/10/2026, v2 ; Verdignan v3 le même jour) : la voix de l'hôte sur l'ambiance de son château.

    python3 Site_MIAILHE/source/voix/mixer.py

Pour chaque château : l'ambiance (le son d'un film Kling 2.6 tourné depuis l'intérieur de sa porte, ambiance-*.m4a)
monte en 0,5 s, la voix (voix-*.mp3, ElevenLabs Voice Design) entre vers 0,7 s avec une légère réverbération du lieu
(l'ambiance s'efface sous elle),
puis tout s'éteint en 0,9 s. Volume final homogène (−16 LUFS mesurés, crête sous −1,5 dB), MP3 mono 128 kbit/s :
Site_MIAILHE/assets/audio/bienvenue-<château>.mp3.

Verdignan, 28/10/2026 (v3) : l'utilisateur trouvait que la voix et le son « sonnaient comme dans une piscine ». Deux
échos francs à 70 et 125 ms (au-delà de 50 ms, l'oreille les entend séparés) et une ambiance d'eau qui clapote (la
prise demandait une pièce réverbérante, une goutte d'eau et les mouettes de l'estuaire). La voix est maintenant sèche (un seul
reflet à 12 ms, très bas, celui d'une petite pièce en bois), et l'ambiance est refaite : la réserve des bouteilles,
des oiseaux au loin par la porte ouverte, et un seul petit coup de bois avant que Jean parle (COMPOSITIONS).
L'ancienne version est dans Archives/v2-verdignan-piscine/.
"""
import re
import subprocess
from pathlib import Path

ICI = Path(__file__).resolve().parent
SORTIE = ICI.parents[1] / "assets" / "audio"
QUEUE = .9            # après la phrase
CHATEAUX = {
    # château : (ambiance : début dans le film, sa sonie en LUFS, la voix étant à −17 ; entrée de la voix en s), réverbération du lieu (aecho)
    # le vestibule de 1925 : l'horloge qui bat, le feu ; une pièce, du bois
    "coufran":   ((1.0, -32, .7), "aecho=0.85:0.5:28|52:0.16|0.10"),
    # la réserve des bouteilles, au plus près : des oiseaux au loin par la porte, un coup de bois ; voix sèche,
    # un seul reflet très court (12 ms, −22 dB), sans écho audible
    "verdignan": ((5.6, -27, .7), "aecho=0.9:0.9:12:0.08"),
    # le chai : un bouchon qui saute, les oiseaux des vignes ; l'hôte parle juste après le bouchon
    "soudars":   ((0.2, -34, 1.0), "aecho=0.85:0.5:35|70:0.12|0.07"),
    # l'entrée du site (29/10/2026) : une femme d'une cinquantaine d'années, « Bienvenue dans notre famille », dehors
    # sur le domaine : les oiseaux au loin de l'ambiance de Verdignan, très bas ; voix sèche, un reflet de 12 ms
    "famille":   ((5.6, -33, .5), "aecho=0.9:0.9:12:0.05"),
}
# l'ambiance d'une clé qui n'a pas la sienne
AMBIANCES = {"famille": "verdignan"}


# Les ambiances composées : le son d'un film, plus de brefs accents pris dans une autre prise du même lieu
# château : (film de base, [(film, début, durée, placé à (s, dans le film de base), gain en dB)])
COMPOSITIONS = {
    # la prise c (oiseaux, pièce calme) et un petit coup de bois de la prise d, juste avant que Jean parle
    "verdignan": ("ambiances-films/verdignan-c.mp4", [("ambiances-films/verdignan-d.mp4", 3.22, .30, 5.83, -4)]),
}


def composer(c):
    """Écrit ambiance-<château>.m4a à partir de ses films (COMPOSITIONS)."""
    base, accents = COMPOSITIONS[c]
    entrees, graphe, voies = ["-i", str(ICI / base)], [], ["[0:a]"]
    for i, (film, debut, d, place, gain) in enumerate(accents, 1):
        entrees += ["-ss", str(debut), "-t", str(d), "-i", str(ICI / film)]
        graphe.append(f"[{i}:a]afade=t=in:d=0.01,afade=t=out:st={d - .08:.2f}:d=0.08,volume={gain}dB,"
                      f"adelay={int(place * 1000)}|{int(place * 1000)}[x{i}]")
        voies.append(f"[x{i}]")
    graphe.append(f"{''.join(voies)}amix=inputs={len(voies)}:duration=first:normalize=0")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *entrees, "-filter_complex", ";".join(graphe),
                    "-vn", "-c:a", "aac", "-b:a", "192k", str(ICI / f"ambiance-{c}.m4a")], check=True)


CIBLE = -16           # LUFS, les trois au même volume


def sonie(f):
    """La sonie intégrée d'un fichier (EBU R128), en LUFS."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(f), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True)
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)[-1])


def duree(f):
    """La durée d'un fichier, lue dans la sortie de ffmpeg (pas de ffprobe sur cette machine)."""
    r = subprocess.run(["ffmpeg", "-i", str(f)], capture_output=True, text=True)
    h, m, sec = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr).groups()
    return int(h) * 3600 + int(m) * 60 + float(sec)


def main():
    for c in COMPOSITIONS:
        composer(c)
    for c, ((debut, niveau, entree), echo) in CHATEAUX.items():
        voix, amb = ICI / f"voix-{c}.mp3", ICI / f"ambiance-{AMBIANCES.get(c, c)}.m4a"
        if not (voix.exists() and amb.exists()):
            print("manque", c); continue
        # la voix seule, sans ses silences
        dv = duree(voix)
        total = entree + dv + QUEUE
        filtre = (
            f"[0:a]silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.03,areverse,"
            f"silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.1,areverse,loudnorm=I=-17:TP=-3:LRA=11,{echo},"
            f"adelay={int(entree * 1000)}|{int(entree * 1000)},aresample=44100,asplit=2[v][vc];"
            f"[1:a]atrim=start={debut},asetpts=PTS-STARTPTS,highpass=f=70,loudnorm=I={niveau}:TP=-8:LRA=11,"
            f"aresample=44100[a0];"
            # l'ambiance s'efface d'environ 8 dB pendant que l'hôte parle, et revient après (comme au cinéma)
            f"[vc]apad=whole_dur=20[vcp];[a0][vcp]sidechaincompress=threshold=0.012:ratio=6:attack=25:release=450:makeup=1[a];"
            f"[a][v]amix=inputs=2:duration=first:normalize=0,atrim=duration={total:.2f},"
            f"afade=t=in:d=0.5,afade=t=out:st={total - QUEUE:.2f}:d={QUEUE}"
        )
        brut, cible = ICI / f".mix-{c}.wav", SORTIE / f"bienvenue-{c}.mp3"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(voix), "-i", str(amb), "-filter_complex", filtre,
                        "-ac", "1", "-ar", "44100", "-c:a", "pcm_f32le", str(brut)], check=True)
        # le volume final, mesuré puis appliqué d'un bloc (loudnorm en un seul passage manquait la cible sur des sons
        # aussi courts : Coufran sortait à −17,2 LUFS, Verdignan à −14,9), puis un limiteur pour la crête
        # (deux passes : le limiteur et l'encodage MP3 retirent encore quelques dixièmes)
        gain = CIBLE - sonie(brut)
        for _ in range(2):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(brut), "-af",
                            f"volume={gain:.2f}dB,alimiter=limit=0.84:attack=2:release=40:level=disabled",
                            "-ac", "1", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "128k", str(cible)], check=True)
            gain += CIBLE - sonie(cible)
        brut.unlink()
        print(f"{cible.name} : {duree(cible):.2f} s (voix {dv:.2f} s, entrée à {entree} s), {sonie(cible):.1f} LUFS")


if __name__ == "__main__":
    main()
