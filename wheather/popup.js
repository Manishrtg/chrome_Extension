const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const weatherInfo = document.getElementById('weatherInfo');
const forecast = document.getElementById('forecast');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const saveBtn = document.getElementById('saveBtn');
const unitSelect = document.getElementById('unitSelect');
const loadingIndicator = document.getElementById('loading');

// Fetch weather data
async function getWeather(city, unit) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('City not found');
  }
  return await response.json();
}

// Fetch forecast data
async function getForecast(city, unit) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Forecast not available');
  }
  return await response.json();
}

// Display weather information
function displayWeather(data) {
  weatherInfo.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.weather[0].description}</p>
    <p>Temperature: ${data.main.temp} °${unitSelect.value === 'metric' ? 'C' : 'F'}</p>
    <p>Humidity: ${data.main.humidity}%</p>
  `;
}

// Display forecast information
function displayForecast(data) {
  forecast.innerHTML = '<h3>5-Day Forecast</h3>';
  const dailyForecast = data.list.filter(item => item.dt_txt.includes('12:00:00'));
  dailyForecast.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    forecast.innerHTML += `
      <p>${date}: ${item.main.temp} °${unitSelect.value === 'metric' ? 'C' : 'F'}, ${item.weather[0].description}</p>
    `;
  });
}

// Handle search button click
searchBtn.addEventListener('click', async () => {
  const city = cityInput.value;
  const unit = unitSelect.value;
  if (city) {
    loadingIndicator.classList.remove('hidden');
    try {
      const weatherData = await getWeather(city, unit);
      displayWeather(weatherData);
      const forecastData = await getForecast(city, unit);
      displayForecast(forecastData);
    } catch (error) {
      weatherInfo.innerHTML = `<p>${error.message}</p>`;
      forecast.innerHTML = '';
    } finally {
      loadingIndicator.classList.add('hidden');
    }
  }
});

// Save city preference
saveBtn.addEventListener('click', () => {
  const city = cityInput.value;
  if (city) {
    chrome.storage.local.set({ preferredCity: city }, () => {
      alert(`City ${city} saved!`);
    });
  }
});

// Load user's preferred city on startup
async function loadPreferredCity() {
  chrome.storage.local.get('preferredCity', async (data) => {
    if (data.preferredCity) {
      cityInput.value = data.preferredCity;
      const unit = unitSelect.value;
      loadingIndicator.classList.remove('hidden');
      try {
        const weatherData = await getWeather(data.preferredCity, unit);
        displayWeather(weatherData);
        const forecastData = await getForecast(data.preferredCity, unit);
        displayForecast(forecastData);
      } catch (error) {
        weatherInfo.innerHTML = `<p>${error.message}</p>`;
        forecast.innerHTML = '';
      } finally {
        loadingIndicator.classList.add('hidden');
      }
    }
  });
}

// Fetch weather for the user's location on load
window.onload = () => {
  loadPreferredCity();
};


