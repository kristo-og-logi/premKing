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
    "page": 1,
}


api_token = ""
with open("../../../.env.DEV", "r") as file:
    for line in file.readlines():
        if line.startswith("SPORTMONKS_API_KEY"):
            api_token = line[len("SPORTMONKS_API_KEY") + 1 :]
            break


pages = []

for page in range(1, 9):
    params["page"] = page

    response = requests.get(
        base_url, params=params, headers={"Authorization": api_token}
    )

    if response.status_code == 200:
        data = response.json()

        for fixture in data["data"]:
            name: str = fixture["name"]
            newName = name.replace("Manchester", "Man")
            newName = newName.replace("Brighton & Hove Albion", "Brighton")
            newName = newName.replace("Luton Town", "Luton")
            newName = newName.replace("Newcastle United", "Newcastle")
            newName = newName.replace("Tottenham Hotspur", "Tottenham")
            newName = newName.replace("Wolverhampton Wanderers", "Wolves")
            newName = newName.replace("Sheffield United", "Sheffield")
            newName = newName.replace("Nottingham Forest", "Nott'm Forest")
            newName = newName.replace("West Ham United", "West Ham")
            newName = newName.replace("AFC Bournemouth", "Bournemouth")

            if name != newName:
                print(f"changed name: {name} -> {newName}")

            fixture["name"] = newName

        pages.extend(data["data"])

        print(f"Successfully saved page {page}")
    else:
        print(f"Failed to retrieve page {page}. Status code: {response.status_code}")


with open("pages.json", "w") as file:
    json.dump(pages, file)
