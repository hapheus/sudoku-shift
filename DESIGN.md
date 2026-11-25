---
name: Sudoku Shift
description: Enamel Domino & Chess-Clock Studio inside a native Framework7 (theme="auto") shell — high-contrast, tactile Sudoku ergonomics across Dark Night Enamel, Light Bone Ivory, and the 1981 C64 Retro Easter egg.
colors:
  tournament-cobalt: "#2563eb"
  cobalt-deep: "#1d4ed8"
  cobalt-luminous: "#60a5fa"
  on-accent-white: "#ffffff"
  royal-iris: "#c084fc"
  brass-amber: "#fbbf24"
  emerald-solve: "#4ade80"
  coral-conflict: "#f87171"
  obsidian-ground: "#11141a"
  enamel-tray: "#141820"
  enamel-surface: "#181c24"
  enamel-elevated: "#222834"
  enamel-hover: "#2a3140"
  hairline-border: "#29303e"
  grid-box-line: "#8a95a8"
  grid-cell-line: "#262d3a"
  ivory-ink: "#f7f5f0"
  slate-muted: "#a6b0bf"
  crosshair-peer: "#1d2534"
  selected-cobalt-well: "#1e365c"
  same-digit-well: "#243858"
  same-digit-ink: "#dbeafe"
  chrome-frosted-dark: "rgba(20, 24, 31, 0.92)"
  bone-ground: "#f7f5f0"
  bone-surface: "#ffffff"
  bone-tray: "#edeae2"
  bone-elevated: "#ece8df"
  bone-hover: "#e4dfd4"
  bone-border: "#dad5ca"
  bone-grid-box: "#1c212b"
  bone-grid-cell: "#d6d0c4"
  obsidian-ink: "#14171d"
  graphite-muted: "#525a66"
  light-cobalt-deep: "#1e40af"
  light-iris: "#7c3aed"
  light-amber: "#9a4406"
  light-emerald: "#15803d"
  light-crimson: "#b91c1c"
  light-peer: "#f1eee7"
  light-same-digit-ink: "#1e3a8a"
  chrome-frosted-light: "rgba(255, 255, 255, 0.90)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.85rem, 10.5cqi, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.04em"
  board-digit:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.15rem, 4.8vw, 1.65rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0em"
    fontFeature: "tnum"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0em"
rounded:
  board: "6px"
  preview: "7px"
  sm: "10px"
  button: "12px"
  md: "14px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  touch: "44px"
components:
  button-primary:
    backgroundColor: "{colors.tournament-cobalt}"
    textColor: "{colors.on-accent-white}"
    rounded: "{rounded.button}"
    padding: "10px 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-deep}"
    textColor: "{colors.on-accent-white}"
  button-secondary:
    backgroundColor: "{colors.enamel-surface}"
    textColor: "{colors.ivory-ink}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.enamel-hover}"
    textColor: "{colors.ivory-ink}"
  segmented-track:
    backgroundColor: "{colors.obsidian-ground}"
    rounded: "{rounded.md}"
    padding: "3px"
  segmented-active:
    backgroundColor: "{colors.enamel-elevated}"
    textColor: "{colors.ivory-ink}"
    rounded: "{rounded.sm}"
    padding: "6px 8px"
    height: "44px"
  card-inset:
    backgroundColor: "{colors.enamel-surface}"
    textColor: "{colors.ivory-ink}"
    rounded: "{rounded.md}"
    padding: "12px"
  board-tray:
    backgroundColor: "{colors.enamel-tray}"
    rounded: "{rounded.md}"
    padding: "6px 7px 7px 5px"
  input-field:
    backgroundColor: "{colors.obsidian-ground}"
    textColor: "{colors.ivory-ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "44px"
  tabbar:
    backgroundColor: "{colors.chrome-frosted-dark}"
    textColor: "{colors.slate-muted}"
    padding: "6px 12px 7px"
  tabbar-item-active:
    textColor: "{colors.cobalt-luminous}"
    rounded: "{rounded.md}"
    height: "48px"
  dialog-card:
    backgroundColor: "{colors.enamel-surface}"
    textColor: "{colors.ivory-ink}"
    rounded: "{rounded.md}"
    padding: "16px 18px"
  numpad-key:
    backgroundColor: "{colors.enamel-surface}"
    textColor: "{colors.cobalt-luminous}"
    rounded: "{rounded.sm}"
    padding: "4px 0"
    height: "50px"
---

