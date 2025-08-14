let selectedCategoryId = null;

function handleCategoryClick(event, categoryId) {

    const allCategoryItems = document.querySelectorAll('.categorie-item');
    allCategoryItems.forEach(item => {
        item.classList.remove('selected');
    });

    event.currentTarget.classList.add('selected');

    selectedCategoryId = categoryId;

    console.log("Categoria selecionada! ID:", selectedCategoryId);
}

function returnWindow() {
    window.location.href = "https://dotgo.vignoli.dev.br/newProduct"; 
}

function displayCategories(category) {
    console.log("Carregando categoria: " + category.name);

    const categoriesContainer = document.getElementById("categories-list");

    if (!categoriesContainer) {
        console.error("Elemento com id 'categories-list' não foi encontrado no DOM.");
        return;
    }

    const categorieItem = document.createElement('div');
    categorieItem.className = 'categorie-item';

    categorieItem.addEventListener('click', (event) => handleCategoryClick(event, category.id))

    const categorieImgDiv = document.createElement('div');
    categorieImgDiv.className = 'categorie-img';

    const imgElement = document.createElement('img');
    imgElement.src = category.iconUrl; 
    imgElement.alt = `Ícone da categoria ${category.name}`; 

    const spanElement = document.createElement('span');
    spanElement.textContent = category.name;

    categorieImgDiv.appendChild(imgElement);
    categorieImgDiv.appendChild(spanElement);

    categorieItem.appendChild(categorieImgDiv);

    categoriesContainer.appendChild(categorieItem);
}

function getCategories() {
    try {
        console.log("Iniciando requisição das categorias.");
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

    const returnButton = document.getElementById("botaoRetorno")
    returnButton.addEventListener("click", returnWindow);
}

window.addEventListener("load", main);