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
