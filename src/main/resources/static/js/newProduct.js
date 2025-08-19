function returnWindow() {
    history.back();
}

function addProduct() {
    window.location.href = "https://dotgo.vignoli.dev.br/productCategories";
}

function main() {
    const butonAddProduct = document.getElementById("addProductButton");
    butonAddProduct.addEventListener("click", addProduct)

    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", returnWindow);
}

window.addEventListener("load", main);