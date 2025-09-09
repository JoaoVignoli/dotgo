let favorites = [];
let favoriteIdMap = {};

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
        favoriteIdMap[fav.serviceProviderId] = fav.id; 
        return fav.serviceProviderId;
      });
      return favoriteProviderIds;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Falha crítica ao obter dados do usuário e favoritos:", error);
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

function displayFavorites(favorite) {


    card.innerHTML = `
      <div class="provider-avatar">
        <img src="${getProviderPhotoUrl(provider.id || provider.providerId)}" 
             alt="Foto de ${provider.name}" 
             onerror="this.style.display='none'; this.parentElement.style.backgroundImage='url(data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23666\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>)'" />
      </div>
      <div class="provider-info">
        <h3 class="provider-name">${provider.name}</h3>
        <p class="provider-specialty">${provider.specialty || 'Prestador de Serviços'}</p>
        <div class="provider-rating">
          <div class="stars">
            ${generateStars(provider.rating || 5)}
          </div>
          <span class="rating-text">${provider.rating || '5.0'}</span>
        </div>
      </div>
      <button class="favorite-button" onclick="removeFavorite('${provider.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    `;


    const serviceProvidersList = document.getElementById("favorites-list");

    // --- Criação dos Elementos ---
    const card = document.createElement("div");
    card.classList.add("provider-card");

    const providerAvatar = document.createElement("div");
    providerAvatar.classList.add("provider-avatar");

    const providerImg = document.createElement("img");
    providerImg.src = favorite.serviceProviderPicture;

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

        // Impede que o clique no botão acione o clique no card
        event.stopPropagation();
        event.preventDefault();

        const isCurrentlyFavorited = favoriteButton.classList.contains("favorited");

        // Desativa o botão para evitar cliques duplos enquanto a requisição está em andamento
        favoriteButton.disabled = true; 

        try {
            if (isCurrentlyFavorited) {
                // 1. Tenta remover o favorito no backend
                await removeFavorite(serviceHolder.id);

                // 2. Se a remoção for bem-sucedida, atualiza a UI
                favoriteButton.innerHTML = ''; // Limpa o ícone antigo
                favoriteButton.appendChild(createHeartIconOutline()); // Adiciona o ícone de contorno
                favoriteButton.classList.remove("favorited");

            } else {
                // Verifica se o usuário está logado antes de tentar favoritar
                if (isUserLoggedIn && isUserLoggedIn.userId) {
                    // 1. Tenta adicionar o favorito no backend
                    await addFavorite(serviceHolder.id, isUserLoggedIn.userId);

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

    // Esconder botão de favorito se não estiver logado.
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

document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.getElementById("favorites-list");
  const emptyState = document.getElementById("empty-state");

  // Função para renderizar um card de prestador favorito
  const renderProviderCard = (provider) => {
    const card = document.createElement("div");
    card.className = "provider-card";
    card.innerHTML = `
      <div class="provider-avatar">
        <img src="${getProviderPhotoUrl(provider.id || provider.providerId)}" 
             alt="Foto de ${provider.name}" 
             onerror="this.style.display='none'; this.parentElement.style.backgroundImage='url(data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23666\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>)'" />
      </div>
      <div class="provider-info">
        <h3 class="provider-name">${provider.name}</h3>
        <p class="provider-specialty">${provider.specialty || 'Prestador de Serviços'}</p>
        <div class="provider-rating">
          <div class="stars">
            ${generateStars(provider.rating || 5)}
          </div>
          <span class="rating-text">${provider.rating || '5.0'}</span>
        </div>
      </div>
      <button class="favorite-button" onclick="removeFavorite('${provider.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    `;
    
    // Adicionar evento de clique para ir ao perfil do prestador
    card.addEventListener("click", (e) => {
      // Não navegar se clicou no botão de favorito
      if (e.target.closest('.favorite-button')) return;
      
      // Navegar para o perfil do prestador
      window.location.href = `/provider-profile/${provider.id}`;
    });
    
    return card;
  };

  // Função para gerar estrelas de avaliação
  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    // Estrelas cheias
    for (let i = 0; i < fullStars; i++) {
      starsHTML += `
        <svg class="star" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      `;
    }
    
    // Estrela meio cheia (se necessário)
    if (hasHalfStar) {
      starsHTML += `
        <svg class="star" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stop-color="#FFD700"/>
              <stop offset="50%" stop-color="#E5E5E5"/>
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      `;
    }
    
    // Estrelas vazias
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += `
        <svg class="star" viewBox="0 0 24 24" fill="none" stroke="#E5E5E5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      `;
    }
    
    return starsHTML;
  }

  // Função para carregar os prestadores favoritos
  const loadFavorites = async () => {
    try {
      const response = await fetch('/auth/me');
      if (!response.ok) {
          throw new Error(`Erro ao buscar ordens de serviço: ${response.statusText}`);
      }
      const userData = await response.json();
      
      const favorites = userData.favorites;

      if (favorites && favorites.length > 0) {
        showFavoritesList(favorites);
      } else {
        showEmptyState();
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      showEmptyState();
    }
  };

  // Função para exibir a lista de favoritos
  const showFavoritesList = (favorites) => {
    favoritesList.innerHTML = '';
    emptyState.style.display = 'none';
    favoritesList.style.display = 'flex';
    
    favorites.forEach(provider => {
      const card = renderProviderCard(provider);
      favoritesList.appendChild(card);
    });
  };

  // Função para exibir o estado vazio
  const showEmptyState = () => {
    favoritesList.style.display = 'none';
    emptyState.style.display = 'flex';
  };

  // Função para remover um prestador dos favoritos
  window.removeFavorite = async (providerId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token de autenticação não encontrado');
        return;
      }

      const response = await fetch(`/api/favorites/${providerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Recarregar a lista de favoritos
        loadFavorites();
        
        // Mostrar feedback visual (opcional)
        console.log('Prestador removido dos favoritos');
      } else {
        console.error('Erro ao remover favorito');
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  // Carregar favoritos ao inicializar a página
  loadFavorites();

  // Atualizar a navegação ativa
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
  });
  document.getElementById('favoritesButton').classList.add('active');
});

