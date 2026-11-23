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
