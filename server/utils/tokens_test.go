package utils

import (
	"crypto/rand"
	"crypto/rsa"
	"testing"

	"github.com/golang-jwt/jwt/v5"
)

func Test_VerifyRSAToken_verifiesValidToken(t *testing.T) {
	privKey, _ := rsa.GenerateKey(rand.Reader, 2048)
	pubKey := &privKey.PublicKey

	token := jwt.New(jwt.SigningMethodRS256)

	tokenString, _ := token.SignedString(privKey)

	got, err := VerifyRSAToken(tokenString, pubKey)
	if err != nil {
		t.Errorf("Got error (%s) when no error expected\n", err.Error())
	}
	expected := true

	if got != expected {
		t.Errorf("Expected: %v, got %v", expected, got)
	}
}

func Test_VerifyRSAToken_invalidatesInvalidToken(t *testing.T) {
	privKey, _ := rsa.GenerateKey(rand.Reader, 2048)
	token := jwt.New(jwt.SigningMethodRS256)
	tokenString, _ := token.SignedString(privKey)

	otherPrivKey, _ := rsa.GenerateKey(rand.Reader, 2048)

	otherPubKey := &otherPrivKey.PublicKey

	got, err := VerifyRSAToken(tokenString, otherPubKey)
	if err != nil {
		t.Errorf("Got error (%s) when no error expected\n", err.Error())
	}
	expected := false

	if got != expected {
		t.Errorf("Expected: %v, got %v", expected, got)
	}
}

func Test_ExtractKID(t *testing.T) {
	type testCase struct {
		inp string
		exp string
	}
	kid := "kid-test" // some random kid

	privKey, _ := rsa.GenerateKey(rand.Reader, 2048)
	token := jwt.New(jwt.SigningMethodRS256)

	token.Header["kid"] = kid

	tokenString, _ := token.SignedString(privKey)

	got, err := ExtractKIDFromTokenString(tokenString)
	if err != nil {
		t.Errorf("Got unexpected error (%s)\n", err.Error())
	}

	if got != kid {
		t.Errorf("Expected: %s, got %s\n", kid, got)
	}
}
