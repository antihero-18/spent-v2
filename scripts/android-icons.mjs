// Regenerates the Android launcher icons.
//   npm run icons
// @capacitor/assets only emits legacy 48dp bitmaps and low-res adaptive layers, so
// the adaptive layers are rebuilt here at 108dp with the mark inside the safe zone.
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const RES = 'android/app/src/main/res';
const DENSITIES = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };
const GLYPH = 0.46; // mark height as a share of the 108dp layer
const LEGACY_GLYPH = 0.52;
const PAPER = '#f7f6f3';

const glyphSource = 'resources/icon-foreground.png';
const glyph = await sharp(glyphSource).trim().png().toBuffer();
const glyphBox = await sharp(glyph).metadata();

const centred = async (glyphHeight, size) => {
  const scaled = await sharp(glyph)
    .resize({ height: Math.round(size * glyphHeight), fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer({ resolveWithObject: true });
  return {
    input: scaled.data,
    left: Math.round((size - scaled.info.width) / 2),
    top: Math.round((size - scaled.info.height) / 2),
  };
};

for (const [density, size] of Object.entries(DENSITIES)) {
  const dir = `${RES}/mipmap-${density}`;
  await mkdir(dir, { recursive: true });

  await sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .png()
    .toFile(`${dir}/ic_launcher_background.png`);

  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([await centred(GLYPH, size)])
    .png()
    .toFile(`${dir}/ic_launcher_foreground.png`);

  // Legacy single-bitmap icons carry the mark on paper.
  await sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .composite([await centred(LEGACY_GLYPH, size)])
    .png()
    .toFile(`${dir}/ic_launcher.png`);
  await sharp(`${dir}/ic_launcher.png`).png().toFile(`${dir}/ic_launcher_round.png`);
}

const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
    <monochrome android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
`;
await mkdir(`${RES}/mipmap-anydpi-v26`, { recursive: true });
for (const name of ['ic_launcher', 'ic_launcher_round']) {
  await writeFile(`${RES}/mipmap-anydpi-v26/${name}.xml`, adaptive);
}

console.log(`icons rebuilt: ${Object.entries(DENSITIES).map(([d, s]) => `${d} ${s}dp`).join(', ')}; mark ${glyphBox.width}x${glyphBox.height}`);
