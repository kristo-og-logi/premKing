package utils

// RapidApiName -> SportmonksName
func ConvertTeamName(name string) string {
	conversion := map[string]string{
		"Manchester United": "Manchester United",
		"Arsenal":           "Arsenal",
		"Wolves":            "Wolverhampton Wanderers",
		"Bournemouth":       "AFC Bournemouth",
		"Crystal Palace":    "Crystal Palace",
		"Fulham":            "Fulham",
		"Ipswich Town":      "Ipswich Town",
		"Newcastle":         "Newcastle United",
		"Tottenham":         "Tottenham Hotspur",
		"Liverpool":         "Liverpool",
		"Everton":           "Everton",
		"Nottingham Forest": "Nottingham Forest",
		"Brentford":         "Brentford",
		"Chelsea":           "Chelsea",
		"Manchester City":   "Manchester City",
		"Leicester":         "Leicester City",
		"Brighton":          "Brighton & Hove Albion",
		"Southampton":       "Southampton",
		"West Ham":          "West Ham United",
		"Aston Villa":       "Aston Villa",
		"Sunderland":        "Sunderland",
		"Leeds":             "Leeds United",
		"Burnley":           "Burnley",
	}

	return conversion[name]
}

func GetShortName(name string) string {
	conversion := map[string]string{
		"Manchester United":       "Man United",
		"Wolverhampton Wanderers": "Wolves",
		"AFC Bournemouth":         "Bournemouth",
		"Ipswich Town":            "Ipswich",
		"Newcastle United":        "Newcastle",
		"Tottenham Hotspur":       "Tottenham",
		"Nottingham Forest":       "Nott'm Forest",
		"Manchester City":         "Man City",
		"Leicester City":          "Leicester",
		"Brighton & Hove Albion":  "Brighton",
		"West Ham United":         "West Ham",
		"Leeds United":            "Leeds",
	}

	converted := conversion[name]

	if converted == "" {
		return name
	}

	return converted
}
