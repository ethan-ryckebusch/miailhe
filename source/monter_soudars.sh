#!/bin/zsh
# Encode le film d'intro de Soudars pour le site (assets/video/), avec les mêmes réglages que Coufran et Verdignan.
# Depuis le 27/10/2026, c'est un seul film Cinema Studio en trois plans, construit comme celui de Verdignan
# (le domaine, le geste, le vin) à partir d'une vue aérienne du vignoble à l'heure dorée (soudars-image-de-depart.png) :
#   1. le drone glisse au ras des rangs dorés vers le clocher du village
#   2. des mains déposent une grappe de merlot dans un panier, à contre-jour
#   3. au coucher du soleil, le vin versé dans deux verres posés sur un mur de pierres sèches
# Les essais précédents (bougies antigel de nuit, montage Kling, variante de la table) sont dans videos-originales/Archives/.
# Usage, depuis Site_MIAILHE : zsh source/monter_soudars.sh   (ffmpeg requis)
cd "${0:A:h}/videos-originales"
F=${FFMPEG:-ffmpeg}
V='scale=1440:810:force_original_aspect_ratio=increase:flags=lanczos,crop=1440:810,setsar=1'
$F -v error -y -i soudars-film-original.mp4 -an -vf "$V" -c:v libx264 -preset slow -crf 28 -profile:v high -pix_fmt yuv420p -movflags +faststart ../../assets/video/soudars-intro.mp4
$F -v error -y -i soudars-film-original.mp4 -an -vf "$V" -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 ../../assets/video/soudars-intro.webm
# Image d'attente (poster) : la première image du film
$F -v error -y -i soudars-film-original.mp4 -frames:v 1 -vf "$V" -q:v 3 ../../assets/img/soudars-intro-poster.jpg
