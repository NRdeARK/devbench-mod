// CORE: pure state logic. No UI, no Herdr imports, so it can be tested with node.

export const URGENCY = ["blocked", "done", "working", "idle"];

// A tab's state from its agents: blocked > working > done only when EVERY agent in it is done > idle.
// (Herdr's own tab status calls a tab done as soon as any one agent is.)
export function tabState(list) {
  if (list.some((a) => a.status === "blocked")) return "blocked";
  if (list.some((a) => a.status === "working")) return "working";
  return list.length && list.every((a) => a.status === "done") ? "done" : "idle";
}

// A space's tabs that hold agents, flat, each with its state, logo source and address.
export function tabRows(space, agents) {
  const rows = [];
  for (const c of space.tabs ?? []) {
    const own = agents.filter((a) => a.tab === c.id);
    if (!own.length) continue;
    const state = tabState(own);
    // The agent that decides the state leads (its logo and address), else the first agent.
    const lead = own.find((a) => a.status === state) ?? own[0];
    rows.push({ id: c.id, name: c.name, state, program: lead.program, address: lead.address });
  }
  return rows;
}

export const spaceState = (rows) => URGENCY.find((s) => rows.some((r) => r.state === s)) ?? null;

// agent.next / agent.prev order: one stop per tab row, space by space.
export const navOrder = (spaces, agents) => spaces.flatMap((w) => tabRows(w, agents).map((r) => r.address));

// --- Decorating crew: who hangs what where, as a pure function of a tick counter. ---
// Each member loops through a CYCLE of ticks: 0 carry a bauble, 1-2 walk to the tree, 3 throw it,
// 4 it lands (hop), 5-7 walk home, 8-9 rest. Members are staggered so they never move in lockstep.
export const CYCLE = 10;
export const PLACED_AT = 4;
export const THROW_AT = 3;
const STAGGER = 4;

// Branch spots inside the tree silhouette, in px relative to the tree's top-left.
export function slotsFor(cols, rows, px) {
  const cx = cols / 2, out = [];
  [13, 17, 21, 25, 29, 33, 37].forEach((r, i) => {
    const hw = Math.min(15.5, 1.5 + (r - 8) * 0.38);
    const dx = [0.7, i % 2 ? 0.25 : 0.4];
    for (const d of dx) for (const sgn of (d === 0.7 ? [-1, 1] : [i % 2 ? 1 : -1])) out.push({ x: Math.round((cx + sgn * hw * d) * px), y: r * px });
  });
  return out;
}

export function crewStep(tick, c) {
  const t = tick + c * STAGGER;
  return { k: Math.floor(t / CYCLE), ph: t % CYCLE };
}
export const slotOf = (k, c, n, slots) => (k * n + c * 5) % slots;
export const colorOf = (k, c, colors) => (k * 3 + c) % colors;

// Baubles currently hanging: slot -> colour index. A slot is re-hung when a later cycle picks it again.
export function placed(tick, members, slots, colors) {
  const out = new Map();
  for (let c = 0; c < members; c++) {
    const { k, ph } = crewStep(tick, c);
    for (let j = Math.max(0, k - slots); j <= k; j++) {
      if (j < k || ph >= PLACED_AT) out.set(slotOf(j, c, members, slots), colorOf(j, c, colors));
    }
  }
  return out;
}
