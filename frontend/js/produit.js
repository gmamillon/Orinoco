const produit = document.getElementById('presProduit');
const lentille = document.getElementById('custom');
const quantite = document.getElementById('quantity')
const btnPanier = document.getElementById('btn');
const articleId = localStorage.getItem('articleId');

var contentRecup = async function () {

    // GET the product selected on the index page.
    var response = await fetch('http://localhost:3000/api/cameras/' + articleId)
    if (response.ok) {
        var data = await response.json();

        // Create all requiered elements. 
        const img = document.createElement('img');
        const nom = document.createElement('h1');
        const prix = document.createElement('p');
        const descriptBlock = document.createElement('p');
        const descriptSpan = document.createElement('span');
        
        // Arrange the elements, add the attributes and set the text.
        produit.appendChild(img);
        produit.appendChild(nom);
        produit.appendChild(prix);
        produit.appendChild(descriptBlock);
        descriptBlock.innerHTML = "Description : <br>";
        descriptBlock.appendChild(descriptSpan);
        img.classList.add('produit__img');
        nom.classList.add('produit__nom');
        prix.classList.add('produit__prix');
        descriptBlock.classList.add('produit__decription');
        img.src = data.imageUrl;
        nom.innerText = data.name;
        prix.innerText = data.price + " ¥";
        descriptSpan.innerText = data.description;

        // For each custom option, create an <option> to be child of the <select>, and then set the value and the text of this one.
        for (var l = 0; data.lenses.length > l; l++) {
            const option = document.createElement('option');
            lentille.appendChild(option);
            option.innerText = data.lenses[l];
            option.value = data.lenses[l];
        }
    }
}

contentRecup()

// Stores three uniques items for the ID, the custom option and the quantity of the selected product when the user add this one to his basket.
btnPanier.addEventListener('click', function (event) {
    event.preventDefault();
    localStorage.setItem('artBasket' + articleId, articleId);
    localStorage.setItem('lense' + articleId, lentille.value);
    localStorage.setItem('quantity' + articleId, quantite.value);
})