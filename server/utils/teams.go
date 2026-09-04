package utils

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
