# GNSS Terminal V1 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable `pc-gnssconnect-terminal` local app (macOS-first) on top of Nordic app conventions, supporting serial connect/send/receive and session log export.

**Architecture:** Fork `pc-nrfconnect-serial-terminal` as the baseline and keep its app composition (`App`, `deviceSelect`, `sidePanel`, `panes`, Redux slices). Add a lightweight command-template feature in app layer only, without launcher core changes. Keep launcher as shell and run the app via local-app workflow.

**Tech Stack:** Electron launcher, React, Redux Toolkit, TypeScript, `@nordicsemiconductor/pc-nrfconnect-shared`, serialport, Jest.

---

## File Structure And Ownership

Primary workspace roots:
- Launcher shell repo: `/Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher`
- New app repo (to create): `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal`

Planned files to create/modify in new app repo:
- Create: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/features/templates/templateSlice.ts`
- Create: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/features/templates/defaultTemplates.ts`
- Create: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/components/Terminal/CommandTemplates.tsx`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/package.json`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/appReducer.ts`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/components/Terminal/Main.tsx`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/components/Terminal/TerminalSettings/ExportLog.tsx`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/index.tsx`

Planned tests:
- Create: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/features/templates/templateSlice.test.ts`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/components/Terminal/Main.test.tsx` (if file absent, create it)

Launcher-side docs/run helper:
- Create: `/Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher/docs/superpowers/runbooks/gnss-local-app.md`

## Task 1: Bootstrap App Repository From Nordic Serial Terminal

**Files:**
- Create (repo): `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/package.json`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/README.md`

- [ ] **Step 1: Clone baseline repo into workspace**

Run:
```bash
git clone https://github.com/NordicSemiconductor/pc-nrfconnect-serial-terminal.git /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal
```
Expected: repository cloned successfully.

- [ ] **Step 2: Create feature branch**

Run:
```bash
git -C /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal checkout -b codex/gnss-terminal-v1-foundation
```
Expected: switched to new branch.

- [ ] **Step 3: Rename package identity to GNSS tool**

Update `package.json` fields:
```json
{
  "name": "pc-gnssconnect-terminal",
  "displayName": "GNSS Terminal",
  "description": "Serial terminal for GNSS device communication"
}
```
Also update repository/homepage if private placeholders are needed.

- [ ] **Step 4: Run metadata checks**

Run:
```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal
npm install
npm run check:app
```
Expected: `check-app-properties` passes.

- [ ] **Step 5: Commit bootstrap rename**

Run:
```bash
git -C /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal add package.json README.md
git -C /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal commit -m "chore: bootstrap GNSS terminal app from serial-terminal"
```

## Task 2: Wire Local-App Runbook (Launcher Integration Without Core Changes)

**Files:**
- Create: `/Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher/docs/superpowers/runbooks/gnss-local-app.md`

- [ ] **Step 1: Document local app directory convention**

Add runbook section with exact path:
```text
~/.nrfconnect-apps/local/pc-gnssconnect-terminal
```

- [ ] **Step 2: Document dev start commands**

Add commands:
```bash
# Terminal A: app
cd /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal
npm run watch

# Terminal B: launcher
cd /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher
npm run watch:build
npm run app
```

- [ ] **Step 3: Verify launcher discovers the local app**

Manual check:
- App appears in launcher local apps list.
- App window opens.

- [ ] **Step 4: Commit runbook**

Run:
```bash
git -C /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher add docs/superpowers/runbooks/gnss-local-app.md
git -C /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher commit -m "docs: add GNSS local app runbook"
```

## Task 3: Add Command Template State (TDD)

**Files:**
- Create: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/features/templates/defaultTemplates.ts`
- Create: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/features/templates/templateSlice.ts`
- Create: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/features/templates/templateSlice.test.ts`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/appReducer.ts`

- [ ] **Step 1: Write failing tests for template slice**

```ts
import reducer, { selectTemplateById, setSelectedTemplateId } from './templateSlice';

it('has built-in templates and no selection by default', () => {
  const state = reducer(undefined, { type: 'init' });
  expect(state.templates.length).toBeGreaterThan(0);
  expect(state.selectedTemplateId).toBeUndefined();
});

it('updates selected template id', () => {
  const state = reducer(undefined, setSelectedTemplateId('poll-version'));
  expect(state.selectedTemplateId).toBe('poll-version');
});
```

- [ ] **Step 2: Run test and confirm failure**

Run:
```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal
npm test -- src/features/templates/templateSlice.test.ts
```
Expected: FAIL because files/symbols do not exist yet.

- [ ] **Step 3: Implement minimal template state**

`defaultTemplates.ts` shape:
```ts
export interface CommandTemplate {
  id: string;
  label: string;
  payload: string;
  description?: string;
}

export const defaultTemplates: CommandTemplate[] = [
  { id: 'poll-version', label: 'Poll Version', payload: 'VERSION?' },
  { id: 'save-config', label: 'Save Config', payload: 'SAVE' },
];
```

`templateSlice.ts` exports reducer + selectors.

- [ ] **Step 4: Register slice in app reducer**

Add to `combineReducers` in `appReducer.ts`:
```ts
import templateReducer from './features/templates/templateSlice';

