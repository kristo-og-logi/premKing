package crons

import (
	"fmt"
	"testing"
)

func getData(testId int, testName string, testStartingAt string) []byte {
	data := fmt.Sprintf(`{
		"data": [
		{
			"id": %d,
			"name": "%s",
			"starting_at": "%s",
			"has_odds": true,
			"has_premium_odds": true,
			"starting_at_timestamp": 1736002800,
			"round": {
				"name": "20",
				"finished": false,
				"is_current": false,
				"starting_at": "2025-01-04",
				"ending_at": "2025-01-06"
			},
			"odds": [
			{
				"label": "Away",
				"value": "4.33",
				"name": null,
				"sort_order": 2,
				"winning": false,
				"stopped": false,
				"created_at": "2024-12-26T16:21:18.000000Z",
				"original_label": "2",
				"latest_bookmaker_update": "2024-12-31 16:31:57"
			},
			{
				"label": "Draw",
				"value": "3.80",
				"name": null,
				"sort_order": 1,
				"winning": false,
				"stopped": false,
				"created_at": "2024-12-26T16:21:18.000000Z",
				"original_label": "Draw",
				"latest_bookmaker_update": "2024-12-31 16:31:57"
			},
			{
				"label": "Home",
				"value": "1.75",
				"name": null,
				"sort_order": 0,
				"winning": false,
				"stopped": false,
				"total": null,
				"created_at": "2024-12-26T16:21:18.000000Z",
				"original_label": "1",
				"latest_bookmaker_update": "2024-12-31 16:31:57"
			}
			],
			"scores": [],
			"state": {
				"id": 1,
				"state": "NS",
				"name": "Not Started",
				"short_name": "NS",
				"developer_name": "NS"
			}
		}
		]
	}`, testId, testName, testStartingAt)

	return []byte(data)
}

func Test_UpdateFixtures_parsesFixture(t *testing.T) {
	testId := 12345
	testName := "team1 vs team2"
	testStartingAt := "2025-01-01 00:00:00"
	data := getData(testId, testName, testStartingAt)
	smFix, err := toSportmonksFixtureResponse(data)

	if err != nil {
		t.Errorf("got unexpected error: %s\n", err.Error())
	}

	if smFix == nil {
		t.Fatalf("Expected sportmonks fixture to exist, got nil\n")
	}

	if len(smFix.Data) != 1 {
		t.Errorf("Expected 1 match, got %v\n", len(smFix.Data))
	}

	match := smFix.Data[0]
	if match.ID != testId {
		t.Fatalf("Expected id=%d, got id=%d\n", testId, match.ID)
	}

	if match.StartingAt != testStartingAt {
		t.Errorf("Expected startingAt=%s, got %s\n", testStartingAt, match.StartingAt)
	}
}

func Test_Convert(t *testing.T) {
	testId := 12345
	testName := "team1 vs team2"
	testStartingAt := "2025-01-01 00:00:00"

	data := getData(testId, testName, testStartingAt)
	smFix, _ := toSportmonksFixtureResponse(data)

	fixtures := Convert(smFix)

	if len(fixtures) != 1 {
		t.Fatalf("Expected 1, got %d\n", len(fixtures))
	}

	fix := fixtures[0]

	if fix.Id != uint32(testId) {
		t.Errorf("Expected %d, got %d\n", testId, fix.Id)
	}

	if fix.Name != testName {
		t.Errorf("Expected %s, got %s\n", testName, fix.Name)
	}

	if fix.StartingAt != testStartingAt {
		t.Errorf("Expected %s, got %s\n", testStartingAt, fix.StartingAt)
	}
}
