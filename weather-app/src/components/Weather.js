import React, { useState, useEffect } from 'react';
import { getWeather, getForecast, getWeatherByCoordinates, getForecastByCoordinates } from '../api/weatherService';
import './Spinner.css';  // Spinner styles
import './DarkModeSwitch.css';  // For the dark mode switch

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState('');  // Store error message
    const [notification, setNotification] = useState('');  // For friendly notifications
    const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
    const [loading, setLoading] = useState(false); // Loading state
    const [darkMode, setDarkMode] = useState(false); // Dark mode state

    // Automatically detect user's location using geolocation API on component mount
    useEffect(() => {
        if (navigator.geolocation) {
            setLoading(true); // Start loading spinner
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await fetchWeatherByCoordinates(latitude, longitude);
                    setLoading(false); // Stop loading spinner after fetching
                },
                (error) => {
                    handleNotification('Unable to detect your location. Please try entering the city manually.');
                    setLoading(false); // Stop loading spinner if error
                }
            );
        } else {
            handleNotification('Geolocation is not supported by this browser.');
        }
    }, [unit]);  // Re-fetch data when unit changes

    // Apply or remove dark-mode class from body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    // Notification handler to display error messages
    const handleNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 5000);  // Clear after 5 seconds
    };

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const handleSearch = async () => {
        if (city.trim() === "") {
            handleNotification('Please enter a valid city name.');
            return;
        }
        setLoading(true);  // Show spinner when fetching starts
        try {
            const weatherData = await getWeather(city, unit);
            const forecastData = await getForecast(city, unit);
            
            // Check if the city returned by the API matches the input city
            if (weatherData.name.toLowerCase() !== city.toLowerCase()) {
                setError('Invalid city name. Please try again.');
                setWeather(null);
                setForecast([]);
                handleNotification('Invalid city name. Please try again.');
            } else {
                setError('');
                setWeather(weatherData);
                const dailyForecast = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
                setForecast(dailyForecast);
            }
        } catch (error) {
            handleNotification('Failed to fetch weather data. Please try again.');
        } finally {
            setLoading(false);  // Hide spinner when fetching is done
        }
    };
    

    // Fetch weather based on latitude and longitude
    const fetchWeatherByCoordinates = async (lat, lon) => {
        setLoading(true);
        try {
            const weatherData = await getWeatherByCoordinates(lat, lon, unit);
            const forecastData = await getForecastByCoordinates(lat, lon, unit);

            if (weatherData.error) {
                setError(weatherData.error);
                setWeather(null);
                setForecast([]);
                handleNotification('Failed to fetch weather for your location.');
            } else {
                setError('');
                setWeather(weatherData);
                const dailyForecast = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
                setForecast(dailyForecast);
            }
        } catch (error) {
            handleNotification('Network error or failed API request.');
        } finally {
            setLoading(false);
        }
    };

    // Change unit based on user selection
    const handleUnitChange = (e) => {
        setUnit(e.target.value);
    };

    // Toggle Dark Mode
    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };

    const getWeatherIcon = (weather) => {
        const main = weather.toLowerCase();
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
        <div className={`app-container`}>
            {/* Dark Mode Switch */}
            <div className="dark-mode-toggle">
                <label className="switch">
                    <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
                    <span className="slider round"></span>
                </label>
            </div>

            {/* Display notifications */}
            {notification && <div className="notification">{notification}</div>}

            <div>
                <input
                    type="text"
                    value={city}
                    onChange={handleInputChange}
                    placeholder="Enter city name"
                />
                <button onClick={handleSearch}>Get Weather</button>
            </div>

            {/* Radio buttons for selecting units */}
            <div className="unit-toggle">
                <label>
                    <input
                        type="radio"
                        name="unit"
                        value="metric"
                        checked={unit === 'metric'}
                        onChange={handleUnitChange}
                    />
                    Celsius
                </label>
                <label>
                    <input
                        type="radio"
                        name="unit"
                        value="imperial"
                        checked={unit === 'imperial'}
                        onChange={handleUnitChange}
                    />
                    Fahrenheit
                </label>
            </div>

            {/* Show loading spinner if data is being fetched */}
            {loading && <div className="spinner"></div>}

            {!loading && error && <p>{error}</p>}
            {!loading && weather && (
                <div className="weather-info">
                    <h2>{weather.name}</h2>
                    <p>{weather.main.temp} °{unit === 'metric' ? 'C' : 'F'}</p>
                    <p>{weather.weather[0].description}</p>
                    <i className={`fas ${getWeatherIcon(weather.weather[0].main)} weather-icon`}></i>
                </div>
            )}

            {!loading && forecast.length > 0 && (
                <div className="forecast">
                    <h3>5-Day Forecast</h3>
                    <div className="forecast-container">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-day">
                                <h4>{new Date(day.dt_txt).toLocaleDateString()}</h4>
                                <i className={`fas ${getWeatherIcon(day.weather[0].main)} weather-icon`}></i>
                                <p>{day.main.temp} °{unit === 'metric' ? 'C' : 'F'}</p>
                                <p>{day.weather[0].description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;
