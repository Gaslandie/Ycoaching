/**
 * Y COACHING - Script Principal
 * Version 2.1 - Corrections complètes
 * 
 * 
 */

// Charger le loader
function loadLoader() {
    const body = document.body;

    // Insérer le loader au début du body
    fetch('src/components/loader.html')
        .then(response => {
            if (!response.ok) throw new Error('Loader non trouvé');
            return response.text();
        })
        .then(data => {
            body.insertAdjacentHTML('afterbegin', data);

            // Initialiser le loader
            initLoader();
        })
        .catch(error => {
            console.warn('Loader non chargé:', error);
            // Continuer sans loader
            document.documentElement.classList.add('page-loaded');
        });
}

// Initialiser le loader
function initLoader() {
    const loader = document.getElementById('page-loader');

    if (!loader) return;

    // Cache TOUTE la page au début
    document.body.classList.add('page-loading');

    // Quand le loader est prêt, montrer la page progressivement
    setTimeout(() => {
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-loaded');
    }, 100);

    // Événement quand tout est chargé
    window.addEventListener('load', () => {
        hideLoader();

        // Animation finale de la page
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 100);
    });

    // Fallback
    setTimeout(() => {
        if (document.readyState === 'complete') {
            hideLoader();
            document.body.classList.add('page-loaded');
        }
    }, 3000);

    // NE PAS cacher au clic
    // document.addEventListener('click', hideLoader, { once: true });
}

// Cacher le loader
function hideLoader() {
    const loader = document.getElementById('page-loader');

    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');

        setTimeout(() => {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }

            // La page est maintenant complètement chargée
            document.body.classList.add('page-loaded');
            document.documentElement.classList.add('page-loaded');

            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 600);
    }
}

// Fonction pour montrer le loader (utile pour les transitions de page)
function showLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.remove('hidden');
    }
}

document.addEventListener("DOMContentLoaded", () => {

    loadLoader();

    // 1. Chargement des composants (navbar, footer)
    loadComponent("navbar-placeholder", "src/components/navbar.html");
    loadComponent("footer-placeholder", "src/components/footer.html");

    // 2. Initialisation d'AOS (animations)
    setTimeout(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768,
            startEvent: 'DOMContentLoaded', // S'assurer qu'AOS démarre après
            initClassName: 'aos-init',
            animatedClassName: 'aos-animate',
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99,
            delay: 0
        });
    }, 100);

    // 3. Gestion de la navigation active
    setActiveNavLink();

    // 4. Smooth scroll pour les ancres (CORRIGÉ)
    initSmoothScroll();

    // 5. Initialisation des liens WhatsApp
    initWhatsAppLinks();

    // 6. Animation de la flèche du Hero
    initArrowAnimation();

    // 7. Lazy loading des images (si besoin)
    initLazyLoading();

    // 8. Gestion du scroll (navbar + bouton retour en haut)
    initScrollHandlers();

    // Gestion des transitions de page
    // Gestion des transitions de page
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');

        if (link &&
            link.href &&
            !link.target &&
            !link.hasAttribute('download') &&
            !link.hasAttribute('data-bs-toggle') &&
            link.href.startsWith(window.location.origin) &&
            !link.href.includes('#') &&
            !link.href.includes('mailto:') &&
            !link.href.includes('tel:')) {

            e.preventDefault();

            // 1. Faire disparaître la page actuelle
            document.body.classList.add('page-exiting');

            // 2. Montrer le loader
            showLoader();

            // 3. Changer de page après l'animation
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        }
    });
});

/**
 * Charge les composants HTML externes (navbar, footer)
 */
