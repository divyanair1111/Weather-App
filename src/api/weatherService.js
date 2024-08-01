import axios from 'axios';

const API_URL = 'http://localhost:5000/weather';

export const getWeather = async (city) => {
    try {
        const response = await axios.get(API_URL, {
            params: { city }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching the weather data:', error);
        return { error: error.response.data.error };
    }
};
