import axios from 'axios';
import 'dotenv/config';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";

import OpenAI from "openai";
const openaiKey = process.env.OPEN_AI_API_KEY;
console.log(typeof openaiKey);
const openai = new OpenAI({ apiKey: openaiKey });

// const genAI = new GoogleGenerativeAI(`OPEN_AI_API_KEY`);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function airportInfoQuery(input: string) {
  // Determine airport from phonetic alphabet
  console.log('Input in airport info: ' + input + '\n');
  const inputCapitalized = input.toUpperCase();
  const inputList = inputCapitalized.split(' ');
  const airport = inputList.slice(-4).map(word => word[0]).join('').toUpperCase();
  console.log('Airport: ' + airport + '\n');

  // Find keyword
  let query: string;
  if (inputList.includes('ELEVATION')) {
    query = 'ELEVATION';
    console.log('Elevation query\n');
  } else if (inputList.includes('LENGTH')) {
    query = 'LENGTH';
    console.log('Length query\n');
  } else if (inputList.includes('WEATHER') && inputList.includes('FREQUENCY')) {
    query = 'AWOS';
    console.log('AWOS query\n');
  } else if (inputList.includes('WEATHER')) {
    query = 'WEATHER';
    console.log('Weather query\n');
  } else if (inputList.includes('UNICOM')) {
    query = 'UNICOM';
    console.log('UNICOM query\n');
  }  else {
    query = 'INVALID QUERY';
    console.log('Invalid query\n');
  }

  // // Build URL
  // let URL: string;
  // if (query === 'weather') {
  //   URL = `https://acukwik.com/Weather/${airport}/`;
  // } else {
  //   URL = `https://acukwik.com/Airport-Info/${airport}/`;
  //   console.log('Parsing URL ' + URL + '\n');
  // }

  // Parse URL and process response
  try {
    // const response = await axios.get(URL);
    // const $ = cheerio.load(response.data);

    switch (query) {
      case 'ELEVATION': {
        const result = `Return the airport elevation for the airport with the icao identifer of ${airport}`;
        console.log(result);
        return await getAirportInfoOpenAI(result);
      }
      case 'LENGTH': {
        // Get Runway Length
        const result = `Return the airport length for the airport with the icao identifer of ${airport}`;
        console.log(result);
        return await getAirportInfoOpenAI(result);
      }
      case 'WEATHER': {
        // Get current METAR weather data for the specified airport
        const result = await fetch(`https://aviationweather.gov/api/data/metar?ids=${airport}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text(); // METAR data comes as plain text
            })
            .then(data => {
                // Check if we received any data
                if (!data || data.trim() === '') {
                    return `No weather data available for airport ${airport}`;
                }
                const metarEnglish = getWeatherReport(data);
                // Remove any extra whitespace and newlines
                const cleanMetar = data.trim();
                
                // Format the response
                return `The current weather for airport ${airport} is: ${metarEnglish}\n\nMETAR: ${cleanMetar}`;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                return `Error fetching weather information for airport ${airport}`;
            });
    
        console.log(result);
        return result;
    }
      case 'UNICOM': {
        // Get CTAF/UNICOM frequency for the specified airport
        const result = await fetch(`https://api.aviationapi.com/v1/airports?apt=${airport}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // The API returns an object with the airport code as the key
                const airportData = data[airport];
                
                //Check if airport data and UNICOM frequency exist
                if (!airportData || !airportData[0].unicom) {
                    return `No UNICOM frequency found for airport ${airport}`;
                }
                
                // Return formatted string with UNICOM information
                return `The UNICOM for the airport ${airport} is ${airportData[0].unicom}`;
            })
            .catch(error => {
                console.error('Error fetching UNICOM data:', error);
                return `Error fetching UNICOM information for airport ${airport}`;
            });
    
        console.log(result);
        return result;
    }
      case 'AWOS': {
        const result = `What is the AWOS frequency for the airport with the icao identifier of ${airport}`;
        console.log(result);
        return await getAirportInfoOpenAI(result);
      }
      case 'INVALID QUERY': {
        return "The query is not valid. Please try again with a valid query.";
      }
      default:
        return { result: "Not Valid" };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: 'Error fetching data' };
  }
}

async function getAirportInfoOpenAI(query: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are knowledgeable about all the airports and their icao codes. Your job is to return information to the user efficiently and in one sentence." },
      {
        role: "user",
        content: query,
      },
    ],
  });
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}



// async function generateContentWithGemini(prompt: string): Promise<{ result: string }> {
//   try {
//     const result = await model.generateContent(prompt);
//     return { result: result.response.text() };
//   } catch (error) {
//     console.error('Error generating content with Gemini:', error);
//     return { result: 'Error generating content with Gemini' };
//   }
// }

