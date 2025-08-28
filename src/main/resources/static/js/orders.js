document.addEventListener("DOMContentLoaded", () => {
  const ordersList = document.getElementById("orders-list");
  const emptyState = document.getElementById("empty-state");
  const statusTabs = document.querySelectorAll(".status-tab");
  const confirmationModal = document.getElementById("confirmationModal");
  const closeConfirmationModalBtn = document.getElementById("closeConfirmationModal");
  const serviceModal = document.getElementById("serviceModal");
  const closeServiceModalBtn = document.getElementById("closeServiceModal");
  const serviceModalContent = document.getElementById("serviceModalContent");
  const contactButton = confirmationModal.querySelector(".contact-button");

  // Função para formatar a data e hora
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("pt-BR", options).replace(",", " às");
  };

  // Função para renderizar uma ordem de serviço
  const renderOrderCard = (order) => {
    const card = document.createElement("div");
    card.className = "order-card";
    card.dataset.status = order.status;
    card.innerHTML = `
          <div class="order-header">
              <div class="provider-avatar"></div>
              <div class="order-info">
                  <h3 class="service-name">${order.serviceName}</h3>
                  <p class="provider-name">${order.providerName}</p>
              </div>
              <span class="order-status status-${order.status}">${order.status}</span>
          </div>
          <div class="order-details">
              <div class="detail-row">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">${formatDateTime(order.date)} às ${order.time}</span>
              </div>
              <div class="detail-row">
                  <span class="detail-label">Valor:</span>
                  <span class="detail-value">${order.price}</span>
              </div>
              <div class="detail-row">
                  <span class="detail-label">Endereço:</span>
                  <span class="detail-value">${order.address}</span>
              </div>
              ${order.observations ? `<div class="detail-row"><span class="detail-label">Observações:</span><span class="detail-value">${order.observations}</span></div>` : ''}
              <p class="order-date">Criado em ${new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
      `;
    card.addEventListener("click", () => showServiceModal(order));
    return card;
  };

  // Função para carregar e exibir as ordens
  const loadOrders = (filter = "todas") => {
    ordersList.innerHTML = ""; // Limpa a lista atual
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Dados de exemplo para demonstração (se não houver ordens salvas)
    if (orders.length === 0) {
        orders = [
            {
                id: 1,
                serviceName: "Instalação Elétrica",
                providerName: "João Silva",
                status: "pendente",
                date: "2025-01-15",
                time: "14:00",
                price: "R$ 250,00",
                address: "Rua das Flores, 123",
                createdAt: "2025-01-10",
                observations: ""
            },
            {
                id: 2,
                serviceName: "Limpeza Residencial",
                providerName: "Maria Santos",
                status: "concluida",
                date: "2025-01-12",
                time: "09:00",
                price: "R$ 150,00",
                address: "Av. Principal, 456",
                createdAt: "2025-01-08",
                observations: ""
            }
        ];
        localStorage.setItem("orders", JSON.stringify(orders));
    }

    // Adiciona a última ordem agendada se existir e não estiver na lista
    const lastScheduledOrder = JSON.parse(localStorage.getItem("lastScheduledOrder"));
    if (lastScheduledOrder) {
      // Verifica se a ordem já existe para evitar duplicatas
      const exists = orders.some(order => 
        order.serviceName === lastScheduledOrder.serviceName && 
        order.date === lastScheduledOrder.date &&
        order.time === lastScheduledOrder.time
      );
      if (!exists) {
        orders.unshift(lastScheduledOrder); // Adiciona no início da lista
        localStorage.setItem("orders", JSON.stringify(orders)); // Atualiza o localStorage
      }
      localStorage.removeItem("lastScheduledOrder"); // Limpa após adicionar
    }

    const filteredOrders = orders.filter((order) => {
      if (filter === "todas") return true;
      return order.status === filter;
    });

    if (filteredOrders.length === 0) {
      emptyState.style.display = "flex";
    } else {
      emptyState.style.display = "none";
      filteredOrders.forEach((order) => {
        ordersList.appendChild(renderOrderCard(order));
      });
    }
  };

  // Função para mostrar o modal de confirmação
  const showConfirmationModal = () => {
    confirmationModal.classList.add("visible");
  };

  // Função para esconder o modal de confirmação
  const hideConfirmationModal = () => {
    confirmationModal.classList.remove("visible");
  };

  // Função para mostrar o modal de detalhes da ordem
  const showServiceModal = (order) => {
    serviceModalContent.innerHTML = `
          <div class="order-header">
              <div class="provider-avatar"></div>
              <div class="order-info">
                  <h3 class="service-name">${order.serviceName}</h3>
                  <p class="provider-name">${order.providerName}</p>
              </div>
              <span class="order-status status-${order.status}">${order.status}</span>
          </div>
          <div class="order-details">
              <div class="detail-row">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">${formatDateTime(order.date)} às ${order.time}</span>
              </div>
              <div class="detail-row">
                  <span class="detail-label">Valor:</span>
                  <span class="detail-value">${order.price}</span>
              </div>
              <div class="detail-row">
                  <span class="detail-label">Endereço:</span>
                  <span class="detail-value">${order.address}</span>
              </div>
              ${order.observations ? `<div class="detail-row"><span class="detail-label">Observações:</span><span class="detail-value">${order.observations}</span></div>` : ''}
              <p class="order-date">Criado em ${new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
      `;
    serviceModal.classList.add("visible");
  };

  // Função para esconder o modal de detalhes da ordem
  const hideServiceModal = () => {
    serviceModal.classList.remove("visible");
  };

  // Event Listeners
  statusTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      statusTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      loadOrders(tab.dataset.status);
    });
  });

  closeConfirmationModalBtn.addEventListener("click", hideConfirmationModal);
  confirmationModal.addEventListener("click", (e) => {
    if (e.target === confirmationModal) {
      hideConfirmationModal();
    }
  });

  closeServiceModalBtn.addEventListener("click", hideServiceModal);
  serviceModal.addEventListener("click", (e) => {
    if (e.target === serviceModal) {
      hideServiceModal();
    }
  });

  // Redirecionar para o WhatsApp
  contactButton.addEventListener("click", () => {
    window.open("https://wa.me/5511999999999", "_blank"); // Substitua pelo número de telefone desejado
  });

  // Inicialização
  loadOrders();

  // Verifica se veio da tela de agendamento
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("fromScheduling") === "true") {
    showConfirmationModal();
  }
});

// Função auxiliar para converter data do formato brasileiro para ISO (se necessário)
function formatDateFromBR(brDate) {
    try {
        const parts = brDate.match(/(\d{1,2}) de (\w+) de (\d{4})/);
        if (parts) {
            const months = {
                "janeiro": "01", "fevereiro": "02", "março": "03", "abril": "04",
                "maio": "05", "junho": "06", "julho": "07", "agosto": "08",
                "setembro": "09", "outubro": "10", "novembro": "11", "dezembro": "12"
            };
            const day = parts[1].padStart(2, "0");
            const month = months[parts[2].toLowerCase()] || "01";
            const year = parts[3];
            return `${year}-${month}-${day}`;
        }
        return new Date().toISOString().split("T")[0];
    } catch {
        return new Date().toISOString().split("T")[0];
    }
}


