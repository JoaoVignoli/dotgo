let favorites = [];
let favoriteIdMap = {};

let selectedProduct = null;

let serviceDurationHours = 4;
const breakTimeMinutes = 0;
const unavailableDates = ['2025-07-13', '2025-07-14'];
const bookedSlots = { '2025-07-17': ['10:00'] };

let viewDate = new Date();
let selectedDate = null;
let isMonthView = false;


function returnWindow() {
    history.back();
}

function closeModal() {
    const productModal = document.getElementById("productModal");
    productModal.classList.add("hidden");
}

function showProductModal(product, providerPhone) {
    const productModal = document.getElementById("productModal");
    const modalContainer = document.getElementById("modalContainer");
    const modalCloseButton = document.getElementById("modalClose");

    const handleCloseButtonClick = () => {
        closeModal();
        modalCloseButton.removeEventListener("click", handleCloseButtonClick);
    };
    modalCloseButton.addEventListener("click", handleCloseButtonClick);

    const handleOverlayClick = (event) => {
        if (!modalContainer.contains(event.target)) {
            closeModal();
            productModal.removeEventListener("click", handleOverlayClick);
        }
    };
    productModal.addEventListener("click", handleOverlayClick);

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
        modalServiceTime.innerText = "Estimativa de tempo: A combinar";
    } else {
        modalServiceTime.innerText = "Estimativa de tempo: " + (product.estimatedTime || 'N/A') + " min";
    }

    const modalActionButton = document.getElementById("modalActionButton");
    const newActionButton = modalActionButton.cloneNode(true);
    modalActionButton.parentNode.replaceChild(newActionButton, modalActionButton);

    newActionButton.addEventListener("click", () => {
        if (product.timeToBeAgreed || product.priceToBeAgreed) {
            const message = encodeURIComponent(`Olá, vi o serviço "${product.name}" e gostaria de mais informações.`);
            window.open(`https://wa.me/${providerPhone}?text=${message}`, '_blank');
        } else {
            selectedProduct = product;
            showSchedulingInterface(product);
        }
    });

    if (product.timeToBeAgreed || product.priceToBeAgreed) {
        newActionButton.querySelector('#modalActionButtonText').innerText = "Entrar em contato";
    } else {
        newActionButton.querySelector('#modalActionButtonText').innerText = "Agendar";
    }

    productModal.classList.remove("hidden");
}

function showSchedulingInterface(product) {
    closeModal();

    serviceDurationHours = product.estimatedTime / 60

    const productsList = document.getElementById("productsList");
    const profileContainer = document.getElementById("profileContainer");
    const contentContainer = document.querySelector(".content-container");

    productsList.classList.add("hidden");
    profileContainer.classList.add("hidden");
    contentContainer.classList.remove("hidden");

    fillSelectedServiceInfo();

    initializeScheduling();
}

function fillSelectedServiceInfo() {
    if (!selectedProduct) return;

    // Preencher card do serviço
    const serviceImg = document.querySelector(".service-image-placeholder")
    const serviceTitle = document.querySelector(".service-title");
    const serviceDescription = document.querySelector(".service-description");
    const servicePrice = document.querySelector(".service-price");


    if (serviceImg) serviceImg.src = selectedProduct.pictureUrl;
    if (serviceTitle) serviceTitle.innerText = selectedProduct.name;
    if (serviceDescription) serviceDescription.innerText = selectedProduct.description;

    if (servicePrice) {
        if (selectedProduct.priceToBeAgreed) {
            servicePrice.innerText = "R$: A combinar";
        } else {
            servicePrice.innerText = "R$: " + selectedProduct.price;
        }
    }
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

    const schedulingContainer = document.getElementById("schedulingContainer");
    schedulingContainer.classList.add("hidden")

    const profileContainer = document.getElementById("profileContainer");
    profileContainer.classList.remove("hidden")
}

function showProductList() {

    const tabProfile = document.getElementById("tabProfile");
    tabProfile.classList.remove("active");

    const tabProducts = document.getElementById("tabProducts");
    tabProducts.classList.add("active");

    const productList = document.getElementById("productsList");
    productList.classList.remove("hidden")

    const schedulingContainer = document.getElementById("schedulingContainer");
    schedulingContainer.classList.add("hidden")

    const profileContainer = document.getElementById("profileContainer");
    profileContainer.classList.add("hidden")
}

