/**
 * Y Coaching - Script Principal
 */

// 1. Initialisation générale au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // Charger la navbar
    loadComponent("navbar-placeholder", "src/components/navbar.html");

    // Initialiser AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cube',
        once: true,
    });
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