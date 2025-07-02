// Fonction pour forcer la visibilité des éléments clés
function forceElementsVisibility() {
    const logoText = document.querySelector('.logo-text');
    const logoContainer = document.querySelector('.logo-container');
    
    if (logoText) {
        logoText.style.display = 'block';
        logoText.style.visibility = 'visible';
        logoText.style.opacity = '1';
        // Keep the absolute position from CSS
        logoText.style.zIndex = '999'; // Below dropdown menu but above other content
    }
    
    if (logoContainer) {
        logoContainer.style.display = 'flex';
        logoContainer.style.visibility = 'visible';
        logoContainer.style.opacity = '1';
        // Keep the relative position from CSS
        logoContainer.style.zIndex = '1001'; // Above logo text but below dropdown menu
    }
}

// Configurer un observateur de mutation
const observer = new MutationObserver(function(mutations) {
    forceElementsVisibility();
});

// Démarrer l'observation avec la configuration de l'observateur
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
});

// Combinaison de la division du texte et de l'ajustement de la police
function adjustAndSplitText(element, text, minFontSize = 14) {
    if (!element || typeof text !== 'string') return;

    // Fonction interne pour diviser le texte
    const getSplitContent = (inputText) => {
        const words = inputText.trim().split(' ');
        if (words.length <= 1) return inputText;

        const middle = inputText.length / 2;
        let bestSplitIndex = -1;
        let minDiff = Infinity;
        let cumulativeLength = 0;

        for (let i = 0; i < words.length - 1; i++) {
            cumulativeLength += words[i].length + 1; // +1 pour l'espace
            const diff = Math.abs(middle - cumulativeLength);
            if (diff < minDiff) {
                minDiff = diff;
                bestSplitIndex = i;
            }
        }
        const line1 = words.slice(0, bestSplitIndex + 1).join(' ');
        const line2 = words.slice(bestSplitIndex + 1).join(' ');
        return `${line1}<br>${line2}`;
    };

    // 1. On met à jour le contenu immédiatement
    element.innerHTML = getSplitContent(text);
    
    // 2. On réinitialise le style pour les futurs calculs
    element.style.fontSize = '';

    // 3. On attend que le navigateur soit prêt à dessiner pour ajuster la police
    const adjust = () => {
        const maxFontSize = parseFloat(window.getComputedStyle(element).fontSize);
        let currentSize = maxFontSize;
        element.style.fontSize = `${currentSize}px`;

        // Boucle d'ajustement sur des dimensions garanties stables
        while (element.scrollHeight > element.clientHeight && currentSize > minFontSize) {
            currentSize--;
            element.style.fontSize = `${currentSize}px`;
        }
    };
    
    requestAnimationFrame(adjust);
}

