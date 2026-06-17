// Rasterizes the Oddvice SVG logo into the PNG icons the PWA and the Flutter
// app need. Run with: node scripts/generate-icons.mjs
import sharp from "sharp";
import { readFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");
// Shared source for the Flutter launcher icon (best-effort copy).
const MOBILE_ASSETS = join(__dirname, "..", "..", "mobile", "assets");

const rounded = readFileSync(join(PUBLIC_DIR, "icon.svg"));
const fullBleed = readFileSync(join(PUBLIC_DIR, "icon-maskable.svg"));
const foreground = readFileSync(join(PUBLIC_DIR, "icon-foreground.svg"));

async function png(svg, size, outPath) {
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain" })
    .png()
    .toFile(outPath);
  console.log(`wrote ${outPath} (${size}x${size})`);
}

// PWA icons in public/.
await png(rounded, 192, join(PUBLIC_DIR, "icon-192.png"));
await png(rounded, 512, join(PUBLIC_DIR, "icon-512.png"));
await png(fullBleed, 512, join(PUBLIC_DIR, "icon-maskable-512.png"));
await png(fullBleed, 180, join(PUBLIC_DIR, "apple-touch-icon.png"));

// 1024px master used as the Flutter launcher-icon source.
const master = join(PUBLIC_DIR, "icon-1024.png");
await png(fullBleed, 1024, master);

// Copy assets the Flutter project consumes, if the sibling repo exists.
if (existsSync(join(__dirname, "..", "..", "mobile"))) {
  mkdirSync(MOBILE_ASSETS, { recursive: true });
  copyFileSync(master, join(MOBILE_ASSETS, "icon-1024.png"));
  await png(rounded, 512, join(MOBILE_ASSETS, "icon.png"));
  await png(foreground, 1024, join(MOBILE_ASSETS, "icon-foreground.png"));
  console.log("copied launcher source + assets into ../mobile/assets/");
}
