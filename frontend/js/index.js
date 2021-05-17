const container = document.getElementById('container');

var contentRecup = async function () {

    // GET all products.
    var response = await fetch('http://localhost:3000/api/cameras/')
    if (response.ok) {
        var data = await response.json();

        // For each product, generate an HTML element to show the image, name and price of this one.
        for (var l = 0; data.length > l; l++) {

            // Create all requiered elements.
            const lien = document.createElement('a');
            var product = document.createElement('div');
            const illustration = document.createElement('div');
            const img = document.createElement('img');
            const nom = document.createElement('p');
            const prix = document.createElement('p');

            // Arrange the elements, add the attributes and set the text.
            illustration.appendChild(img);
            product.appendChild(illustration);
            product.appendChild(nom);
            product.appendChild(prix);
            lien.appendChild(product);
            container.appendChild(lien);
            lien.classList.add('product__lien')
            product.classList.add('product');
            illustration.classList.add('product__illustration');
            nom.classList.add('product__info');
            prix.classList.add('product__info');
            lien.href = "produit.html";
            lien.title = data[l].name;
            lien.id = l;
            img.src = data[l].imageUrl;
            img.alt = data[l].name;
            nom.innerText = data[l].name;
            prix.innerText = data[l].price + " ¥";

            // Store the ID of the selected product, furthermore, unstore the previous selected product.
            lien.addEventListener('click', () => {
                localStorage.removeItem('articleId');
                localStorage.setItem('articleId', data[lien.id]._id);
                      
            })
        }
    }
}

contentRecup()
