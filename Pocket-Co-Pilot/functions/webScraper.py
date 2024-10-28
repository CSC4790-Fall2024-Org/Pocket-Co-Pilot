#Imports
import requests
from bs4 import BeautifulSoup

#Takes in keyword and location strings

#Get IP and URL
# https://www.airnav.com/airport/kukt
# https://acukwik.com/Airport-Info/KUKT 

#Get Specific Query and Airport
airport = "KUKT" 
query = "runway length"

#Build URL
ip = str('acukwik.com/Airport-Info/' + airport)
URL = 'https://' + ip + '/'
print ('Parsing URL ' + URL + '\n')

#Parse URL
page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')

returned_str = ""
print(soup)

#Find Header and Advanced Settings
main_header = soup.find('div', class_='airportInfo')
adv_settings = soup.find(id='advancedSettingsDiv')

print(main_header)

#Get Informtion From Location
match query:
    case "elevation":
        print("elevation")

    case "runway length":
        print("runway length")

    case "weather":
        print("weather")

    case "CTAF/UNICOM":
        print("CTAF/UNICOM")

    case "AWOS":
        print("AWOS")

    case "pattern":
        print("traffic pattern")

    case _:
        print("Not Valid")

#Find Header and Advanced Settings
main_header = soup.find('div', class_='k-header-maintitle-div')
adv_settings = soup.find(id='advancedSettingsDiv')

#Process Response

#Returns string
#return str(parsed_response)
