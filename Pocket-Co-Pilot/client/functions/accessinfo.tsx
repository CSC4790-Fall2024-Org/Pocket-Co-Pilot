import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';

const App = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = () => {
      fetch('https://api.weather.gov/points/39.7456,-97.0892')
        .then((response) => response.json())
        .then((data) => {
          const forecastUrl = data.properties.forecast;
          return fetch(forecastUrl);
        })
        .then((response) => response.json())
        .then((forecastData) => {
          setForecast(forecastData.properties.periods);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    };

    fetchWeatherData();
  }, []);

}
export default App;