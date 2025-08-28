let productListSize = 0;

function createSvgIcon(config, paths) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgIcon = document.createElementNS(svgNS, "svg");

    // Aplica todas as configurações (width, height, viewBox, etc.)
    for (const attr in config) {
        svgIcon.setAttribute(attr, config[attr]);
    }

    // Cria e anexa cada path
    paths.forEach(pathData => {
        const path = document.createElementNS(svgNS, "path");
        for (const attr in pathData) {
            path.setAttribute(attr, pathData[attr]);
        }
        svgIcon.appendChild(path);
    });

    return svgIcon;
}

function createEditIcon() {
    const editSvg = createSvgIcon(
        { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "#1A1A1A" },
        [
            { d: "M21.5756 6.61315L17.3869 2.42347C17.2128 2.24928 17.006 2.1111 16.7785 2.01682C16.551 1.92255 16.3071 1.87402 16.0608 1.87402C15.8145 1.87402 15.5706 1.92255 15.3431 2.01682C15.1155 2.1111 14.9088 2.24928 14.7347 2.42347L3.17438 13.9847C2.99963 14.1583 2.86109 14.3649 2.76679 14.5924C2.67248 14.82 2.62429 15.064 2.62501 15.3103V19.5C2.62501 19.9973 2.82255 20.4742 3.17418 20.8259C3.52581 21.1775 4.00273 21.375 4.50001 21.375H8.68969C8.93601 21.3757 9.18001 21.3275 9.40756 21.2332C9.63511 21.1389 9.84168 21.0004 10.0153 20.8257L21.5756 9.2644C21.9271 8.91279 22.1246 8.43596 22.1246 7.93878C22.1246 7.4416 21.9271 6.96477 21.5756 6.61315ZM8.53126 19.125H4.87501V15.4688L12.75 7.59378L16.4063 11.25L8.53126 19.125ZM18 9.65628L14.3438 6.00003L16.0631 4.28065L19.7194 7.9369L18 9.65628Z" }
        ]
    )
    return editSvg;
}

function createTrashIcon() {
    const trashSvg = createSvgIcon(
        { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "#1A1A1A" },
        [
            { d: "M21.5756 6.61315L17.3869 2.42347C17.2128 2.24928 17.006 2.1111 16.7785 2.01682C16.551 1.92255 16.3071 1.87402 16.0608 1.87402C15.8145 1.87402 15.5706 1.92255 15.3431 2.01682C15.1155 2.1111 14.9088 2.24928 14.7347 2.42347L3.17438 13.9847C2.99963 14.1583 2.86109 14.3649 2.76679 14.5924C2.67248 14.82 2.62429 15.064 2.62501 15.3103V19.5C2.62501 19.9973 2.82255 20.4742 3.17418 20.8259C3.52581 21.1775 4.00273 21.375 4.50001 21.375H8.68969C8.93601 21.3757 9.18001 21.3275 9.40756 21.2332C9.63511 21.1389 9.84168 21.0004 10.0153 20.8257L21.5756 9.2644C21.9271 8.91279 22.1246 8.43596 22.1246 7.93878C22.1246 7.4416 21.9271 6.96477 21.5756 6.61315ZM8.53126 19.125H4.87501V15.4688L12.75 7.59378L16.4063 11.25L8.53126 19.125ZM18 9.65628L14.3438 6.00003L16.0631 4.28065L19.7194 7.9369L18 9.65628Z" }
        ]
    )
    return trashSvg;
}

function productsDisplayList(product) {

    const productList = document.getElementById("product-list");

    const productItem = document.createElement("div");
    productItem.classList.add("product-item"); 

    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    const productPicture = document.createElement("img");
    productPicture.classList.add("product-img");
    productPicture.src = product.pictureUrl;
    productPicture.alt = product.name;

    const productDetails = document.createElement("div");
    productDetails.classList.add("product-details");

    const productName = document.createElement("span");
    productName.classList.add("product-name");
    productName.innerText = product.name;

    const productDescription = document.createElement("p");
    productDescription.classList.add("product-description");
    productDescription.innerText = product.description;

    const productPrice = document.createElement("span");
    productPrice.classList.add("product-price")

    if (product.priceToBeAgreed === true) {
        productPrice.innerText = "R$: A combinar";
    } else {
        productPrice.innerText = "R$: " + (product.price || "0,00");
    }

    productDetails.appendChild(productName);
    productDetails.appendChild(productDescription);
    productDetails.appendChild(productPrice);

    productInfo.appendChild(productPicture);
    productInfo.appendChild(productDetails);

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-div");

    const trashButton = document.createElement("button");
    trashButton.classList.add("action-button");
    trashButton.setAttribute("product-id", product.id);
    trashButton.appendChild(createTrashIcon());

    trashButton.addEventListener('click', (event) => {
        deleteProduct(event, product.id)
    })

    const editButton = document.createElement("button");
    editButton.classList.add("action-button");
    editButton.setAttribute("product-id", product.id);
    editButton.appendChild(createEditIcon())

    editButton.addEventListener("click", (event) => {
        showModal(product)
    })

    buttonDiv.appendChild(trashButton);
    buttonDiv.appendChild(editButton);

    productItem.appendChild(productInfo);
    productItem.appendChild(buttonDiv);

    productList.prepend(productItem);

    productListSize += 1;

    updateFinishButtonState();
}

