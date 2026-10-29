"""Le blog de miailhe.com (29/10/2026, demande de l'utilisateur : « un onglet blog dans le site avec des articles de blog
rédigés pour le SEO »).

Les articles sont de simples fichiers texte dans `source/blog/articles/<adresse>.md`, que l'équipe peut relire et modifier
sans toucher au code. Chaque fichier commence par un en-tête (titre, titre pour Google, description, date, catégorie,
image, requêtes visées, appel à l'action), puis le texte, dans une syntaxe proche du Markdown :

    ## Intertitre            ### Sous-titre           - liste       1. liste numérotée
    **gras**  *italique*  [lien](cible)  ![texte alternatif](image "légende")  > citation
    ::: bref En bref  …  :::            un encadré « En bref » (en haut de l'article : il sert aussi d'extrait à Google)
    ::: astuce Le saviez-vous ?  …  :::
    ## Questions fréquentes, puis ### question + réponse : la foire aux questions, balisée pour Google (FAQPage)

Les cibles des liens : `blog:<adresse>` pour un autre article, `vitrine#terroir` pour un onglet de l'accueil, sinon un
chemin depuis la racine du site (`boutique.html#votre-annee`, `coufran/index.html`…). Les images : un chemin depuis
`assets/img/`.

Ce que le script écrit, pour le référencement :
  - `blog/index.html` (la page du blog) et `blog/<adresse>.html` (un article par page) : titre et description propres,
    adresse canonique, balises Open Graph, données structurées (Blog, BlogPosting, BreadcrumbList, FAQPage), un seul
    h1, des intertitres, un sommaire, le fil d'Ariane, des liens internes vers les châteaux, la boutique et les autres
    articles, les images avec leurs dimensions et leur texte alternatif ;
  - les couvertures recadrées et allégées (`assets/img/blog/`) ;
  - `sitemap.xml` (toutes les pages publiques du site, adresses de miailhe.com) et `robots.txt`.

Les articles sont en français : les dictionnaires anglais et japonais du site traduisent l'en-tête, le menu et le pied
de page, et une note prévient le visiteur que les articles sont rédigés en français (le corps des pages porte
translate="no").

    python3 Site_MIAILHE/source/generer_blog.py
"""
import datetime
import html
import json
import re
import sys
from pathlib import Path

from PIL import Image

ICI = Path(__file__).resolve().parent
SITE = ICI.parent
sys.path.insert(0, str(ICI))
import entete            # noqa: E402  la droite de l'en-tête, la même partout
import menu_principal    # noqa: E402  le menu plein écran

ARTICLES = ICI / 'blog' / 'articles'
SORTIE = SITE / 'blog'
IMG = SITE / 'assets' / 'img'
IMG_BLOG = IMG / 'blog'
DOMAINE = 'https://miailhe.com'
VITRINE = '%E2%98%85%20MIAILHE%20Vitrine%20V1.html'
LOGO_PNG = SITE.parent / 'Logos' / 'LOGO_FINAL' / 'PNG' / 'miailhe-logo-noir-600px.png'
MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre',
        'décembre']

TEXTES = {'titre', 'titre_seo', 'description', 'image_alt', 'legende', 'chapeau'}   # les champs passés en typographie

CATEGORIES = {
    'famille': 'Histoires de famille',
    'vin': 'Le vin simplement',
    'terroir': 'Terroir & Médoc',
}

