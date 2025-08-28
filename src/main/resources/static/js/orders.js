document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTOS DO DOM ---
    const ordersList = document.getElementById("orders-list");
    const emptyState = document.getElementById("empty-state");
    const statusTabs = document.querySelectorAll(".status-tab");
    const btnVoltar = document.getElementById("btnVoltar");
    const serviceModal = document.getElementById("serviceModal");
    const closeServiceModalBtn = document.getElementById("closeServiceModal");
    const serviceModalContent = document.getElementById("serviceModalContent");
    const confirmationModal = document.getElementById("confirmationModal");
    const closeConfirmationModalBtn = document.getElementById("closeConfirmationModal");

    // --- DADOS DE EXEMPLO E ESTADO ---
    let currentFilter = "todas";
    let orders = [];

    // --- INICIALIZAÇÃO ---
    init();

    function init() {
        loadOrders();
        setupEventListeners();
        renderOrders();
        checkAndShowConfirmationModal();
    }

    // --- CARREGAMENTO DE DADOS ---
    function loadOrders() {
        // Carrega dados do localStorage (agendamentos)
        const ultimoAgendamento = localStorage.getItem("ultimoAgendamento");
        
        // Dados de exemplo para demonstração
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

        // Se há um agendamento recente, adiciona à lista
        if (ultimoAgendamento) {
            try {
                const agendamento = JSON.parse(ultimoAgendamento);
                const novaOrdem = {
                    id: orders.length + 1,
                    serviceName: agendamento.servico || "Serviço Agendado",
                    providerName: agendamento.prestador || "Prestador",
                    status: "pendente",
                    date: formatDateFromBR(agendamento.data),
                    time: agendamento.horario || "00:00",
                    price: "A definir",
                    address: "Endereço a confirmar",
                    createdAt: new Date().toISOString().split("T")[0],
                    observations: agendamento.observacoes || ""
                };
                
                // Adiciona no início da lista
                orders.unshift(novaOrdem);
                
            } catch (error) {
                console.error("Erro ao carregar agendamento:", error);
            }
        }
    }

    // --- RENDERIZAÇÃO ---
    function renderOrders() {
        const filteredOrders = filterOrders();
        
        if (filteredOrders.length === 0) {
            showEmptyState();
            return;
        }

        hideEmptyState();
        ordersList.innerHTML = "";

        filteredOrders.forEach(order => {
            const orderCard = createOrderCard(order);
            ordersList.appendChild(orderCard);
        });
    }

    function createOrderCard(order) {
        const card = document.createElement("div");
        card.className = "order-card";
        card.innerHTML = `
            <div class="order-header">
                <div class="provider-avatar"></div>
                <div class="order-info">
                    <h3 class="service-name">${order.serviceName}</h3>
                    <p class="provider-name">${order.providerName}</p>
                </div>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Data:</span>
                    <span class="detail-value">${formatDate(order.date)} às ${order.time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Valor:</span>
                    <span class="detail-value">${order.price}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Endereço:</span>
                    <span class="detail-value">${order.address}</span>
                </div>
                ${order.observations ? `
                <div class="detail-row">
                    <span class="detail-label">Observações:</span>
                    <span class="detail-value">${order.observations}</span>
                </div>
                ` : ""}
            </div>
            <div class="order-date">
                Criado em ${formatDate(order.createdAt)}
            </div>
        `;

        // Adiciona evento de clique para mostrar detalhes
        card.addEventListener("click", () => showOrderDetails(order));

        return card;
    }

    function showEmptyState() {
        ordersList.style.display = "none";
        emptyState.style.display = "flex";
    }

    function hideEmptyState() {
        ordersList.style.display = "flex";
        emptyState.style.display = "none";
    }

    // --- FILTROS ---
    function filterOrders() {
        if (currentFilter === "todas") {
            return orders;
        }
        return orders.filter(order => order.status === currentFilter);
    }

    function setActiveTab(selectedTab) {
        statusTabs.forEach(tab => tab.classList.remove("active"));
        selectedTab.classList.add("active");
        currentFilter = selectedTab.dataset.status;
        renderOrders();
    }

    // --- FUNÇÕES AUXILIARES ---
    function getStatusText(status) {
        const statusMap = {
            "pendente": "Pendente",
            "concluida": "Concluída",
            "cancelada": "Cancelada"
        };
        return statusMap[status] || status;
    }

    function formatDate(dateString) {
        try {
            const date = new Date(dateString + "T00:00:00"); // Adiciona T00:00:00 para evitar problemas de fuso horário
            return date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        } catch {
            return dateString;
        }
    }

    function formatDateFromBR(brDate) {
        // Converte data do formato brasileiro para ISO
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

    function showOrderDetails(order) {
        serviceModalContent.innerHTML = `
            <div class="order-header">
                <div class="provider-avatar"></div>
                <div class="order-info">
                    <h3 class="service-name">${order.serviceName}</h3>
                    <p class="provider-name">${order.providerName}</p>
                </div>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Data:</span>
                    <span class="detail-value">${formatDate(order.date)} às ${order.time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Valor:</span>
                    <span class="detail-value">${order.price}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Endereço:</span>
                    <span class="detail-value">${order.address}</span>
                </div>
                ${order.observations ? `
                <div class="detail-row">
                    <span class="detail-label">Observações:</span>
                    <span class="detail-value">${order.observations}</span>
                </div>
                ` : ""}
            </div>
            <div class="order-date">
                Criado em ${formatDate(order.createdAt)}
            </div>
        `;
        serviceModal.style.display = "flex";
    }

    function hideServiceModal() {
        serviceModal.style.display = "none";
    }

    function checkAndShowConfirmationModal() {
        const ultimoAgendamento = localStorage.getItem("ultimoAgendamento");
        if (ultimoAgendamento) {
            confirmationModal.style.display = "flex";
            // Remove do localStorage após exibir para que não apareça novamente
            localStorage.removeItem("ultimoAgendamento");
        }
    }

    function hideConfirmationModal() {
        confirmationModal.style.display = "none";
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Filtros de status
        statusTabs.forEach(tab => {
            tab.addEventListener("click", () => setActiveTab(tab));
        });

        // Botão voltar
        if (btnVoltar) {
            btnVoltar.addEventListener("click", () => {
                window.history.back();
            });
        }

        // Navegação inferior
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const span = item.querySelector("span");
                if (span) {
                    const page = span.textContent.toLowerCase();
                    navigateToPage(page);
                }
            });
        });

        // Fechar modal de detalhes da ordem
        if (closeServiceModalBtn) {
            closeServiceModalBtn.addEventListener("click", hideServiceModal);
        }

        // Fechar modal de confirmação
        if (closeConfirmationModalBtn) {
            closeConfirmationModalBtn.addEventListener("click", hideConfirmationModal);
        }
    }

    function navigateToPage(page) {
        const pageMap = {
            "home": "index.html",
            "favoritos": "favorites.html",
            "ordens": "orders.html",
            "perfil": "profile.html"
        };

        const targetPage = pageMap[page];
        if (targetPage && targetPage !== "orders.html") {
            window.location.href = targetPage;
        }
    }
});

