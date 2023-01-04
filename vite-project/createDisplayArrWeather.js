import{cardSyntheseDay, cardDaysDetailed, cardByHours} from './htmlContent.js'
import{filterIconsTemperatures} from "./filterTempIcons.js"

//Fonction qui prend comme argument un objet contenant deux tableaux
//à afficher dans le DOM
export const displayArraysWeather = (arrays) => {
    let daysContainer = document.querySelector(".synthese");
    let daysDetailedContainer = document.querySelector(".previsions");
    for (let el of arrays.syntheseDays){
        daysContainer.innerHTML += el;
        filterIconsTemperatures(daysContainer);
    }
    for (let el of arrays.daysDetailed){
        daysDetailedContainer.appendChild(el);
    }
}

//Traitement des données météo passées comme argument sous forme d'objet "data".
//La fonction retourne un objet contenant deux tableaux :
//un tableau avec les synthèses par jour et un tableau avec les prévisions détaillées heure par heure pour chaque jour 
export function createArraysWeather (data){
    //initialisation de la variable day qui permettra de repérer quand on passe au jour suivant
    let previsionDate = new Date(data.list[0].dt*1000);
    previsionDate.setHours(previsionDate.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
    let day  = (previsionDate.getDate() - 1);
    let i = 0;
    let weekdayForSynthese = previsionDate.toLocaleString("fr-FR",{weekday:"long"});
    let temperatures = [];
    let icons = [];
    let arraySyntheseDays = [];
    let arrayDaysDetailed = [];
    //Parcourir chaque prévision de la liste :
    for (let li of data.list){
        let currentPrevisionDate = new Date(li.dt*1000);
        currentPrevisionDate.setHours(currentPrevisionDate.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
        //Si le jour courant est un nouveau jour : 
        if (currentPrevisionDate.getDate() != day){            
            //Ajouter un nouvel élément dans le tableau des synthèses, contenant les données du jour qui vient de se terminer
            //(sauf pour l'initialisation du premier jour) :
            if (i > 0){
                arraySyntheseDays.push(cardSyntheseDay(icons, temperatures, weekdayForSynthese)); 
            }
            day += 1;
            i += 1;
            if (i>5) break; //S'arrêter à la fin du 4ème jour après le jour actuel
            //Ajouter un nouvel élément dans le tableau des jours détaillés:
            let divDaysDetailed = document.createElement('div');
            divDaysDetailed.classList.add('previsions__day');
            divDaysDetailed.innerHTML = cardDaysDetailed(currentPrevisionDate);
            arrayDaysDetailed.push(divDaysDetailed);  
        }
        //Pour l'élément courant de la liste, ajout des données
        //dans les tableaux de températures et d'icones de la journée en cours,
        //et enregistrement du weekday de cette journée:
        temperatures.push(li.main.temp);
        icons.push(li.weather[0].icon);
        weekdayForSynthese = currentPrevisionDate.toLocaleString("fr-FR",{weekday:"long"});
        //Ajouter les prévisions détaillées de l'heure courante au dernier élément du 
        //tableau des jours détaillés :
        arrayDaysDetailed[arrayDaysDetailed.length-1].lastElementChild.innerHTML += cardByHours(li, currentPrevisionDate);
    }
    if (i==5){
        arraySyntheseDays.push(cardSyntheseDay(icons, temperatures, weekdayForSynthese)); 
    }
    return {
        syntheseDays : arraySyntheseDays,
        daysDetailed : arrayDaysDetailed,
    };
    
}        