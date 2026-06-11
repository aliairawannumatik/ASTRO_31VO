import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname } from 'path';

const DIR = 'public/images';
const SIZE_THRESHOLD = 200 * 1024; // 200KB

async function getFilesOver200KB() {
  const files = await readdir(DIR);
  const results = [];
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;
    const filePath = join(DIR, file);
    const { size } = await stat(filePath);
    if (size > SIZE_THRESHOLD) {
      results.push({ file, filePath, size });
    }
  }
  return results;
}

function formatKB(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function main() {
  const files = await getFilesOver200KB();
  console.log(`\nDitemukan ${files.length} gambar di atas 200KB\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let compressed = 0;
  let skipped = 0;

  for (let i = 0; i < files.length; i++) {
    const { file, filePath, size } = files[i];
    const ext = extname(file).toLowerCase();

    const plugins = [];
    if (ext === '.png') {
      plugins.push(imageminPngquant({ quality: [0.65, 0.80], speed: 1, strip: true }));
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      plugins.push(imageminMozjpeg({ quality: 75, progressive: true }));
    } else if (ext === '.webp') {
      // webp: skip, imagemin-webp is an encoder not compressor
      skipped++;
      continue;
    }

    try {
      const result = await imagemin([filePath], {
        destination: DIR,
        plugins,
        glob: false,
      });

      if (result.length > 0) {
        const newSize = result[0].data.length;
        totalBefore += size;
        totalAfter += newSize;
        const saved = size - newSize;
        const pct = ((saved / size) * 100).toFixed(1);
        console.log(`[${i + 1}/${files.length}] ${file}: ${formatKB(size)} → ${formatKB(newSize)} (-${pct}%)`);
        compressed++;
      }
    } catch (err) {
      console.error(`  ERROR pada ${file}: ${err.message}`);
      skipped++;
    }
  }

  console.log('\n========== RINGKASAN ==========');
  console.log(`Total dikompres : ${compressed} file`);
  console.log(`Dilewati        : ${skipped} file`);
  console.log(`Ukuran sebelum  : ${formatKB(totalBefore)}`);
  console.log(`Ukuran sesudah  : ${formatKB(totalAfter)}`);
  console.log(`Total hemat     : ${formatKB(totalBefore - totalAfter)} (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`);
  console.log('================================\n');
}

main().catch(console.error);
