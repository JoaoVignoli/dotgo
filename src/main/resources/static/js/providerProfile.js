let favorites = [];
let favoriteIdMap = {};

function returnWindow() {
    history.back();
}

function closeModal() {

}

function showProductModal(product, providerPhone) {
    const productModal = document.getElementById("productModal");

    const modalProductImg = document.getElementById("modalProductImg");
    modalProductImg.src = product.pictureUrl;
    modalProductImg.alt = product.name;

    const modalServiceTitle = document.getElementById("modalServiceTitle");
    modalServiceTitle.innerText = product.name;

    const modalProductDescription = document.getElementById("modalProductDescription");
    modalProductDescription.innerText = product.description;

    const modalProductPrice = document.getElementById("modalProductPrice");

    if (product.priceToBeAgreed) {
        modalProductPrice.innerText = "R$: A combinar";
    } else {
        modalProductPrice.innerText = "R$: " + product.price;
    }

    const modalServiceTime = document.getElementById("modalServiceTime");

    if (product.timeToBeAgreed) {
        modalServiceTime.innerText = "Estimativa de tempo: A combinar"
    } else {
        modalServiceTime.innerText = "Estimativa de tempo: " + product.estimatedTime + " min"
    }

    const modalActionButtonText = document.getElementById("modalActionButtonText");

    if (product.timeToBeAgreed || product.priceToBeAgreed) {
        modalActionButtonText.innerText = "Entrar em contato"
    } else {
        modalActionButtonText.innerText = "Agendar"
    }

    productModal.classList.remove("hidden");
    
    const modalActionButton = document.getElementById("modalActionButton");

    modalActionButton.addEventListener("click", (event) => {
        if (product.timeToBeAgreed || product.priceToBeAgreed) {
            const message = encodeURIComponent(`Olá, vi o serviço "${product.name}" e gostaria de mais informações.`);
            window.open(`https://wa.me/${providerPhone}?text=${message}`, '_blank' );
        } else {
            localStorage.setItem("selectedProduct", product.id);
            window.location.pathname = "/service-order/scheduler"
        }
    })
}

// Verificar se está favoritado
function checkIfFavorited(providerId) {

    return favorites.includes(providerId);
}

// Adicionar aos favoritos
async function addFavorite(providerId, userId) {

    const requestBody = {
        "serviceProviderId": providerId,
        "userId": userId
    }

    try {
        const response = await fetch('/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ${response.status}`);
        }

        const newFavorite = await response.json();

        if (!favorites.includes(providerId)) {
            favorites.push(providerId);
        }

        // Adiciona a nova entrada ao mapa.
        favoriteIdMap[newFavorite.serviceProviderId] = newFavorite.id;

    } catch (error) {
        console.error("Falha ao adicionar favorito:", error);
    }
}

