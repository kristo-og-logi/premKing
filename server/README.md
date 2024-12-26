# PremKing Server / Backend

Running on Gin (Go) with Gorm.

## Setup

Inside the server directory, try running `go run . --environment DEV`. If that gives you errors, you might not have downloaded the necessary packages. Run `go get .` in the same directory, and then run `go run . --environment DEV` again.

Ensure that you've set all environment varialbes in [`.env.DEV`](./env.DEV). Use [`.env.example`](./.env.example) to get you started.

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
CompileDaemon -command="./server --environment DEV" -color=true -log-prefix=false
```

..inside the backend repository. The command includes "./server" as it's the name of the backend directory.

Now you should be up and running!

ps. You can also setup a local database using `.env.LOCAL`, or just by simply changing your `.env.DEV`.

## Database

The backend connects to a Postgres database using [gorm](https://gorm.io/). Both a DEV and a PROD database are hosted there. To connect, go to the Supabase dashboard.

In the psql session:

`\dt` - lists tables in the current schema
`select * from teams;` - example SQL query

## Endpoints

### /api/v1

#### /users

##### GET /

get all users

##### POST /

```json
body: {
    "name": "string",
    "username": "string"
}
```

create a user

##### GET /:id

get user with id `:id`.

##### GET /:id/leagues

get all leagues from user with id `:id`.

##### POST /:id/leagues

```json

body: {
    "leagueId": "string"
}
```

user joins new league

#### /leagues

##### POST /

```json
{
  "name": "string",
  "creatorId": "string"
}
```

create new league by user with id `creatorId` in body

## Admin control

This is likely not for you, but for general admin control over the database use the [maintenance](./maintenance/) folder to create and execute scripts on the database.

Currently:

```
go run maintenance/maintenance.go --environment {DEV | PROD | LOCAL}
```

executes a maintenance script for either environments's database.

## Source

Setting up a gin project: https://go.dev/doc/tutorial/web-service-gin

## Common Errors

~~_"I'm getting an error while migrating into or reading from the `GAMEWEEKS` table, something do do with dates (unsupported Scan, storing driver.Value type []uint8 into type \*time.Time)"_~~

~~- In your .env's `DSN` variable, make sure to postfix it with `&parseTime=True&charset=utf8mb4`. This will read dates from mysql as time.Time types, not []uint8.~~

- This was only applied to when the Planetscale mysql database was used. As of April 2024, the [database has been migrated to postgres](https://github.com/kristo-og-logi/premKing/pull/44).
