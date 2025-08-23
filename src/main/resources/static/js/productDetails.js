// Seleciona elementos principais
const modalOverlay = document.querySelector(".modal-overlay");
const modalClose = document.querySelector(".modal-close");
const modalTitle = document.querySelector(".modal-title");
const modalDescription = document.querySelector(".modal-description");
const modalPrice = document.querySelector(".modal-price");
const modalTime = document.querySelector(".modal-time");
const modalButton = document.querySelector(".modal-button");

// Seleciona todos os cards de produtos
const productCards = document.querySelectorAll(".product-card");

// Função para abrir modal
function openModal(product) {
  modalTitle.textContent = product.dataset.title;
  modalDescription.textContent = product.dataset.description;
  modalPrice.textContent = product.dataset.price;
  modalTime.textContent = product.dataset.time;

  // Define texto do botão (entra em contato ou agendar)
  if (product.dataset.action === "contact") {
    modalButton.textContent = "Entrar em Contato";
  } else if (product.dataset.action === "schedule") {
    modalButton.textContent = "Agendar";
  }

  modalOverlay.classList.add("active");
}

// Fecha modal
function closeModal() {
  modalOverlay.classList.remove("active");
}

// Adiciona evento em cada card
productCards.forEach(card => {
  card.addEventListener("click", () => openModal(card));
});

// Fecha no X
modalClose.addEventListener("click", closeModal);

// Fecha clicando fora
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

function openModal() {
  document.getElementById('serviceModal').style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Previne scroll do body
}

function closeModal() {
  document.getElementById('serviceModal').style.display = 'none';
  document.body.style.overflow = 'auto'; // Restaura scroll do body
}

function openContact() {
  // Aqui você pode adicionar a lógica para abrir o contato
  alert('Abrindo contato...');
}

// Fechar modal ao clicar no overlay
document.getElementById('serviceModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});
