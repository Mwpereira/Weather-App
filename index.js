//Get time
function getTime() {
    var timezone = sessionStorage.getItem('timezone');
    const options = { minute: 'numeric' };
    let minute = new Date().toLocaleTimeString([], options);
    timezone = timezone / 3600;
    var d = new Date();
    var hour = d.getUTCHours() + timezone;
    let dt;
    if (hour > 24) {
        hour = hour - 24;
        dt = 'AM';
    } else if (hour >= 12) {
        dt = 'PM';
        if (hour > 12) {
            hour = hour - 12;
        }
    } else if (hour < 0) {
        dt = 'PM';
        hour = 12 + hour;
    } else {
        dt = 'AM';
        if (hour == 0 || hour == 24) {
            hour = 12;
        }
    }
    if (minute < 10) {
        minute = '0' + minute.toString();
    }
    document.getElementById(
        'time'
    ).innerHTML = `Current Time: ${hour}:${minute} ${dt} (Location Based)`;
}

//Get hour
function getHour() {
    var timezone = sessionStorage.getItem('timezone');
    timezone = timezone / 3600;
    var d = new Date();
    var hour = d.getUTCHours() + timezone;
    var d = new Date();
    var n = d.getHours();
    return n;
}

//Load Location
function loadLocation() {
    let apiKey = '1e77fb69d26c242a76402146e8484da8';
    let location;
    if (
        localStorage.getItem('city') != undefined ||
        localStorage.getItem('state') != undefined
    ) {
        location =
            localStorage.getItem('city') + ', ' + localStorage.getItem('state');
    } else {
        location = 'Toronto, Ontario ';
    }
    document.getElementById('location').innerHTML =
        'Location:  ' + location + ' ';
    let temperature, prediction;
    fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
    ).then((response) => {
        response.json().then((data) => {
            if (response.status != 404) {
                sessionStorage.setItem('timezone', data.timezone);
                temperature = data.main.temp;
                prediction = data.weather[0].main;
                document.getElementById('temperature').innerHTML =
                    'Temperature:  ' + Math.round(temperature - 273.15) + '°C';
                document.getElementById('prediction').innerHTML =
                    'Prediction:  ' + prediction;
                switch (prediction) {
                    case 'Sunny':
                    case 'Clear':
                        if (
                            getHour(data.timezone) <= '6' ||
                            getHour(data.timezone) >= '18'
                        ) {
                            document.getElementById('weather-icon').src =
                                'moon.gif';
                        } else {
                            document.getElementById('weather-icon').src =
                                'sunny.png';
                        }
                        break;
                    case 'Clouds':
                        document.getElementById('weather-icon').src =
                            'cloudy.png';
                        break;
                    case 'Rain':
                        document.getElementById('weather-icon').src =
                            'raining.png';
                        break;
                    case 'Snow':
                        document.getElementById('weather-icon').src =
                            'snowing.png';
                        break;
                    case 'Mist':
                        document.getElementById('weather-icon').src =
                            'mist   .png';
                        break;
                }
            } else {
                temperature = 'N/A';
                prediction = 'N/A';
                document.getElementById('temperature').innerHTML =
                    'Temperature:  ' + temperature;
                document.getElementById('prediction').innerHTML =
                    'Prediction:  ' + prediction;
                document.getElementById('weather-icon').src = 'error.png';
            }
        });
    });
    setInterval(getTime, 1000);
}

document.getElementById('compass').addEventListener('click', (e) => {
    let info = prompt('Format: City, State');
    let infoArr = info.split(',');
    setLocation(infoArr[0], infoArr[1]);
    location.reload();
});

//Set Location
function setLocation(city, state) {
    localStorage.setItem('city', city);
    localStorage.setItem('state', state);
}

//Switch background colors
document.getElementById('first-button').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementsByTagName('body')[0].style.background =
        'linear-gradient(#2d142c, #510a32, #801336, #c72c41, #ee4540)';
    setTheme(1);
});

document.getElementById('second-button').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementsByTagName('body')[0].style.background =
        'linear-gradient(#325d79, #9bd7d1, #efeeee, #f9a26c, #f26627)';
    setTheme(2);
});

document.getElementById('third-button').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementsByTagName('body')[0].style.background =
        'linear-gradient(#475c7a, #685d79, #ab6c82, #d8737f, #fcbb6d)';
    setTheme(3);
});

document.getElementById('fourth-button').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementsByTagName('body')[0].style.background =
        'linear-gradient(#305f72, #568ea6, #f1d1b5, #f0b7a4, #f18c8e)';
    setTheme(4);
});

//Save background color chosen
function setTheme(theme) {
    if (localStorage.getItem('theme') != undefined) {
        localStorage.setItem('theme', theme);
    }
}

//Load background color saved in local storage
function loadTheme() {
    if (localStorage.getItem('theme') != undefined) {
        let theme = localStorage.getItem('theme');
        let body = document.getElementsByTagName('body')[0];
        switch (theme) {
            case '2':
                body.style.background =
                    'linear-gradient(#325d79, #9bd7d1, #efeeee, #f9a26c, #f26627)';
                break;
            case '3':
                body.style.background =
                    'linear-gradient(#475c7a, #685d79, #ab6c82, #d8737f, #fcbb6d)';
                break;
            case '4':
                body.style.background =
                    'linear-gradient(#305f72, #568ea6, #f1d1b5, #f0b7a4, #f18c8e)';
                break;
            default:
                body.style.background =
                    'linear-gradient(#2d142c, #510a32, #801336, #c72c41, #ee4540)';
                break;
        }
    } else {
        document.getElementsByTagName('body')[0].style.background =
            'linear-gradient(#2d142c, #510a32, #801336, #c72c41, #ee4540)';
        localStorage.setItem('theme', 1);
    }
}

loadTheme();

loadLocation();
