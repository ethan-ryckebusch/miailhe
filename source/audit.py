"""Audit du site (29/10/2026) : chaque page, sur ordinateur (1440 × 900) et sur téléphone (390 × 844).

Pour chaque page, la page est parcourue jusqu'en bas (les images en chargement différé et les animations au
défilement se déclenchent), puis on relève :
- les erreurs JavaScript et les erreurs de la console ;
- les ressources qui ne se chargent pas (sauf les requêtes de film interrompues : Chrome abandonne la première requête
  d'un WebM une fois le début reçu, puis demande l'index à la fin du fichier ; c'est normal) ;
- les images cassées (complete et naturalWidth = 0) ;
- sur téléphone, les éléments qui débordent à droite de l'écran (défilement horizontal) ;
- le poids transféré et le temps de chargement.
Une capture pleine page de chaque vue est écrite dans le dossier donné (planches de relecture).

    python3 source/audit.py <dossier des captures> [filtre]
"""
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ICI = Path(__file__).resolve().parent
SITE = ICI.parent
VITRINE = '★ MIAILHE Vitrine V1.html'
PAGES = [
    ('vitrine', VITRINE, ''), ('vitrine-famille', VITRINE, '#famille'), ('vitrine-terroir', VITRINE, '#terroir'),
    ('vitrine-pret', VITRINE, '#pret-a-boire'), ('vitrine-carte', VITRINE, '#ou-trouver'),
    ('boutique', 'boutique.html', ''), ('boutique-pro', 'boutique.html', '?espace=pro'),
    ('coufran', 'coufran/index.html', ''), ('coufran-famille', 'coufran/famille.html', ''),
    ('verdignan', 'verdignan/index.html', ''), ('soudars', 'soudars/index.html', ''),
    ('enquete', 'enquete.html', ''), ('quiz', 'quiz.html', ''), ('compte', 'compte.html', ''),
    ('identite', 'identite.html', ''), ('instagram', 'instagram.html', '#apres'), ('blog', 'blog/index.html', ''),
    ('blog-article', 'blog/vin-pret-a-boire-bordeaux.html', ''),
]
# tous les vins de Coufran : une page de vin, pour vérifier le gabarit
PAGES.append(('coufran-vin', 'coufran/' + next(p.name for p in sorted((SITE / 'coufran').glob('*.html')) if p.name not in ('index.html', 'famille.html')), ''))

DEBORDE = """() => {
  const w = document.documentElement.clientWidth, hors = [];
  for (const e of document.querySelectorAll('body *')) {
    const r = e.getBoundingClientRect();
    if (r.width && r.right > w + 1 && getComputedStyle(e).position !== 'fixed') {
      // seulement si aucun ancêtre ne coupe ce qui dépasse
      let a = e.parentElement, coupe = false;
      while (a && a !== document.body) { const o = getComputedStyle(a); if (/(hidden|clip|auto|scroll)/.test(o.overflowX)) { coupe = true; break; } a = a.parentElement; }
      if (!coupe) hors.push((e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : e.tagName) + ' ' + Math.round(r.right - w) + 'px');
    }
  }
  return { scroll: document.documentElement.scrollWidth - w, hors: [...new Set(hors)].slice(0, 8) };
}"""
CASSEES = """() => [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src')).slice(0, 8)"""


def parcourir(p):
    h = p.evaluate('document.documentElement.scrollHeight')
    y = 0
    while y < h:
        y += 700
        p.mouse.wheel(0, 700)
        p.wait_for_timeout(120)
        h = p.evaluate('document.documentElement.scrollHeight')
    p.wait_for_timeout(600)
    p.evaluate('window.scrollTo(0, 0)')
    p.wait_for_timeout(300)


def main():
    sortie = Path(sys.argv[1])
    sortie.mkdir(parents=True, exist_ok=True)
    filtre = sys.argv[2] if len(sys.argv) > 2 else ''
    with sync_playwright() as pw:
        nav = pw.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        for vue, opts in (('bureau', dict(viewport={'width': 1440, 'height': 900})),
                          ('mobile', dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True))):
            for nom, page, suite in PAGES:
                if filtre and filtre not in nom:
                    continue
                ctx = nav.new_context(**opts)
                ctx.add_init_script("try { localStorage.setItem('miailhe-age', 'ok'); localStorage.setItem('miailhe-guide', 'ferme'); sessionStorage.setItem('miailhe-intro', 'vu'); } catch (e) {}")
                p = ctx.new_page()
                erreurs, echecs, poids = [], [], [0]
                p.on('pageerror', lambda e: erreurs.append(str(e)[:140]))
                p.on('console', lambda m: erreurs.append(m.text[:140]) if m.type == 'error' else None)
                p.on('requestfailed', lambda r: None if (r.failure == 'net::ERR_ABORTED' and r.resource_type == 'media')
                     else echecs.append(r.url.split('/Site_MIAILHE/')[-1][:90] + f' ({r.failure})'))
                def taille(r):
                    try:
                        poids[0] += len(r.body())
                    except Exception:
                        pass
                p.on('response', taille)
                t0 = time.time()
                p.goto((SITE / page).as_uri() + suite, wait_until='load')
                charge = time.time() - t0
                p.wait_for_timeout(1500)
                parcourir(p)
                d = p.evaluate(DEBORDE) if vue == 'mobile' else {'scroll': 0, 'hors': []}
                cassees = p.evaluate(CASSEES)
                p.screenshot(path=str(sortie / f'{nom}-{vue}.jpg'), type='jpeg', quality=60, full_page=True)
                ok = not (erreurs or echecs or cassees or d['scroll'] > 0)
                print(f"{'OK ' if ok else '!! '}{vue:6s} {nom:16s} {charge:4.1f}s {poids[0] / 1e6:5.1f} Mo"
                      + (f"  erreurs={erreurs[:3]}" if erreurs else '') + (f"  échecs={echecs[:4]}" if echecs else '')
                      + (f"  cassées={cassees}" if cassees else '') + (f"  débord={d['scroll']}px {d['hors']}" if d['scroll'] > 0 else ''))
                ctx.close()
        nav.close()


if __name__ == '__main__':
    main()
