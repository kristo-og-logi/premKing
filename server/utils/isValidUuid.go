package utils

import "regexp"

func IsValidUuid(input string) bool {
	pattern := `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`

	// Compile the regular expression
	regex := regexp.MustCompile(pattern)

	// Match the input string against the pattern
	return regex.MatchString(input)
}
