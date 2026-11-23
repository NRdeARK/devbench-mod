// THEME: how it looks. Glyphs, labels, and the Herdr theme name. No motion, no logic.

export const THEME_NAME = "christmas";

// Row-end markers per state (done is a star; idle is quiet snow).
export const GLYPHS = { blocked: "!", done: "★", idle: "·", working: "❄" };
// Frames the working marker cycles through (snowflakes).
export const WORKING_FRAMES = ["❄", "❅", "❆", "❅"];
// Space-row dot per state.
export const SPACE_DOT = { blocked: "●", done: "★", working: "❄", idle: "·" };
export const BLOCKED_CHIP = "Needs you 🎁";

// Hats on the agent logos: Santa for the dispatcher, an elf for everyone else.
// Files sit next to the mod (install.sh copies theme/*.svg into it).
export const HATS = { santa: "mods/devbench-spaces/santa.svg", elf: "mods/devbench-spaces/elf.svg" };
export const hatFor = (spaceName, tabName) =>
  spaceName === "dispatcher" || tabName === "dispatcher" ? HATS.santa : HATS.elf;

// Bulb colors (cycled along the light string) and flake glyphs.
export const LIGHT_COLORS = ["#ff4d5e", "#f4c95d", "#5be37d", "#6fb7ff"];
export const FLAKES = ["❄", "❅", "❆"];
