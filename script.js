//Fonction de calcul des températures min et max d'un tableau.
//Cette fonction prend comme paramètre un tableau de températures,
//et renvoie un tableau contenant 3 données : la première est la t°min, 
//la deuxième est la t°max, et la troisième indique si le min est égal au max. 
function getMinMax(temp){
    let MinMax = [];
    let min = temp[0];
    let max = temp[0];
    let nb = 2;    
    for (let t of temp){
        if (t<min) {
            min = t;
        } else if(t>max){
            max = t;
        }
    }
    if (min == max){
        nb = 1
    }
    MinMax.push(min);
    MinMax.push(max);
    MinMax.push(nb)
    return MinMax;
};

//Fonction d'extraction de deux icones de weather en matinée et en fin d'après-midi
//Cette fonction prend comme paramètre un tableau d'icones
//et renvoie un tableau contenant 3 données : l'icone de matinée, l'icone d'après-midi
//et un paramètre indiquant si il s'agit de la même icone
function getTwoIcons(icons){
    let twoIcons = [];
    let nb = 2;

    if (icons.length > 5){
        twoIcons.push(icons[icons.length - 6]);
        twoIcons.push(icons[icons.length - 3]);
    } else if ((icons.length == 5)||(icons.length == 4)){
        twoIcons.push(icons[0]);
        twoIcons.push(icons[icons.length - 3]);
    } else {
        twoIcons.push(icons[0]);
        twoIcons.push(icons[icons.length-1]);
    }

    if (twoIcons[0] == twoIcons[1]){
        nb = 1;
    }

    twoIcons.push(nb)
    return twoIcons
};

//Affichage des données météo récupérées dans data, jour après jour, 
//sous forme de synthese journalière d'une part,
//et toutes les 3 heures par jour d'autre part.
function displayweatherByHour (data){
    const daysContainer = document.querySelector(".synthese");
    const daysDetailedContainer = document.querySelector(".previsions");
    //initialisation de la variable day qui permettra de repérer quand on passe au jour suivant
    let previsionDate = new Date(data.list[0].dt*1000);
    previsionDate.setHours(previsionDate.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
    let day  = (previsionDate.getDate() - 1);
    let i = 0
    let weekdayForSynthese = previsionDate.toLocaleString("fr-FR",{weekday:"long"});
    let temperatures = [];
    let icons = [];
    //Création des zones HTML pour chaque prévision de la liste et ajout de celles-ci dans le bon jour :
    for (let li of data.list){
        let currentPrevisionDate = new Date(li.dt*1000);
        currentPrevisionDate.setHours(currentPrevisionDate.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
        //Créer un nouveau jour :
        if (currentPrevisionDate.getDate() != day){            
            //Créer un nouvel encart avec le résumé du jour précédent 
            //à la fin d'un jour, avant de passer au suivant :
            if (temperatures.length > 0){
                let twoIcons = getTwoIcons(icons);
                let MinMax = getMinMax(temperatures);
                icons.splice(0,icons.length);
                temperatures.splice(0,temperatures.length);
                const byDay = `
                    <div class="synthese__day">
                        <h4 class="synthese__weekday">${weekdayForSynthese}</h4>
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
                daysContainer.innerHTML += byDay;
                //Si les valeurs de température min et max ou les icones sont identiques
                //ne pas afficher la deuxième
                if(twoIcons[2] == 1){
                    daysContainer.lastElementChild.querySelector(".synthese__icon--filtre").style.display = "none";
                }
                if(MinMax[2] == 1){
                    daysContainer.lastElementChild.querySelector(".synthese__temperature--filtre").style.display = "none";
                }
            }
            day += 1;
            i += 1;
            if (i>5) break; //S'arrêter à la fin du 4ème jour après le jour actuel
            //Créer un zone dans laquelle les données par heure de la journée seront insérées,
            const byDayDetailed = `
                <div class="previsions__day">
                    <h4 class="previsions__weekday">${currentPrevisionDate.toLocaleString("fr-FR",{weekday:"long"})}</h4>
                    <div class="previsions__divHours"></div>
                </div>
            `;
            daysDetailedContainer.innerHTML += byDayDetailed;   
        }
        //Ajout des données de l'heure dans les tableaux de températures et d'icones d'une journée
        //et enregistrement du weekday de cette journée.
        temperatures.push(li.main.temp);
        icons.push(li.weather[0].icon);
        weekdayForSynthese = currentPrevisionDate.toLocaleString("fr-FR",{weekday:"long"});
        //Créer un zone pour la prévision à l'heure donnée, et la mettre dans la div du jour courant
        const byHours = `
            <div class="previsions__generalParHeure">
                <p class="previsions__heure">${currentPrevisionDate.getHours()}h</p>
                <img class="previsions__icone" src=" http://openweathermap.org/img/wn/${li.weather[0].icon}@2x.png" alt="icone de météo"/>
                <p class="previsions__t">${Math.round(li.main.temp)}°</p>
                <p class="previsions__descr">${li.weather[0].description}</p>
            </div>
        `;
        daysDetailedContainer.lastElementChild.querySelector(".previsions__divHours").innerHTML += byHours;
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
        displayweatherByHour(json);
    }
    catch(error) {
        console.log('Erreur : impossible de récupérer les données')
    }
}

//Récupération des données de localStorage
// function getWeatherOnClick () {
//     let dataWeather = JSON.parse(localStorage.getItem("data"));
//     displayweatherByHour(dataWeather);
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
        
        


