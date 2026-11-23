// Garland: a square-bulb light string over pixel snow. Composes effects + theme only.
import { View, div, image } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { theme } from "herdr";
import { twinkle, drift } from "./effects.js";
import { LIGHT_COLORS, SNOW } from "./christmas.js";

const BULBS = 16;
const FLAKES = 9;

export default class Garland extends View {
  render() {
    const t = theme();
    const bulbs = Array.from({ length: BULBS }, (_v, i) =>
      twinkle(div().id(`bulb-${i}`).w(6).h(8).bg(LIGHT_COLORS[i % LIGHT_COLORS.length]), i));
    // Alternate the 10px pixel-snow sprite with plain 2px specks.
    const flakes = Array.from({ length: FLAKES }, (_v, i) =>
      drift(i % 2
        ? image(SNOW.svg).id(`flake-${i}`).relative().w(SNOW.w).h(SNOW.h)
        : div().id(`flake-${i}`).relative().size(2).mt(4).bg(t.foreground), i));
    return v_flex()
      .size_full()
      .px(10)
      .pt(2)
      // the wire, with bulbs hanging from it
      .child(h_flex().h(11).w_full().justify_between().items_start().border_t(2).border_color(t.dim).children(bulbs))
      .child(h_flex().flex_1().w_full().justify_between().items_start().pt(2).children(flakes));
  }
}