# Design System: Sudoku Shift

## Overview

**Creative North Star: "Enamel Domino & Chess-Clock Studio"**

Sudoku Shift is an Operate-mode puzzle environment that pairs a genuine native Framework7 (`theme="auto"`) application shell—adapting automatically to Cupertino on iOS/macOS and Material Design on Android and Desktop—with the tactile precision of a recessed enamel board tray and tournament chess clock. Navigation, inset grouped lists, segmented controls, and dialogs behave with immediate platform predictability, while the active Sudoku board sits inside an inset tray where row/column/box crosshairs, matching-digit echoes, and live co-op partner cursors read in a single glance.

The visual system runs across two first-class palettes that sync with OS appearance (`system`, `dark`, `light`) via `data-theme` and a `.dark` bridge on `documentElement`: **Night Enamel** (deep obsidian enamel with bone-ivory ink for evening focus) and **Bone Ivory** (warm paper canvas with crisp white inset cards for daylight reading). An opt-in **1981 C64 Retro Mode** (`[data-retro="true"]`, unlocked via Konami code) intentionally breaks from the studio shell into a zero-radius, scanlined 8-bit pixel world. Generic flat-grey puzzle clones, decorative gradient title fills, and web-div imitations of native chrome are explicitly rejected in favor of high-contrast functional clarity and WCAG 2.2 AA rigor.

**Key Characteristics:**
- **Native Framework7 `theme="auto"` chrome** bridged directly to Enamel semantic tokens (`--f7-theme-color`, `--f7-page-bg-color`, `--f7-bars-bg-color`, `--f7-list-bg-color`, `--f7-card-bg-color`).
- **Recessed enamel board tray** with inset depth, 2px box boundaries, 1px internal hairlines, and tabular-aligned coordinate axes.
- **Role-coded gameplay signals** separating givens (neutral ink), player moves (cobalt), co-op partner moves and cursors (royal iris), logical/spectator hints (brass amber), solved units (emerald), and conflicts (coral/crimson).
- **Equal-pane responsive geometry** engineered for phones, tablets, desktops, itch.io embeds, and dual-screen foldables with hinge avoidance.
- **Strict accessibility and motion discipline** with a 44px minimum touch floor, compositor-only animations, intentional `prefers-reduced-motion` replacements, and `forced-colors` support.

## Colors

The palette pairs low-glare obsidian enamel (Dark) and warm bone ivory (Light) neutrals with three strictly separated gameplay accents—Tournament Cobalt for self, Royal Iris for co-op partner, and Brass Amber for hints—so board ownership never blurs.

### Primary
- **Tournament Cobalt** (`tournament-cobalt`, `#2563eb` dark fill / `cobalt-deep`, `#1d4ed8` light fill & dark hover): Primary call-to-action buttons, active Framework7 theme accent (`--f7-theme-color`), and text selection fills, always paired with **On-Accent White** (`on-accent-white`, `#ffffff`).
- **Cobalt Luminous** (`cobalt-luminous`, `#60a5fa` dark / `cobalt-deep`, `#1d4ed8` light): High-contrast text-role accent (`--color-primary-text`) for user-placed digits (`--color-user`), active tabbar labels, numpad digits, focus outlines (`--color-focus`), and interactive icons on dark enamel surfaces; Light mode darkens hover fills to **Light Cobalt Deep** (`light-cobalt-deep`, `#1e40af`).

### Secondary
- **Royal Iris** (`royal-iris`, `#c084fc` dark / `light-iris`, `#7c3aed` light): Reserved exclusively for co-op partner presence—partner-placed digits, partner cursor outlines and corner pips, Watch directory Join buttons, and Tic Tac Toe `O` marks—backed by soft translucent iris washes (`rgba(192, 132, 252, 0.14)` dark / `rgba(124, 58, 237, 0.11)` light).

### Tertiary
- **Brass Amber** (`brass-amber`, `#fbbf24` dark / `light-amber`, `#9a4406` light): Logical hint previews, armed Hint tool state, spectator hint badges and feed chips, and waiting-state badges. Light mode intentionally deepens brass amber to `#9a4406` (rather than mid-amber) to guarantee ≥4.5:1 AA contrast on white inset cards.
- **Semantic Status — Emerald Solve & Coral Conflict:** **Emerald Solve** (`emerald-solve`, `#4ade80` dark / `light-emerald`, `#15803d` light) signals completed units, solved boards, live WebSocket badges, and online presence; **Coral Conflict** (`coral-conflict`, `#f87171` dark / `light-crimson`, `#b91c1c` light) marks Sudoku rule conflicts, validation errors, disconnected states, and destructive confirmation actions.

