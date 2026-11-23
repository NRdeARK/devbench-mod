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

// One entry per agent tab, in sidebar order: who an elf stands for.
export const roster = (spaces, agents) =>
  spaces.flatMap((w) => tabRows(w, agents).map((r) => ({ id: r.id, space: w.id, spaceName: w.name, name: r.name, state: r.state, program: r.program })));
