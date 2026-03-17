# GNSS PC Tool Platform V1 Design (Launcher + Local Apps)

Date: 2026-03-17
Status: V1 foundation implemented
Owner: weifeng + codex

## Implementation Status

Implementation status (V1 foundation): COMPLETE

Delivered:
- `pc-gnssconnect-terminal` initialized from `pc-nrfconnect-serial-terminal`.
- Command template state and UI send flow added.
- GNSS export filename convention (`gnss-terminal-*.txt`) implemented.
- App quality checks (`npm run check`) and tests (`npm test`) pass.

Remaining before operational sign-off:
- Manual launcher GUI smoke run on macOS.
- Hardware-in-the-loop serial validation with a real GNSS device.

## 1. Context

We want to build our own PC tool platform by reusing the nRF Connect for Desktop architecture and tech stack.

Confirmed direction:
- Keep `pc-nrfconnect-launcher` as the platform shell.
- Build business tools as local apps loaded by launcher.
- V1 business scope: serial communication foundation only (macOS first).
- Follow Nordic open-source app patterns as closely as possible.

Reference repositories (style and implementation pattern):
- `pc-nrfconnect-serial-terminal` (primary base)
- `pc-nrfconnect-rssi`
- `pc-nrfconnect-programmer`
- `pc-nrfconnect-ppk`

## 2. Product Goals

V1 must provide a runnable app framework for our own GNSS-related workflows, with a first usable app focused on serial terminal operations.

V1 functional goals:
- Discover and connect serial ports on macOS.
- Send commands via:
  - predefined command templates (button-based)
  - manual text input.
- Receive serial data and display it in real time.
- Export current session logs to `.txt`/`.log`.

V1 non-goals:
- No Nordic-specific device workflows (J-Link, device programming, Nordic detection logic at app level).
- No NMEA deep parsing yet.
- No firmware upgrade / differential-data injection yet.

## 3. Architecture Decision

### Decision A: Platform shape
Use `pc-nrfconnect-launcher` as-is (or near as-is) as shell, and add our tools as local apps.

Why:
- Preserves multi-app extensibility for future PC tools.
- Minimizes time to first running version.
- Keeps close alignment with the official ecosystem model.

### Decision B: App bootstrap strategy
Fork from `pc-nrfconnect-serial-terminal` as the direct baseline for `pc-gnssconnect-terminal`.

Why:
- It already contains the closest serial UX and architecture.
- Lowest implementation risk for V1.
- Highest compliance with Nordic coding style and app conventions.

## 4. Nordic-Style Development Conventions (Hard Constraints)

For `pc-gnssconnect-terminal`, follow these conventions:

1. Keep package conventions:
- `name`, `displayName`, `nrfConnectForDesktop`, `engines.nrfconnect`, `files`, scripts (`watch`, `build:*`, `check:*`, `check:app`, `nordic-publish`).

2. Keep app entry conventions:
- Use `telemetry.enableTelemetry()`.
- Use shared `<App ... />` composition with `appReducer`, `deviceSelect`, `sidePanel`, `panes`, optional `documentation`.

3. Keep folder conventions:
- `src/actions`, `src/features`, `src/components`, `src/hooks`, `src/utils`.

4. Keep serial integration conventions:
- Prefer APIs from `@nordicsemiconductor/pc-nrfconnect-shared` (`createSerialPort`, serial options helpers, app thunk style).
- Avoid custom low-level serial implementation unless necessary.

5. Keep state-management conventions:
- Redux slice-based state with selectors and action exports.
- Persist user settings via shared persistent store patterns where needed.

## 5. V1 App Design (`pc-gnssconnect-terminal`)

## 5.1 UI structure

Main pane:
- Terminal/log area (rx/tx/system visibility).
- Input area for manual command send.
- Quick template buttons for predefined commands.

Side panel:
- Serial settings (port, baudrate, other serial options aligned with terminal baseline).
- Terminal/settings section (line ending, clear behavior, export trigger).

## 5.2 State modules

- `features/terminal/terminalSlice.ts`
  - serial port handle
  - serial options
  - line settings / send behavior
  - export trigger state

- `features/templates/templateSlice.ts` (V1 lightweight)
  - built-in template list
  - selected template metadata

- `features/history/*` (reuse/adapt from serial-terminal)
  - command history and/or file history behavior

## 5.3 Service/data flow

1. Device selected -> `actions/deviceActions.ts` opens serial and updates slice state.
2. User sends command:
- template click or manual input
- normalize line ending
- `serialPort.write(...)`
- append TX entry to visible log.
3. Serial RX callback:
- append RX bytes/text to visible log.
4. Export action:
- prompt save dialog
- serialize current session log
- write to `.txt`/`.log`.

## 5.4 Command template model (V1)

Initial approach:
- static built-in JSON/TS list in app code.
- each template: `id`, `label`, `payload`, optional `description`.

Deferred:
- template CRUD editor
- import/export template sets.

## 6. Error Handling

- Open/connect errors: show actionable error message and preserve current UI state.
- Disconnect event: set disconnected state and disable send actions.
- Write failure: keep input and allow retry.
- Export failure: report file path + reason, do not lose in-memory session.

## 7. Platform Boundaries (Launcher vs App)

V1 launcher policy:
- Do not modify launcher core behavior for feature delivery unless absolutely needed.
- Accept that Nordic-specific launcher internals/dependencies may still exist in V1 package/runtime.

Post-V1 cleanup track:
- de-Nordic branding/UI text
- trim unnecessary Nordic-specific dependencies and download flows
- move to private app source/distribution when productization starts.

## 8. Delivery Plan

Phase 1 (V1.0 foundation):
- Create `pc-gnssconnect-terminal` from serial-terminal baseline.
- Rename metadata/branding to product naming.
- Keep serial terminal flow running in launcher local app mode.
- Add command template panel + wired send flow.
- Validate log export.

Phase 2 (V1.1 stability):
- Improve error messages and UX guardrails.
- Add tests around slices and core serial flow.
- Harden session logging behavior.

Phase 3 (V2 roadmap):
- NMEA parser and quality metrics.
- raw observation quality analysis.
- upgrade and differential data workflows.

## 9. Acceptance Criteria for V1

- App loads in launcher as a local app on macOS.
- User can connect/disconnect a serial GNSS device.
- User can send commands via predefined template buttons and manual input.
- User can observe incoming serial data in real time.
- User can export current terminal session to local file.

## 10. Risks and Mitigations

1. Risk: hidden coupling to Nordic-specific runtime assumptions.
- Mitigation: start from serial-terminal baseline and keep V1 close to upstream patterns.

2. Risk: export behavior may miss lines if tied only to visible terminal buffer.
- Mitigation: keep explicit session log buffer in state/service path as V1.1 enhancement if needed.

3. Risk: later de-Nordic cleanup can create migration cost.
- Mitigation: isolate all business logic in app layer; avoid launcher changes in V1.

## 11. Open Items (deferred by agreement)

- Private app source strategy and release pipeline.
- Full cross-platform support (Windows later).
- GNSS protocol decomposition for V2 (NMEA/RTCM/raw observations).
- V2 queue:
  - NMEA parser pane (RMC/GGA/GSV) with fix-quality indicators.
  - Raw observation quality summary (C/N0 trends, satellite health snapshots).
  - Device upgrade workflow (firmware package select + progress + rollback guardrails).
  - Differential data injection workflow (RTCM source input and forwarding controls).
