# GNSS Local App Runbook

## Purpose

Run `pc-gnssconnect-terminal` as a local app inside `pc-nrfconnect-launcher` without changing launcher core logic.

## Local App Directory Convention

Launcher local app root:

```text
~/.nrfconnect-apps/local
```

GNSS app target directory name:

```text
~/.nrfconnect-apps/local/pc-gnssconnect-terminal
```

The directory name must match the app `package.json` `name` field.

## One-Time Setup

1. Ensure app repo is available:

```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal
npm install
```

2. Link app into launcher local apps directory:

```bash
mkdir -p ~/.nrfconnect-apps/local
ln -sfn /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal ~/.nrfconnect-apps/local/pc-gnssconnect-terminal
```

3. Install launcher dependencies:

```bash
cd /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher
npm install
```

## Daily Development Start

Terminal A (GNSS app build watch):

```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal
npm run watch
```

Terminal B (launcher build watch):

```bash
cd /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher
npm run watch:build
```

Terminal C (launcher app process):

```bash
cd /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher
npm run app
```

## Smoke Check

Expected:
- Launcher starts normally.
- `GNSS Terminal` appears in app list as a local app.
- App window opens and renders terminal UI.

If app is missing:
- Verify `~/.nrfconnect-apps/local/pc-gnssconnect-terminal` exists.
- Verify linked folder has a valid `package.json` with matching `name`.
