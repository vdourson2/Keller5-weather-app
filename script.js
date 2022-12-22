//Formulaire d'encodage de la ville


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

//Affichage des données météo récupérées dans data, jour après jour, toutes les 3 heures
function displayweatherByHour (data){
    const daysContainer = document.querySelector(".synthese");
    const daysDetailedContainer = document.querySelector(".previsions");
    //initialisation de la variable day qui permettra de repérer quand on passe au jour suivant
    let previsionDate = new Date(data.list[0].dt*1000);
    previsionDate.setHours(previsionDate.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
    let day  = (previsionDate.getDate() - 1);
    let i = 0
    let currentPrevisionDay = previsionDate.toLocaleString("fr-FR",{weekday:"long"});
    let temperatures = [];
    let icons = [];
    //Création des zones HTML pour chaque prévision de la liste et ajout de celles-ci dans le bon jour
    for (let li of data.list){
        let currentPrevisionDate = new Date(li.dt*1000);
        currentPrevisionDate.setHours(currentPrevisionDate.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
        let currentDay  = currentPrevisionDate.getDate();
        let currentHour = currentPrevisionDate.getHours();
        //Passer au jour suivant
        if (currentDay != day){
            if (temperatures.length > 0){
                let MinMax = getMinMax(temperatures);
                let twoIcons = getTwoIcons(icons);
                temperatures.splice(0,temperatures.length);
                icons.splice(0,icons.length);
                const byDay = `
                    <div class="synthese__day">
                        <h4 class="synthese__weekday">${currentPrevisionDay}</h4>
                        <div class="synthese__icons">
                            <img class="synthese__icon" src=" http://openweathermap.org/img/wn/${twoIcons[0]}@2x.png" alt="icone de météo"/>
                            <img class="synthese__icon" src=" http://openweathermap.org/img/wn/${twoIcons[1]}@2x.png" alt="icone de météo"id="filtreIcon"/>
                        </div>
                        <div class="synthese__minmax">
                            <p class="synthese__temperature">${Math.round(MinMax[0])}</p>
                            <p class="synthese__temperature" id="filtreT">${Math.round(MinMax[1])}</p>
                        </div>
                    </div>
                `
                daysContainer.innerHTML += byDay;
            }
            day += 1;
            i += 1;
            if (i>5) break;
            
            const byDayDetailed = `
                <div class="previsions__day">
                    <h4 class="previsions__weekday">${currentPrevisionDate.toLocaleString("fr-FR",{weekday:"long"})}</h4>
                    <div class="previsions__divHours"></div>
                </div>
            `;
            daysDetailedContainer.innerHTML += byDayDetailed;
        }
        temperatures.push(li.main.temp);
        icons.push(li.weather[0].icon);
        currentPrevisionDay = currentPrevisionDate.toLocaleString("fr-FR",{weekday:"long"});
        //Créer un zone pour la prévision à l'heure donnée, et la mettre dans la div du jour courant
        const byHours = `
            <div class="previsions__generalParHeure">
                <p class="previsions__heure">${currentHour}h</p>
                <img class="previsions__icone" src=" http://openweathermap.org/img/wn/${li.weather[0].icon}@2x.png" alt="icone de météo"/>
                <p class="previsions__t">${Math.round(li.main.temp)}°</p>
                <p class="previsions__descr">${li.weather[0].description}</p>
            </div>
        `;
        daysDetailedContainer.lastElementChild.querySelector(".previsions__divHours").innerHTML += byHours;
    }
}        

//Récupération des données météo de l'API OpenWeather et affichage de celle-ci
// async function getWeatherOnClick () {
//     try {
//         const response = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=50.62&lon=4.56&lang=fr&appid=13b1572aa8cbef567b34dcfca12134a7&units=metric");
//         const json = await response.json();
//         localStorage.setItem("data",JSON.stringify(json));
//         displayweatherByHour(json);
//     }
//     catch(error) {
//         console.log('Erreur : impossible de récupérer les données')
//     }
// }

//Récupération des données de localStorage
function getWeatherOnClick () {
    let dataWeather = JSON.parse(localStorage.getItem("data"));
    displayweatherByHour(dataWeather);
    }

getWeatherOnClick();
        
        


