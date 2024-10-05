import { useEffect, useState } from 'react';
//import { View, Text, ActivityIndicator, FlatList } from 'react-native';

interface ForecastPeriod {
  name: string;
  temperature: number;
  temperatureUnit: string;
  shortForecast: string;
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = () => {
      fetch('https://api.weather.gov/points/38.8894,-77.0352')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response failed');
          }
          
          const results = response.json();
          console.log(results);

          return response.json();
        })

        .then((data) => {
          // Get the URLs for daily and hourly forecasts
          const forecastUrl = data.properties.forecast;
          const forecastHourlyUrl = data.properties.forecastHourly;

          // Fetch daily and hourly forecasts
          //return Promise.all([
          //  fetch(forecastUrl).then((res) => res.json()),      // Fetch daily forecast
          //  fetch(forecastHourlyUrl).then((res) => res.json())  // Fetch hourly forecast
          //]);
        })

        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    };

    // Fetch the weather data when the component mounts
    fetchWeatherData();
  }, []);

};

export default App;