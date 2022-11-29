// Cette page requiert 4 fonctionnalités:
// - Affichage du panier
// - Modification dynamique de la QTE
// - Suppression dynamique produit
// - Formulaire de commande correctement rempli (REGEX)
//
//-> Pour ce faire on crée ce fichier .JS nommé "cart" selon l'intitulé visible sur le HTML 
//-> Fonction anonyme autoappelée moteur de page qui run traitementPanier() pour gérer le panier, et formulaire () pour contrôler le formulaire et envoyer la commande
(async function() {
   traitementPanier ();
   formulaire ();  
})()

//-> traitementPanier(): Après splitage de la clef, les articles sont identifiés, récupérés par un fetch et bouclés pour les afficher dans la page avec focalePanier ()
function traitementPanier () {

    let arrayRetraitement = JSON.parse(localStorage.getItem("cartItems"));
    itemsInLocalStorage = [];
    const positionEmptyCart = document.getElementById("cart__items");
        if (arrayRetraitement === null) {
        positionEmptyCart.textContent = "Votre panier est vide";
        } else {
        for (itemKey of arrayRetraitement) {retraitement (itemKey) };
        function retraitement (itemKey) {
            let ancienneKey = itemKey.key;
            let casse = ancienneKey.split('|');
            product= {
                key: ancienneKey,
                id: casse[0],
                color: casse[1],
                quantity: itemKey.quantity,}
            itemsInLocalStorage.push(product);} 
        }
 
    async function focalePanier() {
    const parser = new DOMParser();
    let cartArray = [];    
        if (itemsInLocalStorage === null || itemsInLocalStorage == 0 ) {
        positionEmptyCart.textContent = "Votre panier est vide";
        } else {        
        for (i = 0; i < itemsInLocalStorage.length; i++) {
            const product = await getCanape(itemsInLocalStorage[i].id);
            const totalPriceItem = (product.price *= itemsInLocalStorage[i].quantity);
            cartArray += `
       <article class="cart__item" data-id=${itemsInLocalStorage[i].id}>
       <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="Photographie d'un canapé">
       </div>
       <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
        <h2>${product.name}</h2>
        <p>${itemsInLocalStorage[i].color}</p>
        <p>${totalPriceItem} €</p>
        </div>
        <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input data-id= ${itemsInLocalStorage[i].id} data-color= ${itemsInLocalStorage[i].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${itemsInLocalStorage[i].quantity}>
        </div>
        <div class="cart__item__content__settings__delete">
        <p data-id= ${itemsInLocalStorage[i].id} data-color= ${itemsInLocalStorage[i].color} class="deleteItem">Supprimer</p>
        </div>
        </div>
       </div>
        </article>`;}        
        let totalQuantity = 0;
        let totalPrice = 0;
        for (i = 0; i < itemsInLocalStorage.length; i++) {
            const article = await getCanape(itemsInLocalStorage[i].id);
            totalQuantity += parseInt(itemsInLocalStorage[i].quantity);
            totalPrice += parseInt(article.price * itemsInLocalStorage[i].quantity);
        }
        document.getElementById("totalQuantity").innerHTML = totalQuantity;
        document.getElementById("totalPrice").innerHTML = totalPrice;

        if (i == itemsInLocalStorage.length) {
            const displayBasket = parser.parseFromString(cartArray, "text/html");
            positionEmptyCart.appendChild(displayBasket.body);
            modifQuantite();
            suppressionArticle();
        }
    }
    }
    async function getCanape(productId) {return fetch("http://localhost:3000/api/products/" + productId)
        .then(function (res) {
            return res.json();
        })
        .catch((err) => {            
            console.log("erreur");
        })
        .then(function (response) {
            return response;
        });
    }

    focalePanier();

//-> modifQuantité () et suppression article () permettent de supprimer et modifier dynamiquement les QTE d'article
    function modifQuantite() {
        const quantityInputs = document.querySelectorAll(".itemQuantity");
        quantityInputs.forEach((quantityInput) => {quantityInput.addEventListener("change", (event) => {
        const inputValue = event.target.value;
        const dataId = event.target.getAttribute("data-id");
        const dataColor = event.target.getAttribute("data-color");
        let items = itemsInLocalStorage;
        items = items.map((item, index) => {
            if (item.id === dataId && item.color === dataColor) {item.quantity = inputValue;
                }
                return item;
            });
            if (inputValue > 100) {
                alert("La quantité maximale autorisée est de 100");
                location.reload();
                return;
            }
        let itemsStr = JSON.stringify(items);
        localStorage.setItem("cartItems", itemsStr);
        location.reload();
        });
    });
    }

    function suppressionArticle() {
    const deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach((deleteButton) => {deleteButton.addEventListener("click", (event) => {            
        const deleteId = event.target.getAttribute("data-id");
        const deleteColor = event.target.getAttribute("data-color");
        itemsInLocalStorage = itemsInLocalStorage.filter((element) => !(element.id == deleteId && element.color == deleteColor));            
        localStorage.setItem("cartItems", JSON.stringify(itemsInLocalStorage));
        location.reload();            
        });
    });
    }
}

