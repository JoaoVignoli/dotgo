function nextStep() {
    window.location.href = "https://dotgo.vignoli.dev.br/register/users/personal";
}

function registerClient() {
    localStorage.setItem("userRole", "CLIENT");
    nextStep();
}

function registerServiceHolder() {
    localStorage.setItem("userRole", "SERVICE_HOLDER");
    nextStep();
}

function returnWindow() {
    history.back();
}

function main() {
    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", returnWindow);

    const clientRoleButton = document.getElementById("clientRoleButton");
    clientRoleButton.addEventListener("click", registerClient)

    const serviceHolderRoleButton = document.getElementById("serviceHolderRoleButton");
    serviceHolderRoleButton.addEventListener("click", registerServiceHolder);
}

window.addEventListener("load", main);