const appReducer = combineReducers({
  terminal: terminalReducer,
  historyFile: historyFileReducer,
  templates: templateReducer,
});
```

- [ ] **Step 5: Run tests and confirm pass**

Run:
```bash
npm test -- src/features/templates/templateSlice.test.ts
```
Expected: PASS.

- [ ] **Step 6: Commit template state**

Run:
```bash
git add src/features/templates src/appReducer.ts
git commit -m "feat: add command template state"
```

## Task 4: Add Template UI And Send Integration (TDD)

**Files:**
- Create: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/components/Terminal/CommandTemplates.tsx`
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/components/Terminal/Main.tsx`
- Test: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/components/Terminal/Main.test.tsx`

- [ ] **Step 1: Write failing UI behavior tests**

Test cases:
```ts
it('renders template buttons from state', () => {
  // render with mock store including templates
  // expect button label to be visible
});

it('sends template payload through command callback', () => {
  // click template button
  // expect serialPort.write called with normalized payload
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run:
```bash
npm test -- src/components/Terminal/Main.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implement `CommandTemplates` component**

Component contract:
```tsx
interface Props {
  onSendTemplate: (payload: string) => void;
}
```
Render list of buttons from selector and call `onSendTemplate(template.payload)`.

- [ ] **Step 4: Wire component into `Main.tsx`**

In `Main.tsx`:
- Add `sendTemplate(payload)` helper that reuses existing command pipeline.
- Keep line-ending normalization behavior identical to manual send.

- [ ] **Step 5: Run test suite for this area**

Run:
```bash
npm test -- src/components/Terminal/Main.test.tsx
```
Expected: PASS.

- [ ] **Step 6: Commit UI integration**

Run:
```bash
git add src/components/Terminal/Main.tsx src/components/Terminal/CommandTemplates.tsx src/components/Terminal/Main.test.tsx
git commit -m "feat: add predefined command template send UI"
```

## Task 5: GNSS-Oriented Log Export Naming + Session Consistency

**Files:**
- Modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/components/Terminal/TerminalSettings/ExportLog.tsx`
- Optional modify: `/Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal/src/components/Terminal/Terminal.tsx`

- [ ] **Step 1: Write failing test for export filename prefix**

Expected pattern:
```text
gnss-terminal-YYYYMMDD_HHMMSS.txt
```

- [ ] **Step 2: Implement minimal filename change**

Update:
```ts
const fileName = `gnss-terminal-${formattedDate}.txt`;
```

- [ ] **Step 3: Ensure export still writes terminal session content**

Manual check:
- click export
- choose file path
- verify file contains RX/TX content.

- [ ] **Step 4: Commit export adjustment**

Run:
```bash
git add src/components/Terminal/TerminalSettings/ExportLog.tsx
git commit -m "feat: rename exported log file for GNSS terminal"
```

## Task 6: End-To-End Verification On macOS

**Files:**
- Modify (if needed): `/Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher/docs/superpowers/runbooks/gnss-local-app.md`

- [ ] **Step 1: Run quality gates in app repo**

Run:
```bash
cd /Users/weifeng/Workspace/PCtool/pc-gnssconnect-terminal
npm run check
npm test
```
Expected: all checks pass.

- [ ] **Step 2: Run launcher + app smoke flow**

Manual validation:
- launcher starts
- local GNSS app appears
- connect serial device
- send manual command
- send template command
- receive serial data
- export logs.

- [ ] **Step 3: Record outcomes in runbook**

Add a "Verification" section with date + result + known gaps.

- [ ] **Step 4: Commit verification notes**

Run:
```bash
git -C /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher add docs/superpowers/runbooks/gnss-local-app.md
git -C /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher commit -m "docs: add GNSS terminal verification notes"
```

## Task 7: Handoff And Next Iteration Setup

**Files:**
- Modify: `/Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher/docs/superpowers/specs/2026-03-17-gnss-platform-v1-design.md`

- [ ] **Step 1: Mark V1 scope delivered in spec**

Add a short status block:
```md
Implementation status (V1 foundation): COMPLETE
```

- [ ] **Step 2: Add V2 queue items (NMEA/obs quality/upgrade/diff-data)**

Add explicit backlog bullets under open items.

- [ ] **Step 3: Commit status update**

Run:
```bash
git -C /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher add docs/superpowers/specs/2026-03-17-gnss-platform-v1-design.md
git -C /Users/weifeng/Workspace/PCtool/pc-nrfconnect-launcher commit -m "docs: update GNSS V1 spec implementation status"
```

## Definition Of Done

V1 is complete only when all are true:
- `pc-gnssconnect-terminal` builds and runs from launcher local apps flow.
- Serial connect/send/receive works on macOS.
- Predefined templates and manual input both trigger command send.
- Session logs export to local file with GNSS naming.
- `npm run check` and `npm test` pass in app repo.
- Runbook is present and verified.
