// Tree: a pixel-art Christmas tree with three AI characters (Claude, Antigravity, Sol/Codex) that wander
// round it, rest, and chat. Pure decoration: nothing here reads real agent state.
import { View, div, image } from "gpui-kit";
import { h_flex } from "gpui-base";
import { layout, theme } from "herdr";
import { twinkle, drift, glide } from "./effects.js";
import { makeCrew, crewTick, makeSnow, snowTick } from "./core.js";
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
    this.snow = null; // made on first render, once the sidebar width is known
    cx.timer.every(CREW.tickMs, (cx) => {
      this.crew = crewTick(this.crew, Math.random, CREW.stage, CREW.lines);
      if (this.snow) this.snow = snowTick(this.snow, this.snowW, this.snowH, Math.random);
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

    if (!this.snow) { this.snowW = W; this.snowH = h; this.snow = makeSnow(CREW.snow.flakes, W, h, Math.random); }

    // Walkers glide a little each tick, always in front of the tree; lane 0..1 is how far forward they stand.
    const front = [];
    CREW.members.forEach((m, c) => {
      const s = this.crew[c];
      const left = W / 2 + s.x - size.w / 2;
      const top = h - 16 - stage.ry + s.lane * stage.ry - size.h;
      const bubble = s.say
        ? div().id(`say-${m.key}`).absolute().left(Math.max(2, Math.min(W - 84, left + size.w / 2 - 36))).top(top - 20 - (c % 2) * 16)
            .child(div().px(6).py(2).rounded(8).bg(t.surface ?? "#292e42").border_1().border_color(t.dim ?? "#565f89")
              .text_size(10).text_color(t.foreground).child(s.say.text))
        : null;
      const body = div().id(`crew-${m.key}`).absolute().left(left).top(top).w(size.w).h(size.h).tooltip(m.name)
        .child(drift(div().relative().w(size.w).h(size.h).child(image(CREW.svg(m.key)).w(size.w).h(size.h)), c, 0, 2));
      front.push(glide(glide(body, "left", CREW.tickMs), "top", CREW.tickMs));
      if (bubble) front.push(bubble);
    });

    // Snow: a flake that restarts at the top gets a new id, so it is not animated back up the screen.
    const snow = this.snow.map((f, i) =>
      glide(glide(div().id(`snow-${i}-${f.gen}`).absolute().left(f.x).top(f.y).size(f.big ? 3 : 2).bg(CREW.snow.color).opacity(f.big ? 0.9 : 0.6), "left", CREW.tickMs), "top", CREW.tickMs));

    const layer = (kids) => div().absolute().left(0).bottom(6).w(W).h(h).children(kids);
    return div().relative().size_full()
      .child(h_flex().size_full().justify_center().items_end().pb(6).child(
        div().relative().w(w).h(h).flex_none()
          .child(image(TREE.svg).w(w).h(h))
          .children(lights)))
      // the layers share the tree's coordinate space: same bottom edge and top as the tree box
      .child(layer([...front, ...snow]));
  }
}
