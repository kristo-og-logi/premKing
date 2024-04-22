import requests
import json

base_url = "https://api.sportmonks.com/v3/football/fixtures"
params = {
    # Premier League 23/24 season id: 21646
    # bet365 bookmaker id: 2
    # Fulltime result market id: 1
    "filters": "fixtureSeasons:21646;bookmakers:2;markets:1", 
    # include round + odds information
    "include": "round;odds",
    # highest amount of results per page
    "per_page": 50,
    "page": 1
}


api_token = ""
with open("../../../.env.DEV", "r") as file:
    for line in file.readlines():
        if line.startswith("SPORTMONKS_API_KEY"):
            api_token = line[len("SPORTMONKS_API_KEY")+1:]
            break


for page in range(1, 11):
    params["page"] = page

    response = requests.get(base_url, params=params, headers={"Authorization": api_token})

    if response.status_code == 200:
        data = response.json()
        
        with open(f'page_{page}.json', 'w') as file:
            json.dump(data, file)
        print(f'Successfully saved page {page}')
    else:
        print(f'Failed to retrieve page {page}. Status code: {response.status_code}')

