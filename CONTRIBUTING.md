# Guide de Contribution

Merci de prendre un moment pour lire ce guide avant de faire des modifications. Le but est de maintenir la cohérence et la stabilité du code.

## Architecture Générale

1.  **JavaScript Vanilla :** Le projet est écrit en JavaScript pur (Vanilla JS), sans jQuery ou autre bibliothèque. C'est un choix de simplicité et de performance. Toute nouvelle fonctionnalité doit respecter ce principe.

2.  **CSS Centralisé :** Tous les styles sont dans un unique fichier, `styles.css`. Merci de ne pas ajouter de balises `<style>` directement dans les fichiers HTML.

3.  **Site Statique :** Le site est composé de pages HTML statiques. Les éléments communs comme le header et le footer sont dupliqués manuellement.

## Conventions de Code et Formats

-   **Langue :** Tout le contenu visible, ainsi que les commentaires de code, doivent être en **français**.
-   **Organisation CSS :** Pour la clarté, les différentes sections du fichier `styles.css` sont organisées avec des bannières de commentaires (ex: `/* ===== STYLES POUR LA SECTION PROJET ===== */`).
-   **Formats d'Images :** Pour optimiser le temps de chargement, les images de contenu des projets doivent utiliser le format **`.webp`**. Les icônes et logos doivent être au format **`.svg`**.

## La Galerie de Projets : La Règle d'Or

C'est la partie la plus complexe du site et elle suit une règle très stricte. **Ne pas la respecter cassera l'affichage des titres.**

-   **Structure :** Chaque page contenant une galerie (`amo.html`, `appins.html`, `batins.html`, etc.) doit contenir une section `<section class="project-section">`.
-   **Données Locales :** Les informations de la galerie (titres, images) sont définies dans une variable `const projects` à la fin de chaque fichier HTML concerné. C'est ce qui permet à chaque galerie d'avoir son propre contenu.
-   **Logique Globale :** Le fichier `script.js` contient **toute** la logique d'affichage. Il est conçu pour s'adapter et fonctionner uniquement si les éléments HTML nécessaires (comme `.project-section`) sont présents sur la page, ce qui lui permet d'être inclus partout sans causer d'erreur. **Il ne faut JAMAIS ajouter de code de gestion de galerie directement dans un fichier HTML.**

### Le "Puzzle du Millénaire" : Pourquoi le script des titres est si complexe

Le script dans `script.js` qui gère l'affichage des titres (`adjustAndSplitText`) a été spécifiquement conçu pour résoudre plusieurs problèmes complexes :
- Il force les titres et sous-titres sur deux lignes pour une mise en page stable.
- Il ajuste la taille de la police pour que le texte ne soit jamais coupé.
- Il utilise `requestAnimationFrame` pour éviter les bugs de synchronisation avec le rendu du navigateur.
- Il gère dynamiquement l'affichage/masquage des éléments de navigation.

**Ne modifiez pas cette fonction à la légère. Elle est le fruit de nombreuses itérations et résout des problèmes qui ne sont pas visibles à première vue.**

### Bonnes Pratiques pour les Modifications de Style

1. **Navigation Galerie** :
   - Les flèches de navigation supérieures sont masquées par défaut (`.top-nav .nav-arrow { display: none; }`)
   - La navigation par swipe est limitée à la zone de l'image pour éviter les déclenchements intempestifs
   - Le zoom est désormais possible sans déclencher de changement d'image
   - Pour toute modification de style, s'assurer de ne pas affecter la navigation principale

2. **Responsive Design** :
   - Toujours tester les modifications sur différentes tailles d'écran
   - Utiliser les media queries existantes pour les ajustements spécifiques
   - Vérifier que la navigation reste fonctionnelle sur mobile

3. **Accessibilité** :
   - La navigation doit rester accessible au clavier
   - Les contrôles doivent avoir des états visuels distincts (hover, focus, active)

### Navigation dans la Galerie d'Images

La navigation dans la galerie d'images suit des règles strictes pour assurer une expérience utilisateur cohérente :

#### Boutons de Navigation
- **Flèches inférieures uniquement** : Navigation entre les projets et les images
  - Flèche gauche : Image précédente (ou dernier projet si sur la première image)
  - Flèche droite : Image suivante (ou projet suivant si sur la dernière image)
  
> **Note :** Les flèches supérieures ont été masquées pour simplifier l'interface. La navigation complète est disponible via les flèches inférieures.

#### Raccourcis Clavier
- **Flèche gauche** : Même comportement que le bouton "Image précédente"
  - Si première image : passe au dernier projet
  - Sinon : image précédente

