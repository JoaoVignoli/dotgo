// Função principal para ocultar barra
function hideAddressBar() {
    setTimeout(() => window.scrollTo(0, 1), 100);
    setTimeout(() => window.scrollTo(0, 0), 500);
}

// Eventos para ocultar a barra
window.addEventListener('load', () => setTimeout(hideAddressBar, 1000));
window.addEventListener('focus', hideAddressBar);
window.addEventListener('orientationchange', () => setTimeout(hideAddressBar, 500));

// Específico para iOS
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    window.addEventListener('load', () => {
    setTimeout(() => window.scrollTo(0, 1), 0);        
    });
}