"""Écrit les dictionnaires du site (assets/js/i18n/en.js, ja.js) à partir des traductions (27/10/2026).

Les traductions vivent dans source/i18n/en.json et ja.json ({clé française: traduction}) ; les morceaux traduits à part
(source/i18n/parts/<langue>-*.json) y sont fusionnés d'abord. Chaque traduction est vérifiée :
- mêmes balises que la clé (<0>…</0>, <1/>), chacune une fois : langue.js réutilise les éléments d'origine ;
- mêmes valeurs {0}, {1}… (les nombres et les noms que les scripts insèrent) ;
- pas vide, et en japonais, bien en japonais.
Puis il dit ce qui manque par rapport au relevé (source/i18n/cles.json, écrit par extraire.py).

    python3 source/i18n/construire.py                       # fusionne, vérifie, écrit les dictionnaires
    python3 source/i18n/construire.py --part parts/ja-b.json # vérifie un seul morceau (pour les traducteurs)
"""
import json
import re
import sys
from pathlib import Path

ICI = Path(__file__).resolve().parent
SITE = ICI.parents[1]
LANGUES = ["en", "ja"]
BALISE = re.compile(r"</?\d+/?>")
VALEUR = re.compile(r"\{\d+\}")
JAPONAIS = re.compile(r"[぀-ヿ㐀-鿿]")


def signature(s, motif):
    return sorted(motif.findall(s))


def probleme(cle, trad, langue):
    if not isinstance(trad, str) or not trad.strip():
        return "vide"
    if signature(cle, BALISE) != signature(trad, BALISE):
        return f"balises {signature(cle, BALISE)} → {signature(trad, BALISE)}"
    if signature(cle, VALEUR) != signature(trad, VALEUR):
        return f"valeurs {signature(cle, VALEUR)} → {signature(trad, VALEUR)}"
    texte = BALISE.sub(" ", cle)
    if langue == "ja" and len(re.findall(r"[a-zà-ÿ]{3,}", texte)) >= 3 and not JAPONAIS.search(trad):
        return "pas de japonais"
    # les balises doivent s'ouvrir et se fermer dans l'ordre
    pile = []
    for b in BALISE.findall(trad):
        if b.endswith("/>"):
            continue
        if b.startswith("</"):
            if not pile or pile.pop() != b[2:-1]:
                return "balises mal imbriquées"
        else:
            pile.append(b[1:-1])
    if pile:
        return "balise non fermée"
    return None


def morceaux(cle, trad):
    """Les phrases contenues dans une phrase traduite : le texte de chaque <n>…</n>, renuméroté à partir de 0.
    Quand un bloc se découpe en plusieurs (une rangée de liens), leurs traductions se retrouvent ainsi."""
    def contenus(s):
        out, pile = {}, []
        for m in re.finditer(r"<(/?)(\d+)(/?)>", s):
            if m.group(3):
                continue
            if not m.group(1):
                pile.append((m.group(2), m.end()))
            elif pile:
                n, debut = pile.pop()
                out[n] = s[debut:m.start()]
        return out
    ck, ct = contenus(cle), contenus(trad)
    for n, interieur in ck.items():
        if n not in ct:
            continue
        ordre = []
        for m in re.finditer(r"</?(\d+)/?>", interieur):
            if m.group(1) not in ordre:
                ordre.append(m.group(1))
        nouveau = {v: str(i) for i, v in enumerate(ordre)}
        renum = lambda s: re.sub(r"<(/?)(\d+)(/?)>", lambda m: f"<{m.group(1)}{nouveau.get(m.group(2), m.group(2))}{m.group(3)}>", s)
        k, t = renum(interieur).strip(), renum(ct[n]).strip()
        # les valeurs aussi repartent de {0}, dans leur ordre d'apparition dans la phrase française
        vals = list(dict.fromkeys(re.findall(r"\{(\d+)\}", k)))
        rv = {v: str(i) for i, v in enumerate(vals)}
        k = re.sub(r"\{(\d+)\}", lambda m: "{" + rv.get(m.group(1), m.group(1)) + "}", k)
        t = re.sub(r"\{(\d+)\}", lambda m: "{" + rv.get(m.group(1), m.group(1)) + "}", t)
        if k and t:
            yield k, t


