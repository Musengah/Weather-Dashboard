const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index', { weather: null, forecast: null, error: null });
});

app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.API_KEY;
    let url;

    if (city) {
        url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;
    } else if (lat && lon) {
        url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`;
    } else {
        return res.render('index', { weather: null, forecast: null, error: 'Please provide a city or coordinates.' });
    }

    try {
        console.log(`Fetching weather data for: ${city || `${lat},${lon}`}`);
        const response = await axios.get(url);
        console.log('Weather data received:', response.data);
        const weather = {
            city: response.data.location.name,
            temperature: response.data.current.temp_c,
            description: response.data.current.condition.text,
            humidity: response.data.current.humidity,
            windSpeed: response.data.current.wind_kph,
            icon: response.data.current.condition.icon
        };
        const forecast = response.data.forecast.forecastday.map(day => ({
            date: day.date,
            maxTemp: day.day.maxtemp_c,
            minTemp: day.day.mintemp_c,
            condition: day.day.condition.text,
            icon: day.day.condition.icon
        }));
        res.render('index', { weather, forecast, error: null });
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.error('City not found:', city);
            res.render('index', { weather: null, forecast: null, error: 'City not found. Please try again.' });
        } else {
            console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
            res.render('index', { weather: null, forecast: null, error: 'An error occurred. Please try again later.' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});