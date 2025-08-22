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
        // Se 'dadosUsuario' não for nulo, o usuário está autenticado.
        console.log(userData)
    } else {
        // Se for nulo, o usuário não está autenticado ou ocorreu um erro.
        console.log("Usuário não autenticado: " + userData)
    }
    verifyUserStatus();
}

window.addEventListener("load", main);