// Remover dos favoritos
async function removeFavorite(providerId) {

    const favoriteId = favoriteIdMap[providerId];

    if (favoriteId === undefined) {
        console.error(`Não foi possível encontrar o ID do favorito para o prestador ${providerId}. A remoção foi abortada.`);
        return;
    }

    try {
        const response = await fetch('/favorites/' + favoriteId, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}`);
        }

        // Sucesso! Remove o ID da lista local para atualizar a UI.
        favorites = favorites.filter(id => id !== providerId);

        // Também remove a entrada do mapa.
        delete favoriteIdMap[providerId];

    } catch (error) {
        console.error("Falha ao remover favorito:", error);
    }
}

async function getUserFavorites() {
    try {
        const response = await fetch('/auth/me');

        if (!response.ok) {
            throw new Error(`Falha na comunicação com o servidor. Status: ${response.status}`);
        }

        const userData = await response.json();

        if (userData && Array.isArray(userData.favorites)) {

            favoriteIdMap = {};

            const favoriteProviderIds = userData.favorites.map(fav => {

                // Insere dados providerId e favoriteId em um mapa.
                favoriteIdMap[fav.serviceProviderId] = fav.id;

                return fav.serviceProviderId;
            });

            // Retorna favoritos.
            return favoriteProviderIds;

        } else {
            // Array vazio para caso não tenho nenhum favorito.
            return [];
        }

    } catch (error) {
        console.error("Falha crítica ao obter dados do usuário e favoritos:", error);
        // Em caso de qualquer falha, retorna um array vazio para garantir que a aplicação não quebre.
        return [];
    }
}

function createSvgIcon(config, paths) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgIcon = document.createElementNS(svgNS, "svg");

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

function showProfile() {
    const tabProfile = document.getElementById("tabProfile");
    tabProfile.classList.add("active");

    const tabProducts = document.getElementById("tabProducts");
    tabProducts.classList.remove("active");

    const productList = document.getElementById("productsList");
    productList.classList.add("hidden")

    const profileContainer = document.getElementById("profileContainer");
    profileContainer.classList.remove("hidden")
}

function showProducts() {
    const tabProfile = document.getElementById("tabProfile");
    tabProfile.classList.remove("active");

    const tabProducts = document.getElementById("tabProducts");
    tabProducts.classList.add("active");

    const productList = document.getElementById("productsList");
    productList.classList.remove("hidden")
    
    const profileContainer = document.getElementById("profileContainer");
    profileContainer.classList.add("hidden")
}

async function fillProviderProducts(product, providerPhone) {

    const productList = document.getElementById("productsList");

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const productImage = document.createElement("img");
    productImage.classList.add("product-image");
    productImage.src = product.pictureUrl;
    productImage.alt = product.name

    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    const productTitle = document.createElement("h3");
    productTitle.classList.add("product-title");
    productTitle.innerText = product.name;

    const productDescription = document.createElement("p");
    productDescription.classList.add("product-description");
    productDescription.innerText = product.description;

    const productPrice = document.createElement("div");
    productPrice.classList.add("product-price");

    const priceLabel = document.createElement("span");
    priceLabel.classList.add("price-label");
    priceLabel.innerText = "R$";

    const priceText = document.createElement("span");
    priceText.classList.add("price-text");

    if (product.priceToBeAgreed) {
        priceText.innerText = "A combinar";
    } else {
        priceText.innerText = product.price;
    }

    productPrice.appendChild(priceLabel);
    productPrice.appendChild(priceText);

    productInfo.appendChild(productTitle);
    productInfo.appendChild(productDescription);
    productInfo.appendChild(productPrice);

    productCard.appendChild(productImage);
    productCard.appendChild(productInfo);

    productList.appendChild(productCard);

    productCard.addEventListener("click", (event) => {
        showProductModal(product, providerPhone);
    })

}

async function fillProviderInfos(serviceProviderData, isUserLoggedIn) {

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

    favoriteButton.addEventListener('click', async (event) => {

        event.stopPropagation();
        event.preventDefault();

        const isCurrentlyFavorited = favoriteButton.classList.contains("favorited");

        // Desativa o botão para evitar cliques duplos enquanto a requisição está em andamento
        favoriteButton.disabled = true;

        try {
            if (isCurrentlyFavorited) {
                // 1. Tenta remover o favorito no backend
                await removeFavorite(serviceProviderData.id);

                // 2. Se a remoção for bem-sucedida, atualiza a UI
                favoriteButton.innerHTML = ''; // Limpa o ícone antigo
                favoriteButton.appendChild(createHeartIconOutline()); // Adiciona o ícone de contorno
                favoriteButton.classList.remove("favorited");

            } else {
                // Verifica se o usuário está logado antes de tentar favoritar
                if (isUserLoggedIn && isUserLoggedIn.userId) {
                    // 1. Tenta adicionar o favorito no backend
                    await addFavorite(serviceProviderData.id, isUserLoggedIn.userId);

                    // 2. Se a adição for bem-sucedida, atualiza a UI
                    favoriteButton.innerHTML = ''; // Limpa o ícone antigo
                    favoriteButton.appendChild(createHeartIconFilled()); // Adiciona o ícone preenchido (vermelho)
                    favoriteButton.classList.add("favorited");
                } else {
                    console.error("Não foi possível favoritar: ID do usuário não encontrado.");
                    // Se o usuário não estiver logado, não fazemos nada na UI, pois o estado não mudou.
                }
            }
        } catch (error) {
            console.error("Falha ao atualizar o status de favorito:", error);
            // Se ocorrer um erro na API, a UI não será alterada, refletindo o estado real.
        } finally {
            // Reativa o botão após a conclusão da operação (sucesso ou falha)
            favoriteButton.disabled = false;
        }

        // Feedback visual temporário
        favoriteButton.classList.add("clicked");
        setTimeout(() => {
            favoriteButton.classList.remove("clicked");
        }, 100);
    });

    const headerIcons = document.getElementById('header-icons');
    headerIcons.prepend(favoriteButton);

    // Esconder botão de favorito se não estiver logado.
    if (!isUserLoggedIn) {
        favoriteButton.style.display = "none";
    }

}

async function getProviderInfos(providerId) {
    const response = await fetch('/users/' + providerId);

    if (!response.ok) {
        throw new Error(`Falha na comunicação com o servidor. Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}

async function getProviderProducts(providerId) {
    const response = await fetch('/users/' + providerId + "/products");

    if (!response.ok) {
        throw new Error(`Falha na comunicação com o servidor. Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}

function showLoggedUserButtons() {

    const shareButton = document.getElementById("shareButton");
    shareButton.classList.remove("hidden");

    const favoritesButton = document.getElementById("favoritesButton");
    favoritesButton.classList.remove("hidden");

    const ordersButton = document.getElementById("ordersButton");
    ordersButton.classList.remove("hidden");

    const profileButton = document.getElementById("profileButton");
    profileButton.classList.remove("hidden");

    const loginButton = document.getElementById("loginButton");
    loginButton.classList.add("hidden");

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
        const user = await response.json();

        // A validação principal: verifica a propriedade "isAuthenticated" no JSON
        if (user.isAuthenticated) {
            // Se autenticado, retorna os dados do usuário
            return user;
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

    const providerId = localStorage.getItem("providerId")

    const returnButton = document.getElementById("returnButton");
    const tabProfile = document.getElementById("tabProfile");
    const tabProducts = document.getElementById("tabProducts");
    const tabReviews = document.getElementById("tabReviews");
    const tabDeatils = document.getElementById("tabDeatils");

    returnButton.addEventListener("click", returnWindow);

    const user = await verifyUserStatus();

    if (user) {
        favorites = await getUserFavorites();
        showLoggedUserButtons();
    }

    if (!providerId) {
        console.error("ProviderId não informado.")
    }

    const providerInfos = await getProviderInfos(providerId);

    const providerProducts = await getProviderProducts(providerId)

    fillProviderInfos(providerInfos, user);

    providerProducts.forEach(product => {
        fillProviderProducts(product, providerInfos.phone);
    });
    
    tabProfile.addEventListener("click", showProfile)
    tabProducts.addEventListener("click", showProducts)

}

window.addEventListener("load", main);