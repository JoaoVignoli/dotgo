
function nextStep() {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const taxId = document.getElementById("taxId");
    const phoneNumber = document.getElementById("phoneNumber");
    const password = document.getElementById("password");
    const birthday = document.getElementById("birthday");

    const data = {
        "name": name.value,
        "email": email.value,
        "taxId": taxId.value,
        "phone": phoneNumber.value,
        "password": password.value,
        "birthday": birthday.value
    }

    window.location.href = "https://dotgo.vignoli.dev.br/addressRegister";
}

function nextStep() {
    switch (window.location.pathname) {
        case "/personalInfoRegister":
            window.location.href = "https://dotgo.vignoli.dev.br/addressRegister";
            break;
        case "/addressRegister":
            window.location.href = 
            break;
    }
    window.location.href = "https://dotgo.vignoli.dev.br/personalInfoRegister";
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

    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", nextStep);

    const clientRoleButton = document.getElementById("clientRoleButton");
    clientRoleButton.addEventListener("click", registerClient)

    const serviceHolderRoleButton = document.getElementById("serviceHolderRoleButton");
    serviceHolderRoleButton.addEventListener("click", registerServiceHolder);
}

window.addEventListener("load", main);