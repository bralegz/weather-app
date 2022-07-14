const keyWeather = '920e3027785794efbb01f56d47cbc19a';
const keyIP = '692606bdba174a4f8791317ee3c90ca4'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Selectors 
const todayIconContainer = document.querySelector(".today-iconContainer");
const todayInfoContainer = document.querySelector(".today-infoContainer");
const secondRow = document.querySelector(".second-row");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility");
const pressure = document.querySelector(".pressure");


// Current location coordinates.

    fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${keyIP}`)
    .then(res => res.json())
    .then(result => {
        // console.log(result.latitude)
        // console.log(result.longitude)
        getWeather(result)
        // console.log(result)
    })
    .catch(error => console.log(error));




    // Get the API data
    function getWeather(geo) {

        const {latitude:lat, longitude:lon, city, country} = geo;


        // FETCH TODAY DATA
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keyWeather}`)
            .then(res => res.json())
            .then(currentDayResult => {
                console.log(currentDayResult)
                //result destructuring
                const {
                    main: {humidity: currentHumidity, pressure: currentPressure, temp: currentTemp},
                    visibility: currentVisibility,
                    wind: {speed: currentSpeed},
                    weather: [
                        {
                            icon: currentIcon,
                            main: mainWeather
                        }
                    ]
                
                } = currentDayResult;

                const todayInfo = [currentTemp, currentSpeed, currentHumidity, currentVisibility, currentPressure, currentIcon, mainWeather, city];
                
                renderCurrentDay(todayInfo);
            })
    
        //FETCH 5 DAYS DATA
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${keyWeather}`)
                .then(res => res.json())
                .then(result5Days => {
                    // console.log(`${city}, ${country}`)
                    // console.log(result5Days);
                    const {list: dayList} = result5Days;

                    render5DaysInfo(dayList)
                })
                .catch(err => {
                    console.log(err);
                })
    };

    // RENDER TODAY INFO

    function renderCurrentDay (todayInfo) {
        const todayTemp =  Math.floor(todayInfo[0] - 273.15);
        const todayWind = Math.floor(todayInfo[1] * 2.237); //convert to mph
        const todayHumidity = todayInfo[2];
        const todayVisibility = ( todayInfo[3] / 1609).toFixed(1);
        const todayAirPressure = todayInfo[4];
        const todayIcon = todayInfo[5]
        const todayMain = todayInfo[6]
        const currentCity = todayInfo[7]
        const newDate = new Date();


        // Insert today's icon image.

        const imgUrl = `http://openweathermap.org/img/wn/${todayIcon}@2x.png`
        const iconImg = document.createElement('img');
        iconImg.src = imgUrl;
        todayIconContainer.appendChild(iconImg);

        //Insert today's info.
        const todayTempValue = document.createElement('p');
        todayTempValue.classList.add('todayTempValue');
        todayTempValue.innerHTML = `${todayTemp}<span>ºC</span>`;
        todayInfoContainer.appendChild(todayTempValue);

        const todayMainWeather = document.createElement('p');
        todayMainWeather.classList.add('today-main-weather');
        todayMainWeather.innerHTML = `${todayMain}`;
        todayInfoContainer.appendChild(todayMainWeather)

        const todayDate = document.createElement('p');
        todayDate.classList.add("today-date");
        todayDate.innerHTML = `Today - ${weekDays[newDate.getDay()]}, ${newDate.getDate()} ${months[newDate.getMonth()]}`;
        todayInfoContainer.appendChild(todayDate);

        const todayCity = document.createElement('p');
        todayCity.classList.add("today-city");
        todayCity.innerHTML = `<i class="fa fa-map-marker" style="font-size:24px"></i> ${currentCity}`
        todayInfoContainer.appendChild(todayCity);



        // INSERT HTML INTO HIGHLIGHTS CARDS
        const windValue = document.createElement('p');
        windValue.classList.add('wind-value');
        windValue.innerHTML = `${todayWind}<span>mph</span>`
        wind.appendChild(windValue);

        const humidityValue = document.createElement('p');
        humidityValue.classList.add('wind-value');
        humidityValue.innerHTML = `${todayHumidity}<span>%</span>`
        humidity.appendChild(humidityValue);

        const visibilityValue = document.createElement('p');
        visibilityValue.classList.add('wind-value');
        visibilityValue.innerHTML = `${todayVisibility} <span>miles</span>`
        visibility.appendChild(visibilityValue);

        const airPressureValue = document.createElement('p');
        airPressureValue.classList.add('wind-value');
        airPressureValue.innerHTML = `${todayAirPressure} <span>mb</span>`
        pressure.appendChild(airPressureValue);


    }

    // RENDER 5 DAYS INFO

    function render5DaysInfo(dayList) {
        
        const filterDayList  = dayList.filter((element, index) => {
            return index === 0 || index === 8 || index === 16 || index === 24 || index === 32
        });

        console.log(filterDayList)

        for( const {main: {temp_max: tempMax, temp_min: tempMin}, weather: [{icon: iconCode}], dt_txt: dayDate} of filterDayList) {
            
            const imgUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`

            const arrayDayDate = [dayDate.substr(0,4), dayDate.substr(5,2), dayDate.substr(8,2)];
            const formatDayDate = `${arrayDayDate[0]}, ${arrayDayDate[1]}, ${arrayDayDate[2]}`
            const newDate = new Date(formatDayDate);

            // Insert elements into the html
            const card = document.createElement('div');
            card.classList.add('day');
            secondRow.appendChild(card);

            const titleDay = document.createElement('p');
            const iconImg = document.createElement('img');
            iconImg.src = imgUrl; 
            titleDay.innerHTML = `${weekDays[newDate.getDay()]}, ${newDate.getDate()} ${months[newDate.getMonth()]}`;
            card.appendChild(titleDay);
            card.appendChild(iconImg);


        }
    
    }


