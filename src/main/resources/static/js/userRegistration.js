
function personalInfoRegister() {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const taxId = document.getElementById("taxId");
    const phoneNumber = document.getElementById("phoneNumber");
    const password = document.getElementById("password");
    const birthday = document.getElementById("birthday");

    const userData = {
        "name": name.value,
        "email": email.value,
        "taxId": taxId.value,
        "phone": phoneNumber.value,
        "password": password.value,
        "birthday": birthday.value
    }
}

function registerAddress() {

}

function nextStep() {
    switch (window.location.pathname) {
        case "/registerRole":
            window.location.href = "https://dotgo.vignoli.dev.br/personalInfoRegister";
            break;
        case "/personalInfoRegister":
            personalInfoRegister();
            window.location.href = "https://dotgo.vignoli.dev.br/addressRegister";
            break;
        case "/addressRegister":
            registerAddress();
            window.location.href = "https://dotgo.vignoli.dev.br/perfilPhoto";
            break;
        case "/perfilPhoto":
            if ("userRole" == "SERVICE_HOLDER") {
                window.location.href = "https://dotgo.vignoli.dev.br/newProduct";
            } else {
                window.location.href = "https://dotgo.vignoli.dev.br/home";
            }
            break;
        default:
            window.location.href = "https://dotgo.vignoli.dev.br/registerRole";
    }
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