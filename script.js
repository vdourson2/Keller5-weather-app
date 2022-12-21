//Formulaire d'encodage de la ville


//Récupération des données météo pour la ville choisie

// async function getWeatherOnClick () {
//     try {
//     console.log("???");
//     const response = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=50.62&lon=4.56&cnt=10&lang=fr&appid=13b1572aa8cbef567b34dcfca12134a7&units=metric");
//     const json = await response.json();
//     localStorage.setItem("data",JSON.stringify(json));
//     console.log(json);
//     }
//     catch(error) {
//         console.log('Erreur : impossible de récupérer les données')
//     }
// }

function getWeatherOnClick () {
    let dataWeather = JSON.parse(localStorage.getItem("data"));
    console.log("Récupéré du localStorage: ");
    console.log(dataWeather);
    return dataWeather
    }



//Affichage des données météo récupérées
//let now = new Date();
let data = getWeatherOnClick();

console.log("dt");
console.log(data.list[0].dt);
let previsionHour = new Date(data.list[0].dt*1000);
//On prend comme heure locale du lieu demandé : l'heure UTC de la prévision + le décalage
previsionHour.setHours(previsionHour.getUTCHours() + (data.city.timezone/3600))//heure UTC + décalage de timezone
console.log(data.city.timezone/3600);//1h
console.log(previsionHour.getHours()); //Heure locale
console.log(previsionHour.getDate());//Date locale 





