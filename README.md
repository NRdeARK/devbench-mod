# devbench-mod
Herdr layout + mod for a flat, agent-list-free sidebar.
- `layouts/devbench.json`: shipped `main` layout without the agents panel.
- `mods/devbench-spaces`: clone of shipped `spaces`. Flat list (no worktree nesting), a tab-state glyph replaces the avatar, no branch/repo text, every tab holding an agent is listed flat under its space by tab name with its own state dot (click focuses). A tab is `done` only when ALL its agents are done.
- `mods/devbench-pane`: clone of shipped `pane` header: tinted by agent state, 3px left accent strip (state color, accent when focused), 16px logo. Layout also has a 2px focus border, radius 12, gap 10.
- `./install.sh [--dry-run]` copies both into `~/.config/herdr-app`; then `herdr-app do layout.switch '{"name":"devbench"}'`.
Derived from Herdr's shipped mod; re-clone to pick up upstream changes.
