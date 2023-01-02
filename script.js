//Fonction de calcul des températures min et max d'un tableau.
//Cette fonction prend comme paramètre un tableau de températures,
//et renvoie un tableau contenant 2 données : la première est la t°min, 
//et la deuxième est la t°max.
function getMinMax(temp){
    let MinMax = [];
    let min = temp[0];
    let max = temp[0];
    for (let t of temp){
        if (t<min) {
            min = t;
        } else if(t>max){
            max = t;
        }
    }
    MinMax.push(min);
    MinMax.push(max);
    return MinMax;
};

//Fonction d'extraction de deux icones de weather en matinée et en fin d'après-midi
//Cette fonction prend comme paramètre un tableau d'icones
//et renvoie un tableau contenant 2 données : l'icone de matinée, l'icone d'après-midi
function getTwoIcons(icons){
    let twoIcons = [];
    if (icons.length > 4){
        twoIcons.push(icons[icons.length - 5]);
        twoIcons.push(icons[icons.length - 3]);
    } else if (icons.length == 4){
        twoIcons.push(icons[0]);
        twoIcons.push(icons[icons.length - 3]);
    } else {
        twoIcons.push(icons[0]);
        twoIcons.push(icons[icons.length-1]);
    }
    return twoIcons
};

//Refactor


//Fonction qui crée un contenu HTML reprenant la synthèse d'un jour
//Prend comme paramètre un tableau des icones du jour, 
//un tableau des températures du jour, et le jour de la semaine
//et renvoie un string contenant les infos de synthèse sous forme HTML
const cardSyntheseDay = (icons, temperatures, weekday) => {
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


const cardDaysDetailed = (date) =>{
    const byDayDetailed = `
            <h4 class="previsions__weekday">${date.toLocaleString("fr-FR",{weekday:"long"})}</h4>
            <div class="previsions__divHours"></div>
    `;
    return byDayDetailed;
}

const cardByHours = (li, date) => {
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


//Affichage des données météo récupérées dans data, jour après jour, 
//sous forme de synthese journalière d'une part,
//et toutes les 3 heures par jour d'autre part.
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
    //Création des zones HTML pour chaque prévision de la liste et ajout de celles-ci dans le bon jour :
    for (let li of data.list){
        let currentPrevisionDate = new Date(li.dt*1000);
        currentPrevisionDate.setHours(currentPrevisionDate.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
        //Créer un nouveau jour :
        if (currentPrevisionDate.getDate() != day){            
            //Créer un nouvel encart avec le résumé du jour précédent 
            //à la fin d'un jour, avant de passer au jour suivant (sauf pour l'initialisation au premier jour) :
            if (temperatures.length > 0){
                arraySyntheseDays.push(cardSyntheseDay(icons, temperatures, weekdayForSynthese)); 
            }
            day += 1;
            i += 1;
            if (i>5) break; //S'arrêter à la fin du 4ème jour après le jour actuel
            //Créer un zone dans laquelle les données par heure de la journée seront insérées,
            let divDaysDetailed = document.createElement('div');
            divDaysDetailed.classList.add('previsions__day');
            divDaysDetailed.innerHTML = cardDaysDetailed(currentPrevisionDate);
            arrayDaysDetailed.push(divDaysDetailed);  
        }
        //Ajout des données de l'heure dans les tableaux de températures et d'icones d'une journée
        //et enregistrement du weekday de cette journée.
        temperatures.push(li.main.temp);
        icons.push(li.weather[0].icon);
        weekdayForSynthese = currentPrevisionDate.toLocaleString("fr-FR",{weekday:"long"});
        //Créer un zone pour la prévision à l'heure donnée, et la mettre dans la div du jour courant
        arrayDaysDetailed[arrayDaysDetailed.length-1].lastElementChild.innerHTML += cardByHours(li, currentPrevisionDate);
    }


    const daysContainer = document.querySelector(".synthese");
    const daysDetailedContainer = document.querySelector(".previsions");
    for (let el of arraySyntheseDays){
        daysContainer.innerHTML += el;
         //Si les valeurs de température min et max ou les deux icones sont identiques
        //ne pas afficher la deuxième
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
    for (let el of arrayDaysDetailed){
        daysDetailedContainer.appendChild(el);
    }
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
        createArraysWeather(json);
    }
    catch(error) {
        console.log('Erreur : impossible de récupérer les données')
    }
}

//Récupération des données de localStorage
// function getWeatherOnClick () {
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
        
        


