const keyWeather = '920e3027785794efbb01f56d47cbc19a';
const keyIP = '692606bdba174a4f8791317ee3c90ca4'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Selectors 
const wrapper = document.querySelector(".wrapper");


// Current location coordinates.

    fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${keyIP}`)
    .then(res => res.json())
    .then(result => {
        console.log(result.latitude)
        console.log(result.longitude)
        getWeather(result)
    })
    .catch(error => console.log(error));




    // Get the location coordinates
    function getWeather(geo) {

        const {latitude:lat, longitude:lon, city, country} = geo;
    
    
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${keyWeather}`)
                .then(res => res.json())
                .then(result => {
                    console.log(`${city}, ${country}`)
                    console.log(result);
                    renderWeatherInfo(result)
                })
                .catch(err => {
                    console.log(err);
                })
    };

    // Display the weather info

    function renderWeatherInfo(weatherInfo) {

        for (let i = 0; i < 35; i += 8) {
            const visibility = (weatherInfo.list[i].visibility / 1609).toFixed(1); //convert meters to miles
            const windSpeed = Math.floor(weatherInfo.list[i].wind.speed * 2.237);
            const airPressure = weatherInfo.list[i].main.pressure;
            const humidity = weatherInfo.list[i].main.humidity
            const tempMax = Math.floor(weatherInfo.list[i].main.temp_max - 273.15);
            const tempMin = Math.floor(weatherInfo.list[i].main.temp_min - 273.15);
            const currentTemp = Math.floor(weatherInfo.list[i].main.temp - 273.15);
            const icon = weatherInfo.list[i].weather[0].icon; 
            const imgUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
            
            const dayDate = weatherInfo.list[i].dt_txt;
            const arrayDayDate = [dayDate.substr(0,4), dayDate.substr(5,2), dayDate.substr(8,2)];
            const formatDayDate = `${arrayDayDate[0]}, ${arrayDayDate[1]}, ${arrayDayDate[2]}`
            const newDate = new Date(formatDayDate);

            const card = document.createElement('div');
            card.classList.add('day');
            wrapper.appendChild(card);
            
            const titleDay = document.createElement('p');
            const iconImg = document.createElement('img');
            iconImg.src = imgUrl; 
            titleDay.innerHTML = `${weekDays[newDate.getDay()]}, ${newDate.getDate()} ${months[newDate.getMonth()]}`;
            card.appendChild(titleDay);
            card.appendChild(iconImg);
            
            console.log(icon);

        }



        // console.log(`${visibility} miles`);
        // console.log(`${airPressure} mb`);
        // console.log(`${tempMax} ºC`);
        // console.log(`${tempMin} ºC`);
        // console.log(`${currentTemp} ºC`);
        // console.log(`${windSpeed} mph`);
        // console.log(`${humidity} %`);
        // console.log(imgUrl);
        // console.log(newDate);
        // console.log(`${weekDays[newDate.getDay()]}, ${newDate.getDate()} ${months[newDate.getMonth()]}`);
    
    }
