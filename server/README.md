# PremKing Server / Backend

Running on Gin (Go) with Gorm.

## Setup

Inside the server directory, try running `go run .`. If that gives you errors, you might not have downloaded the necessary packages. Run `go get .` in the same directory, and then run `go run .` again.

### For development

To develop with hot module reload, We are using [CompileDaemon](https://github.com/githubnemo/CompileDaemon).

To run the backend with CompileDaemon, make sure you have installed it to your \$GOPATH with `go install github.com/githubnemo/CompileDaemon`.
Then, make sure your \$GOPATH is included in your \$PATH. You do this by adding..

```
export GOPATH="$HOME/go"
export PATH=$PATH:$GOPATH/bin
```

..to your ~/.zshrc (don't forget to `source ~/.zshrc` afterwards)

Now, to hot module reload run the backend, start it with..

```
CompileDaemon -command="./server"
```

..inside the backend repository. The command includes "./server" as it's the name of the backend directory.

Now you should be up and running!

## Source

Setting up a gin project: https://go.dev/doc/tutorial/web-service-gin
