# Sudoku Shift — Design System

## Design Direction
**Editorial Paper & Ink (Operate Mode)** — quiet, high-legibility puzzle ergonomics that keep the board and numbers primary. Two first-class themes sync automatically with OS preferences (`system`, `dark`, `light`), complemented by an opt-in 1981 C64 Retro Easter-egg theme (`[data-retro="true"]`).

- **Dark default (`Night Ink`):** Deep slate-ink ground (`#13161b`), warm ivory ink (`#f3efe6`), sky-blue player accent (`#7cb3ff`), and lavender partner accent (`#c4b5fd`).
- **Light mode (`Warm Paper`):** Warm cream paper ground (`#f6f2ea`), crisp card paper (`#fffdf8`), charcoal ink (`#1b1f23`), cobalt player accent (`#1d4ed8`), and violet partner accent (`#7c3aed`).

## Color Tokens (`src/styles/app.css`)

| Semantic Token | Dark (`Night Ink`) | Light (`Warm Paper`) | Role |
|---|---|---|---|
| `--color-bg` | `#13161b` | `#f6f2ea` | Page canvas |
| `--color-surface` | `#1b1f26` | `#fffdf8` | Primary cards, board base, controls |
| `--color-surface-elevated` | `#242933` | `#ede6d8` | Active segmented pills, elevated controls |
| `--color-surface-hover` | `#2c3340` | `#e5ddd0` | Interactive hover surfaces |
| `--color-border` | `#323946` | `#d8cfc0` | Control & card outlines |
| `--color-grid-box` | `#8b94a3` | `#1e242b` | 2px Sudoku box boundaries |
| `--color-grid-cell` | `#2e3440` | `#d5ccbc` | 1px internal cell gridlines |
| `--color-text` | `#f3efe6` | `#1b1f23` | Primary copy & given digits |
| `--color-text-muted` | `#a6b0bd` | `#525862` | Secondary labels, pencil notes, metadata (≥4.5:1 AA across surfaces & selected cells) |
| `--color-primary` / `--color-user` | `#7cb3ff` | `#1d4ed8` | Primary CTA, focus rings, user-placed digits |
| `--color-on-primary` | `#0f141d` | `#ffffff` | Foreground on filled accent buttons |
| `--color-partner` | `#c4b5fd` | `#7c3aed` | Co-op partner digits & cursor |
| `--color-selected-cell` | `#243856` | `#d6e6fd` | Active selected cell tint |
| `--color-same-digit` | `#283952` | `#dbeafe` | Matching digit & candidate note highlight |
| `--color-success` | `#4ade80` | `#15803d` | Unit completion, solved state, live badge |
| `--color-error` | `#f87171` | `#b91c1c` | Conflicts, validation errors, destructive confirms |
| `--color-error-border` | `rgba(248, 113, 113, 0.75)` | `rgba(185, 28, 28, 0.72)` | Conflict cell outline |
| `--color-hint` | `#fbbf24` | `#9a4406` | Logical hints & spectator suggestions |

### Elevation Tokens
Shadows use semantic tokens (`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-dialog`, `--shadow-callout`, `--shadow-emoji`, `--color-board-shadow`) calibrated separately for dark and light modes.

## Typography
- **Font stack:** `--font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;` (platform-native Operate-mode clarity; monospace stack for Retro mode and player tags).
- **Numeric alignment:** `font-variant-numeric: tabular-nums` on all Sudoku cells, numpad counts, coordinate axes, timers, and contribution tables.
- **Headings:** Every view renders one `<main>` landmark and a proper `<h1>` (`.sr-only` on Gameplay; solid high-contrast `clamp(1.85rem, 10.5cqi, 3.25rem)` without decorative gradient fills on Setup).

## Layout & Responsive Rules
- **Touch floor:** `--touch-min: 44px` on all primary buttons, tabs, segmented options, inputs, and dropdowns.
- **Equal-pane architecture (`.split-panes`):**
  - **Portrait:** Two equal vertical tracks (board above, controls + anchored bottom toolbar below), with safe-area and dual-screen `vertical-viewport-segments: 2` support. Narrow portraits (`≤429px` width, `≥620px` height) use a 5+4 two-row numpad so digit keys exceed `44×44px`; short viewports (`<620px` height, e.g. `320×568`) keep a compact single-row numpad so the Shift bar stays unclipped.
  - **Landscape:** Two equal horizontal tracks (board or decorative artwork left, controls or setup/settings/watch right), with `horizontal-viewport-segments: 2` hinge avoidance. In light mode, `.landscape-artwork--left` uses an inset editorial frame (`padding: 0.75rem`, `--color-surface-elevated`) to harmonize dark artwork with the warm paper canvas.
- **Text scaling (WCAG 1.4.4):** `.difficulty-group` uses a container query (`@container (max-width: 17.5rem)`) to wrap the 4-option difficulty bar into a 2×2 grid at 200% text scaling with zero horizontal clipping.

## Motion & Accessibility
- **Compositor-only animations:** Keyframes animate `transform` and `opacity` only (no layout properties like `inset-inline-start`, no animated `filter: blur`, no animated `box-shadow` across cells).
- **Intentional reduced motion:** A single consolidated `@media (prefers-reduced-motion: reduce)` section disables vestibular transforms/floats/rotations and shows static hint/solve states while keeping subtle, non-vestibular color/opacity feedback (no global `0.01ms` kill-switch).
- **High contrast:** `@media (forced-colors: active)` preserves cell borders, `Highlight` selection/active outlines, and partner-cell underlines.
- **Browser surfaces:** Themed `::selection`, `caret-color: var(--color-primary)`, `scrollbar-color`, and `:focus-visible` 3px focus rings.
