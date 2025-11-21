const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);
        this.currentWeather = undefined;
        this.forecast = undefined;
    }

    getWeather(query) {
        this.resultsBlock.innerHTML = '';
        
        const todayContainer = document.createElement('div');
        todayContainer.id = 'today-container';
        this.resultsBlock.appendChild(todayContainer);
        
        const forecastContainer = document.createElement('div');
        forecastContainer.id = 'forecast-container';
        this.resultsBlock.appendChild(forecastContainer);
        
        this.getCurrentWeather(query, todayContainer);
        this.getForecast(query, forecastContainer);
    }

    getCurrentWeather(query, container) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;
        
        const req = new XMLHttpRequest();
        req.open("GET", url, true);
        
        req.addEventListener("load", () => {
            if (req.status === 200) {
                this.currentWeather = JSON.parse(req.responseText);
                console.log("Current Weather:", this.currentWeather);

                const header = document.createElement('h2');
                header.innerText = 'Dzisiaj:';
                header.style.textAlign = 'center';
                header.style.color = '#ffffffff';
                header.style.margin = '20px 0 10px 0';
                container.appendChild(header);

                this.drawWeather(this.currentWeather, true, null, container);
            } else {
                console.error("Błąd pobierania pogody bieżącej");
            }
        });
        
        req.send();
    }

    getForecast(query, container) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.forecast = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
                console.log("Filtered Forecast:", this.forecast);

                const header = document.createElement('h2');
                header.innerText = '5 dni:';
                header.style.textAlign = 'center';
                header.style.color = '#ffffffff';
                header.style.margin = '20px 0 10px 0';
                container.appendChild(header);

                this.forecast.forEach((item, index) => {
                    this.drawWeather(item, false, index + 1, container);
                });
            })
            .catch(error => console.error("Błąd Fetch:", error));
    }

    drawWeather(data, isCurrent = false, dayNumber = null, container = this.resultsBlock) {
        const date = new Date(data.dt * 1000);
        const dateString = isCurrent ? 'Dzisiaj' : (dayNumber ? `Dzień ${dayNumber}` : date.toLocaleDateString("pl-PL") + " " + date.toLocaleTimeString("pl-PL"));

        const temp = data.main.temp;
        const feelsLike = data.main.feels_like;
        const iconName = data.weather[0].icon;
        const description = data.weather[0].description;

        const weatherBlock = this.createWeatherBlock(dateString, temp, feelsLike, iconName, description);
        
        container.appendChild(weatherBlock);
    }

    createWeatherBlock(dateString, temp, feelsLike, iconName, description) {
        const block = document.createElement('div');
        block.className = 'weather-block';

        const dateDiv = document.createElement('div');
        dateDiv.className = 'weather-date';
        dateDiv.innerText = dateString;

        const tempDiv = document.createElement('div');
        tempDiv.className = 'weather-temperature';
        tempDiv.innerHTML = `${temp} &deg;C`;

        const feelsLikeDiv = document.createElement('div');
        feelsLikeDiv.className = 'weather-temperature-feels-like';
        feelsLikeDiv.innerHTML = `Odczuwalna: ${feelsLike} &deg;C`;

        const iconImg = document.createElement('img');
        iconImg.className = 'weather-icon';
        iconImg.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;

        const descDiv = document.createElement('div');
        descDiv.className = 'weather-description';
        descDiv.innerText = description;

        block.appendChild(dateDiv);
        block.appendChild(tempDiv);
        block.appendChild(feelsLikeDiv);
        block.appendChild(iconImg);
        block.appendChild(descDiv);

        return block;
    }
}

const weatherApp = new WeatherApp('7ded80d91f2b280ec979100cc8bbba94', '#weather-results-container');

document.querySelector('#checkButton').addEventListener('click', function() {
    const query = document.querySelector('#locationInput').value;
    weatherApp.getWeather(query);
});