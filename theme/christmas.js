// THEME: how it looks, 8-bit Christmas. Data only: glyphs, sprite paths, palette, geometry.
// No motion (effects/) and no state rules (core/).

import { SPRITES } from "./sprites.meta.js";

export const THEME_NAME = "christmas";

// Corner radii: sidebar rows and pane headers keep their soft corners. Only the tree and bulbs are pixel art.
export const ROW_RADIUS = 8;
export const HEADER_RADIUS = 10;

// ASCII-only markers so the pixel fonts always have the glyph.
export const GLYPHS = { blocked: "!", done: "*", idle: "-", working: "|" };
export const WORKING_FRAMES = ["|", "/", "-", "\\"]; // the classic terminal spinner
export const SPACE_DOT = { blocked: "!", done: "*", working: "+", idle: "-" };
export const BLOCKED_CHIP = "Needs you";

// Small vector hats (theme/santa.svg, theme/elf.svg). Santa for the dispatcher, an elf for everyone else.
export const HATS = {
  santa: "mods/devbench-spaces/santa.svg",
  elf: "mods/devbench-spaces/elf.svg",
  w: 11,
  h: 11,
};
export const hatFor = (spaceName, tabName) =>
  spaceName === "dispatcher" || tabName === "dispatcher" ? HATS.santa : HATS.elf;

// Bulb colours, cycled along the light strings.
export const LIGHT_COLORS = ["#f7768e", "#e0af68", "#9ece6a", "#7aa2f7"]; // Tokyo Night red, yellow, green, blue

// Snowflake glyphs drifting under the garland.
export const FLAKES = ["\u2744", "\u2745", "\u2746"];

// The tree sprite is theme/sprites/tree.px, built to an SVG. Its size and its string lights
// (palette keys 1-4 in the .px) come from the generated sprites.meta.js.
export const TREE = {
  svg: "mods/devbench-tree/tree.svg",
  px: SPRITES.tree.scale,
  cols: SPRITES.tree.cols,
  rows: SPRITES.tree.rows,
  ornaments: SPRITES.tree.lights, // { x, y, c } in sprite pixels: each gets a blinking overlay
  sparkles: [],
};

// The light string across the top of the sidebar: theme/sprites/garland.px (see build.mjs).
export const GARLAND = {
  svg: "mods/devbench-garland/garland.svg",
  px: SPRITES.garland.scale,
  cols: SPRITES.garland.cols,
  rows: SPRITES.garland.rows,
  lights: SPRITES.garland.lights,
};

// Group adjacent light pixels of one colour into bulbs {x,y,w,h,c} so each bulb blinks as one block.
export function bulbs(lights) {
  const seen = new Set();
  const key = (l) => `${l.x},${l.y}`;
  const at = new Map(lights.map((l) => [key(l), l]));
  const out = [];
  for (const l of lights) {
    if (seen.has(key(l))) continue;
    let w = 0, h = 0;
    while (at.get(`${l.x + w},${l.y}`)?.c === l.c) w++;
    while (at.get(`${l.x},${l.y + h}`)?.c === l.c) h++;
    for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) seen.add(`${l.x + dx},${l.y + dy}`);
    out.push({ x: l.x, y: l.y, w, h, c: l.c });
  }
  return out;
}

// The crew: three pixel characters (theme/sprites/char-*.px: 16x13 art, tripled, with a 2px light outline) that wander in front of the
// tree, rest, and chat now and then. Positions are px from the tree's centre; the stage is the strip at its foot.
export const CREW = {
  tickMs: 400,
  stage: { rx: 100, ry: 14, speed: 5, pauseMin: 8, pauseMax: 25, talkRange: 90, minGap: 60, chatChance: 0.1, quietMin: 60, quietMax: 120 },
  snow: { flakes: 22, color: "#c0caf5" },
  members: [
    { key: "claude", name: "Claude" },
    { key: "agy", name: "Antigravity" },
    { key: "codex", name: "Sol (Codex)" },
  ],
  svg: (key) => `mods/devbench-tree/char-${key}.svg`,
  // drawn size comes from the built sprite (outline included); all three share it
  size: { w: SPRITES["char-claude"].cols * SPRITES["char-claude"].scale, h: SPRITES["char-claude"].rows * SPRITES["char-claude"].scale },
  lines: ["nice tree!", "ho ho ho", "more lights?", "ship it!", "tests green", "cocoa break", "so sparkly", "need review?", "merry xmas", "brb"],
};

// The brand mark: the Herdr ram as a sheep pulling a sledge (theme/sprites/sheep.px, 2x). It stands still.
export const BRAND = {
  svg: "mods/devbench-brand/sheep.svg",
  w: SPRITES.sheep.cols * SPRITES.sheep.scale,
  h: SPRITES.sheep.rows * SPRITES.sheep.scale,
};