### Neutral
- **Night Enamel (Dark Default):** **Obsidian Ground** (`obsidian-ground`, `#11141a`) forms the page canvas and synced `<meta name="theme-color">`; **Enamel Tray** (`enamel-tray`, `#141820`) recesses behind the Sudoku grid and setup preview; **Enamel Surface** (`enamel-surface`, `#181c24`) holds inset cards, lists, numpad keys, and the board base; **Enamel Elevated** (`enamel-elevated`, `#222834`) lifts active segmented pills; **Enamel Hover** (`enamel-hover`, `#2a3140`) provides interactive hover response. **Hairline Border** (`hairline-border`, `#29303e`) frames cards and controls, while **Grid Cell Line** (`grid-cell-line`, `#262d3a`) and **Grid Box Line** (`grid-box-line`, `#8a95a8`) stratify the puzzle grid. Copy uses **Ivory Ink** (`ivory-ink`, `#f7f5f0`) and **Slate Muted** (`slate-muted`, `#a6b0bf`). Board highlights use **Crosshair Peer** (`crosshair-peer`, `#1d2534`), **Selected Cobalt Well** (`selected-cobalt-well`, `#1e365c`), and **Same-Digit Well** (`same-digit-well`, `#243858`) with **Same-Digit Ink** (`same-digit-ink`, `#dbeafe`).
- **Bone Ivory (Light Mode):** **Bone Ground** (`bone-ground`, `#f7f5f0`) serves as the warm paper canvas (`theme-color`), paired with crisp **Bone Surface** (`bone-surface`, `#ffffff`) cards, **Bone Tray** (`bone-tray`, `#edeae2`) recessed wells, **Bone Elevated** (`bone-elevated`, `#ece8df`) segmented tracks, **Bone Hover** (`bone-hover`, `#e4dfd4`), and **Bone Border** (`bone-border`, `#dad5ca`). Gridlines invert to **Bone Grid Box** (`bone-grid-box`, `#1c212b`) and **Bone Grid Cell** (`bone-grid-cell`, `#d6d0c4`), with **Obsidian Ink** (`obsidian-ink`, `#14171d`) and **Graphite Muted** (`graphite-muted`, `#525a66`). Board focus uses **Light Peer** (`light-peer`, `#f1eee7`), **Same-Digit Ink** (`same-digit-ink`, `#dbeafe`) as the selected/matched well, and **Light Same-Digit Ink** (`light-same-digit-ink`, `#1e3a8a`).
- **Translucent Chrome & Artwork Scrims:** Frosted navigation bars use **Chrome Frosted Dark** (`chrome-frosted-dark`, `rgba(20, 24, 31, 0.92)`) and **Chrome Frosted Light** (`chrome-frosted-light`, `rgba(255, 255, 255, 0.90)`). When progressive board artwork reveals beneath solved cells, theme-tuned cell scrims (`rgba(15, 19, 26, 0.84)` / `0.70` dark; `rgba(255, 255, 255, 0.82)` / `0.74` light) and subtle digit text-shadows preserve legibility without muting the artwork.
- **1981 C64 Retro Mode (Easter Egg):** Scoped exclusively to `[data-retro="true"]`, replacing the Enamel palette with Commodore 64 indigo (`#352879` ground, `#40318d` surface, `#e8f1ff` text, `#a8e6ff` cyan primary, `#9ef0a8` mint partner, `#ffe082` hints, and an 8px `#6c5eb5` CRT frame), plus an inverted light-retro variant (`#d8d5f2` ground, `#1f1654` ink).

### Named Rules
- **The Split-Accent Contrast Rule.** Filled buttons use saturated **Tournament Cobalt** (`#2563eb` dark / `#1d4ed8` light) with white ink, whereas text, icons, focus rings, and user digits on dark surfaces always switch to **Cobalt Luminous** (`#60a5fa`) so every interactive label clears WCAG AA without glowing.
- **The Ownership Separation Rule.** Given digits remain neutral ink, self moves own Cobalt, co-op partner moves and cursors own Royal Iris, and hints own Brass Amber. Never cross-assign these hues across roles.
- **The Artwork Scrim Rule.** Progressive board artwork sits behind cells at `0.12` opacity until solved and only illuminates cell-by-cell through calibrated reveal scrims (`--color-reveal-scrim` / `--color-reveal-unit-scrim`), guaranteeing digits never lose contrast against photographic color.

