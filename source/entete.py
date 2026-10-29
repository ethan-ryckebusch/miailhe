"""La droite de l'en-tête, la même sur toutes les pages de la maison (28/10/2026, demande de l'utilisateur).

Plus d'armoiries ici : elles ne restent que sur les sites des châteaux. À la place, dans l'ordre :
  - la boutique (une bouteille et son nom) et l'enquête (une loupe et son nom) : deux liens sobres, sans cadre, dont le
    mot reçoit au survol la racine et la feuille du logo (survol.js), comme les onglets ; l'utilisateur n'aimait pas les
    pilules (28/10/2026) ;
  - l'espace client (compte.html) et le panier, deux icônes ; espace.js y met l'initiale du client connecté et le
    nombre de bouteilles du panier ;
  - la langue, repliée sur la langue en cours (les deux autres s'ouvrent au survol ou au toucher).
Sur la boutique, le panier ouvre le tiroir au lieu d'y mener.

Une seule source : ce script réécrit le bloc <div class="header-droite"> des pages listées. Les sites des châteaux
prennent les mêmes icônes (generer_chateaux.py les importe d'ici).

    python3 source/entete.py
"""
from pathlib import Path

ICI = Path(__file__).resolve().parent.parent

# Les icônes, au trait (viewBox 24, couleur = currentColor)
BOUTEILLE = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.2 2.6h3.6M10.7 2.6v4.5c0 .8-.4 1.3-1 1.9-.9.8-1.5 1.8-1.5 3.1v8.2'
             'c0 .6.5 1.1 1.1 1.1h5.4c.6 0 1.1-.5 1.1-1.1v-8.2c0-1.3-.6-2.3-1.5-3.1-.6-.6-1-1.1-1-1.9V2.6"/><path d="M8.2 13.4h7.6v4.4H8.2z"/></svg>')
LOUPE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.2"/><path d="M14.6 14.6L20 20"/></svg>'
PERSONNE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.3" r="3.8"/><path d="M4.6 20.4c.9-3.9 3.9-6 7.4-6s6.5 2.1 7.4 6"/></svg>'
SAC = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 8.2h13.6l-1.1 11.3a1.1 1.1 0 0 1-1.1 1H7.4a1.1 1.1 0 0 1-1.1-1L5.2 8.2z"/>'
       '<path d="M9 10.4V6.6a3 3 0 0 1 6 0v3.8"/></svg>')
LANGUES = ('<ul class="langues langues--compacte" aria-label="Langue du site"><li><a href="?lang=fr" lang="fr" data-langue="fr" aria-current="true">Fr</a></li>'
           '<li><a href="?lang=en" lang="en" data-langue="en">En</a></li><li><a href="?lang=ja" lang="ja" data-langue="ja">日本語</a></li></ul>')


def icones(racine="", sur_boutique=False):
    """L'espace client et le panier : deux icônes ; racine = "../" depuis le site d'un château."""
    compte = (f'<a class="entete-icone entete-compte-lien" href="{racine}compte.html" data-compte aria-label="Mon espace client">{PERSONNE}'
              f'<span class="entete-initiale" data-compte-initiale translate="no" hidden></span></a>')
    pastille = '<b class="entete-pastille" data-panier-compte translate="no" hidden>0</b>'
    if sur_boutique:
        panier = (f'<button class="entete-icone bouton-panier" type="button" data-ouvrir-panier aria-controls="panier" aria-label="Mon panier">'
                  f'{SAC}{pastille}</button>')
    else:
        panier = f'<a class="entete-icone" href="{racine}boutique.html#panier" aria-label="Mon panier">{SAC}{pastille}</a>'
    return compte + "\n      " + panier


def droite(sur_boutique=False, sur_enquete=False):
    boutique = ('<a class="entete-fort entete-fort--boutique" href="boutique.html"' + (' aria-current="page"' if sur_boutique else '')
                + f' aria-label="La boutique de la famille : les vins des trois châteaux">{BOUTEILLE}<span>La boutique</span></a>')
    enquete = ('<a class="entete-fort entete-fort--enquete" href="enquete.html"' + (' aria-current="page"' if sur_enquete else '')
               + f' aria-label="L\'enquête Miailhe : participer">{LOUPE}<span>L\'enquête</span></a>')
    return f'''<div class="header-droite">
      <!-- La boutique et l'enquête en avant, puis l'espace client, le panier et la langue (source/entete.py ; espace.js) -->
      {boutique}
      {enquete}
      {icones(sur_boutique=sur_boutique)}
      {LANGUES}
    </div>'''


PAGES = {                      # page : (sur la boutique, sur l'enquête)
    "★ MIAILHE Vitrine V1.html": (False, False),
    "enquete.html": (False, True),
    "quiz.html": (False, False),
    "boutique.html": (True, False),
    "compte.html": (False, False),
}


def main():
    for nom, (bq, enq) in PAGES.items():
        p = ICI / nom
        if not p.exists():
            continue
        s = p.read_text(encoding="utf-8")
        i = s.index('<div class="header-droite">')
        j = s.index("</div>", s.index("</ul>", s.index('class="langues', i))) + len("</div>")
        p.write_text(s[:i] + droite(bq, enq) + s[j:], encoding="utf-8")
        print("en-tête réécrit :", nom)


if __name__ == "__main__":
    main()
