/* instagram.html : le compte Instagram de la famille, avant et après (28/10/2026).
   Les icônes sont celles de la vraie page (relevées connecté) ; les deux profils sont décrits ici puis dessinés dans
   [data-profil]. Avant : @chateauxcoufranverdignan et ses 12 dernières publications. Après : le même compte renommé
   @famillemiailhe, qui garde ses chiffres et ses abonnés, avec ses 48 premières publications sur trois colonnes, dont
   12 reels et un triptyque épinglé (des images générées d'après le moodboard de l'équipe, en attendant le vrai
   shooting). */
(function () {
  /* ---------- Les icônes d'Instagram ---------- */
  const ICONES = {
    instagram: '<path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"></path>',
    accueil: '<path d="m21.762 8.786-7-6.68C13.266.68 10.734.68 9.238 2.106l-7 6.681A4.017 4.017 0 0 0 1 11.68V20c0 1.654 1.346 3 3 3h5.005a1 1 0 0 0 1-1L10 15c0-1.103.897-2 2-2 1.09 0 1.98.877 2 1.962L13.999 22a1 1 0 0 0 1 1H20c1.654 0 3-1.346 3-3v-8.32a4.021 4.021 0 0 0-1.238-2.894ZM21 20a1 1 0 0 1-1 1h-4.001L16 15c0-2.206-1.794-4-4-4s-4 1.794-4 4l.005 6H4a1 1 0 0 1-1-1v-8.32c0-.543.226-1.07.62-1.447l7-6.68c.747-.714 2.013-.714 2.76 0l7 6.68c.394.376.62.904.62 1.448V20Z"></path>',
    reels: '<path d="M22.935 7.468c-.063-1.36-.307-2.142-.512-2.67a5.341 5.341 0 0 0-1.27-1.95 5.345 5.345 0 0 0-1.95-1.27c-.53-.206-1.311-.45-2.672-.513C15.333 1.012 14.976 1 12 1s-3.333.012-4.532.065c-1.36.063-2.142.307-2.67.512-.77.298-1.371.69-1.95 1.27a5.36 5.36 0 0 0-1.27 1.95c-.206.53-.45 1.311-.513 2.672C1.012 8.667 1 9.024 1 12s.012 3.333.065 4.532c.063 1.36.307 2.142.512 2.67.297.77.69 1.372 1.27 1.95.58.581 1.181.974 1.95 1.27.53.206 1.311.45 2.672.513C8.667 22.988 9.024 23 12 23s3.333-.012 4.532-.065c1.36-.063 2.142-.307 2.67-.512a5.33 5.33 0 0 0 1.95-1.27 5.356 5.356 0 0 0 1.27-1.95c.206-.53.45-1.311.513-2.672.053-1.198.065-1.555.065-4.531s-.012-3.333-.065-4.532Zm-1.998 8.972c-.05 1.07-.228 1.652-.38 2.04-.197.51-.434.874-.82 1.258a3.362 3.362 0 0 1-1.258.82c-.387.151-.97.33-2.038.379-1.162.052-1.51.063-4.441.063s-3.28-.01-4.44-.063c-1.07-.05-1.652-.228-2.04-.38a3.354 3.354 0 0 1-1.258-.82 3.362 3.362 0 0 1-.82-1.258c-.151-.387-.33-.97-.379-2.038C3.011 15.28 3 14.931 3 12s.01-3.28.063-4.44c.05-1.07.228-1.652.38-2.04.197-.51.434-.875.82-1.26a3.372 3.372 0 0 1 1.258-.819c.387-.15.97-.329 2.038-.378C8.72 3.011 9.069 3 12 3s3.28.01 4.44.063c1.07.05 1.652.228 2.04.38.51.197.874.433 1.258.82.385.382.622.747.82 1.258.151.387.33.97.379 2.038C20.989 8.72 21 9.069 21 12s-.01 3.28-.063 4.44Zm-4.584-6.828-5.25-3a2.725 2.725 0 0 0-2.745.01A2.722 2.722 0 0 0 6.988 9v6c0 .992.512 1.88 1.37 2.379.432.25.906.376 1.38.376.468 0 .937-.123 1.365-.367l5.25-3c.868-.496 1.385-1.389 1.385-2.388s-.517-1.892-1.385-2.388Zm-.993 3.04-5.25 3a.74.74 0 0 1-.748-.003.74.74 0 0 1-.374-.649V9a.74.74 0 0 1 .374-.65.737.737 0 0 1 .748-.002l5.25 3c.341.196.378.521.378.652s-.037.456-.378.651Z"></path>',
    messages: '<path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"></line>',
    recherche: '<path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>',
    notifications: '<path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>',
    nouvelle: '<path d="M21 11h-8V3a1 1 0 1 0-2 0v8H3a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-8h8a1 1 0 1 0 0-2Z"></path>',
    tableau: '<path d="M8 12a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1Zm8-3a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Zm-4-2a1 1 0 0 0-1 1v8a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Z"></path><path d="M18.44 1H5.567a4.565 4.565 0 0 0-4.56 4.56v12.873a4.565 4.565 0 0 0 4.56 4.56H18.44a4.565 4.565 0 0 0 4.56-4.56V5.56A4.565 4.565 0 0 0 18.44 1ZM21 18.433a2.563 2.563 0 0 1-2.56 2.56H5.567a2.563 2.563 0 0 1-2.56-2.56V5.56A2.563 2.563 0 0 1 5.568 3H18.44A2.563 2.563 0 0 1 21 5.56v12.873Z"></path>',
    parametres: '<line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" x2="21" y1="4" y2="4"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" x2="21" y1="12" y2="12"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" x2="21" y1="20" y2="20"></line>',
    meta: '<path d="M9.5 11h5c1.379 0 2.5-1.122 2.5-2.5v-5C17 2.122 15.879 1 14.5 1h-5A2.503 2.503 0 0 0 7 3.5v5C7 9.878 8.12 11 9.5 11ZM9 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5ZM8.499 13h-5a2.503 2.503 0 0 0-2.5 2.5v5c0 1.378 1.12 2.5 2.5 2.5h5c1.379 0 2.5-1.122 2.5-2.5v-5c0-1.378-1.121-2.5-2.5-2.5Zm.5 7.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5Zm11.5-7.5h-5a2.503 2.503 0 0 0-2.5 2.5v5c0 1.378 1.12 2.5 2.5 2.5h5c1.379 0 2.5-1.122 2.5-2.5v-5c0-1.378-1.121-2.5-2.5-2.5Zm.5 7.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5Z"></path>',
    options: '<circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>',
    similaires: '<path d="M4 14V8a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0Z" fill="currentColor"></path><path d="M8 10a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2h6Zm9.5-2.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Zm2 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-4.501 5.667c3.147 0 5.945 1.495 7.61 3.801.889 1.231.185 2.837-1.18 3.215-1.34.372-3.549.817-6.429.817-2.878 0-5.091-.447-6.44-.822-1.37-.38-2.048-1.995-1.17-3.212 1.666-2.305 4.463-3.8 7.609-3.8Zm0 2c-2.51 0-4.702 1.191-5.987 2.971-.01.015-.012.024-.012.024 0 .003 0 .01.004.02s.012.023.024.035c.012.01.032.025.068.035C10.297 18.585 12.33 19 15 19c2.674 0 4.7-.413 5.895-.744a.182.182 0 0 0 .076-.038.096.096 0 0 0 .025-.038.044.044 0 0 0 .004-.017s0-.008-.012-.024c-1.285-1.78-3.478-2.972-5.989-2.972Z" fill="currentColor"></path>',
    publications: '<rect height="6" rx="1" ry="1" width="4.667" x="3" y="1"></rect><rect height="6" rx="1" ry="1" width="4.667" x="16.333" y="1"></rect><rect height="6" rx="1" ry="1" width="4.667" x="9.667" y="1"></rect><rect height="6" rx="1" ry="1" width="4.667" x="3" y="9"></rect><rect height="6" rx="1" ry="1" width="4.667" x="16.333" y="9"></rect><rect height="6" rx="1" ry="1" width="4.667" x="9.667" y="9"></rect><rect height="6" rx="1" ry="1" width="4.667" x="3" y="17"></rect><rect height="6" rx="1" ry="1" width="4.667" x="16.333" y="17"></rect><rect height="6" rx="1" ry="1" width="4.667" x="9.667" y="17"></rect>',
    republications: '<path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27z"></path>',
    identifie: '<path d="M21 7.48a2 2 0 0 0-2-2h-3.046a2.002 2.002 0 0 1-1.506-.683l-1.695-1.939a1 1 0 0 0-1.506 0L9.552 4.797c-.38.434-.93.682-1.506.682H5a2 2 0 0 0-2 2V19l.01.206A2 2 0 0 0 5 21h14a2 2 0 0 0 2-2V7.48ZM23 19a4 4 0 0 1-4 4H5a4 4 0 0 1-3.995-3.794L1 19V7.48a4 4 0 0 1 4-4h3.046l1.696-1.94a3 3 0 0 1 4.516 0l1.696 1.94H19a4 4 0 0 1 4 4V19Z"></path><path d="M14.5 10.419a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Zm2 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM12 16.003c3.511 0 6.555 1.99 8.13 4.906a1 1 0 0 1-1.76.95c-1.248-2.31-3.64-3.857-6.37-3.857S6.878 19.55 5.63 21.86a1 1 0 0 1-1.76-.951c1.575-2.915 4.618-4.906 8.13-4.906Z"></path>',
    epingle: '<path d="m22.707 7.583-6.29-6.29a1 1 0 0 0-1.414 0 5.183 5.183 0 0 0-1.543 3.593L8.172 8.79a5.161 5.161 0 0 0-4.768 1.42 1 1 0 0 0 0 1.414l3.779 3.778-5.89 5.89a1 1 0 1 0 1.414 1.414l5.89-5.89 3.778 3.779a1 1 0 0 0 1.414 0 5.174 5.174 0 0 0 1.42-4.769l3.905-5.287a5.183 5.183 0 0 0 3.593-1.543 1 1 0 0 0 0-1.414Z"></path>',
    clip: '<path d="M22.942 7.464c-.062-1.36-.306-2.143-.511-2.671a5.366 5.366 0 0 0-1.272-1.952 5.364 5.364 0 0 0-1.951-1.27c-.53-.207-1.312-.45-2.673-.513-1.2-.054-1.557-.066-4.535-.066s-3.336.012-4.536.066c-1.36.062-2.143.306-2.672.511-.769.3-1.371.692-1.951 1.272s-.973 1.182-1.27 1.951c-.207.53-.45 1.312-.513 2.673C1.004 8.665.992 9.022.992 12s.012 3.336.066 4.536c.062 1.36.306 2.143.511 2.671.298.77.69 1.373 1.272 1.952.58.581 1.182.974 1.951 1.27.53.207 1.311.45 2.673.513 1.199.054 1.557.066 4.535.066s3.336-.012 4.536-.066c1.36-.062 2.143-.306 2.671-.511a5.368 5.368 0 0 0 1.953-1.273c.58-.58.972-1.181 1.27-1.95.206-.53.45-1.312.512-2.673.054-1.2.066-1.557.066-4.535s-.012-3.336-.066-4.536Zm-7.085 6.055-5.25 3c-1.167.667-2.619-.175-2.619-1.519V9c0-1.344 1.452-2.186 2.619-1.52l5.25 3c1.175.672 1.175 2.368 0 3.04Z"></path>',
    carrousel: '<path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>',
    lien: '<path d="m9.726 5.123 1.228-1.228a6.47 6.47 0 0 1 9.15 9.152l-1.227 1.227m-4.603 4.603-1.228 1.228a6.47 6.47 0 0 1-9.15-9.152l1.227-1.227" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="8.471" x2="15.529" y1="15.529" y2="8.471"></line>',
    vide: '<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 2v9.6l-3.3-3.3a1 1 0 0 0-1.4 0L9 16.6l-2.3-2.3a1 1 0 0 0-1.4 0L5 14.6V5h14ZM8.5 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" opacity=".9"></path>',
  };
  const svg = (nom, t = 24, extra = '') => `<svg width="${t}" height="${t}" viewBox="${nom === 'carrousel' ? '0 0 48 48' : '0 0 24 24'}" fill="currentColor"${extra || ' aria-hidden="true"'}>${ICONES[nom]}</svg>`;
  document.querySelectorAll('svg[data-icone]').forEach(s => { s.innerHTML = ICONES[s.dataset.icone]; });
  const IMG = 'assets/img/instagram/';

  /* ---------- Les deux profils ---------- */
  const PROFILS = {
    avant: {
      titre: 'Châteaux Coufran & Verdignan (@chateauxcoufranverdignan) • Photos et vidéos Instagram',
      compte: 'chateauxcoufranverdignan', nom: 'Châteaux Coufran & Verdignan', categorie: '',
      avatar: `<img src="${IMG}avant-profil.jpg" alt="Photo de profil de chateauxcoufranverdignan">`,
      bio: '🍷 Aged for you. Shipped worldwide 🌎\nBordeaux without the fuss | Lovely & Fred',
      lien: ['linktr.ee/famillemiailhe', 'https://linktr.ee/famillemiailhe'],
      une: [['📍Haut-Medoc', 'haut-medoc'], ['📆Occasions', 'occasions'], ['Fred explique', 'fred-explique'], ['🍷Battles', 'battles'], ['🌎✈️Worlwide Fred', 'worldwide']]
        .map(([t, f]) => [t, `<img src="${IMG}avant-une-${f}.jpg" alt="Image de la story à la une de chateauxcoufranverdignan">`]),
      // les 12 premières publications de la grille, dans l'ordre (les trois premières sont épinglées)
      grille: [
        ['reel', 'DQZryvNDCnx', 'epingle', 'Vidéo de Châteaux Coufran & Verdignan : Wine family'],
        ['reel', 'DVyqRl-iArO', 'epingle', 'Vidéo de Châteaux Coufran & Verdignan : Aging cave'],
        ['reel', 'DXhOSvPRqS4', 'epingle', 'Vidéo de Châteaux Coufran & Verdignan : Good times'],
        ['p', 'Dc0OjFuMFM0', '', 'Photo de Châteaux Coufran & Verdignan : Big Gerbaude Médocaine'],
        ['p', 'DbGlIPys4vF', '', 'Photo de Châteaux Coufran & Verdignan : Château Coufran 2020'],
        ['reel', 'DaiYr_cxslp', 'clip', 'Vidéo de Châteaux Coufran & Verdignan : Battles vin, poulet basquaise, partie 2'],
        ['reel', 'DaQXIk3xitq', 'clip', 'Vidéo de Châteaux Coufran & Verdignan : Battles vin, poulet basquaise, partie 1'],
        ['p', 'DZpJYEjDB9a', 'carrousel', 'Photo de Châteaux Coufran & Verdignan : Coup-franc = Coufran'],
        ['reel', 'DXwH9yos0V_', 'clip', 'Vidéo de Châteaux Coufran & Verdignan'],
        ['reel', 'DXY_VKLjNNI', 'clip', 'Vidéo de Châteaux Coufran & Verdignan'],
        ['reel', 'DVd_TlZDHIV', 'clip', 'Vidéo de Châteaux Coufran & Verdignan : France 3 Côté châteaux'],
        ['reel', 'DVJdm-7CKaK', 'clip', 'Vidéo de Châteaux Coufran & Verdignan : Fred t’explique le verre idéal'],
      ],
    },
    apres: {
      titre: 'Famille Miailhe – Vins de Bordeaux (@famillemiailhe) • Photos et vidéos Instagram',
      // le nom est cherché par Instagram, la bio presque pas : « Famille Miailhe » suivi de mots-clés sur une ligne
      // (29/10/2026, demande de l'utilisateur : « pour le SEO ») ; Bordeaux, le mot le plus cherché, que la bio a dû
      // laisser tomber, le Haut-Médoc restant dans la bio
      compte: 'famillemiailhe', nom: 'Famille Miailhe – Vins de Bordeaux', categorie: 'Vignoble',
      // le badge bleu de compte vérifié (29/10/2026, demande de l'utilisateur) ; en vrai, il s'obtient par l'abonnement
      // Meta Verified ou par une demande de vérification acceptée par Instagram
      certifie: true,
      avatar: '',     // le logo MIAILHE, dessiné plus bas
      // la dernière ligne (« ⏳ Nous attendons pour vous : prêts à boire ») est remplacée par un hook et un appel à
      // l'action vers le test de découverte, proposé dès l'accueil de miailhe.com (28/10/2026, demande de l'utilisateur) ;
      // puis la première ligne porte la signature « 3 châteaux, 1 même racine » avec la famille, et 1924 passe sur la
      // ligne du lieu (même jour, demande de l'utilisateur ; « Bordeaux » tombe pour tenir sous les 150 caractères) ;
      // le 29/10/2026, « 1 famille » en chiffre comme les deux autres (demande de l'utilisateur : « 1 (pas une) famille »)
      bio: '1 famille, 3 châteaux, 1 même racine.\n🍷 Coufran · Verdignan · Soudars\n📍 Haut-Médoc, depuis 1924\n👇 Quel château vous ressemble ? Faites le test',
      lien: ['miailhe.com', '%E2%98%85%20MIAILHE%20Vitrine%20V1.html'],
      // aucune story de l'ancien compte (28/10/2026, demande de l'utilisateur). Le 29/10/2026, toutes les bulles parlent
      // la même langue, un pictogramme blanc et plat comme la racine de « La famille », sur la couleur du château ou sur
      // noir pour la famille (les logos des châteaux devenaient illisibles dans le rond), et la boutique s'ajoute
      // (Recommandation/Instagram/source/unes_pictogrammes.py ; Visites et L'enquête, ajoutées le même jour, retirées
      // à la demande de l'utilisateur)
      une: [
        ['La famille', 'famille', 'une racine blanche qui descend et se ramifie'],
        ['Coufran', 'coufran', 'le belvédère de Coufran, en blanc sur l’or du château'],
        ['Verdignan', 'verdignan', 'la tour et la flèche de Verdignan, en blanc sur le bleu du château'],
        ['Soudars', 'soudars', 'un jeune pied de vigne sur les pierres de la friche, en blanc sur le vert de Soudars'],
        ['Boutique', 'boutique', 'une bouteille'],
        ['Actualité', 'actualite', 'la feuille de vigne du logo MIAILHE, en blanc'],
      ].map(([t, f, a]) => [t, `<img src="${IMG}apres-une-${f}.jpg" alt="Image de la story à la une de famillemiailhe : ${a}">`]),
      // les 54 premières publications, dont 13 reels (seule leur couverture est faite), générées sur Higgsfield d'après
      // le moodboard de l'équipe (28/10/2026 : Haut-Médoc, trois colonnes, les anciennes séries de Lovely et Fred
      // redessinées ; puis un quatrième lot : le triptyque épinglé des trois châteaux, 20 visuels avec Lovely et Fred,
      // un post par château, la fête des pères ; le 29/10/2026, un cinquième : visite guidée, jeu, journées du
      // patrimoine, retour en rayon, Soudars et ses partenaires). Depuis le 29/10/2026, l'ordre suit le calendrier de
      // publication daté de Feed/source/exporter_feed.py, qui écrit ces lignes : ne pas les modifier à la main.
      // « clip » est l'icône reel d'Instagram ; les trois premières publications, le triptyque, sont épinglées :
      // côte à côte, elles forment un seul visuel.
      grille: [
        ['local', '01', 'epingle', 'Triptyque épinglé, 1 sur 3 : Château Coufran dans le paysage du Haut-Médoc, le début du logo MIAILHE et « 3 châteaux, 1 même racine »'],
        ['local', '02', 'epingle', 'Triptyque épinglé, 2 sur 3 : Château Verdignan, la racine du logo MIAILHE qui plonge derrière sa flèche'],
        ['local', '03', 'epingle', 'Triptyque épinglé, 3 sur 3 : Château Soudars, la fin du logo MIAILHE, « Haut-Médoc, depuis 1924 »'],
        ['local', '04', '', 'Sur un fond or, la bouteille de Château Coufran, une grappe de merlot et des galets : 85 % merlot, le Pomerol du Médoc'],
        ['local', '05', '', 'Lovely et Fred montrent leurs mains violettes après les vendanges'],
        ['local', '06', '', 'Les bulles du moût en fermentation, en très gros plan'],
        ['local', '07', 'clip', 'Reel Les coulisses : trois semaines de vendanges, Lovely et Fred et leur panier de merlot'],
        ['local', '08', '', 'Une grappe de cabernet mûre, couverte de pruine et de rosée, dans la lumière du matin'],
        ['local', '09', '', 'Lovely et Fred trient les grappes à la table de tri'],
        ['local', '10', '', 'Coufran et Verdignan dans un panier de courses entre les rangs : de retour en rayon chez Auchan, E.Leclerc, Carrefour et Intermarché'],
        ['local', '11', 'clip', 'Reel Vin contre vin : l’entrecôte grillée sur les sarments, à même la grave, Coufran ou Verdignan ?'],
        ['local', '12', '', 'Sur le fond bleu de Verdignan, en ligne : du raisin, un flacon de moût, une douelle de barrique et un verre de rouge, les quatre étapes du vin'],
        ['local', '13', '', 'Château Coufran en fin d’après-midi, la porte ouverte, un chapeau de paille sur une chaise : chez Louis, le grand-père'],
        ['local', '14', '', 'Sur un fond vert, la bouteille de Château Soudars, des pierres blanches de la friche et un coquelicot : né d’une friche'],
        ['local', '15', 'clip', 'Reel Gardé pour vous : la plus vieille bouteille de la cave, devinez l’année'],
        ['local', '16', '', 'L’ombre d’une main qui tend une grappe, sur le mur du chai'],
        ['local', '17', '', 'Lovely et Fred accroupis au pied d’une vieille vigne chargée de raisin, la main de Fred sur le tronc'],
        ['local', '18', '', 'Au comptoir de l’Office de tourisme de Bordeaux, le logo de la ville au mur et le flyer de l’Enquête à la racine : le dossier est à Bordeaux'],
        ['local', '19', 'clip', 'Reel Enquête à la racine : des bouteilles ont disparu, Lovely à la loupe, Fred à la lanterne ; l’enquête se joue sur le site, une bouteille à gagner'],
        ['local', '20', '', 'La tour et la flèche de Verdignan à l’heure bleue, au-dessus des rangs : chez Jean, le père'],
        ['local', '21', '', 'Lovely porte une caisse de vin, Fred charge un coffre devant la grille du château : vous commandez sur miailhe.com, on charge, retrait gratuit au château'],
        ['local', '22', '', 'Château Soudars au ras des pierres, ses jeunes vignes sur l’ancienne friche'],
        ['local', '23', 'clip', 'Reel Visites guidées : Lovely raconte, Fred porte la caisse de dégustation, des visiteurs de dos, le belvédère de Coufran au bout des rangs'],
        ['local', '24', '', 'Deux mains sortent du feuillage des vignes et lèvent une bouteille de Château Coufran et un verre de rouge contre le ciel'],
        ['local', '25', '', 'Lovely et Fred au bout d’un carrelet, face à l’estuaire de la Gironde'],
        ['local', '26', '', 'Fred de dos, chemise rayée, contre un mur de pierre et de vigne, une bouteille de Château Verdignan et deux verres tenus dans le dos'],
        ['local', '27', 'clip', 'Reel : les mains d’un vigneron tiennent une carte au trésor ; Coufran, Verdignan et Soudars reliés par une même racine au sceau de la famille Miailhe'],
        ['local', '28', '', 'Fête des pères : le coffret des trois générations, Coufran, Verdignan et Soudars, offert de mains en mains. De père en fils'],
        ['local', '29', '', 'Lovely et Fred au pied du belvédère de Coufran, dans son ombre'],
        ['local', '30', '', 'Les chais de Soudars aux volets rouges, des coquelicots et des pierres blanches au pied des jeunes vignes : chez Éric, le fils'],
        ['local', '31', 'clip', 'Reel Vin contre vin : un gigot d’agneau de Pauillac servi dans les vignes du Médoc, Coufran ou Verdignan ?'],
        ['local', '32', '', 'Château Verdignan en contre-plongée depuis les rangs, sa tour et sa flèche'],
        ['local', '33', '', 'Lovely et Fred dans les vignes, sous un ciel bleu'],
        ['local', '34', '', 'Le Médoc vu du ciel : les rangs de vigne jusqu’à l’estuaire de la Gironde'],
        ['local', '35', 'clip', 'Reel Gardé pour vous : Lovely entre les casiers où les bouteilles attendent'],
        ['local', '36', '', 'Une bouteille de Soudars sur une table de réception devant le château : Soudars s’invite chez V and B, C10 et les Traiteurs de France'],
        ['local', '37', '', 'Lovely et Fred à vélo entre les rangs de vigne'],
        ['local', '38', '', 'Château Coufran vu du ciel, sur sa croupe de graves entourée de merlot'],
        ['local', '39', 'clip', 'Reel Du chai au verre : Fred tire le vin de la barrique à la pipette, Lovely tient le verre'],
        ['local', '40', '', 'L’estuaire de la Gironde, ses carrelets sur pilotis et les vignes au premier plan'],
        ['local', '41', '', 'Lovely et Fred regardent le premier bourgeon de l’année'],
        ['local', '42', '', 'Sur le fond vert de Soudars, un tas de cerises, mûres, framboises et cassis : vous sentez la cerise ? Alors vous avez raison, pas besoin d’être expert'],
        ['local', '43', 'clip', 'Reel Fred explique : deux verres du même vin, l’un jeune et violet, l’autre grenat ; Lovely sceptique, Fred montre le plus vieux. Trop tôt ou prêt ?'],
        ['local', '44', '', 'Sur le fond or de Coufran, des gants de travail, un sécateur et une vieille clé : un château, c’est une ferme ; pas de donjon, pas de douves'],
        ['local', '45', '', 'Lovely et Fred, à genoux sur la grave, plantent ensemble un jeune pied de vigne'],
        ['local', '46', '', 'La pointe d’une flèche d’ardoise contre le ciel bleu. Devinez le château ; indice : il regarde l’estuaire'],
        ['local', '47', 'clip', 'Reel Fred explique : l’assemblage, trois parcelles pour un seul vin'],
        ['local', '48', '', 'Trois verres de vin rouge sur une table de pierre, leurs ombres qui se rejoignent'],
        ['local', '49', '', 'Au ras du sol, les galets de grave du Haut-Médoc, et un pied de vigne qui plonge entre eux'],
        ['local', '50', '', 'Quatre mains de quatre âges posées l’une au-dessus de l’autre sur le tronc d’une vieille vigne'],
        ['local', '51', 'clip', 'Reel : Fred sort une vieille bouteille des casiers, Lovely montre l’objectif. Votre année de naissance ?'],
        ['local', '52', '', 'Les larmes d’un vin rouge qui coulent sur la paroi d’un verre'],
        ['local', '53', '', 'L’écorce d’un vieux cep givré et la coupe fraîche de la taille'],
        ['local', '54', '', 'Les bouchons des millésimes sur la table du chai, un verre couché'],
        ['local', '55', 'clip', 'Reel Fred explique : le verre idéal'],
        ['local', '56', '', 'Le vin rouge versé dans un grand verre, dans la lumière du chai'],
        ['local', '57', '', 'Sur un fond bleu, la bouteille de Château Verdignan et une vieille bouteille poussiéreuse couchée : il prend son temps, le vin de garde de la famille'],
        ['local', '58', '', 'Le caisson MIAILHE dans un couloir de Bordeaux Aéroport, des voyageurs passent devant : on est à l’aéroport'],
        ['local', '59', 'clip', 'Reel Les coulisses : Lovely et Fred ouvrent la porte du chai'],
        ['local', '60', '', 'Une main tient un téléphone qui montre la boutique de miailhe.com, une caisse de vin livrée ouverte sur la table : la boutique est en ligne'],
        ['local', '61', '', 'Une main tient la photo de famille de 1931 devant la même façade, où Lovely et Fred sont assis aujourd’hui : même place, quatre générations plus tard'],
        ['local', '62', '', 'Un vrai tableau des départs dans un hall d’aéroport : Belgique, Norvège, Japon, Canada, États-Unis, statut prêt à boire. On s’exporte'],
        ['local', '63', 'clip', 'Reel Le test : Lovely et Fred tendent Soudars et Coufran, Verdignan entre eux. Quel château êtes-vous ?'],
        ['local', '64', '', 'L’ombre de deux verres qui trinquent sur un mur de calcaire'],
        ['local', '65', '', 'Fred montre le numéro de lot gravé sur une bouteille de Verdignan'],
        ['local', '66', '', 'Les culots des bouteilles couchées dans les casiers, qui attendent d’être prêtes'],
        ['local', '67', 'clip', 'Reel Wine family : Lovely et Fred, deux cousins, dans les vignes sous un ciel bleu'],
        ['local', '68', '', 'Deux bandes de pellicule noir et blanc sur une table lumineuse : Louis et Coufran en 1924, Jean et Verdignan en 1976, Éric en 1980, Lovely en 2006, entourée au crayon rouge'],
        ['local', '69', '', 'L’ombre d’un verre sur le fond d’une barrique marquée 2005 à la craie'],
      ],
    },
  };
  // le même compte, renommé : mêmes chiffres. Pas de ligne « Suivi(e) par … » : elle dépend de qui regarde
  // (retirée le 28/10/2026, demande de l'utilisateur)
  const CHIFFRES = '<li><b>264</b> publications</li><li><b>1 905</b> followers</li><li><b>1 118</b> suivi(e)s</li>';
  const TYPES = { epingle: 'Icône de publication épinglée', clip: 'Clip', carrousel: 'Carrousel' };
  const echapper = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  // le badge « Vérifié » d'Instagram : un cercle festonné bleu #0095F6 et sa coche blanche, à droite du nom du compte
  const CERTIFIE = '<svg class="certifie" width="18" height="18" viewBox="0 0 40 40" role="img" aria-label="Vérifié"><title>Vérifié</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fill="#0095f6" fill-rule="evenodd"/></svg>';
  const CHEVRON = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4.5 16.5 12 9 19.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const rendre = (cle, p) => {
    const icone = (nom, classe) => svg(nom, 20, `${classe ? ` class="${classe}"` : ''} role="img" aria-label="${TYPES[nom]}"`);
    // un reel épinglé garde ses deux icônes, côte à côte : on voit tout de suite que c'est une vidéo
    const type = icones => {
      const liste = icones ? icones.split(' ') : [];
      if (liste.length < 2) return liste.length ? icone(liste[0], 'case-type') : '';
      return `<span class="case-types">${liste.map(nom => icone(nom)).join('')}</span>`;
    };
    const grille = p.grille
      ? p.grille.map(([genre, code, icone, alt]) => genre === 'local'
        // une publication à venir de la maquette : pas encore en ligne, donc pas de lien vers Instagram
        ? `<li><div class="case case--maquette"><img src="${IMG}apres-post-${code}.jpg" alt="${echapper(alt)}" loading="lazy">${type(icone)}</div></li>`
        : `<li><a class="case" href="https://www.instagram.com/${genre}/${code}/" target="_blank" rel="noopener"><img src="${IMG}post-${code}.jpg" alt="${echapper(alt)}" loading="lazy">${type(icone)}</a></li>`).join('')
      : Array.from({ length: 12 }, (_, i) => `<li><div class="case case--vide" role="img" aria-label="Publication ${i + 1}, à venir">${svg('vide', 28)}</div></li>`).join('');
    const une = p.une.map(([titre, image]) => `<li class="une"><span class="une-image">${image}</span><span class="une-titre">${titre}</span></li>`).join('');
    document.querySelector(`[data-profil="${cle}"]`).innerHTML = `
      <div class="tete">
        <div class="avatar"${cle === 'apres' ? ' data-avatar-miailhe style="background:#000"' : ''}>${p.avatar}</div>
        <div class="infos">
          <div class="ligne-nom"><h2 class="nom-compte">${p.compte}</h2>${p.certifie ? CERTIFIE : ''}<button class="options" type="button" aria-label="Options">${svg('options', 18)}</button></div>
          <p class="nom-complet">${echapper(p.nom)}</p>
          <ul class="chiffres">${CHIFFRES}</ul>
        </div>
        <div class="texte-profil">
          ${p.categorie ? `<p class="categorie">${p.categorie}</p>` : ''}
          <p class="bio">${echapper(p.bio)}</p>
          <a class="lien-bio" href="${p.lien[1]}" target="_blank" rel="noopener">${svg('lien', 12)}${p.lien[0]}</a>
        </div>
      </div>
      <div class="actions">
        <button class="suivre" type="button">Suivre</button>
        <button type="button">Contacter</button>
        <button type="button" aria-label="Comptes similaires">${svg('similaires', 16)}</button>
      </div>
      <div class="une-rangee">
        <ul class="a-la-une">${une}</ul>
        <button class="une-fleche" type="button" data-sens="-1" aria-label="Précédent" hidden>${CHEVRON}</button>
        <button class="une-fleche" type="button" data-sens="1" aria-label="Suivant" hidden>${CHEVRON}</button>
      </div>
      <nav class="onglets" aria-label="Onglets du profil">
        <span class="onglet is-actif" role="img" aria-label="Publications">${svg('publications')}</span>
        <span class="onglet" role="img" aria-label="Reels">${svg('reels')}</span>
        <span class="onglet" role="img" aria-label="Republications">${svg('republications')}</span>
        <span class="onglet" role="img" aria-label="Identifié(e)">${svg('identifie')}</span>
      </nav>
      <ul class="grille">${grille}</ul>`;
  };
  Object.entries(PROFILS).forEach(([cle, p]) => rendre(cle, p));

  /* La photo de profil de @famillemiailhe : le logo MIAILHE officiel complet (avec « Haut-Médoc · Depuis 1924 »), en
     blanc, sur un rond noir (28/10/2026, demande de l'utilisateur : « utilise celui où il est marqué Haut Médoc »).
     C'est le nom MIAILHE qui est centré dans le rond, pas l'encre entière : la signature et la racine descendent plus
     bas (même jour, demande de l'utilisateur). Les lettres sont le premier bloc de rangées où l'encre court sur plus de
     60 % de la largeur ; la signature, plus bas, en est séparée par des rangées où ne passe que la racine. Le nom occupe
     76 % du diamètre. */
  const L = window.MIAILHE_LOGO;
  const avatar = document.querySelector('[data-avatar-miailhe]');
  avatar.innerHTML = `<svg viewBox="${L.logo.viewBox}" role="img" aria-label="Photo de profil de famillemiailhe : le logo MIAILHE"><g fill="#fff" transform="${L.logo.transform}"><path d="${L.logo.d}"/></g></svg>`;
  (() => {
    const s = avatar.querySelector('svg'), m = s.querySelector('g').transform.baseVal.consolidate().matrix;
    const [, , W, H] = L.logo.viewBox.split(' ').map(Number), k = .2;
    const c = document.createElement('canvas'), x = c.getContext('2d');
    c.width = Math.ceil(W * k); c.height = Math.ceil(H * k);
    x.setTransform(m.a * k, m.b * k, m.c * k, m.d * k, m.e * k, m.f * k);
    x.fill(new Path2D(L.logo.d));
    const px = x.getImageData(0, 0, c.width, c.height).data, rangs = [];
    for (let y = 0; y < c.height; y++) {
      let a = -1, b = -1;
      for (let i = 0; i < c.width; i++) if (px[(y * c.width + i) * 4 + 3] > 127) { if (a < 0) a = i; b = i; }
      if (a >= 0) rangs.push([y, a, b]);
    }
    const large = Math.max(...rangs.map(([, a, b]) => b - a)), larges = rangs.filter(([, a, b]) => b - a > large * .6);
    const lettres = larges.filter(([y], i) => larges.slice(0, i + 1).every(([z], j) => j === 0 || z === larges[j - 1][0] + 1));
    const x0 = Math.min(...lettres.map(r => r[1])) / k, x1 = (Math.max(...lettres.map(r => r[2])) + 1) / k;
    const y0 = lettres[0][0] / k, y1 = (lettres[lettres.length - 1][0] + 1) / k, cote = (x1 - x0) / .76;
    s.setAttribute('viewBox', `${(x0 + x1) / 2 - cote / 2} ${(y0 + y1) / 2 - cote / 2} ${cote} ${cote}`);
  })();

  /* La rangée des stories à la une : quand elle déborde, les flèches d'Instagram (sur ordinateur ; le téléphone défile
     au doigt) */
  const fleches = () => document.querySelectorAll('.une-rangee').forEach(r => {
    const ul = r.querySelector('ul'), [g, d] = r.querySelectorAll('.une-fleche');
    g.hidden = ul.scrollLeft <= 1;
    d.hidden = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 1;
  });
  document.querySelectorAll('.une-rangee').forEach(r => {
    const ul = r.querySelector('ul');
    ul.addEventListener('scroll', fleches, { passive: true });
    r.querySelectorAll('.une-fleche').forEach(b => b.addEventListener('click', () => ul.scrollBy({ left: b.dataset.sens * (ul.clientWidth - 85) })));
  });
  window.addEventListener('resize', fleches);

  /* ---------- Avant / Après ---------- */
  const comparer = document.querySelector('.comparer');
  const montrer = (etat, enHistorique) => {
    if (etat !== 'apres') etat = 'avant';
    document.querySelectorAll('.profil').forEach(p => p.classList.toggle('is-montre', p.dataset.profil === etat));
    fleches();
    comparer.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vers === etat)));
    document.title = PROFILS[etat].titre;
    if (enHistorique && location.hash !== '#' + etat) history.replaceState(null, '', '#' + etat);
  };
  comparer.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { montrer(b.dataset.vers, true); window.scrollTo({ top: 0 }); }));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') montrer('apres', true);
    if (e.key === 'ArrowLeft') montrer('avant', true);
  });
  window.addEventListener('hashchange', () => montrer(location.hash.slice(1)));
  montrer(location.hash.slice(1));
})();
