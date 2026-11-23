// Garland: a pixel-art light string; each bulb blinks via an overlay. Composes effects + theme only.
import { View, div, image } from "gpui-kit";
import { h_flex } from "gpui-base";
import { twinkle } from "./effects.js";
import { GARLAND, bulbs } from "./christmas.js";

export default class Garland extends View {
  render() {
    const { px } = GARLAND;
    const w = GARLAND.cols * px, h = GARLAND.rows * px;
    const glow = bulbs(GARLAND.lights).map((b, i) =>
      twinkle(div().id(`bulb-${i}`).absolute().left(b.x * px).top(b.y * px).w(b.w * px).h(b.h * px).bg(b.c), i));
    return h_flex().size_full().justify_center().items_start().child(
      div().relative().w(w).h(h).flex_none()
        .child(image(GARLAND.svg).w(w).h(h))
        .children(glow));
  }
}
