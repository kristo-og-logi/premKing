#!/bin/zsh


# Compile the application for Linux
echo "Compiling application for Amazon Linux..." 
GOOS=linux GOARCH=amd64 go build -o awsServer


rm ../aws.zip
# zip the repository into a server.zip
zip -r ../aws.zip * ".env.PROD" ".platform"

echo "New aws.zip has been created in parent directory"
echo "You may upload it to AWS"
