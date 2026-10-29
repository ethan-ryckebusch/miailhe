/* Silhouettes gravées des trois châteaux, logotype provisoire et sceau.
   Chaque tracé porte pathLength="1" pour pouvoir se « dessiner » en CSS. */
(function () {
  const P = (d, cls = '') => `<path class="trait ${cls}" pathLength="1" d="${d}"/>`;
  const range = (a, b, step) => { const r = []; for (let x = a; x <= b; x += step) r.push(x); return r; };

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* COUFRAN : pigeonnier-belvédère + pavillon à haut toit d'ardoise et ailes balustrées */
  function coufran() {
    const balusters = (a, b) => range(a, b, 6).map(x => `M${x} 168V176`).join('');
    const cresting = range(172, 232, 6).map(x => `M${x} 92V86`).join('');
    return `<svg viewBox="0 0 320 231.5" role="img" aria-label="Château Coufran : le pigeonnier et le château">
      ${P('M8 230H312')}
      ${P('M54 230V112H94V230')}
      ${P('M54 142H94M54 172H94M54 202H94', 'leger')}
      ${P('M56 150c4 6-2 12 3 18M57 182c3 6-3 10 2 16M90 124c-3 8 3 12-1 20', 'leger')}
      ${P('M50 112V90H98V112Z')}
      ${P('M62 90V112M74 90V112M86 90V112', 'leger')}
      ${P('M44 90H104')}
      ${P('M44 90L74 60L104 90')}
      ${P('M74 60V34')}
      ${P('M74 35C80 32 86 39 93 36V45C86 48 80 41 74 44', 'plein')}
      ${P('M68 230V215Q74 208 80 215V230')}
      ${P('M118 230V176H160')}
      ${P('M118 168H160M118 176H160')}
      ${P(balusters(122, 158), 'leger')}
      ${P('M126 190h9v20h-9zM145 190h9v20h-9z')}
      ${P('M160 230V132H244V230')}
      ${P('M244 176H300V230')}
      ${P('M244 168H300')}
      ${P(balusters(248, 296), 'leger')}
      ${P('M256 190h9v20h-9zM277 190h9v20h-9z')}
      ${P('M154 132L168 92H236L250 132Z')}
      ${P(cresting + 'M168 92V80M236 92V80', 'leger')}
      ${P('M176 92V72H184V92M222 92V72H230V92')}
      ${P('M180 125V111Q186 103 192 111V125ZM212 125V111Q218 103 224 111V125Z')}
      ${P('M197 113a5 5 0 1 0 10 0a5 5 0 1 0-10 0')}
      ${P('M202 86V50')}
      ${P('M202 51C208 48 214 55 221 52V61C214 64 208 57 202 60', 'plein')}
      ${P('M160 178H244', 'leger')}
      ${P('M172 144h12v22h-12zM196 144h12v22h-12zM220 144h12v22h-12zM172 188h12v22h-12zM220 188h12v22h-12z')}
      ${P('M196 230V201Q202 193 208 201V230')}
      ${P('M191 198L202 190L213 198', 'leger')}
      ${P('M14 230l2-5M24 230l-1-4M108 230l2-4M304 230l-2-5M290 230l1-4', 'leger')}
    </svg>`;
  }

  /* VERDIGNAN : tour à flèche conique, pignon, tour carrée crénelée, tourelle à dôme, aile à fronton */
  function verdignan() {
    const win = (xs, y, w, h) => xs.map(x => `M${x} ${y}h${w}v${h}h-${w}z`).join('');
    return `<svg viewBox="0 0 320 231.5" role="img" aria-label="Château Verdignan : la tour à flèche et le logis">
      ${P('M8 230H312')}
      ${P('M40 230V202M40 204c-14 2-20-14-10-22c-4-12 12-18 18-10c8-8 20 0 14 12c8 8-2 22-14 18', 'leger')}
      ${P('M60 230V122M96 230V122')}
      ${P('M60 160Q78 165 96 160M60 198Q78 203 96 198', 'leger')}
      ${P('M78 138v12M78 176v12')}
      ${P('M73 207h10v14h-10z')}
      ${P('M55 122L78 34L101 122')}
      ${P('M55 122Q78 129 101 122')}
      ${P('M76 52L67 118M81 52L90 118M78 60V120', 'leger')}
      ${P('M78 34V19')}
      ${P('M76 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0')}
      ${P('M96 146V230M150 146V230')}
      ${P('M92 146L123 110L154 146H92')}
      ${P('M117 126h12v11h-12z')}
      ${P(win([104, 129], 158, 14, 20) + win([104, 129], 194, 14, 20))}
      ${P('M150 120V230M176 120V230')}
      ${P('M148 120V112H154V117H160V112H166V117H172V112H178V120Z')}
      ${P(win([158], 140, 10, 16) + win([158], 176, 10, 16))}
      ${P('M176 150V230M306 150V230')}
      ${P('M172 150L184 136H298L310 150H172')}
      ${P('M206 136V124H214V136M268 136V124H276V136')}
      ${P('M183 150V124M197 150V124M181 124Q190 106 199 124H181')}
      ${P('M190 131v9', 'leger')}
      ${P(win([206, 224, 266, 284], 160, 10, 18) + win([206, 224, 266, 284], 198, 10, 20) + win([245], 160, 10, 18))}
      ${P('M243 230V203H257V230')}
      ${P('M239 203Q243 195 250 197Q257 195 261 203', 'leger')}
      ${P('M248 189a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'leger')}
    </svg>`;
  }

  /* SOUDARS : pas de château. Un enclos de pierres sèches, des rangs de vigne,
     et au centre un vieux cep : à Soudars, le monument, c'est la vigne. */
  function soudars(seed = 1973) {
    const r = rng(seed);
    const j = (a) => (r() - .5) * a;
    const pierre = (x, y, w, h) => {
      const pts = [[x + j(2), y + j(1.5)], [x + w * .45 + j(3), y - 1 + j(1.5)], [x + w + j(2), y + j(1.5)],
        [x + w + 1 + j(1.5), y + h * .55 + j(1.5)], [x + w + j(2), y + h + j(1)], [x + w * .5 + j(3), y + h + 1 + j(1)],
        [x + j(2), y + h + j(1)], [x - 1 + j(1.5), y + h * .5 + j(1.5)]];
      return 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
    };
    const FEUILLE = [[-4, -2], [-10, -4], [-7, -7], [-9, -12], [-3, -10], [0, -16], [3, -10], [9, -12], [7, -7], [10, -4], [4, -2]];
    const feuille = (x, y, s = 1) => `M${x} ${y}` + FEUILLE.map(([a, b]) => `L${(x + a * s).toFixed(1)} ${(y + b * s).toFixed(1)}`).join('') + 'Z';
    let pierres = '';
    [[201, 9], [211, 9.5], [221.5, 8.5]].forEach(([y, h], i) => {
      let x = 12 + (i % 2) * 8;
      while (x < 306) {
        const w = 13 + r() * 15;
        if (!(x + w > 138 && x < 182)) pierres += pierre(x, y + j(1), Math.min(w, 306 - x), h + j(1.5));
        x += w + 1.4;
      }
    });
    [[126, 182], [182, 182]].forEach(([x0, top]) => {
      for (let y = top; y < 228; y += 9.6) pierres += pierre(x0 + j(1.5), y, 12, 8.6);
    });
    let fond = '';
    for (let x = 64; x < 258; x += 10 + r() * 6) fond += pierre(x, 170, 7 + r() * 4, 4.5);
    const piquets = [34, 68, 98, 222, 252, 286];
    const rangs = piquets.map(x => `M${x} 201V${156 + j(6)}`).join('');
    const feuillage = piquets.map(x => feuille(x - 4 + j(8), 164 + j(10), .55) + feuille(x + 6 + j(6), 180 + j(8), .5)).join('');
    const cep = 'M156 230C153 214 161 204 157 192C154 182 162 172 159 160C157 154 160 150 159 146' +
      'M165 230C163 214 169 204 166 192C164 182 169 172 166 160C165 154 166 150 166 146' +
      'M159 150C148 146 136 146 118 149M166 150C177 146 190 146 208 149';
    const sarments = 'M128 148C126 136 131 126 127 114M148 147C148 134 153 124 149 110M178 147C180 134 175 124 179 110M198 148C200 136 195 126 199 114';
    const feuilles = feuille(127, 118) + feuille(149, 114) + feuille(179, 114) + feuille(199, 118) + feuille(140, 134, .8) + feuille(188, 134, .8);
    let grappe = '';
    [[186, 156], [190.5, 156], [195, 156], [188, 160], [192.5, 160], [190, 164.2]].forEach(([x, y]) => { grappe += `M${x - 2.2} ${y}a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0-4.4 0`; });
    let fos = 'M262 216';
    for (let a = 0; a < Math.PI * 5; a += .25) {
      const rad = .5 * Math.exp(.19 * a);
      fos += `L${(262 + Math.cos(a) * rad).toFixed(2)} ${(216 + Math.sin(a) * rad).toFixed(2)}`;
    }
    return `<svg viewBox="0 0 320 231.5" role="img" aria-label="Château Soudars : l'enclos de pierres sèches et le vieux cep">
      ${P('M8 230H312')}
      ${P('M8 172C60 164 110 162 160 163C214 164 262 167 312 174', 'leger')}
      ${P(fond, 'leger')}
      ${P('M26 166H112M208 166H296', 'leger')}
      ${P(rangs)}
      ${P(feuillage, 'leger')}
      ${P(cep)}
      ${P(sarments)}
      ${P(feuilles)}
      ${P(grappe, 'plein')}
      ${P(pierres)}
      ${P(fos, 'leger')}
    </svg>`;
  }

  /* Sceau du courtier : piste de marque secondaire */
  function sceau() {
    return `<svg viewBox="0 0 320 320" role="img" aria-label="Sceau MIAILHE : courtiers 1793, vignerons 1924">
      <defs><path id="cercle-sceau" d="M160 160m-118 0a118 118 0 1 1 236 0a118 118 0 1 1-236 0"/></defs>
      <g class="tourne">
        <circle cx="160" cy="160" r="140" fill="none" stroke="currentColor" stroke-width="1"/>
        <circle cx="160" cy="160" r="132" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 5"/>
        <text font-family="Cinzel, serif" font-size="14" fill="currentColor">
          <textPath href="#cercle-sceau" textLength="728" lengthAdjust="spacing">MIAILHE · COURTIERS 1793 · VIGNERONS 1924 ·</textPath>
        </text>
      </g>
      <circle cx="160" cy="160" r="98" fill="none" stroke="currentColor" stroke-width="1"/>
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M100 168H220" stroke-width="1"/>
        <path d="M160 168V122"/>
        <path d="M160 132C150 122 132 120 120 126M160 128C160 116 162 104 170 96M160 130C170 120 188 118 200 126"/>
        <path d="M160 168C160 184 158 196 160 214M160 184C150 192 140 196 128 196M160 190C170 198 180 200 194 198M160 204C154 210 146 212 138 214M160 206C166 212 174 214 182 216" stroke-width="1.4"/>
      </g>
      <text x="160" y="248" text-anchor="middle" font-family="Cinzel, serif" font-size="11" letter-spacing="5" fill="currentColor">M</text>
    </svg>`;
  }


  window.MIAILHE = Object.assign(window.MIAILHE || {}, { rng, sceau });

  document.querySelectorAll('[data-vignette]').forEach(el => {
    const k = el.dataset.vignette;
    el.innerHTML = k === 'coufran' ? coufran() : k === 'verdignan' ? verdignan() : soudars();
  });
  document.querySelectorAll('[data-sceau]').forEach(el => { el.innerHTML = sceau(); });
})();
