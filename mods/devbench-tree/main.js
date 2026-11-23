// Tree: a Christmas tree in the sidebar's spare space. Composes effects + theme only.
import { View, div, image } from "gpui-kit";
import { h_flex } from "gpui-base";
import { layout } from "herdr";
import { twinkle, pulse } from "./effects.js";
import { TREE } from "./christmas.js";

function find(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  for (const c of node.children ?? []) { const f = find(c, id); if (f) return f; }
  return null;
}

export default class Tree extends View {
  render() {
    // On the narrow rail there is no room for a tree.
    if ((find(layout(), "sidebar")?.size?.px ?? Infinity) < 160) return div();
    const star = pulse(div().id("tree-star").absolute().left(TREE.star.x).top(TREE.star.y)
      .text_size(22).text_color(TREE.star.color).child(TREE.star.glyph), 1600, 0.5);
    const balls = TREE.ornaments.map((o, i) =>
      twinkle(div().id(`orn-${i}`).absolute().left(o.x - 4).top(o.y - 4).size(8).rounded_full().bg(o.c), i, 0.3));
    return h_flex().size_full().justify_center().items_end().pb(6).child(
      div().relative().w(TREE.w).h(TREE.h).flex_none()
        .child(image(TREE.svg).w(TREE.w).h(TREE.h))
        .child(star)
        .children(balls));
  }
}
