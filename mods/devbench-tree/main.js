// Tree: a pixel-art Christmas tree decorated by three AI characters (Claude, Antigravity, Sol/Codex).
// Pure decoration: a tick counter drives core's crewStep, nothing here reads real agent state.
import { View, div, image } from "gpui-kit";
import { h_flex } from "gpui-base";
import { layout } from "herdr";
import { twinkle, drift, smooth, glide } from "./effects.js";
import { slotsFor, crewPos, crewStep, slotOf, colorOf, placed, THROW_AT, PLACED_AT } from "./core.js";
import { TREE, CREW } from "./christmas.js";

function find(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  for (const c of node.children ?? []) { const f = find(c, id); if (f) return f; }
  return null;
}

export default class Tree extends View {
  init(_props, cx) {
    this.tick = 0;
    cx.timer.every(CREW.tickMs, (cx) => { this.tick += 1; cx.notify(); });
  }

  render() {
    const sidebar = find(layout(), "sidebar")?.size?.px ?? 268;
    // On the narrow rail there is no room for a tree.
    if (sidebar < 160) return div();
    const W = sidebar, { px } = TREE;
    const w = TREE.cols * px, h = TREE.rows * px, ox = (W - w) / 2;
    const slots = slotsFor(TREE.cols, TREE.rows, px);
    const { baubleSize: bs, colors, size } = CREW;
    const slotXY = (s) => ({ x: ox + slots[s].x - bs / 2, y: slots[s].y - bs / 2 });

    const pixel = (id, x, y, color) => div().id(id).absolute().left(x * px).top(y * px).size(px).bg(color);
    const lights = TREE.ornaments.map((o, i) => twinkle(pixel(`orn-${i}`, o.x, o.y, o.c), i));

    // baubles already hanging
    const hung = [...placed(this.tick, CREW.members.length, slots.length, colors.length)].map(([s, c]) => {
      const p = slotXY(s);
      return twinkle(div().id(`hung-${s}`).absolute().left(p.x).top(p.y).size(bs).bg(colors[c]), s, 0.45);
    });

    // the three characters walk slowly round the tree, each hanging a bauble every cycle
    const n = CREW.members.length;
    const back = [], front = [];
    CREW.members.forEach((m, c) => {
      const { k, ph } = crewStep(this.tick, c);
      const s = slotOf(k, c, n, slots.length);
      const target = slotXY(s);
      const pos = crewPos(this.tick, c, n, CREW.orbit);
      const at = { x: W / 2 + pos.x - size.w / 2, y: h - 16 + pos.y - size.h };
      const body = div().id(`crew-${m.key}`).absolute().left(at.x).top(at.y).w(size.w).h(size.h).tooltip(m.name)
        .child(drift(div().relative().w(size.w).h(size.h).child(image(CREW.svg(m.key)).w(size.w).h(size.h)), c, 0, 2));
      (pos.front ? front : back).push(glide(glide(body, "left", CREW.tickMs), "top", CREW.tickMs));
      const carried = { x: at.x + size.w / 2 - bs / 2, y: at.y - bs - 2 };
      const spot = ph >= THROW_AT ? target : carried;
      const bauble = div().id(`carry-${m.key}`).absolute().left(spot.x).top(spot.y).size(bs).bg(colors[colorOf(k, c, colors.length)])
        .opacity(ph >= PLACED_AT ? 0 : 1);
      front.push(ph >= THROW_AT ? smooth(smooth(bauble, "left", 450), "top", 450) : glide(glide(bauble, "left", CREW.tickMs), "top", CREW.tickMs));
    });

    const layer = (kids) => div().absolute().left(0).bottom(6).w(W).h(h).children(kids);
    return div().relative().size_full()
      .child(layer(back))
      .child(h_flex().size_full().justify_center().items_end().pb(6).child(
        div().relative().w(w).h(h).flex_none()
          .child(image(TREE.svg).w(w).h(h))
          .children(lights)))
      // the layers share the tree's coordinate space: same bottom edge and top as the tree box
      .child(layer([...hung, ...front]));
  }
}
