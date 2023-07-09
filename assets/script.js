// Variables
var search = document.querySelector('aside');
var submitCity = document.querySelector('form');
var citySearch = document.querySelector('#citySearch');
var today = document.querySelector('#today');
var h4 = document.querySelector('h4');
var fiveDayForcast = document.querySelector('#fiveDayForcast');

const currentWeather = 'https://api.openweathermap.org/data/2.5/weather?units=imperial';
const fiveDay = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial';
const geocode = 'https://api.openweathermap.org/geo/1.0/direct?q='
var weatherAPIKey = prompt('insert API Key');
var citySearched;
var longitude;
var latitude;
var searchHistory =[];

init();

//search history buttons
search.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        citySearched = event.target.innerHTML;
        renderWeather(citySearched, false);
    }
});

//city search
submitCity.addEventListener('submit', function(event) {
    event.preventDefault();

    citySearched = citySearch.value;
    if (citySearched != ''){
        renderWeather(citySearched, true);
    }
});

//render weather function
async function renderWeather (city, newSearch){
    //First get latitude and longitude
    await fetch (geocode + city + '&limit=1&appid=' + weatherAPIKey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        citySearched = data[0].name;
        latitude = data[0].lat;
        longitude = data[0].lon;
    });

    // Get current day
    await fetch(currentWeather + '&lat=' + latitude + '&lon=' + longitude + '&appid=' + weatherAPIKey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        today.children[0].textContent = citySearched + dayjs().format(' (MM/DD/YYYY)');
        today.children[1].src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
        today.children[2].textContent = `Temp: ${data.main.temp}\xb0F`;
        today.children[3].textContent = `Wind: ${data.wind.speed} MPH`;
        today.children[4].textContent = `Humidity: ${data.main.humidity} %`;
    });

    //Get 5 day forcast using geoloacations
    await fetch(fiveDay + '&lat=' + latitude + '&lon=' + longitude + '&appid=' +weatherAPIKey)
    .then(function(response){
        return response.json();
    })
    .then(function (data) {
        for (var i = 0; i < 5; i++) {
            fiveDayForcast.children[i].children[0].textContent = dayjs().add(i+1, 'day').format(' (MM/DD/YYYY)');
            fiveDayForcast.children[i].children[1].src ='https://openweathermap.org/img/wn/' + data.list[i * 8].weather[0].icon + '@2x.png';
            fiveDayForcast.children[i].children[2].textContent = `Temp: ${data.list[i * 8].main.temp}\xb0F`;
            fiveDayForcast.children[i].children[3].textContent = `Wind: ${data.list[i * 8].wind.speed} MPH`;
            fiveDayForcast.children[i].children[4].textContent = `Humidity: ${data.list[i * 8].main.humidity} %`;
        }
    });
        
    // add search history
        if (newSearch === true) {
            var button = document.createElement('button');
            button.textContent = citySearched;
            button.setAttribute('class', 'btn btn-light history');
            search.appendChild(button);
    
            searchHistory.push(citySearched);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    
    }

    // Initializes with search history on local data
function init() {
    var storedSearches = JSON.parse(localStorage.getItem('searchHistory'));

    if (storedSearches != null) {
        searchHistory = storedSearches;
        
        for (var i = 0; i < storedSearches.length; i++) {
            var button = document.createElement('button');
            button.textContent = storedSearches[i];
            button.setAttribute('class', 'btn btn-light history');
            search.appendChild(button);
        }
    }
}
    
