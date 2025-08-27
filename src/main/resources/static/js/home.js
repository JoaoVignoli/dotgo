
let favorites = [];

async function logout() {
    const response = await fetch("/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })

    if (response.status === 200) {
        window.location.reload();
    }
}

// Necessário alterar para que dados venham do banco
// Verificar se está favoritado
function checkIfFavorited(providerId) {
    
    if(favorites.includes(providerId)) {
        console.log(providerId + " está favoritado.")
    }

    return favorites.includes(providerId);
}

// Necessário alterar para que dados venham do banco
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

        if (!favorites.includes(providerId)) {
            favorites.push(providerId);
        }
        console.log(favorites)
        console.log(`Prestador ${providerId} adicionado aos favoritos.`);

    } catch (error) {
        console.error("Falha ao adicionar favorito:", error);
    }
}

// Necessário alterar para que dados venham do banco
// Remover dos favoritos
async function removeFavorite(providerId) {
    try {
        const response = await fetch(`/favorites/${providerId}`, { 
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ${response.status}`);
        }

        // Sucesso! Remove o ID da lista local para atualizar a UI.
        favorites = favorites.filter(id => id !== providerId);
        console.log(`Prestador ${providerId} removido dos favoritos.`);

    } catch (error) {
        console.error("Falha ao remover favorito:", error);
    }
}

async function getUserFavorites() {
        try {
        // Faz a requisição para o endpoint que retorna o status da autenticação
        const response = await fetch('/auth/me');

        // Se a resposta não for "ok" (ex: erro 500, falha de rede), trata como um erro.
        if (!response.ok) {
            throw new Error(`Falha na comunicação com o servidor. Status: ${response.status}`);
        }

        // Extrai o corpo da resposta como JSON
        const userData = await response.json();


        // A validação principal: verifica a propriedade "isAuthenticated" no JSON
        if (userData) {
            const favoriteIds = userData.favorites.map(fav => fav.serviceProviderId);
            // Se autenticado, retorna os dados do usuário
            return favoriteIds;
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

// Função para renderizar uma lista de categorias (ou subcategorias)
function renderCategories(categories) {

    const categorieList = document.getElementById("category-list");
    const categoriesSection = document.getElementById("categories-section");

    // Adicione uma verificação de segurança (guarda)
    if (!categorieList) {
        console.error("Elemento #category-list não encontrado no DOM. A renderização de categorias foi abortada.");
        return; // Interrompe a função para evitar mais erros.
    }
    // 1. Limpa a lista atual antes de adicionar novos itens
    categorieList.innerHTML = '';

    const existingBackButton = categoriesSection.querySelector(".back-categories-button");
    if (existingBackButton) {
        existingBackButton.remove();
    }


    // 2. Adiciona um botão "Voltar" se não estivermos no nível principal
    if (window.currentCategoryLevel > 0) { // Usaremos uma variável global simples para rastrear o nível

        const existingCategoriesTitle = categoriesSection.querySelector(".categories-title");
        if (existingCategoriesTitle) {
            existingCategoriesTitle.remove();
        }

        const backButton = document.createElement("div");
        backButton.classList.add("back-categories-button")

        const currentCategory = window.categoryHistory[window.categoryHistory.length - 1];
        backButton.innerText = `< ${currentCategory.name}`;
        backButton.addEventListener('click', navigateToParentCategory);
        categoriesSection.prepend(backButton);

    } else {

        const categoriesTitle = document.createElement("div");
        categoriesTitle.classList.add("categories-title")
        categoriesTitle.innerText = "Categorias"
        categoriesSection.prepend(categoriesTitle);

    }

    // 3. Cria e adiciona cada item da lista
    categories.forEach(category => {
        const categoryItem = createCategoryItem(category);
        categorieList.appendChild(categoryItem);
    });
}

// Função para navegar para as subcategorias
async function navigateToSubcategories(category) {
    window.currentCategoryLevel++; // Aumenta o nível de profundidade

    // Valida se é uma categoria ou subcategoria
    window.categoryHistory.push(category); // Guarda o histórico para o botão "Voltar"

    const subcategories = await getCategories(`/categories/${category.id}/subcategories`);
    if (subcategories.length > 0) {
        renderCategories(subcategories);
    } else {
        // Se não houver subcategorias, talvez você queira buscar os prestadores dessa categoria final
        console.log(`Nenhuma subcategoria encontrada. Buscando prestadores para a categoria ID: ${category.id}`);
        // Aqui você chamaria uma função para buscar e exibir os prestadores filtrados.
    }
}

// Função para o botão "Voltar"
async function navigateToParentCategory() {
    window.currentCategoryLevel--;
    window.categoryHistory.pop(); // Remove o nível atual do histórico

    let parentUrl = "/categories"; // URL padrão para o nível raiz
    if (window.categoryHistory.length > 0) {
        const parent = window.categoryHistory[window.categoryHistory.length - 1];
        parentUrl = `/categories/${parent.id}/subcategories`;
    }

    const categories = await getCategories(parentUrl);
    renderCategories(categories);
}

// Redireciona para o perfil do prestador
function showProviderProfile(providerId) {
    localStorage.setItem("providerId", providerId)
    window.location.pathname = "/provider-profile"
}

// Função para reduzir o nome do prestador caso seja muito grande.
function reduceName(name, maxLength, suffix = '...') {
    if (name.length <= maxLength) {
        return name;
    }

    return name.substring(0, maxLength) + suffix;
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

function createVerifyIcon() {
    return createSvgIcon(
        { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 18 18", fill: "none" },
        [
            { opacity: "0.2", d: "M15.75 9C15.75 10.335 15.3541 11.6401 14.6124 12.7501C13.8707 13.8601 12.8165 14.7253 11.5831 15.2362C10.3497 15.7471 8.99252 15.8808 7.68314 15.6203C6.37377 15.3598 5.17104 14.717 4.22703 13.773C3.28303 12.829 2.64015 11.6262 2.3797 10.3169C2.11925 9.00749 2.25292 7.65029 2.76382 6.41689C3.27471 5.18349 4.13987 4.12928 5.2499 3.38758C6.35994 2.64588 7.66498 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9Z", fill: "#0C9409" }, // Path 1 (resumido para legibilidade )
            { d: "M8.99902 2.1875C10.8054 2.18941 12.5372 2.90827 13.8145 4.18555C15.012 5.38306 15.7186 6.97966 15.8037 8.66309L15.8125 9.00098C15.8123 10.348 15.4124 11.6651 14.6641 12.7852C13.9156 13.9052 12.852 14.7784 11.6074 15.2939C10.3626 15.8096 8.99239 15.9445 7.6709 15.6816C6.34942 15.4188 5.13535 14.7701 4.18262 13.8174C3.22988 12.8646 2.58123 11.6506 2.31836 10.3291C2.0555 9.00761 2.19043 7.6374 2.70605 6.39258C3.22164 5.14804 4.09482 4.08443 5.21484 3.33594C6.33488 2.58755 7.65198 2.18769 8.99902 2.1875ZM11.5596 2.82129C10.3376 2.31513 8.99256 2.18337 7.69531 2.44141C6.3981 2.69946 5.20672 3.33625 4.27148 4.27148C3.33625 5.20672 2.69946 6.3981 2.44141 7.69531C2.18337 8.99256 2.31513 10.3376 2.82129 11.5596C3.32742 12.7814 4.18462 13.8258 5.28418 14.5605C6.38393 15.2954 7.67734 15.6875 9 15.6875H9.00098C10.7737 15.6854 12.4731 14.9801 13.7266 13.7266C14.9801 12.4731 15.6854 10.7737 15.6875 9.00098V9C15.6875 7.67734 15.2954 6.38393 14.5605 5.28418C13.8258 4.18462 12.7814 3.32742 11.5596 2.82129ZM11.8125 7.25C11.8207 7.25 11.8293 7.25076 11.8369 7.25391C11.8443 7.257 11.8508 7.26197 11.8564 7.26758L11.8574 7.26855C11.863 7.27423 11.868 7.28073 11.8711 7.28809C11.8742 7.29567 11.875 7.30428 11.875 7.3125C11.875 7.32072 11.8742 7.32933 11.8711 7.33691C11.868 7.34427 11.863 7.35077 11.8574 7.35645H11.8564L7.91895 11.2939V11.2949C7.91327 11.3005 7.90677 11.3055 7.89941 11.3086C7.89183 11.3117 7.88321 11.3125 7.875 11.3125C7.86679 11.3125 7.85817 11.3117 7.85059 11.3086C7.84323 11.3055 7.83673 11.3005 7.83105 11.2949V11.2939L6.14355 9.60645C6.13178 9.59467 6.125 9.57916 6.125 9.5625C6.125 9.54584 6.13178 9.53033 6.14355 9.51855C6.15533 9.50678 6.17084 9.5 6.1875 9.5C6.20393 9.5 6.21971 9.5061 6.23145 9.51758L7.52148 10.8086L7.875 11.1621L8.22852 10.8086L11.7686 7.26758C11.7742 7.26197 11.7807 7.257 11.7881 7.25391C11.7957 7.25076 11.8043 7.25 11.8125 7.25Z", fill: "#1A1A1A", stroke: "#329930" } // Path 2 (resumido)
        ]
    );
}

function createStarIcon() {
    const starSvg = createSvgIcon(
        { xmlns: "http://www.w3.org/2000/svg", width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor" },
        [{ d: "M11.0867 1.0999C11.3802 0.476372 11.5269 0.164607 11.726 0.0649986C11.8993 -0.0216662 12.1007 -0.0216662 12.274 0.0649986C12.4731 0.164607 12.6198 0.476372 12.9133 1.0999L15.6971 7.01547C15.7838 7.19955 15.8271 7.29159 15.8904 7.36305C15.9464 7.42633 16.0136 7.47759 16.0883 7.51401C16.1726 7.55514 16.2695 7.56999 16.4631 7.59968L22.6902 8.55436C23.3459 8.6549 23.6738 8.70516 23.8255 8.87315C23.9576 9.01932 24.0196 9.22016 23.9945 9.41977C23.9656 9.64918 23.7283 9.89169 23.2535 10.3767L18.7493 14.9784C18.6089 15.1218 18.5386 15.1935 18.4933 15.2789C18.4532 15.3544 18.4275 15.4375 18.4176 15.5233C18.4064 15.6203 18.4229 15.7216 18.4561 15.9242L19.5189 22.4239C19.631 23.1094 19.687 23.4522 19.5817 23.6556C19.49 23.8326 19.3271 23.9567 19.1383 23.9934C18.9214 24.0356 18.6279 23.8737 18.041 23.55L12.4741 20.4792C12.3006 20.3836 12.2139 20.3357 12.1225 20.3169C12.0416 20.3003 11.9584 20.3003 11.8775 20.3169C11.7861 20.3357 11.6994 20.3836 11.5259 20.4792L5.95901 23.55C5.3721 23.8737 5.07865 24.0356 4.86166 23.9934C4.67287 23.9567 4.50997 23.8326 4.41832 23.6556C4.31299 23.4522 4.36904 23.1094 4.48113 22.4239L5.54393 15.9242C5.57707 15.7216 5.59364 15.6203 5.58243 15.5233C5.5725 15.4375 5.54677 15.3544 5.50666 15.2789C5.46136 15.1935 5.39115 15.1218 5.25074 14.9784L0.746471 10.3767C0.271736 9.89169 0.0343686 9.64918 0.00548393 9.41977C-0.0196473 9.22016 0.0424386 9.01932 0.174456 8.87315C0.32619 8.70516 0.654059 8.6549 1.3098 8.55436L7.53688 7.59968C7.73054 7.56999 7.82736 7.55514 7.91169 7.51401C7.98635 7.47759 8.05357 7.42633 8.10962 7.36305C8.17292 7.29159 8.21623 7.19955 8.30286 7.01547L11.0867 1.0999Z" }] // Path da estrela (resumido )
    );
    starSvg.classList.add("star-icon");
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

function displayServiceHolders(serviceHolder, isUserLoggedIn) {
    const serviceProvidersList = document.getElementById("service-providers");

    // --- Criação dos Elementos ---
    const providerCard = document.createElement("div");
    providerCard.classList.add("provider-card");

    const providerPhoto = document.createElement("img");
    providerPhoto.classList.add("provider-photo");
    providerPhoto.src = serviceHolder.urlProfilePhoto;
    providerPhoto.alt = "Foto de perfil: " + serviceHolder.name;

    const providerInfo = document.createElement("div");
    providerInfo.classList.add("provider-info");

    const providerHeader = document.createElement("div");
    providerHeader.classList.add("provider-header");

    const providerHeaderDiv = document.createElement("div");
    const providerName = document.createElement("strong");
    const name = reduceName(serviceHolder.name, 20);
    providerName.innerText = name;

    const providerEspecialty = document.createElement("p");
    providerEspecialty.innerText = serviceHolder.specialty;

    const providerRating = document.createElement("div");
    providerRating.classList.add("provider-rating");
    for (let i = 0; i < serviceHolder.rating; i++) {
        providerRating.appendChild(createStarIcon());
    }

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("favorite-button");
    favoriteButton.setAttribute("data-provider-id", serviceHolder.id);

    const isFavorited = checkIfFavorited(serviceHolder.id);
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
        favoriteButton.innerHTML = '';

        if (isCurrentlyFavorited) {
            // Desfavoritar: coração vazio
            favoriteButton.appendChild(createHeartIconOutline());
            favoriteButton.classList.remove("favorited");
            await removeFavorite(serviceHolder.id);
        } else {
            // Favoritar: coração preenchido
            if (isUserLoggedIn && isUserLoggedIn.userId) {
                await addFavorite(serviceHolder.id, isUserLoggedIn.userId);
            } else {
                console.error("Não foi possível favoritar: ID do usuário não encontrado.");
                favoriteButton.appendChild(createHeartIconOutline());
                favoriteButton.classList.remove("favorited");
            }
        }

        // Feedback visual temporário
        favoriteButton.classList.add("clicked");
        setTimeout(() => {
            favoriteButton.classList.remove("clicked");
        }, 200);
    });

    if (!isUserLoggedIn) {
        favoriteButton.style.display = "none";
    }

    // --- Montagem da Estrutura--

    // 1. Monta o providerHeaderDiv (nome e ícone de verificado)
    providerHeaderDiv.appendChild(providerName);
    if (serviceHolder.verified) {
        providerHeaderDiv.appendChild(createVerifyIcon());
    }
    providerHeaderDiv.appendChild(providerEspecialty);

    // 2. Monta o providerHeader
    providerHeader.appendChild(providerHeaderDiv);

    // 3. Monta o providerInfo
    providerInfo.appendChild(providerHeader);
    providerInfo.appendChild(providerRating);

    // 4. Monta o card principal
    providerCard.appendChild(providerPhoto);
    providerCard.appendChild(providerInfo);
    providerCard.appendChild(favoriteButton);


    // 5. Adiciona o card completo à lista
    serviceProvidersList.appendChild(providerCard);

    providerCard.addEventListener('click', (event) => {
        if (event.target.closest('button') || event.target.closest('.favorite-button')) {
            return;
        }
        showProviderProfile(serviceHolder.id);
    });
}

function createCategoryItem(category) {

    const categoryItem = document.createElement("div");
    categoryItem.classList.add("category-item");

    const categoryIcon = document.createElement("img");
    categoryIcon.classList.add("category-icon");
    categoryIcon.src = category.iconUrl;
    categoryIcon.alt = category.name;

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("category-label");
    categoryLabel.innerText = category.name;

    categoryItem.appendChild(categoryIcon);
    categoryItem.appendChild(categoryLabel);

    categoryItem.addEventListener('click', (event) => {

        if (event.target.closest('button')) {
            console.log('Click intercepted on button within category item');
            return;
        }

        const categoryList = categoryItem.closest('.category-list');
        if (categoryList) {
            const allCategoryIcons = categoryList.querySelectorAll('.category-icon');

            allCategoryIcons.forEach(icon => {
                icon.classList.remove('category-icon--selected');
            });
        } else {
            const allCategoryIcons = document.querySelectorAll('.category-icon');
            allCategoryIcons.forEach(icon => {
                icon.classList.remove('category-icon--selected');
            });
        }

        if (!categoryIcon.classList.contains('category-icon--selected')) {
            categoryIcon.classList.add('category-icon--selected');
            console.log('Added selected class to category:', category.name);
        } else {
            console.log('Category already selected:', category.name);
        }

        if (category.isLeaf) {
            // Futuramente: filterProvidersByCategory(category.id);
        } else {
            navigateToSubcategories(category);
        }
    });


    return categoryItem

}

async function getServiceProviders() {

    const url = '/users/summary'

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar prestadores: ${response.status}`);
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("Falha ao buscar prestadores de serviço:", error);
        return []; // Retorna um array vazio em caso de erro para não quebrar o código
    }
}

async function getCategories(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar prestadores: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Falha ao buscar prestadores de serviço:", error);
        return []; // Retorna um array vazio em caso de erro para não quebrar o código
    }
}

function showLoggedUserButtons() {

    const logoutButton = document.getElementById("logout-button");
    logoutButton.classList.remove("hidden");

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

    window.currentCategoryLevel = 0;
    window.categoryHistory = [];

    const user = await verifyUserStatus();

    if (user) {
        favorites = await getUserFavorites();
        showLoggedUserButtons();
    }

    const categoriesUrl = "/categories"

    const [categories, serviceHolders] = await Promise.all([
        getCategories(categoriesUrl),
        getServiceProviders()
    ]);

    if (categories.length > 0) {
        renderCategories(categories);
    }

    if (serviceHolders.length > 0) {

        const serviceProvidersList = document.getElementById("service-providers");
        serviceProvidersList.innerHTML = '';

        serviceHolders.forEach(serviceHolder => {
            // Passamos o status de login para a função que cria o card
            displayServiceHolders(serviceHolder, user);
        });
    }

    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", logout)
}

window.addEventListener("load", main);