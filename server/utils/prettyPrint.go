package utils

import (
	"encoding/json"
	"fmt"
	"strings"
)

func PrettyPrint(printString string, printObject any) {
	prettyJSON, err := json.MarshalIndent(printObject, "", "    ")
	if err == nil {
		fmt.Printf(strings.Replace(printString, "%+v", "%s", -1), prettyJSON)
	} else {
		fmt.Printf(strings.Replace(printString, "%s", "%+v", -1), printObject)
	}
}
