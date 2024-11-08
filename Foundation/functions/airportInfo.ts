import axios from 'axios';
import * as cheerio from 'cheerio';

export async function airportInfoQuery(input: string) {
  // Determine airport from phonetic alphabet
  const inputList = input.split(' ');
  const airport = inputList.slice(-4).map(word => word[0]).join('');

  // Find keyword
  let query: string;
  if (inputList.includes('elevation')) {
    query = 'elevation';
  } else if (inputList.includes('length')) {
    query = 'length';
  } else if (inputList.includes('weather')) {
    query = 'weather';
  } else if (inputList.includes('UNICOM')) {
    query = 'UNICOM';
  } else if (inputList.includes('AWOS')) {
    query = 'AWOS';
  } else {
    query = '';
  }

  // Build URL
  let URL: string;
  if (query === 'weather') {
    URL = `https://acukwik.com/Weather/${airport}/`;
  } else {
    URL = `https://acukwik.com/Airport-Info/${airport}/`;
    console.log('Parsing URL ' + URL + '\n');
  }

  // Parse URL and process response
  try {
    const response = await axios.get(URL);
    const $ = cheerio.load(response.data);

    switch (query) {
      case 'elevation': {
        // Get Elevation
        const responseLabel = $('div.clearboth.p3xp.bold').filter((_, el) =>
          $(el).text().trim().includes("Elevation")
        );
        const responseValue = responseLabel.next('div.clearboth.p3px').text().trim();
        return { result: `The elevation of ${airport} is: ${responseValue} feet` };
      }
      case 'length': {
        // Get Runway Length
        const responseLabel = $('div.clearboth.p3xp.bold').filter((_, el) =>
          $(el).text().trim().includes("Longest Primary Runway")
        );
        const responseValue = responseLabel.next('div.clearboth.p3px').text().trim();
        return { result: `The runway length of ${airport} is: ${responseValue}` };
      }
      case 'weather': {
        // Get Weather
        const responseLabel = $('div.w10p.fl.bold').filter((_, el) =>
          $(el).text().trim().includes("METAR")
        );
        const responseValue = responseLabel.next('div.w90p.fl').text().trim();
        return { result: responseValue };
      }
      case 'UNICOM': {
        // Get CTAF/UNICOM
        const responseLabel = $('div.fl.w35p.bold').filter((_, el) =>
          $(el).text().trim().includes("Frequency")
        );
        const responseValue = responseLabel.next('div.fl.w65p').text().trim();
        return { result: `The CTAF/UNICOM of ${airport} is: ${responseValue}` };
      }
      case 'AWOS': {
        // Get AWOS
        const responseValue = $('div.w17p.fl.p3px').text().trim();
        return { result: `The AWOS of ${airport} is: ${responseValue}` };
      }
      default:
        return { result: "Not Valid" };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: 'Error fetching data' };
  }
}