//-> formulaire () détermine des regex, relève les constantes à écouter selon les regex et permet d'envoyer la commande en cas de conformité en renvoyant à défaut un message err
function formulaire () {   
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");
    let regexNomPrenomVille = /^[a-zA-Z\-çñàéèêëïîôüù ]{2,}$/;
    let regexAdresse = /^[0-9a-zA-Z\s,.'-çñàéèêëïîôüù]{3,}$/;
    let regexEmail = /^[A-Za-z0-9\-\.]+@([A-Za-z0-9\-]+\.)+[A-Za-z0-9-]{2,4}$/;

    firstName.addEventListener("input", (event) => {    
    if (regexNomPrenomVille.test(firstName.value) == false || firstName.value == "") {
        document.getElementById("firstNameErrorMsg").innerHTML = "Prénom invalide";
        return false;
    } else {
        document.getElementById("firstNameErrorMsg").innerHTML = "";
        return true;
    }
    });
    lastName.addEventListener("input", (event) => {    
    if (regexNomPrenomVille.test(lastName.value) == false || lastName.value == "") {
        document.getElementById("lastNameErrorMsg").innerHTML = "Nom invalide";
        return false;
    } else {
        document.getElementById("lastNameErrorMsg").innerHTML = "";
        return true;
    }
    });
    address.addEventListener("input", (event) => {    
    if (regexAdresse.test(address.value) == false || address.value == "") {
        document.getElementById("addressErrorMsg").innerHTML = "Adresse invalide";
        return false;
    } else {
        document.getElementById("addressErrorMsg").innerHTML = "";
        return true;
    }
    });
    city.addEventListener("input", (event) => {    
    if (regexNomPrenomVille.test(city.value) == false || city.value == "") {
        document.getElementById("cityErrorMsg").innerHTML = "Ville invalide";
        return false;
    } else {
        document.getElementById("cityErrorMsg").innerHTML = "";
        return true;
    }
    });
    email.addEventListener("input", (event) => {    
    if (regexEmail.test(email.value) == false || email.value == "") {
        document.getElementById("emailErrorMsg").innerHTML = "Email invalide";
        return false;
    } else {
        document.getElementById("emailErrorMsg").innerHTML = "";
        return true;
    }
    });

    let order = document.getElementById("order");
    order.addEventListener("click", (e) => {    
    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };
    if (
        firstName.value === "" ||
        lastName.value === "" ||
        address.value === "" ||
        city.value === "" ||
        email.value === ""
    ) {
        alert("N'oubliez pas de renseigner vos coordonnées :)");
    } else if (
        regexNomPrenomVille.test(firstName.value) == false ||
        regexNomPrenomVille.test(lastName.value) == false ||
        regexAdresse.test(address.value) == false ||
        regexNomPrenomVille.test(city.value) == false ||
        regexEmail.test(email.value) == false
    ) {
        alert("Pardon, mais êtes-vous sûr d'avoir bien rempli le formulaire ?");
    } else if (  
        itemsInLocalStorage === null || 
        itemsInLocalStorage == 0 
    ) {
        alert("Pardon, mais votre panier est vide !");
    } else {
        let products = [];
        itemsInLocalStorage.forEach((order) => {
            products.push(order.id);
        });
        let pageOrder = {
            contact,
            products
        };             
        fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
                body: JSON.stringify(pageOrder),
            })
            .then((res) => {
                return res.json();
            })
            .then((confirm) => {
                window.location.href = "./confirmation.html?orderId=" + confirm.orderId;                
            })
            .catch((error) => {
                console.log("Erreur :( Merci de bien vouloir ré-essayer");
            });
        }
    });

}