/* Wire `image` paths in cities.ts to whatever .webp files you dropped into
 *   frontend/public/images/{hotels,restaurants,screening}
 * Files can be named by the place's real name — case/spaces/punctuation/accents
 * are ignored when matching.
 *
 *   node scripts/match-images.cjs --dry   # report matches, write nothing
 *   node scripts/match-images.cjs         # wire the paths into cities.ts
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const citiesPath = path.join(ROOT, "frontend", "src", "data", "cities.ts");
const imgDir = path.join(ROOT, "frontend", "public", "images");
const DRY = process.argv.includes("--dry");

// normalise a place name OR a filename to a comparable key
const norm = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")        // strip accents
    .replace(/\bfifa fan festival\b/g, "")  // screening zone prefix
    .replace(/\band\b/g, "")                // "and" == "&"
    .replace(/[^a-z0-9]+/g, "");            // drop everything else

// split a name into meaningful tokens (drop trivial filler words)
const STOP = new Set(["the", "by", "and", "a", "at", "of", "fifa", "fan", "festival"]);
const tokenize = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ")
    .split(/[^a-z0-9]+/).filter((t) => t && !STOP.has(t));
const isSubset = (a, b) => a.every((t) => b.includes(t));

// build index for one image subfolder
function indexFolder(name) {
  const dir = path.join(imgDir, name);
  if (!fs.existsSync(dir)) return { exact: {}, list: [] };
  const exact = {}, list = [];
  for (const f of fs.readdirSync(dir)) {
    if (!/\.webp$/i.test(f)) continue;
    const stem = f.replace(/\.webp$/i, "");
    exact[norm(stem)] = f;
    list.push({ tokens: tokenize(stem), file: f });
  }
  return { exact, list };
}
const folders = {
  hotels: indexFolder("hotels"),
  restaurants: indexFolder("restaurants"),
  screening: indexFolder("screening"),
};

const used = { hotels: new Set(), restaurants: new Set(), screening: new Set() };
const report = { matched: 0, missing: [] };

function lookup(folder, name) {
  const { exact, list } = folders[folder];
  let file = exact[norm(name)];
  if (!file) {
    // token-subset fallback: files whose tokens subset the place's (or vice-versa)
    // with >= 2 shared tokens; pick the single best by token overlap.
    const pt = tokenize(name);
    const cand = list
      .map((e) => ({ file: e.file, inter: e.tokens.filter((t) => pt.includes(t)).length, ok: isSubset(pt, e.tokens) || isSubset(e.tokens, pt), min: Math.min(pt.length, e.tokens.length) }))
      .filter((c) => c.ok && c.min >= 2 && c.inter >= 2)
      .sort((a, b) => b.inter - a.inter);
    if (cand.length && (cand.length === 1 || cand[0].inter > cand[1].inter)) file = cand[0].file;
  }
  if (file) {
    used[folder].add(file);
    report.matched++;
    return `/images/${folder}/${encodeURIComponent(file)}`;
  }
  report.missing.push(`${folder}: ${name}`);
  return null;
}

let text = fs.readFileSync(citiesPath, "utf8");

// 1) hotels + restaurants — uniform place() calls with an /images/<cat>/...webp arg
text = text.replace(
  /(place\(\s*\n\s*")([^"]+)("[\s\S]*?\n\s*")(\/images\/(hotels|restaurants)\/[^"]+\.webp)(")/g,
  (m, a, name, mid, _old, cat, end) => {
    const next = lookup(cat, name);
    return next ? a + name + mid + next + end : m;
  }
);

// 2) screening zones — insert/replace an image field on each zone object
text = text.replace(
  /(\{\r?\n\s*name: ")([^"]+)(",\r?\n\s*type: "[^"]+",\r?\n\s*url: "[^"]*",)(\r?\n\s*note: "[^"]*",)?(\r?\n\s*image: "[^"]*",)?(\r?\n)(\s*)(\},)/g,
  (m, open, name, midA, noteLine, _imgLine, nl, indent, close) => {
    const next = lookup("screening", name);
    const imgLine = next ? `${nl}${indent}image: ${JSON.stringify(next)},` : "";
    return open + name + midA + (noteLine || "") + imgLine + nl + indent + close;
  }
);

if (!DRY) fs.writeFileSync(citiesPath, text, "utf8");

// report
console.log(`${DRY ? "[dry run] " : ""}matched ${report.matched} image(s)`);
for (const cat of ["hotels", "restaurants", "screening"]) {
  const unused = folders[cat].list.map((e) => e.file).filter((f) => !used[cat].has(f));
  if (unused.length) console.log(`  unused ${cat} files:\n    ${unused.join("\n    ")}`);
}
if (report.missing.length) {
  console.log(`\nNo file yet for ${report.missing.length} place(s):`);
  for (const m of report.missing) console.log("  - " + m);
}
