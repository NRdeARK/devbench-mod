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

// --- The crew: three characters that wander round the tree, rest, and talk. Pure: randomness is injected. ---
// A member: { x, lane, mode: "walk"|"rest", left (rest ticks), tx, tl (walk target), say, reply }.
// x is px from the tree's centre; lane is -1 (behind the tree) .. 1 (in front), so a walk can swing round it.
export const SAY_TICKS = 4;

export const makeCrew = (n, stage) => Array.from({ length: n }, (_v, i) => ({
  x: Math.round(((i + 0.5) / n * 2 - 1) * stage.rx * 0.7),
  lane: i % 2 ? 1 : -1,
  mode: "rest", left: 2 + i * 3, tx: 0, tl: 0, say: null, reply: null,
}));

const between = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));

function step(m, rng, stage) {
  const s = { ...m, say: m.say && m.say.left > 1 ? { ...m.say, left: m.say.left - 1 } : null };
  if (m.reply) {
    if (m.reply.delay > 1) s.reply = { ...m.reply, delay: m.reply.delay - 1 };
    else { s.say = { text: m.reply.text, left: SAY_TICKS }; s.reply = null; }
  }
  if (m.mode === "walk") {
    const dx = m.tx - m.x, d = Math.abs(dx);
    if (d <= stage.speed) return { ...s, x: m.tx, lane: m.tl, mode: "rest", left: between(rng, stage.pauseMin, stage.pauseMax) };
    return { ...s, x: m.x + Math.sign(dx) * stage.speed, lane: m.lane + (m.tl - m.lane) * (stage.speed / d) };
  }
  if (m.left > 1 || s.say || s.reply) return { ...s, left: Math.max(1, m.left - 1) };
  // rest is over: pick somewhere at least a quarter of the stage away, behind or in front of the tree
  let tx = between(rng, -stage.rx, stage.rx);
  if (Math.abs(tx - m.x) < stage.rx / 4) tx = m.x > 0 ? -stage.rx / 2 : stage.rx / 2;
  return { ...s, mode: "walk", tx, tl: rng() < 0.5 ? -1 : 1 };
}

// Advance every member one tick; two members resting near each other may start a chat.
export function crewTick(crew, rng, stage, lines) {
  const next = crew.map((m) => step(m, rng, stage));
  for (let i = 0; i < next.length; i++) for (let j = i + 1; j < next.length; j++) {
    const a = next[i], b = next[j];
    const free = (m) => m.mode === "rest" && !m.say && !m.reply;
    if (!free(a) || !free(b) || Math.abs(a.x - b.x) > stage.talkRange || rng() > 0.35) continue;
    const l1 = between(rng, 0, lines.length - 1);
    const l2 = (l1 + 1 + between(rng, 0, lines.length - 2)) % lines.length;
    const hold = SAY_TICKS * 2 + 2;
    next[i] = { ...a, say: { text: lines[l1], left: SAY_TICKS }, left: Math.max(a.left, hold) };
    next[j] = { ...b, reply: { text: lines[l2], delay: SAY_TICKS }, left: Math.max(b.left, hold) };
  }
  return next;
}
