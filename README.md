# Stockastic Arcade

A neon-drenched browser arcade catalog for [Stockastic](https://stockastic.us) games.

**Live:** [glorp.stockastic.us](https://glorp.stockastic.us/) (catalog root; games keep their direct URLs)

## Play locally

```bash
cd ~/git/arcade
python3 -m http.server 8765
# open http://localhost:8765
```

Game links assume the same origin as the games host (`glorp.stockastic.us`).

## Cabinets

| Game | Path |
|------|------|
| Glorp Busters | `/glorp-busters.html` |
| Bone Bombers | `/bone/bone_bombers.html` |

Cabinet screens show a gameplay poster by default. Hover or focus a screen to play a short muted loop.

## Regenerate previews

Captures real gameplay from local Docker game servers (Playwright + ffmpeg):

```bash
./scripts/generate-previews.sh
```

Writes `assets/previews/<game-id>/` (poster + loop clips). Requires `musical_defense` and `bone_bombers` repos at the default paths, or set `GLORP_REPO` / `BONE_REPO`.

## Add a game

Edit `js/games.js` — add an entry to the `GAMES` array with title, blurb, genres, URL, cabinet art key (`glorp` or `bone` style, or add a new art block in `css/arcade.css`), and optional `preview` paths after running `generate-previews.sh`.

## Deploy

The catalog bundles into the [musical_defense](https://github.com/alecKarfonta/musical_defense) nginx image at deploy time.

```bash
make arcade-deploy          # from ~/git/system — sync + deploy Glorp
# or
make arcade-sync            # copy only
make app-deploy APP=glorp   # also auto-runs arcade-sync
```

Registered in the homelab as `apps/arcade.yaml` (`repo: ~/git/arcade`).

## Stack

Static HTML + CSS + ES modules. No build step.
