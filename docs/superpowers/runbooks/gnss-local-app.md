# GNSS Local App Runbook

## Purpose

Run `pc-gnss-terminal` as a local app inside `pc-gnss-launcher` without changing launcher core logic.

## Local App Directory Convention

Launcher local app root:

```text
~/.gnss-apps/local
```

GNSS app target directory name:

```text
~/.gnss-apps/local/pc-gnss-terminal
```

The directory name must match the app `package.json` `name` field.

## One-Time Setup

1. Ensure app repo is available:

```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnss-terminal
npm install
```

2. Link app into launcher local apps directory:

```bash
mkdir -p ~/.gnss-apps/local
ln -sfn /Users/weifeng/Workspace/PCtool/pc-gnss-terminal ~/.gnss-apps/local/pc-gnss-terminal
```

3. Install launcher dependencies:

```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnss-launcher
npm install
```

## Daily Development Start

Terminal A (GNSS app build watch):

```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnss-terminal
npm run watch
```

Terminal B (launcher build watch):

```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnss-launcher
npm run watch:build
```

Terminal C (launcher app process):

```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnss-launcher
npm run app
```

## Smoke Check

Expected:
- Launcher starts normally.
- `GNSS Terminal` appears in app list as a local app.
- App window opens and renders terminal UI.

If app is missing:
- Verify `~/.gnss-apps/local/pc-gnss-terminal` exists.
- Verify linked folder has a valid `package.json` with matching `name`.

## GitHub Install Source

For packaged installation (no local symlink), add this source in launcher
settings:

```text
https://github.com/weefnn/pc-gnss-terminal/releases/latest/download/source.json
```

Then install `GNSS Terminal` directly from the app list.

## Verification

Date: 2026-03-18

Automated checks completed in `pc-gnss-terminal`:
- `npm run check` passed.
- `npm test` passed (4 suites, 9 tests).

Manual outcomes completed:
- J-Link install prompt no longer blocks startup.
- Local `GNSS Terminal` opens from launcher.
- Serial port list is visible via direct serial polling path.

Known gaps:
- Full hardware-in-the-loop validation for all GNSS command families (upgrade and differential data workflows) is still pending.
