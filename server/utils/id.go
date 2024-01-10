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

func GenerateId() string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var sb strings.Builder
	for i := 0; i < 6; i++ {
		index := rand.Intn(len(charset))
		sb.WriteByte(charset[index])
	}
	return sb.String()
}
