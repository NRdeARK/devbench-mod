// THEME: how it looks, 8-bit Christmas. Data only: glyphs, sprite paths, palette, geometry.
// No motion (effects/) and no state rules (core/).

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
export const LIGHT_COLORS = ["#ff4d5e", "#f4c95d", "#34d97a", "#4aa8ff"];

// Snowflake glyphs drifting under the garland.
export const FLAKES = ["\u2744", "\u2745", "\u2746"];

// Tree sprite is 21x27 pixels at 5x: 105x135. Ornaments are pixel coordinates inside the sprite.
export const TREE = {
  svg: "mods/devbench-tree/tree.svg",
  px: 5,
  cols: 21,
  rows: 27,
  ornaments: [
    { x: 10, y: 8, c: "#ff4d5e" }, { x: 8, y: 11, c: "#f4c95d" }, { x: 12, y: 12, c: "#4aa8ff" },
    { x: 6, y: 14, c: "#ff4d5e" }, { x: 10, y: 16, c: "#ffffff" }, { x: 14, y: 18, c: "#f4c95d" },
    { x: 5, y: 20, c: "#4aa8ff" }, { x: 11, y: 20, c: "#ff4d5e" }, { x: 16, y: 21, c: "#ffffff" },
  ],
  // White sparkles around the star.
  sparkles: [{ x: 6, y: 2 }, { x: 15, y: 1 }, { x: 8, y: 0 }],
};
