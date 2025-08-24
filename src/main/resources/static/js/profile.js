function returnWindow() {
    history.back();
}

// Necessário alterar para que dados venham do banco
// Verificar se está favoritado
function checkIfFavorited(providerId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(providerId);
}

// Necessário alterar para que dados venham do banco
// Adicionar aos favoritos
function addFavorite(providerId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(providerId)) {
        favorites.push(providerId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// Necessário alterar para que dados venham do banco
// Remover dos favoritos
function removeFavorite(providerId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.filter(id => id !== providerId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
}

function createSvgIcon(config, paths) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgIcon = document.createElementNS(svgNS, "svg" );

    // Aplica todas as configurações (width, height, viewBox, etc.)
    for (const attr in config) {
        svgIcon.setAttribute(attr, config[attr]);
    }

    // Cria e anexa cada path
    paths.forEach(pathData => {
        const path = document.createElementNS(svgNS, "path");
        for (const attr in pathData) {
            path.setAttribute(attr, pathData[attr]);
        }
        svgIcon.appendChild(path);
    });

    return svgIcon;
}

function createStarIcon() {
    const starSvg = createSvgIcon(
        { xmlns: "http://www.w3.org/2000/svg", width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor" },
        [{ d: "M11.0867 1.0999C11.3802 0.476372 11.5269 0.164607 11.726 0.0649986C11.8993 -0.0216662 12.1007 -0.0216662 12.274 0.0649986C12.4731 0.164607 12.6198 0.476372 12.9133 1.0999L15.6971 7.01547C15.7838 7.19955 15.8271 7.29159 15.8904 7.36305C15.9464 7.42633 16.0136 7.47759 16.0883 7.51401C16.1726 7.55514 16.2695 7.56999 16.4631 7.59968L22.6902 8.55436C23.3459 8.6549 23.6738 8.70516 23.8255 8.87315C23.9576 9.01932 24.0196 9.22016 23.9945 9.41977C23.9656 9.64918 23.7283 9.89169 23.2535 10.3767L18.7493 14.9784C18.6089 15.1218 18.5386 15.1935 18.4933 15.2789C18.4532 15.3544 18.4275 15.4375 18.4176 15.5233C18.4064 15.6203 18.4229 15.7216 18.4561 15.9242L19.5189 22.4239C19.631 23.1094 19.687 23.4522 19.5817 23.6556C19.49 23.8326 19.3271 23.9567 19.1383 23.9934C18.9214 24.0356 18.6279 23.8737 18.041 23.55L12.4741 20.4792C12.3006 20.3836 12.2139 20.3357 12.1225 20.3169C12.0416 20.3003 11.9584 20.3003 11.8775 20.3169C11.7861 20.3357 11.6994 20.3836 11.5259 20.4792L5.95901 23.55C5.3721 23.8737 5.07865 24.0356 4.86166 23.9934C4.67287 23.9567 4.50997 23.8326 4.41832 23.6556C4.31299 23.4522 4.36904 23.1094 4.48113 22.4239L5.54393 15.9242C5.57707 15.7216 5.59364 15.6203 5.58243 15.5233C5.5725 15.4375 5.54677 15.3544 5.50666 15.2789C5.46136 15.1935 5.39115 15.1218 5.25074 14.9784L0.746471 10.3767C0.271736 9.89169 0.0343686 9.64918 0.00548393 9.41977C-0.0196473 9.22016 0.0424386 9.01932 0.174456 8.87315C0.32619 8.70516 0.654059 8.6549 1.3098 8.55436L7.53688 7.59968C7.73054 7.56999 7.82736 7.55514 7.91169 7.51401C7.98635 7.47759 8.05357 7.42633 8.10962 7.36305C8.17292 7.29159 8.21623 7.19955 8.30286 7.01547L11.0867 1.0999Z" }] // Path da estrela (resumido )
    );
    // starSvg.classList.add("star-icon");
    starSvg.style.color = "#FFB65C"; // Cor aplicada diretamente como no seu HTML
    return starSvg;
}

function createHeartIconOutline() {
    const heartSvg = createSvgIcon(
        { xmlns: "http://www.w3.org/2000/svg", width: "25", height: "25", viewBox: "0 0 25 25", fill: "currentColor" },
        [{ 
            d: "M16.6875 2.625C14.8041 2.625 13.1325 3.36844 12 4.64625C10.8675 3.36844 9.19594 2.625 7.3125 2.625C5.67208 2.62698 4.09942 3.27952 2.93947 4.43947C1.77952 5.59942 1.12698 7.17208 1.125 8.8125C1.125 15.5944 11.0447 21.0131 11.4666 21.2409C11.6305 21.3292 11.8138 21.3754 12 21.3754C12.1862 21.3754 12.3695 21.3292 12.5334 21.2409C12.9553 21.0131 22.875 15.5944 22.875 8.8125C22.873 7.17208 22.2205 5.59942 21.0605 4.43947C19.9006 3.27952 18.3279 2.62698 16.6875 2.625ZM16.1728 15.9713C14.8671 17.0792 13.4714 18.0764 12 18.9525C10.5286 18.0764 9.13287 17.0792 7.82719 15.9713C5.79562 14.2284 3.375 11.5706 3.375 8.8125C3.375 7.76821 3.78984 6.76669 4.52827 6.02827C5.26669 5.28984 6.26821 4.875 7.3125 4.875C8.98125 4.875 10.3781 5.75625 10.9584 7.17562C11.0429 7.38254 11.1871 7.55961 11.3726 7.68425C11.5581 7.80889 11.7765 7.87545 12 7.87545C12.2235 7.87545 12.4419 7.80889 12.6274 7.68425C12.8129 7.55961 12.9571 7.38254 13.0416 7.17562C13.6219 5.75625 15.0188 4.875 16.6875 4.875C17.7318 4.875 18.7333 5.28984 19.4717 6.02827C20.2102 6.76669 20.625 7.76821 20.625 8.8125C20.625 11.5706 18.2044 14.2284 16.1728 15.9713Z",
            fill: "#0C0C0C"
        }]
    );
    heartSvg.classList.add("heart-icon", "heart-outline");
    return heartSvg;
}

function createHeartIconFilled() {
    const heartSvg = createSvgIcon(
        { xmlns: "http://www.w3.org/2000/svg", width: "25", height: "25", viewBox: "0 0 25 25", fill: "currentColor" },
        [{ 
            d: "M16.6875 2.625C14.8041 2.625 13.1325 3.36844 12 4.64625C10.8675 3.36844 9.19594 2.625 7.3125 2.625C5.67208 2.62698 4.09942 3.27952 2.93947 4.43947C1.77952 5.59942 1.12698 7.17208 1.125 8.8125C1.125 15.5944 11.0447 21.0131 11.4666 21.2409C11.6305 21.3292 11.8138 21.3754 12 21.3754C12.1862 21.3754 12.3695 21.3292 12.5334 21.2409C12.9553 21.0131 22.875 15.5944 22.875 8.8125C22.873 7.17208 22.2205 5.59942 21.0605 4.43947C19.9006 3.27952 18.3279 2.62698 16.6875 2.625Z",
            fill: "#E53935"
        }]
    );
    heartSvg.classList.add("heart-icon", "heart-filled");
    return heartSvg;
}

function fillProviderData(serviceProviderData, isUserLoggedIn) {

    const profilePhoto = document.getElementById('profile-photo');
    profilePhoto.src = serviceProviderData.urlProfilePhoto;

    const providerName = document.getElementById('provider-name');
    providerName.innerText = serviceProviderData.name;

    const verifiedIcon = document.getElementById('verified-icon');

    if (!serviceProviderData.verified) {
        verifiedIcon.style.display = "none";
    }

    const providerProfession = document.getElementById('provider-profession');
    providerProfession.innerText = serviceProviderData.specialty;

    const providerRating = document.getElementById('provider-rating');

    for (let i = 0; i < serviceProviderData.rating; i++) {
        providerRating.appendChild(createStarIcon());
    }

    const providerDescription = document.getElementById('provider-description');
    providerDescription.innerText = serviceProviderData.biography;

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("favorite-button");
    favoriteButton.setAttribute("data-provider-id", serviceProviderData.id);

    const isFavorited = checkIfFavorited(serviceProviderData.id);
    if (isFavorited) {
        favoriteButton.appendChild(createHeartIconFilled()); // Coração preenchido
        favoriteButton.classList.add("favorited");
    } else {
        favoriteButton.appendChild(createHeartIconOutline()); // Coração vazio
    }

        favoriteButton.addEventListener('click', (event) => {

        event.stopPropagation(); 
        event.preventDefault();

        const isCurrentlyFavorited = favoriteButton.classList.contains("favorited");
    
        favoriteButton.innerHTML = '';
    
        if (isCurrentlyFavorited) {
            // Desfavoritar: coração vazio
            favoriteButton.appendChild(createHeartIconOutline());
            favoriteButton.classList.remove("favorited");
            removeFavorite(serviceProviderData.id);
        } else {
            // Favoritar: coração preenchido
            favoriteButton.appendChild(createHeartIconFilled());
            favoriteButton.classList.add("favorited");
            addFavorite(serviceProviderData.id);
        }
    
    
        // Feedback visual temporário
        favoriteButton.classList.add("clicked");
        setTimeout(() => {
            favoriteButton.classList.remove("clicked");
        }, 200);
    });

    const headerIcons = document.getElementById('header-icons');
    headerIcons.prepend(favoriteButton);

    // Econder botão de favorito.
    if (!isUserLoggedIn) {
        favoriteButton.style.display = "none";
    }

}

async function getServiceProvider(providerId) {
    const response = await fetch('/users/' + providerId);

    if (!response.ok) {
        throw new Error(`Falha na comunicação com o servidor. Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}

async function verifyUserStatus() {
    try {
        // Faz a requisição para o endpoint que retorna o status da autenticação
        const response = await fetch('/auth/status');

        // Se a resposta não for "ok" (ex: erro 500, falha de rede), trata como um erro.
        if (!response.ok) {
            throw new Error(`Falha na comunicação com o servidor. Status: ${response.status}`);
        }

        // Extrai o corpo da resposta como JSON
        const data = await response.json();

        // A validação principal: verifica a propriedade "isAuthenticated" no JSON
        if (data.isAuthenticated) {
            // Se autenticado, retorna os dados do usuário
            return data;
        } else {
            // Se não autenticado, retorna null
            return null;
        }

    } catch (error) {
        // Captura erros de rede ou o erro que lançamos acima
        console.error("Falha crítica na verificação de autenticação:", error);
        // Em caso de qualquer erro, consideramos o usuário como não autenticado
        return null;
    }
}

async function main() {

    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", returnWindow);

    const userData = await verifyUserStatus();

    const providerId = localStorage.getItem("providerId")

    if(!providerId) {
        console.error("ProviderId não informado.")
    }

    const serviceProviderData = await getServiceProvider(providerId);

    fillProviderData(serviceProviderData, !!userData)

    if (userData) {
        showLoggedUserButtons();
    } 

}

window.addEventListener("load", main);