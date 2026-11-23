// Merge a theme's layout paint (theme/<name>.layout.json, keyed by node id) into the base layout.
// Usage: node build.mjs [theme]   ->  layouts/devbench.json
import { readFileSync, writeFileSync } from "node:fs";
const name = process.argv[2] ?? "christmas";
const base = JSON.parse(readFileSync("layouts/devbench.base.json", "utf8"));
const paint = JSON.parse(readFileSync(`theme/${name}.layout.json`, "utf8"));
const merge = (a, b) => {
  for (const [k, v] of Object.entries(b)) {
    a[k] = v && typeof v === "object" && !Array.isArray(v) && a[k] && typeof a[k] === "object" && !Array.isArray(a[k]) ? merge(a[k], v) : v;
  }
  return a;
};
const walk = (n) => { if (paint[n.id]) merge(n, paint[n.id]); (n.children ?? []).forEach(walk); };
walk(base);
base.theme = name;
writeFileSync("layouts/devbench.json", JSON.stringify(base, null, 2));
console.log(`built layouts/devbench.json with theme ${name}`);
