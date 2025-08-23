document.addEventListener('DOMContentLoaded', () => {

  // --- SELEÇÃO DOS ELEMENTOS ---
  const modalOverlay = document.getElementById('serviceModal');
  const modalTitle = modalOverlay.querySelector('.service-title');
  const modalDescriptionList = modalOverlay.querySelector('.service-description ul');
  const modalPrice = modalOverlay.querySelector('.service-price');
  const modalTime = modalOverlay.querySelector('.service-time');
  const productCards = document.querySelectorAll('.product-card');
  const closeButton = modalOverlay.querySelector('.modal-close-btn');
  const actionButton = modalOverlay.querySelector('.contact-btn');
  const actionButtonText = actionButton.querySelector('span');
  const actionButtonIcon = actionButton.querySelector('svg');

  // Variável para guardar a ação atual do modal
  let currentAction = null;
  let currentPhone = null;

  // --- FUNÇÕES ---

  function openModal(card) {
    // Pega todos os dados do card
    const title = card.dataset.title;
    const description = card.dataset.description;
    const price = card.dataset.price;
    const time = card.dataset.time;
    const action = card.dataset.action;
    const phone = card.dataset.phone;

    // Guarda a ação e o telefone atuais
    currentAction = action;
    currentPhone = phone;

    // Preenche as informações básicas do modal
    modalTitle.textContent = title;
    modalPrice.textContent = price;
    modalTime.textContent = time;

    // Preenche a lista de descrição
    modalDescriptionList.innerHTML = '';
    const descriptionItems = description.split(';');
    descriptionItems.forEach(itemText => {
      if (itemText.trim()) {
        const listItem = document.createElement('li');
        listItem.textContent = itemText.trim();
        modalDescriptionList.appendChild(listItem);
      }
    });

    // --- LÓGICA DINÂMICA DO BOTÃO ---
    if (action === 'schedule') {
      actionButtonText.textContent = 'Agendar';
      // (Opcional) Trocar o ícone se desejar
      actionButtonIcon.innerHTML = `<path d="M8 2v4m8-4v4M3 10h18M4 6h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"></path>`;
    } else { // 'contact' ou padrão
      actionButtonText.textContent = 'Entrar em Contato';
      actionButtonIcon.innerHTML = `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>`;
    }

    // Exibe o modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function handleActionClick() {
    if (currentAction === 'schedule') {
      // Redireciona para a nova tela de agendamento
      // (Vamos criar essa tela no próximo passo)
      alert('Redirecionando para a tela de agendamento...');
      // window.location.href = 'agendamento.html'; 
    } else if (currentAction === 'contact' && currentPhone) {
      // Redireciona para o WhatsApp
      const message = encodeURIComponent(`Olá, vi o serviço "${modalTitle.textContent}" e gostaria de mais informações.`);
      window.open(`https://wa.me/${currentPhone}?text=${message}`, '_blank' );
    }
  }

  // --- EVENT LISTENERS ---

  productCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  closeButton.addEventListener('click', closeModal);
  actionButton.addEventListener('click', handleActionClick);

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
});