# Les appels à l'action en fin d'article : sur-titre, titre (un mot en italique), texte, bouton, second lien
CTA = {
    'test': ('Trouver mon château', 'Quel château <em>vous ressemble</em>\u202f?',
             'Quelques questions sur vos goûts du quotidien, sans rien connaître au vin : le test vous oriente vers '
             'Coufran, Verdignan ou Soudars.',
             ('Faire le test', 'quiz.html'), ('Pousser une porte', 'vitrine#accueil')),
    'pret': ('Prêt-à-boire', 'Nous attendons <em>pour vous.</em>',
             'À Coufran et à Verdignan, les bouteilles vieillissent au château jusqu’à ce qu’elles soient prêtes. Les '
             'plus anciens millésimes encore en cave vous attendent dans la boutique.',
             ('Les doyennes de la cave', 'boutique.html#doyennes'), ('L’histoire d’une bouteille', 'vitrine#pret-a-boire')),
    'magasins': ('Où trouver nos vins', 'Près de chez vous, <em>ou chez vous.</em>',
                 'La carte des magasins vous indique où trouver Coufran, Verdignan et Soudars. La boutique de la '
                 'famille livre aussi partout en France métropolitaine.',
                 ('Voir la carte', 'boutique.html#ou-trouver'), ('La boutique de la famille', 'boutique.html')),
    'terroir': ('Le terroir', 'Trois sols, <em>une même racine.</em>',
                'Graves, argiles, calcaire : le terroir des trois châteaux, raconté génération par génération.',
                ('Explorer le terroir', 'vitrine#terroir'), ('Quel château vous ressemble\u202f?', 'quiz.html')),
    'annee': ('Le vin de votre année', 'Une naissance, une rencontre, <em>une année.</em>',
              'Choisissez une année : la cave vous dit ce qu’elle a gardé pour vous, à Coufran, à Verdignan et à '
              'Soudars.',
              ('Chercher mon année', 'boutique.html#votre-annee'), ('Le coffret des trois générations', 'boutique.html#coffret')),
    'visite': ('Visiter', 'La famille vous ouvre <em>ses portes.</em>',
               'Visites et dégustations sur rendez-vous, au +33 5 56 59 31 02. L’enquête se joue aussi sur place.',
               ('Prendre rendez-vous', 'tel:+33556593102'), ('Mener l’enquête', 'enquete.html')),
}


# ---------------------------------------------------------------------------------------------------------------------
# Lecture des articles

def typo(s):
    """La microtypographie française, écrite dans la page : typographie.js ne la fait qu'en français, et les articles
    restent en français quand le site est en anglais ou en japonais. Apostrophe typographique, espace fine insécable
    avant ; ! ? et %, insécable avant les deux-points, dans les guillemets et entre un nombre et son unité."""
    s = s.replace("'", '’')
    s = re.sub(r' +([;!?])', '\u202f\\1', s)
    s = re.sub(r' +:(?=\s|$)', '\u00a0:', s)
    s = re.sub(r'« +', '«\u00a0', s)
    s = re.sub(r' +»', '\u00a0»', s)
    s = re.sub(r'(\d) (%|°C|ha\b|km\b|mètres\b|hectares\b|min\b)', '\\1\u00a0\\2', s)
    return s


def lire(chemin):
    texte = chemin.read_text(encoding='utf-8')
    _, tete, corps = texte.split('---\n', 2)
    meta = {}
    for ligne in tete.strip().splitlines():
        cle, _, val = ligne.partition(':')
        val = val.strip()
        meta[cle.strip()] = typo(val) if cle.strip() in TEXTES else val
    meta['adresse'] = chemin.stem
    meta['corps'] = typo(corps.strip())
    meta['date'] = datetime.date.fromisoformat(meta['date'])
    meta['cadrage'] = float(meta.get('cadrage', .5))
    meta['requetes'] = [r.strip() for r in meta.get('requetes', '').split(';') if r.strip()]
    return meta


def texte_brut(s):
    """Le titre sans balisage (pour <title>, les données structurées, le fil d'Ariane)."""
    return re.sub(r'\*([^*]+)\*', r'\1', s)


def date_fr(d):
    return f'{d.day}{"er" if d.day == 1 else ""} {MOIS[d.month - 1]} {d.year}'


def ancre(s):
    s = texte_brut(s).lower()
    s = s.translate(str.maketrans('àâäéèêëîïôöùûüçœ’\'', 'aaaeeeeiioouuuco  '))
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


