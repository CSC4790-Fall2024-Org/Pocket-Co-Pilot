#Imports
import requests
from bs4 import BeautifulSoup

#Takes in keyword and location strings

#Get IP and URL
# https://www.airnav.com/airport/kukt

#Get Specific Query and Airport
airport = "KUKT" 
query = "runway length"

#Build URL
ip = str(input('www.airnav.com/airport/' + airport + '\n'))
URL = 'https://' + ip + '/'
print ('Parsing URL ' + URL + '\n')

#Parse URL
page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')

#Get Informtion From Location
match query:
    case "runway length":
        print("runway length")
    case "elevation":
        print("elevation")
    case "weather":
        print("weather")
    case _:
        print("Not Valid")

#Find Header and Advanced Settings
main_header = soup.find('div', class_='k-header-maintitle-div')
adv_settings = soup.find(id='advancedSettingsDiv')

#Process Response

#Returns string
#return str(parsed_response)
