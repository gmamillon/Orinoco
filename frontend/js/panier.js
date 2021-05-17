const basket = document.getElementById('basket');
const form = document.getElementById('validation');

// Puts all selected products in an array and return this one.
var artList = () => {
    var theList = [];
    for (var i = 0; localStorage.length > i; i++) {
        if (localStorage.key(i).indexOf('artBasket') == 0) {
            theList.push(localStorage.key(i));
        }
    }
    return theList;
}

const basketShow = async function () {
    var artArray = artList();
    const basketTotal = document.createElement('li');
    var total = 0;
    if (artArray.length != 0) {

        // For each selected product, does a GET request of this one to the API.
        for (var i = 0; artArray.length > i; i++) {
            var response = await fetch('http://localhost:3000/api/cameras/' + localStorage.getItem(artArray[i]))
            if (response.ok) {
                var data = await response.json();

                // Creates all requiered elements.
                const prodContainer = document.createElement('li');
                const img = document.createElement('img');
                const divInfo = document.createElement('div');
                const prodName = document.createElement('p');
                const prodPrice = document.createElement('p');
                const lense = document.createElement('p');
                const prodQuant = document.createElement('p');
                const spanQuant = document.createElement('span');
                const btnSuppr = document.createElement('button');

                // Arrange the elements, add the attributes, set the text and adjust the total price of the order.
                prodQuant.appendChild(spanQuant);
                divInfo.appendChild(prodName);
                divInfo.appendChild(prodPrice);
                divInfo.appendChild(lense);
                divInfo.appendChild(prodQuant);
                divInfo.appendChild(btnSuppr);
                prodContainer.appendChild(img);
                prodContainer.appendChild(divInfo);
                basket.appendChild(prodContainer);
                prodContainer.classList.add('panier__produit');
                img.classList.add('panier__img');
                divInfo.classList.add('panier__info');
                prodName.classList.add('panier__info__elmnt');
                prodPrice.classList.add('panier__info__elmnt');
                btnSuppr.classList.add('panier__btn');
                const articleId = localStorage.getItem(artArray[i]);
                img.src = data.imageUrl;
                prodName.innerText = data.name;
                lense.innerText = "lentille : " + localStorage.getItem('lense' + articleId);
                prodQuant.innerText = "Quantité : " + localStorage.getItem('quantity' + articleId);
                btnSuppr.innerText = "Supprimer";
                var price = Number(localStorage.getItem('quantity' + articleId)) * Number(data.price);
                prodPrice.innerText = price.toString() + " ¥";
                total = total + price;

                // Remove the product from the basket list and the localStorage, and adjust the total price of the order.
                btnSuppr.addEventListener('click', (event) => {
                    event.preventDefault();
                    total = Number(basketTotal.innerText.slice(8, basketTotal.innerText.length - 2)) - Number(prodPrice.innerText.slice(0, prodPrice.innerText.length -2));
                    basketTotal.innerText = "Total : " + total.toString() +" ¥"
                    localStorage.removeItem('artBasket' + articleId);
                    localStorage.removeItem('custom' + articleId);
                    localStorage.removeItem('quantity' + articleId);
                    basket.removeChild(prodContainer);
                    if (artList().length == 0) {
                        form.innerHTML = "Votre panier est vide."
                    }
                })
            }
        }
    }
    
    // If the basket is empty, indicate "empty basket" instead of the form.
    else {
        form.innerHTML = "Votre panier est vide.";
    }

    // Set the total price in the appropriate element.
    basketTotal.classList.add('panier__produit');
    basket.appendChild(basketTotal);
    basketTotal.innerText = "Total : " + total.toString() + " ¥";
    
    // Build the contact object and the products array to send to the API when the user valid his order.
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const inputs = form.children;

        // Build the contact object.
        var contact = new Object();
        contact.firstName = inputs[1].value;
        contact.lastName = inputs[3].value;
        contact.address = inputs[5].value;
        contact.city = inputs[7].value;
        contact.email = inputs[9].value;
        
        // Build the products array.
        var products = [];
        artArray = artList();

        for (var i = 0; artArray.length > i; i++) {
            products.push(localStorage.getItem(artArray[i]));
        }

        // Combine the contact object and the products array.
        const contactAndProduct = {contact: contact, products: products};
        
        // Declare Regulars expressions to check the form.
        const nameRegex = /^[a-zA-Z-' éèàê]+$/;
        const mailRegex = /^([a-zA-Z0-9-@.]+)@([a-zA-Z0-9-.])+$/;
        const addressRegex = /^[a-zA-Z0-9-' éèàê]+$/;

        // Check if all inputs are filled.
        if (inputs[1].value.trim() == "" || inputs[3].value.trim() == "" || inputs[5].value.trim() == "" || inputs[7].value.trim() == "" || inputs[9].value.trim() == "") {
            alert("Vous devez remplir tout les champs du formulaire pour valider la commande.")
        }
        // Test all inputs values with the regex previously declared and call the postOrder function.
        else if (nameRegex.test(contact.firstName) && nameRegex.test(contact.lastName) && nameRegex.test(contact.city) && addressRegex.test(contact.address) && mailRegex.test(contact.email)) {
            postOrder(contactAndProduct)
        } else {
            alert("Veuillez renseigner les champs du formulaire avec les caractères autorisés pour valider la commande.")
        }
    })
}

const postOrder = async function (data) {
        
    // Post the order object.
    var response = await fetch('http://localhost:3000/api/cameras/order', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (response.ok) {
        var order = await response.json();

        // Store the contact object and redirect to the confirmation page.
        localStorage.setItem('contactOrder', JSON.stringify(order.contact));
        localStorage.setItem('orderId', order.orderId);
        document.location = "confirmation.html";
    }
}

basketShow()