package main

import "fmt"

func main() {
	first, last := getNames()
	fmt.Println("Hello", first, last)
}

func getNames() (string, string) {
	return "John", "Doe"
}
