//Formulaire d'encodage de la ville

//Affichage des données météo récupérées, jour après jour, toutes les 3 heures
function displayweatherByHour (data){
    const daysContainer = document.querySelector(".previsions");
    //initialisation de la variable day qui permettra de séparer les différents jours
    let previsionDate = new Date(data.list[0].dt*1000);
    previsionDate.setHours(previsionDate.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
    let day  = (previsionDate.getDate() - 1);
    let i = 0
    //Création des zones HTML pour chaque prévision de la liste
    for (let li of data.list){
        let currentPrevisionDate = new Date(li.dt*1000);
        currentPrevisionDate.setHours(currentPrevisionDate.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
        let currentDay  = currentPrevisionDate.getDate();
        let currentHour = currentPrevisionDate.getHours();
        //Si on passe au jour suivant, créer une nouvelle div pour le jour courant
        if (currentDay != day){
            day += 1;
            i += 1;
            if (i>5) break;
            const byDay = `
                <div class="previsions__day">
                    <h4 class="previsions__weekday">${currentPrevisionDate.toLocaleString("fr-FR",{weekday:"long"})}</h4>
                    <div class="previsions__divHours"></div>
                </div>
            `;
            daysContainer.innerHTML += byDay;
        }
        //Créer un zone pour la météo à l'heure donnée, et la mettre dans la div du dernier jour courant
        const byHours = `
            <div class="previsions__generalParHeure">
                <p class="previsions__heure">${currentHour}h</p>
                <img class="previsions__icone" src=" http://openweathermap.org/img/wn/${li.weather[0].icon}@2x.png" alt="icone de météo"/>
                <p class="previsions__t">${Math.round(li.main.temp)}°</p>
                <p class="previsions__descr">${li.weather[0].description}</p>
            </div>
        `;
        daysContainer.lastElementChild.querySelector(".previsions__divHours").innerHTML += byHours;
    }
}        

//Récupération des données météo de l'API OpenWeather
async function getWeatherOnClick () {
    try {
        console.log("???");
        const response = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=50.62&lon=4.56&lang=fr&appid=13b1572aa8cbef567b34dcfca12134a7&units=metric");
        const json = await response.json();
        // localStorage.setItem("data",JSON.stringify(json));
        displayweatherByHour(json);
    }
    catch(error) {
        console.log('Erreur : impossible de récupérer les données')
    }
}

//Récupération des données de localStorage
// function getWeatherOnClick () {
//     let dataWeather = JSON.parse(localStorage.getItem("data"));
//     console.log("Récupéré du localStorage: ");
//     console.log(dataWeather);
//     return dataWeather
//     }

let data = getWeatherOnClick();
        
        


