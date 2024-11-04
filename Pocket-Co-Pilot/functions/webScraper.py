# Imports
import requests
from bs4 import BeautifulSoup

# Takes in keyword and location strings

# Get IP and URL
# https://www.airnav.com/airport/kukt
# https://acukwik.com/Airport-Info/KUKT 


input  = 'length Kilo Uniform Kilo Tango'
input_list = input.split()
print (input_list)

# Get Specific Query and Airport
airport = "KUKT" 
query = "AWOS"
response = ""

# Build URL
if (query == 'weather'):
    ip = str('acukwik.com/Weather/' + airport)
    URL = 'https://' + ip + '/'

else:
    ip = str('acukwik.com/Airport-Info/' + airport)
    URL = 'https://' + ip + '/'
    print ('Parsing URL ' + URL + '\n')

# Parse URL
page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')


# Get Informtion From Location
match query:
    case "elevation":
        # Get Elevation
        response_label = soup.find('div', class_='clearboth p3xp bold', string=lambda text: "Elevation" in text.strip())
        response_value = response_label.find_next_sibling('div', class_='clearboth p3px').text.strip()

        print('The elevation of ' + airport + ' is: ' + response_value + ' feet')

    case "length":
        # Get Runway Length
        response_label = soup.find('div', class_='clearboth p3xp bold', string=lambda text: "Longest Primary Runway" in text.strip())
        response_value = response_label.find_next_sibling('div', class_='clearboth p3px').text.strip()

        print('The runway length of ' + airport + ' is: ' + response_value)

    case "weather":
        # Get Weather
        response_label = soup.find('div', class_='w10p fl bold', string=lambda text: "METAR" in text.strip())
        response_value = response_label.find_next_sibling('div', class_='w90p fl').text.strip()

        print(response_value)

    case "UNICOM":
        # Get CTAF/UNICOM
        response_label = soup.find('div', class_='fl w35p bold', string=lambda text: "Frequency" in text.strip())
        response_value = response_label.find_next_sibling('div', class_='fl w65p').text.strip()

        print('The CTAF/UNICOM of ' + airport + ' is: ' + response_value)

    case "AWOS":
        response_value = soup.find('div', class_='w17p fl p3px').text.strip()

        print('The AWOS of ' + airport + ' is: ' + response_value)

    case _:
        print("Not Valid")

# Find Header and Advanced Settings
# main_header = soup.find('div', class_='clearfix TopAirportInfo')
# adv_settings = soup.find(id='advancedSettingsDiv')

# Process Response

# Returns string
# return str(parsed_response)
