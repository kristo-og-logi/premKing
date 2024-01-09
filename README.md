# PremKing

![](assets/LOGO.png)

## Frontend

Written in react native, using expo, typescript and redux.

### Setup

To install dependencies, within `/frontend`, run

```
npm install
```

Then, to start the frontend, run

```
npm run start
```

## Backend

Made with gin, a Go framework, with gorm as an _orm_.

To install packages, within `/server`, run

```
go get .
```

Then, to start the backend, make sure you have added the necessary environment variables in a `.env` file. Refer to [`/server/.env.example`](/server/.env.example) for help.

Then, run

```
go run .
```

If you haven't used Go on your machine before, this probably won't work. Refer to [`/server/README.md`](/server/README.md) for help to boot up the backend.

If running the backend in development, you **need to follow** the [`/server/README.md`](/server/README.md) documentation. Having completed that, run

```
CompileDaemon -command="./server"
```
