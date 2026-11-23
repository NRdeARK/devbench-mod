// Tree: a pixel-art Christmas tree with one elf per agent tab decorating it.
// Composes core (roster), effects (blink, flip) and theme (art, frames) only.
import { View, div, image } from "gpui-kit";
import { h_flex } from "gpui-base";
import { layout, spaces, agents, run, theme } from "herdr";
import { twinkle, pulse, flip } from "./effects.js";
import { roster } from "./core.js";
import { TREE, ELF, elfVariant } from "./christmas.js";

function find(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  for (const c of node.children ?? []) { const f = find(c, id); if (f) return f; }
  return null;
}

export default class Tree extends View {
  // One elf for one agent tab: working elves flip between two frames, a blocked elf waves and blinks "!".
  elf(e, i, t) {
    const w = ELF.cols * ELF.scale, h = ELF.rows * ELF.scale;
    const variant = elfVariant(e, i);
    const names = ELF.frames[e.state] ?? ELF.frames.idle;
    const img = (f) => image(ELF.svg(f, variant)).absolute().left(0).top(0).w(w).h(h);
    const layers = names.length > 1 ? flip(img(names[0]), img(names[1]), ELF.flipMs) : [img(names[0])];
    const bubble = e.state === "blocked"
      ? [pulse(div().absolute().left(w / 2 - 3).top(-13).text_size(13).font_bold().text_color(t.blocked).child(ELF.alert), 700, 0.1)]
      : [];
    return div()
      .id(`elf-${e.id}`)
      .relative()
      .w(w)
      .h(h)
      .flex_none()
      .tooltip(`${e.spaceName}: ${e.name}`)
      .on_click(() => { run("space.select", { id: e.space }); run("tab.select", { id: e.id }); })
      .children([...layers, ...bubble]);
  }

  render() {
    // On the narrow rail there is no room for a tree.
    if ((find(layout(), "sidebar")?.size?.px ?? Infinity) < 160) return div();
    const t = theme();
    const { px } = TREE;
    const w = TREE.cols * px, h = TREE.rows * px;
    const pixel = (id, x, y, color) => div().id(id).absolute().left(x * px).top(y * px).size(px).bg(color);
    const balls = TREE.ornaments.map((o, i) => twinkle(pixel(`orn-${i}`, o.x, o.y, o.c), i));
    const all = roster(spaces(), agents());
    const shown = all.slice(0, ELF.max);
    const elves = shown.map((e, i) => this.elf(e, i, t));
    const more = all.length - shown.length;
    return div().relative().size_full()
      .child(h_flex().size_full().justify_center().items_end().pb(6).child(
        div().relative().w(w).h(h).flex_none()
          .child(image(TREE.svg).w(w).h(h))
          .children(balls)))
      // the elves stand on the snow at the foot of the tree
      .child(h_flex().absolute().left(0).right(0).bottom(8).justify_center().items_end().gap(2)
        .children(elves)
        .when(more > 0, (el) => el.child(div().text_size(10).text_color(t.muted).child(`+${more}`))));
  }
}
