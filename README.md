# Stockastic Arcade

A neon-drenched browser arcade catalog for web games.

**Live:** [mlapi.us/arcade/](https://mlapi.us/arcade/)

## Play locally

```bash
cd ~/git/arcade
python3 -m http.server 8765
# open http://localhost:8765
```

Or via Docker:

```bash
docker compose up -d
# open http://localhost:31021
```

## Cabinets

| Game | Path (on mlapi.us) |
|------|---------------------|
| Glorp Busters | [/glorp/](https://mlapi.us/glorp/) |
| Bone Bombers | [/bone/](https://mlapi.us/bone/) |

Cabinet screens show a gameplay poster by default. Hover or focus a screen to play a short muted loop.

## Regenerate previews

Captures real gameplay from local Docker game servers (Playwright + ffmpeg):

```bash
./scripts/generate-previews.sh
```

Writes `assets/previews/<game-id>/` (poster + loop clips). Requires [musical_defense](https://github.com/alecKarfonta/musical_defense) and bone_bombers repos at the default paths, or set `GLORP_REPO` / `BONE_REPO`.

## Add a game

Edit `js/games.js` — add an entry to the `GAMES` array with title, blurb, genres, URL, cabinet art key (`glorp` or `bone` style, or add a new art block in `css/arcade.css`), and optional `preview` paths after running `generate-previews.sh`.

## Deploy

Managed k3s app (homelab):

```bash
cd ~/git/system
make app-deploy APP=arcade
sudo scripts/install-nginx-app.sh arcade   # if nginx step needs sudo
```

Registered in the homelab as `apps/arcade.yaml` (`repo: ~/git/arcade`). Shows in Fleet Control under **Managed Apps**.

## Stack

Static HTML + CSS + ES modules. No build step.