function translateMetar(metarString) {
  // Remove any extra spaces and split into components
  const parts = metarString.trim().split(' ');
  let translation = [];
  
  // Weather condition codes and their meanings
  const weatherCodes = {
      // Intensity
      '-': 'light',
      '+': 'heavy',
      'VC': 'vicinity',
      
      // Descriptors
      'MI': 'shallow',
      'PR': 'partial',
      'BC': 'patches',
      'DR': 'low drifting',
      'BL': 'blowing',
      'SH': 'showers',
      'TS': 'thunderstorm',
      'FZ': 'freezing',
      
      // Precipitation
      'RA': 'rain',
      'SN': 'snow',
      'SG': 'snow grains',
      'IC': 'ice crystals',
      'PL': 'ice pellets',
      'GR': 'hail',
      'GS': 'small hail',
      'DZ': 'drizzle',
      'UP': 'unknown precipitation',
      
      // Obscuration
      'BR': 'mist',
      'FG': 'fog',
      'FU': 'smoke',
      'VA': 'volcanic ash',
      'DU': 'widespread dust',
      'SA': 'sand',
      'HZ': 'haze',
      'PY': 'spray',
      
      // Other
      'PO': 'dust/sand whirls',
      'SQ': 'squalls',
      'FC': 'funnel cloud',
      'SS': 'sandstorm',
      'DS': 'duststorm'
  };

  // Cloud coverage codes
  const cloudCodes = {
      'SKC': 'sky clear',
      'CLR': 'clear',
      'FEW': 'few clouds',
      'SCT': 'scattered clouds',
      'BKN': 'broken clouds',
      'OVC': 'overcast',
      'VV': 'vertical visibility'
  };

  try {
      // Parse each part of the METAR
      parts.forEach((part, index) => {
          // Airport identifier (first part)
          if (index === 0) {
              translation.push(`At ${part}`);
              return;
          }

          // Date/Time Group (second part)
          if (index === 1 && part.length === 7 && /^\d{6}Z$/.test(part)) {
              const day = part.substring(0, 2);
              const hour = part.substring(2, 4);
              const minute = part.substring(4, 6);
              translation.push(`on day ${day} at ${hour}:${minute} UTC`);
              return;
          }

          // Wind information
          if (/^\d{3}(\d{2}|KT)/.test(part)) {
              const direction = part.substring(0, 3);
              const speed = part.substring(3, 5);
              translation.push(`winds from ${direction}° at ${speed} knots`);
              return;
          }

          // Visibility
          if (/^\d{1,2}SM$/.test(part)) {
              translation.push(`visibility ${part.replace('SM', ' statute miles')}`);
              return;
          }

          // Cloud coverage
          for (const [code, meaning] of Object.entries(cloudCodes)) {
              if (part.startsWith(code)) {
                  const height = part.slice(3) || '';
                  const altitude = height ? ` at ${parseInt(height) * 100} feet` : '';
                  translation.push(`${meaning}${altitude}`);
                  return;
              }
          }

          // Temperature and dew point
          if (/^M?\d{2}\/M?\d{2}$/.test(part)) {
              const [temp, dewpoint] = part.split('/').map(t => {
                  const value = parseInt(t.replace('M', '-'));
                  return `${value}°C`;
              });
              translation.push(`temperature ${temp} with dew point ${dewpoint}`);
              return;
          }

          // Altimeter setting
          if (/^A\d{4}$/.test(part)) {
              const pressure = `${part.substring(1, 3)}.${part.substring(3)}`;
              translation.push(`altimeter ${pressure} inches of mercury`);
              return;
          }

          // Weather phenomena
          let weatherPart = part;
          let intensity = '';
          
          // Check for intensity first
          if (weatherPart.startsWith('+') || weatherPart.startsWith('-')) {
              intensity = weatherCodes[weatherPart[0]] + ' ';
              weatherPart = weatherPart.slice(1);
          }

          // Try to match weather codes
          for (const [code, meaning] of Object.entries(weatherCodes)) {
              if (weatherPart.includes(code)) {
                  translation.push(`${intensity}${meaning}`);
                  return;
              }
          }
      });

      // Join all translations with proper punctuation
      return translation
          .filter(t => t) // Remove empty strings
          .join(', ')
          .replace(/, ([^,]*)$/, ', and $1') + '.';

  } catch (error) {
      console.error('Error parsing METAR:', error);
      return 'Error translating METAR data. Please check the format.';
  }
}

// Example usage:
function getWeatherReport(metar) {
  const translation = translateMetar(metar);
  console.log('Original METAR:', metar);
  console.log('Translation:', translation);
  return translation;
}

// const metar = "KJFK 142151Z 28023G34KT 10SM SCT060 BKN150 27/16 A2989";
// const humanReadable = translateMetar(metar);
// console.log(humanReadable);
// Output: "At KJFK on day 14 at 21:51 UTC, winds from 280° at 23 knots gusting to 34 knots, 
// visibility 10 statute miles, scattered clouds at 6000 feet, broken clouds at 15000 feet, 
// temperature 27°C with dew point 16°C, and altimeter 29.89 inches of mercury."
// Example METAR:
// KJFK 142151Z 28023G34KT 10SM SCT060 BKN150 BKN250 27/16 A2989 RMK AO2 PK WND 30033/2122 SLP123 T02670161