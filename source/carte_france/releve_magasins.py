"""Relève les magasins où trouver les vins de la famille, pour la carte « Où trouver nos vins » de la boutique
(28/10/2026, demande de l'utilisateur : « une très grande carte de France interactive "Où trouver nos vins" et des
points pour chaque vin. Grande distribution Verdignan / Coufran : Auchan, Intermarché, Leclerc, Carrefour. Soudars :
V and B »).

Données © les contributeurs d'OpenStreetMap, ODbL. Relevé avec l'API Overpass (overpass-api.de : envoyer un
User-Agent, le serveur refuse les requêtes anonymes ; la France est coupée en bandes de latitude pour ne pas
dépasser le délai du serveur). Ce sont TOUS les magasins de ces enseignes : la liste réelle des magasins qui
référencent les vins doit venir de la famille.

Ce qu'on garde (France métropolitaine et Corse) :
  - grande distribution (Coufran et Verdignan) : shop=supermarket des enseignes E.Leclerc, Carrefour et Carrefour
    Market, Intermarché (Super, Hyper), Auchan et Auchan Supermarché ; pas les formats de proximité (City, Express,
    Contact, Montagne, My Auchan) ni les drives, les stations ou les galeries ;
  - Soudars : les caves V and B (shop=alcohol, wine ou beverages).
Un magasin relevé deux fois (le point et le contour du bâtiment) est gardé une fois : même enseigne à moins de 150 m.

    python3 source/carte_france/releve_magasins.py <dossier vide>   # télécharge les bandes, puis écrit magasins_osm.json
    python3 source/carte_france/releve_magasins.py <dossier>        # relit les bandes déjà téléchargées
"""
import json
import math
import re
import subprocess
import sys
import time
from pathlib import Path

ICI = Path(__file__).resolve().parent
OVERPASS = "https://overpass-api.de/api/interpreter"
AGENT = "MIAILHE-maquette-etudiante/1.0 (carte des points de vente)"
BANDES = [(41.3, 43.5), (43.5, 45.5), (45.5, 47.3), (47.3, 49.0), (49.0, 51.2)]

REQUETE = """[out:json][timeout:240];
area["ISO3166-1"="FR"][admin_level=2]->.fr;
(
  nwr["shop"="supermarket"]["brand"~"Leclerc|Auchan|Carrefour|Intermarch",i](area.fr)({s},-5.3,{n},9.7);
  nwr["shop"~"^(alcohol|wine|beverages)$"]["brand"~"^V ?(and|&) ?B$",i](area.fr)({s},-5.3,{n},9.7);
  nwr["shop"~"^(alcohol|wine|beverages)$"]["name"~"^V ?(and|&) ?B",i][!"brand"](area.fr)({s},-5.3,{n},9.7);
);
out center tags;"""

# l'enseigne affichée, à partir de la marque OSM ; None = format écarté
EXCLUS = re.compile(r"drive|express|city|contact|montagne|bio|my auchan|piéton|relais|proxi", re.I)
# ce que la marque couvre aussi, et qui n'est pas le magasin (un nom mal étiqueté en supermarché)
AUTRE = re.compile(r"espace culturel|culturel|sport|parapharm|brico|jardi|station|carburant|optique|voyage|auto|"
                   r"location|cafét|restaurant|galerie|services|pressing|traiteur|bijou|"
                   r"netto|casino|super u|leader price|lidl|aldi|spar|monoprix|franprix", re.I)   # une autre enseigne dans le nom


def enseigne(tags):
    marque = tags.get("brand") or tags.get("name") or ""
    if re.match(r"^V ?(and|&) ?B", marque, re.I):
        return "vandb"
    nom = tags.get("name", "")
    # le nom aussi : « Carrefour Contact » étiqueté Carrefour, « Super U (ex Carrefour Market) » qui a changé d'enseigne
    if tags.get("shop") != "supermarket" or EXCLUS.search(marque) or EXCLUS.search(nom) or AUTRE.search(nom) or re.search(r"\(ex\b|\bex[- ]", nom, re.I):
        return None
    if re.search(r"leclerc", marque, re.I):
        return "leclerc"
    if re.fullmatch(r"Carrefour( Market)?", marque, re.I):
        return "carrefour"
    if re.fullmatch(r"Intermarch[ée]( Super| Hyper)?", marque, re.I):
        return "intermarche"
    if re.fullmatch(r"Auchan( Supermarch[ée])?", marque, re.I):
        return "auchan"
    return None


