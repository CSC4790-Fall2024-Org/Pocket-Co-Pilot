#Imports
import requests
from bs4 import BeautifulSoup

#Takes in keyword and location strings

#Get IP and URL
# https://www.airnav.com/airport/kukt
# https://acukwik.com/Airport-Info/KUKT 

#Get Specific Query and Airport
airport = "KUKT" 
query = "weather"

#Build URL
if (query == 'weather'):
    ip = str('acukwik.com/Weather/' + airport)
    URL = 'https://' + ip + '/'

else:
    ip = str('acukwik.com/Airport-Info/' + airport)
    URL = 'https://' + ip + '/'
    print ('Parsing URL ' + URL + '\n')

#Parse URL
page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')


#Get Informtion From Location
match query:
    case "elevation":
        #Get Elevation
        elevation_label = soup.find('div', class_='clearboth p3xp bold', string=lambda text: "Elevation" in text.strip())
        elevation_value = elevation_label.find_next_sibling('div', class_='clearboth p3px').text.strip()
        print('The elevation of ' + airport + ' is: ' + elevation_value + ' feet')

    case "runway length":
        #Get Runway Length
        runway_label = soup.find('div', class_='clearboth p3xp bold', string=lambda text: "Longest Primary Runway" in text.strip())
        runway_value = runway_label.find_next_sibling('div', class_='clearboth p3px').text.strip()
        print('The runway length of ' + airport + ' is: ' + runway_value)

    case "weather":
        #Get Weather
        weather_label = soup.find('div', class_='w10p fl bold', string=lambda text: "METAR" in text.strip())
        weather_value = weather_label.find_next_sibling('div', class_='w90p fl').text.strip()
        print(weather_value)

    case "CTAF/UNICOM":
        #Parse URL
        page = requests.get(URL)
        soup = BeautifulSoup(page.content, 'html.parser')
        
        #Get CTAF/UNICOM
        UNICOM_label = soup.find('div', class_='fl w35p bold', string=lambda text: "Frequency" in text.strip())
        UNICOM_value = UNICOM_label.find_next_sibling('div', class_='fl w65p').text.strip()
        print('The CTAF/UNICOM of ' + airport + ' is: ' + UNICOM_value)

    case "AWOS":
        print("AWOS")

    case _:
        print("Not Valid")

#Find Header and Advanced Settings
# main_header = soup.find('div', class_='clearfix TopAirportInfo')
# adv_settings = soup.find(id='advancedSettingsDiv')

#Process Response

#Returns string
#return str(parsed_response)
