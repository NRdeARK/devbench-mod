// EFFECTS: motion helpers. Each takes an element and returns it, animated.
// No colors, no strings, no state rules: the mods compose these with core + theme.
// Flip FX.enabled to false to turn all motion off.
// Bulbs blink hard (linear); everything else eases.

export const FX = { enabled: true };

// Smooth later changes of a property (a row growing when a tab row appears).
export const smooth = (el, property = "height", ms = 140) =>
  FX.enabled ? el.transition(property, { duration: ms, easing: "ease-out" }) : el;

// Blink for things that want attention.
export const pulse = (el, period = 800, low = 0.2) =>
  FX.enabled ? el.loop("opacity", { from: 1, to: low, period, easing: "ease-in-out" }) : el;

// Cycle text frames (an ASCII spinner). Falls back to the first frame.
export const cycle = (el, frames, ms = 160) =>
  FX.enabled && frames.length > 1 ? el.frames(frames, ms) : el.child(frames[0]);

// Apply the right motion for a state: blocked blinks, working spins, others stay still.
export function marker(el, state, glyphs, frames) {
  if (state === "working") return cycle(el, frames);
  el = el.child(glyphs[state] ?? "");
  return state === "blocked" ? pulse(el) : el;
}

// A light that blinks on its own rhythm: pass its index so neighbours drift out of step.
export const twinkle = (el, i = 0, low = 0.05) =>
  FX.enabled ? el.loop("opacity", { from: 1, to: low, period: 600 + ((i * 251) % 700), easing: "linear" }) : el;

// Bob a flake up and down by a few pixels, each on its own period.
export const drift = (el, i = 0, from = 0, to = 6) =>
  FX.enabled ? el.loop("top", { from, to, period: 1800 + ((i * 421) % 1800), easing: "ease-in-out" }) : el;

// Glide at constant speed (a steady walk): later changes of a property move linearly over ms.
export const glide = (el, property, ms) =>
  FX.enabled ? el.transition(property, { duration: ms, easing: "linear" }) : el;
