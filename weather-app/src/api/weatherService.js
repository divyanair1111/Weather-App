import axios from 'axios';

// Use the environment variable for the API key instead of hardcoding it
const API_URL = 'http://localhost:5000/weather';
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;  // Use the environment variable

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
                appid: API_KEY,  // Use the environment variable
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
                appid: API_KEY,  // Use the environment variable
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
                appid: API_KEY,  // Use the environment variable
                units: unit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the forecast data by coordinates:', error);
        return { error: error.response.data.message };
    }
};
