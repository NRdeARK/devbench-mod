// Garland: a pixel-bulb light string over drifting snowflakes. Composes effects + theme only.
import { View, div } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { theme } from "herdr";
import { twinkle, drift } from "./effects.js";
import { LIGHT_COLORS, FLAKES as GLYPHS } from "./christmas.js";

const BULBS = 16;
const FLAKES = 9;

export default class Garland extends View {
  render() {
    const t = theme();
    const bulbs = Array.from({ length: BULBS }, (_v, i) =>
      twinkle(div().id(`bulb-${i}`).w(6).h(8).bg(LIGHT_COLORS[i % LIGHT_COLORS.length]), i));
    const flakes = Array.from({ length: FLAKES }, (_v, i) =>
      drift(div().id(`flake-${i}`).relative().text_size(8 + (i % 3) * 2).text_color(t.foreground).opacity(0.55).child(GLYPHS[i % GLYPHS.length]), i));
    return v_flex()
      .size_full()
      .px(10)
      .pt(2)
      // the wire, with bulbs hanging from it
      .child(h_flex().h(11).w_full().justify_between().items_start().border_t(1).border_color(t.dim).children(bulbs))
      .child(h_flex().flex_1().w_full().justify_between().items_start().pt(2).children(flakes));
  }
}
