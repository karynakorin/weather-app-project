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
    "Saturday",
  ];
  let dayIndex = date.getDay();
  let day = days[dayIndex];

  return `${day}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  forecastHTML = `<div class="row g-0">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML += `<div class="col">
            <div class="weather-forecast-date">${formatDay(
              forecastDay.dt
            )}</div>
            <img
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              alt="overcast clouds"
              width="60"
            />
            <div class="weather-forecast-temperatures">
              <span class="weather-forecast-temperature-max">${Math.round(
                forecastDay.temp.max
              )}°</span>
              <span class="weather-forecast-temperature-min">${Math.round(
                forecastDay.temp.min
              )}°</span>
            </div>
          </div>
    `;
    }
  });
  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "ad793a6d772939c31783de5822791acf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showTemp(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].description);

  celsiusTemperature = Math.round(response.data.main.temp);

  document.querySelector("#main-temperature").innerHTML = celsiusTemperature;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );
  document.querySelector("#pressure").innerHTML = response.data.main.pressure;
  document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000
  );

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "3fdc8cfbf2d6fa0116c9ae92d3df4f79";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function retrievePosition(position) {
  let apiKey = "3fdc8cfbf2d6fa0116c9ae92d3df4f79";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let celsiusTemperature = null;

let cityForm = document.querySelector("#city-form");
cityForm.addEventListener("submit", handleSubmit);
let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getCurrentLocation);

searchCity("Montreal");
