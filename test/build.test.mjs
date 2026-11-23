import assert from "node:assert/strict";
import { pxToSvg } from "../build.mjs";

const svg = pxToSvg("# scale 3\n# R=#ff0000\nRR.\n.R.\n");
assert.match(svg, /width="9" height="6"/, "scaled size");
assert.equal((svg.match(/<rect/g) ?? []).length, 2, "horizontal runs merge: RR is one rect");
assert.match(svg, /crispEdges/);
assert.throws(() => pxToSvg("# scale 1\nX\n"), /not in palette/);
console.log("build tests passed");
