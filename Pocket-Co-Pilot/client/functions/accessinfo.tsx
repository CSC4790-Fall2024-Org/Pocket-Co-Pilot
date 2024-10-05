import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';

const App = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = () => {
      // Step 1: Fetch metadata from the /points/{lat},{lon} endpoint
      fetch('https://api.weather.gov/points/38.8894,-77.0352') // Example coordinates for Washington, D.C.
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Access the URLs for daily and hourly forecasts
          const forecastUrl = data.properties.forecast;
          const forecastHourlyUrl = data.properties.forecastHourly;
    
          // Step 2: Fetch daily forecast data
          return Promise.all([
            fetch(forecastUrl).then((res) => res.json()),      // Fetch daily forecast
            fetch(forecastHourlyUrl).then((res) => res.json())  // Fetch hourly forecast
          ]);
        })
        .then(([dailyForecastData, hourlyForecastData]) => {
          // Step 3: Process the forecast data
    
          // Daily Forecast
          const dailyPeriods = dailyForecastData.properties.periods;
          console.log('Daily Forecast:', dailyPeriods);
    
          // Hourly Forecast
          const hourlyPeriods = hourlyForecastData.properties.periods;
          console.log('Hourly Forecast:', hourlyPeriods);
    
          // Example: Store the forecast data in state
          setDailyForecast(dailyPeriods);    // Assuming you have a setDailyForecast state setter
          setHourlyForecast(hourlyPeriods);  // Assuming you have a setHourlyForecast state setter
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    };

    fetchWeatherData();
  }, []);

}
export default App;