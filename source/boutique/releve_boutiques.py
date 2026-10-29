"""Le relevé des deux anciennes boutiques en ligne des châteaux (28/10/2026), pour la boutique commune de miailhe.com.

Demande de l'utilisateur : supprimer les boutiques existantes et en recréer une seule qui unit les trois châteaux sur
notre site, avec les mêmes produits et les mêmes tarifs. Les deux boutiques (WooCommerce) :
  www.coufran-verdignan.com        Coufran et Verdignan (bouteilles de 75 cl, par carton de 6)
  boutique.chateausoudars.com      Soudars (bouteilles de 75 cl par caisse de 6, doubles magnums à l'unité)
Le script lit leurs pages de catégories et la fiche de chaque produit (prix, contenance, conditionnement, stock), puis
écrit source/boutique/catalogue.json (le relevé daté, avec ses sources) et assets/js/boutique-catalogue.js (ce que lit
la page boutique.html). Les prix sont TTC, à la bouteille, tels qu'affichés. Si une boutique ne répond plus, le
relevé précédent est gardé : relancer le script quand les tarifs changent, puis vérifier le résumé qu'il affiche.

    python3 source/boutique/releve_boutiques.py
"""
import datetime
import html
import json
import re
import urllib.request
from pathlib import Path

ICI = Path(__file__).resolve().parent
SITE = ICI.parents[1]
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
CATEGORIES = [
    ("coufran", "bouteille", "https://www.coufran-verdignan.com/categorie-produit/chateau-coufran/"),
    ("verdignan", "bouteille", "https://www.coufran-verdignan.com/categorie-produit/chateau-verdignan/"),
    ("soudars", "bouteille", "https://boutique.chateausoudars.com/categorie-produit/nos-caisses-chateau-soudars/"),
    ("soudars", "double-magnum", "https://boutique.chateausoudars.com/categorie-produit/nos-doubles-magnum/"),
]
# Les conditions de livraison des deux boutiques (pages « Livraison », identiques mot pour mot sur les deux sites,
# sauf le double magnum, propre à Soudars)
LIVRAISON = {
    "sources": ["https://www.coufran-verdignan.com/livraison/", "https://boutique.chateausoudars.com/livraison/"],
    "forfait_6_bouteilles": 30,
    "gratuite_des_bouteilles": 12,
    "gratuite_avec_double_magnum": True,
    "zone": "France métropolitaine (Corse : sur demande, par téléphone ou par e-mail)",
    "delai": "10 à 12 jours ouvrés après réception de la commande",
    "changement_adresse": 15,
}


def lire(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "fr-FR,fr"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def prix(s):
    return float(s.replace("\xa0", "").replace(" ", "").replace(".", "").replace(",", "."))


def fiche(url):
    """La fiche produit : contenance, conditionnement et prix de chaque variante, ou le prix du produit simple."""
    t = lire(url)
    variantes = []
    m = re.search(r'data-product_variations="([^"]*)"', t)
    if m and m.group(1) not in ("false", ""):
        for v in json.loads(html.unescape(m.group(1))):
            a = v.get("attributes", {})
            variantes.append({"contenance": a.get("attribute_pa_contenance"), "conditionnement": a.get("attribute_pa_conditionnement"),
                              "prix": v.get("display_price"), "actif": v.get("variation_is_active") and v.get("is_in_stock", True)})
    texte = html.unescape(re.sub(r"<[^>]+>", " ", t))
    contenance = re.search(r"(\d+(?:[.,]\d+)?)\s*(cl|CL|l|L)\b", texte)
    caisse = re.search(r"(?:caisse|carton)s? de (\d+)", texte, re.I)
    return {"variantes": variantes, "caisse": int(caisse.group(1)) if caisse else None,
            "rupture": "out-of-stock" in t or "Rupture de stock" in t}


def releve():
    produits = []
    for chateau, forme, url in CATEGORIES:
        t = lire(url)
        for li in re.findall(r'<li[^>]*class="([^"]*\bproduct\b[^"]*)"[^>]*>(.*?)</li>', t, re.S):
            classes, corps = li
            nom = re.search(r'woocommerce-loop-product__title[^>]*>(.*?)</h2>', corps, re.S)
            p = re.search(r'woocommerce-Price-amount amount">(?:<bdi>)?([\d\s.,\xa0]+)', corps)
            lien = re.search(r'href="([^"]+/produit/[^"]+)"', corps)
            if not (nom and p and lien):
                continue
            nom = " ".join(html.unescape(re.sub(r"<[^>]+>", "", nom.group(1))).split())
            an = re.search(r"(19|20)\d\d", nom)
            f = fiche(lien.group(1))
            produits.append({
                "chateau": chateau, "forme": forme, "nom_boutique": nom, "millesime": int(an.group(0)) if an else None,
                "vin": "n2" if re.search(r"\bN\s*°?\s*2\b", nom, re.I) else "grand-vin",
                "prix": prix(p.group(1)), "stock": "outofstock" not in classes and not f["rupture"],
                "variantes": f["variantes"], "caisse": f["caisse"], "source": lien.group(1),
            })
    return produits


def main():
    sortie = ICI / "catalogue.json"
    try:
        produits = releve()
        data = {"releve": datetime.date.today().isoformat(), "sources": [u for _, _, u in CATEGORIES],
                "livraison": LIVRAISON, "produits": produits}
        sortie.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    except Exception as e:      # boutique fermée ou injoignable : on garde le relevé précédent
        print("relevé impossible :", e, "→ on garde", sortie.name)
        data = json.loads(sortie.read_text())
    js = ("/* Le catalogue de la boutique commune (boutique.html) : écrit par source/boutique/releve_boutiques.py, ne pas\n"
          "   modifier à la main. Mêmes produits et mêmes prix (TTC, à la bouteille) que les anciennes boutiques des\n"
          f"   châteaux, relevés le {data['releve']}. */\n"
          f"window.MIAILHE_BOUTIQUE = {json.dumps(data, ensure_ascii=False, separators=(',', ':'))};\n")
    (SITE / "assets/js/boutique-catalogue.js").write_text(js)
    for k in ("coufran", "verdignan", "soudars"):
        for forme in ("bouteille", "double-magnum"):
            ps = [p for p in data["produits"] if p["chateau"] == k and p["forme"] == forme]
            if ps:
                print(f"{k} {forme} : {len(ps)} produits · " + ", ".join(f"{p['millesime']}{' N°2' if p['vin'] == 'n2' else ''} {p['prix']:.2f} €{'' if p['stock'] else ' (rupture)'}" for p in ps))
    print("relevé du", data["releve"], ":", len(data["produits"]), "produits")


if __name__ == "__main__":
    main()
