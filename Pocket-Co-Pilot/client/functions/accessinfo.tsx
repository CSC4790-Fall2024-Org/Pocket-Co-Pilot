import {useState, useEffect} from 'react';

// Make a new component 
const infoAPI = ({})=>{

  const [data, setData] = useState();

  useEffect(() => {
    // Arrow function that wraps our effect logic 
    const getWeatherData = async () => {
      try {

        // Use browser fetch -> HTTP GET $url
        const response = await fetch('https://api.weather.gov/points/38.8894,-77.0352');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();

        // Update state
        setData(jsonData);
        
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Run effect once
    if (!data) {
      getWeatherData();
    }

  }, [data]);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;

}

export default infoAPI;
