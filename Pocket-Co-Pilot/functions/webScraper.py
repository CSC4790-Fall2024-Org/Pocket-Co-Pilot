# Web Scraper format
# Original: 3 AUG 2020 - Bell Labs, Murray Hill
# Current: 14 FEB 2022 - Villanova University
# Version: 1.0

#Imports
import requests
from bs4 import BeautifulSoup

#Get IP and URL
ip = str(input('Enter the IP Adresses:\n'))
URL = 'https://' + ip + '/'
print ('Parsing URL ' + URL + '\n')

#Parse URL
page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')

#Find Header and Advanced Settings
main_header = soup.find('div', class_='k-header-maintitle-div')
adv_settings = soup.find(id='advancedSettingsDiv')

#
