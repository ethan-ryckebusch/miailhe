"""Le menu plein écran (d'après chateau-cheval-blanc.com), le même sur la vitrine et l'Enquête (27/10/2026).

Une seule source : ce script réécrit le bloc <nav class="mainnav"> des deux pages. Sur la vitrine, « Trouver mon
château » ouvre le test au seuil (data-ouvrir-test) ; ailleurs, il mène à quiz.html.

    python3 source/menu_principal.py
"""
from pathlib import Path

ICI = Path(__file__).resolve().parent.parent
VITRINE = "★ MIAILHE Vitrine V1.html"
V = "%E2%98%85%20MIAILHE%20Vitrine%20V1.html"


def menu(sur_vitrine):
    a = "" if sur_vitrine else V          # les ancres de la vitrine
    test = 'href="#accueil" data-ouvrir-test' if sur_vitrine else 'href="quiz.html"'
    temoins = " ".join(f'<a href="{k}/index.html#temoin"><span>{n}</span></a>' for k, n in
                       (("coufran", "Coufran"), ("verdignan", "Verdignan"), ("soudars", "Soudars")))
    return f'''<nav class="mainnav" id="menu-principal" aria-label="Menu principal" aria-hidden="true">
    <div class="mainnav-contenu">
      <div class="mainnav-enquete">
        <p class="titre-3">L'enquête &nbsp;—&nbsp; <a class="lien-trait" href="enquete.html">Enquête à la racine</a></p>
        <a class="couverture-enquete couverture-enquete--racine" href="enquete.html" aria-label="Ouvrir le dossier de l'enquête">
          <span class="marque">Miailhe</span>
          <span class="photo"><img src="assets/img/enquete/couverture-racines.jpg" alt="" loading="lazy"></span>
          <span class="cachet">Dossier n° 1924-001</span>
          <span class="loupe" aria-hidden="true"></span>
          <span class="titre"><span>Enquête</span><br><span>à la racine</span></span>
        </a>
        <p class="mainnav-trimestre">Une nouvelle enquête chaque trimestre</p>
      </div>
      <div class="mainnav-menus">
        <ul class="menu-principal">
          <li><a href="{a}#accueil"><span>Nos châteaux<span class="num">I.</span></span></a>
            <ul class="sous-menu">
              <li><a href="coufran/index.html?porte"><span>Château Coufran</span></a></li>
              <li><a href="verdignan/index.html?porte"><span>Château Verdignan</span></a></li>
              <li><a href="soudars/index.html?porte"><span>Château Soudars</span></a></li>
              <li><a {test}><span>Quel château vous ressemble ?</span></a></li>
              <li><a href="boutique.html"><span>La boutique des trois châteaux</span></a></li>
              <li><a href="boutique.html#ou-trouver"><span>Où trouver nos vins</span></a></li>
            </ul>
          </li>
          <li><a href="{a}#famille"><span>La famille<span class="num">II.</span></span></a>
            <ul class="sous-menu">
              <li><a href="{a}#famille"><span>Cinq générations</span></a></li>
              <li><a href="{a}#racine"><span>Une même racine</span></a></li>
              <li><a href="{a}#pret-a-boire"><span>Le prêt-à-boire</span></a></li>
              <li><a href="blog/index.html"><span>Le blog de la famille</span></a></li>
              <li><a href="identite.html"><span>Notre identité</span></a></li>
            </ul>
          </li>
          <li><a href="enquete.html"><span>L'enquête<span class="num">III.</span></span></a>
            <ul class="sous-menu">
              <li><a href="enquete.html"><span>Ouvrir le dossier</span></a></li>
              <li><a href="enquete.html#inscription"><span>S'inscrire</span></a></li>
              <li class="sous-groupe"><span class="sous-label">Les témoins</span> {temoins}</li>
              <li><a href="enquete.html#reglement"><span>Le règlement</span></a></li>
            </ul>
          </li>
          <li><a href="{a}#visiter"><span>Visiter<span class="num">IV.</span></span></a>
            <ul class="sous-menu">
              <li><a href="{a}#visiter"><span>Venir à Saint-Seurin</span></a></li>
              <li><a href="{a}#contact"><span>Visites sur rendez-vous</span></a></li>
              <li><a href="boutique.html?espace=pro"><span>Professionnels</span></a></li>
            </ul>
          </li>
        </ul>
        <ul class="menu-second">
          <li><a href="boutique.html"><span>La boutique</span></a></li>
          <li><a href="boutique.html#panier"><span>Mon panier</span></a></li>
          <li><a {test}><span>Trouver mon château</span></a></li>
          <li><a href="blog/index.html"><span>Le blog</span></a></li>
          <li><a href="{a}#contact"><span>Contact &amp; accès</span></a></li>
        </ul>
        <ul class="menu-third">
          <li><nav class="reseaux" data-reseaux></nav></li>
          <li><a href="compte.html"><span>Mon espace client</span></a></li>
          <li><a href="boutique.html?espace=pro"><span>Espace professionnel</span></a></li>
          <li><ul class="langues langues--menu" aria-label="Langue du site"><li><a href="?lang=fr" lang="fr" data-langue="fr" aria-current="true">Fr</a></li><li><a href="?lang=en" lang="en" data-langue="en">En</a></li><li><a href="?lang=ja" lang="ja" data-langue="ja">日本語</a></li></ul></li>
        </ul>
      </div>
    </div>
  </nav>'''


def main():
    for nom, vit in ((VITRINE, True), ("enquete.html", False)):
        p = ICI / nom
        s = p.read_text(encoding="utf-8")
        i = s.index('<nav class="mainnav"')
        # le bloc se termine au </nav> qui suit la fermeture de .mainnav-contenu
        j = s.index("</nav>", s.index("</div>\n    </div>", i)) + len("</nav>")
        p.write_text(s[:i] + menu(vit) + s[j:], encoding="utf-8")
        print("menu réécrit :", nom)


if __name__ == "__main__":
    main()