def format_magasin(ens, tags):
    """Le format, écrit toujours de la même façon (« E. Leclerc », « Centre commercial E.Leclerc » → « E.Leclerc »)."""
    marque = (tags.get("brand") or tags.get("name") or "").lower()
    if ens == "leclerc":
        return "E.Leclerc"
    if ens == "carrefour":
        return "Carrefour Market" if "market" in marque else "Carrefour"
    if ens == "intermarche":
        return "Intermarché Hyper" if "hyper" in marque else "Intermarché Super" if "super" in marque else "Intermarché"
    if ens == "auchan":
        return "Auchan Supermarché" if "supermarch" in marque else "Auchan"
    return "V and B"


def telecharger(dossier):
    """Les bandes de latitude, par curl (le Python du système échoue à la poignée de main TLS d'overpass-api.de)."""
    for i, (s, n) in enumerate(BANDES):
        f = dossier / f"bande_{i}.json"
        for essai in range(4):
            if f.exists() and f.stat().st_size > 1000 and f.read_bytes()[:1] == b"{":
                break
            r = subprocess.run(["curl", "-s", "-m", "300", "-A", AGENT, "--data-urlencode", "data=" + REQUETE.format(s=s, n=n),
                                OVERPASS, "-o", str(f)])
            if r.returncode or not f.exists() or f.read_bytes()[:1] != b"{":   # serveur occupé : on attend et on recommence
                print(f"bande {i} : pas de réponse, nouvel essai")
                f.unlink(missing_ok=True)
                time.sleep(30 * (essai + 1))
        if not f.exists():
            sys.exit(f"bande {i} : Overpass ne répond pas, relancer plus tard")
        print(f"bande {i} ({s}-{n}) : {f.stat().st_size // 1024} ko")


def distance(a, b):
    dy = (a["lat"] - b["lat"]) * 111320
    dx = (a["lon"] - b["lon"]) * 111320 * math.cos(math.radians(a["lat"]))
    return math.hypot(dx, dy)


def rue(t):
    r = " ".join(x for x in (t.get("addr:housenumber"), t.get("addr:street")) if x)
    return r or t.get("addr:place", "")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    dossier = Path(sys.argv[1])
    dossier.mkdir(parents=True, exist_ok=True)
    telecharger(dossier)

    vus, magasins = {}, []
    for f in sorted(dossier.glob("bande_*.json")):
        for e in json.loads(f.read_text())["elements"]:
            t = e.get("tags", {})
            ens = enseigne(t)
            if not ens:
                continue
            pos = e.get("center") or e
            if "lat" not in pos:
                continue
            m = {"enseigne": ens, "format": format_magasin(ens, t), "nom": t.get("name", ""),
                 "ville": t.get("addr:city", ""), "cp": t.get("addr:postcode", ""), "rue": rue(t),
                 "lat": round(pos["lat"], 5), "lon": round(pos["lon"], 5), "osm": f"{e['type']}/{e['id']}"}
            if m["osm"] in vus:   # les bandes se touchent : un magasin peut tomber dans deux
                continue
            # le même magasin relevé en point et en bâtiment : on garde la fiche la plus complète
            double = next((x for x in magasins if x["enseigne"] == ens and distance(x, m) < 150), None)
            if double:
                for k in ("ville", "cp", "rue", "nom"):
                    double[k] = double[k] or m[k]
                vus[m["osm"]] = double
                continue
            vus[m["osm"]] = m
            magasins.append(m)

    magasins.sort(key=lambda m: (m["enseigne"], m["cp"], m["ville"]))
    compte = {}
    for m in magasins:
        compte[m["enseigne"]] = compte.get(m["enseigne"], 0) + 1
    sortie = {"source": "© les contributeurs d'OpenStreetMap, ODbL (relevé Overpass du 28/10/2026)",
              "magasins": magasins}
    (ICI / "magasins_osm.json").write_text(json.dumps(sortie, ensure_ascii=False, indent=0), encoding="utf-8")
    print(len(magasins), "magasins :", compte)


if __name__ == "__main__":
    main()