function fillProviderDetails(serviceProviderData, isUserLoggedIn) {

    const address = serviceProviderData.address;
    const firstAddress = address[0];

    const street = firstAddress.street;
    const neighborhood = firstAddress.neighborhood;
    const city = firstAddress.city;
    const state = firstAddress.state;
    const addressNumber = firstAddress.address_number
    const cep = firstAddress.cep;

    const finalAddress = street + ", " + addressNumber + " - " + neighborhood + ", " + city + " - " + state + ", " + cep;


    const providerAddress = document.getElementById('userAddress');
    providerAddress.innerText = finalAddress;
}

function fillProviderFeed(providerFeedData) {

    const portifolioGrid = document.getElementById("portifolioGrid");

    providerFeedData.forEach(feedPicture => {
        const newImg = document.createElement("img");
        newImg.src = feedPicture.picture_url;

        portifolioGrid.appendChild(newImg);
    });
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

async function getProviderFeed(providerId) {
    const response = await fetch("/users/" + providerId + "/feed");
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
        const response = await fetch('/auth/status');

        if (!response.ok) {
            throw new Error(`Falha na comunicação com o servidor. Status: ${response.status}`);
        }

        const user = await response.json();

        if (user.isAuthenticated) {
            return user;
        } else {
            return null;
        }

    } catch (error) {
        console.error("Falha crítica na verificação de autenticação:", error);
        return null;
    }
}

function initializeScheduling() {
    const calendarWeekContainer = document.getElementById('calendar-week-container');
    const calendarMonthContainer = document.getElementById('calendar-month-container');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const toggleButton = document.getElementById('toggle-calendar-view');
    const scheduleButton = document.querySelector('.schedule-btn');

    if (!calendarWeekContainer || !timeSlotsContainer) {
        console.error("Elementos do calendário não encontrados");
        return;
    }

    renderAll();
    setupSchedulingEventListeners();
}

function initializeScheduling() {
    const calendarWeekContainer = document.getElementById('calendar-week-container');
    const calendarMonthContainer = document.getElementById('calendar-month-container');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const toggleButton = document.getElementById('toggle-calendar-view');
    const scheduleButton = document.querySelector('.schedule-btn');

    if (!calendarWeekContainer || !timeSlotsContainer) {
        console.error("Elementos do calendário não encontrados");
        return;
    }

    renderAll();
    setupSchedulingEventListeners();
}

function renderAll() {
    renderWeekCalendar(viewDate);
    renderMonthCalendar(viewDate);
    updateCalendarView();
    renderTimeSlots(viewDate);
}

function renderWeekCalendar(date) {
    const calendarWeekContainer = document.getElementById('calendar-week-container');
    const monthYearDisplay = document.getElementById('calendar-month-year');

    if (!calendarWeekContainer || !monthYearDisplay) return;

    calendarWeekContainer.innerHTML = '';
    const weekDays = getWeekDays(date);
    monthYearDisplay.textContent = date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    }).replace(/^\w/, c => c.toUpperCase());

    weekDays.forEach(day => {
        const dayElement = createDayElement(day);
        calendarWeekContainer.appendChild(dayElement);
    });
}

function renderMonthCalendar(date) {
    const calendarMonthContainer = document.getElementById('calendar-month-container');
    if (!calendarMonthContainer) return;

    calendarMonthContainer.innerHTML = '';
    const monthDays = getMonthDays(date);
    const dayLetters = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    dayLetters.forEach(letter => {
        const letterEl = document.createElement('div');
        letterEl.className = 'month-day-letter';
        letterEl.textContent = letter;
        calendarMonthContainer.appendChild(letterEl);
    });

    monthDays.forEach(day => {
        if (!day) {
            calendarMonthContainer.appendChild(document.createElement('div'));
            return;
        }
        const dayElement = createDayElement(day, true);
        calendarMonthContainer.appendChild(dayElement);
    });
}

