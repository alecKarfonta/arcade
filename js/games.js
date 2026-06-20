/** Catalog of playable cabinets. URLs are relative to the arcade host origin. */
export const GAMES = [
  {
    id: "glorp-busters",
    title: "GLORP BUSTERS",
    tagline: "VoltWorks™ Pest Control",
    year: "2026",
    genre: ["Tower Defense", "Synth", "Roguelite"],
    players: "1",
    url: "/glorp/glorp-busters.html",
    accent: "#00e5ff",
    accent2: "#ff2079",
    cabinet: "glorp",
    preview: {
      poster: "assets/previews/glorp-busters/poster.webp",
      webm: "assets/previews/glorp-busters/loop.webm",
      mp4: "assets/previews/glorp-busters/loop.mp4",
    },
    blurb:
      "Clock in at VoltWorks™ and deploy sonic turrets against an endless glorp infestation. " +
      "Build mazes, unlock the Xeno Sphere Grid, and mix live music layers in the Sound Lab while " +
      "Megaglorps threaten your quarterly KPIs.",
    controls: "Click · Drag towers · R&D tree · ~ Sound Lab",
    highScore: "47,820",
  },
  {
    id: "bone-bombers",
    title: "BONE BOMBERS",
    tagline: "Skeletons Poop Bombs",
    year: "2026",
    genre: ["Action", "Arena", "Survival"],
    players: "1",
    url: "/bone/bone_bombers.html",
    accent: "#ffc83d",
    accent2: "#ff5c33",
    cabinet: "bone",
    preview: {
      poster: "assets/previews/bone-bombers/poster.webp",
      webm: "assets/previews/bone-bombers/loop.webm",
      mp4: "assets/previews/bone-bombers/loop.mp4",
    },
    blurb:
      "Grab your shovel and patrol the graveyard. Bust rising skeletons before they squat — " +
      "because what they leave behind is very much not a gift. Bait bomb blasts to clear crowds, " +
      "survive escalating waves, and try not to forfeit your security deposit.",
    controls: "WASD move · Space swing · Touch drag + tap",
    highScore: "—",
  },
];
