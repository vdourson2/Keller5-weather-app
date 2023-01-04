//Fonction qui vérifie si les valeurs de température min et max et/ou les deux icones 
//de la synthese du dernier jour encodé sont identiques, et qui n'affiche que la première valeur si c'est le cas.
//La fonction prend comme argument une div contenant les jours de synthèse déjà encodés
export const filterIconsTemperatures = (daysContainer) => {
    let icon1 = daysContainer.lastElementChild.querySelector(".synthese__icon");
    let iconFiltre = daysContainer.lastElementChild.querySelector(".synthese__icon--filtre");
    let temperature1 = daysContainer.lastElementChild.querySelector(".synthese__temperature");
    let temperatureFiltre = daysContainer.lastElementChild.querySelector(".synthese__temperature--filtre")
    if (icon1.src == iconFiltre.src){
        iconFiltre.style.display = "none";
    }
    if (temperature1.textContent == temperatureFiltre.textContent){
        temperatureFiltre.style.display = "none";
    }
}