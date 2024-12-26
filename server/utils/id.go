package utils

import (
	"math/rand"
	"regexp"
	"strings"
)

func IsValidUuid(input string) bool {
	pattern := `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`

	// Compile the regular expression
	regex := regexp.MustCompile(pattern)

	// Match the input string against the pattern
	return regex.MatchString(input)
}

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const ID_LEN = 6

func GenerateId() string {
	var sb strings.Builder
	for i := 0; i < ID_LEN; i++ {
		index := rand.Intn(len(charset))
		sb.WriteByte(charset[index])
	}
	return sb.String()
}

func IsValidPremKingId(id string) bool {
	if len(id) != ID_LEN {
		return false
	}
	for i := 0; i < ID_LEN; i++ {
		charValid := false
		for _, char := range charset {
			if char == rune(id[i]) {
				charValid = true
			}
		}
		if !charValid {
			return false
		}
	}

	return true
}
