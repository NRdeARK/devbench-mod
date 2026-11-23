// EFFECTS: motion helpers. Each takes an element and returns it, animated.
// No colors, no strings, no state rules: the mods compose these with core + theme.
// Flip FX.enabled to false to turn all motion off.

export const FX = { enabled: true };

// Smooth later changes of a property (a row growing when a tab row appears, a hover fade).
export const smooth = (el, property = "height", ms = 180) =>
  FX.enabled ? el.transition(property, { duration: ms, easing: "ease-out" }) : el;

// Gentle opacity pulse for things that want attention.
export const pulse = (el, period = 1100, low = 0.35) =>
  FX.enabled ? el.loop("opacity", { from: 1, to: low, period, easing: "ease-in-out" }) : el;

// Cycle text frames (a spinner made of glyphs). Falls back to the first frame.
export const cycle = (el, frames, ms = 320) =>
  FX.enabled && frames.length > 1 ? el.frames(frames, ms) : el.child(frames[0]);

// Apply the right motion for a state: blocked pulses, working cycles frames, others stay still.
export function marker(el, state, glyphs, frames) {
  if (state === "working") return cycle(el, frames);
  el = el.child(glyphs[state] ?? "");
  return state === "blocked" ? pulse(el) : el;
}
