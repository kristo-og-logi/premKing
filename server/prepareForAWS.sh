#!/bin/zsh

# Compile the application for Linux
GOOS=linux GOARCH=amd64 go build -o awsServer

# zip the repository into a server.zip
zip -r ../aws.zip * ".env" ".ebextensions"
