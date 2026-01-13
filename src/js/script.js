/**
 * Y COACHING - Script Principal
 * Version 2.0 - Site Multi-pages
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Chargement des composants (navbar, footer)
    loadComponent("navbar-placeholder", "src/components/navbar.html");
    loadComponent("footer-placeholder", "src/components/footer.html");

    // 2. Initialisation d'AOS (animations)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // 3. Gestion de la navigation active
    setActiveNavLink();

    // 4. Smooth scroll pour les ancres
    initSmoothScroll();

    // 5. Effet parallax sur le hero (optionnel)
    initParallaxEffect();

    // 6. Lazy loading des images (si besoin)
    initLazyLoading();
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
                }
            })
            .catch(error => console.error(error));
    }
}

/**
 * Marque le lien de navigation actif selon la page actuelle
 */
function setActiveNavLink() {
    setTimeout(() => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === currentPage || 
                (currentPage === '' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    }, 100);
}

/**
 * Smooth scroll pour les liens d'ancre (#section)
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorer les liens de type data-bs-toggle
            if (href === '#' || this.hasAttribute('data-bs-toggle')) return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Effet parallax léger sur le hero
 */
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = heroSection.querySelector('div');
            
            if (parallax && scrolled < 800) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
}

/**
 * Lazy loading des images (performance)
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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

/**
 * Gestion du scroll to top button
 */
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
        if (!document.querySelector('.scroll-to-top')) {
            createScrollToTopButton();
        }
    } else {
        const btn = document.querySelector('.scroll-to-top');
        if (btn) btn.remove();
    }
});

function createScrollToTopButton() {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
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