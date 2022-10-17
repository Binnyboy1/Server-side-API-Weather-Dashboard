// Global variables
// search history as an empty array
var historyArr = [];
// api key
var apiKey = "56ad1233636b0bba431cc36ab67b1e36";

// DOM element references
// search form
var searchFormEl = document.querySelector('form');
// search input
var searchInputEl = document.querySelector('input');
// container/section for today's weather
var weatherEl = document.querySelector('.weather');
// container/section for the forecast 
var forecastEl = document.querySelector('.forecast');
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
        searchHistoryEl.innerHTML += `<button class="history-button">${historyArr[i]}</button>`;
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
  
  // Function to display the CURRENT weather data fetched from OpenWeather api. ✅
  function renderCurrentWeather(city, weather) {
    // Store response data from our fetch request in variables
    var temp = weather.main.temp + "°F";
    var wind = weather.wind.speed + " MPH";
    var humidity = weather.main.humidity + "%";
    var iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather.weather[0].icon}.svg`;
  
    // Render items
    weatherEl.innerHTML += `
    <div id="psuedo-header">
      <h1>${city} (${dayjs(weather.dt * 1000).format('MM/DD/YYYY')})</h1>
      <img src=${iconUrl} class="icon" alt="${weather.weather[0].description}">
    </div>
    <p>Temp: ${temp}</p>
    <p>Wind: ${wind}</p>
    <p>Humidity: ${humidity}</p>
    `
  }
  
  // Function to display a FORECAST card given an object (from our renderForecast function) from open weather api ✅
  // daily forecast.
  function renderForecastCard(dailyForecast) {
    // variables for data from api
    var temp = dailyForecast.main.temp + "°F";
    var wind = dailyForecast.wind.speed + " MPH";
    var humidity = dailyForecast.main.humidity + "%";
    var iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${dailyForecast.weather[0].icon}.svg`;

    // Render items
    forecastEl.innerHTML += `
    <div class="card">
      <h2>${dayjs(dailyForecast.dt * 1000).format('MM/DD/YYYY')}</h2>
      <img src=${iconUrl} class="icon" alt="${dailyForecast.weather[0].description}">
      <p>Temp: ${temp}</p>
      <p>Wind: ${wind}</p>
      <p>Humidity: ${humidity}</p>
    </div>
    `
  }
  
  // Function to display 5 day forecast. ✅
  function renderForecast(dailyForecast, currDate) {
    // set up elements for this section
    var lat = dailyForecast.coord.lat;
    var lon = dailyForecast.coord.lon;
    var dailyUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(dailyUrl)
      // .then that returns the response as json
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      // .then that calls dailyForecast(data)
      .then(function (data) {
        if (data.length !== 0) {
          // retrieve dates for the next 5 days
          var dateList = [];
          for (var i = 1; i <= 5; i++) {
            dateList.push(dayjs((86400*i + dayjs(currDate).unix()) * 1000).unix());
          }

          // retrieve data on those specified dates
          var dataList = [];
          var dateListIndex = 0;
          for (var i = 0; i < data.list.length; i++) {
            // if the time matches up, save the date data
            if (data.list[i].dt > dateList[dateListIndex]) {
              dataList.push(data.list[i]);
              dateListIndex++;
            } 
            // if there isn't a 5th match by the end of the list, add the final one anyways (won't be the same hour as the others, but as long as it's the same day, that's all that matters)
            else if (i == data.list.length - 1 && dateListIndex == 4) {
              dataList.push(data.list[i]);
              dateListIndex++;
            }
          }

          // loop over dailyForecast
          for (var i = 0; i < 5; i++) {
            // send the data to our renderForecast function as an argument
            renderForecastCard(dataList[i]);
          }
        }
      })
      .catch(function (error) {
        alert("Weather error: \n" + error);
      });
  }
  
  // ✅
  function renderItems(city, data) {
    forecastEl.innerHTML = "";
    weatherEl.innerHTML = "";

    var date = dayjs(data.dt * 1000).format('YYYY-MM-DD HH');
    renderCurrentWeather(city, data);
    renderForecast(data, date);
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
  function fetchCoords(search, repeat = false) {
    // variable for your api url
    var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${apiKey}`;
  
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
          if (repeat === false) {
            appendToHistory(search);
          }
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
    // if the clicked element is not a choice button, do nothing.
    if (e.target.nodeName !== "BUTTON") {
      return;
    }

    // grab whatever city is is they clicked
    fetchCoords(e.target.innerText, true);
  }

  // Bonus: Header text rotisserie set up
  setInterval(function() {
    var headerEl = document.querySelector(".weather-header");
    headerEl.style.left = headerEl.offsetLeft + 1 + "px";

    var posLeft = Number(headerEl.style.left.replace(/px$/, ''));
    if (posLeft > window.innerWidth) {
      headerEl.style.left = "-264px";
    }
  }, 8);
  // Learned from https://www.tutorialspoint.com/how-to-create-a-moving-div-using-javascript 
  
  localStorage.setItem("history", JSON.stringify([]));
  initSearchHistory();
  // click event to run the handleFormSubmit ✅
  submitButton.addEventListener("click", handleSearchFormSubmit);

  // click event to run the handleSearchHistoryClick
  searchHistoryEl.addEventListener("click", handleSearchHistoryClick);