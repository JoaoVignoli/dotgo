
function registerAddress() {
    const cep = document.getElementById("cep");
    const street = document.getElementById("street");
    const neighborhood = document.getElementById("neighborhood");
    const city = document.getElementById("city"); 
    const state = document.getElementById("state"); 
    const addressNumber = document.getElementById("addressNumber"); 
    const complement = document.getElementById("complement");

    const addressData = {
        "cep": cep.value,
        "street": street.value,
        "neighborhood": neighborhood.value,
        "city": city.value,
        "state": state.value,
        "addressNumber": addressNumber.value,
        "complement": complement.value
    }
}

function personalInfoRegister() {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const taxId = document.getElementById("taxId");
    const phoneNumber = document.getElementById("phoneNumber");
    const password = document.getElementById("password");
    const birthday = document.getElementById("birthday");

    const userData = {
        "role": localStorage.getItem("userRole"),
        "name": name.value,
        "email": email.value,
        "taxId": taxId.value,
        "phone": phoneNumber.value,
        "password": password.value,
        "birthday": birthday.value
    }

    fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
    .then((data) => data.json())
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
        alert("Erro ao cadastrar dados")
    });
}

function returnWindow() {
    history.back();
}

function nextStep() {
    switch (window.location.pathname) {
        case "/registerRole":
            console.log("Funciona");
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
            if (localStorage.getItem("userRole") == "SERVICE_HOLDER") {
                window.location.href = "https://dotgo.vignoli.dev.br/newProduct";
            } else {
                window.location.href = "https://dotgo.vignoli.dev.br/home";
            }
            break;
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

function main() {

    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", returnWindow);

    const nextButton = document.getElementById("nextButton");
    nextButton?.addEventListener("click", nextStep);

    const clientRoleButton = document.getElementById("clientRoleButton");
    clientRoleButton?.addEventListener("click", registerClient)

    const serviceHolderRoleButton = document.getElementById("serviceHolderRoleButton");
    serviceHolderRoleButton?.addEventListener("click", registerServiceHolder);

    const openGalary = document.getElementById("openGalary");
    const inputImagem = document.getElementById("galaryPhoto");
    openGalary?.addEventListener("click", () => {
        inputImagem.click();
    });

    inputImagem?.addEventListener("change", () => {
        const file = inputImagem.files[0];

        document.getElementById("photoExibition").src = URL.createObjectURL(file);
    });


}

window.addEventListener("load", main);