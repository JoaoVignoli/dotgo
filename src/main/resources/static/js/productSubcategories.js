function displaySubcategories(subcategory) {

    const subcategoryList = document.getElementById('subcategoriesList');

    const subcategoryItem           = document.createElement('div');
    const subcategoryImg            = document.createElement('img');
    const containerSubcategoryTitle = document.createElement('div');
    const subcategoryTitle          = document.createElement('span');

    subcategoryItem.className           = 'subcategory-item';
    subcategoryImg.className            = 'subcategory-img';
    containerSubcategoryTitle.className = 'container-subcategory-title';
    subcategoryTitle.className          = 'subcategory-title';

    subcategoryImg.src           = subcategory.iconUrl;
    subcategoryImg.alt           = "Icone da subcategoria " + subcategory.name;
    subcategoryTitle.textContent = subcategory.name;

    containerSubcategoryTitle.appendChild(subcategoryTitle);
    subcategoryItem.appendChild(subcategoryImg);
    subcategoryItem.appendChild(containerSubcategoryTitle);

    subcategoryList.appendChild(subcategoryItem);
    
}

function getSubcategories() {
    const categoryId = localStorage.getItem("userSelectedCategoryId");

    if (categoryId) {
        try {
            fetch("/categories/" + categoryId + "/subcategories" )
                .then((response) => response.json())
                .then((data) => {
                    data.forEach(subcategory => {
                        displaySubcategories(subcategory);
                    });
                });
        } catch (error) {
            console.error("Falha ao buscar subcategorias:", error);
        }    
    }
}

function nextStep() {
    window.location.href = "https://dotgo.vignoli.dev.br/newProduct";
}

function returnWindow() {
    history.back();
}

function main() {
    getSubcategories();

    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", returnWindow);

    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", nextStep);

}

window.addEventListener("load", main);