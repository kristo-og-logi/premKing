# PremKing Frontend

Running in Expo (React Native)

## Trouble Shooting

_When running the frontend in development mode, I get this strange crash on start up:_

```
Error: EMFILE: too many open files, watch
    at FSEvent.FSWatcher._handle.onchange (node:internal/fs/watchers:207:21)
```

- This error was first seen when upgrading expo from v49 to v50. After some googling, StackOverflow gave a rather bad solution. Apparently, the npm installed `fb-watchman` can't seem to handle the amount of files in the new version. The fix is to install watchman onto your system, in our case, `brew install watchman`.
