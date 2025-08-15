function getSubcategories() {

}

function nextStep() {
    window.location.href = "https://dotgo.vignoli.dev.br/newProduct";
}

function returnWindow() {
    window.location.href = "https://dotgo.vignoli.dev.br/productCategories";
}

function main() {
    getSubcategories();

    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", returnWindow);

    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", nextStep);

}

window.addEventListener("load", main);