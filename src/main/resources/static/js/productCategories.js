function handleCategoryClick(event, categoryId) {

    const nextButton = document.getElementById("nextButton");

    const allCategoryItems = document.querySelectorAll('.categorie-img');
    allCategoryItems.forEach(item => {
        item.classList.remove('selected');
    });

    event.currentTarget.classList.add('selected');

    localStorage.setItem('userSelectedCategoryId', categoryId);

    nextButton.disabled = false;
    
}

function nextStep() {
    window.location.href = "https://dotgo.vignoli.dev.br/productSubcategories";
}

function returnWindow() {
    history.back();
}

function displayCategories(category) {

    const categoriesContainer = document.getElementById("categories-list");

    if (!categoriesContainer) {
        console.error("Elemento com id 'categories-list' não foi encontrado no DOM.");
        return;
    }

    const categorieItem = document.createElement('div');
    categorieItem.className = 'categorie-item';

    const categorieImgDiv = document.createElement('div');
    categorieImgDiv.className = 'categorie-img';

    categorieImgDiv.addEventListener('click', (event) => handleCategoryClick(event, category.id))

    const imgElement = document.createElement('img');
    imgElement.src = category.iconUrl; 
    imgElement.alt = "Ícone da categoria " + category.name; 

    const spanElement = document.createElement('span');
    spanElement.textContent = category.name;

    categorieImgDiv.appendChild(imgElement);
    categorieImgDiv.appendChild(spanElement);

    categorieItem.appendChild(categorieImgDiv);

    categoriesContainer.appendChild(categorieItem);
}

function getCategories() {
    try {
        fetch("/categories" )
            .then((response) => response.json())
            .then((data) => {
                data.forEach(category => {
                    displayCategories(category);
                });
            });
    } catch (error) {
        console.error("Falha ao buscar categorias:", error);
    }    
}

function main() {
    getCategories();

    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", returnWindow);

    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", nextStep);

}

window.addEventListener("load", main);