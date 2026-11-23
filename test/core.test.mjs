import assert from "node:assert/strict";
import { tabState, tabRows, spaceState, navOrder } from "../core/core.js";

const ag = (tab, status, address = `${tab}-${status}`) => ({ tab, status, address, program: { key: "x" } });
assert.equal(tabState([ag("t", "done"), ag("t", "working")]), "working", "one agent still working: tab not done");
assert.equal(tabState([ag("t", "done"), ag("t", "idle")]), "idle", "mixed done/idle: not done");
assert.equal(tabState([ag("t", "done"), ag("t", "done")]), "done");
assert.equal(tabState([ag("t", "done"), ag("t", "blocked")]), "blocked");
assert.equal(tabState([]), "idle");

const space = { tabs: [{ id: "a", name: "A" }, { id: "b", name: "B" }, { id: "c", name: "C" }] };
const rows = tabRows(space, [ag("a", "idle"), ag("b", "blocked"), ag("b", "idle")]);
assert.deepEqual(rows.map((r) => [r.name, r.state]), [["A", "idle"], ["B", "blocked"]], "tab without agents has no row");
assert.equal(rows[1].address, "b-blocked", "blocked agent leads");
assert.equal(spaceState(rows), "blocked");
assert.equal(spaceState([]), null);
assert.deepEqual(navOrder([space], [ag("a", "idle"), ag("b", "idle")]), ["a-idle", "b-idle"]);
console.log("core tests passed");
import { makeCrew, crewTick, makeSnow, snowTick } from "../core/core.js";
const stage = { rx: 100, speed: 5, pauseMin: 8, pauseMax: 25, talkRange: 90, minGap: 60, chatChance: 0.1, quietMin: 60, quietMax: 120 };
let seed = 7;
const rng = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
let crew = makeCrew(3, stage), talks = 0, walks = 0, minSep = 1e9;
for (let i = 0; i < 6000; i++) {
  crew = crewTick(crew, rng, stage, ["a", "b", "c", "d"]);
  for (const m of crew) {
    assert.ok(Math.abs(m.x) <= stage.rx + 1e-9 && m.lane >= 0 && m.lane <= 1 && Number.isFinite(m.x + m.lane), "stays on stage, in front of the tree");
    if (m.say) talks++;
    if (m.mode === "walk") walks++;
  }
  const rest = crew.filter((m) => m.mode === "rest");
  for (let a = 0; a < rest.length; a++) for (let b = a + 1; b < rest.length; b++) minSep = Math.min(minSep, Math.abs(rest[a].x - rest[b].x));
}
assert.ok(talks > 10 && talks < 1200, `they talk, but rarely (${talks})`);
assert.ok(walks > 200, "they walk");
assert.ok(minSep >= stage.minGap - 1e-9, `resting members keep their gap (${minSep})`);
console.log("crew tests passed");
let snow = makeSnow(18, 268, 184, rng);
for (let i = 0; i < 500; i++) snow = snowTick(snow, 268, 184, rng);
assert.ok(snow.every((f) => f.y >= -3 && f.y <= 184 && f.x >= 0 && f.x <= 268) && snow.some((f) => f.gen > 0), "snow stays in the box and restarts at the top");
console.log("snow tests passed");

import { shown } from "../core/core.js";
const rs = [{ state: "working" }, { state: "blocked" }, { state: "idle" }, { state: "done" }];
assert.equal(shown(rs, false).length, 4, "unfolded shows every row");
assert.deepEqual(shown(rs, true).map((r) => r.state), ["blocked", "done"], "folded still shows what needs a look");
console.log("shown tests passed");
