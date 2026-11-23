// THEME: how it looks, 8-bit Christmas. Data only: glyphs, sprite paths, palette, geometry.
// No motion (effects/) and no state rules (core/).

export const THEME_NAME = "christmas";

// Square everything: 8-bit has no rounded corners.
export const RADIUS = 0;

// ASCII-only markers so the pixel fonts always have the glyph.
export const GLYPHS = { blocked: "!", done: "*", idle: "-", working: "|" };
export const WORKING_FRAMES = ["|", "/", "-", "\\"]; // the classic terminal spinner
export const SPACE_DOT = { blocked: "!", done: "*", working: "+", idle: "-" };
export const BLOCKED_CHIP = "NEEDS YOU!";

// Hats (generated from theme/sprites/*.px). Santa for the dispatcher, an elf for everyone else.
export const HATS = {
  santa: "mods/devbench-spaces/santa.svg",
  elf: "mods/devbench-spaces/elf.svg",
  w: 24,
  h: 16,
};
export const hatFor = (spaceName, tabName) =>
  spaceName === "dispatcher" || tabName === "dispatcher" ? HATS.santa : HATS.elf;

// Bulb colours, cycled along the light strings.
export const LIGHT_COLORS = ["#ff4d5e", "#f4c95d", "#34d97a", "#4aa8ff"];

// Pixel snow (generated sprite); plain 2px specks are drawn by the mod.
export const SNOW = { svg: "mods/devbench-garland/snow.svg", w: 10, h: 10 };

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
