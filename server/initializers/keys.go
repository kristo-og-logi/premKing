package initializers

import (
	"context"
	"crypto/rsa"
	"fmt"
	"github.com/lestrrat-go/jwx/v2/jwk"
	"math/big"
	"os"
)

// Maps Apple's RSA header keys to rsa.PublicKeys
var KEYS map[string]*rsa.PublicKey

// Initiializes the KEYS global variable with rsa.PublicKey entries
func LoadKeys() {
	KEYS = make(map[string]*rsa.PublicKey)

	// URL from https://docs.expo.dev/versions/latest/sdk/apple-authentication/#development-and-testing
	set, err := jwk.Fetch(context.Background(), "https://appleid.apple.com/auth/keys")
	if err != nil {
		return
	}

	for it := set.Keys(context.Background()); it.Next(context.Background()); {
		pair := it.Pair()
		key := pair.Value.(jwk.Key)
		if key.KeyType() == "RSA" {
			n, ok := key.Get("n")
			if !ok {
				fmt.Printf("n not ok")
				os.Exit(1)
			}

			e, ok := key.Get("e")
			if !ok {
				fmt.Printf("e not ok")
				os.Exit(1)
			}

			kid, ok := key.Get("kid")
			if !ok {
				fmt.Printf("kid not ok")
				os.Exit(1)
			}

			nInt := new(big.Int).SetBytes(n.([]byte))
			eInt := int(new(big.Int).SetBytes(e.([]byte)).Int64())
			kidStr := kid.(string)

			rsaKey := rsa.PublicKey{N: nInt, E: eInt}
			KEYS[kidStr] = &rsaKey
		}
	}

	fmt.Println("Apple JWKs loaded into KEYS")
}
