// Cette page requiert 2 fonctionnalités:
// - Articles à vendre en présentation dynamique à tirer depuis l'API [http://localhost:3000/api/products donnée en spécifications p3]
// - Produits à afficher de manière tripartite Image/nom/description
//
//-> Pour ce faire on crée ce fichier .JS nommé "script" selon l'intitulé visible sur le HTML
//-> Mise en place d'une fonction cadre moteur de page, sans nom & asyncrone, autoapellée, pour ne pas avoir de variables au global
(async function() {
  const canapes = await recupCanapes();
  for (canape of canapes) {affichageCanapes(canape)}
})()

//-> Mise en place de la fonction recupCanapes pour tracter les produits de l'API, les convertir en Json, les dénomer "canapes", poser un base case error en catch.
function recupCanapes() {
  return fetch("http://localhost:3000/api/products")
  .then(function(canape){return canape.json()})
  .catch(function(error){document.querySelector(".titles").innerHTML = "<h4>Mais où sont passés nos canapés ?.. Il y a eu un problème réseau :( </h4>";
    console.log("404 API Inaccessible:" + error);})
}

//-> Mise en place de la fonction affichageCanapes pour afficher les canapés
function affichageCanapes(canape) {
  const zoneCanape = document.querySelector("#items");
  zoneCanape.innerHTML += `<a href="./product.html?_id=${canape._id}">
    <article>
      <img src="${canape.imageUrl}" alt="${canape.altTxt}">
      <h3 class="productName">${canape.name}</h3>
      <p class="productDescription">${canape.description}</p>
    </article>
  </a>`;
}
