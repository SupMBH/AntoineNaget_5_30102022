// Cette page requiert 2 fonctionnalités:
// - Message de confirmation avec remerciements
// - Indication du numéro de commande
//
//-> Pour ce faire on crée ce fichier .JS nommé "confirmation" selon l'intitulé visible sur le HTML  
//-> Fonction anonyme moteur de page autoappelée
//-> erraseStorage () Clear sur les storages locaux
//-> commandeGetId () Recupération du numéro de commande passé sur l'adresse de page hors local
//-> affichageFinDeCommande () Affichage des confirmation, remerciements et renseignement numéro de commande
//-> erraseCommande () Kill de la clef de commande
//-> animationCommande() cosmétique sur l'affichage 

(function() {
  erraseStorage();
  var clefCommande = commandeGetId (); 
  affichageFinDeCommande (clefCommande);
  erraseCommande ();
  animationCommande ();
})()

function erraseStorage () {
  sessionStorage.clear();
  localStorage.clear();
}

function commandeGetId () {
  return new URL(location.href).searchParams.get("orderId")
}

function affichageFinDeCommande (clefCommande) {
  document.querySelector("#orderId").innerHTML = `<br><br>${clefCommande}<br><br>Toute l'équipe de Kanap vous remercie, et vous souhaite bonne reception de votre commande :)<br>...à bientôt !`;
}

function erraseCommande () {
  clefCommande = undefined;
}

function animationCommande () {
  document.querySelector(".confirmation p").style.color = "#3d424f";
  document.querySelector(".confirmation").style.transform = "rotateX(740deg)";
  document.querySelector(".confirmation").style.transition = "all 3s ease-in-out";
}