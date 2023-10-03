
const API_KEY = config.API_KEY;
// WEATHER SCRIPT
var mainWeather = null

function fetchWeatherForLocation(zipCode = "11104", cardNumber, countryCode = "us" ) {
    let unit = 'imperial';
    let unitLetter = 'F';
    if (countryCode !== 'us') { unit = 'metric'; unitLetter = 'C' }
    url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${API_KEY}&units=${unit}`


    fetch(url)
        .then(response => response.json())
        .then(data => handleWeatherData(data, zipCode, cardNumber, unitLetter, unit))
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// This function gets the location from the input fields and then fetches the weather
function fetchWeatherFromInputs(cardNumber) {
    const zipCode = document.querySelector(`#weather-card-${cardNumber} .zipInput`).value.trim();
    const countryCode = document.querySelector(`#weather-card-${cardNumber} .countryCode`).value.trim();
    if (zipCode !== '') {
        fetchWeatherForLocation(zipCode, cardNumber, countryCode);
    } else {
        // Handle empty ZIP code case here if necessary
    }
}

// Handle the weather data received from OpenWeatherMap
function handleWeatherData(data, locationQuery, cardNumber, unitLetter, unit) {
    if (data && data.weather && data.weather[0] && data.main) {
        const weatherDescription = data.weather[0].description.toUpperCase();
        const temperature = data.main.temp.toFixed(0);
        const feelsLike = data.main.feels_like.toFixed(0);
        const minTemp = data.main.temp_min.toFixed(0);
        const maxTemp = data.main.temp_max.toFixed(0);
        const pressure = data.main.pressure.toFixed(0);
        const humidity = data.main.humidity.toFixed(0);
        const visibility = data.visibility.toFixed(0);
        const windSpeed = data.wind.speed.toFixed(0);
        const windDirection = degToCardinal(data.wind.deg);
        const cityName = data.name; // City name is returned in the 'name' field.
        const stateCode = data.sys.state; // OpenWeatherMap does not directly provide state info, 
        const countryCode = data.sys.country;


        const iconURL = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

        document.querySelector(`#weather-card-${cardNumber} .weatherInfo`).innerHTML = `
                <img src="${iconURL}" alt="${weatherDescription}" title="${weatherDescription}">
                <div>
                    <h3>${cityName}, ${countryCode}</h3>
                    <p class="zipCode">Zip Code: ${locationQuery}</p>
                    <h3 class="temperature">${temperature}°${unitLetter}</h3>
                    <h3>${weatherDescription}</h3>
                    <button class="detailsToggleBtn">Details</button>
                        <div class="weatherDetails collapsed">
                            <p>Feels Like: ${feelsLike}°${unitLetter}</p>
                            <p>Min Temp: ${minTemp}°${unitLetter}</p>
                            <p>Max Temp: ${maxTemp}°${unitLetter}</p>
                            <p>Pressure: ${pressure} hPa</p>
                            <p>Humidity: ${humidity}%</p>
                            <p>Visibility: ${visibility} meters</p>
                            <p>Wind: ${windSpeed} m/s, Direction: ${windDirection}</p>
                        </div>

                        <button class="forecastToggleBtn">Forecast</button>
                        <div class="forecastDetails collapsed">
                        </div>
                </div>
                    `;


        // Add event listener to toggle button
        document.querySelector(`#weather-card-${cardNumber} .detailsToggleBtn`)
            .addEventListener('click', function () {
                const detailsSection = document.querySelector(
                    `#weather-card-${cardNumber} .weatherDetails`);

                if (detailsSection.classList.contains('collapsed')) {
                    detailsSection.classList.remove('collapsed');
                } else {
                    detailsSection.classList.add('collapsed');
                }
            });

        document.querySelector(`#weather-card-${cardNumber} .forecastToggleBtn`)
            .addEventListener('click', function () {
                const forecastSection = document.querySelector(`#weather-card-${cardNumber} .forecastDetails`);

                if (forecastSection.classList.contains('collapsed')) {
                    forecastSection.classList.remove('collapsed');
                    fetchForecastForLocation(document.querySelector(`#weather-card-${cardNumber} .zipInput`)
                        .value.trim(),
                        cardNumber, countryCode, unitLetter, unit); // fetch forecast when opened
                } else {
                    forecastSection.classList.add('collapsed');
                }
            });


        // Update the card's color based on weather conditions
        const weatherCard = document.querySelector(`#weather-card-${cardNumber}`);

        weatherCard.className = 'weather-card'; // Reset to default first

        const firstLocation = document.querySelector(`#weather-card-1 h3`)  && document.querySelector(`#weather-card-1 h3`).innerHTML ? document.querySelector(`#weather-card-1 h3`).innerHTML.split(',')[0] : null

        if (firstLocation !== null && mainWeather === null) {
            mainWeather = data.name === firstLocation && data.weather[0].main ? data.weather[0].main.toLowerCase() : 'unknown';
            document.body.style.backgroundImage = `url('images/${mainWeather}.jpg')`;
            if (mainWeather) {
                weatherCard.classList.add(mainWeather);
            }
        }
    } else {
        document.getElementById('weatherInfo').textContent =
            'Unable to fetch weather data for the given location.';
    }

    // Update last updated timestamp
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    document.querySelector(`#weather-card-${cardNumber} .lastUpdated`).textContent = `Last updated:
        ${formattedDate}`;
}