function renderTimeSlots(date) {
    const timeSlotsContainer = document.getElementById('time-slots-container');
    if (!timeSlotsContainer) return;

    timeSlotsContainer.innerHTML = '';
    const availableSlots = generateAvailableSlots(date);

    if (availableSlots.length === 0 || isDateUnavailable(date)) {
        timeSlotsContainer.innerHTML = '<p>Nenhum horário disponível para este dia.</p>';
        return;
    }

    availableSlots.forEach(slot => {
        const timeSlotButton = document.createElement('button');
        timeSlotButton.className = 'time-slot';
        timeSlotButton.textContent = slot;
        timeSlotButton.dataset.time = slot;
        timeSlotsContainer.appendChild(timeSlotButton);
    });
}

function generateAvailableSlots(date) {
    const slots = [];
    const dateString = date.toISOString().split('T')[0];
    const alreadyBooked = bookedSlots[dateString] || [];
    let currentTime = new Date(date);
    currentTime.setHours(8, 0, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(22, 0, 0, 0);

    while (currentTime < endTime) {
        const slotTime = currentTime.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        if (!alreadyBooked.includes(slotTime)) {
            slots.push(slotTime);
        }
        currentTime.setHours(currentTime.getHours() + serviceDurationHours);
        currentTime.setMinutes(currentTime.getMinutes() + breakTimeMinutes);
    }
    return slots;
}

function createDayElement(day, isMonthViewElement = false) {
    const dayContainer = document.createElement('div');
    dayContainer.className = 'day-container';

    if (!isMonthViewElement) {
        const dayLetter = document.createElement('span');
        dayLetter.className = 'day-letter';
        dayLetter.textContent = day.toLocaleDateString('pt-BR', {
            weekday: 'short'
        }).charAt(0).toUpperCase();
        dayContainer.appendChild(dayLetter);
    }

    const dayNumber = document.createElement('button');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day.getDate();
    dayNumber.dataset.date = day.toISOString().split('T')[0];

    if (selectedDate && isSameDay(day, selectedDate)) {
        dayNumber.classList.add('selected');
    }
    if (isDateUnavailable(day)) {
        dayNumber.classList.add('unavailable');
    }

    dayContainer.appendChild(dayNumber);
    return dayContainer;
}

function getWeekDays(date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const week = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    return week;
}

function getMonthDays(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = [];

    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        daysInMonth.push(null);
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        daysInMonth.push(new Date(year, month, i));
    }
    return daysInMonth;
}

