import {getMinMax, getTwoIcons} from './extractTempIcons.js'

//Fonction qui crée un contenu HTML reprenant la synthèse d'un jour
//Prend comme paramètre un tableau des icones du jour, 
//un tableau des températures du jour, et le jour de la semaine
//et renvoie un string contenant les infos de synthèse sous forme HTML
export const cardSyntheseDay = (icons, temperatures, weekday) => {
    let twoIcons = getTwoIcons(icons);
    let MinMax = getMinMax(temperatures);
    icons.splice(0,icons.length);
    temperatures.splice(0,temperatures.length);
    const byDay = `
        <div class="synthese__day">
            <h4 class="synthese__weekday">${weekday}</h4>
            <div class="synthese__icons">
                <img class="synthese__icon" src=" http://openweathermap.org/img/wn/${twoIcons[0]}@2x.png" alt="icone de météo"/>
                <img class="synthese__icon--filtre" src=" http://openweathermap.org/img/wn/${twoIcons[1]}@2x.png" alt="icone de météo"/>
            </div>
            <div class="synthese__minmax">
                <p class="synthese__temperature">${Math.round(MinMax[0])}°</p>
                <p class="synthese__temperature--filtre">${Math.round(MinMax[1])}°</p>
            </div>
        </div>
    `
    return byDay
}


//Fonction qui crée un contenu HTML pour le conteneur des heures détaillées
//Elle prend comme argument la date du jour. 
export const cardDaysDetailed = (date) =>{
    const byDayDetailed = `
            <h4 class="previsions__weekday">${date.toLocaleString("fr-FR",{weekday:"long"})}</h4>
            <div class="previsions__divHours"></div>
    `;
    return byDayDetailed;
}

//Fonction qui crée un contenu HTML pour une heure donnée
//Elle prend 2 arguments : lee détail des données météo pour l'heure,
//et la date du jour. 
export const cardByHours = (li, date) => {
    const byHours = `
        <div class="previsions__generalParHeure">
            <p class="previsions__heure">${date.getHours()}h</p>
            <img class="previsions__icone" src=" http://openweathermap.org/img/wn/${li.weather[0].icon}@2x.png" alt="icone de météo"/>
            <p class="previsions__t">${Math.round(li.main.temp)}°</p>
            <p class="previsions__descr">${li.weather[0].description}</p>
        </div>
    `;
    return byHours;
}