// Gestion de la navigation entre les projets et les images
function initProjectNavigation() {
    // Vérifier si on est sur une page avec galerie
    const projectSection = document.querySelector('.project-section');
    if (!projectSection) {
        console.log('Pas de galerie sur cette page');
        return; // Quitter si pas de galerie
    }
    
    // Fonction utilitaire pour vérifier les éléments
    function logElement(selector, parent = document) {
        const element = parent.querySelector(selector);
        console.log(`Sélecteur: ${selector}, Trouvé: ${!!element}`);
        if (element) {
            console.log('Contenu:', element.outerHTML);
        }
        return element;
    }
    
    // Vérification des éléments avec plus de détails
    console.log('=== Vérification des éléments ===');
    const elements = {
        'projectTitle': logElement('.project-title'),
        'projectSubtitle': logElement('.project-subtitle'),
        // 'imageElement': logElement('.project-image'), // Old single image
        'imageElements': document.querySelectorAll('.project-image-container .project-image-display'), // Get both image elements
        'topNav': logElement('.top-nav'),
        'bottomNav': logElement('.bottom-nav'),
        'projectCounter': logElement('.top-nav .nav-counter span'),
        'imageCounter': logElement('.bottom-nav .nav-counter span'),
        'prevProjectBtn': logElement('.top-nav .project-prev'),
        'nextProjectBtn': logElement('.top-nav .project-next'),
        'prevImageBtn': logElement('.bottom-nav .image-prev'),
        'nextImageBtn': logElement('.bottom-nav .image-next')
    };
    
    // Vérification des éléments essentiels
    console.log('Vérification des éléments essentiels...');
    console.log('Project title:', elements.projectTitle);
    console.log('Project subtitle:', elements.projectSubtitle);
    
    // Avec la nouvelle logique à une seule image, imageElements.length devrait être 1.
    // Ou alors, on cible directement .project-image-display (qui est la classe unique maintenant sur l'img)
    const imageDisplayElement = projectSection.querySelector('.project-image-display');
    if (imageDisplayElement) {
        console.log('Image display element for single image fade found:', imageDisplayElement);
        elements.imageElements = [imageDisplayElement]; // Conserver la structure d'elements si utilisée ailleurs
    } else {
        console.error('Expected 1 image display element (.project-image-display), found none.');
        return; 
    }
    console.log('Previous project button:', elements.prevProjectBtn);
    console.log('Next project button:', elements.nextProjectBtn);
    console.log('Previous image button:', elements.prevImageBtn);
    console.log('Next image button:', elements.nextImageBtn);
    
    if (!elements.projectTitle || !elements.projectSubtitle || !imageDisplayElement) {
        console.error('Éléments de base manquants pour la galerie (titre, sous-titre ou image), arrêt du script');
        return;
    }
    
    // Extraction des éléments avec vérification
    const projectTitle = elements.projectTitle;
    const projectSubtitle = elements.projectSubtitle;
    // let activeImageElement = document.querySelector('.project-image-display.active-img'); // Plus besoin
    // let preloadImageElement = document.querySelector('.project-image-display.preload-img'); // Plus besoin
    const currentImageElement = imageDisplayElement; // C'est notre unique image
    const topNav = elements.topNav;
    const bottomNav = elements.bottomNav;
    const projectCounter = elements.projectCounter;
    const imageCounter = elements.imageCounter;
    
    // Vérification des boutons de navigation
    const prevProjectBtn = document.querySelector('.top-nav .project-prev');
    const nextProjectBtn = document.querySelector('.top-nav .project-next');
    const prevImageBtn = document.querySelector('.bottom-nav .image-prev');
    const nextImageBtn = document.querySelector('.bottom-nav .image-next');
    
    console.log('Boutons trouvés directement avec querySelector:');
    console.log('prevProjectBtn:', prevProjectBtn);
    console.log('nextProjectBtn:', nextProjectBtn);
    console.log('prevImageBtn:', prevImageBtn);
    console.log('nextImageBtn:', nextImageBtn);
    
    // Vérifier si les boutons sont des éléments valides
    if (!prevProjectBtn || !nextProjectBtn || !prevImageBtn || !nextImageBtn) {
        console.error('Un ou plusieurs boutons de navigation n\'ont pas été trouvés');
        // Essayer de les sélectionner à nouveau avec une méthode différente si nécessaire
        console.log('Tentative de sélection alternative des boutons...');
        
        // Sélectionner tous les boutons et vérifier leurs classes
        const allButtons = document.querySelectorAll('button');
        console.log('Tous les boutons trouvés:', allButtons);
        
        allButtons.forEach(btn => {
            console.log('Bouton trouvé:', btn.outerHTML);
        });
    }
    
    // Ajout des classes pour les compteurs
    if (projectCounter) projectCounter.classList.add('project-counter');
    if (imageCounter) imageCounter.classList.add('image-counter');
    
    // Variables d'état
    let currentProjectIndex = 0;
    let currentImageIndex = 0;
    
    // Vérifier si la configuration des projets est disponible
    if (typeof projects === 'undefined' || projects.length === 0) {
        console.error('Aucun projet configuré');
        return;
    }
    
    // Mettre à jour l'affichage
    function updateDisplay() {
        console.log('Updating display...');
        console.log('Current project index:', currentProjectIndex, 'Current image index:', currentImageIndex);
        
        const project = projects[currentProjectIndex];
        const image = project.images[currentImageIndex];
        const isLastProject = currentProjectIndex === projects.length - 1;
        const isFirstProject = currentProjectIndex === 0;
        
        console.log('Project:', project.title);
        console.log('Image:', image.subtitle);
        console.log('Is last project:', isLastProject, 'Is first project:', isFirstProject);
        
        // Mettre à jour les titres et ajuster la police
        adjustAndSplitText(projectTitle, project.title, 14);
        adjustAndSplitText(projectSubtitle, image.subtitle, 12);

        // Mettre à jour les titres et sous-titres
        adjustAndSplitText(projectTitle, project.title, 14);
        adjustAndSplitText(projectSubtitle, image.subtitle, 12);

        // ----- Logique de Fondu pour Image Unique -----
        const newImageSrc = image.src;
        const currentSrc = currentImageElement.src;

        // Vérifier si la source de l'image doit réellement changer
        // La comparaison directe de src peut être problématique si l'une est absolue et l'autre relative.
        // Utiliser endsWith est plus sûr si image.src est toujours relatif.
        let imagesAreDifferent = true;
        if (currentSrc && newImageSrc) {
            imagesAreDifferent = !currentSrc.endsWith(newImageSrc);
        } else if (!newImageSrc && !currentSrc) { // Both are empty or null
            imagesAreDifferent = false;
        }


        if (imagesAreDifferent) {
            console.log(`[Galerie SingleImg] Changement d'image de ${currentSrc} vers ${newImageSrc}`);
            currentImageElement.style.opacity = '0';

            // Attendre la fin de la transition d'opacité pour changer la source
            // Utiliser une propriété pour stocker le handler afin de le retirer si besoin
            if (currentImageElement.galleryTransitionEndHandler) {
                currentImageElement.removeEventListener('transitionend', currentImageElement.galleryTransitionEndHandler);
            }

            currentImageElement.galleryTransitionEndHandler = function handleTransitionEnd(event) {
                // S'assurer que c'est bien la transition d'opacité qui a fini
                if (event.propertyName !== 'opacity' || currentImageElement.style.opacity !== '0') {
                    return;
                }
                console.log("[Galerie SingleImg] Transition opacity 0 terminée. Changement src.");
                currentImageElement.removeEventListener('transitionend', handleTransitionEnd); // Auto-nettoyage
                currentImageElement.galleryTransitionEndHandler = null;

                currentImageElement.src = newImageSrc;
                currentImageElement.alt = image.subtitle;

                // Attendre que la nouvelle image soit chargée pour la faire réapparaître
                if (currentImageElement.galleryImageLoadHandler) {
                    currentImageElement.removeEventListener('load', currentImageElement.galleryImageLoadHandler);
                }
                currentImageElement.galleryImageLoadHandler = function handleLoad() {
                    console.log("[Galerie SingleImg] Nouvelle image chargée. Opacity 1.");
                    currentImageElement.style.opacity = '1';
                    currentImageElement.removeEventListener('load', handleLoad);
                    currentImageElement.galleryImageLoadHandler = null;
                };
                currentImageElement.addEventListener('load', currentImageElement.galleryImageLoadHandler);

                // Si l'image est déjà en cache, onload pourrait ne pas se déclencher.
                // Forcer l'opacité à 1 si c'est le cas, après un bref délai pour que la src soit prise en compte.
                if (currentImageElement.complete && currentImageElement.src.endsWith(newImageSrc)) {
                    console.log("[Galerie SingleImg] Image en cache, opacity 1 (après src change).");
                     // requestAnimationFrame(() => currentImageElement.style.opacity = '1');
                     // L'événement load devrait quand même se déclencher pour les images en cache.
                     // Si ce n'est pas le cas, il faudrait forcer ici.
                     // Pour l'instant, on se fie au `load`.
                }
            };
            currentImageElement.addEventListener('transitionend', currentImageElement.galleryTransitionEndHandler);
            
            // Si l'opacité est déjà à 0 (par ex. navigation très rapide), changer la src directement
            // et préparer le fade in.
            if (parseFloat(window.getComputedStyle(currentImageElement).opacity) === 0) {
                 console.log("[Galerie SingleImg] Opacité déjà 0, changement src direct.");
                 if (currentImageElement.galleryTransitionEndHandler) { // Nettoyer le listener transitionend car on ne l'attendra pas
                    currentImageElement.removeEventListener('transitionend', currentImageElement.galleryTransitionEndHandler);
                     currentImageElement.galleryTransitionEndHandler = null;
                 }
                currentImageElement.src = newImageSrc;
                currentImageElement.alt = image.subtitle;
                if (currentImageElement.galleryImageLoadHandler) { // Nettoyer au cas où
                    currentImageElement.removeEventListener('load', currentImageElement.galleryImageLoadHandler);
                }
                currentImageElement.galleryImageLoadHandler = function handleLoad() {
                    console.log("[Galerie SingleImg] Nouvelle image chargée (src direct). Opacity 1.");
                    currentImageElement.style.opacity = '1';
                    currentImageElement.removeEventListener('load', handleLoad);
                    currentImageElement.galleryImageLoadHandler = null;
                };
                currentImageElement.addEventListener('load', currentImageElement.galleryImageLoadHandler);
                if (currentImageElement.complete && currentImageElement.src.endsWith(newImageSrc)) {
                    currentImageElement.galleryImageLoadHandler(); // Déclencher manuellement
                }
            }


        } else {
            console.log("[Galerie SingleImg] Image est déjà la bonne:", newImageSrc);
            // S'assurer que l'opacité est à 1 si elle avait été mise à 0 par erreur
            if (currentImageElement.style.opacity !== '1') {
                 currentImageElement.style.opacity = '1';
            }
        }
        // ----- Fin Logique de Fondu pour Image Unique -----
            
        // Mettre à jour les compteurs
        projectCounter.textContent = `${(currentProjectIndex + 1).toString().padStart(2, '0')}/${projects.length.toString().padStart(2, '0')}`;
        imageCounter.textContent = `${(currentImageIndex + 1).toString().padStart(2, '0')}/${project.images.length.toString().padStart(2, '0')}`;
        
        // Toujours afficher les flèches de navigation d'images
        prevImageBtn.style.visibility = 'visible';
        nextImageBtn.style.visibility = 'visible';
        
        // Toujours activer les flèches, même pour les projets avec une seule image
        prevImageBtn.disabled = false;
        nextImageBtn.disabled = false;
        
        // Gérer la visibilité des flèches de navigation des projets
        prevProjectBtn.style.visibility = isFirstProject ? 'hidden' : 'visible';
        nextProjectBtn.style.visibility = isLastProject ? 'hidden' : 'visible';
        
        // Désactiver les boutons si nécessaire (pour l'accessibilité)
        prevProjectBtn.disabled = isFirstProject;
        nextProjectBtn.disabled = isLastProject;
    }
    
    // Aller au projet précédent
    function goToPrevProject() {
        if (currentProjectIndex > 0) {
            currentProjectIndex--;
            currentImageIndex = 0; // Réinitialiser l'index de l'image
            updateDisplay();
        }
    }
    
    // Aller au projet suivant
    function goToNextProject() {
        console.log('goToNextProject called');
        console.log('Current project index:', currentProjectIndex, 'Total projects:', projects.length);
        
        if (currentProjectIndex < projects.length - 1) {
            console.log('Moving to next project');
            currentProjectIndex++;
            currentImageIndex = 0; // Réinitialiser l'index de l'image
            console.log('New project index:', currentProjectIndex);
            updateDisplay();
        } else {
            console.log('Already at last project');
        }
    }
    
    // Aller à l'image précédente
    function goToPrevImage() {
        console.log('goToPrevImage called');
        console.log('Current project index:', currentProjectIndex, 'Current image index:', currentImageIndex);
        
        const project = projects[currentProjectIndex];
        console.log('Project:', project.title, 'Total images:', project.images.length);
        
        // Si on n'est pas à la première image du projet, aller à l'image précédente
        if (currentImageIndex > 0) {
            console.log('Going to previous image in same project');
            currentImageIndex--;
        } 
        // Si c'est la première image du projet
        else {
            console.log('First image of current project');
            // Si ce n'est pas le premier projet, aller au projet précédent
            if (currentProjectIndex > 0) {
                console.log('Moving to previous project');
                currentProjectIndex--;
                currentImageIndex = projects[currentProjectIndex].images.length - 1; // Dernière image du projet précédent
            } 
            // Si c'est le premier projet, aller au dernier projet
            else {
                console.log('Returning to last project');
                currentProjectIndex = projects.length - 1;
                currentImageIndex = projects[currentProjectIndex].images.length - 1; // Dernière image du dernier projet
            }
        }
        
        console.log('New project index:', currentProjectIndex, 'New image index:', currentImageIndex);
        updateDisplay();
    }
    
    // Aller à l'image suivante
    function goToNextImage() {
        console.log('goToNextImage called');
        console.log('Current project index:', currentProjectIndex, 'Current image index:', currentImageIndex);
        
        const project = projects[currentProjectIndex];
        console.log('Project:', project.title, 'Total images:', project.images.length);
        
        // Si on n'est pas à la dernière image du projet, aller à l'image suivante
        if (currentImageIndex < project.images.length - 1) {
            console.log('Going to next image in same project');
            currentImageIndex++;
        } 
        // Si c'est la dernière image du projet
        else {
            console.log('Last image of current project');
            // Si ce n'est pas le dernier projet, aller au projet suivant
            if (currentProjectIndex < projects.length - 1) {
                console.log('Moving to next project');
                currentProjectIndex++;
                currentImageIndex = 0;
            } 
            // Si c'est le dernier projet, revenir au premier projet
            else {
                console.log('Returning to first project');
                currentProjectIndex = 0;
                currentImageIndex = 0;
            }
        }
        
        console.log('New project index:', currentProjectIndex, 'New image index:', currentImageIndex);
        updateDisplay();
    }
    
    // Fonction pour ajouter les écouteurs d'événements
    function addEventListeners() {
        console.log('Adding event listeners...');
        
        // Sélectionner à nouveau les boutons au moment de l'ajout des écouteurs
        const prevProjectBtn = document.querySelector('.top-nav .project-prev');
        const nextProjectBtn = document.querySelector('.top-nav .project-next');
        const prevImageBtn = document.querySelector('.bottom-nav .image-prev');
        const nextImageBtn = document.querySelector('.bottom-nav .image-next');
        
        console.log('Boutons au moment de l\'ajout des écouteurs:');
        console.log('prevProjectBtn:', prevProjectBtn);
        console.log('nextProjectBtn:', nextProjectBtn);
        console.log('prevImageBtn:', prevImageBtn);
        console.log('nextImageBtn:', nextImageBtn);
        
        // Vérifier que les boutons existent avant d'ajouter les écouteurs
        if (prevProjectBtn) {
            console.log('Adding event listener to prevProjectBtn');
            prevProjectBtn.onclick = function(e) {
                console.log('Prev project button clicked');
                e.preventDefault();
                e.stopPropagation();
                goToPrevProject();
                return false;
            };
        } else {
            console.error('prevProjectBtn not found');
        }
        
        if (nextProjectBtn) {
            console.log('Adding event listener to nextProjectBtn');
            nextProjectBtn.onclick = function(e) {
                console.log('Next project button clicked');
                e.preventDefault();
                e.stopPropagation();
                goToNextProject();
                return false;
            };
        } else {
            console.error('nextProjectBtn not found');
        }
        
        if (prevImageBtn) {
            console.log('Adding event listener to prevImageBtn');
            prevImageBtn.onclick = function(e) {
                console.log('Prev image button clicked');
                e.preventDefault();
                e.stopPropagation();
                goToPrevImage();
                return false;
            };
        } else {
            console.error('prevImageBtn not found');
        }
        
        if (nextImageBtn) {
            console.log('Adding event listener to nextImageBtn');
            nextImageBtn.onclick = function(e) {
                console.log('Next image button clicked');
                e.preventDefault();
                e.stopPropagation();
                goToNextImage();
                return false;
            };
        }
        
        // Variables pour la gestion du swipe
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartTime = 0;
        const SWIPE_THRESHOLD = 50;
        const projectImageContainer = document.querySelector('.project-image-container');
        
        if (projectImageContainer) {
            projectImageContainer.addEventListener('touchstart', function(e) {
                // Si un seul doigt, on prépare le swipe
                if (e.touches.length === 1) {
                    touchStartTime = Date.now();
                    touchStartX = e.touches[0].clientX;
                } else {
                    // Plus d'un doigt, on annule le swipe
                    touchStartX = 0;
                }
            }, { passive: true });
            
            projectImageContainer.addEventListener('touchend', function(e) {
                if (touchStartX && e.changedTouches.length === 1) {
                    const touch = e.changedTouches[0];
                    const touchDuration = Date.now() - touchStartTime;
                    const touchDistance = Math.abs(touch.clientX - touchStartX);
                    
                    // Seulement si le swipe est rapide et assez long
                    if (touchDuration < 300 && touchDistance > 50) {
                        touchEndX = touch.screenX;
                        handleSwipe();
                    }
                }
                // Réinitialiser pour le prochain touch
                touchStartX = 0;
            }, { passive: true });
            
            // Annuler le swipe si l'utilisateur bouge avec plusieurs doigts
            projectImageContainer.addEventListener('touchmove', function(e) {
                if (e.touches.length > 1) {
                    touchStartX = 0;
                }
            }, { passive: true });
            
            function handleSwipe() {
                const swipeDistance = touchEndX - touchStartX;
                
                if (Math.abs(swipeDistance) < SWIPE_THRESHOLD) return;
                
                if (swipeDistance > 0) {
                    // Swipe vers la droite = image précédente
                    goToPrevImage();
                } else {
                    // Swipe vers la gauche = image suivante
                    goToNextImage();
                }
            }
        }
    }
    
    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) < SWIPE_THRESHOLD) return;
        
        if (swipeDistance > 0) {
            // Swipe vers la droite = image précédente
            goToPrevImage();
        } else {
            // Swipe vers la gauche = image suivante
            goToNextImage();
        }
    }
    
    // Gestion des touches du clavier
    document.addEventListener('keydown', function(e) {
        switch (e.key) {
            case 'ArrowLeft':
                if (e.shiftKey) {
                    goToPrevProject();
                } else {
                    goToPrevImage();
                }
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (e.shiftKey) {
                    goToNextProject();
                } else {
                    goToNextImage();
                }
                e.preventDefault();
                break;
        }
    });
    
    // Attendre que le DOM soit complètement chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Petit délai supplémentaire pour s'assurer que tout est prêt
            setTimeout(addEventListeners, 100);
        });
    } else {
        // Le DOM est déjà chargé, ajouter les écouteurs après un court délai
        setTimeout(addEventListeners, 100);
    }
    
    // Forcer une mise à jour au chargement complet pour garantir des dimensions stables
    window.addEventListener('load', updateDisplay);
    
    // Initialisation
    try {
        updateDisplay();
        
        // Forcer la visibilité au chargement
        forceElementsVisibility();
        
        // Forcer la visibilité toutes les 500ms (solution de secours)
        setInterval(forceElementsVisibility, 500);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation :', error);
    }

    // --- LIGHTBOX LOGIC (All Screens) ---
    console.log('[Lightbox] Initializing Lightbox Logic...');
    const lightboxModal = document.getElementById('lightbox-modal');
    console.log('[Lightbox] lightboxModal element:', lightboxModal);

    if (lightboxModal) { // Check if lightbox HTML element exists
        console.log('[Lightbox] Lightbox HTML found. Proceeding with setup for all screens.');
        const lightboxImageElement = lightboxModal.querySelector('.lightbox-image-display'); // Unique image
        // let lightboxActiveImageElement = lightboxModal.querySelector('.lightbox-image-display.active-img'); // Plus besoin
        // let lightboxPreloadImageElement = lightboxModal.querySelector('.lightbox-image-display.preload-img'); // Plus besoin
        const lightboxProjectTitleElement = lightboxModal.querySelector('.lightbox-project-title');
        const lightboxImageSubtitleElement = lightboxModal.querySelector('.lightbox-image-subtitle');
        const lightboxCloseButton = lightboxModal.querySelector('.lightbox-close');
        const lightboxPrevButton = lightboxModal.querySelector('.lightbox-prev');
        const lightboxNextButton = lightboxModal.querySelector('.lightbox-next');
        const mainGalleryImage = document.querySelector('.project-image');
        const lightboxImageContainer = lightboxModal.querySelector('.lightbox-image-container'); // Target for swipe

        let lightboxCurrentProjectIndex = 0;
        let lightboxCurrentImageIndex = 0;

        function updateLightboxDisplay() {
            if (!projects || projects.length === 0) return;
            const project = projects[lightboxCurrentProjectIndex];
            const image = project.images[lightboxCurrentImageIndex];

            if (!lightboxActiveImageElement || !lightboxPreloadImageElement) {
                lightboxActiveImageElement = lightboxModal.querySelector('.lightbox-image-display.active-img');
                lightboxPreloadImageElement = lightboxModal.querySelector('.lightbox-image-display.preload-img');
                if (!lightboxActiveImageElement || !lightboxPreloadImageElement) {
                    console.error("[Lightbox] Impossible de trouver les éléments image pour le fondu dans la lightbox.");
                    return;
                }
            }

            lightboxPreloadImageElement.src = image.src;
            // Mettre à jour les titres et sous-titres
            adjustAndSplitText(lightboxProjectTitleElement, project.title, 14);
            adjustAndSplitText(lightboxImageSubtitleElement, image.subtitle, 12);

            // ----- Logique de Fondu pour Image Unique (Lightbox) -----
            const newLightboxImageSrc = image.src;
            const currentLightboxSrc = lightboxImageElement.src;
            let lbImagesAreDifferent = true;

            if (currentLightboxSrc && newLightboxImageSrc) {
                lbImagesAreDifferent = !currentLightboxSrc.endsWith(newLightboxImageSrc);
            } else if (!newLightboxImageSrc && !currentLightboxSrc) {
                lbImagesAreDifferent = false;
            }

            if (lbImagesAreDifferent) {
                console.log(`[Lightbox SingleImg] Changement d'image de ${currentLightboxSrc} vers ${newLightboxImageSrc}`);
                lightboxImageElement.style.opacity = '0';

                if (lightboxImageElement.lightboxTransitionEndHandler) {
                    lightboxImageElement.removeEventListener('transitionend', lightboxImageElement.lightboxTransitionEndHandler);
                }
                lightboxImageElement.lightboxTransitionEndHandler = function handleLBTransitionEnd(event) {
                    if (event.propertyName !== 'opacity' || lightboxImageElement.style.opacity !== '0') {
                        return;
                    }
                    console.log("[Lightbox SingleImg] Transition opacity 0 terminée. Changement src.");
                    lightboxImageElement.removeEventListener('transitionend', handleLBTransitionEnd);
                    lightboxImageElement.lightboxTransitionEndHandler = null;
                    
                    lightboxImageElement.src = newLightboxImageSrc;
                    lightboxImageElement.alt = image.subtitle;

                    if (lightboxImageElement.lightboxImageLoadHandler) {
                        lightboxImageElement.removeEventListener('load', lightboxImageElement.lightboxImageLoadHandler);
                    }
                    lightboxImageElement.lightboxImageLoadHandler = function handleLBLoad() {
                        console.log("[Lightbox SingleImg] Nouvelle image chargée. Opacity 1.");
                        lightboxImageElement.style.opacity = '1';
                        lightboxImageElement.removeEventListener('load', handleLBLoad);
                        lightboxImageElement.lightboxImageLoadHandler = null;
                    };
                    lightboxImageElement.addEventListener('load', lightboxImageElement.lightboxImageLoadHandler);

                    if (lightboxImageElement.complete && lightboxImageElement.src.endsWith(newLightboxImageSrc)) {
                       lightboxImageElement.lightboxImageLoadHandler();
                    }
                };
                lightboxImageElement.addEventListener('transitionend', lightboxImageElement.lightboxTransitionEndHandler);

                if (parseFloat(window.getComputedStyle(lightboxImageElement).opacity) === 0) {
                    console.log("[Lightbox SingleImg] Opacité déjà 0, changement src direct.");
                    if (lightboxImageElement.lightboxTransitionEndHandler) {
                        lightboxImageElement.removeEventListener('transitionend', lightboxImageElement.lightboxTransitionEndHandler);
                        lightboxImageElement.lightboxTransitionEndHandler = null;
                    }
                    lightboxImageElement.src = newLightboxImageSrc;
                    lightboxImageElement.alt = image.subtitle;

                    if (lightboxImageElement.lightboxImageLoadHandler) {
                         lightboxImageElement.removeEventListener('load', lightboxImageElement.lightboxImageLoadHandler);
                    }
                    lightboxImageElement.lightboxImageLoadHandler = function handleLBLoadDirect() {
                        console.log("[Lightbox SingleImg] Nouvelle image chargée (src direct). Opacity 1.");
                        lightboxImageElement.style.opacity = '1';
                        lightboxImageElement.removeEventListener('load', handleLBLoadDirect);
                        lightboxImageElement.lightboxImageLoadHandler = null;
                    };
                    lightboxImageElement.addEventListener('load', lightboxImageElement.lightboxImageLoadHandler);
                    if (lightboxImageElement.complete && lightboxImageElement.src.endsWith(newLightboxImageSrc)) {
                        lightboxImageElement.lightboxImageLoadHandler();
                    }
                }


            } else {
                console.log("[Lightbox SingleImg] Image est déjà la bonne:", newLightboxImageSrc);
                if (lightboxImageElement.style.opacity !== '1') {
                    lightboxImageElement.style.opacity = '1';
                }
            }
            // ----- Fin Logique de Fondu pour Image Unique (Lightbox) -----
        }

        function openLightbox() {
            console.log('[Lightbox] openLightbox() called.');
            // Sync lightbox indices with main gallery indices
            lightboxCurrentProjectIndex = currentProjectIndex;
            lightboxCurrentImageIndex = currentImageIndex;
            console.log(`[Lightbox] Synced indices: Project=${lightboxCurrentProjectIndex}, Image=${lightboxCurrentImageIndex}`);
            
            updateLightboxDisplay();

            // Explicitly remove inline display:none if it exists, to let CSS classes take over.
            if (lightboxModal.style.display === 'none') {
                console.log('[Lightbox] Removing inline style display:none.');
                lightboxModal.style.display = ''; 
            }
            
            lightboxModal.classList.add('active'); // This class makes it visible via opacity and visibility
            document.body.classList.add('lightbox-active');
            console.log('[Lightbox] Lightbox should now be active (classes added, inline display removed if present).');
        }

        function closeLightbox() {
            console.log('[Lightbox] closeLightbox() called.');
            lightboxModal.classList.remove('active');
            document.body.classList.remove('lightbox-active');
            // No need to re-add display:none if it was inline, opacity/visibility handles hiding.
            console.log('[Lightbox] Lightbox should now be hidden (classes removed).');
        }

        function lightboxGoToPrevImage() {
            const project = projects[lightboxCurrentProjectIndex];
            if (lightboxCurrentImageIndex > 0) {
                lightboxCurrentImageIndex--;
            } else {
                if (lightboxCurrentProjectIndex > 0) {
                    lightboxCurrentProjectIndex--;
                    lightboxCurrentImageIndex = projects[lightboxCurrentProjectIndex].images.length - 1;
                } else {
                    // Wrap to last image of last project
                    lightboxCurrentProjectIndex = projects.length - 1;
                    lightboxCurrentImageIndex = projects[lightboxCurrentProjectIndex].images.length - 1;
                }
            }
            updateLightboxDisplay();
        }

        function lightboxGoToNextImage() {
            const project = projects[lightboxCurrentProjectIndex];
            if (lightboxCurrentImageIndex < project.images.length - 1) {
                lightboxCurrentImageIndex++;
            } else {
                if (lightboxCurrentProjectIndex < projects.length - 1) {
                    lightboxCurrentProjectIndex++;
                    lightboxCurrentImageIndex = 0;
                } else {
                    // Wrap to first image of first project
                    lightboxCurrentProjectIndex = 0;
                    lightboxCurrentImageIndex = 0;
                }
            }
            updateLightboxDisplay();
        }

        if (mainGalleryImage) {
            console.log('[Lightbox] mainGalleryImage found:', mainGalleryImage);
            mainGalleryImage.addEventListener('click', (e) => {
                console.log('[Lightbox] Main gallery image clicked.');
                // No longer checking for desktop width here, should open on all screens
                console.log('[Lightbox] Preventing default and calling openLightbox().');
                e.preventDefault();
                openLightbox();
            });
            // Add cursor pointer (mostly for desktop, but harmless on mobile)
             mainGalleryImage.style.cursor = 'pointer';
             console.log('[Lightbox] Event listener added to main gallery image.');
        } else {
            console.log('[Lightbox] mainGalleryImage NOT found.');
        }

        lightboxCloseButton.addEventListener('click', closeLightbox);
        lightboxPrevButton.addEventListener('click', lightboxGoToPrevImage);
        lightboxNextButton.addEventListener('click', lightboxGoToNextImage);

        lightboxModal.addEventListener('click', (e) => {
            // Close if clicked on the modal backdrop (outside the content)
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        // Lightbox Keyboard Navigation
        document.addEventListener('keydown', function(e) {
            if (lightboxModal.classList.contains('active')) { // Only if lightbox is active
                switch (e.key) {
                    case 'ArrowLeft':
                        lightboxGoToPrevImage();
                        e.preventDefault();
                        break;
                    case 'ArrowRight':
                        lightboxGoToNextImage();
                        e.preventDefault();
                        break;
                    case 'Escape':
                        closeLightbox();
                        e.preventDefault();
                        break;
                }
            }
        });

        // Lightbox Swipe Navigation
        let lightboxTouchStartX = 0;
        let lightboxTouchEndX = 0;
        let lightboxTouchStartTime = 0;
        const LIGHTBOX_SWIPE_THRESHOLD = 40; // Slightly smaller threshold for lightbox
        const LIGHTBOX_SWIPE_MAX_DURATION = 400; // Max duration for a swipe to be considered valid

        if (lightboxImageContainer) { // Use lightboxImageContainer for swipe
            lightboxImageContainer.addEventListener('touchstart', function(e) {
                if (!lightboxModal.classList.contains('active')) return;
                if (e.touches.length === 1) {
                    lightboxTouchStartTime = Date.now();
                    lightboxTouchStartX = e.touches[0].clientX;
                    console.log('[Lightbox Swipe] Touchstart X:', lightboxTouchStartX);
                } else {
                    lightboxTouchStartX = 0; // Invalidate swipe if multiple fingers
                }
            }, { passive: true });

            lightboxImageContainer.addEventListener('touchmove', function(e) {
                if (!lightboxModal.classList.contains('active') || lightboxTouchStartX === 0) return;
                 // If user moves with multiple fingers, invalidate swipe for this gesture
                if (e.touches.length > 1) {
                    lightboxTouchStartX = 0; 
                }
            }, { passive: true });
            
            lightboxImageContainer.addEventListener('touchend', function(e) {
                if (!lightboxModal.classList.contains('active') || lightboxTouchStartX === 0 || e.changedTouches.length !== 1) {
                    lightboxTouchStartX = 0; // Reset if not active, swipe already invalidated, or multi-touch release
                    return;
                }

                lightboxTouchEndX = e.changedTouches[0].clientX;
                const touchDuration = Date.now() - lightboxTouchStartTime;
                const swipeDistance = lightboxTouchEndX - lightboxTouchStartX;
                console.log('[Lightbox Swipe] Touchend X:', lightboxTouchEndX, 'Distance:', swipeDistance, 'Duration:', touchDuration);

                if (touchDuration < LIGHTBOX_SWIPE_MAX_DURATION && Math.abs(swipeDistance) > LIGHTBOX_SWIPE_THRESHOLD) {
                    console.log('[Lightbox Swipe] Valid swipe detected.');
                    if (swipeDistance > 0) {
                        console.log('[Lightbox Swipe] Swiped right (previous image).');
                        lightboxGoToPrevImage();
                    } else {
                        console.log('[Lightbox Swipe] Swiped left (next image).');
                        lightboxGoToNextImage();
                    }
                    // e.preventDefault(); // Consider if needed; typically not for passive listeners if action is self-contained
                } else {
                    console.log('[Lightbox Swipe] Swipe did not meet criteria (too slow, too short, or wrong direction).');
                }
                lightboxTouchStartX = 0; // Reset for next touch
            }, { passive: true });
            console.log('[Lightbox] Swipe event listeners added to lightbox image container.');
        } else {
            console.log('[Lightbox] Lightbox image container for swipe not found.');
        }

        console.log('[Lightbox] Lightbox setup complete.');
    } else {
        console.log('[Lightbox] Lightbox HTML element (#lightbox-modal) not found. Lightbox logic skipped.');
    }
    // --- END LIGHTBOX LOGIC ---
}

document.addEventListener('DOMContentLoaded', function() {
    // Afficher la structure des projets pour le débogage
    if (typeof projects !== 'undefined') { // Check if projects is defined
        console.log('Projects structure:', JSON.parse(JSON.stringify(projects)));
    } else {
        console.log('Projects variable is not defined on this page.');
    }
    
    // Initialiser la navigation des projets
    initProjectNavigation();
    
    const hamburger = document.querySelector('.hamburger-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const menuItems = document.querySelectorAll('.has-submenu');
    const closeMenuBtn = document.querySelector('.close-menu');
    let isSubmenuOpen = false;
    
    // Fonction pour fermer tous les sous-menus
    function closeAllSubmenus() {
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
        isSubmenuOpen = false;
    }
    
    // Fonction pour basculer le menu principal
    function toggleMainMenu() {
        const isOpening = !hamburger.classList.contains('active');
    
        if (isOpening) {
            hamburger.classList.add('active');
            dropdownMenu.classList.add('active');
            closeMenuBtn.style.display = 'flex';
            hamburger.style.display = 'none';
    
            document.addEventListener('click', closeMenuOnClickOutside);
        } else {
            hamburger.classList.remove('active');
            dropdownMenu.classList.remove('active');
            closeMenuBtn.style.display = 'none';
            hamburger.style.display = 'flex';
    
            document.removeEventListener('click', closeMenuOnClickOutside);
            closeAllSubmenus();
        }
    }
    
    // Fermer le menu en cliquant à l'extérieur
    function closeMenuOnClickOutside(event) {
        if (!hamburger.contains(event.target) && !dropdownMenu.contains(event.target) && event.target !== closeMenuBtn) {
            hamburger.classList.remove('active');
            dropdownMenu.classList.remove('active');
            closeMenuBtn.style.display = 'none';
            hamburger.style.display = 'flex';
            
            document.removeEventListener('click', closeMenuOnClickOutside);
            closeAllSubmenus();
        }
    }
    
    // Gestionnaire d'événement pour le clic sur le menu hamburger
    if (hamburger) {
        hamburger.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleMainMenu();
        });
    }
    
    // Gestion des clics sur les éléments de menu avec sous-menus
    menuItems.forEach(item => {
        const link = item.querySelector('.menu-item');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Basculer le sous-menu actuel
            const wasActive = item.classList.contains('active');
            closeAllSubmenus();
            
            if (!wasActive) {
                item.classList.add('active');
                isSubmenuOpen = true;
            }
        });
    });
    
    // Gestion des clics sur les liens de sous-menu
    const submenuLinks = document.querySelectorAll('.submenu a');
    submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            const href = link.getAttribute('href');
            
            // Si le lien pointe vers une page différente, on laisse la navigation se faire
            if (href && href !== '#' && !link.classList.contains('no-navigate')) {
                // Fermer le menu avant la navigation
                hamburger.classList.remove('active');
                dropdownMenu.classList.remove('active');
                closeAllSubmenus();
                document.removeEventListener('click', closeMenuOnClickOutside);
                // La navigation se fera normalement via le lien
                return true;
            }
            
            // Pour les autres cas (liens ancres, etc.), on empêche le comportement par défaut
            e.preventDefault();
            
            // Fermer le menu après un court délai pour une meilleure expérience utilisateur
            setTimeout(() => {
                hamburger.classList.remove('active');
                dropdownMenu.classList.remove('active');
                closeAllSubmenus();
                document.removeEventListener('click', closeMenuOnClickOutside);
            }, 100);
        });
    });
    
    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            dropdownMenu.classList.remove('active');
            closeMenuBtn.style.display = 'none';
            hamburger.style.display = 'flex';
            
            closeAllSubmenus();
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    });
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            hamburger.classList.remove('active');
            dropdownMenu.classList.remove('active');
            closeMenuBtn.style.display = 'none';
            hamburger.style.display = 'flex';
            
            document.removeEventListener('click', closeMenuOnClickOutside);
            closeAllSubmenus();
        });
    }
    
    // Gestion du swipe pour fermer le menu sur mobile
    let touchStartX = null;
    let touchStartY = null;
    let touchEndX = null;
    let touchEndY = null;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    dropdownMenu.addEventListener('touchstart', function(e) {
        if (!isMobile() || !dropdownMenu.classList.contains('active')) return;
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    });

    dropdownMenu.addEventListener('touchmove', function(e) {
        if (!isMobile() || !dropdownMenu.classList.contains('active')) return;
        if (e.touches.length === 1) {
            touchEndX = e.touches[0].clientX;
            touchEndY = e.touches[0].clientY;
        }
    });

    dropdownMenu.addEventListener('touchend', function(e) {
        if (!isMobile() || !dropdownMenu.classList.contains('active')) return;
        if (touchStartX !== null && touchEndX !== null) {
            const dx = touchEndX - touchStartX;
            const dy = Math.abs(touchEndY - touchStartY);
            // Swipe de droite vers la gauche, horizontal, pas trop vertical
            if (dx < -50 && dy < 50) {
                hamburger.classList.remove('active');
                dropdownMenu.classList.remove('active');
                closeMenuBtn.style.display = 'none';
                hamburger.style.display = 'flex';
                
                // Restore the original positioning from CSS
                const logoText = document.querySelector('.logo-text');
                const logoContainer = document.querySelector('.logo-container');
                
                // Let CSS handle positioning by removing inline styles
                if (logoText) {
                    logoText.style.removeProperty('position');
                    logoText.style.removeProperty('top');
                    logoText.style.removeProperty('marginTop');
                }
                
                if (logoContainer) {
                    logoContainer.style.removeProperty('position');
                    logoContainer.style.removeProperty('top');
                }
                
                document.removeEventListener('click', closeMenuOnClickOutside);
                closeAllSubmenus();
            }
        }
        touchStartX = null;
        touchEndX = null;
        touchStartY = null;
        touchEndY = null;
    });
});
