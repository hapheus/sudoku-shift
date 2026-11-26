# Sudoku Shift — Product Context

## Product Summary
Sudoku Shift is a fast, accessible, real-time Sudoku web and native mobile (Capacitor iOS/Android) puzzle app supporting solo play, live multi-player co-op solving, and interactive spectating over Centrifugo WebSockets.

## Target Audience & Usage Context
- **Primary users:** Casual and dedicated Sudoku players on phones (portrait & landscape), tablets/foldables (including dual-screen / Duo layouts), desktop browsers, and itch.io embeds.
- **Usage scenes:** Focused solo play (often low-light evening or daytime paper-like reading), spontaneous real-time co-op solving with friends, and spectators watching live boards with digit hints and emoji reactions.
- **Languages:** English (`en`) and German (`de`).

## Core Features & Modes
- **Variants & Calibration:** 9×9 (`3x3`) and 6×6 (`2x3`) grids across four difficulty tiers (Easy, Medium, Hard, Expert) with logical hint deductions (Full House, Hidden Single, Naked Single).
- **Shift Mechanic:** Row and column shifting within boxes (`Shift + ↑↓←→` or on-screen controls) preserving puzzle solvability.
- **Real-Time Co-op & Watch Directory:** Live match discovery, configurable join policies (Off / Approval / Auto-accept), shared cursor & active-digit presence, spectator digit hints/nudges, emoji reactions, and post-solve contribution tables.
- **Progressive Board Artwork:** Curated WebP artwork reveals cell-by-cell and unit-by-unit as the puzzle progresses, completing in a full-board reveal on solve.
- **Playful Easter Eggs:** 1981 C64 Retro Mode (Konami code), Co-op Fist Bump on simultaneous cell solves, Night Ghost band/stack swap, and Undo-war Tic Tac Toe tiebreaker.

## Constraints & Non-Goals
- **Privacy-first:** No user accounts, no tracking, no advertising, no HTTP cookies; strictly necessary local state (`localStorage` / `sessionStorage`) only.
- **Accessibility floor:** WCAG 2.2 AA compliance, full keyboard navigation, localized screen reader labels, intentional `prefers-reduced-motion` alternatives, and `forced-colors` support.
- **Surface Mode:** Operate mode — clarity, scanability, native predictability, and tactile responsiveness outrank decorative flourish.
