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

function getWeatherStorage () {
    console.log("Récupéré du localStorage: ");
    let dataWeather = JSON.parse(localStorage.getItem("data"));
    console.log(dataWeather);
    }

getWeatherStorage();