def deriver(d, cles):
    """Les clés du relevé sans traduction, retrouvées à l'intérieur de phrases déjà traduites."""
    trouve = {}
    for k, v in d.items():
        for sk, sv in morceaux(k, v):
            trouve.setdefault(sk, sv)
    ajout = {k: trouve[k] for k in cles if k not in d and k in trouve}
    return ajout


def lire(p):
    return json.loads(p.read_text()) if p.exists() else {}


def verifier_part(chemin):
    p = (ICI / chemin) if not Path(chemin).is_absolute() else Path(chemin)
    langue = p.name.split("-")[0]
    d = lire(p)
    cles = {x["cle"] for x in json.loads((ICI / "cles.json").read_text())}
    source = ICI / "parts" / (p.stem.split("-", 1)[1] + ".json")
    attendues = [x["cle"] for x in json.loads(source.read_text())] if source.exists() else []
    erreurs = [(k, probleme(k, v, langue)) for k, v in d.items() if probleme(k, v, langue)]
    inconnues = [k for k in d if k not in cles]
    oubliees = [k for k in attendues if k not in d]
    for k, e in erreurs:
        print("ERREUR", e, "·", k[:90])
    for k in inconnues:
        print("CLÉ INCONNUE (recopiée de travers ?) ·", k[:90])
    for k in oubliees:
        print("OUBLIÉE ·", k[:90])
    print(f"{p.name} : {len(d)} traductions, {len(erreurs)} erreurs, {len(inconnues)} clés inconnues, {len(oubliees)} oubliées sur {len(attendues)}")
    return not (erreurs or inconnues or oubliees)


def construire():
    cles = [x["cle"] for x in json.loads((ICI / "cles.json").read_text())]
    (SITE / "assets/js/i18n").mkdir(parents=True, exist_ok=True)
    for langue in LANGUES:
        d = lire(ICI / f"{langue}.json")
        for part in sorted((ICI / "parts").glob(f"{langue}-*.json")):
            d.update(lire(part))
        # les {{0}} d'un premier relevé (valeurs doublées) redeviennent {0}
        d = {re.sub(r"\{\{(\d+)\}\}", r"{\1}", k): re.sub(r"\{\{(\d+)\}\}", r"{\1}", v) for k, v in d.items()}
        ajout = deriver(d, cles)
        if ajout:
            print(f"{langue} : {len(ajout)} traductions retrouvées dans des phrases plus longues")
            d.update(ajout)
        d = {k: d[k] for k in sorted(d, key=lambda k: (cles.index(k) if k in cles else 10 ** 6, k))}
        (ICI / f"{langue}.json").write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n")
        bons = {}
        for k, v in d.items():
            e = probleme(k, v, langue)
            if e:
                print(langue, "ERREUR", e, "·", k[:90])
            else:
                bons[k] = v
        manque = [k for k in cles if k not in bons]
        js = (f"/* Dictionnaire {langue} du site MIAILHE : écrit par source/i18n/construire.py, ne pas modifier à la main.\n"
              f"   Clé : la phrase française (voir langue.js) ; {len(bons)} traductions. */\n"
              f"window.MIAILHE_TRAD = window.MIAILHE_TRAD || {{}};\n"
              f"window.MIAILHE_TRAD.{langue} = {json.dumps(bons, ensure_ascii=False, separators=(',', ':'))};\n")
        (SITE / f"assets/js/i18n/{langue}.js").write_text(js)
        print(f"{langue} : {len(bons)} traductions écrites, {len(manque)} phrases du relevé sans traduction")
        for k in manque[:15]:
            print("   manque ·", k[:100])


if __name__ == "__main__":
    if "--part" in sys.argv:
        sys.exit(0 if verifier_part(sys.argv[sys.argv.index("--part") + 1]) else 1)
    construire()
