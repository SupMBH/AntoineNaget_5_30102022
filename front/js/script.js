// Cette page requiert 2 fonctionnalités:
// - Articles à vendre en présentation dynamique à tirer depuis l'API [http://localhost:3000/api/products donnée en spécifications p3]
// - Produits à afficher de manière tripartite Image/nom/description
//
//-> Pour ce faire on crée ce fichier .JS nommé "script" selon l'intitulé visible sur le HTML
//-> Mise en place d'une fonction cadre moteur de page, sans nom & asyncrone, autoapellée, pour ne pas avoir de variables au global et qui va appeler la fonction récupération, puis la fonction affichage, et boucler
//-> Mise en place de la fonction getCanapes pour tracter les produits de l'API, les convertir en Json, les dénomer "canapes", poser un base case error en catch.
//-> Mise en place de la fonction affichageCanapes pour afficher les canapés

(async function() {
  const canapes = await getCanapes();
  for (canape of canapes) {affichageCanapes(canape)}
})()

function getCanapes() {
  return fetch("http://localhost:3000/api/products")
  .then(function(canape){return canape.json()})
  .catch(function(error){document.querySelector(".titles").innerHTML = "<h4>Mais où sont passés nos canapés ?.. Il y a eu un problème réseau :( </h4>";
    console.log("404 API Inaccessible:" + error);})
}

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
