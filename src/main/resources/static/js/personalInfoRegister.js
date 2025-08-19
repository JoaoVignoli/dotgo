function returnWindow() {
    history.back();
}

function nextStep() {
    window.location.href = "https://dotgo.vignoli.dev.br/productSubcategories";
}

function main() {

    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", returnWindow);

    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", nextStep);
}

window.addEventListener("load", main);