import requests
from bs4 import BeautifulSoup

async def callPythonFunction(input_text):
    input_list = input_text.split()
    airport = ''.join(word[0] for word in input_list[-4:])
    print(airport)

    # Get Specific Query and Airport
    query = "AWOS"
    response = ""

    # Build URL
    if query == 'weather':
        ip = str('acukwik.com/Weather/' + airport)
        URL = 'https://' + ip + '/'
    else:
        ip = str('acukwik.com/Airport-Info/' + airport)
        URL = 'https://' + ip + '/'
        print('Parsing URL ' + URL + '\n')

    # Parse URL
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')

    # Get Information From Location
    match query:
        case "elevation":
            # Get Elevation
            response_label = soup.find('div', class_='clearboth p3xp bold', string=lambda text: "Elevation" in text.strip())
            response_value = response_label.find_next_sibling('div', class_='clearboth p3px').text.strip()
            print('The elevation of ' + airport + ' is: ' + response_value + ' feet')
            response = response_value
        # Add more cases for other queries...
        case _:
            print("Not Valid")

    return response