# Sudoku Shift

[![CI](https://github.com/hapheus/sudoku-shift/actions/workflows/ci.yml/badge.svg)](https://github.com/hapheus/sudoku-shift/actions/workflows/ci.yml)
[![Play on itch.io](https://img.shields.io/badge/Play%20on-itch.io-FA5C5C.svg)](https://hapheus.itch.io/sudoku-shift)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-sudoku--shift-2496ED.svg)](https://hub.docker.com/r/hapheus/sudoku-shift)
[![License: PolyForm Noncommercial 1.0.0](https://img.shields.io/badge/License-PolyForm--Noncommercial--1.0.0-blue.svg)](LICENSE)

Zero-backend 9×9 and 6×6 Sudoku app built with **React 19**, **Vite 8**, **Capacitor 8**, and **Centrifugo v6** WebSockets — structured as a reference showcase for shipping one web codebase to **Docker**, **itch.io HTML5**, **iPhone and iPad**, and **Android**.

**[Download Sudoku Shift on the App Store for iPhone and iPad](https://apps.apple.com/app/sudoku-shift/id6834748729)** · **Android Play Store (Coming Soon)**.

Play online on **[itch.io](https://hapheus.itch.io/sudoku-shift)** · Created for **[GitHub Game Off 2026](https://itch.io/jam/game-off-2026)**.

[Quick Start](#quick-start-golden-path-docker) · [Distribution Guides](#distribution-guides) · [Scope & Non-Goals](#scope--non-goals) · [Verification](#verification)

---

## Quick Start (Golden Path: Docker)

Start the Nginx SPA (`:8000`) and Centrifugo v6 WebSocket server (`:8081`) with two commands:

```bash
npm install
npm run docker:up
```

Verify both containers are healthy:

```bash
curl -fsS http://localhost:8000/up    # expected: ok
curl -fsS http://localhost:8081/health
```

Open `http://localhost:8000` in your browser.

<details>
<summary>Alternative targets: Local Vite dev, Native iOS (Capacitor + Fastlane), and itch.io ZIP</summary>

- **Local Vite + Centrifugo:**
  ```bash
  docker compose up -d centrifugo
  npm run dev
  ```
  To use another WebSocket endpoint with the local Vite app:
  ```bash
  npm run dev -- --ws-url wss://sudoku-ws.fraha.dev/connection/websocket
  ```
- **Native iOS (Capacitor 8 + Fastlane):**
  ```bash
  npm run ios:preflight   # Check Capacitor, Xcode, and Fastlane setup
  npm run cap:sync        # Build dist/ and sync into ios/
  npm run ios:archive     # Export signed App Store IPA
  npm run ios:testflight  # Bump build number and upload to TestFlight
  ```
- **itch.io HTML5 ZIP:**
  ```bash
  npm run build:itch      # Build dist-itch/ with base './' -> sudoku-shift-itch.zip
  npm run verify:itch     # Verify root index.html, relative paths, and file limits
  ```

</details>

---

## Distribution Guides

| Target / Topic | Guide | What It Covers |
|---|---|---|
| **iOS (Capacitor + Fastlane)** | [docs/ios/README.md](docs/ios/README.md) | `cap sync`, `preflight`, `simulator`, `archive`, TestFlight `beta`, ASC API key auth, [iOS Spec](docs/ios/spec.md) |
| **itch.io HTML5 ZIP** | [docs/itch-io/README.md](docs/itch-io/README.md) | Relative asset base (`./`), iframe guards, automated ZIP verification, `butler push` |
| **Docker Self-Hosting** | [docs/self-hosting/README.md](docs/self-hosting/README.md) | `nginx:1.27-alpine` + `centrifugo:v6`, runtime `/env-config.js`, `compose.prod.yml`, reverse proxies |
| **Architecture & Gameplay** | [docs/architecture/README.md](docs/architecture/README.md) | Client-only solver, Solo / Co-op / Watch Live modes, Centrifugo channel protocol |
| **Testing & QA** | [docs/testing/README.md](docs/testing/README.md) | Vitest unit suite, Playwright E2E, `axe-core` accessibility, CI workflow, [QA Report](tests/qa/REPORT.md) |

Full index: [docs/README.md](docs/README.md)

---

## Scope & Non-Goals

- **Intended for:** Non-commercial self-hosting, learning, and referencing Capacitor + Fastlane, itch.io HTML5 packaging, and runtime-configured Docker SPAs.
- **NOT included:**
  - **No Android target:** Android (`@capacitor/android`, Gradle) is intentionally excluded.
  - **No backend database or user accounts:** Solo state uses `localStorage`; live Co-op and Watch modes rely on ephemeral Centrifugo channels (`300s` history).
  - **Not Open Source (Commercial):** Source-available under `PolyForm-Noncommercial-1.0.0` (commercial use and third-party paid redistribution require permission).

---

## Verification

```bash
npm test                # 12 Vitest suites (domain, UI, Centrifugo client, itch.io ZIP checks)
npm run build           # Vite production bundle
npm run verify:itch     # Validate sudoku-shift-itch.zip structure and relative paths
npm run docker:config   # Validate docker-compose.yml and compose.prod.yml
npm run e2e             # Playwright headless Chromium + axe-core E2E suite
```

---

## Contributing & License

- See [CONTRIBUTING.md](CONTRIBUTING.md) for development conventions and commit guidelines.
- Licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE) (`PolyForm-Noncommercial-1.0.0`).

## Local bots

Run separately built bots with `npm run bot`; see the [local bot guide](tools/local-bot/README.md) for setup, headed mode, counts and production WebSocket configuration. The tool is excluded from app release artifacts.
