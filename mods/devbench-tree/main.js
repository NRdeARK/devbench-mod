// Tree: a pixel-art Christmas tree with blinking lights. Composes effects and theme only.
import { View, div, image, svg } from "gpui-kit";
import { h_flex } from "gpui-base";
import { layout } from "herdr";
import { twinkle, pulse, sway } from "./effects.js";
import { TREE, BAUBLES } from "./christmas.js";

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
    // An agent logo on a string: sways on its branch, with a soft glow that breathes.
    const bauble = (b, i) => {
      const half = b.size / 2;
      const inner = b.size - 8;
      const logo = b.tint ? svg(b.icon).size(inner).text_color(b.tint) : image(b.icon).w(inner).h(inner);
      const glow = pulse(div().absolute().left(-3).top(-3).size(b.size + 6).rounded(99).bg("#e0af6833"), 900 + i * 300, 0.2);
      const hung = div().absolute().top(b.y).w(b.size).h(b.size + 8).flex_none().tooltip("hangs on the tree")
        .child(div().absolute().left(half).top(0).w(1).h(8).bg("#565f89"))
        .child(div().absolute().top(8).left(0).size(b.size).child(glow)
          .child(div().absolute().left(0).top(0).size(b.size).flex().rounded(99).overflow_hidden().bg("#16161ecc").border_1().border_color("#e0af68").items_center().justify_center().child(logo)));
      return sway(hung, i, b.x - half);
    };
    return h_flex().size_full().justify_center().items_end().pb(6).child(
      div().relative().w(w).h(h).flex_none()
        .child(image(TREE.svg).w(w).h(h))
        .children(balls)
        .children(BAUBLES.map(bauble)));
  }
}
