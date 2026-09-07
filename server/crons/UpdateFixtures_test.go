package crons

import "testing"


// Odds API team names:
// Arsenal
// Aston Villa
// Bournemouth
// Brentford
// Brighton and Hove Albion
// Chelsea
// Coventry City
// Crystal Palace
// Everton
// Fulham
// Hull City
// Ipswich Town
// Leeds United
// Liverpool
// Manchester City
// Manchester United
// Newcastle United
// Nottingham Forest
// Sunderland
// Tottenham Hotspur

// Sportmonks team names
// AFC Bournemouth
// Arsenal
// Aston Villa
// Brentford
// Brighton & Hove Albion
// Chelsea
// Coventry City
// Crystal Palace
// Everton
// Fulham
// Hull City
// Ipswich Town
// Leeds United
// Liverpool
// Manchester City
// Manchester United
// Newcastle United
// Nottingham Forest
// Sunderland
// Tottenham Hotspur

func Test_OddsTeamToSportmonksTeamName(t *testing.T) {
	if (OddsTeamToSportmonksTeamName("Bournemouth") != "AFC Bournemouth") {
		t.Errorf("bad conversion")
	}

	if (OddsTeamToSportmonksTeamName("Brighton and Hove Albion") != "Brighton & Hove Albion") {
	 t.Errorf("bad conversion")
 	}

	if (OddsTeamToSportmonksTeamName("Arsenal") != "Arsenal") {
	 t.Errorf("bad conversion")
 	}
}
