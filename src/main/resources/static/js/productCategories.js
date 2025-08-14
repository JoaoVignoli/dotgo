function displayCategories(category) {
    console.log("Carregando categoria: " + category.name);

    const categoriesContainer = document.getElementById("categories-list");

    if (!categoriesContainer) {
        console.error("Elemento com id 'categories-list' não foi encontrado no DOM.");
        return;
    }

    const categorieItem = document.createElement('div');
    categorieItem.className = 'categorie-item';

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
    
}

window.addEventListener("load", main);