function loadComponent(elementId, filePath) {
    const placeholder = document.getElementById(elementId);

    if (placeholder) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Erreur de chargement : ${filePath}`);
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;

                // Re-run AOS après injection de contenu
                AOS.refresh();

                // Mettre à jour le lien actif après chargement de la navbar
                if (elementId === "navbar-placeholder") {
                    setActiveNavLink();
                    // Réinitialiser le smooth scroll après chargement de la navbar
                    initSmoothScroll();
                    initWhatsAppLinks();
                }
            })
            .catch(error => console.error('Erreur chargement composant:', error));
    }
}

/**
 * Navigation active corrigée
 */
function setActiveNavLink() {
    setTimeout(() => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');

            const href = link.getAttribute('href');

            // Gestion page d'accueil
            if ((currentPage === 'index.html' || currentPage === '' || currentPage.includes('index')) &&
                (href === './' || href === 'index.html' || href === '/' || href === '')) {
                link.classList.add('active');
            }
            // Gestion autres pages
            else if (href === currentPage ||
                href === `./${currentPage}` ||
                (currentPage.includes('programmes') && href === 'programmes.html') ||
                (currentPage.includes('contact') && href === 'contact.html') ||
                (currentPage.includes('reservation') && href === 'reservation.html')) {
                link.classList.add('active');
            }
        });
    }, 100);
}

/**
 * Smooth scroll corrigé - NE BLOQUE PAS les liens vers d'autres pages
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#' || this.hasAttribute('data-bs-toggle')) return;

            // Si le lien contient .html#, c'est une ancre vers une autre page
            // On laisse le navigateur gérer normalement
            if (href.includes('.html#')) {
                return;
            }

            // Si c'est une ancre sur la même page
            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;

                window.scrollTo({
                    top: target.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });

                // Mettre à jour l'URL sans recharger la page
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Initialisation des liens WhatsApp - S'ASSURER qu'ils ouvrent WhatsApp
 */
function initWhatsAppLinks() {
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes('whatsapp') || href.includes('wa.me'))) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

/**
 * Animation de la flèche du Hero
 */
function initArrowAnimation() {
    const arrow = document.querySelector('.hero-section .animate-bounce');
    if (arrow) {
        // Supprimer l'animation par défaut si elle existe
        arrow.style.animation = 'none';

        // Forcer un reflow pour réinitialiser l'animation
        void arrow.offsetWidth;

        // Appliquer la nouvelle animation
        arrow.style.animation = 'bounce 2s infinite ease-in-out';

        // Ajouter un effet au survol
        arrow.addEventListener('mouseenter', () => {
            arrow.style.transform = 'scale(1.2)';
            arrow.style.transition = 'transform 0.3s ease';
        });

        arrow.addEventListener('mouseleave', () => {
            arrow.style.transform = 'scale(1)';
        });
    }
}

/**
 * Lazy loading des images (performance)
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * Gestion des événements de scroll
 */
function initScrollHandlers() {
    // Gestion de la navbar qui change de style au scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navbar = document.querySelector('.navbar');

        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Bouton retour en haut
        if (scrollTop > 300) {
            if (!document.querySelector('.scroll-to-top')) {
                createScrollToTopButton();
            }
        } else {
            const btn = document.querySelector('.scroll-to-top');
            if (btn) btn.remove();
        }
    });
}

/**
 * Animation du compteur (pour les stats)
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);

        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

/**
 * Toast notification (système de notification)
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
        ${message}
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Validation de formulaire (helper)
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(\+33|0)[1-9](\d{2}){4}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function createScrollToTopButton() {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Retour en haut');
    btn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(btn);
}

/**
 * Protection contre le spam (honeypot pour formulaires)
 */
function addHoneypot(form) {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    form.appendChild(honeypot);
}

/**
 * Utilitaire : formater un numéro de téléphone
 */
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
        return match.slice(1).join(' ');
    }
    return phone;
}

/**
 * Détection du type d'appareil
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Copier du texte dans le presse-papier
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copié !', 'success');
    });
}

// Export des fonctions utiles (si besoin)
window.YCoaching = {
    showToast,
    validateEmail,
    validatePhone,
    formatPhoneNumber,
    copyToClipboard,
    isMobile
};