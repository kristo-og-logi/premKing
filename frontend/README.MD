# PremKing Frontend

Running in Expo (React Native)

## development


### IOS

As of Dec 2024, with commit [b1afb57](https://github.com/kristo-og-logi/premKing/commit/b1afb57b6e939432df037fdae337aec26688be26), IOS now uses Apple Sign in.
This requires the mac devices buiding and running the app to be registered on [developer.apple.com](https://developer.apple.com/devices).
If not registered, the below error (or similar) will be shown when building the app for IOS.

```bash
❯ npm run ios:dev

> frontend@1.0.0 ios:dev
> cat .env.DEV > .env && expo run:ios

env: load .env
env: export ENVIRONMENT BACKEND_URL
env: load .env
env: export ENVIRONMENT BACKEND_URL
✔ Created native directory
✔ Updated package.json | no changes
✔ Finished prebuild
✔ Installed CocoaPods
› Your computer requires some additional setup before you can build onto physical iOS devices.
  Learn more: https://expo.fyi/setup-xcode-signing
CommandError: No code signing certificates are available to use.
```

Now, running with Expo Go can work around most of these issues, seen on [their docs](https://docs.expo.dev/versions/latest/sdk/apple-authentication/#development-and-testing), but Google OAuth doesn't work unless the app itself is built instead of ran within Expo Go, and that requires some extra work and this step will have to be taken eventually.

To successfully build, use the link provided in the error message above ([https://expo.fyi/setup-xcode-signing](https://expo.fyi/setup-xcode-signing), (I used [this specific one](https://github.com/expo/fyi/blob/bdeb4f299a01514651f4aadb227cf37e8e61878a/setup-xcode-signing.md))). You'll have to register your mac device on Developer website. To find your devices `UDID`, use the command: `system_profiler SPHardwareDataType | grep "Provisioning UDID"` in your mac's terminal.

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



_When running the frontend, I get this other `watchman` error:_

```
metro-file-map: Watchman crawl failed. Retrying once with node crawler.
  Usually this happens when watchman isn't running. Create an empty `.watchmanconfig` file in your project's root folder or initialize a git or
 hg repository in your project.
  Error: Watchman error: std::__1::system_error: open: /Users/me/project/premking/frontend: Operation not
permitted. Make sure watchman is running for this project. See https://facebook.github.io/watchman/docs/troubleshooting.
```

You likely have already downloaded watchman. Likely because of the error above. You might need to create an empty `.watchmanconfig` file in the `frontend/` directory. Also, you'll probably need to restart watchman with `watchman shutdown-server`. Maybe also `brew upgrade watchman` while you're at it.

_When starting the frontend with `npm run start` and opening the ios simulator, I get this error:_
```
› Opening on iOS...
Error: xcrun exited with non-zero code: 2
An error was encountered processing the command (domain=NSPOSIXErrorDomain, code=2):
Unable to boot device because we cannot determine the runtime bundle.
No such file or directory
```

- You likely don't have the iOS simulator downloaded on your mac, even though you might have had it some time ago.
	goto Xcode -> Settings -> Platforms and see whether iOS is downloaded.

- If you do have it downloaded. You might need to open up the simulator manually. 
	Within simulator: File -> Open Simulator, and open one up.


