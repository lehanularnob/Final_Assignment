function searchCountry() {
  const countryInput = document.getElementById('countryInput').value;

  // Fetch country data from restcountries.com
  fetch(`https://restcountries.com/v3.1/name/${countryInput}`)
    .then(response => response.json())
    .then(data => {
      // Use data to display country information
      displayCountryDetails(data[0]);
    })
    .catch(error => console.error('Error fetching country data:', error));
}

function displayCountryDetails(country) {
  const countryDetailsContainer = document.getElementById('countryDetails');

  // Create HTML to display country details
  const html = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${country.name.common}</h5>
        <p class="card-text">Capital: ${country.capital[0]}</p>
        <p class="card-text">Population: ${country.population}</p>
        <p class="card-text">Flag: <img src="${country.flags.png}" alt="${country.name.common} Flag" style="width: 50px;"></p>
        <button class="btn btn-info" onclick="getWeatherData('${country.capital[0]}')">More Details</button>
      </div>
    </div>
  `;

  // Append HTML to container
  countryDetailsContainer.innerHTML = html;
}

function getWeatherData(city) {
  // Replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual API key
  const apiKey = 'd16bb0502821a59a2b7554590566236a';
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
      const currentWeather = data[0];
      const forecast = data[1];

      // Use data to display current weather and forecast
      displayWeatherDetails(currentWeather, forecast);
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeatherDetails(currentWeather, forecast) {
  const weatherDetailsContainer = document.getElementById('countryDetails');

  // Create HTML to display current weather details
  const currentWeatherHtml = `
    <div class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">Current Weather</h5>
        <p class="card-text">Temperature: ${currentWeather.main.temp}°C</p>
        <p class="card-text">Condition: ${currentWeather.weather[0].description}</p>
        <p class="card-text">Wind Speed: ${currentWeather.wind.speed} m/s</p>
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="Weather Icon">
      </div>
    </div>
  `;

  // Get the hourly forecast for the next 8 hours
  const next8HoursForecast = forecast.list.slice(0, 8);

  // Create HTML to display hourly forecast details for the next 8 hours
  const forecastHtml = `
    <div class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">Next 8 Hours Forecast</h5>
        <ul class="forecast-list">
          ${next8HoursForecast.map(entry => {
            const date = new Date(entry.dt * 1000);
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `<li>
                      <div class="forecast-details">${time}:
                        ${entry.main.temp}°C, ${entry.weather[0].description}
                        <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="${entry.weather[0].description}">
                      </div>
                    </li>`;
          }).join('')}
        </ul>
      </div>
    </div>
  `;


  weatherDetailsContainer.innerHTML = currentWeatherHtml + forecastHtml;
}
