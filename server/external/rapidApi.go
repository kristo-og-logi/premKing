package external

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"os"

	"github.com/kristo-og-logi/premKing/server/models"
)

func getRapidApiUrl(base string) string {
	baseUrl, err := url.Parse(base)
	if err != nil {
		fmt.Printf("error creating url: %s\n", err.Error())
		os.Exit(1)
	}
	baseUrl.RawQuery = url.Values{"league": []string{"39"}, "season": []string{"2025"}}.Encode()
	return baseUrl.String()
}

func getRapidApiRequest(base string) *http.Request {
	url := getRapidApiUrl(base)

	fmt.Printf("URL: %s\n", url)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Printf("Error creating GET request: %v\n", err.Error())
		os.Exit(1)
	}

	rapidApiKey := "RAPID_API_KEY"
	apiKey := os.Getenv(rapidApiKey)
	if apiKey == "" {
		fmt.Printf("%s not found in env\n", rapidApiKey)
		os.Exit(1)
	}
	req.Header.Set("x-rapidapi-key", apiKey)

	return req
}

func getRapidApiResponseBody(base string) []byte {
	req := getRapidApiRequest(base)

	resp, err := (&http.Client{}).Do(req)
	if err != nil {
		fmt.Printf("Error fetching request: %s\n", err.Error())
		os.Exit(1)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading body: %s\n", err.Error())
		os.Exit(1)
	}

	return body
}

func GetRapidApiTeamsResponse() models.RapidApiTeamsResponse {
	body := getRapidApiResponseBody("https://v3.football.api-sports.io/teams")

	var teamsResponse = models.RapidApiTeamsResponse{}
	err := json.Unmarshal(body, &teamsResponse)
	if err != nil {
		slog.Error("cannot parse teams data into JSON", "error", err.Error())
		os.Exit(1)
	}
	return teamsResponse
}

func GetRapidApiFixturesResponse() models.FixturesResponse {
	body := getRapidApiResponseBody("https://v3.football.api-sports.io/fixtures")

	var response models.FixturesResponse
	err := json.Unmarshal(body, &response)
	if err != nil {
		slog.Error("cannot parse fixtures body into JSON", "error", err.Error())
		os.Exit(1)
	}

	return response
}
