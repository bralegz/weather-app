const keyWeather = '920e3027785794efbb01f56d47cbc19a';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
let arrayDays = [];
let todayTemp;
let todayTempFahrenheit;

// Selectors
const celsiusButton = document.querySelector('.celsius-btn');
const fahrenheitButton = document.querySelector('.fahrenheit-btn');
const todayIconContainer = document.querySelector('.today-iconContainer');
const todayInfoContainer = document.querySelector('.today-infoContainer');
const secondRow = document.querySelector('.second-row');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const visibility = document.querySelector('.visibility');
const pressure = document.querySelector('.pressure');

// Event Listeners
celsiusButton.addEventListener('click', changeCelsius);
fahrenheitButton.addEventListener('click', changeCelsius);

// GET CURRENT LOCATION COORDINATES.

getWeather({
  latitude: geoplugin_latitude(),
  longitude: geoplugin_longitude(),
  city: geoplugin_region(),
  country: geoplugin_countryName(),
});

// GET API DATA
function getWeather(geo) {
  const { latitude: lat, longitude: lon, city, country } = geo;
  console.log(geo);

  // FETCH TODAY DATA
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keyWeather}`
  )
    .then((res) => res.json())
    .then((currentDayResult) => {
      console.log(currentDayResult);
      //currentDayResult destructuring
      const {
        main: {
          humidity: currentHumidity,
          pressure: currentPressure,
          temp: currentTemp,
        },
        visibility: currentVisibility,
        wind: { speed: currentSpeed, deg: currentWindDir },
        weather: [{ icon: currentIcon, main: mainWeather }],
      } = currentDayResult;

      const todayInfo = [
        currentTemp,
        currentSpeed,
        currentHumidity,
        currentVisibility,
        currentPressure,
        currentIcon,
        mainWeather,
        city,
        currentWindDir,
        country,
      ];

      renderCurrentDay(todayInfo);
    });

  //FETCH 5 DAYS DATA
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${keyWeather}`
  )
    .then((res) => res.json())
    .then((result5Days) => {
      // console.log(`${city}, ${country}`)
      // console.log(result5Days);
      const { list: dayList } = result5Days;

      render5DaysInfo(dayList);

      arrayDays.push(...dayList);
    })
    .catch((err) => {
      console.log(err);
    });
}

// RENDER TODAY INFO