- **Flèche droite** : Même comportement que le bouton "Image suivante"
  - Si dernière image : passe au projet suivant
  - Sinon : image suivante

- **Maj + Flèche gauche** : Projet précédent
- **Maj + Flèche droite** : Projet suivant

#### Comportement Spécial pour les Projets à Une Seule Image
- Les flèches de navigation d'images restent actives
- Le clic sur ces flèches passe directement au projet précédent/suivant
- Ce comportement permet une navigation fluide même pour les projets avec une seule image

#### Points Importants
1. Les boutons de navigation sont toujours visibles mais peuvent être désactivés lorsqu'aucune action n'est possible
2. La navigation est circulaire : après le dernier projet, on revient au premier
3. Les logs de débogage sont activés pour faciliter la résolution des problèmes

**Attention** : Toute modification de ces comportements doit être testée sur des projets avec un nombre variable d'images (0, 1, plusieurs) pour s'assurer de la stabilité du système.

### Carrousel GSAP - Spécifications Techniques

Le carrousel GSAP est une fonctionnalité avancée utilisée pour afficher des images de manière interactive. Voici les spécifications à respecter :

### Structure du Fichier
- **Fichier principal** : `gsap.html`
- **Dépendances** :
  - GSAP 3.12.4 (via CDN)
  - GSAP Draggable (via CDN)
  - Font Awesome 6.0.0-beta3 (via CDN)

### Dimensions des Cartes
- **Carte Centrale** : 
  - Largeur : 1050px
  - Hauteur : 650px
  - Opacité : 1
  - Z-index : 3

- **Cartes Latérales** :
  - Largeur : 600px
  - Hauteur : 500px
  - Opacité : 0.7
  - Z-index : 2
  - Échelle : 0.7

### Comportement
1. **Navigation** :
   - Glisser-déposer horizontal pour changer de carte
   - Animation fluide avec transition GSAP
   - Les cartes latérales se déplacent en arrière-plan

2. **Zones Interactives** :
   - Toute la zone de la fenêtre est interactive SAUF le header et le footer
   - Le header et le footer restent fixes pendant le défilement

3. **Optimisations** :
   - Désactivation de la sélection de texte pendant le glissement
   - Prévention du comportement par défaut du navigateur
   - Gestion spécifique des événements tactiles

### Points d'Attention
- Ne pas modifier les valeurs de `offsetPercent` (0.35) sans ajuster les positions des cartes latérales
- Toujours préserver les transitions GSAP pour une animation fluide
- Tester sur mobile pour s'assurer que le glissement fonctionne correctement
- Les images sont automatiquement redimensionnées pour s'adapter aux conteneurs

### Personnalisation
Pour modifier les dimensions :
1. Modifier les variables `centerWidth` et `centerHeight` pour la carte centrale
2. Modifier les variables `cardWidth` et `cardHeight` pour les cartes latérales
3. Tester l'affichage sur différentes tailles d'écran

## Indicateur de Chargement Circulaire (Juin 2024)

### Fonctionnalité
- Un indicateur de chargement circulaire s'affiche pendant le chargement du carrousel
- Affiche la progression du chargement de 0% à 100%
- L'arrière-plan est flouté pendant le chargement
- Disparaît automatiquement une fois le chargement terminé

### Implémentation
1. **HTML** :
   ```html
   <div class="loading-overlay" id="loadingOverlay">
       <div class="loading-container">
           <div class="loading-circle">
               <svg class="loading-circle-bg" viewBox="0 0 120 120">
                   <circle cx="60" cy="60" r="54" fill="none" stroke="#e9660e" stroke-width="6" stroke-opacity="0.2"/>
               </svg>
               <svg class="loading-circle-progress" viewBox="0 0 120 120">
                   <circle cx="60" cy="60" r="54" fill="none" stroke="#e9660e" stroke-width="6" stroke-linecap="round" stroke-dasharray="339.292" stroke-dashoffset="339.292"/>
               </svg>
               <div class="loading-percent">0%</div>
           </div>
           <div class="loading-text">Chargement du carrousel...</div>
       </div>
   </div>
   ```

2. **JavaScript** :
   - La classe `loading` est ajoutée au `body` au chargement
   - La progression est mise à jour en fonction du chargement des images
   - L'overlay est masqué une fois le chargement terminé

3. **Points Importants** :
   - Ne pas modifier la structure HTML de l'indicateur
   - Les couleurs sont basées sur la charte graphique ITAMAX
   - L'animation est fluide et s'adapte à la vitesse de chargement

## Règles de Navigation du Menu - Mise à jour (Juin 2024)