// Fetch weather initially for default location (London)
const weatherCards = document.querySelectorAll('.weather-card');

// Fetch initial weather for all cards
weatherCards.forEach((card, index) => {
    fetchWeatherFromInputs(index + 1);
    document.querySelector(`#weather-card-${index + 1} .toggle-icon`)
        .addEventListener('click', function () {
            const inputFields = document.querySelector(`#weather-card-${index + 1} .input-fields`)
            if (inputFields.classList.contains('collapsed')) {
                inputFields.classList.remove('collapsed');
            } else {
                inputFields.classList.add('collapsed');
            }
        });

});


function fetchForecastForLocation(zipCode = "11104", cardNumber, countryCode, unitLetter, unit = 'imperial') {

    url = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},${countryCode}&appid=${API_KEY}&units=${unit}`

    fetch(url)
        .then(response => response.json())
        .then(data => handleForecastData(data, cardNumber, unitLetter))
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}


function handleForecastData(data, cardNumber, unitLetter) {
    if (data && data.list) {
        let forecastHtml = '<div class="forecastContainer">';
        const dailyForecasts = {};

        // Separate forecasts into different lists by date
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = [];
            }
            dailyForecasts[date].push(forecast);
        });

        const maxTempForecasts = [];
        const minTempForecasts = [];

        // From each list, pick the forecast with the highest temperature
        for (let date in dailyForecasts) {
            let maxTempForecastForTheDay = dailyForecasts[date][0];
            for (let i = 1; i < dailyForecasts[date].length; i++) {
                if (dailyForecasts[date][i].main.temp_max > maxTempForecastForTheDay.main.temp_max) {
                    maxTempForecastForTheDay = dailyForecasts[date][i];
                }
            }
            maxTempForecasts.push(maxTempForecastForTheDay);

            let minTempForecastForTheDay = dailyForecasts[date][0];
            minTempForecastForTheDay.date = new Date(minTempForecastForTheDay.dt * 1000).toLocaleDateString();
            for (let i = 1; i < dailyForecasts[date].length; i++) {
                if (dailyForecasts[date][i].main.temp_min < minTempForecastForTheDay.main.temp_min) {
                    minTempForecastForTheDay = dailyForecasts[date][i];
                    minTempForecastForTheDay.date = new Date(minTempForecastForTheDay.dt * 1000).toLocaleDateString();
                }
            }
            minTempForecasts.push(minTempForecastForTheDay);
        }

        maxTempForecasts.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            const thisForcast = minTempForecasts.find(item => item.date === date)
            const description = item.weather[0].description;
            const icon = item.weather[0].icon;
            const minTemp = thisForcast.main.temp_min.toFixed(0);
            const maxTemp = item.main.temp.toFixed(0);
            const iconURL = `http://openweathermap.org/img/w/${icon}.png`;

            forecastHtml += `
            <div class="forecastItem">
            <p>${date}</p>
            <img src="${iconURL}" alt="${description}" title="${description}">
            <p class="minTemp" >${minTemp}°${unitLetter}</p>
            <p class="maxTemp" >${maxTemp}°${unitLetter}</p>
            <p>${description}</p>
        </div>
        `;
        });
        forecastHtml += '</div>';
        document.querySelector(`#weather-card-${cardNumber} .forecastDetails`).innerHTML = forecastHtml;
    } else {
        document.querySelector(`#weather-card-${cardNumber} .forecastDetails`).textContent =
            'Unable to fetch forecast data for the given location.';
    }
}





// Automatically update every 15 minutes for all cards
setInterval(() => {
    weatherCards.forEach((card, index) => {
        fetchWeatherFromInputs(index + 1);
    });
}, 15 * 60 * 1000);

document.querySelectorAll('.getWeatherBtn').forEach((btn, index) => {
    btn.addEventListener('click', function () {
        fetchWeatherFromInputs(index + 1);
    });
});