function renderCurrentDay(todayInfo) {
  todayTemp = Math.floor(todayInfo[0] - 273.15);
  todayTempFahrenheit = Math.floor(todayInfo[0]);
  const todayWind = Math.floor(todayInfo[1] * 2.237); //convert to mph
  const todayHumidity = todayInfo[2];
  const todayVisibility = (todayInfo[3] / 1609).toFixed(1);
  const todayAirPressure = todayInfo[4];
  const todayIcon = todayInfo[5];
  const todayMain = todayInfo[6];
  const currentCity = `${todayInfo[7]}, ${todayInfo[9]}`;
  const currentWindDirection = todayInfo[8];
  const newDate = new Date();

  // Insert today's icon image.

  const imgUrl = `http://openweathermap.org/img/wn/${todayIcon}@2x.png`;
  const iconImg = document.createElement('img');
  iconImg.setAttribute('id', 'iconImg');
  iconImg.src = imgUrl;
  todayIconContainer.appendChild(iconImg);

  //Insert today's info.
  const todayTempValue = document.createElement('p');
  todayTempValue.classList.add('todayTempValue');
  todayTempValue.setAttribute('id', 'todayTempValue');
  todayTempValue.innerHTML = `${todayTemp}<span>ºC</span>`;
  todayInfoContainer.appendChild(todayTempValue);

  const todayMainWeather = document.createElement('p');
  todayMainWeather.classList.add('today-main-weather');
  todayMainWeather.innerHTML = `${todayMain}`;
  todayInfoContainer.appendChild(todayMainWeather);

  const todayDate = document.createElement('p');
  todayDate.classList.add('today-date');
  todayDate.innerHTML = `Today - ${
    weekDays[newDate.getDay()]
  }, ${newDate.getDate()} ${months[newDate.getMonth()]}`;
  todayInfoContainer.appendChild(todayDate);

  const todayCity = document.createElement('p');
  todayCity.classList.add('today-city');
  todayCity.innerHTML = `<i class="fa fa-map-marker" style="font-size:24px"></i> ${currentCity}`;
  todayInfoContainer.appendChild(todayCity);

  // INSERT HTML INTO HIGHLIGHTS CARDS

  // Insert Wind HIGHLIGHTS
  const windValue = document.createElement('p');
  windValue.classList.add('wind-value');
  windValue.innerHTML = `${todayWind}<span>mph</span>`;
  wind.appendChild(windValue);

  const windDirAbb = document.createElement('div');
  windDirAbb.classList.add('wind-direction-container');
  // windDirAbb.classList.add('wind-dir-abb');

  switch (true) {
    case currentWindDirection >= 0 && currentWindDirection < 11.25:
      addWindDirection('N');
      break;
    case currentWindDirection >= 11.25 && currentWindDirection < 22.5:
      addWindDirection('NbE');
      break;
    case currentWindDirection >= 22.5 && currentWindDirection < 33.75:
      addWindDirection('NNE');
      break;
    case currentWindDirection >= 33.75 && currentWindDirection < 45:
      addWindDirection('NEbN');
      break;
    case currentWindDirection >= 45 && currentWindDirection < 56.25:
      addWindDirection('NE');
      break;
    case currentWindDirection >= 56.25 && currentWindDirection < 67.5:
      addWindDirection('NEbE');
      break;
    case currentWindDirection >= 67.5 && currentWindDirection < 78.75:
      addWindDirection('ENE');
      break;
    case currentWindDirection >= 78.75 && currentWindDirection < 90:
      addWindDirection('EbN');
      break;
    case currentWindDirection >= 90 && currentWindDirection < 101.25:
      addWindDirection('E');
      break;
    case currentWindDirection >= 101.25 && currentWindDirection < 112.5:
      addWindDirection('EbS');
      break;
    case currentWindDirection >= 112.5 && currentWindDirection < 123.75:
      addWindDirection('ESE');
      break;
    case currentWindDirection >= 123.75 && currentWindDirection < 135:
      addWindDirection('SEbE');
      break;
    case currentWindDirection >= 135 && currentWindDirection < 146.25:
      addWindDirection('SE');
      break;
    case currentWindDirection >= 146.25 && currentWindDirection < 157.5:
      addWindDirection('SEbS');
      break;
    case currentWindDirection >= 157.5 && currentWindDirection < 168.75:
      addWindDirection('SSE');
      break;
    case currentWindDirection >= 168.75 && currentWindDirection < 180:
      addWindDirection('SbE');
      break;
    case currentWindDirection >= 180 && currentWindDirection < 191.25:
      addWindDirection('S');
      break;
    case currentWindDirection >= 191.25 && currentWindDirection < 202.5:
      addWindDirection('SbW');
      break;
    case currentWindDirection >= 202.5 && currentWindDirection < 213.75:
      addWindDirection('SSW');
      break;
    case currentWindDirection >= 213.75 && currentWindDirection < 225:
      addWindDirection('SWbS');
      break;
    case currentWindDirection >= 225 && currentWindDirection < 236.25:
      addWindDirection('SW');
      break;
    case currentWindDirection >= 236.25 && currentWindDirection < 247.5:
      addWindDirection('SWbW');
      break;
    case currentWindDirection >= 247.5 && currentWindDirection < 258.75:
      addWindDirection('WSW');
      break;
    case currentWindDirection >= 258.75 && currentWindDirection < 270:
      addWindDirection('WbS');
      break;
    case currentWindDirection >= 270 && currentWindDirection < 281.25:
      addWindDirection('W');
      break;
    case currentWindDirection >= 281.25 && currentWindDirection < 292.5:
      addWindDirection('WbN');
      break;
    case currentWindDirection >= 292.5 && currentWindDirection < 303.75:
      addWindDirection('WNW');
      break;
    case currentWindDirection >= 303.75 && currentWindDirection < 315:
      addWindDirection('NWbW');
      break;
    case currentWindDirection >= 315 && currentWindDirection < 326.25:
      addWindDirection('NW');
      break;
    case currentWindDirection >= 326.25 && currentWindDirection < 337.5:
      addWindDirection('NWbN');
      break;
    case currentWindDirection >= 337.5 && currentWindDirection < 348.75:
      addWindDirection('NNW');
      break;
    case currentWindDirection >= 348.75:
      addWindDirection('NbW');
      break;
    default:
      addWindDirection('Default');
  }

  function addWindDirection(directionAbb) {
    const rotateArrow = currentWindDirection - 45;

    const arrowIconContainer = document.createElement('div');
    arrowIconContainer.classList.add('arrow-icon');
    arrowIconContainer.style.transform = `rotate(${rotateArrow}deg)`;
    arrowIconContainer.innerHTML = `<i class='fas fa-location-arrow'></i>`;

    const windDirection = document.createElement('p');
    windDirection.classList.add('wind-dir-abb');
    windDirection.innerHTML = `${directionAbb}`;

    wind.appendChild(arrowIconContainer);
    wind.appendChild(windDirection);
  }

  // Insert Humidity HIGHLIGHTS
  const humidityValue = document.createElement('p');
  humidityValue.classList.add('wind-value');
  humidityValue.innerHTML = `${todayHumidity}<span>%</span>`;
  humidity.appendChild(humidityValue);

  const humidityBar = document.createElement('div');
  humidityBar.classList.add('w3-container');
  humidityBar.innerHTML = `
        <div class="above-humidityBar">
                <p>0</p>
                <p>50</p>
                <p>100</p>
        </div>
        <div class="w3-light-grey w3-round-xlarge">
            <div class="w3-container w3-yellow w3-round-xlarge" style="width:${todayHumidity}%; height: 8px;"></div>
        </div>
        <div class="below-humidityBar">
                <p>%</p>
        </div>
        `;
  humidity.appendChild(humidityBar);

  // Insert Visibility HIGHLIGHTS
  const visibilityValue = document.createElement('p');
  visibilityValue.classList.add('wind-value');
  visibilityValue.innerHTML = `${todayVisibility} <span>miles</span>`;
  visibility.appendChild(visibilityValue);

  // Insert Air pressure HIGHLIGHTS
  const airPressureValue = document.createElement('p');
  airPressureValue.classList.add('wind-value');
  airPressureValue.innerHTML = `${todayAirPressure} <span>mb</span>`;
  pressure.appendChild(airPressureValue);
}

