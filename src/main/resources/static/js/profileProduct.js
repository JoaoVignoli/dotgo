// Aguarda o DOM carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

  // --- SELEÇÃO DOS ELEMENTOS DO MODAL ---
  const modalOverlay = document.getElementById('serviceModal');
  const modalContainer = modalOverlay.querySelector('.modal-container');
  
  // Seleciona os elementos dentro do modal para preenchimento
  const modalTitle = modalOverlay.querySelector('.service-title');
  const modalDescriptionList = modalOverlay.querySelector('.service-description ul');
  const modalPrice = modalOverlay.querySelector('.service-price');
  const modalTime = modalOverlay.querySelector('.service-time');
  
  // --- SELEÇÃO DOS ELEMENTOS DE INTERAÇÃO ---
  const productCards = document.querySelectorAll('.product-card');
  const closeButton = modalOverlay.querySelector('.modal-close-btn');

  // --- FUNÇÕES ---

  /**
   * Abre o modal e preenche com as informações do produto clicado.
   * @param {HTMLElement} card - O card do produto que foi clicado.
   */
  function openModal(card) {
    // Pega os dados do card usando os atributos data-*
    const title = card.dataset.title;
    const description = card.dataset.description;
    const price = card.dataset.price;
    const time = card.dataset.time;

    // Preenche o modal com as informações
    modalTitle.textContent = title;
    modalPrice.textContent = price;
    modalTime.textContent = time;

    // Limpa a lista de descrição antiga e cria a nova
    modalDescriptionList.innerHTML = ''; // Limpa itens anteriores
    const descriptionItems = description.split(';'); // Divide a descrição em itens
    descriptionItems.forEach(itemText => {
      if (itemText.trim()) { // Garante que não cria li para itens vazios
        const listItem = document.createElement('li');
        listItem.textContent = itemText.trim();
        modalDescriptionList.appendChild(listItem);
      }
    });

    // Exibe o modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Impede o scroll da página
  }

  /**
   * Fecha o modal.
   */
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restaura o scroll da página
  }

  // --- EVENT LISTENERS (ADICIONANDO OS EVENTOS) ---

  // 1. Adiciona um evento de clique para cada card de produto
  productCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  // 2. Fecha o modal ao clicar no botão "X"
  closeButton.addEventListener('click', closeModal);

  // 3. Fecha o modal ao clicar fora da área do conteúdo (no overlay)
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // 4. Fecha o modal ao pressionar a tecla "Escape" (ESC)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
  
  // 5. Lógica para o botão de contato (exemplo)
  const contactButton = modalOverlay.querySelector('.contact-btn');
  contactButton.addEventListener('click', () => {
      alert('Lógica de contato aqui!');
      // Ex: window.location.href = 'https://wa.me/5511999999999';
  } );
});
