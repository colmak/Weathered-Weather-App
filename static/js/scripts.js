/* Constants */

const INTERNET_CONSTANTS = {};

const DAYS = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat'
};

const WEATHER_CODES = {
  0: { condition: 'Clear sky', icons: ['sun'] },
  1: { condition: 'Mainly clear', icons: ['cloud'] },
  2: { condition: 'Partly cloudy', icons: ['cloud'] },
  3: { condition: 'Overcast', icons: ['cloud'] },
  45: { condition: 'Fog', icons: ['cloud-fog'] },
  48: { condition: 'Depositing rime fog', icons: ['cloud-fog'] },
  51: { condition: 'Light drizzle', icons: ['cloud-drizzle'] },
  53: { condition: 'Moderate drizzle', icons: ['cloud-drizzle'] },
  55: { condition: 'Dense drizzle', icons: ['cloud-drizzle'] },
  56: { condition: 'Light freezing drizzle', icons: ['thermometer-low', 'cloud-drizzle'] },
  57: { condition: 'Dense freezing drizzle', icons: ['thermometer-low', 'cloud-drizzle'] },
  61: { condition: 'Slight rain', icons: ['cloud-rain'] },
  63: { condition: 'Moderate rain', icons: ['cloud-rain'] },
  65: { condition: 'Heavy rain', icons: ['cloud-rain'] },
  66: { condition: 'Light freezing rain', icons: ['thermometer-low', 'cloud-rain'] },
  67: { condition: 'Heavy freezing rain', icons: ['thermometer-low', 'cloud-rain'] },
  71: { condition: 'Slight snow fall', icons: ['snow'] },
  73: { condition: 'Moderate snow fall', icons: ['snow'] },
  75: { condition: 'Heavy snow fall', icons: ['snow'] },
  77: { condition: 'Snow grains', icons: ['cloud-snow'] },
  80: { condition: 'Slight rain showers', icons: ['cloud-rain'] },
  81: { condition: 'Moderate rain showers', icons: ['cloud-rain'] },
  82: { condition: 'Violent rain showers', icons: ['cloud-rain'] },
  85: { condition: 'Slight snow showers', icons: ['cloud-snow'] },
  86: { condition: 'Heavy snow showers', icons: ['cloud-snow'] },
  95: { condition: 'Thunderstorm', icons: ['cloud-lightning-rain'] },
  96: { condition: 'Thunderstorm with slight hail', icons: ['cloud-lightning-rain'] },
  99: { condition: 'Thunderstorm with heavy hail', icons: ['cloud-lightning-rain'] },
};

const request = (resource) => new Promise((res) => {
  const req = new XMLHttpRequest();

  req.open('GET', resource);

  req.onreadystatechange = () => {
    return req.readyState === 4 && res(JSON.parse(req.responseText));
  };

  return req.send();
});

const getForecast = (latitude, longitude, timezone = 'America/New_York') => {
  const parameters = {
    latitude,
    longitude,
    hourly: ['temperature_2m', 'apparent_temperature', 'weathercode'].join(),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weathercode',
      'sunrise',
      'sunset',
    ].join(),
    temperature_unit: 'fahrenheit',
    timeformat: 'unixtime',
    timezone: encodeURIComponent(timezone),
  };

  const qs = Object.keys(parameters).map((key) => `${key}=${parameters[key]}`).join('&');

  return request(`https://api.open-meteo.com/v1/forecast?${qs}`);
};

const loadForecast = (LOCALE, FORECAST) => {
  /* Enable location based weather */
  document.getElementById('location').innerText = [
    LOCALE.city,
    LOCALE.region,
    LOCALE.countryCode,
  ].join(', ');
  document.getElementById('temperature').innerText = FORECAST
    .hourly.temperature_2m[new Date().getHours()];
  document.getElementById('weather-condition').innerText = WEATHER_CODES[FORECAST
    .hourly.weathercode[new Date().getHours()]].condition;
  document.getElementById('apparent-temperature').innerText = FORECAST
    .hourly.apparent_temperature[new Date().getHours()];
  document.getElementById('hi-temperature').innerText = FORECAST.daily.temperature_2m_max[0];
  document.getElementById('lo-temperature').innerText = FORECAST.daily.temperature_2m_min[0];
  document.getElementById('sunrise').innerText = new Date(FORECAST.daily.sunrise[0] * 1000)
    .toLocaleString({}, { hour: 'numeric', minute: 'numeric' });
  document.getElementById('sunset').innerText = new Date(FORECAST.daily.sunset[0] * 1000)
    .toLocaleString({}, { hour: 'numeric', minute: 'numeric' });

  Array.from(document.getElementsByClassName('hourly-temperature')).forEach((e, index) => {
    e.innerText = FORECAST.hourly.temperature_2m[new Date().getHours() + index];
  });
  Array.from(document.getElementsByClassName('hourly-icon')).forEach((e, index) => {
    e.innerHTML = (!FORECAST.hourly.weathercode[new Date().getHours() + index]
      && FORECAST.hourly.time[new Date().getHours() + index] < FORECAST.daily.sunset[0])
      /* Set moon instead of sun icon if sunset has not yet occurred */
      ? '<i class="bi bi-moon weather-condition"></i>'
      : WEATHER_CODES[FORECAST.hourly.weathercode[new Date().getHours() + index]].icons
          .reduce((icons, icon) => `${icons}<i class="bi bi-${icon} weather-condition"></i>`, '');
  });
  Array.from(document.getElementsByClassName('hourly-hour')).forEach((e, index) => {
    e.innerText = ((new Date().getHours() + index) % 12) || 12;
  });
  Array.from(document.getElementsByClassName('hourly-period')).forEach((e, index) => {
    e.innerText = ((new Date().getHours() + index) % 24) >= 12 ? 'PM' : 'AM';
  });

  Array.from(document.getElementsByClassName('daily-hi-temperature')).forEach((e, index) => {
    e.innerText = FORECAST.daily.temperature_2m_max[index];
  });
  Array.from(document.getElementsByClassName('daily-lo-temperature')).forEach((e, index) => {
    e.innerText = FORECAST.daily.temperature_2m_min[index];
  });
  Array.from(document.getElementsByClassName('daily-icon')).forEach((e, index) => {
    e.innerHTML = WEATHER_CODES[FORECAST.daily.weathercode[index]].icons
      .reduce((icons, icon) => `${icons}<i class="bi bi-${icon} weather-condition"></i>`, '');
  });
  Array.from(document.getElementsByClassName('daily-day')).forEach((e, index) => {
    e.innerText = DAYS[new Date(FORECAST.daily.time[index] * 1000).getDay()];
  });
};

