const basket = document.getElementById('basket');
const userInfo = document.getElementById('contact');
const contactOrder = JSON.parse(localStorage.getItem('contactOrder'));
const orderId = localStorage.getItem('orderId');

// Puts all ordered products in an array and return this one.
var artList = () => {
    var theList = [];
    for (var i = 0; localStorage.length > i; i++) {
        if (localStorage.key(i).indexOf('artBasket') == 0) {
            theList.push(localStorage.key(i));
        }
    }
    return theList;
}

const orderShow = async function () {
    const artArray = artList();
    const basketTotal = document.createElement('li');
    var total = 0;
    if (artArray.length != 0) {

        // For each selected product, does a GET request of this one to the API.
        for (var i = 0; artArray.length > i; i++) {
            var response = await fetch('http://localhost:3000/api/cameras/' + localStorage.getItem(artArray[i]))
            if (response.ok) {
                var data = await response.json();

                // Create all requiered elements.
                const prodContainer = document.createElement('li');
                const img = document.createElement('img');
                const divInfo = document.createElement('div');
                const prodName = document.createElement('p');
                const prodPrice = document.createElement('p');
                const lense = document.createElement('p');
                const prodQuant = document.createElement('p');
                const spanQuant = document.createElement('span');

                // Arrange the elements, add the attributes, set the text and adjust the total price of the order.
                prodQuant.appendChild(spanQuant);
                divInfo.appendChild(prodName);
                divInfo.appendChild(prodPrice);
                divInfo.appendChild(lense);
                divInfo.appendChild(prodQuant);
                prodContainer.appendChild(img);
                prodContainer.appendChild(divInfo);
                basket.appendChild(prodContainer);
                prodContainer.classList.add('panier__produit');
                img.classList.add('panier__img');
                divInfo.classList.add('panier__info');
                prodName.classList.add('panier__info__elmnt');
                prodPrice.classList.add('panier__info__elmnt');
                const prodId = localStorage.getItem(artArray[i]);
                img.src = data.imageUrl;
                prodName.innerText = data.name;
                var price = Number(localStorage.getItem('quantity' + prodId)) * Number(data.price);
                total = total + price;
                prodPrice.innerText = price.toString() + " ¥";
                lense.innerText = "lentille : " + localStorage.getItem('lense' + prodId);
                prodQuant.innerText = "Quantité : " + localStorage.getItem('quantity' + prodId);
            }}

    // Set the total price in the appropriate element.
    basketTotal.classList.add('panier__produit');
    basket.appendChild(basketTotal);
    basketTotal.innerText = "Total : " + total.toString() + " ¥";

    // Set the user's information in the appropriate element, and finally clear the localStorage.
    userInfo.classList.add('form');
    userInfo.innerHTML = "Identifiant de la commande :<br><br>" + orderId + "<br><br>" + "Commandé par :<br><br>" + contactOrder.firstName + "<br>" + contactOrder.lastName + "<br>" + contactOrder.email + "<br><br>" + "Adresse de livraison :" + "<br><br>" + contactOrder.address +  ", " + contactOrder.city;
    localStorage.clear();
        
    }
}

orderShow()
