// One-off: download all googleusercontent images referenced in cities.ts and
// rewrite them to local /public paths so they load reliably (no cross-origin).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const file = path.resolve("src/data/cities.ts");
const outDir = path.resolve("public/images/places");
fs.mkdirSync(outDir, { recursive: true });

let text = fs.readFileSync(file, "utf8");
const re = /https:\/\/lh3\.googleusercontent\.com\/[^"']+/g;
const urls = [...new Set(text.match(re) || [])];
console.log(`found ${urls.length} image URLs`);

const extFor = (ct) => (ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg");

let done = 0;
const failed = [];
for (const url of urls) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      failed.push([res.status, url]);
      continue;
    }
    const ct = res.headers.get("content-type") || "image/jpeg";
    const ext = extFor(ct);
    const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 12);
    const fname = `${hash}.${ext}`;
    fs.writeFileSync(path.join(outDir, fname), Buffer.from(await res.arrayBuffer()));
    text = text.split(url).join(`/images/places/${fname}`);
    done++;
  } catch (e) {
    failed.push([e.message, url]);
  }
}

fs.writeFileSync(file, text);
console.log(`downloaded ${done}, failed ${failed.length}`);
for (const [why, u] of failed) console.log("FAIL", why, u.slice(0, 70));
