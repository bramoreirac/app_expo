# Expo Go connection troubleshooting

**Date:** 2026-10-03  
**Project:** MiPrimeraApp  
**Device:** Android phone running Expo Go

## Problem

Expo Go could scan the QR code, but the phone did not open the app through the original local connection. The phone and development computer were on the same Wi-Fi network. When tunnel mode was tried with `npx expo start --tunnel`, Expo reported:

```text
CommandError: Install @expo/ngrok@^4.1.0 and try again
```

## Reasons

- The tunnel command needed `@expo/ngrok`, which was not installed in this project. This was the confirmed cause of the tunnel command's error.
- The exact reason the original local network connection failed was not established. Being on the same Wi-Fi does not always mean the phone can reach the computer's development server; router isolation or firewall rules are possible causes. Tunnel mode provided a working connection without relying on that local route.
- The app's starter code was not the cause: Metro started and generated the Android JavaScript bundle successfully.

## Fix

Installed `@expo/ngrok` version `4.1.0` as a project dependency with Expo's install command:

```powershell
npx expo install '@expo/ngrok@^4.1.0'
```

Then started Expo in tunnel mode and scanned its new QR code:

```powershell
npx expo start --tunnel
```

The Android phone connected and opened the app successfully, as confirmed after the change.

## Note about PowerShell

In one troubleshooting shell, PowerShell blocked the `npx.ps1` script because of its execution policy. Running `npx.cmd` selected the Windows command file instead. This was specific to that shell; `npx` worked in the user's PowerShell session and does not need the `.cmd` suffix there.

## References

- [Expo CLI: tunneling](https://docs.expo.dev/more/expo-cli/#tunneling)
- [Expo: start developing and troubleshoot device connections](https://docs.expo.dev/get-started/start-developing/)
