async function logout() {
    const response = await fetch("/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })

    if (response.status === 200) {
        window.location.reload();
    } 
}

function displayCategories(category){
    
}

function getCategories() {
    fetch("/categories" )
        .then((response) => response.json())
        .then((data) => {
            data.forEach(category => {
                displayCategories(category);
            });
        });
}

function showLoggedUserButtons() {
    const logoutButton = document.getElementById("logout-button");
    logoutButton.classList.remove("hidden");
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
        // Faz a requisição para o endpoint que retorna o status da autenticação
        const response = await fetch('/auth/status');

        // Se a resposta não for "ok" (ex: erro 500, falha de rede), trata como um erro.
        if (!response.ok) {
            throw new Error(`Falha na comunicação com o servidor. Status: ${response.status}`);
        }

        // Extrai o corpo da resposta como JSON
        const data = await response.json();

        // A validação principal: verifica a propriedade "isAuthenticated" no JSON
        if (data.isAuthenticated) {
            // Se autenticado, retorna os dados do usuário
            return data;
        } else {
            // Se não autenticado, retorna null
            return null;
        }

    } catch (error) {
        // Captura erros de rede ou o erro que lançamos acima
        console.error("Falha crítica na verificação de autenticação:", error);
        // Em caso de qualquer erro, consideramos o usuário como não autenticado
        return null;
    }
}

async function main() {

    const userData = await verifyUserStatus();

    if (userData) {
        showLoggedUserButtons();
    } 

    getCategories();

    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", logout)
}

window.addEventListener("load", main);