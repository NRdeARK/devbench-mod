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

// --- The crew: three characters that wander at the tree's foot, rest, and now and then talk. Pure: randomness is injected. ---
// A member: { x, lane, mode: "walk"|"rest", left (rest ticks), tx, tl (walk target), quiet (ticks before the
// next chat), say, reply }. x is px from the tree's centre; lane is 0 (back of the stage) .. 1 (front).
export const SAY_TICKS = 6;

export const makeCrew = (n, stage) => Array.from({ length: n }, (_v, i) => ({
  x: Math.round(((i + 0.5) / n * 2 - 1) * stage.rx * 0.9),
  lane: i % 2 ? 1 : 0,
  mode: "rest", left: 3 + i * 4, tx: 0, tl: 0, quiet: 20 + i * 15, say: null, reply: null,
}));

const between = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));

// A walk target for member i that keeps stage.minGap from every other member (where they are and where they head).
function pickTarget(crew, i, rng, stage) {
  for (let tries = 0; tries < 10; tries++) {
    const tx = between(rng, -stage.rx, stage.rx);
    if (Math.abs(tx - crew[i].x) < stage.rx / 4) continue;
    const clear = crew.every((o, j) => j === i || (Math.abs(o.x - tx) >= stage.minGap && (o.mode !== "walk" || Math.abs(o.tx - tx) >= stage.minGap)));
    if (clear) return tx;
  }
  return null;
}

function step(crew, i, rng, stage) {
  const m = crew[i];
  const s = { ...m, quiet: Math.max(0, m.quiet - 1), say: m.say && m.say.left > 1 ? { ...m.say, left: m.say.left - 1 } : null };
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
  const tx = pickTarget(crew, i, rng, stage);
  if (tx === null) return { ...s, left: 3 }; // no clear spot: stay a little longer
  return { ...s, mode: "walk", tx, tl: rng() };
}

// Advance every member one tick; two members resting near each other may start a (rare) chat.
export function crewTick(crew, rng, stage, lines) {
  // one at a time, each seeing the others' latest move, so two never pick the same spot in one tick
  const next = [...crew];
  for (let i = 0; i < next.length; i++) next[i] = step(next, i, rng, stage);
  const free = (m) => m.mode === "rest" && !m.say && !m.reply && m.quiet === 0;
  for (let i = 0; i < next.length; i++) for (let j = i + 1; j < next.length; j++) {
    const a = next[i], b = next[j];
    if (!free(a) || !free(b) || Math.abs(a.x - b.x) > stage.talkRange || rng() > stage.chatChance) continue;
    const l1 = between(rng, 0, lines.length - 1);
    const l2 = (l1 + 1 + between(rng, 0, lines.length - 2)) % lines.length;
    const hold = SAY_TICKS * 2 + 2;
    next[i] = { ...a, say: { text: lines[l1], left: SAY_TICKS }, left: Math.max(a.left, hold), quiet: between(rng, stage.quietMin, stage.quietMax) };
    next[j] = { ...b, reply: { text: lines[l2], delay: SAY_TICKS }, left: Math.max(b.left, hold), quiet: between(rng, stage.quietMin, stage.quietMax) };
  }
  return next;
}

// --- Snow: flakes fall at their own speed and sway a little; one that reaches the bottom starts again at the top
// (gen counts restarts so a view can treat it as a new element instead of animating it back up). ---
export const makeSnow = (n, w, h, rng) => Array.from({ length: n }, () => ({
  x: rng() * w, y: rng() * h, v: 6 + rng() * 6, big: rng() < 0.3, gen: 0,
}));
export function snowTick(flakes, w, h, rng) {
  return flakes.map((f) => {
    const y = f.y + f.v;
    if (y > h) return { ...f, x: rng() * w, y: -3, v: 6 + rng() * 6, gen: f.gen + 1 };
    return { ...f, y, x: Math.min(w, Math.max(0, f.x + (rng() - 0.5) * 6)) };
  });
}
