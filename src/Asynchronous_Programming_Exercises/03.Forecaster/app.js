function attachEvents() {
    const btnGetWeather = document.getElementById('submit');
    const input = document.getElementById('location');
    const forecast = document.getElementById('forecast');
    const divCurrent = document.getElementById('current');
    const divUpcoming = document.getElementById('upcoming');

    const divError = document.createElement('div');
    forecast.appendChild(divError);
    divError.style.display = 'none';
    divError.textContent = 'Error';

    const symbols = {
        'Sunny': '☀',
        'Partly sunny': '⛅',
        'Overcast': '☁',
        'Rain': '☂',
        'Degrees': '°'
    }

    const url = 'http://localhost:3030/jsonstore/forecaster/locations';

    btnGetWeather.addEventListener('click', async () => await getLocations())

    async function getLocations() {
        try {
            const response = await fetch(url);
            const locations = await response.json();

            const locationCode = locations.filter(e => e.name.toLocaleLowerCase() == input.value.toLocaleLowerCase())[0].code;

            input.value = '';

            const [forecastToday, forecastUpcoming] =
                await Promise.all([
                    getTodayForecast(locationCode),
                    getUpcomingForecats(locationCode)
                ]);

            forecast.style.display = 'block';

            if (divCurrent.children.length > 1) {
                for (let i = 1; i < divCurrent.children.length; i++) {
                    divCurrent.children[i].remove();
                }
            }

            if (divUpcoming.children.length > 1) {
                for (let i = 1; i < divUpcoming.children.length; i++) {
                    divUpcoming.children[i].remove();
                }
            }

            const divToday = e('div', { className: 'forecasts' },
                e('span', { className: 'condition symbol' }, symbols[forecastToday.forecast.condition]),
                e('span', { className: 'condition' },
                    e('span', { className: 'forecast-data' }, forecastToday.name),
                    e('span', { className: 'forecast-data' },
                        `${forecastToday.forecast.low}${symbols.Degrees}/${forecastToday.forecast.high}${symbols.Degrees}`),
                    e('span', { className: 'forecast-data' }, forecastToday.forecast.condition)
                )
            );

            divCurrent.appendChild(divToday);

            const divThreeDays = e('div', { className: 'forecast-info' }, forecastUpcoming.forecast.map(day => {
                const spanUpcoming = e('span', { className: 'upcoming' },
                    e('span', { className: 'symbol' }, symbols[day.condition]),
                    e('span', { className: 'forecast-data' }, `${day.low}${symbols.Degrees}/${day.high}${symbols.Degrees}`),
                    e('span', { className: 'forecast-data' }, day.condition)
                )
                return spanUpcoming;
            }));

            divUpcoming.appendChild(divThreeDays);

            divError.style.display = 'none';
            divCurrent.style.display = 'block';
            divUpcoming.style.display = 'block';

        }
        catch (error) {
            divError.style.display = 'block';
            divCurrent.style.display = 'none';
            divUpcoming.style.display = 'none';
            forecast.style.display = 'block';
        }
    }
}

async function getTodayForecast(locationCode) {
    const urlToday = 'http://localhost:3030/jsonstore/forecaster/today/' + locationCode;
    const responseToday = await fetch(urlToday);
    const dataToday = await responseToday.json();
    return dataToday;
}

async function getUpcomingForecats(locationCode) {
    const urlUpcoming = 'http://localhost:3030/jsonstore/forecaster/upcoming/' + locationCode;
    const responseUpcoming = await fetch(urlUpcoming);
    const dataUpcoming = await responseUpcoming.json();
    return dataUpcoming;
}

function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}

attachEvents();