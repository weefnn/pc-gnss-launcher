# GitHub Release Distribution Runbook

## Goal

Distribute `pc-gnss-launcher` and `pc-gnss-terminal` from GitHub Releases only,
without end-user npm commands.

## Repositories

- Launcher: `https://github.com/weefnn/pc-gnss-launcher`
- Terminal app: `https://github.com/weefnn/pc-gnss-terminal`

## Launcher Distribution

1. Push a launcher release tag:

```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnss-launcher
git tag v0.1.0
git push origin v0.1.0
```

2. GitHub Action `.github/workflows/release-github.yml` builds and uploads:
- `*.dmg`
- `latest*.yml`
- `*.blockmap`

3. End users download installer from:
- `https://github.com/weefnn/pc-gnss-launcher/releases`

## Terminal Distribution (Installable In Launcher)

1. Push a terminal release tag:

```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnss-terminal
git tag v1.6.2
git push origin v1.6.2
```

2. GitHub Action `.github/workflows/release-github.yml` uploads:
- `pc-gnss-terminal-<version>.tgz`
- `source.json`
- `pc-gnss-terminal.json`

3. In launcher settings, add app source URL:

```text
https://github.com/weefnn/pc-gnss-terminal/releases/latest/download/source.json
```

4. `GNSS Terminal` appears in app list and can be installed via `Install`.

## Notes

- Launcher default official source is configured to the URL above.
- If a user has old cached sources, remove and re-add source in Settings.
