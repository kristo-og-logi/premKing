package utils

import (
	"encoding/json"
	"fmt"
	"strings"
)

func PrettyPrint(printString string, printObject any) {
	prettyJSON, err := json.MarshalIndent(printObject, "", "    ")
	if !strings.ContainsAny(printString, "%") {
		printString = strings.Trim(printString, "\n") + "%s\n"
	}
	if err == nil {
		fmt.Printf(strings.Replace(printString, "%+v", "%s", -1), prettyJSON)
	} else {
		fmt.Printf("PrettyPrint error: %s\n", err.Error())
		fmt.Printf(strings.Replace(printString, "%s", "%+v", -1), printObject)
	}
}
