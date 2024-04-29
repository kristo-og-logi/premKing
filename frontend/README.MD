# PremKing Frontend

Running in Expo (React Native)

## Deployment

### IOS

To deploy to IOS, we use [EAS (Expo Application Services)](https://expo.dev/eas).

First, make sure you have the latest version of eas-cli (we've used 7.x.x). Multiple times throughout the development phase, the build & submit process simply failed if the latest version was not in use.

```bash
npm install -g eas-cli

eas --version
> eas-cli/7.x.x
```

Now, if you've added any features or fixes, update the frontend's version in [app.json](./frontend/app.json). Then, build the project with

```bash
npm run eas:ios:build
```

You'll have to sign in with an Apple Developer account. You'll also be asked whether you want to set up push notifications. Currently, we don't.

While the app is building (it takes a while), you can watch (and debug) the build process at your expo dashboard. Ours is https://expo.dev/accounts/kristoferfannar.

To submit the application to App Store Connect, run:

```bash
nmp run eas:ios:sumbit
```

Select the build from EAS that you just built and wait for the submission to complete.
After the binary has been submitted, you should find your build on [appstoreconnect.apple.com](https://appstoreconnect.apple.com).

## Trouble Shooting

_When running the frontend in development mode, I get this strange crash on start up:_

```
Error: EMFILE: too many open files, watch
    at FSEvent.FSWatcher._handle.onchange (node:internal/fs/watchers:207:21)
```

- This error was first seen when upgrading expo from v49 to v50. After some googling, StackOverflow gave a rather bad solution. Apparently, the npm installed `fb-watchman` can't seem to handle the amount of files in the new version. The fix is to install watchman onto your system, in our case, `brew install watchman`.