# ---------------------------------------------------------------------------------------------------------------------
# Le texte des articles

def cible(c, depuis_blog=True):
    """Une cible de lien écrite dans un article → l'adresse relative depuis blog/."""
    if c.startswith('blog:'):
        return c[5:] + '.html'
    if c.startswith('vitrine'):
        return '../' + VITRINE + c[len('vitrine'):]
    if re.match(r'^(https?:|mailto:|tel:|#)', c):
        return c
    return '../' + c


def en_ligne(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', lambda m: f'<a href="{cible(m.group(2))}">{m.group(1)}</a>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*([^*\n]+)\*(?![\w*])', r'<em>\1</em>', s)
    return s


def figure(alt, chemin, legende):
    src = IMG / chemin
    w, h = Image.open(src).size
    leg = f'<figcaption>{en_ligne(legende)}</figcaption>' if legende else ''
    return (f'<figure class="ar-figure"><img src="../assets/img/{chemin}" alt="{html.escape(alt)}" width="{w}" '
            f'height="{h}" loading="lazy" decoding="async">{leg}</figure>')


def rendre(corps):
    """Le texte d'un article → (html, sommaire, foire aux questions)."""
    lignes = corps.splitlines()
    sortie, sommaire, faq = [], [], []
    i, dans_faq, question = 0, False, None

    def paragraphe(buf):
        if buf:
            t = ' '.join(buf)
            sortie.append(f'<p>{en_ligne(t)}</p>')
            if question is not None:
                question['reponse'].append(texte_brut(re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', t)))

    buf = []
    while i < len(lignes):
        l = lignes[i].rstrip()
        if not l.strip():
            paragraphe(buf); buf = []; i += 1; continue
        if l.startswith(':::'):
            paragraphe(buf); buf = []
            genre, _, titre = l[3:].strip().partition(' ')
            j = i + 1
            while not lignes[j].startswith(':::'):
                j += 1
            interieur, _, _ = rendre('\n'.join(lignes[i + 1:j]))
            sortie.append(f'<aside class="ar-{genre}"><p class="ar-encadre-titre">{titre}</p>{interieur}</aside>')
            i = j + 1; continue
        if l.startswith('## '):
            paragraphe(buf); buf = []
            t = l[3:].strip()
            a = ancre(t)
            dans_faq = t.lower().startswith('questions fréquentes')
            sommaire.append((a, texte_brut(t)))
            sortie.append(f'<h2 id="{a}">{en_ligne(t)}</h2>')
            question = None
            i += 1; continue
        if l.startswith('### '):
            paragraphe(buf); buf = []
            t = l[4:].strip()
            if dans_faq:
                question = {'question': texte_brut(t), 'reponse': []}
                faq.append(question)
            sortie.append(f'<h3 id="{ancre(t)}">{en_ligne(t)}</h3>')
            i += 1; continue
        m = re.match(r'^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$', l.strip())
        if m:
            paragraphe(buf); buf = []
            sortie.append(figure(*m.groups()))
            i += 1; continue
        if re.match(r'^(- |\d+\. )', l):
            paragraphe(buf); buf = []
            ordonnee = not l.startswith('- ')
            items = []
            while i < len(lignes) and re.match(r'^(- |\d+\. )', lignes[i]):
                items.append(re.sub(r'^(- |\d+\. )', '', lignes[i]).strip())
                i += 1
            balise = 'ol' if ordonnee else 'ul'
            sortie.append(f'<{balise}>' + ''.join(f'<li>{en_ligne(x)}</li>' for x in items) + f'</{balise}>')
            continue
        if l.startswith('> '):
            paragraphe(buf); buf = []
            cit = []
            while i < len(lignes) and lignes[i].startswith('> '):
                cit.append(lignes[i][2:].strip()); i += 1
            sortie.append(f'<blockquote><p>{en_ligne(" ".join(cit))}</p></blockquote>')
            continue
        buf.append(l.strip())
        i += 1
    paragraphe(buf)
    return '\n'.join(sortie), sommaire, faq


def mots(corps):
    return len(re.findall(r"[\wÀ-ÿœ’'-]+", re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', corps)))


# ---------------------------------------------------------------------------------------------------------------------
# Les images

def couvertures(a):
    """La couverture de l'article : une grande (16:10) pour l'article et le partage, une petite (4:3) pour les cartes."""
    IMG_BLOG.mkdir(exist_ok=True)
    im = Image.open(IMG / a['image']).convert('RGB')
    w, h = im.size
    for nom, rapport, largeur in ((a['adresse'], 16 / 10, 1800), (a['adresse'] + '-carte', 4 / 3, 900)):
        if w / h > rapport:                          # plus large que le cadre : on rogne les côtés
            cw = round(h * rapport)
            boite = ((w - cw) // 2, 0, (w - cw) // 2 + cw, h)
        else:
            ch = round(w / rapport)
            y = min(max(round(a['cadrage'] * h - ch / 2), 0), h - ch)
            boite = (0, y, w, y + ch)
        r = im.crop(boite)
        r = r.resize((largeur, round(largeur / rapport)), Image.LANCZOS)
        r.save(IMG_BLOG / f'{nom}.jpg', quality=82, optimize=True, progressive=True)


def trois_bouteilles():
    """Les trois bouteilles côte à côte, pour l'article sur l'étiquette."""
    fond = Image.new('RGB', (1800, 1200), (248, 244, 237))
    hauteur = 1000
    poses = []
    for c in ('coufran', 'verdignan', 'soudars'):
        b = Image.open(IMG / f'bouteille-{c}.webp').convert('RGBA')
        b = b.crop(b.getbbox())
        b = b.resize((round(b.width * hauteur / b.height), hauteur), Image.LANCZOS)
        poses.append(b)
    total = sum(b.width for b in poses) + 2 * 150
    x = (1800 - total) // 2
    for b in poses:
        fond.paste(b, (x, 1200 - hauteur - 90), b)
        x += b.width + 150
    IMG_BLOG.mkdir(exist_ok=True)
    fond.save(IMG_BLOG / 'trois-bouteilles.jpg', quality=86, optimize=True, progressive=True)


def logo():
    IMG_BLOG.mkdir(exist_ok=True)
    Image.open(LOGO_PNG).save(IMG_BLOG / 'miailhe-logo.png', optimize=True)


# ---------------------------------------------------------------------------------------------------------------------
# Les gabarits

def depuis_blog(s):
    """Un morceau de page écrit pour la racine du site → valable depuis blog/ (liens et images relatifs)."""
    return re.sub(r'(href|src)="(?!https?:|mailto:|tel:|#|\?|/|data:|\.\./)([^"]+)"', r'\1="../\2"', s)


def tete(titre, description, adresse, image, donnees, type_og='article'):
    canonique = f'{DOMAINE}/blog/{adresse}' if adresse else f'{DOMAINE}/blog/'
    ld = ''.join(f'\n  <script type="application/ld+json">{json.dumps(d, ensure_ascii=False)}</script>' for d in donnees)
    return f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <script src="../assets/js/langue.js"></script><!-- la langue d'abord : la page est traduite avant d'être montrée -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(titre)}</title>
  <meta name="description" content="{html.escape(description)}">
  <link rel="canonical" href="{canonique}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="{type_og}">
  <meta property="og:site_name" content="Famille Miailhe">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:title" content="{html.escape(titre)}">
  <meta property="og:description" content="{html.escape(description)}">
  <meta property="og:url" content="{canonique}">
  <meta property="og:image" content="{DOMAINE}/assets/img/{image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="../assets/css/polices.css">
  <link rel="stylesheet" href="../assets/css/typographie.css">
  <link rel="stylesheet" href="../assets/css/main.css">
  <link rel="stylesheet" href="../assets/css/blog.css">{ld}
</head>'''


def porte_age():
    return '''  <!-- Âge légal (la vitrine le demande une fois ; on ne le redemande pas à qui l'a déjà confirmé) -->
  <div class="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-titre">
    <figure class="entree-fond"><img src="../assets/img/acte-famille-1931.jpg" alt=""></figure>
    <div class="entree">
      <span class="wordmark" aria-label="MIAILHE"><span class="sr-only">MIAILHE</span></span>
      <p id="age-titre">Trois châteaux du Haut-Médoc, une même famille. Pour entrer, vous devez avoir l'âge légal de consommer de l'alcool dans votre pays.</p>
      <div class="choix">
        <button class="btn btn--plein" type="button" data-entrer><span>J'ai l'âge légal, entrer</span></button>
      </div>
      <button class="refus" type="button">Je n'ai pas l'âge légal</button>
      <p class="refus-message">Revenez nous voir plus tard. La vigne, elle, sait attendre.</p>
      <p class="mention">L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
      <ul class="langues langues--porte" aria-label="Langue du site"><li><a href="?lang=fr" lang="fr" data-langue="fr" aria-current="true">Fr</a></li><li><a href="?lang=en" lang="en" data-langue="en">En</a></li><li><a href="?lang=ja" lang="ja" data-langue="ja">日本語</a></li></ul>
    </div>
  </div>'''


def entete_blog():
    """L'en-tête de la vitrine : le menu, les onglets (ceux de l'accueil mènent à ses panneaux ; « Le blog » est ici)."""
    onglets = ''.join(f'\n        <a href="../{VITRINE}#{k}" data-onglet="{k}">{n}</a>' for k, n in
                      (('famille', 'La famille'), ('terroir', 'Le terroir'), ('pret-a-boire', 'Prêt-à-boire'),
                       ('ou-trouver', 'Où nous trouver')))
    return f'''  <header class="site-header">
    <div class="header-gauche">
      <button class="ouvrir-menu" type="button" aria-expanded="false" aria-controls="menu-principal" aria-label="Ouvrir le menu"><span></span></button>
      <nav class="onglets" aria-label="Découvrir la maison">{onglets}
        <a href="index.html" data-onglet="blog" aria-current="page">Le blog</a>
      </nav>
    </div>
    <a class="wordmark" href="../{VITRINE}" aria-label="MIAILHE, accueil"><span class="sr-only">MIAILHE</span></a>
    {depuis_blog(entete.droite())}
  </header>

  {depuis_blog(menu_principal.menu(False))}'''


def note_langue():
    # visible seulement quand le site est en anglais ou en japonais (blog.css) ; traduite par les dictionnaires
    return '<p class="bl-note-langue">Nos articles sont rédigés en français.</p>'


def pied():
    chateaux = ''.join(f'<a href="../{k}/index.html">Château {n}</a>' for k, n in
                       (('coufran', 'Coufran'), ('verdignan', 'Verdignan'), ('soudars', 'Soudars')))
    return f'''  <footer class="bl-pied">
    <span class="wordmark" aria-hidden="true"></span>
    <nav class="bl-pied-liens" aria-label="Liens du pied de page">{chateaux}<a href="../boutique.html">La boutique</a><a href="../enquete.html">L'enquête</a><a href="index.html">Le blog</a></nav>
    <nav class="reseaux" data-reseaux></nav>
    <p><a href="../{VITRINE}">miailhe.com</a> · Trois châteaux du Haut-Médoc, une même famille</p>
    <p>La vente d'alcool aux mineurs est interdite. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
  </footer>

  <script src="../assets/js/logo.js"></script>
  <script src="../assets/js/feuille-miailhe.js"></script><!-- la feuille de vigne du logo, partout la même -->
  <script src="../assets/js/typographie.js"></script>
  <script src="../assets/js/reseaux.js"></script>
  <script src="../assets/js/main.js"></script>
  <script src="../assets/js/espace.js"></script><!-- l'initiale du client et le panier, dans l'en-tête -->
  <script src="../assets/js/survol.js"></script><!-- la racine sous les onglets et les liens de l'en-tête, au survol -->
  <script src="../assets/js/blog.js"></script>
</body>
</html>
'''


def carte(a, une=False):
    cat = CATEGORIES[a['categorie']]
    lien = f'{a["adresse"]}.html'
    img = f'../assets/img/blog/{a["adresse"]}{"" if une else "-carte"}.jpg'
    w, h = (1800, 1125) if une else (900, 675)
    titre = en_ligne(a['titre'])
    balise = 'h2' if une else 'h3'
    return f'''<article class="bl-carte{' bl-carte--une' if une else ''}" data-categorie="{a['categorie']}">
        <a class="bl-carte-image" href="{lien}" tabindex="-1" aria-hidden="true"><img src="{img}" alt="{html.escape(a['image_alt'])}" width="{w}" height="{h}" loading="{'eager' if une else 'lazy'}" decoding="async"></a>
        <div class="bl-carte-texte">
          <p class="bl-carte-cat">{cat}</p>
          <{balise} class="bl-carte-titre"><a href="{lien}">{titre}</a></{balise}>
          <p class="bl-carte-extrait">{html.escape(a['description'])}</p>
          <p class="bl-carte-meta"><time datetime="{a['date'].isoformat()}">{date_fr(a['date'])}</time> · {a['lecture']} min de lecture</p>
        </div>
      </article>'''


def organisation():
    return {'@type': 'Organization', 'name': 'Famille Miailhe', 'url': f'{DOMAINE}/',
            'logo': {'@type': 'ImageObject', 'url': f'{DOMAINE}/assets/img/blog/miailhe-logo.png'}}


def page_index(articles):
    une, *autres = articles
    filtres = ''.join(f'<button type="button" data-filtre="{k}" aria-pressed="false">{n}</button>' for k, n in CATEGORIES.items())
    donnees = [
        {'@context': 'https://schema.org', '@type': 'Blog', 'name': 'Le blog de la famille Miailhe',
         'url': f'{DOMAINE}/blog/', 'inLanguage': 'fr-FR', 'publisher': organisation(),
         'description': 'Conseils pour choisir, servir et comprendre un bordeaux, le terroir du Haut-Médoc et l’histoire '
                        'de trois châteaux d’une même famille.',
         'blogPost': [{'@type': 'BlogPosting', 'headline': texte_brut(a['titre']), 'url': f'{DOMAINE}/blog/{a["adresse"]}',
                       'datePublished': a['date'].isoformat(), 'image': f'{DOMAINE}/assets/img/blog/{a["adresse"]}.jpg'}
                      for a in articles]},
        {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': f'{DOMAINE}/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Le blog', 'item': f'{DOMAINE}/blog/'}]},
    ]
    corps = f'''
<body class="page-blog page-blog--index">
{porte_age()}

{entete_blog()}

  <main class="bl">
    <header class="bl-tete">
      {note_langue()}
      <div translate="no">
        <p class="bl-sur">Le blog de la famille Miailhe</p>
        <h1 class="bl-h1">Le vin, <em>simplement.</em></h1>
        <p class="bl-intro">Choisir, servir et comprendre un bordeaux sans jargon. Le terroir du Haut-Médoc raconté par ceux qui
        le travaillent. Et l’histoire de trois châteaux, Coufran, Verdignan et Soudars, qui appartiennent à une même famille
        depuis 1924.</p>
      </div>
    </header>

    <nav class="bl-filtres" aria-label="Catégories" translate="no">
      <button type="button" data-filtre="" aria-pressed="true">Tous les articles</button>{filtres}
    </nav>

    <section class="bl-liste" aria-label="Articles" translate="no">
      {carte(une, une=True)}
      <div class="bl-grille">
      {''.join(carte(a) for a in autres)}
      </div>
    </section>

    <section class="bl-bande" translate="no">
      <p class="bl-sur bl-sur--clair">Trois châteaux, une même famille</p>
      <h2>Et vous, quel château <em>vous ressemble</em> ?</h2>
      <div class="bl-bande-liens">
        <a class="bl-bouton bl-bouton--clair" href="../quiz.html">Faire le test</a>
        <a class="bl-lien bl-lien--clair" href="../enquete.html">Mener l’enquête</a>
      </div>
    </section>
  </main>

{pied()}'''
    titre = 'Le blog de la famille Miailhe : vins de Bordeaux et Haut-Médoc'
    desc = ('Choisir, servir et comprendre un bordeaux sans jargon, le terroir du Haut-Médoc et l’histoire de la famille '
            'Miailhe : les articles du blog de Coufran, Verdignan et Soudars.')
    return tete(titre, desc, '', f'blog/{une["adresse"]}.jpg', donnees, 'website') + corps


def page_article(a, articles):
    cat = CATEGORIES[a['categorie']]
    corps_html, sommaire, faq = a['rendu']
    canon = f'{DOMAINE}/blog/{a["adresse"]}'
    image = f'{DOMAINE}/assets/img/blog/{a["adresse"]}.jpg'
    donnees = [
        {'@context': 'https://schema.org', '@type': 'BlogPosting', 'headline': texte_brut(a['titre']),
         'description': a['description'], 'image': [image], 'datePublished': a['date'].isoformat(),
         'dateModified': a['date'].isoformat(), 'author': {'@type': 'Organization', 'name': 'Famille Miailhe',
                                                          'url': f'{DOMAINE}/'},
         'publisher': organisation(), 'mainEntityOfPage': {'@type': 'WebPage', '@id': canon}, 'inLanguage': 'fr-FR',
         'articleSection': cat, 'keywords': ', '.join(a['requetes']), 'wordCount': a['mots']},
        {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': f'{DOMAINE}/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Le blog', 'item': f'{DOMAINE}/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': texte_brut(a['titre']), 'item': canon}]},
    ]
    if faq:
        donnees.append({'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': q['question'],
             'acceptedAnswer': {'@type': 'Answer', 'text': ' '.join(q['reponse'])}} for q in faq]})
    sur, titre_cta, texte_cta, (b1, l1), (b2, l2) = CTA[a['cta']]
    # trois articles à lire ensuite : ceux de la même catégorie d'abord, puis les plus récents
    autres = [x for x in articles if x is not a]
    autres.sort(key=lambda x: (x['categorie'] != a['categorie'], -x['date'].toordinal()))
    sommaire_html = ''.join(f'<li><a href="#{k}">{html.escape(t)}</a></li>' for k, t in sommaire)
    page = f'''
<body class="page-blog page-blog--article">
  <div class="ar-progression" aria-hidden="true"><span></span></div>
{porte_age()}

{entete_blog()}

  <main class="ar">
    {note_langue()}
    <article translate="no">
      <header class="ar-tete">
        <nav class="ar-fil" aria-label="Fil d’Ariane"><a href="../{VITRINE}">Accueil</a><span aria-hidden="true">›</span><a href="index.html">Le blog</a><span aria-hidden="true">›</span><span>{cat}</span></nav>
        <h1 class="ar-h1">{en_ligne(a['titre'])}</h1>
        <p class="ar-chapeau">{html.escape(a['chapeau'])}</p>
        <p class="ar-meta">Par la famille Miailhe · <time datetime="{a['date'].isoformat()}">{date_fr(a['date'])}</time> · {a['lecture']} min de lecture</p>
      </header>

      <figure class="ar-couverture">
        <img src="../assets/img/blog/{a['adresse']}.jpg" alt="{html.escape(a['image_alt'])}" width="1800" height="1125" fetchpriority="high" decoding="async">
        <figcaption>{html.escape(a['legende'])}</figcaption>
      </figure>

      <div class="ar-corps">
        <nav class="ar-sommaire" aria-label="Sommaire">
          <details open><summary>Sommaire</summary><ol>{sommaire_html}</ol></details>
        </nav>
        <div class="ar-texte">
{corps_html}
          <p class="ar-sante">L’abus d’alcool est dangereux pour la santé, à consommer avec modération.</p>
        </div>
      </div>
    </article>

    <section class="ar-cta" translate="no">
      <p class="bl-sur bl-sur--clair">{sur}</p>
      <h2>{titre_cta}</h2>
      <p>{texte_cta}</p>
      <div class="bl-bande-liens">
        <a class="bl-bouton bl-bouton--clair" href="{cible(l1)}">{b1}</a>
        <a class="bl-lien bl-lien--clair" href="{cible(l2)}">{b2}</a>
      </div>
    </section>

    <section class="ar-suite" aria-labelledby="suite-titre" translate="no">
      <h2 class="bl-sur" id="suite-titre">À lire aussi</h2>
      <div class="bl-grille">
      {''.join(carte(x) for x in autres[:3])}
      </div>
      <p class="ar-tous"><a class="bl-lien" href="index.html">Tous les articles du blog</a></p>
    </section>
  </main>

{pied()}'''
    return tete(a['titre_seo'], a['description'], a['adresse'], f'blog/{a["adresse"]}.jpg', donnees) + page


# ---------------------------------------------------------------------------------------------------------------------
# Plan du site

def plan_du_site(articles):
    aujourd = datetime.date.today().isoformat()
    pages = [('/', aujourd, '1.0'), ('/boutique', aujourd, '0.9'), ('/enquete', aujourd, '0.8'), ('/quiz', aujourd, '0.7'),
             ('/identite', aujourd, '0.4'), ('/blog/', aujourd, '0.8')]
    for c in ('coufran', 'verdignan', 'soudars'):
        for p in sorted((SITE / c).glob('*.html')):
            pages.append((f'/{c}/' if p.stem == 'index' else f'/{c}/{p.stem}', aujourd, '0.8' if p.stem == 'index' else '0.6'))
    pages += [(f'/blog/{a["adresse"]}', a['date'].isoformat(), '0.7') for a in articles]
    urls = ''.join(f'\n  <url><loc>{DOMAINE}{u}</loc><lastmod>{d}</lastmod><priority>{p}</priority></url>' for u, d, p in pages)
    (SITE / 'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n'
                                      f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}\n</urlset>\n',
                                      encoding='utf-8')
    (SITE / 'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /compte\nDisallow: /archives/\n'
                                     'Disallow: /prototypes/\n\n'
                                     f'Sitemap: {DOMAINE}/sitemap.xml\n', encoding='utf-8')
    return len(pages)


def main():
    articles = sorted((lire(p) for p in ARTICLES.glob('*.md')), key=lambda a: a['date'], reverse=True)
    trois_bouteilles()
    logo()
    for a in articles:
        a['rendu'] = rendre(a['corps'])
        a['mots'] = mots(a['corps'])
        a['lecture'] = max(1, round(a['mots'] / 220))
        couvertures(a)
    SORTIE.mkdir(exist_ok=True)
    (SORTIE / 'index.html').write_text(page_index(articles), encoding='utf-8')
    for a in articles:
        (SORTIE / f'{a["adresse"]}.html').write_text(page_article(a, articles), encoding='utf-8')
        print(f'{a["adresse"]}.html · {a["mots"]} mots · {len(a["titre_seo"])} car. de titre · '
              f'{len(a["description"])} car. de description · {len(a["rendu"][2])} questions')
    print('sitemap.xml :', plan_du_site(articles), 'adresses')


if __name__ == '__main__':
    main()
