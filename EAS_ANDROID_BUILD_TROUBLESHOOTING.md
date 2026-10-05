# Android EAS Build troubleshooting

**Date:** 2026-10-04 (America/Managua)  
**Project:** Guía Canina (`app_expo`)  
**Command:** `npx.cmd eas-cli@latest build -p android --profile preview`  
**Build log:** [`build_logs/build_a746047f.txt`](build_logs/build_a746047f.txt)  
**Earlier successful install log:** [`build_logs/build_39445a41.txt`](build_logs/build_39445a41.txt)

## Problem

The preview build stopped while EAS was installing dependencies with `npm ci --include=dev`. Android compilation had not started. The decisive error was:

```text
npm error code EUSAGE
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: react-dom@19.3.0 from lock file
npm error Missing: react-native-gesture-handler@3.3.0 from lock file
npm error Missing: react-native-reanimated@4.7.1 from lock file
```

The log listed additional missing transitive packages. Its `react-native-worklets` peer dependency warnings were separate warnings; `npm ci` exited because the lockfile did not describe the full dependency tree it needed to install.

## Why the earlier build passed

The earlier log shows the same `npm ci --include=dev` step completing with `added 499 packages, and audited 500 packages in 10s`. It contains no lockfile error. Git history shows that the project later gained Expo Router, SQLite, navigation, and other dependencies in Sprint 1; the committed lockfile grew from 520 package entries in the earlier project version to 847 after Sprint 1. The failed build used that larger dependency tree, whose lockfile was missing packages required by the EAS install step.

The successful log covers dependency installation only and does not identify the exact source revision used for that build. The repository history supports the change in dependency set, but the files do not show exactly how the later lockfile became incomplete.

## Cause

`package-lock.json` lacked packages that npm resolved from the project's current dependencies. A first lockfile regeneration then exposed a second conflict during a local `npm ci` dry run: npm selected `react-dom@19.3.0`, which requires React 19.3, while this Expo SDK 57 project uses React 19.2.3. The build profile in `eas.json` was not the source of this failure.

## Fix applied

1. Regenerated `package-lock.json` using npm so its dependency tree includes the required packages.
2. Installed and pinned `react-dom@19.2.3` in `package.json` with `npx.cmd expo install react-dom@19.2.3 --npm`, matching the project's React version.
3. Updated `package-lock.json` again through that install.

Both `package.json` and `package-lock.json` must be included in the next build's source upload.

## Verification

- `npm.cmd ci --dry-run --include=dev --ignore-scripts --no-audit --no-fund` passed. This checks the dependency resolution used by EAS without performing a full clean install.
- `npx.cmd expo install --check` reported `Dependencies are up to date`.
- `npm.cmd test` passed all 11 tests.
- ESLint passed with `node node_modules/eslint/bin/eslint.js . --no-cache`.

A new cloud build has **not** been confirmed successful yet. The checks establish that the reported `npm ci` failure is resolved locally; later build stages still need the retry below.

## Retry

From the `app_expo` project directory in PowerShell:

```powershell
npx.cmd eas-cli@latest build -p android --profile preview
```

If the retry fails at a different stage, save the new EAS log and diagnose that error separately. The `npx.cmd` form avoids the PowerShell script execution restriction encountered in the troubleshooting shell.

## References

- [Expo SDK 57 compatibility table](https://docs.expo.dev/versions/v57.0.0/)
- [Expo CLI package installation](https://docs.expo.dev/more/expo-cli/#install)
- [Expo EAS Build profiles](https://docs.expo.dev/build/eas-json/#build-profiles)
