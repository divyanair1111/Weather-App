import React, { useState } from 'react';
import { getWeather } from '../api/weatherService';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const handleSearch = async () => {
        const data = await getWeather(city);
        if (data.error) {
            setError(data.error);
            setWeather(null);
        } else {
            setError('');
            setWeather(data);
        }
    };

    const getWeatherIcon = (weather) => {
        const main = weather.main.toLowerCase();
        switch (main) {
            case 'clear':
                return 'fa-sun';
            case 'clouds':
                return 'fa-cloud';
            case 'rain':
                return 'fa-cloud-showers-heavy';
            case 'snow':
                return 'fa-snowflake';
            case 'thunderstorm':
                return 'fa-bolt';
            default:
                return 'fa-smog';
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={city}
                    onChange={handleInputChange}
                    placeholder="Enter city name"
                />
                <button onClick={handleSearch}>Get Weather</button>
            </div>

            {error && <p>{error}</p>}
            {weather && (
                <div className="weather-info">
                    <h2>{weather.name}</h2>
                    <p>{weather.main.temp} °C</p>
                    <p>{weather.weather[0].description}</p>
                    <i className={`fas ${getWeatherIcon(weather.weather[0])} weather-icon`}></i>
                </div>
            )}
        </div>
    );
};

export default Weather;
