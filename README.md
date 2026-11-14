<!-- AI_DISCLAIMER v1.0 -->
# Domaine du Val Pendragon — site HTML

> This file has been created (totally or partially) with the assistance of artificial intelligence tools.
> All content has been generated under the direct supervision of a named individual,
> and under the AI.Backbone Orchestrator Compliance framework

Refonte autonome en HTML, CSS et JavaScript natifs. Aucun framework, CDN,
traceur, police distante ou service tiers n'est nécessaire pour consulter le
site. L'application Expo du dépôt n'est pas modifiée.

## Consulter le site

Ouvrir [index.html](index.html) directement dans un navigateur. Le site est
une **page continue contenant les huit rubriques intégrales**. Le menu
supérieur mène aux chapitres par des ancres, sans rechargement. Les sept
anciens fichiers HTML redirigent vers le chapitre correspondant ; ces
redirections HTML fonctionnent aussi sans JavaScript et sans serveur.
Un accès à Internet reste nécessaire pour les liens externes.

Pour un aperçu HTTP, depuis la racine du dépôt :

```powershell
npm run --prefix site-web preview
```

Le serveur local écoute sur le port **4178** et uniquement sur la boucle
locale. Arrêter avec `Ctrl+C`.

## Contenu conservé

- Les huit pages du site source, y compris les prestations, tarifs,
  descriptions d'élevage, annonce de vente et coordonnées professionnelles.
- Tous les textes éditoriaux sont extraits sans réécriture, correction
  orthographique ou actualisation des montants et dates.
- Les onze fichiers photographiques et le blason sont téléchargés dans
  [assets/photos](assets/photos), sans retouche ni recompression.
- Les images de mise en page peuvent être recadrées par CSS ; leur
  agrandissement affiche le fichier original intégral.
- Les liens Facebook et Instagram et la mention de copyright sont conservés.
- À la demande du propriétaire, le rappel des réseaux sociaux est regroupé
  une seule fois dans l'en-tête, avec les icônes Instagram et Facebook.
  Les répétitions dans les rubriques, le menu mobile et le pied de page
  sont supprimées. Les icônes SVG sont locales et accessibles au clavier.
- La rubrique des tarifs conserve toutes ses prestations et ne présente
  qu'un seul lien « Renseignements », après la liste complète.

La publicité Webador, la bannière de consentement publicitaire, les scripts
de suivi et l'habillage technique de l'ancien hébergeur ne sont pas repris.
Les libellés nécessaires aux nouvelles interactions sont ajoutés sans
modifier les textes éditoriaux.

Les photos originales sont binaires : elles ne portent pas de commentaire
de traçabilité IA afin de ne pas altérer les originaux. Leur provenance et
leurs empreintes SHA-256 sont conservées dans [content.json](content.json).
Le disclaimer s'applique au code et à la présentation, pas à une création
des photographies par IA.

## Formulaire de contact

Un hébergement purement statique n'envoie pas de courrier à lui seul.
Le formulaire valide les champs et prépare un lien vers un brouillon dans
la messagerie du visiteur. Il indique explicitement qu'aucun message n'a
été envoyé ; le visiteur doit ouvrir sa messagerie puis confirmer l'envoi.
Les données ne sont ni stockées ni transmises automatiquement.

Le lien vers le formulaire Webador original est également disponible.
Pour recevoir directement les formulaires depuis ce nouveau site, il faudra
brancher un service d'envoi ou un serveur choisi par le propriétaire.
Les liens vers la messagerie et l'itinéraire ne contactent un tiers
qu'après action explicite du visiteur.

## Direction visuelle et animations

La direction « Le grimoire de Brocéliande », validée par le propriétaire,
remplace complètement le thème citron : noir forestier, ivoire, or patiné,
typographie à empattements, blason noir et blanc et fins détails héraldiques.
L'accueil est immersif, sans cartes d'application ni défilement forcé.
Le blason original reste inchangé, sans inversion ni recoloration ; son
cadrage CSS masque uniquement les grandes marges de son fichier.

