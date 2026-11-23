// Tree: a pixel-art Christmas tree with three AI characters (Claude, Antigravity, Sol/Codex) that wander
// round it, rest, and chat. Pure decoration: nothing here reads real agent state.
import { View, div, image } from "gpui-kit";
import { h_flex } from "gpui-base";
import { layout, theme } from "herdr";
import { twinkle, drift, glide } from "./effects.js";
import { makeCrew, crewTick } from "./core.js";
import { TREE, CREW } from "./christmas.js";

function find(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  for (const c of node.children ?? []) { const f = find(c, id); if (f) return f; }
  return null;
}

export default class Tree extends View {
  init(_props, cx) {
    this.crew = makeCrew(CREW.members.length, CREW.stage);
    cx.timer.every(CREW.tickMs, (cx) => {
      this.crew = crewTick(this.crew, Math.random, CREW.stage, CREW.lines);
      cx.notify();
    });
  }

  render() {
    const W = find(layout(), "sidebar")?.size?.px ?? 268;
    // On the narrow rail there is no room for a tree.
    if (W < 160) return div();
    const t = theme();
    const { px } = TREE, { size, stage } = CREW;
    const w = TREE.cols * px, h = TREE.rows * px;

    const pixel = (id, x, y, color) => div().id(id).absolute().left(x * px).top(y * px).size(px).bg(color);
    const lights = TREE.ornaments.map((o, i) => twinkle(pixel(`orn-${i}`, o.x, o.y, o.c), i));

    // Walkers glide a little each tick; those on the far side of the tree are drawn behind it.
    const back = [], front = [];
    CREW.members.forEach((m, c) => {
      const s = this.crew[c];
      const left = W / 2 + s.x - size.w / 2;
      const top = h - 16 + s.lane * stage.ry - size.h;
      const bubble = s.say
        ? div().id(`say-${m.key}`).absolute().left(Math.max(2, Math.min(W - 84, left + size.w / 2 - 36))).top(top - 20 - (c % 2) * 16)
            .child(div().px(6).py(2).rounded(8).bg(t.surface ?? "#292e42").border_1().border_color(t.dim ?? "#565f89")
              .text_size(10).text_color(t.foreground).child(s.say.text))
        : null;
      const body = div().id(`crew-${m.key}`).absolute().left(left).top(top).w(size.w).h(size.h).tooltip(m.name)
        .child(drift(div().relative().w(size.w).h(size.h).child(image(CREW.svg(m.key)).w(size.w).h(size.h)), c, 0, 2));
      (s.lane >= 0 ? front : back).push(glide(glide(body, "left", CREW.tickMs), "top", CREW.tickMs));
      if (bubble) front.push(bubble);
    });

    const layer = (kids) => div().absolute().left(0).bottom(6).w(W).h(h).children(kids);
    return div().relative().size_full()
      .child(layer(back))
      .child(h_flex().size_full().justify_center().items_end().pb(6).child(
        div().relative().w(w).h(h).flex_none()
          .child(image(TREE.svg).w(w).h(h))
          .children(lights)))
      // the layers share the tree's coordinate space: same bottom edge and top as the tree box
      .child(layer(front));
  }
}
