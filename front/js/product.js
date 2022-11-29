// Cette page requiert 5 fonctionnalités:
// - Détail du produit cliqué en présentation dynamique
// - Page accueil -> Page produit sans local storage pour éviter que le prix des articles soit stocké en local
// - Selection QTE + COULEUR
// - Ajout Panier
// - Impossibilité d'ajouter sans QTE et Couleur ou QTE>100 
//
//-> Pour ce faire on crée ce ficher .JS nommé "product" selon l'intitulé visible sur le HTML 
//-> Mise en place fonction cadre moteur de page, sans nom & asyncrone, autoapellée
(async function() {
  const canapeId = getCanapeId();
  const canape = await getCanape(canapeId);
  focaleCanape(canape);
  constructorProduit(canapeId);  
})()

//-> Mise en place fonction getCanapeId () de récupération de l'Id produit sans local storage, par URL searchParams
function getCanapeId() {
  return new URL(location.href).searchParams.get("_id")
}

//-> Mise en place fonction getCanape () pour tirer le produit sélectionné en Id depuis l'Api
function getCanape(canapeId) {
  return fetch(`http://localhost:3000/api/products/${canapeId}`)
  .then(function(canape){return canape.json()})
  .catch(function(error){document.querySelector(".item").innerHTML = "<h4>Mais où est passé notre joli canapé ?.. Il y a eu un problème réseau :( </h4>";console.log("404 API Inaccessible:" + error);})
}

//-> Mise en place fonction focaleCanape () pour afficher le produit avec ses couleurs bouclées
function focaleCanape(canape) {
  const imageAlt = document.querySelector(".item__img");
  const titre = document.querySelector("#title");
  const prix = document.querySelector("#price");
  const description = document.querySelector("#description");
  const couleurOption = document.querySelector("#colors");
    imageAlt.innerHTML = `<img src="${canape.imageUrl}" alt="${canape.altTxt}">`;
    titre.textContent = `${canape.name}`;
    prix.textContent = `${canape.price}`;
    description.textContent = `${canape.description}`;
    for (let couleur of canape.colors) {couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;}
}

//-> Mise en place fonction constructorProduit () pour fabriquer la clef produit si l'ordre est valide orderValid (),
// et la créer et pousser en LocalStorage ou modif QTe si elle existe déjà 
function constructorProduit (canapeId) {  
  const button = document.getElementById("addToCart")
  button.addEventListener("click", (e) => {    
    const colors = document.getElementById("colors").value
    let quantity = document.getElementById("quantity").value
    const nouveauKanap = {
      key: canapeId + "|" + colors,
      quantity: Number(quantity),
    }
  orderValid(colors, quantity, nouveauKanap)
})

function orderValid(colors, quantity, nouveauKanap) {
  if (colors === "") {
    alert("Ne voudiez-vous pas que votre Kanap ait une belle couleur ?")
    return false
  }
  if (quantity > 100 || quantity <= 0) {
    alert("Combien de Kanap voudiez-vous entre 1 et 100 ?")
    return false
  } else {
    ajoutNouveauKanap(nouveauKanap)
  }
}

function ajoutNouveauKanap(nouveauKanap) {   
  let futurKey = []
  futurKey = localStorage.getItem('cartItems')
  futurKey = JSON.parse(futurKey)  
  if (futurKey == null) {    
    let newKey = [nouveauKanap]    
    localStorage.setItem('cartItems', JSON.stringify(newKey));    
    animationVente ();
  }  
  else {    
    let keyNonPresente = false
      for (const kanapDejaPresentStorage of futurKey) {
          if (kanapDejaPresentStorage.key === nouveauKanap.key) {                        
            const nouvelleQuantiteDeKanaps = kanapDejaPresentStorage.quantity + nouveauKanap.quantity
              if(nouvelleQuantiteDeKanaps <100){
              kanapDejaPresentStorage.quantity = nouvelleQuantiteDeKanaps              
              localStorage.setItem('cartItems', JSON.stringify(futurKey));              
              animationVente ();
              return true}
              else{
                alert("La quantité maximale est déjà atteinte")
                return true
              }
          }
      }
      if (keyNonPresente === false) {
        futurKey.push(nouveauKanap)
        localStorage.setItem('cartItems', JSON.stringify(futurKey));        
        animationVente ();
      }
  }
}

//Cosmétique: animationvente + couleur
function animationVente () {
  document.querySelector("#addToCart").style.color = `${document.getElementById("colors").value}`;
  document.querySelector("#addToCart").textContent = "Je suis dans le panier ! :)";
  document.querySelector("#addToCart").style.transform = "rotateX(360deg)";
  document.querySelector("#addToCart").style.transition = "all 0.5s ease-in-out";
  
  document.querySelector("#colors").addEventListener("input", (ecouteCouleur) => {  
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  document.querySelector("#addToCart").style.transform = "rotateX(-360deg)";
  document.querySelector("#addToCart").style.transition = "all 0.5s ease-in-out";});  
  document.querySelector('input[id="quantity"]').addEventListener("input", (ecouteQuantite) => {  
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  document.querySelector("#addToCart").style.transform = "rotateX(-360deg)";
  document.querySelector("#addToCart").style.transition = "all 0.5s ease-in-out";});  
}
}