La photographie de forêt déjà présente sur le site source sert de
**fond fixe sur ordinateur comme sur mobile**. Le cadrage privilégie la
canopée. Des voiles sombres assurent la lisibilité ; les fichiers
photographiques ne sont pas retouchés. Les huit chapitres et leurs contenus
complets défilent au-dessus du fond, sans chargement dynamique.

Le menu supérieur présente **les huit choix d'origine dans leur ordre
exact**, avec leurs libellés complets. Sous 1001 pixels, ces mêmes huit
choix sont accessibles dans le menu mobile. L'en-tête reste visible et la
rubrique active est mise en évidence pendant la lecture. Les liens directs
vers un chapitre sont partageables, par exemple `index.html#l-elevage`.
Une ligne verticale minimaliste, fixée à l'extrême gauche, remplace le
sommaire latéral. Ses huit points conduisent aux rubriques ; le point actif
suit la lecture, et les intitulés apparaissent au survol ou au focus clavier.
Les numéros décoratifs de chapitres, sous-parties et prestations sont supprimés.
Les montants, dates et autres chiffres du contenu original restent inchangés.

Les textes explicatifs sont affichés en 18 pixels sur ordinateur et
16 pixels sur mobile, avec un interligne aéré. Le corps des articles est
centré, sans colonne latérale réservée au sommaire.

Les animations comprennent une brume légère en arrière-plan, l'arrivée
du titre, des apparitions douces et les ouvertures de panneaux.
Elles utilisent uniquement CSS et les API natives du navigateur :
aucune dépendance ou ressource distante n'est ajoutée.

Le bouton **Animations**, dans l'en-tête, suspend les mouvements de la
page et permet de les reprendre. La préférence système
`prefers-reduced-motion` désactive automatiquement les animations ;
le bouton indique alors que les préférences du visiteur sont respectées.
Sans JavaScript, tout le contenu reste visible, les ancres et les liens
du pied de page fonctionnent et les mouvements sont inactifs.
La galerie reste limitée aux photos du chapitre consulté.

## Modifier et vérifier

Le contenu est figé dans [content.json](content.json), avec la date de capture
et la provenance. Les HTML sont de vrais documents complets, pas une
application qui injecte le contenu à l'exécution.

```powershell
# Régénérer la page complète et les sept redirections de compatibilité
npm run --prefix site-web build

# Tests sur un serveur éphémère indépendant, port 4179
npm run --prefix site-web test

# Réimporter explicitement le site source et toutes les photos
# Attention : remplace le contenu local par le contenu actuellement publié.
npm run --prefix site-web import
npm run --prefix site-web build
```

L'import et les tests utilisent Playwright déjà présent dans le dépôt
parent ; aucune dépendance supplémentaire n'est requise pour le site.
Les tests comparent chaque bloc de texte avec la capture source, vérifient
les photos et leurs empreintes, les liens locaux, les largeurs de 312 à
1440 pixels, les huit ancres sans rechargement, les rubriques actives, les
menus au clavier, la galerie, le formulaire, le fond réellement fixe,
les animations et leur désactivation. Des captures desktop et mobile sont
produites dans le dossier ignoré des résultats de tests.

## Mettre en ligne

Copier les huit fichiers `.html` et le dossier [assets](assets) sur
n'importe quel hébergement statique HTTPS. Les scripts de développement,
les tests et le fichier de capture ne sont pas nécessaires en production.
Les liens utilisent des fichiers `.html` pour fonctionner aussi par simple
double-clic. Configurer des redirections des anciennes URL sans extension
si le nouveau site remplace le site publié sur son domaine.

Avant publication, définir le domaine définitif pour les URL canoniques,
le partage social et le sitemap. Vérifier également les droits de
réutilisation des contenus et photographies du site source.
