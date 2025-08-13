function displayCategories(categories) {
    const categoriesContainer = document.getElementById("categories-list")

    categoriesContainer.innerHTML = '';

    categories.forEach(category => {

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
    });
}

async function getCategories() {
    try {
        const response = await fetch("/categories", {
            method: 'GET',
            headers: {
                'Accept':'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        };

        const categoriesData = await response.json();

        return categoriesData;
    } catch (error) {
        console.error("Falha ao buscar categorias:", error);
        return [];
    }    
}

function main() {

    const categories = getCategories();

    if (categories.length > 0) {
        displayCategories(categories);
    }
}

window.addEventListener("load", main);