// Build step. Usage: node build.mjs [theme]
//  1. theme/sprites/*.px  ->  theme/generated/*.svg   (ASCII pixel art -> crisp SVG rects)
//  2. theme/<name>.layout.json merged into layouts/devbench.base.json -> layouts/devbench.json
// .px format: "# scale N", "# K=#rrggbb ..." palette lines, then the grid ('.' = transparent).
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";

export function pxToSvg(text) {
  let scale = 1;
  const palette = {};
  const grid = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (!line) continue;
    if (line.startsWith("#")) {
      const m = line.match(/^#\s*scale\s+(\d+)/);
      if (m) scale = Number(m[1]);
      for (const [, k, v] of line.matchAll(/(\S)=(#[0-9a-fA-F]{6})/g)) palette[k] = v;
    } else grid.push(line);
  }
  const w = Math.max(...grid.map((r) => r.length));
  const rects = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let n = 1;
      while (row[x + n] === ch) n++;
      if (ch !== "." && ch !== " ") {
        if (!palette[ch]) throw new Error(`sprite colour '${ch}' not in palette (row ${y})`);
        rects.push(`<rect x="${x}" y="${y}" width="${n}" height="1" fill="${palette[ch]}"/>`);
      }
      x += n;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${grid.length}" width="${w * scale}" height="${grid.length * scale}" shape-rendering="crispEdges">${rects.join("")}</svg>\n`;
}

const merge = (a, b) => {
  for (const [k, v] of Object.entries(b)) {
    a[k] = v && typeof v === "object" && !Array.isArray(v) && a[k] && typeof a[k] === "object" && !Array.isArray(a[k]) ? merge(a[k], v) : v;
  }
  return a;
};

if (process.argv[1] && process.argv[1].endsWith("build.mjs")) {
  const name = process.argv[2] ?? "christmas";
  mkdirSync("theme/generated", { recursive: true });
  for (const f of readdirSync("theme/sprites").filter((f) => f.endsWith(".px"))) {
    writeFileSync(`theme/generated/${f.replace(/\.px$/, ".svg")}`, pxToSvg(readFileSync(`theme/sprites/${f}`, "utf8")));
    console.log(`sprite ${f}`);
  }
  const base = JSON.parse(readFileSync("layouts/devbench.base.json", "utf8"));
  const paint = JSON.parse(readFileSync(`theme/${name}.layout.json`, "utf8"));
  const walk = (n) => { if (paint[n.id]) merge(n, paint[n.id]); (n.children ?? []).forEach(walk); };
  walk(base);
  base.theme = name;
  writeFileSync("layouts/devbench.json", JSON.stringify(base, null, 2));
  console.log(`built layouts/devbench.json with theme ${name}`);
}
