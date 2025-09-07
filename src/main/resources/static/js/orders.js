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
          <div class="provider-avatar">
            <img src="/api/files/provider-photos/${order.providerId || 'default'}.jpg" 
              alt="Foto do prestador" 
              onerror="this.style.display='none'; this.parentElement.style.backgroundImage='url(data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23666\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg> )'" />
        </div>
          <div class="order-info">
            <h3 class="service-name">${order.serviceName}</h3>
            <p class="provider-name">${order.providerName}</p>
        </div>
            <span class="order-status status-${order.status}">${order.status}</span>
        </div>

          <div class="order-details">
              <div class="detail-row">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">${order.date} às ${order.time}</span>
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

    // Verifica se há dados de agendamento vindos da tela anterior
    const ultimoAgendamento = JSON.parse(localStorage.getItem("ultimoAgendamento"));
    if (ultimoAgendamento) {
      // Verifica se a ordem já existe para evitar duplicatas
      const exists = orders.some(order => 
        order.serviceName === ultimoAgendamento.servico && 
        order.date === ultimoAgendamento.data &&
        order.time === ultimoAgendamento.horario &&
        order.providerName === ultimoAgendamento.prestador
      );
      
      if (!exists) {
        // Cria nova ordem com os dados do agendamento
        const novaOrdem = {
          id: Date.now(), // ID único baseado no timestamp
          serviceName: ultimoAgendamento.servico,
          providerName: ultimoAgendamento.prestador,
          status: "pendente",
          date: ultimoAgendamento.data,
          time: ultimoAgendamento.horario,
          price: "R$ 75,00", // Valor padrão - pode ser ajustado conforme necessário
          address: "Endereço do cliente", // Endereço padrão - pode ser ajustado
          createdAt: new Date().toISOString(),
          observations: ultimoAgendamento.observacoes || ""
        };
        
        orders.unshift(novaOrdem); // Adiciona no início da lista
        localStorage.setItem("orders", JSON.stringify(orders)); // Atualiza o localStorage
      }
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
    confirmationModal.style.display = "flex";
    // Adiciona classe para animação
    setTimeout(() => {
      confirmationModal.classList.add("visible");
    }, 10);
  };

  // Função para esconder o modal de confirmação
  const hideConfirmationModal = () => {
    confirmationModal.classList.remove("visible");
    setTimeout(() => {
      confirmationModal.style.display = "none";
    }, 300);
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
                  <span class="detail-value">${order.date} às ${order.time}</span>
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
    serviceModal.style.display = "flex";
    setTimeout(() => {
      serviceModal.classList.add("visible");
    }, 10);
  };

  // Função para esconder o modal de detalhes da ordem
  const hideServiceModal = () => {
    serviceModal.classList.remove("visible");
    setTimeout(() => {
      serviceModal.style.display = "none";
    }, 300);
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
    window.open("https://wa.me/5511999999999", "_blank" ); // Substitua pelo número de telefone desejado
  });

  // Inicialização
  loadOrders();

    // Verifica se há dados de agendamento vindos da tela de profileprovider
  const ultimoAgendamentoCheck = JSON.parse(localStorage.getItem("ultimoAgendamento"));
  const selectedProductId = localStorage.getItem("selectedProduct");
  
  // Só mostra o modal se ambos existirem (indicando que veio da tela de agendamento)
  if (ultimoAgendamentoCheck && selectedProductId) {
    // Mostra o modal de confirmação após um pequeno delay
    setTimeout(() => {
      showConfirmationModal();
    }, 500);
    
    // Limpa os dados após mostrar o modal para evitar que apareça novamente
    localStorage.removeItem("selectedProduct");
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
