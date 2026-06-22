/* Convert every .jpg/.jpeg/.png in the image folders to .webp (same basename),
   then delete the original. Run: node scripts/convert-webp.cjs  [from repo root] */
const fs = require("fs");
const path = require("path");
const sharp = require(path.join(__dirname, "..", "frontend", "node_modules", "sharp"));

const base = path.resolve(__dirname, "..", "frontend", "public", "images");
const dirs = ["hotels", "restaurants", "screening"];

(async () => {
  let converted = 0, skipped = 0;
  for (const d of dirs) {
    const dir = path.join(base, d);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!/\.(jpe?g|png)$/i.test(f)) continue;
      const src = path.join(dir, f);
      const out = path.join(dir, f.replace(/\.(jpe?g|png)$/i, ".webp"));
      if (fs.existsSync(out)) { console.log(`skip (webp exists): ${d}/${f}`); skipped++; continue; }
      try {
        await sharp(src).webp({ quality: 82 }).toFile(out);
        fs.unlinkSync(src);
        console.log(`✓ ${d}/${f}  ->  ${path.basename(out)}`);
        converted++;
      } catch (e) {
        console.log(`✗ FAILED ${d}/${f}: ${e.message}`);
      }
    }
  }
  console.log(`\nconverted ${converted}, skipped ${skipped}`);
})();
