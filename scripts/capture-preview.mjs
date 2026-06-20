import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 480;
const HEIGHT = 360;
const RECORD_MS = 6500;

const TARGETS = [
  {
    id: "glorp-busters",
    url: process.env.GLORP_URL ?? "http://127.0.0.1:8888/glorp-busters.html",
    async play(page) {
      await page.waitForSelector("#btnStart", { timeout: 20_000 });
      await page.click("#btnStart");
      await page.waitForFunction(() =>
        document.getElementById("overlay")?.classList.contains("hidden")
      );
      await page.waitForTimeout(800);
      await page.click("#btnWave");
      const canvas = page.locator("#cv");
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width * 0.35, box.y + box.height * 0.55);
        await page.waitForTimeout(400);
        await page.mouse.click(box.x + box.width * 0.62, box.y + box.height * 0.48);
      }
      await page.click("#btnSpeed");
      await page.waitForTimeout(RECORD_MS);
    },
  },
  {
    id: "bone-bombers",
    url: process.env.BONE_URL ?? "http://127.0.0.1:8889/bone_bombers.html",
    async play(page) {
      await page.waitForSelector("#startBtn", { timeout: 20_000 });
      await page.click("#startBtn");
      await page.waitForFunction(() =>
        document.getElementById("overlay")?.classList.contains("hidden")
      );
      await page.waitForTimeout(500);
      for (let i = 0; i < 8; i++) {
        await page.keyboard.down("KeyD");
        await page.waitForTimeout(180);
        await page.keyboard.up("KeyD");
        await page.keyboard.press("Space");
        await page.waitForTimeout(220);
        await page.keyboard.down("KeyA");
        await page.waitForTimeout(160);
        await page.keyboard.up("KeyA");
      }
      await page.waitForTimeout(RECORD_MS);
    },
  },
];

function encodePreview(id, rawVideo) {
  const outDir = path.join(ROOT, "assets", "previews", id);
  mkdirSync(outDir, { recursive: true });
  const poster = path.join(outDir, "poster.webp");
  const webm = path.join(outDir, "loop.webm");
  const mp4 = path.join(outDir, "loop.mp4");

  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-ss",
      "2",
      "-i",
      rawVideo,
      "-vf",
      `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2`,
      "-frames:v",
      "1",
      "-update",
      "1",
      poster,
    ],
    { stdio: "inherit" }
  );

  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      rawVideo,
      "-an",
      "-vf",
      `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2`,
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "400k",
      "-row-mt",
      "1",
      webm,
    ],
    { stdio: "inherit" }
  );

  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      rawVideo,
      "-an",
      "-vf",
      `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2`,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      mp4,
    ],
    { stdio: "inherit" }
  );

  console.log(`ok ${id} → ${outDir}`);
}

async function captureOne(browser, target) {
  const tmpDir = path.join(ROOT, "scripts", ".capture-tmp", target.id);
  mkdirSync(tmpDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 960, height: 720 },
    recordVideo: { dir: tmpDir, size: { width: WIDTH, height: HEIGHT } },
    deviceScaleFactor: 1,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log(`capture ${target.id} @ ${target.url}`);
  await page.goto(target.url, { waitUntil: "networkidle", timeout: 30_000 });
  await target.play(page);

  const video = page.video();
  await context.close();
  if (!video) throw new Error(`No video recorded for ${target.id}`);

  const rawPath = await video.path();
  encodePreview(target.id, rawPath);

  for (const name of readdirSync(tmpDir)) {
    unlinkSync(path.join(tmpDir, name));
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const target of TARGETS) {
      await captureOne(browser, target);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
