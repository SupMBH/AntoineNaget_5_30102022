// Cette page requiert 2 fonctionnalités:
// - Message de confirmation avec remerciements
// - Indication du numéro de commande
//
//-> Pour ce faire on crée ce fichier .JS nommé "confirmation" selon l'intitulé visible sur le HTML  
//-> Fonction anonyme moteur de page autoappelée
(function() {
  erraseStorage();
  var clefCommande = commandeGetId (); 
  affichageFinDeCommande (clefCommande);
  erraseCommande ();
  animationCommande ();
})()

//-> erraseStorage () Clear sur les storages locaux
function erraseStorage () {
  sessionStorage.clear();
  localStorage.clear();
}

//-> commandeGetId () Recupération du numéro de commande passé sur l'adresse de page hors local
function commandeGetId () {
  return new URL(location.href).searchParams.get("orderId")
}

//-> affichageFinDeCommande () Affichage des confirmation, remerciements et renseignement numéro de commande
function affichageFinDeCommande (clefCommande) {
  document.querySelector("#orderId").innerHTML = `<br><br>${clefCommande}<br><br>Toute l'équipe de Kanap vous remercie, et vous souhaite bonne reception de votre commande :)<br>...à bientôt !`;
}

//-> erraseCommande () Kill de la clef de commande
function erraseCommande () {
  clefCommande = undefined;
}

//-> animationCommande() cosmétique sur l'affichage 
function animationCommande () {
  document.querySelector(".confirmation p").style.color = "#3d424f";
  document.querySelector(".confirmation").style.transform = "rotateX(740deg)";
  document.querySelector(".confirmation").style.transition = "all 3s ease-in-out";
}