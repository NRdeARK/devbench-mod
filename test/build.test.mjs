import assert from "node:assert/strict";
import { pxToSvg, parsePx } from "../build.mjs";

const svg = pxToSvg("# scale 3\n# R=#ff0000\nRR.\n.R.\n");
assert.match(svg, /width="9" height="6"/, "scaled size");
assert.equal((svg.match(/<rect/g) ?? []).length, 2, "horizontal runs merge: RR is one rect");
assert.match(svg, /crispEdges/);
assert.throws(() => pxToSvg("# scale 1\nX\n"), /not in palette/);
console.log("build tests passed");

const lit = parsePx("# scale 2\n# G=#00ff00 1=#ff0000\nG1G\n.G.\n");
assert.deepEqual(lit.lights, [{ x: 1, y: 0, c: "#ff0000" }], "palette key 1 is a twinkling light");
assert.match(pxToSvg("# scale 1\n# 1=#ff0000\n1\n"), /fill-opacity="0.35"/, "lights are drawn dim");
assert.throws(() => parsePx("# scale 1\n# G=#00ff00\nGG\nG\n"), /expected 2/, "ragged rows are rejected");
console.log("light tests passed");

import { parsePx as parsePx2 } from "../build.mjs";
const o = parsePx2("# scale 3\n# upscale 3\n# outline #e8ecff 2\n# a=#ff0000\naa\naa\n");
assert.equal(o.cols, 6 + 4, "outline pads each side by its thickness");
assert.equal(o.rows, 6 + 4);
assert.equal(o.scale, 1, "upscaling divides the scale");
assert.equal(o.grid[0][0], "X", "corner is outline");
assert.equal(o.grid[2][2], "a", "shape keeps its place");
console.log("outline tests passed");
