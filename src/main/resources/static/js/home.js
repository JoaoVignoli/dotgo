function verifyUserStatus() {
    fetch("/auth/status")
        .then((response) => {
            // Verifica especificamente se o status é 200
            if (response.status === 200) {
                return response.json();
            } else {
                console.log("Usuário não autenticado.")
            }
        })
        .catch((error) => {
            console.error("Falha ao buscar status do usuário:", error);
        });
} 

function main() {
    verifyUserStatus();
}

window.addEventListener("load", main);