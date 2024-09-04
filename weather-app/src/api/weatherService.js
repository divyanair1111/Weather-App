import axios from 'axios';

const API_URL = 'http://localhost:5000/weather';
const API_KEY = '97c7014b915315fdd9966c507ede2e41'; 
export const getWeather = async (city, unit = 'metric') => {
    try {
        const response = await axios.get(API_URL, {
            params: { city, units: unit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the weather data:', error);
        return { error: error.response.data.error };
    }
};

// Function to fetch 5-day forecast data
export const getForecast = async (city, unit = 'metric') => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast`, {
            params: {
                q: city,
                appid: API_KEY,
                units: unit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the forecast data:', error);
        return { error: error.response.data.message };
    }
};

// Fetch weather by coordinates
export const getWeatherByCoordinates = async (lat, lon, unit = 'metric') => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather`, {
            params: {
                lat,
                lon,
                appid: API_KEY,
                units: unit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the weather data by coordinates:', error);
        return { error: error.response.data.error };
    }
};

// Fetch forecast by coordinates
export const getForecastByCoordinates = async (lat, lon, unit = 'metric') => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast`, {
            params: {
                lat,
                lon,
                appid: API_KEY,
                units: unit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the forecast data by coordinates:', error);
        return { error: error.response.data.message };
    }
};