function isSameDay(d1, d2) {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

function isDateUnavailable(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    const dateString = date.toISOString().split('T')[0];
    return unavailableDates.includes(dateString);
}

function updateCalendarView() {
    const calendarMonthContainer = document.getElementById('calendar-month-container');
    const calendarWeekContainer = document.getElementById('calendar-week-container');

    if (calendarMonthContainer) {
        calendarMonthContainer.classList.toggle('hidden', !isMonthView);
    }
    if (calendarWeekContainer) {
        calendarWeekContainer.classList.toggle('hidden', isMonthView);
    }
}

function handleDaySelection(target) {
    if (target && target.classList.contains('day-number') && !target.classList.contains('unavailable')) {
        viewDate = new Date(target.dataset.date + 'T12:00:00Z');
        selectedDate = new Date(target.dataset.date + 'T12:00:00Z');
        renderAll();
    }
}

async function setupSchedulingEventListeners() {
    const toggleButton = document.getElementById('toggle-calendar-view');
    const calendarWeekContainer = document.getElementById('calendar-week-container');
    const calendarMonthContainer = document.getElementById('calendar-month-container');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const scheduleButton = document.querySelector('.schedule-btn');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            isMonthView = !isMonthView;
            updateCalendarView();
        });
    }

    if (calendarWeekContainer) {
        calendarWeekContainer.addEventListener('click', (e) => {
            handleDaySelection(e.target.closest('.day-number'));
        });
    }

    if (calendarMonthContainer) {
        calendarMonthContainer.addEventListener('click', (e) => {
            handleDaySelection(e.target.closest('.day-number'));
        });
    }

    if (timeSlotsContainer) {
        timeSlotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-slot')) {
                const oldSelected = timeSlotsContainer.querySelector('.time-slot.selected');
                if (oldSelected) oldSelected.classList.remove('selected');
                e.target.classList.add('selected');
            }
        });
    }

    if (scheduleButton) {
        scheduleButton.addEventListener('click', async () => {

            const timeSlotsContainer = document.getElementById('time-slots-container');
            const selectedTimeEl = timeSlotsContainer ? timeSlotsContainer.querySelector('.time-slot.selected') : null;
            const observationTextArea = document.querySelector('.observations-section textarea');

            // Validações
            if (!selectedDate) {
                alert('Por favor, selecione uma data no calendário.');
                return;
            }

            if (!selectedTimeEl) {
                alert('Por favor, selecione um horário.');
                return;
            }

            if (!selectedProduct) {
                alert('Erro: Nenhum produto foi selecionado.');
                return;
            }

            // 1. Obter o horário selecionado
            const selectedTime = selectedTimeEl.dataset.time; // Ex: "10:00"
            const [hours, minutes] = selectedTime.split(':');

            // 2. Montar a data inicial do agendamento
            const initialDate = new Date(selectedDate);
            initialDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

            // 3. Calcular a data final (baseada na duração do serviço)
            const endDate = new Date(initialDate);
            endDate.setHours(endDate.getHours() + serviceDurationHours);

            // 4. Obter observações do textarea
            const observation = observationTextArea ? observationTextArea.value.trim() : '';

            const user = await verifyUserStatus();
            const clientId = user ? user.userId : null;

            // Abrir modal para informar que o usuário não está logado redirecionar para pagina de login 
            if (!clientId) {
                alert('Erro: Usuário não autenticado.');
                return;
            }

            let userApproval = localStorage.getItem("providerId");
            let waitApproval = true;
            let approval = false;

            if (selectedProduct.autoApprove == true) {
                waitApproval = false;
                approval = true;
            }

            // 6. Criar o JSON com os dados dinâmicos
            const newServiceOrderData = {
                "clientId": clientId,
                "productId": selectedProduct.id,
                "total_value": selectedProduct.priceToBeAgreed ? 0 : parseFloat(selectedProduct.price),
                "observation": observation || `Agendamento para ${selectedProduct.name}`,
                "initialDate": initialDate.toISOString(),
                "previousEndDate": endDate.toISOString(),
                "waitApproval": waitApproval,
                "userApproval": +userApproval,
                "approval": approval
            };

            try {
                const response = await fetch("/service-orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newServiceOrderData),
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Erro ${response.status}`);
                }

                const result = await response.json();
                console.log('Agendamento criado com sucesso:', result);

                // 8. Salvar dados localmente e redirecionar
                localStorage.setItem('ultimoAgendamento', JSON.stringify(result));
                localStorage.setItem('selectedProduct', selectedProduct.id);

                window.location.href = '/my-service-orders';

            } catch (error) {
                console.error('Erro ao criar agendamento:', error);
            }
        });
    }
}

async function main() {

    const providerId = localStorage.getItem("providerId")

    if (!providerId) {
        console.error("ProviderId não informado.");
        return;
    }

    document.getElementById("returnButton").addEventListener("click", returnWindow);
    document.getElementById("tabProfile").addEventListener("click", showProfile);
    document.getElementById("tabProducts").addEventListener("click", showProductList);
    document.getElementById("tabDetails").addEventListener("click", showDetails);

    const user = await verifyUserStatus();
    if (user) {
        favorites = await getUserFavorites();
        showLoggedUserButtons();
    }

    try {
        const providerInfos = await getProviderInfos(providerId);
        const providerProducts = await getProviderProducts(providerId);
        const providerFeed = await getProviderFeed(providerId)

        fillProviderInfos(providerInfos, user);
        fillProviderFeed(providerFeed)
        providerProducts.forEach(product => {
            fillProviderProducts(product, providerInfos.phone);
        });
        fillProviderDetails(providerInfos, user);
    } catch (error) {
        console.error("Falha ao carregar dados do prestador:", error);
    }

}

window.addEventListener("load", main);