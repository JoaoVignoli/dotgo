async function createProduct() {
    const productName = document.getElementById("product-name");
    const productDescription = document.getElementById("product-description");
    const productPrice = document.getElementById("product-value");
    const productTime = document.getElementById("product-time");
    const productAutoApprove = document.getElementById("auto-approve");
    const productPriceToBeAgreed = document.getElementById("value-tbd");
    const productReceiveAttachments = document.getElementById("receive-attachments");
    const productTimeToBeAgreed = document.getElementById("time-tbd");
    const productPicture = document.getElementById("selectPicture");

    const formData = new FormData();

    formData.append("name", productName.value);
    formData.append("description", productDescription.value);
    formData.append("price", productPrice.value);
    formData.append("estimatedTime", productTime.value);
    formData.append("receiveAttachments", productReceiveAttachments.value);
    formData.append("autoApprove", productAutoApprove.value)
    formData.append("priceToBeAgreed", productPriceToBeAgreed.value);
    formData.append("timeToBeAgreed", productTimeToBeAgreed.value);
    formData.append("subcategoryId", localStorage.getItem("userSelectedSubcategoryId"));
    formData.append("serviceHolderId", localStorage.getItem("userId"));

    if (productPicture.files.length > 0) {
        Array.from(productPicture.files).forEach(file => {
            formData.append('pictures', file);
        });
    }


    const response = await fetch("/products", {
        method: "POST",
        body: formData
    })

    return response.status;

}

function hideTimeInput() {
    const checkBoxTime = document.getElementById("time-tbd");
    const containerTime = document.getElementById("product-time")

    containerTime.disabled = this.checked;

    if (this.checked) {
        containerTime.value = 0;
    }
}

function hideValueInput() {
    const checkBoxValue = document.getElementById("value-tbd");
    const containerValue = document.getElementById("product-value")

    containerValue.disabled = this.checked;

    if (this.checked) {
        containerValue.value = 0.00;
    }

}

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
    window.location.pathname = "/register/products/category";
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

    const hideValue = document.getElementById("value-tbd");
    hideValue.addEventListener('change', hideValueInput);

    const hideTime = document.getElementById("time-tbd");
    hideTime.addEventListener('change', hideTimeInput);

    const createProductButton = document.getElementById("createdProduct");
    createProductButton.addEventListener("click", createProduct);

    const openGalary = document.getElementById("openGalary");
    const selectPicture = document.getElementById("selectPicture")
    openGalary?.addEventListener("click", () => {
        selectPicture.click();
    })

    selectPicture.addEventListener("change", () => {
        const file = selectPicture.files[0];
        const addPicture = document.getElementById("addPicture");
        const exibitionPicture = document.getElementById("exibitionPicture");
        addPicture.style.display = "none";
        exibitionPicture.style.display = "flex";
        document.getElementById("exibitionPicture").src = URL.createObjectURL(file);
    })
}

window.addEventListener("load", main);