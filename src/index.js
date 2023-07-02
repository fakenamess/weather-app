const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const weatherIcons = document.querySelectorAll("#weather-icon");
const currentWeatherDesc = document.querySelector('.weather-description');
const currentTemperature = document.querySelector('.temperature');
const currentHumidity = document.querySelector('.humidity');
const currentWindSpeed = document.querySelector('.wind-speed');
const tempElements = document.querySelectorAll(".temperature");

const forecastContainer = document.getElementById("forecast-container");
const weatherInfo = document.querySelector('.weather-info');
let isCelsius = true;

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = searchInput.value;
  getWeather(city);
});

function getWeather(city) {
  const apiKey = "62231151ce343c4d68652e1617efc22f";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const forecast = data.list.slice(0, 5);
      displayForecast(forecast);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displayForecast(forecast) {
  const forecastCards = document.querySelectorAll('.weather-card');

  forecastCards.forEach((card, index) => {
    const forecastDate = card.querySelector('p:first-child');
    const forecastTemp = card.querySelector('#temp-' + (index + 1));
    const forecastWind = card.querySelector('#wind-' + (index + 1));
    const forecastDesc = card.querySelector('#desc-' + (index + 1));

    const { dt_txt, main, weather, wind } = forecast[index];
    const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;

    forecastDate.textContent = getDayOfWeek(dt_txt);
    forecastTemp.textContent = `Temperature: ${main.temp} °C`;
    forecastWind.textContent = `Wind Speed: ${wind.speed} km/h`;
    forecastDesc.textContent = `Weather: ${weather[0].description}`;

    const forecastIcon = document.createElement('img');
    forecastIcon.src = iconUrl;
    forecastIcon.alt = 'Weather Icon';

    card.insertBefore(forecastIcon, forecastDate);
  });
}

function getDayOfWeek(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector(".temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector(".weather-description");
  let humidityElement = document.querySelector(".humidity");
  let windElement = document.querySelector(".wind-speed");
  let dateElement = document.querySelector("#date");

  let celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
}

function search(city) {
  let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#cityInput");
  search(cityInputElement.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

function displayFahrenheitTemperature() {
  if (isCelsius) {
    tempElements.forEach((element) => {
      const celsius = parseFloat(element.textContent);
      const fahrenheit = (celsius * 9) / 5 + 32;
      element.textContent = `${fahrenheit.toFixed(1)} °F`;
    });
    isCelsius = false;
  }
}

function displayCelsiusTemperature() {
  if (!isCelsius) {
    tempElements.forEach((element) => {
      const fahrenheit = parseFloat(element.textContent);
      const celsius = ((fahrenheit - 32) * 5) / 9;
      element.textContent = `${celsius.toFixed(1)} °C`;
    });
    isCelsius = true;
  }
}
