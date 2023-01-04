import{cardSyntheseDay, cardDaysDetailed, cardByHours} from './htmlContent.js'

//Fonction qui vérifie si les valeurs de température min et max et/ou les deux icones 
//de la synthese du dernier jour encodé sont identiques, et qui n'affiche que la première valeur si c'est le cas.
//La fonction prend comme argument une div contenant les jours de synthèse déjà encodés
const filterIconsTemperatures = (daysContainer) => {
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

//Fonction qui prend comme argument un objet contenant deux tableaux
//à afficher dans le DOM
const displayArraysWeather = (arrays) => {
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
function createArraysWeather (data){
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

//Récupération des données météo de l'API OpenWeather et affichage de celles-ci
async function getWeatherOnClick () {
    let country = input.value;
    document.querySelector('#country').value="";
    document.querySelector('.synthese').innerHTML=""; 
    document.querySelector('.previsions').innerHTML=""; 
    document.querySelector('h1').textContent = `Météo à ${country}`; 
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${country}&lang=fr&appid=13b1572aa8cbef567b34dcfca12134a7&units=metric`);
        const json = await response.json();
        localStorage.setItem("data",JSON.stringify(json));
        displayArraysWeather(createArraysWeather(json));
    }
    catch(error) {
        console.log('Erreur : impossible de récupérer les données')
    }
}

//Récupération des données de localStorage
//function getWeatherOnClick () {
//     let dataWeather = JSON.parse(localStorage.getItem("data"));
//     createArraysWeather(dataWeather);
//     }

//Deux évènements qui appellent la fct getWeatherOnClick
//si on presse la touche enter, ou si on clique sur le bouton.
let button = document.querySelector('button');
let input = document.querySelector('#country');
button.addEventListener('click', getWeatherOnClick);
input.addEventListener('keyup', (e) => {
    if (e.code == "Enter"){
        getWeatherOnClick();
    }
})
        
        


