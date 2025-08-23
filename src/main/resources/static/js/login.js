async function login() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const userData = {
        "email" : email.value,
        "password" : password.value
    }

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: 'include'
    })

    if (response.status === 200) {
        window.location.pathname = "/home"
    } else {
        const errorLogin = document.getElementById("error-login")
        errorLogin.classList.remove("hidden");
    }
}

function main() {

    const loginButton = document.getElementById("loginButton");
    loginButton.addEventListener("click", login);

}

window.addEventListener("load", main);