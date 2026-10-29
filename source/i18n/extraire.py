"""Relève toutes les phrases du site à traduire (27/10/2026).

Ouvre chaque page dans Chromium en mode collecte (?lang=en&collecte : langue.js n'utilise aucun dictionnaire et note
chaque bloc de texte qu'il rencontre, avec sa clé exacte), joue ce que les scripts écrivent après coup (le test, les
portes, l'Enquête, les bouteilles, le formulaire de devis), puis ajoute les phrases des scripts et des attributs
data-* qui ne s'affichent qu'en cours de route. Les nombres deviennent {0}, {1}… (langue.js les remet en place).

Écrit source/i18n/cles.json : [{"cle": ..., "ou": [page, élément]}], dans l'ordre des pages.
Puis : traduire (en.json, ja.json), et python3 source/i18n/construire.py.

    python3 source/i18n/extraire.py            # toutes les pages
    python3 source/i18n/extraire.py --verifier # avec les dictionnaires : liste ce qui manque encore (MIAILHE.manquants)
"""
import asyncio
import json
import random
import re
import sys
import urllib.parse
from pathlib import Path

from playwright.async_api import async_playwright

SITE = Path(__file__).resolve().parents[2]
ICI = Path(__file__).resolve().parent
RACINE = SITE.as_uri() + "/"
VERIFIER = "--verifier" in sys.argv
LANGUES_VERIF = ["en", "ja"]

PAGES = ["★ MIAILHE Vitrine V1.html", "quiz.html", "enquete.html", "identite.html", "boutique.html", "compte.html",
         "tiktok.html", "facebook.html"]     # les deux réseaux (29/10/2026) ; instagram.html n'est pas traduite
for d in ["coufran", "verdignan", "soudars"]:
    PAGES += [f"{d}/{p.name}" for p in sorted((SITE / d).glob("*.html"))]

LETTRE = re.compile(r"[^\W\d_]")
NOMBRE = re.compile(r"(?<![<\/\w{])\d+(?:[.,]\d+)?(?![\w>\/}])", re.A)


def norm(s):
    s = re.sub(r"[     ]", " ", s).replace("’", "'").replace("…", "...")
    return re.sub(r"\s+", " ", s).strip()


def modele(cle):
    n = iter(range(100))
    return NOMBRE.sub(lambda m: "{%d}" % next(n), cle)


# ---------------------------------------------------------------- ce que les scripts écrivent en cours de route

