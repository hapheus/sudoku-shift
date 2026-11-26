---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: ["src/styles/app.css","src/components/SetupView.jsx","src/components/GamePlayView.jsx","src/components/SettingsPanel.jsx","src/components/WatchDirectory.jsx","src/components/BottomNav.jsx"]
---

# Surface Brief — Sudoku Shift (Framework7 Native Redesign)

- **Scope:** Full app UI (`src/App.jsx`, Setup, Gameplay, Watch Directory, Settings, Dialogs/Popups, Legal pages)
- **Mode:** Operate (mobile-first iOS/Android Capacitor + Web + itch.io embed)
- **Platform shell:** Framework7 React (`theme="auto"` — Cupertino on iOS/macOS, Material Design on Android/Desktop)
- **Preserved invariants:** All Sudoku & Shift domain logic, real-time Centrifugo co-op & spectator flows, Equal-Pane landscape/foldable layout (with left artwork panel), progressive board artwork reveal, WCAG 2.2 AA accessibility & EN/DE localization, and all Easter eggs (1981 C64 Retro Mode, Night Ghost, Co-op Fist Bump, Tic Tac Toe).

## Direction contract

- **THESIS:** Enamel Domino & Chess-Clock Studio inside a genuine native Framework7 (`theme="auto"`) shell — refusing generic bare-grid grey puzzle clones and web-div imitations by combining native Cupertino/Material chrome (Navbar, Tabbar, Inset Lists, Segmented Controls, Popups/Sheets) with a deeply tactile, recessed enamel Sudoku tray.
- **OWN-WORLD:** Obsidian enamel dark (`#11141a` ground, `#181c24` elevated tray/cards, `#2563eb` tournament cobalt, `#c084fc` royal iris partner, `#fbbf24` brass-amber hints) and bone-ivory light (`#f7f5f0` ground, `#ffffff` inset cards, `#1d4ed8` cobalt, `#7c3aed` iris, `#b45309` brass-amber) carried through Framework7 CSS tokens (`--f7-theme-color`, `--f7-page-bg-color`, `--f7-list-bg-color`, `--f7-bars-bg-color`) and native platform typography (`SF Pro` / `Roboto` with `tabular-nums`).
- **STORY:** Players immediately recognize native OS navigation and controls (Play / Watch / Settings Tabbar, grouped Setup cards, Segmented variant/difficulty selectors), launch directly into a recessed enamel board where live row/col/box crosshairs and co-op partner cursors read instantaneously, and manage live matches or settings via native lists and sheets without visual friction.
- **FIRST VIEWPORT:** Portrait (`390×844`): native Framework7 Navbar + large bold `Sudoku Shift` header, recessed enamel mini-grid/setup focus or clean Inset Grouped card containing 6×6 / 9×9 Segmented selector and 4-tier Difficulty Segmented selector, full-width Tournament Cobalt primary `Play` F7 Button, App Store/Legal footer, anchored over a native translucent 3-tab F7 Tabbar (Play, Watch, Settings). Landscape (`1280×800`, `844×390`, dual-screen): equal-width split panes keeping left artwork/board and right F7 navigation + content cleanly separated.
- **FORM:** Candidate 6 — Enamel Domino & Chess-Clock Studio (Framework7 `theme="auto"`), seed:69f8985f10762aa1.
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
