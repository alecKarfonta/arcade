# Arcade Refinement Phase — Notes

## Current goal
Phase 1 (previews) implemented. Next: text/copy refinement, then UX/a11y.

## Decisions
- Preview mechanism: poster image + hover/focus-to-loop muted clip. CSS art remains as fallback.
- Sequencing: previews first (done), then text, then UX.

## Part C — Representative previews (DONE)
- `assets/previews/<id>/` — poster.webp, loop.webm, loop.mp4 per game
- `js/games.js` — `preview` field on each game
- `js/arcade.js` — `cabinetScreen()`, hover/focus video playback, `prefers-reduced-motion` respected
- `css/arcade.css` — preview overlay styles
- `system.yaml` — `assets/` in bundle.paths
- Capture pipeline:
  - `scripts/generate-previews.sh` — orchestrator
  - `scripts/docker-compose.games.yml` — local glorp (8888) + bone (8889) without k8s nginx deps
  - `scripts/docker-compose.previews.yml` + `Dockerfile.previews` — Playwright + ffmpeg capture
  - `scripts/capture-preview.mjs` — scripted gameplay + encode

Regenerate: `./scripts/generate-previews.sh`

## Part A — Text/copy refinement (TODO)
- Tighten blurbs, centralize UI strings, fix placeholder highScore copy

## Part B — UX/accessibility refinement (TODO)
- Lazy-load done via img loading=lazy; mute toggle for coin sounds still TODO
- Per-cabinet keyboard nav beyond SPACE-on-first still TODO

## Tried / status
- musical_defense compose alone fails locally (k8s bone upstream in nginx) — fixed with preview-only nginx config in scripts/
- Playwright import failed without node_modules volume — fixed with anonymous volume on /work/scripts/node_modules
- Glorp poster from frame 0 was empty — fixed with `-ss 2` seek before poster extract