const parseLocation = async () => {
  const { value } = document.getElementById('search-box');
  const [city, region, countryCode] = value.split(', ');

  const { LATITUDE = 0, LONGITUDE = 0 } = INTERNET_CONSTANTS.US_CITIES
    .find(({ STATE_CODE, CITY }) => STATE_CODE === region && CITY === city) || {};

  if (!LATITUDE) return alert('Choose a location from the dropdown menu.');

  const FORECAST = await getForecast(LATITUDE, LONGITUDE);

  return loadForecast({ city, region, countryCode }, FORECAST);
};

document.onreadystatechange = async () => {
  if (document.readyState !== 'complete') return false;
  if ((getCookie() || {}).dark === 'true') toggleDarkMode(document.getElementById('dark'), false);

  /* Constants */
  const LOCALE = await request('http://ip-api.com/json?fields=470');
  const FORECAST = await getForecast(LOCALE.lat, LOCALE.lon, LOCALE.timezone);
  const US_CITIES = await request('/static/js/US_CITIES.json');

  INTERNET_CONSTANTS.US_CITIES = US_CITIES;

  loadForecast(LOCALE, FORECAST);

  document.getElementById('search-box').onkeyup = () => {
    const chunks = document.getElementById('search-box').value.split(/ +/g);
    const cities = US_CITIES.filter(({ STATE_CODE, STATE_NAME, CITY }) => {
      const city = CITY.split(' ');
      const state = [STATE_CODE, STATE_NAME];

      const noMatch = chunks.some((chunk) => {
        const index = city.findIndex((c) => new RegExp(`^${chunk}`, 'i').test(c));

        if (index !== -1) {
          city.splice(index, 1);

          return false;
        } else {
          if (state.some((s) => new RegExp(`^${chunk}`, 'i').test(s))) {
            state.length = 0;

            return false;
          } else return true;
        }
      });

      return !noMatch;
    });

    document.getElementById('geoLocations').replaceChildren(...
      cities.map(({ STATE_CODE, CITY }) => {
        const e = document.createElement('option');

        e.value = `${CITY}, ${STATE_CODE}, US`;

        return e;
      })
    );
  };

  return true;
};

const getCookie = () => document.cookie && document.cookie
  .split(';')
  .map((c) => c.split('='))
  .reduce((cookie, c) => ({
    ...cookie,
    [decodeURIComponent(c.shift().trim())]: decodeURIComponent(c.shift().trim()),
  }), {});

function toggleDarkMode(e, changeState = true) {
  const dark = getCookie().dark === 'true';

  e.classList.toggle('fa-moon');
  e.classList.toggle('fa-sun');


  document.getElementById('index').classList.toggle('bg-darker');
  document.getElementById('index').classList.toggle('bg-light');
  document.getElementById('index').classList.toggle('scroll-cool');
  document.getElementById('index').classList.toggle('scroll-warm');

  Array.from(document.getElementsByClassName('card-body'))
    .forEach((e) => e.classList.toggle('bg-card-darker'));

  Array.from(document.getElementsByClassName('form-control'))
    .forEach((e) => e.classList.toggle('bg-darker'));

  Array.from(document.getElementsByClassName('nav-item'))
    .forEach((e) => e.classList.toggle('text-dark'));

  Array.from(document.getElementsByClassName('input-group-text'))
    .forEach((e) => {
      e.classList.toggle('text-black');
      e.classList.toggle('text-light');
    });

  document.cookie = changeState ? `dark=${!dark}` : document.cookie;
}
