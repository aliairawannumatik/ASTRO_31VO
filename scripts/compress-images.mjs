/**
 * compress-images.mjs
 * Batch-converts all PNG/JPG/JPEG images in public/ and src/assets/
 * to WebP format using sharp. Original files are kept as fallback.
 *
 * Usage:  node scripts/compress-images.mjs
 * Or:     npm run compress:images
 */

import sharp from 'sharp'
import { readdir, stat, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const WEBP_QUALITY = 82        // 0-100 — good balance between size & sharpness
const WEBP_EFFORT  = 4         // 0-6  — encoding effort (higher = smaller file, slower)
const CONCURRENCY  = 4         // parallel sharp workers (safe for low-memory envs)
const MIN_BYTES    = 10_000    // skip files smaller than 10 KB (already tiny)

const SEARCH_DIRS = [
  path.join(ROOT, 'public'),
  path.join(ROOT, 'src', 'assets'),
]

const SUPPORTED_EXT = new Set(['.png', '.jpg', '.jpeg'])

// ── helpers ────────────────────────────────────────────────────────────────

async function* walkDir(dir) {
  if (!existsSync(dir)) return
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      yield* walkDir(full)
    } else if (e.isFile()) {
      yield full
    }
  }
}

async function collectImages() {
  const files = []
  for (const dir of SEARCH_DIRS) {
    for await (const filePath of walkDir(dir)) {
      const ext = path.extname(filePath).toLowerCase()
      if (!SUPPORTED_EXT.has(ext)) continue
      const { size } = await stat(filePath)
      if (size < MIN_BYTES) continue
      files.push(filePath)
    }
  }
  return files
}

async function convertToWebP(filePath) {
  const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp')

  if (existsSync(webpPath)) {
    const [origStat, webpStat] = await Promise.all([stat(filePath), stat(webpPath)])
    if (webpStat.mtimeMs >= origStat.mtimeMs) {
      return { skipped: true, filePath }
    }
  }

  const { size: beforeBytes } = await stat(filePath)

  await sharp(filePath)
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT, smartSubsample: true })
    .toFile(webpPath)

  const { size: afterBytes } = await stat(webpPath)
  const saved = ((1 - afterBytes / beforeBytes) * 100).toFixed(1)

  return {
    skipped: false,
    filePath,
    webpPath,
    beforeKB: (beforeBytes / 1024).toFixed(0),
    afterKB:  (afterBytes  / 1024).toFixed(0),
    savedPct: saved,
  }
}

// ── pool runner ────────────────────────────────────────────────────────────

async function runPool(tasks, concurrency) {
  const results = []
  const queue   = [...tasks]
  let active    = 0
  let resolved  = 0

  await new Promise((resolve, reject) => {
    function next() {
      while (active < concurrency && queue.length > 0) {
        const task = queue.shift()
        active++
        task()
          .then(r => {
            results.push(r)
            active--
            resolved++
            process.stdout.write(`\r  ${resolved}/${tasks.length} processed…`)
            next()
            if (active === 0 && queue.length === 0) resolve()
          })
          .catch(err => {
            active--
            results.push({ error: err.message })
            next()
            if (active === 0 && queue.length === 0) resolve()
          })
      }
    }
    next()
    if (tasks.length === 0) resolve()
  })

  return results
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🗜️  NUMATIK Image Compressor — WebP Batch Converter')
  console.log(`   Quality: ${WEBP_QUALITY}  |  Effort: ${WEBP_EFFORT}  |  Concurrency: ${CONCURRENCY}\n`)

  console.log('🔍 Scanning for images…')
  const images = await collectImages()
  console.log(`   Found ${images.length} image(s) to process\n`)

  if (images.length === 0) {
    console.log('✅ Nothing to compress.')
    return
  }

  const tasks = images.map(fp => () => convertToWebP(fp))
  const results = await runPool(tasks, CONCURRENCY)
  console.log('\n')

  let converted = 0, skipped = 0, errors = 0
  let totalBeforeKB = 0, totalAfterKB = 0

  for (const r of results) {
    if (r.error)        { errors++;    console.warn(`  ⚠️  ${r.error}`) }
    else if (r.skipped) { skipped++ }
    else {
      converted++
      totalBeforeKB += Number(r.beforeKB)
      totalAfterKB  += Number(r.afterKB)
      console.log(`  ✅ ${path.relative(ROOT, r.filePath).padEnd(60)} ${r.beforeKB}KB → ${r.afterKB}KB  (−${r.savedPct}%)`)
    }
  }

  console.log('\n── Summary ────────────────────────────────────────────────')
  console.log(`  Converted : ${converted}`)
  console.log(`  Skipped   : ${skipped}  (WebP already up-to-date)`)
  console.log(`  Errors    : ${errors}`)
  if (converted > 0) {
    const pct = ((1 - totalAfterKB / totalBeforeKB) * 100).toFixed(1)
    console.log(`  Total saved: ${((totalBeforeKB - totalAfterKB) / 1024).toFixed(1)} MB  (${pct}%)`)
  }
  console.log('────────────────────────────────────────────────────────────\n')
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
