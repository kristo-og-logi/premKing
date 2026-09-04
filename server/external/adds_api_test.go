package external

import "testing"



func getOddsData() []byte {
	out := `
[
  {
    "id": "e479c08421b8549c6959c2b84f6f3f79",
    "sport_key": "soccer_epl",
    "sport_title": "EPL",
    "commence_time": "2026-08-30T13:00:00Z",
    "home_team": "Leeds United",
    "away_team": "Brentford",
    "bookmakers": [
      {
        "key": "betsson",
        "title": "Betsson",
        "last_update": "2026-08-30T03:50:47Z",
        "markets": [
          {
            "key": "h2h",
            "last_update": "2026-08-30T03:50:47Z",
            "outcomes": [
              {
                "name": "Brentford",
                "price": 2.75
              },
              {
                "name": "Leeds United",
                "price": 2.62
              },
              {
                "name": "Draw",
                "price": 3.3
              }
            ]
          }
        ]
      }
    ]
  }
  ]
`
	return []byte(out)
}



func Test_(t *testing.T) {
	data := getOddsData()

	fixtures, err := toOddsApiFixtures(data)
	if err != nil {
		t.Errorf("bad: %s", err.Error())
	}
	if fixtures == nil {
		t.Fatalf("bad")
	}

	t.Logf("success")
	if len(fixtures) != 1 {
		t.Fatalf("expected 1 fixture")
	}

	if len(fixtures[0].Bookmakers) != 1 {
		t.Fatalf("expected 1 bookmaker, got %d", len(fixtures[0].Bookmakers))
	}

	if fixtures[0].Bookmakers[0].Key != "betsson" {
		t.Fatal("expected key == betsson")
	}

	if len(fixtures[0].Bookmakers[0].Markets) != 1 {
		t.Fatalf("expected 1 market, got %d", len(fixtures[0].Bookmakers[0].Markets))
	}

	if len(fixtures[0].Bookmakers[0].Markets[0].Outcomes) != 3 {
		t.Fatalf("expected 3 outcomes, got %d", len(fixtures[0].Bookmakers[0].Markets[0].Outcomes))
	}

	if fixtures[0].Bookmakers[0].Markets[0].Outcomes[0].Name != "Brentford" {
		t.Fatalf("Expected first outcome = Brentford")
	}
	if fixtures[0].Bookmakers[0].Markets[0].Outcomes[0].Price != 2.75 {
		t.Fatalf("Expected first Price = 2.75")
	}
}


