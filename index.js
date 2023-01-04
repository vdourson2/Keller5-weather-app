import{displayArraysWeather, createArraysWeather} from "./createDisplayArrWeather.js"

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
        
        


