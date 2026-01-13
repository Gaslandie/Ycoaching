/**
 * Y Coaching - Script Principal
 */

// 1. Initialisation générale au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {

    // Charger la navbar et le footer
    loadComponent("navbar-placeholder", "src/components/navbar.html");
    loadComponent("footer-placeholder", "src/components/footer.html");

    // Initialiser AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cube',
        once: true,
    });

    // Dans ton document.addEventListener("DOMContentLoaded", () => { ... })
    const toggle = document.getElementById('billingToggle');
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const yearlyPrices = document.querySelectorAll('.price-yearly');
    const labelM = document.getElementById('label-monthly');
    const labelY = document.getElementById('label-yearly');

    if (toggle) {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                // Afficher Annuel
                monthlyPrices.forEach(p => p.classList.add('d-none'));
                yearlyPrices.forEach(p => p.classList.remove('d-none'));
                labelY.classList.add('active');
                labelM.classList.remove('active');
            } else {
                // Afficher Mensuel
                monthlyPrices.forEach(p => p.classList.remove('d-none'));
                yearlyPrices.forEach(p => p.classList.add('d-none'));
                labelM.classList.add('active');
                labelY.classList.remove('active');
            }
        });
    }
});

/**
 * Fonction pour charger les composants HTML (navbar, footer, etc.)
 */
function loadComponent(elementId, filePath) {
    const placeholder = document.getElementById(elementId);

    if (placeholder) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error("Erreur de chargement du composant : " + filePath);
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;

                // IMPORTANT : Si le composant contient des animations AOS, 
                // on demande à AOS de rafraîchir ses calculs de position.
                AOS.refresh();
            })
            .catch(error => console.error(error));
    }
}