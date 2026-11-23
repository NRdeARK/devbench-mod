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
import { makeCrew, crewTick } from "../core/core.js";
const stage = { rx: 92, speed: 5, pauseMin: 5, pauseMax: 16, talkRange: 56 };
let seed = 7;
const rng = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
let crew = makeCrew(3, stage), talks = 0, walks = 0, maxRest = 0;
for (let i = 0; i < 3000; i++) {
  crew = crewTick(crew, rng, stage, ["a", "b", "c", "d"]);
  for (const m of crew) {
    assert.ok(Math.abs(m.x) <= stage.rx + 1e-9 && m.lane >= -1 && m.lane <= 1 && Number.isFinite(m.x + m.lane), "stays on stage");
    if (m.say) talks++;
    if (m.mode === "walk") walks++;
    maxRest = Math.max(maxRest, m.mode === "rest" ? m.left : 0);
  }
}
assert.ok(talks > 20 && walks > 200, "they both talk and walk");
assert.ok(maxRest <= stage.pauseMax + 1 && maxRest >= stage.pauseMin, "rests stay in range");
console.log("crew tests passed");
