const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const weatherIcons = document.querySelectorAll("#weather-icon");
const tempElements = document.querySelectorAll("[id^=temp]");
const windElements = document.querySelectorAll("[id^=wind]");
const descElements = document.querySelectorAll("[id^=desc]");
const forecastContainer = document.getElementById("forecast-container");
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
    .then((response) => response.json())
    .then((data) => {
      const forecast = data.list.slice(0, 5);
      forecast.forEach((item, index) => {
        const weather = item.weather[0];
        const iconUrl = `https://openweathermap.org/img/w/${weather.icon}.png`;

        weatherIcons[index].src = iconUrl;
        tempElements[index].textContent = `${item.main.temp} °C`;
        windElements[index].textContent = `${item.wind.speed} m/s`;
        descElements[index].textContent = weather.description;

        const forecastCard = document.createElement("div");
        forecastCard.className = "forecast-card";

        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        const weatherIcon = document.createElement("img");
        weatherIcon.src = iconUrl;
        weatherIcon.alt = "Weather Icon";
        const weatherType = document.createElement("p");
        weatherType.textContent = weather.description;
        const forecastDate = document.createElement("p");
        forecastDate.textContent = day;

        forecastCard.appendChild(weatherIcon);
        forecastCard.appendChild(weatherType);
        forecastCard.appendChild(forecastDate);

        forecastContainer.appendChild(forecastCard);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  let celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
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