def litteraux_js():
    """Les phrases écrites dans les scripts (messages, libellés) : chaînes en français."""
    out = []
    for f in ["enquete.js", "quiz.js", "vitrine.js", "chateau.js", "main.js", "histoire.js", "onglets.js", "reseaux.js"]:
        s = (SITE / "assets/js" / f).read_text()
        s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
        s = re.sub(r"(?m)^\s*//.*$", "", s)
        for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`", s):
            x = next(g for g in m.groups() if g is not None)
            if "${" in x or "<" in x or not LETTRE.search(x):
                continue
            x = x.replace("\\'", "'").replace('\\"', '"')
            if re.fullmatch(r"[\w\-.#:\[\]=>*,() /\"']+", x) and not re.search(r"[ ][a-zé]{2,} ", x) and " " not in x.strip():
                continue    # sélecteurs, classes, clés
            if re.search(r"^(\.|#|\[|data-|aria-|miailhe|is-|--)|\.(js|css|html|jpg|png|svg|mp4|webm)\b|https?:", x):
                continue
            if re.search(r"\b(uniform|varying|gl_\w+|void main|precision \w+p)\b", x):
                continue    # le shader de la planche (WebGL)
            if re.search(r"^\(.*:|cubic-bezier|:is\(|:not\(|\[data-|^[a-z]+(, [a-z]+)+$", x):
                continue    # requêtes média, courbes et sélecteurs CSS
            if not (" " in x.strip() or re.search(r"[À-ÿ]", x) or x[:1].isupper()):
                continue
            out.append((norm(x), f"script {f}"))
    return out


def attributs_data():
    """Les phrases rangées dans des attributs data-* (légendes des bouteilles, libellés des boutons)."""
    out = []
    for page in PAGES:
        s = (SITE / page).read_text()
        for m in re.finditer(r'\sdata-([\w-]+)="([^"]*)"', s):
            nom, v = m.groups()
            if nom in ("anime", "chateau", "armoirie", "forme", "logo-chateau", "lien", "aller-bouteille", "k", "i", "ouverture", "travelling", "facebook", "reseaux", "scripts", "boutique"):
                continue
            v = v.replace("&#x27;", "'").replace("&quot;", '"').replace("&amp;", "&")
            if LETTRE.search(v) and (" " in v or re.search(r"[À-ÿ]", v)) and not re.search(r"\.html|https?:|^#", v):
                out.append((norm(v), f"{page} @data-{nom}"))
    return out


# les messages dont le nombre change (enquete.js : compte())
MODELES = [
    ("{0} information sur {1} est juste. Comparez encore l'inventaire et le casier.", "script enquete.js (1 sur 3)"),
    ("{0} informations sur {1} sont justes. Comparez encore l'inventaire et le casier.", "script enquete.js (2 sur 3)"),
    ("Aucune information n'est juste. Comparez encore l'inventaire et le casier.", "script enquete.js"),
    ("{0} réponse sur {1} tient. Relisez les archives.", "script enquete.js (1 sur 6)"),
    ("{0} réponses sur {1} tiennent. Relisez les archives.", "script enquete.js (2 à 5 sur 6)"),
    ("Aucune réponse ne tient. Relisez les archives.", "script enquete.js"),
    ("<0>+</0><1>Un indice</1><2>{0} sur {1}</2>", "enquete.js : bouton des indices"),
    ("<0>+</0><1>Un indice plus facile</1><2>{0} sur {1}</2>", "enquete.js : bouton des indices"),
    ("<0>+</0><1>Le dernier indice, presque la réponse</1><2>{0} sur {1}</2>", "enquete.js : bouton des indices"),
    ("Un indice, indice {0} sur {1}", "enquete.js : bouton des indices @aria-label"),
    ("Un indice plus facile, indice {0} sur {1}", "enquete.js : bouton des indices @aria-label"),
    ("Le dernier indice, presque la réponse, indice {0} sur {1}", "enquete.js : bouton des indices @aria-label"),
    ("1er trimestre {0}", "enquete.js : trimestre du tirage"),
    ("{1}e trimestre {0}", "enquete.js : trimestre du tirage ({1} = 2, 3 ou 4 ; {0} = l'année)"),
    ("{0} et {1}", "enquete.js : liste de noms de châteaux"),
    ("Le château qui me ressemble : {0}, {1}. Et vous ?", "quiz.js : texte partagé ({0} = nom, {1} = surnom)"),
    ("Bouteille {0}", "chateau.js @aria-label"),
    ("Lettre {0}", "enquete.js : tuile de l'étape 6 @aria-label ({0} = une lettre de FRICHE)"),
    ("Encore {0} bouteilles et la livraison est offerte.", "compte.js : le panier"),
    ("Étape {0} sur 6", "compte.js : l'enquête en cours"),
]


# ---------------------------------------------------------------- les parcours

async def passer_age(pg):
    for sel in [".age-gate [data-entrer]", ".age .oui"]:
        b = pg.locator(sel)
        if await b.count() and await b.first.is_visible():
            await b.first.click()
            await pg.wait_for_timeout(500)


async def faire_test(pg, conteneur, essais=30):
    """Le test, joué au hasard jusqu'à avoir vu les trois résultats."""
    vus = set()
    for _ in range(essais):
        for sel in ["[data-commencer]", "[data-recommencer]"]:
            b = pg.locator(f"{conteneur} {sel}")
            if await b.count():
                await b.first.click()
                break
        await pg.wait_for_timeout(150)
        while await pg.locator(f"{conteneur} .reponse").count():
            n = await pg.locator(f"{conteneur} .reponse").count()
            await pg.locator(f"{conteneur} .reponse").nth(random.randrange(n)).click()
            await pg.wait_for_timeout(100)
        cle = await pg.evaluate(f"(document.querySelector('{conteneur} .resultat') || {{dataset: {{}}}}).dataset.chateau || null")
        if cle:
            vus.add(cle)
        if len(vus) >= 3:
            break
    return vus


async def parcours_boutique(pg):
    """La boutique (troisième version, 28/10/2026) : les deux espaces.
    Particuliers : chaque millésime de chaque vin sur sa frise (les notes des châteaux), un panier de 6 bouteilles
    (livraison payante), puis de 12 et un double magnum, les quantités, le retrait, la commande avec ses trois erreurs,
    le merci, le panier vide, le vin de votre année, la fiche d'un vin, la commande d'un client connecté.
    Professionnels : le rideau, l'offre, les onglets des millésimes prêts à boire, la demande de devis (un vin, la palette
    famille, l'erreur, le merci), puis le retour aux particuliers."""
    async def clic(sel, n=0):
        await pg.locator(sel).nth(n).click(force=True)
        # le panier glisse en 0,55 s : on attend qu'il soit posé avant d'y cliquer
        await pg.wait_for_timeout(700 if 'panier]' in sel and ('ouvrir' in sel or 'voir' in sel) else 150)
    await pg.evaluate("localStorage.removeItem('miailhe-panier'); localStorage.removeItem('miailhe-demande')")
    # tous les millésimes de tous les vins : la bouteille, l'année, la note et le prix changent
    for cle in await pg.evaluate("[...document.querySelectorAll('.bq-cuvee')].map(a => a.dataset.cuvee)"):
        for vid in await pg.evaluate(f"[...document.querySelectorAll('.bq-cuvee[data-cuvee=\"{cle}\"] [data-choisir]')].map(b => b.dataset.choisir)"):
            await clic(f'.bq-cuvee[data-cuvee="{cle}"] [data-choisir="{vid}"]')
            await pg.wait_for_timeout(260)
    art = '.bq-cuvee[data-cuvee="coufran-grand-vin-bouteille"]'
    await clic(art + ' [data-choisir="coufran-grand-vin-bouteille-2012"]')
    await pg.wait_for_timeout(400)
    await clic(art + " [data-plus]")
    await clic(art + " [data-moins]")
    await clic(art + " [data-ajouter]")
    await clic("[data-ouvrir-panier]")
    await pg.wait_for_timeout(300)
    await clic(".bq-panier [data-fermer-panier]")
    await clic('.bq-cuvee[data-cuvee="coufran-n2-bouteille"] [data-plus]')
    await clic('.bq-cuvee[data-cuvee="coufran-n2-bouteille"] [data-ajouter]')
    dm = '.bq-cuvee[data-cuvee="soudars-grand-vin-double-magnum"]'
    await clic(dm + ' [data-choisir="soudars-grand-vin-double-magnum-1982"]')
    await pg.wait_for_timeout(400)
    await clic(dm + " [data-plus]")
    await clic(dm + " [data-ajouter]")
    await clic("[data-ouvrir-panier]")
    await clic(".bq-ligne [data-plus]")
    await clic(".bq-ligne [data-moins]")
    await clic("[data-commander]")
    await clic(".bq-valider")
    await pg.fill("[data-commande] [name=prenom]", "Camille")
    await pg.fill("[data-commande] [name=nom]", "Durand")
    await pg.fill("[data-commande] [name=email]", "camille@example.com")
    await pg.fill("[data-commande] [name=adresse]", "3 rue des Vignes")
    await pg.fill("[data-commande] [name=ville]", "Saint-Seurin")
    await pg.fill("[data-commande] [name=cp]", "331")
    await clic(".bq-valider")
    await pg.fill("[data-commande] [name=cp]", "33180")
    await clic(".bq-valider")
    await pg.check("[data-commande] [name=age]")
    await pg.check("[data-commande] [name=cgv]")
    await clic(".bq-valider")
    await pg.wait_for_timeout(300)
    await clic("[data-merci] [data-fermer-panier]")
    await clic("[data-ouvrir-panier]")
    await clic("[data-retour-panier]") if await pg.locator("[data-commande]:not([hidden])").count() else None
    while await pg.locator(".bq-ligne [data-retirer]").count():
        await clic(".bq-ligne [data-retirer]")
    await pg.wait_for_timeout(200)
    await pg.keyboard.press("Escape")
    # le vin de votre année : une année à un vin, une à plusieurs, puis « Voir dans la cave »
    for a in ["1982", "1996", "2005", "2016"]:
        await clic(f'[data-annee="{a}"]')
        await pg.wait_for_timeout(200)
    await clic(".bq-annee-vin [data-voir-cave]")
    await pg.wait_for_timeout(600)
    # la fiche d'un vin (avec et sans note du château)
    for cle in ["coufran-grand-vin-bouteille", "soudars-grand-vin-double-magnum", "verdignan-n2-bouteille"]:
        await clic(f'.bq-cuvee[data-cuvee="{cle}"] .bq-cuvee-detail [data-fiche]')
        await pg.wait_for_timeout(300)
        await clic("[data-fiche-panneau] [data-fermer-fiche]")
    # la commande d'un client connecté : ses coordonnées reprises de l'espace client
    await pg.evaluate("localStorage.setItem('miailhe-client', JSON.stringify({prenom:'Camille', nom:'Durand', email:'camille@example.com', adresse:{rue:'3 rue des Vignes', cp:'33180', ville:'Saint-Seurin'}}))")
    await clic(art + " [data-ajouter]")
    await clic("[data-ouvrir-panier]")
    await clic("[data-commander]")
    await pg.wait_for_timeout(300)
    await pg.keyboard.press("Escape")
    await pg.evaluate("localStorage.removeItem('miailhe-client'); localStorage.removeItem('miailhe-panier')")
    # le coffret des trois générations : une bouteille, la famille choisit les autres, la gravure, le panier
    await clic('[data-coffret-vin="coufran-grand-vin-bouteille-2010"]')
    await pg.wait_for_timeout(1500)
    await clic("[data-coffret-hasard]")
    await pg.wait_for_timeout(4200)
    await clic("[data-coffret-valider]")
    await clic("[data-coffret-retour]")
    await clic("[data-coffret-valider]")
    await clic("[data-coffret-idee]", 1)
    await clic("[data-coffret-ajouter]")
    await pg.wait_for_timeout(400)
    # le drive : la commande retirée au château (l'heure oubliée, puis choisie)
    await clic("[data-voir-panier]")
    await pg.wait_for_timeout(400)
    await clic("[data-commander]")
    await pg.check("[data-commande] input[name=mode][value=drive]", force=True)
    await pg.fill("[data-commande] [name=prenom]", "Camille")
    await pg.fill("[data-commande] [name=nom]", "Durand")
    await pg.fill("[data-commande] [name=email]", "camille@example.com")
    await pg.check("[data-commande] [name=age]")
    await pg.check("[data-commande] [name=cgv]")
    await clic(".bq-valider")
    await clic(".bq-creneau span", 2)
    await clic(".bq-valider")
    await pg.wait_for_timeout(300)
    await clic("[data-merci] [data-fermer-panier]")
    await clic("[data-coffret-nouveau]")
    await pg.evaluate("localStorage.removeItem('miailhe-panier'); localStorage.removeItem('miailhe-coffrets')")
    # la carte « Où trouver nos vins » : un département et sa liste, un magasin et sa fiche, les trois châteaux, les
    # recherches (ville, code postal, rien), les filtres, « Autour de moi » refusé puis accepté
    if await pg.evaluate("!!(window.MIAILHE && MIAILHE.carte)"):
        await pg.evaluate("document.querySelector('#ou-trouver').scrollIntoView()")
        await pg.wait_for_timeout(400)
        await pg.evaluate("MIAILHE.carte.departement(MIAILHE.carte.deps.findIndex(d => d.code === '33'))")
        await pg.wait_for_timeout(300)
        await clic(".bq-carte-panneau [data-magasin]")
        await clic(".bq-carte-panneau [data-precedent]")
        await clic(".bq-carte-panneau [data-fermer]")
        await clic("[data-maison]")
        await clic(".bq-carte-panneau [data-fermer]")
        for q in ["Bordeaux", "33000", "zzzz"]:
            await pg.fill("[data-cherche]", q)
            await pg.wait_for_timeout(150)
            await pg.evaluate("document.querySelector('.bq-carte-cherche').requestSubmit()")
            await pg.wait_for_timeout(250)
        for sel in ['[data-vin="soudars"]', '[data-vin="soudars"]', '[data-enseigne="vandb"]', '[data-enseigne="vandb"]']:
            await clic(sel)
        await clic("[data-autour]")
        await pg.wait_for_timeout(800)
        try:
            await pg.context.grant_permissions(["geolocation"])
            await pg.context.set_geolocation({"latitude": 45.29, "longitude": -0.79})
            await clic("[data-autour]")
            await pg.wait_for_timeout(800)
        except Exception:
            pass
        await clic(".bq-carte-panneau [data-fermer]")
    # l'espace des professionnels, par la barre (le rideau), puis son offre et son devis
    await clic('.bq-barre [data-espace="pro"]')
    await pg.wait_for_timeout(2200)
    for k in ["verdignan", "soudars", "coufran"]:
        await clic(f'[data-onglet-vieux="{k}"]')
    await clic('[data-demande="chateau-coufran"]')
    await clic('[data-demande="chateau-coufran"]')
    await clic(".pro-envoyer")
    await clic('[data-demande="chateau-verdignan"]')
    await clic(".pro-envoyer")
    await clic('[data-choisir-format="famille"]')
    await pg.wait_for_timeout(500)
    await pg.fill("[data-pro-form] [name=email]", "sofie@example")
    await pg.fill("[data-pro-form] [name=societe]", "Vins du Nord")
    await pg.select_option("[data-pro-form] [name=metier]", index=1)
    await pg.fill("[data-pro-form] [name=nom]", "Sofie Peeters")
    await pg.select_option("[data-pro-form] [name=pays]", index=1)
    await clic(".pro-envoyer")
    await pg.fill("[data-pro-form] [name=email]", "sofie@example.be")
    await clic(".pro-envoyer")
    await pg.check("[data-pro-form] [name=pro]")
    await clic(".pro-envoyer")
    await pg.wait_for_timeout(400)
    await clic("[data-pro-merci] [data-nouvelle-demande]")
    await pg.evaluate("localStorage.removeItem('miailhe-devis'); localStorage.removeItem('miailhe-demande')")
    await clic('.bq-scene [data-espace="particulier"]')
    await pg.wait_for_timeout(2200)


async def parcours_compte(pg):
    """L'espace client : les erreurs de la connexion et de la création, le tableau vide, puis rempli (commandes, panier,
    enquête en cours, château du test), les coordonnées, la lettre, l'effacement en deux temps et la déconnexion."""
    async def clic(sel):
        await pg.locator(sel).first.click(force=True)
        await pg.wait_for_timeout(200)
    e, c = '[data-form="entrer"]', '[data-form="creer"]'
    await clic(e + " [type=submit]")
    await pg.fill(e + " [name=email]", "inconnu@example.com")
    await clic(e + " [type=submit]")
    await pg.fill(c + " [name=prenom]", "")
    await clic(c + " [type=submit]")
    await pg.fill(c + " [name=prenom]", "Camille")
    await pg.fill(c + " [name=nom]", "Durand")
    await pg.fill(c + " [name=email]", "camille")
    await clic(c + " [type=submit]")
    await pg.fill(c + " [name=email]", "camille@example.com")
    await clic(c + " [type=submit]")
    await pg.check(c + " [name=age]")
    await clic(c + " [type=submit]")
    await pg.wait_for_timeout(300)
    await pg.evaluate("""localStorage.setItem('miailhe-panier', JSON.stringify({'coufran-grand-vin-bouteille-2012': 6}));
      localStorage.setItem('miailhe-test-fait', 'verdignan');
      localStorage.setItem('miailhe-commandes', JSON.stringify([{numero: 'M261028-0001', date: '2026-10-28T10:00:00Z', email: 'camille@example.com', port: 0, total: 216,
        lignes: [{nom: 'Château Coufran', millesime: 2016, q: 6}, {nom: 'Château Soudars', millesime: 2015, q: 1}]}]));
      localStorage.setItem('miailhe-enquete-comptes', JSON.stringify({'camille@example.com': {lettres: {1: 'R'}, inscrit: {prenom: 'Camille', mail: 'camille@example.com'}}}));""")
    await pg.reload()
    await pg.wait_for_timeout(900)
    await clic("[data-coordonnees] [type=submit]")
    await clic(".cp-bascule")
    await clic(".cp-bascule")
    await clic("[data-effacer]")
    await pg.evaluate("""const x = JSON.parse(localStorage.getItem('miailhe-enquete-comptes')); x['camille@example.com'].resolue = '2026-10-28';
      localStorage.setItem('miailhe-enquete-comptes', JSON.stringify(x)); localStorage.setItem('miailhe-panier', JSON.stringify({'a': 12}));""")
    await pg.reload()
    await pg.wait_for_timeout(900)
    await clic("[data-sortir]")
    await pg.evaluate("['miailhe-client','miailhe-clients','miailhe-panier','miailhe-commandes','miailhe-test-fait','miailhe-enquete-comptes'].forEach(k => localStorage.removeItem(k))")


async def parcours(pg, page):
    await passer_age(pg)
    if page.startswith("★"):
        for o in ["famille", "terroir", "pret-a-boire"]:
            await pg.click(f'.onglets a[data-onglet="{o}"]')
            await pg.wait_for_timeout(700)
            await pg.evaluate("document.querySelector('.panneau.is-ouvert .panneau-defile').scrollTo(0, 1e6)")
            await pg.wait_for_timeout(600)
            await pg.keyboard.press("Escape")
            await pg.wait_for_timeout(500)
        await pg.click(".seuil-consigne [data-ouvrir-test]")
        await pg.wait_for_timeout(500)
        print("   résultats du test :", sorted(await faire_test(pg, ".test-voile [data-quiz]")))
        await pg.keyboard.press("Escape")
        await pg.wait_for_timeout(300)
        await pg.click(".site-header .ouvrir-menu", timeout=3000)
        await pg.wait_for_timeout(400)
        await pg.keyboard.press("Escape")
    elif page == "quiz.html":
        print("   résultats du test :", sorted(await faire_test(pg, "[data-quiz]")))
    elif page == "enquete.html":
        f = pg.locator("form[data-commencer]")
        await f.locator("[type=submit]").click()
        await pg.wait_for_timeout(200)
        await pg.locator("input[name=mode][value=invite]").check(force=True)
        await pg.wait_for_timeout(200)
        await pg.locator("form[data-reprise] [type=submit]").click(force=True)
        await pg.wait_for_timeout(200)
        await f.locator("[type=submit]").click()
        await pg.wait_for_timeout(600)
        for k in range(1, 7):
            for _ in range(3):
                await pg.evaluate(f"document.querySelector('[data-indices=\"{k}\"] .indices-bouton') && document.querySelector('[data-indices=\"{k}\"] .indices-bouton').click()")
                await pg.wait_for_timeout(80)
            await pg.evaluate(f"(() => {{ const f = document.querySelector('form[data-enigme=\"{k}\"]'); if (f) f.requestSubmit(); }})()")
            await pg.wait_for_timeout(150)
        await pg.evaluate("(() => { const f = document.querySelector('form[data-acces]'); if (f) f.requestSubmit(); })()")
    elif page.split("/")[-1] == "index.html":
        n = await pg.locator("[data-aller-bouteille]").count()
        for k in range(n):
            await pg.locator(f'[data-aller-bouteille="{k}"]').click(force=True)
            await pg.wait_for_timeout(250)
    elif page == "boutique.html":
        await parcours_boutique(pg)
    elif page == "compte.html":
        await parcours_compte(pg)


async def main():
    tout, ordre = {}, []

    def garder(cle, ou):
        cle = norm(cle)
        if not re.search(r"\{\d+\}", cle):     # une phrase de script avec ses {0} reste telle quelle
            cle = modele(cle)
        if not LETTRE.search(cle):
            return
        if cle not in tout:
            tout[cle] = []
            ordre.append(cle)
        if ou and ou not in tout[cle] and len(tout[cle]) < 4:
            tout[cle].append(ou)

    async with async_playwright() as p:
        nav = await p.chromium.launch()
        for langue in (LANGUES_VERIF if VERIFIER else ["en"]):
            manquants = {}
            for page in PAGES:
                ctx = await nav.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
                await ctx.add_init_script("try{localStorage.setItem('miailhe-guide','')}catch(e){}")
                pg = await ctx.new_page()
                erreurs = []
                pg.on("pageerror", lambda e: erreurs.append(str(e)))
                q = f"?lang={langue}" + ("" if VERIFIER else "&collecte")
                await pg.goto(RACINE + urllib.parse.quote(page) + q)
                await pg.wait_for_timeout(900)
                try:
                    await parcours(pg, page)
                except Exception as e:     # un parcours qui casse ne doit pas arrêter le relevé
                    print("   parcours interrompu :", page, str(e).splitlines()[0])
                await pg.wait_for_timeout(400)
                if VERIFIER:
                    for k in await pg.evaluate("[...(MIAILHE.manquants || [])]"):
                        manquants.setdefault(k, page)
                else:
                    for k, ou in await pg.evaluate("[...MIAILHE.cles.entries()]"):
                        garder(k, f"{page} · {ou}")
                if erreurs:
                    print("   erreurs JS :", page, erreurs[:3])
                print(page, len(tout) if not VERIFIER else len(manquants))
                await ctx.close()
            # avec les animations : l'intro de la vitrine et l'écran d'arrivée des châteaux (retirés si l'on réduit les animations)
            for page in ["★ MIAILHE Vitrine V1.html", "coufran/index.html", "verdignan/index.html", "soudars/index.html"]:
                ctx = await nav.new_context(viewport={"width": 1440, "height": 900})
                pg = await ctx.new_page()
                q = f"?lang={langue}" + ("" if VERIFIER else "&collecte") + ("&porte" if "/" in page else "")
                await pg.goto(RACINE + urllib.parse.quote(page) + q)
                await pg.wait_for_timeout(1500)
                if VERIFIER:
                    for k in await pg.evaluate("[...(MIAILHE.manquants || [])]"):
                        manquants.setdefault(k, page + " (animé)")
                else:
                    for k, ou in await pg.evaluate("[...MIAILHE.cles.entries()]"):
                        garder(k, f"{page} · {ou}")
                await ctx.close()
            if VERIFIER:
                (ICI / f"manquants-{langue}.json").write_text(json.dumps(manquants, ensure_ascii=False, indent=1))
                print(langue, "manquants :", len(manquants))
        await nav.close()
    if VERIFIER:
        return

    for cle, ou in litteraux_js() + attributs_data() + MODELES:
        garder(cle, ou)
    liste = [{"cle": k, "ou": tout[k]} for k in ordre]
    (ICI / "cles.json").write_text(json.dumps(liste, ensure_ascii=False, indent=1))
    print("clés :", len(liste), "· mots :", sum(len(re.sub(r"<[^>]+>", " ", k).split()) for k in ordre))


asyncio.run(main())
