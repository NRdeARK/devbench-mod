// Tree: a pixel-art Christmas tree decorated by three AI characters (Claude, Antigravity, Sol/Codex).
// Pure decoration: a tick counter drives core's crewStep, nothing here reads real agent state.
import { View, div, image } from "gpui-kit";
import { h_flex } from "gpui-base";
import { layout } from "herdr";
import { twinkle, drift, smooth } from "./effects.js";
import { slotsFor, crewStep, slotOf, colorOf, placed, THROW_AT, PLACED_AT } from "./core.js";
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

    // the three characters, each carrying a bauble to its branch
    const crew = CREW.members.map((m, c) => {
      const { k, ph } = crewStep(this.tick, c);
      const s = slotOf(k, c, CREW.members.length, slots.length);
      const target = slotXY(s);
      const home = m.home(W, h);
      const side = target.x < W / 2 ? 4 : W - size.w - 4;
      const stand = { x: side, y: Math.max(0, Math.min(h - size.h - 2, target.y - 18)) };
      const walking = ph >= 1 && ph <= 4;
      const at = walking ? stand : home;
      const hop = ph === THROW_AT || ph === PLACED_AT ? -6 : 0;
      const body = div().id(`crew-${m.key}`).absolute().left(at.x).top(at.y + hop).w(size.w).h(size.h).tooltip(m.name)
        .child(drift(div().relative().w(size.w).h(size.h).child(image(CREW.svg(m.key)).w(size.w).h(size.h)), c, 0, 2));
      const thrown = ph >= THROW_AT;
      const from = { x: at.x + size.w / 2 - bs / 2, y: at.y - bs - 2 };
      const spot = thrown ? target : from;
      const bauble = div().id(`carry-${m.key}`).absolute().left(spot.x).top(spot.y).size(bs).bg(colors[colorOf(k, c, colors.length)])
        .opacity(ph >= PLACED_AT && ph !== 0 ? 0 : 1);
      return [smooth(smooth(body, "left", CREW.moveMs), "top", CREW.moveMs), smooth(smooth(bauble, "left", 450), "top", 450)];
    }).flat();

    return div().relative().size_full()
      .child(h_flex().size_full().justify_center().items_end().pb(6).child(
        div().relative().w(w).h(h).flex_none()
          .child(image(TREE.svg).w(w).h(h))
          .children(lights)))
      // characters share the tree's coordinate space: same bottom edge and top as the tree box
      .child(div().absolute().left(0).bottom(6).w(W).h(h).children([...hung, ...crew]));
  }
}
