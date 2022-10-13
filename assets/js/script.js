// Global variables
// search history as an empty array
var historyArr = [];
// weather api root url
var apiURL = "";
// api key
var apiKEY = "";

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


// Function to display the search history list.
function renderSearchHistory() {
    // empty the search history container
    searchHistoryEl.innerHTML = "";
  
    // loop through the history array creating a button for each item
    for (var i = 0; i < historyArr.length; i++) {
        // append to the search history container
        searchHistoryEl.innerHTML += `<button>${historyArr[i]}</button>`;
    }
  }
  
  // Function to update history in local storage then updates displayed history.
  function appendToHistory(search) {
    // push search term into search history array
  
    // set search history array to local storage
    renderSearchHistory();
  }
  
  // Function to get search history from local storage
  function initSearchHistory() {
    // get search history item from local storage
    var historyItem = JSON.parse(localStorage.getItem("history"));

    // set search history array equal to what you got from local storage
    for (var i = 0; i < historyItem.length; i++) {
        historyArr[i] = historyItem[i];
    }
    renderSearchHistory();
  }
  
  // Function to display the CURRENT weather data fetched from OpenWeather api.
  function renderCurrentWeather(city, weather) {
    // Store response data from our fetch request in variables
      // temperature, wind speed, etc.
  
  
    // document.create the elements you'll want to put this information in  
  
    // append those elements somewhere
  
    // give them their appropriate content
  
  }
  
  // Function to display a FORECAST card given an object (from our renderForecast function) from open weather api
  // daily forecast.
  function renderForecastCard(forecast) {
    // variables for data from api
      // temp, windspeed, etc.
  
    // Create elements for a card
  
    // append
  
    // Add content to elements
  
    // append to forecast section
  }
  
  // Function to display 5 day forecast.
  function renderForecast(dailyForecast) {
  // set up elements for this section
    
  // append
  
  // loop over dailyForecast
  
    for (var i = 0; i < dailyForecast.length; i++) {
  
      // send the data to our renderForecast function as an argument
          renderForecastCard(dailyForecast[i]);
    }
  }
  
  function renderItems(city, data) {
    renderCurrentWeather(city, data.list[0]);
    renderForecast(data.list);
  }
  
  // Fetches weather data for given location from the Weather Geolocation
  // endpoint; then, calls functions to display current and forecast weather data.
  function fetchWeather(location) {
    // varialbles of longitude, latitude, city name - coming from location
  
    // api url
  
    // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)
  
  }
  
  function fetchCoords(search) {
    // variable for you api url
  
    // fetch with your url, .then that returns the response in json, .then that does 2 things - calls appendToHistory(search), calls fetchWeather(the data)
  
  }
  
  function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!searchInput.value) {
      return;
    }
  
    e.preventDefault();
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = '';
  }
  
  function handleSearchHistoryClick(e) {
    // grab whatever city is is they clicked
    
    fetchCoords(search);
  }
  
  initSearchHistory();
  // click event to run the handleFormSubmit 
  // click event to run the handleSearchHistoryClick