async function deleteProduct(event, productId) {
    event.preventDefault();
    
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            const response = await fetch('/products/' + productId, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Remover da tela com animação
                const productItem = event.target.closest('.product-item');
                productItem.style.opacity = '0.5';
                setTimeout(() => {
                    productItem.remove();
                    productListSize -= 1;
                }, 300);
                
                updateFinishButtonState();

                console.log('Produto excluído com sucesso');
            } else {
                const errorData = await response.json();
                alert('Erro ao excluir: ' + (errorData.message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de comunicação com o servidor');
        }
    }
}

async function createProduct(event) {

    event.preventDefault();
    event.stopPropagation();

    const productName = document.getElementById("product-name").value;
    const productDescription = document.getElementById("product-description").value;
    const productPrice = document.getElementById("product-value").value;
    const productTime = document.getElementById("product-time").value;
    const productAutoApprove = document.getElementById("auto-approve").checked;
    const productPriceToBeAgreed = document.getElementById("value-tbd").checked;
    const productReceiveAttachments = document.getElementById("receive-attachments").checked;
    const productTimeToBeAgreed = document.getElementById("time-tbd").checked;
    const productPictureInput = document.getElementById("selectPicture");

    // 2. Crie o objeto de dados (DTO) que será convertido para JSON
    const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice) || 0,
        estimatedTime: parseInt(productTime) || 0,
        receiveAttachments: productReceiveAttachments,
        autoApprove: productAutoApprove,
        priceToBeAgreed: productPriceToBeAgreed,
        timeToBeAgreed: productTimeToBeAgreed,
        subcategoryId: parseInt(localStorage.getItem("userSelectedSubcategoryId")),
        serviceHolderId: parseInt(localStorage.getItem("userId"))
    };

    try {
            const responseInfos = await fetch("/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        })

        if (responseInfos.status !== 201) {
            const errorData = await responseInfos.json();
            console.error("Falha ao criar as informações do produto:", errorData);
            return;
        }

        const createdProductInfos = await responseInfos.json();
        const productId = createdProductInfos.id;

    
        if (productPictureInput.files.length > 0) { 
            const formData = new FormData();
            formData.append('picture', productPictureInput.files[0]);

            const responsePicture = await fetch("/products/" + productId + "/upload", {
                method: "POST",
                body: formData
            })

            if (responsePicture.ok) {
                const productWithPicture = await responsePicture.json();
                productsDisplayList(productWithPicture);
                closeModal();
            } else {
                const errorData = await responsePicture.json();
                console.error("Falha ao fazer upload da imagem:", errorData);
                productsDisplayList(createdProductInfos);
            }
        } else {
            closeModal();
            productsDisplayList(createdProductInfos);
        }
    } catch (error) {
        console.error("Erro de rede ou na requisição:", error);
    }
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

function closeModal(product = null) {
    const modal = document.getElementById("add-product-modal");
    modal.classList.remove("modal-overlay");

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

function updateFinishButtonState() {

    const finishButton = document.getElementById("finishButton");

    if (productListSize > 0) {
        finishButton.disabled = false; // Habilita o botão
    } else {
        finishButton.disabled = true;  // Desabilita o botão
    }
}


function main() {
    const userId = localStorage.getItem("userId");
    const subcategoryId = localStorage.getItem("userSelectedSubcategoryId");

    if (userId != null && subcategoryId != null) {
        showModal();
    }

    updateFinishButtonState();

    const finishButton = document.getElementById("finishButton")

    if (finishButton) {
        // Inicializar estado do botão
        updateFinishButtonState();
        
        finishButton.addEventListener("click", () => {
            if (!finishButton.disabled) {
                // Opcional: Confirmar antes de sair
                window.location.pathname = "/";
            }
        });
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