## Typography

**Display Font:** Platform-native UI sans (`-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`)
**Body Font:** Platform-native UI sans (same family, bridged via `--f7-font-family: var(--font-sans)`)
**Label/Mono Font:** System UI monospace (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`) for player tags and technical identifiers; `'Courier New', Courier, monospace` exclusively in 1981 C64 Retro Mode.

**Character:** Zero-latency, OS-authentic typography tuned for instant numerical scanning rather than editorial ornament. Tight negative tracking on bold headings anchors screen identity while tabular numerals keep every Sudoku cell, timer, coordinate axis, and contribution table locked in crisp vertical alignment.

### Hierarchy
- **Display** (`800`, `clamp(1.85rem, 10.5cqi, 3.25rem)`, `1.12` line-height, `-0.04em` tracking, `text-wrap: balance`): Setup hero title (`Sudoku Shift`) in solid high-contrast ink—no gradient text fills.
- **Headline** (`800`, `1.35rem`, `1.2` line-height, `-0.025em` tracking): Top-level section headers for Watch Directory, Settings, and Legal views.
- **Title** (`700`–`800`, `1.0625rem`, `1.25` line-height, `-0.02em` tracking): Framework7 section navbar titles and dialog card headers.
- **Body** (`400`–`600`, `0.875rem`–`0.9375rem`, `1.45`–`1.55` line-height): Setup tagline (`max-width: 34ch`), room card titles, guidance prose, and legal body copy.
- **Label** (`700`, `0.75rem`, `1.2` line-height, `0.04em` tracking, uppercase): Fieldset legends (`Grid`, `Difficulty`, Settings group labels) and the Shift toolbar label; metadata badges and bottom tabbar labels stay sentence-case at `0.75rem` (`600`–`700`).
- **Board Digit** (`700` givens / `600` player & partner / `800` same-digit match, `min(clamp(1.15rem, 4.8vw, 1.65rem), calc(0.86 * var(--cell-size)))`, `1` line-height, `tabular-nums`): Scales fluidly with the board's inline container query (`--cell-size: calc(100cqi / var(--board-columns))`), with 6×6 grids stepping slightly larger (`clamp(1.25rem, 5.5vw, 1.75rem)`). Pencil notes render in a 3×3 or 3×2 mini-grid at `0.27 * var(--cell-size)`.
- **Mono** (`600`, `0.8125rem`, `1.3` line-height): Player `#tag` badges and legal inline storage keys.

### Named Rules
- **The Tabular Digits Rule.** Every numeric readout—board cells, coordinate axes, numpad remaining counters, live room progress (`filled/total`), timers, volume percentages, and solve contribution tables—must declare `font-variant-numeric: tabular-nums` so numbers never jitter as counts change.
- **The Single H1 Landmark Rule.** Every route renders one `<main>` landmark and one `<h1>` (visually prominent on Setup, Watch, Settings, and Legal; `.sr-only` on Gameplay so the board owns the entire viewport).

## Layout

Sudoku Shift is governed by a viewport-locked **Equal-Pane Architecture** (`.split-panes`) that guarantees balanced geometry across portrait phones, landscape desktops, itch.io iframes, and dual-screen foldables:

- **Portrait Flow (`max-width: 500px` centered column):**
  - Menu screens (Setup, Watch, Settings) stack vertically inside `.landscape-screen__content` with `0.75rem` gaps above a fixed translucent 3-tab bottom bar (`padding-bottom: calc(4.75rem + env(safe-area-inset-bottom))`). On Setup viewports taller than `680px`, a recessed 6×3 enamel board preview sits between the left-aligned large header and the inset control card; on shorter screens (`≤680px`) or landscape, it hides cleanly so the primary CTA never clips.
  - Active Gameplay splits the usable viewport height (`--layout-height: calc(100dvh - var(--layout-inset-top) - var(--layout-inset-bottom))`) into two equal vertical tracks (`--pane-size: round(down, calc((100% - 0.5rem) / 2), 1px)`): board pane above, controls plus anchored frosted bottom toolbar below.
  - Narrow portraits (`≤429px` width and `≥620px` height) reflow the 9-key numpad into a 5+4 two-row grid so digit keys remain generous; short viewports (`<620px` height) keep a single 9-column row (`min-height: 44px`) so the Shift bar stays visible without clipping.
- **Landscape & Desktop Equal-Pane Split (`@media (orientation: landscape)`):**
  - Switches `.split-panes` to two equal horizontal columns separated by `1.25rem` (`--split-gap`).
  - Menu screens display curated `LandscapeArtwork` in the left pane (framed in Light mode with `0.75rem` `bone-elevated` matting, `14px` image radius, and ambient shadow) and place the static 3-tab navigation bar at the top of the right pane above scrollable content.
  - Gameplay places the board in the left pane (sized via `container-type: size` and `100cqh`) and the toolbar + 3×3 numpad (`min-width: 900px` or `max-height: 540px`) + tools in the right pane.
  - Compact landscape (`max-height: 540px`) and horizontal dual-screen foldables also divide Setup and Settings into a 2-column `.split-layout` grid.
- **Foldable & Embedded Adaptation:**
  - Dual-screen hardware uses CSS viewport segments (`horizontal-viewport-segments: 2` and `vertical-viewport-segments: 2`) to compute `--pane-gap` / `--split-gap` directly from `env(viewport-segment-*)`, keeping content and modal backdrops clear of the physical hinge.
  - Embedded subpath contexts (`[data-embedded="true"]`, e.g., itch.io) remove `max-width` caps, allow `--board-max-size: 100%`, and preserve vertical scroll safety on short embeds (`min-height: 26rem` portrait).
- **Spacing Rhythm & Scaling:** Base spacing steps on a 4px rhythm (`4px` / `8px` / `12px` / `16px`). Every interactive control honors `--touch-min: 44px` (`48px` on bottom nav items, `50px` on desktop numpad keys, `52px` on the primary Setup CTA). Container queries (`@container (max-width: 17.5rem)`) wrap the 4-tier Difficulty selector into a 2×2 grid at 200% text scaling (WCAG 1.4.4) with zero horizontal overflow.

## Elevation & Depth

Sudoku Shift uses a **hybrid recessed-and-framed depth model**: structural hierarchy is carried primarily by 1px hairline borders and tonal surface steps (`obsidian-ground` → `enamel-tray` → `enamel-surface` → `enamel-elevated`), while inset shadows carve the board tray and calibrated drop shadows lift only floating surfaces (active segmented pills, the board frame, confirmation banners, and modal dialogs). Surfaces never float arbitrarily with decorative glow.

### Shadow Vocabulary
- **Recessed Tray (`--shadow-tray`):** `inset 0 2px 10px rgba(0, 0, 0, 0.42)` dark / `inset 0 2px 8px rgba(20, 23, 29, 0.08)` light — carves physical depth into the Sudoku `.board-tray` and Setup `.setup-enamel-tray`.
- **Small Lift (`--shadow-sm`):** `0 2px 6px rgba(0, 0, 0, 0.28)` dark / `0 1px 4px rgba(20, 23, 29, 0.10)` light — subtle grounding for inset cards, grouped lists, range thumbs, and active segmented pills (paired with a `1px` top specular highlight `inset 0 1px 0 rgba(255, 255, 255, 0.08)` in dark mode).
- **Board Grounding (`--color-board-shadow`):** `0 10px 28px rgba(0, 0, 0, 0.38)` dark / `0 10px 26px rgba(20, 23, 29, 0.10)` light — anchors the Sudoku and Tic Tac Toe grids inside their tray.
- **Medium & Large Floating (`--shadow-md`, `--shadow-lg`):** `0 6px 18px` / `0 10px 24px` (`0.28` dark / `0.11–0.12` light) — feedback toasts, fist-bump popovers, Light-mode landscape artwork frames, and confirmation banners.
- **Modal & Callout (`--shadow-dialog`, `--shadow-callout`):** `0 22px 48px rgba(0, 0, 0, 0.48)` and `0 18px 44px rgba(0, 0, 0, 0.55)` dark (`0.20` / `0.24` light) — Help/Game Info dialogs over dimmed backdrops (`rgba(8, 10, 14, 0.78)` dark / `rgba(20, 23, 29, 0.56)` light) and Tic Tac Toe transition callouts.
- **Frosted Translucent Chrome:** Section navbars, bottom tabbar, and portrait gameplay toolbars pair semi-opaque `--color-nav-bg` with `backdrop-filter: saturate(180%) blur(20px)`.

### Named Rules
- **The Recessed Board Rule.** The Sudoku grid sits inside a sunken tray (`--color-tray-bg` + `--shadow-tray`) while cards and dialogs sit above the canvas; never place the active grid flat on bare canvas without its recessed tray.
- **The Compositor-Only Motion Rule.** Transitions and keyframes animate `transform`, `opacity`, and subtle color/border shifts only (`100ms–250ms ease` for controls; `cubic-bezier(0.22, 1, 0.36, 1)` for unit celebrations, hints, and solve reveals). Under `@media (prefers-reduced-motion: reduce)`, all vestibular transforms, floats, rotations, and Framework7 ripples disable while preserving static high-contrast hint, selection, and solved states (never a blunt global `0.01ms` kill-switch).

## Shapes

Form language balances native Cupertino/Material friendliness with board-game crispness along a tight six-step radius scale:

- **Board Grid (`6px`) & Setup Preview (`7px`):** Crisp architectural corners for the 9×9 / 6×6 grid enclosure so corner cells never clip digits or selection outlines.
- **Compact Controls (`10px`, `--radius-sm`):** Tool buttons, numpad keys, shift arrows, active segmented inner pills, refresh/close buttons, search inputs, and feedback bars.
- **Native Action Buttons (`12px`, `--f7-button-border-radius`):** Large Framework7 primary and tonal CTAs and strong segmented outer tracks (`9px` inner pill radius via `--f7-segmented-strong-button-border-radius`).
- **Cards, Trays & Dialogs (`14px`, `--radius-md`):** Inset grouped lists, `.f7-inset-card`, `.board-tray`, `.dialog-card`, `.live-game-card`, section navbars, bottom nav active items, and selects/inputs in Settings.
- **Pills & Status Dots (`9999px`, `--radius-full`):** Telemetry badges, connection/presence pills, spectator hint chips, App Store link button, slider tracks, and cursor corner pips (`7px–8px` circles).
- **Grid Hairline Ratio:** Within the board, sub-box dividers are always `2px solid var(--color-grid-box)` and internal cell hairlines are `1px solid var(--color-grid-cell)` (the exact ratio echoed in `VariantGridIcon` with `1.3` vs `0.55` non-scaling SVG strokes).
- **1981 C64 Retro Override:** `[data-retro="true"]` zeroes all radii (`0px`), switches containers to `3px solid` borders with `4px 4px 0` hard pixel offset shadows, and applies a 4×4px subtle scanline overlay.

## Components

Controls combine Framework7 React primitives (`F7App`, `Button`, `segmented-strong`, `navbar`, `toolbar`/`tabbar`) with tactile enamel puzzle components—confident, responsive, and unambiguous in state.

### Buttons
- **Shape:** Gently rounded native corners (`12px` for Framework7 large CTAs; `14px` for `.btn-primary`/`.btn-secondary`; `10px` for compact toolbar/card actions), `text-transform: none`, `44px` minimum height (`52px` on primary Setup CTA).
- **Primary (`button-primary`):** Solid **Tournament Cobalt** (`#2563eb` dark / `#1d4ed8` light) with **On-Accent White** (`#ffffff`) bold label (`700`, `1rem` large / `0.9375rem` default), `padding: 0.625rem 1.5rem`.
- **Hover / Focus / Disabled:** Hover deepens to **Cobalt Deep** (`#1d4ed8` dark / `#1e40af` light) over `150ms ease`; keyboard focus draws a `3px solid` **Cobalt Luminous** (`#60a5fa` dark / `#1d4ed8` light) outline at `2px` offset; disabled reduces to `0.45–0.55` opacity with `not-allowed` cursor.
- **Secondary / Tonal & Partner Actions:** Secondary/tonal buttons sit on `enamel-surface` (`#181c24` / `#ffffff`) with a `1px` hairline border and `enamel-hover` hover state. Co-op Join buttons use filled **Royal Iris** (`#c084fc` / `#7c3aed`); Solve Play Again uses filled **Emerald Solve** (`#4ade80` / `#15803d`); destructive confirms use filled **Coral Conflict** (`#f87171` / `#b91c1c`).

### Segmented Controls
- **Style:** Native Framework7 `.segmented.segmented-strong` tracks (`14px` radius, `3px` padding, `3px` gap, `1px` hairline border) resting on `obsidian-ground` in Dark mode and `bone-elevated` in Light mode.
- **State:** Inactive options sit transparent in muted ink (`600`, `44px` min-height). The active option lifts onto `enamel-elevated` (Dark, with `1px` top inner highlight + `--shadow-sm`) or crisp `bone-surface` white (Light, with soft drop shadow) in bold primary ink (`700`). Radio inputs remain visually hidden inside `<label>` with `:has(input:focus-visible)` drawing the full `3px` focus ring.

### Cards & Inset Lists
- **Corner Style:** Soft native container corners (`14px`, `--radius-md`).
- **Background & Border:** `enamel-surface` (`#181c24` dark / `#ffffff` light) framed by `1px solid var(--color-border)` and grounded with `--shadow-sm`.
- **Internal Structure:** `.f7-inset-card` carries `0.75rem` padding for Setup selectors; `.f7-inset-list` stacks `.f7-inset-list__item` rows (`0.7rem 0.85rem` padding) separated by `1px` hairline dividers (`+` combinator) across Settings and Watch Directory.

### Inputs & Selects
- **Style:** Recessed `obsidian-ground` (Dark) / `bone-ground` (Light) wells with `1px` hairline border, `10px–14px` radius, `44px` minimum height, `0.875rem–0.9375rem` text, and `caret-color: var(--color-primary-text)`. Search inputs embed a `16px` drawn magnifier SVG at left (`2.25rem` left padding).
- **Focus & Validation:** `:focus-visible` applies a `2px–3px` primary focus outline at `2px` offset; invalid player names set `aria-invalid="true"` and display inline `coral-conflict` / `light-crimson` alerts (`0.75rem`, `600`).
- **Volume Sliders:** Custom-styled range inputs (`44px` hit target, `4px` rounded hairline track, `22px` white thumb ringed with `2px` primary cobalt and `--shadow-sm`), dimming to `0.65` opacity when audio is toggled off.

### Navigation
- **Tabbar (`.bottom-nav.toolbar.tabbar-icons`):** Three equal tabs (`Play`, `Watch`, `Settings`) with `20px` drawn line icons and `0.75rem` labels (`48px` min-height, `14px` item radius), fixed over translucent frosted chrome in portrait and docked statically at the top of the right pane in landscape. Active tabs illuminate with `cobalt-luminous` / `light-cobalt` ink over `--color-nav-active-bg` (`rgba(96, 165, 250, 0.16)` dark / `rgba(29, 78, 216, 0.11)` light). A `ResizeObserver` switches to compact icon-only mode automatically if localized labels overflow narrow widths, and a live `8px` emerald dot badges `Watch` during active spectating.
- **Section Navbars & Game Toolbar:** Watch and Settings lead with a frosted `.f7-section-navbar.navbar` (`44px` min-height, `14px` radius); Setup uses a clean left-aligned `.f7-large-header` in portrait. Gameplay anchors `.gameplay-stage__toolbar` at the bottom in portrait (frosted glass) and top in landscape, holding the `Back` button, `44×44px` Info/Guide icon buttons, and `New Puzzle` / `Abort` (or Spectator `Join` / `Back`) controls.

### Dialogs & Sheets
- **Style:** Centered modal `.dialog-card` (`max-width: 460px`, `max-height: 88dvh`, `14px` radius, `1rem 1.125rem` padding, `--shadow-dialog`) over a dimmed `.dialog-backdrop` (`z-index: 60`), topped by a hairlined `.f7-dialog-navbar` header and tonal `Close` button. Traps keyboard focus, closes on `Escape` or backdrop click, and restores focus to its opener ref. In landscape gameplay/settings, Help and Game Info dock inline as borderless-shadow `.dialog-card--panel` side panels inside the controls pane.

### Recessed Enamel Sudoku Board & Tray
- **Tray & Axes:** `.board-tray` wraps the grid with `enamel-tray` / `bone-tray` fill, `1px` border, `14px` radius, and `--shadow-tray`. Coordinate axes (`A–I` / `A–F` columns, `1–9` / `1–6` rows) render in `0.625rem` bold muted `tabular-nums`.
- **Cell Hierarchy:** Givens carry subtle translucent tint (`rgba(255,255,255,0.035)` dark / `rgba(28,33,43,0.04)` light) and `700` neutral ink; user digits use `600` cobalt; partner digits use `600` royal iris. Interactive states layer cleanly: peer crosshair (`--color-peer`), same-digit match (`--color-same-digit` + `1.5px` outline + `800` weight), selected cell (`--color-selected-cell` + `2.5px` focus outline), partner cursor (`--color-partner-bg` + `2px` inset iris ring + `7px` bottom-left pip), spectator/host cursor (`8px` top-left cobalt pip), hint preview/flash (brass amber `1.5px–3px` inset ring), and conflict (`--color-error-bg` + `2px` coral outline).
- **High Contrast (`forced-colors: active`):** Preserves `1px solid ButtonText` cell borders, `3px solid Highlight` selected/active outlines, `2px dashed Highlight` remote cursors, and underlined partner digits.

### Player Controls & Numpad
- **Tool Bar:** Four equal `44px` tactile keys (`Undo`, `Erase`, `Notes`, `Hint`) with `16px` stroke icons and optional desktop `<kbd>` shortcut badges (`N` at `≥520px` fine pointer). Active `Notes` highlights in cobalt tint (`--color-active-tool-bg` + primary border); armed `Hint` highlights in brass amber (`--color-hint-bg` + `--color-hint` border).
- **Number Pad:** `50px` tall (`44px` on `<500px` screens) enamel keys showing bold cobalt digits (`1.125rem`) over muted `tabular-nums` remaining counts (turning into a drawn `12px` `IconCheck` when all instances are placed). Presses depress with `scale(0.96)` over `100ms` (disabled under reduced motion).
- **Shift Bar:** Four `44×44px` directional arrow buttons (using drawn `17px` arrow SVGs) with an inline contextual hint when no cell is selected; seamlessly morphs into Konami `B`/`A` triggers or the `Back to {year}` retro exit button during Easter eggs.

### Icons & Drawn Graphics
- **Stroke Grammar:** All UI chrome icons (`AppIcons.jsx`, `BottomNav.jsx`, `PlayerControls.jsx`, `GameToolbar.jsx`) are custom inline SVGs on a `24×24` viewBox with `1.9–2px` stroke width, `round` caps, and `round` joins, inheriting `currentColor`—replacing raw Unicode arrows and checkmarks. `VariantGridIcon` dynamically draws exact 6×6 (`2×3`) and 9×9 (`3×3`) grid ratios with `vectorEffect="non-scaling-stroke"`.

## Do's and Don'ts

### Do:
- **Do** route all native shell controls through Framework7 `theme="auto"` classes and bridge them to the Enamel CSS custom properties (`--f7-theme-color`, `--f7-page-bg-color`, `--f7-bars-bg-color`, `--f7-list-bg-color`) rather than hardcoding platform colors.
- **Do** keep dark-mode text, icons, focus outlines, and user digits on **Cobalt Luminous** (`#60a5fa` via `--color-primary-text` / `--color-focus`) while reserving saturated **Tournament Cobalt** (`#2563eb`) for filled button surfaces with white ink.
- **Do** apply `font-variant-numeric: tabular-nums` to every numeric cell, counter, axis, timer, and results table.
- **Do** enclose Sudoku grids and setup previews inside a recessed tray (`--color-tray-bg` + `--shadow-tray`) with `2px` box boundaries and `1px` cell hairlines.
- **Do** maintain the `44px` (`--touch-min`) minimum touch floor across every button, tab, segmented radio option, input, select, and slider.
- **Do** use drawn inline SVG icons (`1.9px–2px` round-cap stroke) for navigation, arrows, search, checkmarks, and settings controls.
- **Do** pair every new animation with a purposeful non-vestibular fallback inside `@media (prefers-reduced-motion: reduce)` and preserve semantic outlines inside `@media (forced-colors: active)`.

### Don't:
- **Don't** apply gradient text fills, glowing shadows, or decorative chrome to headings, buttons, or the Sudoku board.
- **Don't** reuse Royal Iris (`#c084fc` / `#7c3aed`) or Brass Amber (`#fbbf24` / `#9a4406`) for general primary navigation or self actions; keep them strictly scoped to co-op partner presence and hint signals.
- **Don't** substitute raw Unicode glyphs (`←`, `→`, `✓`, `↑`, `↓`) for UI chrome icons; emoji belong only to domain-level spectator reactions and the Co-op Fist Bump Easter egg.
- **Don't** break the `.split-panes` equal-track grid or omit `env(safe-area-inset-*)` and `viewport-segment-*` hinge variables when adding new views or overlays.
- **Don't** leak 1981 C64 Retro Mode styling (`0px` radii, `4px 4px 0` offset shadows, scanlines, Courier monospace) outside `[data-retro="true"]`.
- **Don't** add a global `* { animation-duration: 0.01ms !important }` override; keep reduced-motion fallbacks explicit and legible.
