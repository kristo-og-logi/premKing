package utils

import (
	"testing"
)

func Test_IsValidUuid_detectsValid(t *testing.T) {
	cases := []string{
		"abcdabcd-abcd-abcd-abcd-abcdabcdabcd",
	}

	for _, validId := range cases {
		got := IsValidUuid(validId)
		expected := true

		if got != expected {
			t.Errorf("Expected: %v, got %v", expected, got)
		}
	}
}

func Test_IsValidUuid_detectsInvalid(t *testing.T) {
	cases := []string{
		"abcd-abcd-abcd-abcdabcdabcd",
		"invalid-id",
		"123",
	}

	for _, invalidId := range cases {
		got := IsValidUuid(invalidId)
		expected := false

		if got != expected {
			t.Errorf("case: %s - expected: %v, got %v", invalidId, expected, got)
		}
	}
}