// RENDER 5 DAYS INFO

function render5DaysInfo(dayList) {
  const filterDayList = dayList.filter((element, index) => {
    return (
      index === 0 || index === 8 || index === 16 || index === 24 || index === 32
    );
  });

  console.log(filterDayList);

  for (const {
    main: { temp_max: tempMax, temp_min: tempMin },
    weather: [{ icon: iconCode }],
    dt_txt: dayDate,
  } of filterDayList) {
    const tempMaxCelsius = Math.floor(tempMax - 273.15);
    const tempMinCelsius = Math.floor(tempMin - 273.15);
    const tempMaxFahrenheit = Math.floor(tempMax);
    const tempMinFahrenheit = Math.floor(tempMin);

    const imgUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const arrayDayDate = [
      dayDate.substr(0, 4),
      dayDate.substr(5, 2),
      dayDate.substr(8, 2),
    ];
    const formatDayDate = `${arrayDayDate[0]}, ${arrayDayDate[1]}, ${arrayDayDate[2]}`;
    const newDate = new Date(formatDayDate);

    // Insert elements into the html
    const card = document.createElement('div');
    card.classList.add('day');
    secondRow.appendChild(card);

    const titleDay = document.createElement('p');
    const iconImg = document.createElement('img');
    iconImg.classList.add('icon-img');
    iconImg.src = imgUrl;
    titleDay.innerHTML = `${weekDays[newDate.getDay()]}, ${newDate.getDate()} ${
      months[newDate.getMonth()]
    }`;
    card.appendChild(titleDay);
    card.appendChild(iconImg);

    const maxTemp = document.createElement('p');
    if (celsiusButton.classList.contains('currentUnit')) {
      maxTemp.classList.add('max-temp');
      maxTemp.innerHTML = `${tempMaxCelsius}ºC`;
    } else {
      maxTemp.classList.add('max-temp-fahrenheit');
      maxTemp.innerHTML = `${tempMaxFahrenheit}ºF`;
    }
    card.appendChild(maxTemp);

    const minTemp = document.createElement('p');
    if (celsiusButton.classList.contains('currentUnit')) {
      minTemp.classList.add('min-temp');
      minTemp.innerHTML = `${tempMinCelsius}ºC`;
    } else {
      minTemp.classList.add('min-temp-fahrenheit');
      minTemp.innerHTML = `${tempMinFahrenheit}ºF`;
    }
    card.appendChild(minTemp);
  }
}

// CELSIUS AND FAHRENHEIT CONVERTION
function changeCelsius(e) {
  console.log(e.target.id);

  const currentCard = document.getElementsByClassName('day');
  const todayTempValue = document.getElementById('todayTempValue');

  for (let i = 0; i < currentCard.length; i++) {
    currentCard[i].style.display = 'none';
  }

  if (e.target.id === 'celsius') {
    celsiusButton.classList.add('currentUnit');
    fahrenheitButton.classList.remove('currentUnit');

    todayTempValue.innerHTML = `${todayTemp}<span>ºC</span>`;

    render5DaysInfo(arrayDays);
  } else {
    celsiusButton.classList.remove('currentUnit');
    fahrenheitButton.classList.add('currentUnit');

    todayTempValue.innerHTML = `${todayTempFahrenheit}<span>ºF</span>`;

    render5DaysInfo(arrayDays);
  }
}
