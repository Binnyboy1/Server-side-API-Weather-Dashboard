// Global variables
// search history as an empty array
var historyArr = [];
// weather api root url
// var apiURL = "";
// api key
var apiKey = "56ad1233636b0bba431cc36ab67b1e36";

// DOM element references
// search form
var searchFormEl = document.querySelector('form');
// search input
var searchInputEl = document.querySelector('input');
// container/section for today's weather
var weatherEl = document.querySelector('#weather');
// container/section for the forecast 
var forecastEl = document.querySelector('#forecast');
// search history container
var searchHistoryEl = document.querySelector('#history');
// submit button
var submitButton = document.querySelector('#submit');


// Function to display the search history list. ✅
function renderSearchHistory() {
    // empty the search history container
    searchHistoryEl.innerHTML = "";
  
    // loop through the history array creating a button for each item
    for (var i = 0; i < historyArr.length; i++) {
        // append to the search history container
        searchHistoryEl.innerHTML += `<button>${historyArr[i]}</button>`;
    }
  }
  
  // Function to update history in local storage then updates displayed history. ✅
  function appendToHistory(search) {
    // push search term into search history array
    historyArr.push(search);
  
    // set search history array to local storage
    localStorage.setItem("history", JSON.stringify(historyArr));
    renderSearchHistory();
  }
  
  // Function to get search history from local storage ✅
  function initSearchHistory() {
    // get search history item from local storage
    var historyItem = JSON.parse(localStorage.getItem("history"));

    // set search history array equal to what you got from local storage
    if (historyItem !== null) {
      for (var i = 0; i < historyItem.length; i++) {
        historyArr[i] = historyItem[i];
      }
      renderSearchHistory();
    }
  }
  
  // Function to display the CURRENT weather data fetched from OpenWeather api. ❌
  function renderCurrentWeather(city, weather) {
    // Store response data from our fetch request in variables
    var temp = weather.main.temp + "°F";
    var wind = weather.wind.speed + " MPH";
    var humidity = weather.main.humidity + "%";
    var iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather.weather[0].icon}.svg`;
  
    weatherEl.innerHTML = "";
    weatherEl.innerHTML += `
    <div id="psuedo-header">
      <h1>${city} (${dayjs(weather.dt * 1000).format('MM/DD/YYYY')})</h1>
      <img src=${iconUrl} class="icon" alt="${weather.weather[0].description}">
    </div>
    <p>Temp: ${temp}</p>
    <p>Wind: ${wind}</p>
    <p>Humidity: ${humidity}</p>
    `
    // document.create the elements you'll want to put this information in  
  
    // append those elements somewhere
  
    // give them their appropriate content
  }
  
  // Function to display a FORECAST card given an object (from our renderForecast function) from open weather api ❌
  // daily forecast.
  function renderForecastCard(forecast) {
    // variables for data from api
      // temp, windspeed, etc.
  
    // Create elements for a card
  
    // append
  
    // Add content to elements
  
    // append to forecast section
  }
  
  // Function to display 5 day forecast. ❌
  function renderForecast(dailyForecast) {
    // set up elements for this section

    // append
    
    // loop over dailyForecast
  
    // for (var i = 0; i < dailyForecast.length; i++) {
  
    //   // send the data to our renderForecast function as an argument
    //       renderForecastCard(dailyForecast[i]);
  }
  
  // ✅
  function renderItems(city, data) {
    console.log(data);
    renderCurrentWeather(city, data);
    renderForecast(data);
  }
  
  // Fetches weather data for given location from the Weather Geolocation
  // endpoint; then, calls functions to display current and forecast weather data. ✅
  function fetchWeather(location) {
    // variables of longitude, latitude, city name - coming from location
    var lat = location[0].lat;
    var lon = location[0].lon;
    var city = location[0].name;
  
    // api url
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=hourly,daily&units=imperial&appid=${apiKey}`;
    // var weatherUrl = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon +"&exclude=hourly,daily&units=imperial&appid=" + workingKey;
  
    // fetch, using the api url
    fetch(weatherUrl)
      // .then that returns the response as json
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      // .then that calls renderItems(city, data)
      .then(function (data) {
        if (data.length !== 0) {
          renderItems(city, data);
        }
      })
      .catch(function (error) {
        alert("Weather error: \n" + error);
      });
  }

  // ✅
  function fetchCoords(search) {
    // variable for your api url
    var geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${apiKey}`;
    // var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + search + "&limit=1&appid=" + workingKey;
  
    // fetch with your url
    fetch(geoUrl)
      // .then that returns the response in json
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      // .then that does 2 things - calls appendToHistory(search), calls fetchWeather(the data)
      .then(function (data) {
        if (data.length !== 0) {
          appendToHistory(search);
          fetchWeather(data);
        }
      })
      .catch(function (error) {
        alert("GeoLocation error: \n" + error);
      });
  }
  
  // ✅
  function handleSearchFormSubmit(e) {
    e.preventDefault();

    // Don't continue if there is nothing in the search form
    if (!searchInputEl.value) {
      return;
    }
  
    var search = searchInputEl.value.trim();
    fetchCoords(search);
    searchInputEl.value = '';
  }
  
  // ✅
  function handleSearchHistoryClick(e) {
    // grab whatever city is is they clicked
    
    fetchCoords(search);
  }
  
  localStorage.setItem("history", JSON.stringify(["atlanta", "denver"]));
  initSearchHistory();
  // click event to run the handleFormSubmit ✅
  submitButton.addEventListener("click", handleSearchFormSubmit);

  // click event to run the handleSearchHistoryClick