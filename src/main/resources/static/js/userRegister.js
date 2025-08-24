
async function registerProfilePicture() {
    const inputImagem = document.getElementById("galaryPhoto")
    const file = inputImagem.files[0];
    const formData = new FormData();
    formData.append("picture", file);
    formData.append("userId", localStorage.getItem("userId"));

    const response = await fetch("/users/upload", {
        method: "POST",
        body: formData
    })

    return response.status;
}

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
        "complement": complement.value,
        "userId": localStorage.getItem("userId")
    }

    console.log(addressData);

    fetch("/address", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
    })
    .then((data) => data.json())
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    });
}

async function personalInfoRegister() {
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
        "birthday": new Date(birthday.value).toISOString()
    }

    console.log(userData)


    const response = await fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })

    const json = await response.json();

    return json.id;
}

function returnWindow() {
    history.back();
}

async function nextStep() {
    switch (window.location.pathname) {
        case "/register":
            window.location.pathname = "/register/personal";
            break;
        case "/register/personal":
            const userId = await personalInfoRegister();
            localStorage.setItem("userId", userId);
            window.location.pathname = "/register/address";
            break;
        case "/register/address":
            registerAddress();
            window.location.pathname = "/register/profile-photo";
            break;
        case "/register/profile-photo":
            const status = await registerProfilePicture();
            if (status == 201) {
                if (localStorage.getItem("userRole") == "SERVICE_HOLDER") {
                window.location.pathname = "/register/products";
            } else {
                window.location.pathname = "/";
            }
            }
            console.log(status)
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

function loadSpeciality() {
    const speciality = localStorage.getItem("userRole");
    const specialityContainer = getElementById("specialityContainer")

    if (speciality == "CLIENT") {
        specialityContainer.style.display = "none";
    } else {
        specialityContainer.style.display = "flex";
    }
}

function main() {

    const speciality = document.getElementById(localStorage.getItem("userRole"));
    speciality.addEventListener("load", loadSpeciality)

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