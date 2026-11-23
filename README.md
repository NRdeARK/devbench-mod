# devbench-mod
Herdr layout + mod for a flat, agent-list-free sidebar.
- `layouts/devbench.json`: shipped `main` layout without the agents panel.
- `mods/devbench-spaces`: clone of shipped `spaces`. Flat list (no worktree nesting), a tab-state glyph replaces the avatar, no branch/repo text, blocked tabs listed under their space by tab name (click focuses). `done` shows only in the glyph.
- `./install.sh [--dry-run]` copies both into `~/.config/herdr-app`; then `herdr-app do layout.switch '{"name":"devbench"}'`.
Derived from Herdr's shipped mod; re-clone to pick up upstream changes.
