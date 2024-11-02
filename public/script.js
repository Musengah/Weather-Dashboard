document.addEventListener('DOMContentLoaded', () => {
    const storedLocation = localStorage.getItem('userLocation');

    if (storedLocation) {
        const { latitude, longitude } = JSON.parse(storedLocation);
        fetchWeather(latitude, longitude);
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
                fetchWeather(latitude, longitude);
            }, error => {
                console.error('Error getting geolocation:', error);
                alert('Unable to retrieve your location. Please search for a city manually.');
            });
        } else {
            alert('Geolocation is not supported by your browser. Please search for a city manually.');
        }
    }
});

document.getElementById('searchBtn').addEventListener('click', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    if (city) {
        localStorage.removeItem('userLocation'); // Clear stored location when searching for a new city
        fetchWeatherByCity(city);
    }
});

function fetchWeather(latitude, longitude) {
    fetch(`/weather?lat=${latitude}&lon=${longitude}`)
        .then(response => response.text())
        .then(data => {
            document.body.innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('An error occurred. Please try again later.');
        });
}

function fetchWeatherByCity(city) {
    fetch(`/weather?city=${city}`)
        .then(response => response.text())
        .then(data => {
            document.body.innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('An error occurred. Please try again later.');
        });
}