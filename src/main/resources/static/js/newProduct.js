function closeModal() {
    const modal = document.getElementById("add-product-modal");
    modal.classList.remove("modal-overlay");

    localStorage.removeItem("userId");
    localStorage.removeItem("userSelectedSubcategoryId")
    localStorage.removeItem("userSelectedCategoryId")
}

function showModal() {
    const modal = document.getElementById("add-product-modal");
    modal.classList.add("modal-overlay");
}

function returnWindow() {
    history.back();
}

function addProduct() {
    window.location.href = "https://dotgo.vignoli.dev.br/register/products/category";
}

function main() {
    const userId = localStorage.getItem("userId");
    const subcategoryId = localStorage.getItem("userSelectedSubcategoryId");

    if (userId != null && subcategoryId != null) {
        showModal();
    }

    const closeModalButton = document.getElementById("closeModalButton");
    closeModalButton.addEventListener("click", closeModal)

    const butonAddProduct = document.getElementById("addProductButton");
    butonAddProduct.addEventListener("click", addProduct)

    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", returnWindow);
}

window.addEventListener("load", main);