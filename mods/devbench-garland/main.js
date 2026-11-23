// Garland: a string of twinkling lights over drifting snowflakes. Composes effects + theme only.
import { View, div } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { theme } from "herdr";
import { twinkle, drift } from "./effects.js";
import { LIGHT_COLORS, FLAKES } from "./christmas.js";

const BULBS = 16;
const FLAKE_COUNT = 9;

export default class Garland extends View {
  render() {
    const t = theme();
    const bulbs = Array.from({ length: BULBS }, (_v, i) =>
      twinkle(div().id(`bulb-${i}`).w(6).h(9).rounded(4).bg(LIGHT_COLORS[i % LIGHT_COLORS.length]), i));
    const flakes = Array.from({ length: FLAKE_COUNT }, (_v, i) =>
      drift(div().id(`flake-${i}`).relative().text_size(8 + (i % 3) * 2).text_color(t.foreground).opacity(0.55).child(FLAKES[i % FLAKES.length]), i));
    return v_flex()
      .size_full()
      .px(10)
      .pt(2)
      // the wire, with bulbs hanging from it
      .child(h_flex().h(12).w_full().justify_between().items_start().border_t(1).border_color(t.dim).children(bulbs))
      .child(h_flex().flex_1().w_full().justify_between().items_start().pt(2).children(flakes));
  }
}