### Gestion des États Actifs du Menu

1. **Structure du Menu**
   - Le menu utilise des classes CSS pour gérer les états actifs et l'affichage des sous-menus
   - Ne jamais utiliser de styles en ligne pour forcer l'affichage des menus
   - Toujours utiliser les classes CSS prévues à cet effet

2. **Classes à Utiliser**
   - `.active` : Pour marquer l'élément de menu actif
   - `.has-submenu` : Pour les éléments de menu avec sous-menu
   - `.submenu` : Conteneur du sous-menu
   - `.menu-item` : Pour les liens du menu principal

3. **Règles d'Implémentation**
   - Sur la page d'accueil (`index.html`), l'élément "Accueil" doit avoir la classe `active`
   - Sur les pages de projets, l'élément "Projets" doit avoir la classe `active`
   - Le sous-menu correspondant à la page active doit avoir la classe `active`
   - Pour le carrousel (`gsap.html`), l'élément "Carrousel" doit avoir la classe `active`

4. **Exemple de Structure Correcte**
   ```html
   <!-- Pour une page de projet (ex: amo.html) -->
   <li class="has-submenu active">
     <a href="#" class="menu-item">
       Projets
       <i class="fas fa-chevron-down arrow-icon"></i>
     </a>
     <ul class="submenu">
       <li><a href="amo.html" class="active">AMO</a></li>
     </ul>
   </li>
   
   <!-- Pour la page Carrousel -->
   <li class="active">
     <a href="gsap.html" class="menu-item active">
       Carrousel
     </a>
   </li>
   ```

5. **Points Critiques**
   - Ne jamais ajouter de styles en ligne comme `style="display: block;"` sur les éléments de menu
   - Toujours utiliser les classes CSS prévues pour gérer l'affichage
   - Vérifier que les sous-menus s'ouvrent et se ferment correctement après chaque modification

## Amélioration de la Navigation sur Mobile (Juin 2024)

1. **Navigation par Swipe Optimisée**
   - La détection du swipe est maintenant limitée à la zone de l'image
   - Meilleure distinction entre les gestes de zoom et de navigation
   - Seuls les swipes rapides et nets déclenchent le changement d'image
   - Prévention des conflits avec le zoom tactile

2. **Amélioration de l'Expérience Utilisateur**
   - Les gestes à deux doigts sont désormais correctement interprétés comme un zoom
   - Réduction des faux positifs lors de la navigation
   - Meilleure réactivité sur les appareils tactiles

### Historique des Interventions (Jules - Été 2024)

Plusieurs ajustements et corrections ont été apportés pour améliorer l'expérience utilisateur et la robustesse du site :

1.  **Correction du décalage du contenu par le menu déroulant (Tablette) :**
    *   **Problème :** Sur les écrans de taille tablette (entre 577px et 992px), l'ouverture du menu déroulant principal provoquait un décalage vers le haut du contenu situé en dessous de l'en-tête.
    *   **Solution :** L'en-tête (`.header`) a été rendu `position: fixed;` dans cette plage de résolutions, alignant son comportement sur celui des vues mobile et bureau. Cela empêche le menu d'affecter le flux du contenu principal.
    *   *Fichiers modifiés : `styles.css`*
    *   *Branche : `fix/tablet-dropdown-shift`*

2.  **Correction des boutons de navigation principaux masqués par l'en-tête :**
    *   **Problème :** Certains boutons de navigation principaux (ex: "AMO", "Appuis institutionnels") étaient masqués derrière l'en-tête sur des largeurs d'écran inférieures à 992px à cause d'une marge supérieure négative (`margin-top: -45px;`).
    *   **Solution :** La marge supérieure négative du `.button-container` a été réinitialisée à `0` pour les écrans `<= 992px`, permettant aux boutons de s'afficher correctement en dessous de l'en-tête fixe.
    *   *Fichiers modifiés : `styles.css`*
    *   *Branche : `fix/tablet-dropdown-shift`*

3.  **Optimisation complète de la page de contact pour tous les appareils :**
    *   **Améliorations apportées :**
        * Mise en place d'un système de media queries avancé pour les écrans de 769px à 992px
        * Ajustements précis des marges et espacements pour chaque plage de résolution
        * Optimisation spécifique pour les très petits écrans (< 348px)
        * Amélioration de la lisibilité sur toutes les tailles d'écran
    *   **Points de rupture principaux :**
        * 769px - 809px : Ajustement des marges pour les tablettes
        * 809px - 913px : Optimisation pour les tablettes en mode paysage
        * 914px - 924px : Ajustements fins pour les écrans intermédiaires
        * 925px - 992px : Optimisation pour les petits ordinateurs portables
        * < 348px : Mode très petit écran avec réduction proportionnelle
    *   **Optimisations spécifiques :**
        * Taille de police réactive basée sur la largeur de la fenêtre
        * Ajustement dynamique des marges et espacements
        * Amélioration de l'alignement des éléments sur tous les appareils
        * Optimisation des boutons et éléments interactifs pour le toucher
    *   *Fichiers modifiés : `contact.html` (styles embarqués)*
    *   *Branche : `fix/contact-page-spacing`*

