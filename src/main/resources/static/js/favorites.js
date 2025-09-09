document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.getElementById("favorites-list");
  const emptyState = document.getElementById("empty-state");

  // Função para obter a URL da foto do prestador
  function getProviderPhotoUrl(providerId) {
    if (!providerId) return '';
    return `/api/files/provider-photos/${providerId}.jpg`;
  }

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
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token de autenticação não encontrado');
        showEmptyState();
        return;
      }

      const response = await fetch('/api/favorites', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const favorites = await response.json();
      
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

