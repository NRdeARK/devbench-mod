// Tree: a pixel-art Christmas tree in the sidebar's spare space. Composes effects + theme only.
import { View, div, image } from "gpui-kit";
import { h_flex } from "gpui-base";
import { layout } from "herdr";
import { twinkle } from "./effects.js";
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
    const { px } = TREE;
    const w = TREE.cols * px, h = TREE.rows * px;
    const pixel = (id, x, y, color) => div().id(id).absolute().left(x * px).top(y * px).size(px).bg(color);
    const balls = TREE.ornaments.map((o, i) => twinkle(pixel(`orn-${i}`, o.x, o.y, o.c), i));
    const sparks = TREE.sparkles.map((s, i) => twinkle(pixel(`spk-${i}`, s.x, s.y, "#ffffff"), i + 3));
    return h_flex().size_full().justify_center().items_end().pb(6).child(
      div().relative().w(w).h(h).flex_none()
        .child(image(TREE.svg).w(w).h(h))
        .children(balls)
        .children(sparks));
  }
}
