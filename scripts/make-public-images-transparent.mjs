import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import jpeg from "jpeg-js";

const ROOT = process.cwd();

function readImageToRgba(filePath) {
  const buf = fs.readFileSync(filePath);

  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a;

  if (isPng) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(new PNG())
        .on("parsed", function () {
          resolve({ width: this.width, height: this.height, data: this.data, kind: "png" });
        })
        .on("error", reject);
    });
  }

  // JPEG signature: FF D8
  const isJpeg = buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8;
  if (isJpeg) {
    const decoded = jpeg.decode(buf, { useTArray: true });
    if (!decoded?.data || !decoded.width || !decoded.height) {
      throw new Error("Failed to decode JPEG");
    }
    return Promise.resolve({ width: decoded.width, height: decoded.height, data: decoded.data, kind: "jpeg" });
  }

  throw new Error("Unsupported image format (expected PNG/JPEG)");
}

function writePng(png, filePath) {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(filePath);
    png
      .pack()
      .pipe(out)
      .on("finish", resolve)
      .on("error", reject);
  });
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function keyOutBlackToAlphaFloodFill(png, { t0 = 12, t1 = 48 } = {}) {
  // Flood-fill from the edges so we only treat the outer black as background.
  // This preserves dark internal details of the object.
  const { width: w, height: h, data } = png;
  const visited = new Uint8Array(w * h);
  const qx = new Int32Array(w * h);
  const qy = new Int32Array(w * h);
  let qh = 0;
  let qt = 0;

  const idx = (x, y) => y * w + x;
  const off = (x, y) => (y * w + x) * 4;
  const brightness = (x, y) => {
    const o = off(x, y);
    return Math.max(data[o], data[o + 1], data[o + 2]);
  };

  function push(x, y) {
    const i = idx(x, y);
    if (visited[i]) return;
    if (brightness(x, y) >= t1) return;
    visited[i] = 1;
    qx[qt] = x;
    qy[qt] = y;
    qt++;
  }

  // Seed from all border pixels
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  let touched = 0;
  let alpha0 = 0;

  while (qh < qt) {
    const x = qx[qh];
    const y = qy[qh];
    qh++;

    const o = off(x, y);
    const m = Math.max(data[o], data[o + 1], data[o + 2]);
    let a = 255;
    if (m <= t0) a = 0;
    else a = Math.round(255 * clamp01((m - t0) / (t1 - t0)));

    if (data[o + 3] !== a) touched++;
    data[o + 3] = a;
    if (a === 0) alpha0++;

    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  return { alpha0, touched, visitedCount: qt };
}

async function processFile(relPath) {
  const inputPath = path.join(ROOT, relPath);
  const backupPath = inputPath.replace(/\.png$/i, ".orig.jpg");

  if (!fs.existsSync(inputPath)) {
    throw new Error(`File not found: ${relPath}`);
  }

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
  }

  const img = await readImageToRgba(inputPath);
  const out = new PNG({ width: img.width, height: img.height });
  out.data.set(img.data);

  const beforeAlpha0 = (() => {
    let c = 0;
    for (let i = 0; i < out.data.length; i += 4) if (out.data[i + 3] === 0) c++;
    return c;
  })();

  const { alpha0, touched, visitedCount } = keyOutBlackToAlphaFloodFill(out);

  await writePng(out, inputPath);

  return {
    relPath,
    kind: img.kind,
    size: `${out.width}x${out.height}`,
    beforeAlpha0,
    afterAlpha0: alpha0,
    touched,
    backgroundPixels: visitedCount,
    backup: path.basename(backupPath),
  };
}

const targets = ["public/meteor.png", "public/pesawat.png"];
const results = [];

for (const t of targets) {
  // eslint-disable-next-line no-console
  console.log(`Processing ${t}...`);
  // eslint-disable-next-line no-await-in-loop
  results.push(await processFile(t));
}

// eslint-disable-next-line no-console
console.log("\nDone:");
for (const r of results) {
  // eslint-disable-next-line no-console
  console.log(
    `- ${r.relPath} (${r.kind}, ${r.size}) | alpha0: ${r.beforeAlpha0} -> ${r.afterAlpha0} | bgPx: ${r.backgroundPixels} | changed: ${r.touched} | backup: ${r.backup}`,
  );
}

