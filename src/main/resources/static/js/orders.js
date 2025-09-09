
const elements = {
    ordersList: null,
    emptyState: null,
    statusTabs: null,
    confirmationModal: null,
    closeConfirmationModalBtn: null,
    serviceModal: null,
    closeServiceModalBtn: null,
    serviceModalContent: null,
    contactButton: null
};

function initializeDOMElements() {
    elements.ordersList = document.getElementById("orders-list");
    elements.emptyState = document.getElementById("empty-state");
    elements.statusTabs = document.querySelectorAll(".status-tab");
    elements.confirmationModal = document.getElementById("confirmationModal");
    elements.closeConfirmationModalBtn = document.getElementById("closeConfirmationModal");
    elements.serviceModal = document.getElementById("serviceModal");
    elements.closeServiceModalBtn = document.getElementById("closeServiceModal");
    elements.serviceModalContent = document.getElementById("serviceModalContent");
    elements.contactButton = elements.confirmationModal.querySelector(".contact-button");
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    };
    return date.toLocaleDateString("pt-BR", options).replace(",", " às");
}

function renderOrderCard(order) {
    const card = document.createElement("div");
    card.className = "order-card";
    card.dataset.status = order.status;

    const dateObject = new Date(order.initialDate);

    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');

    const time = `${hours}:${minutes}`;

    card.innerHTML = `
        <div class="order-header">
            <div class="provider-avatar">
                <img src="https://dotgo-medias.vignoli.dev.br/dotgo-bucket/${order.product.user.picture}" 
                    alt="Foto do prestador" 
                    onerror="this.style.display='none'; this.parentElement.style.backgroundImage='url(data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23666\'><path d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/></svg> )'" />
            </div>
            <div class="order-info">
                <h3 class="service-name">${order.product.name}</h3>
                <p class="provider-name">${order.product.user.name}</p>
            </div>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>

            <div class="order-details">
                <div class="detail-row">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">${new Date(order.initialDate).toLocaleDateString("pt-BR")} às ${time}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Valor:</span>
                  <span class="detail-value">${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(order.total_value)}</span>
                </div>
                ${order.observation ? `<div class="detail-column"><span class="detail-label">Observações:</span>
                <span class="detail-observation">${order.observation}</span>
                </div>` : ''}
              <p class="order-date">Criado em ${new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
        </div>`;
    card.addEventListener("click", () => showServiceModal(order));
    return card;
}

async function getOrdersFromDatabase() {
    try {
        const response = await fetch('/auth/me');
        if (!response.ok) {
            throw new Error(`Erro ao buscar ordens de serviço: ${response.statusText}`);
        }
        const userData = await response.json();
        return userData.serviceOrders;
    } catch (error) {
        console.error("Falha ao buscar ordens de serviço:", error);
        return [];
    }
}

async function loadOrders(filter = "todas") {

    let orders = await getOrdersFromDatabase();

    const filteredOrders = orders.filter((order) => {
        if (filter === "todas") return true;
        return order.status === filter;
    });

    if (filteredOrders.length === 0) {
        elements.emptyState.style.display = "flex";
    } else {
        elements.emptyState.style.display = "none";
        filteredOrders.forEach((order) => {
            elements.ordersList.appendChild(renderOrderCard(order));
        });
    }
}

function showConfirmationModal() {
    elements.confirmationModal.style.display = "flex";
    setTimeout(() => {
        elements.confirmationModal.classList.add("visible");
    }, 10);
}

function hideConfirmationModal() {
    elements.confirmationModal.classList.remove("visible");
    setTimeout(() => {
        elements.confirmationModal.style.display = "none";
    }, 300);
}

function showServiceModal(order) {

    const dateObject = new Date(order.initialDate);

    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');

    const time = `${hours}:${minutes}`;

    elements.serviceModalContent.innerHTML = `
          <div class="order-header">
              <div class="provider-avatar">
                <img src="https://dotgo-medias.vignoli.dev.br/dotgo-bucket/${order.product.user.picture}" 
                    alt="Foto do prestador" 
                    onerror="this.style.display='none'; this.parentElement.style.backgroundImage='url(data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23666\'><path d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/></svg> )'" />
              </div>
              <div class="order-info">
                  <h3 class="service-name">${order.product.name}</h3>
                  <p class="provider-name">${order.product.user.name}</p>
              </div>
              <span class="order-status status-${order.status}">${order.status}</span>
          </div>
          <div class="order-details">
              <div class="detail-row">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">${new Date(order.initialDate).toLocaleDateString("pt-BR")} às ${time}</span>
              </div>
              <div class="detail-row">
                  <span class="detail-label">Valor:</span>
                  <span class="detail-value">${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(order.total_value)}</span>
              </div>
              ${order.observation ? `<div class="detail-column"><span class="detail-label">Observações:</span><span class="detail-observation">${order.observation}</span></div>` : ''}
              <p class="order-date">Criado em ${new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
      `;
    elements.serviceModal.style.display = "flex";
    setTimeout(() => {
        elements.serviceModal.classList.add("visible");
    }, 10);
}

function hideServiceModal() {
    elements.serviceModal.classList.remove("visible");
    setTimeout(() => {
        elements.serviceModal.style.display = "none";
    }, 300);
}

function setupEventListeners() {
    elements.statusTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            elements.statusTabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            loadOrders(tab.dataset.status);
        });
    });

    elements.closeConfirmationModalBtn.addEventListener("click", hideConfirmationModal);
    elements.confirmationModal.addEventListener("click", (e) => {
        if (e.target === elements.confirmationModal) {
            hideConfirmationModal();
        }
    });

    elements.closeServiceModalBtn.addEventListener("click", hideServiceModal);
    elements.serviceModal.addEventListener("click", (e) => {
        if (e.target === elements.serviceModal) {
            hideServiceModal();
        }
    });

    elements.contactButton.addEventListener("click", () => {
        window.open("https://wa.me/5511999999999", "_blank");
    });
}

function checkForRecentAppointment() {
    const ultimoAgendamentoCheck = JSON.parse(localStorage.getItem("ultimoAgendamento"));
    const selectedProductId = localStorage.getItem("selectedProduct");

    if (ultimoAgendamentoCheck && selectedProductId) {
        setTimeout(() => {
            showConfirmationModal();
        }, 500);

        localStorage.removeItem("selectedProduct");
    }
}

async function main() {
    initializeDOMElements();
    setupEventListeners();
    await loadOrders();
    checkForRecentAppointment();
}

window.addEventListener("load", main);
