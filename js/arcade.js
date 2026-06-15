import { GAMES } from "./games.js";

const $ = (s, r = document) => r.querySelector(s);

let audioCtx = null;
function ac() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function blip(freq = 440, dur = 0.06, type = "square", vol = 0.06) {
  const ctx = ac();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = vol;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.stop(ctx.currentTime + dur);
}

function coinSound() {
  blip(880, 0.05, "square", 0.05);
  setTimeout(() => blip(1320, 0.08, "square", 0.04), 60);
}

function renderMarquee() {
  const el = $("#marqueeText");
  if (!el) return;
  const names = GAMES.map((g) => g.title).join("  ★  ");
  el.textContent = `${names}  ★  FREE PLAY  ★  ${names}  ★  `;
}

function genreTags(genres) {
  return genres.map((g) => `<span class="tag">${g}</span>`).join("");
}

function cabinetArt(game) {
  if (game.cabinet === "glorp") {
    return `
      <div class="art glorp-art" aria-hidden="true">
        <div class="tower t1"></div>
        <div class="tower t2"></div>
        <div class="tower t3"></div>
        <div class="bug b1"></div>
        <div class="bug b2"></div>
        <div class="bug b3"></div>
        <div class="beam"></div>
        <div class="grid"></div>
      </div>`;
  }
  return `
    <div class="art bone-art" aria-hidden="true">
      <div class="moon"></div>
      <div class="tomb t1"></div>
      <div class="tomb t2"></div>
      <div class="skel s1"></div>
      <div class="skel s2"></div>
      <div class="boom"></div>
      <div class="shovel"></div>
    </div>`;
}

function renderCabinets() {
  const floor = $("#cabinetFloor");
  if (!floor) return;
  floor.innerHTML = GAMES.map(
    (g, i) => `
    <article class="cabinet" style="--accent:${g.accent};--accent2:${g.accent2};--delay:${i * 0.12}s" data-id="${g.id}">
      <div class="cabinet-top">
        <div class="marquee-mini">${g.tagline.toUpperCase()}</div>
      </div>
      <div class="screen-bezel">
        ${cabinetArt(g)}
        <div class="screen-glare"></div>
      </div>
      <div class="cabinet-body">
        <h2 class="game-title">${g.title}</h2>
        <p class="game-blurb">${g.blurb}</p>
        <div class="meta">
          ${genreTags(g.genre)}
          <span class="tag dim">${g.players}P · ${g.year}</span>
        </div>
        <p class="controls"><span>CONTROLS</span> ${g.controls}</p>
        <div class="score-line">TOP SCORE <b>${g.highScore}</b></div>
        <a class="play-btn" href="${g.url}" data-game="${g.id}">
          <span class="coin">●</span> INSERT COIN
        </a>
      </div>
    </article>`
  ).join("");

  floor.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      coinSound();
      btn.classList.add("pressed");
      const spin = btn.querySelector(".coin");
      if (spin) spin.textContent = "✓";
    });
    btn.addEventListener("mouseenter", () => blip(520, 0.04, "triangle", 0.03));
  });
}

function bootClock() {
  const el = $("#clock");
  if (!el) return;
  const tick = () => {
    const d = new Date();
    el.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  tick();
  setInterval(tick, 30_000);
}

function bootCredits() {
  const el = $("#credits");
  if (!el) return;
  let n = 0;
  setInterval(() => {
    n = (n + 1) % 100;
    el.textContent = String(n).padStart(2, "0");
  }, 4200);
}

document.addEventListener("click", () => ac().resume?.(), { once: true });
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();
    const first = $(".play-btn");
    if (first) {
      coinSound();
      location.href = first.href;
    }
  }
});

renderMarquee();
renderCabinets();
bootClock();
bootCredits();
