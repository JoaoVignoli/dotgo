function addProduct() {
    window.location.href = "https://dotgo.vignoli.dev.br/productCategories";
}

function main() {
    const butonAddProduct = document.getElementById("botaoAdicionarProduto");
    butonAddProduct.addEventListener("click", addProduct)
}

window.addEventListener("load", main);