4.  **Stabilisation des flèches "Suivant" de la galerie de projets :**
    *   **Problème :** Les flèches "Suivant" (droite) des galeries de projets (en haut et en bas de l'image) présentaient un léger mouvement horizontal lors de l'interaction (clic/focus).
    *   **Solution :**
        *   Une première tentative avec `outline: none;` n'a pas suffi.
        *   La cause identifiée était une potentielle instabilité dimensionnelle du bouton fléché, exacerbée par sa structure HTML imbriquée (contrairement aux flèches "Précédent") et les propriétés flex de son parent.
        *   La solution finale a consisté à attribuer une `width` et `height` explicites aux boutons `.nav-arrow` (correspondant à la taille de l'image qu'ils contiennent) et à ajouter `box-sizing: border-box;`. Ceci assure une dimension fixe au bouton, empêchant les micro-variations de rendu de l'SVG ou de la boîte de causer un recalcul de layout.
    *   *Fichiers modifiés : `styles.css`*
    *   *Branche : `feat/contact-updates-and-arrow-fix`*

5.  **Ajout des numéros de téléphone sur la page de contact :**
    *   **Demande :** Intégrer deux numéros de téléphone sous l'adresse e-mail sur `contact.html`.
    *   **Solution :** Deux nouveaux paragraphes contenant les numéros ont été ajoutés. Ils ont été stylisés (couleur orange, police Jura, taille adaptée pour mobile et bureau) de manière cohérente avec l'adresse e-mail, en utilisant des styles CSS embarqués et en tenant compte de la grille flexible parente pour l'espacement.
    *   *Fichiers modifiés : `contact.html` (HTML et styles embarqués)*
    *   *Branche : `feat/contact-updates-and-arrow-fix`*

# CONTRIBUTING

## Carrousel GSAP (gsap.html)

La page `gsap.html` présente un carrousel horizontal immersif, inspiré de GSAP, avec les caractéristiques suivantes :

### Fonctionnalités principales
- **Carrousel 3D** : 1 carte centrale très grande (1200x600px), 2 cartes latérales partiellement visibles (300x200px, 35% visibles sur les bords), effet immersif.
- **Navigation** :
  - Swipe/drag à la souris ou au doigt (mobile).
  - Pas de boutons/flèches, navigation fluide et infinie.
  - La sélection de texte est désactivée pendant le drag.
- **Images** :
  - Les images des cartes sont dans le dossier `/gsap` : `A1.PNG`, `A2.webp`, `A3.webp`, `A4.jpg`.
  - Le titre de chaque carte s'affiche en overlay sur l'image.
- **Design** :
  - Fond sombre (#242A3A), header centré "ITAMAX" (#6A82A2), footer centré (#3B4151).
  - Responsive jusqu'à 2560px de large.

### Structure technique
- **HTML/CSS** :
  - Structure simple, tout le style principal est dans la balise `<style>` de la page.
  - Les cartes sont générées dynamiquement en JS.
- **JavaScript** :
  - Pas de dépendance à React/Vue/etc.
  - Utilise GSAP (et Draggable, même si le drag est géré en natif JS ici).
  - Les cartes sont définies dans le tableau `cardsData` (modifiable pour ajouter/retirer des slides).
  - La fonction `updateCards()` gère la position, la taille et la visibilité des cartes selon l'index courant.

### Pour modifier ou étendre
- **Ajouter une carte** :
  - Ajouter une entrée dans `cardsData` avec un titre, une couleur et le chemin de l'image.
- **Changer la taille** :
  - Modifier `centerWidth`/`centerHeight` ou `cardWidth`/`cardHeight` dans `updateCards()`.
- **Changer l'effet d'overflow** :
  - Modifier `offsetPercent` (0.35 = 35% visible sur les côtés).

### Dépendances externes
- [GSAP 3.12.4](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js)
- [GSAP Draggable 3.12.4](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/Draggable.min.js)

---

Pour toute contribution, gardez la structure simple et l'expérience immersive du carrousel.
