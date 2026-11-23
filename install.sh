#!/usr/bin/env bash
# Install devbench-mod into the Herdr app home. Usage: ./install.sh [--dry-run]
# Layers: core/ (state logic), effects/ (motion), theme/ (look). Each layer's .js is copied
# next to the mods that import it; theme/*.json goes to themes/.
set -eu
home="${HERDR_APP_HOME:-$HOME/.config/herdr-app}"; here="$(cd "$(dirname "$0")" && pwd)"; dry=${1:-}
run() { echo "+ $*"; [ "$dry" = --dry-run ] || "$@"; }
(cd "$here" && node build.mjs)
for mod in devbench-spaces devbench-pane devbench-garland devbench-tree; do
  run mkdir -p "$home/mods/$mod"
  run cp "$here/mods/$mod/main.js" "$here/mods/$mod/mod.json" "$home/mods/$mod/"
  run cp "$here/core/core.js" "$here/effects/effects.js" "$here"/theme/*.js "$home/mods/$mod/"
  run cp "$here"/theme/*.svg "$here"/theme/generated/*.svg "$here"/theme/generated/*.js "$home/mods/$mod/"
done
run mkdir -p "$home/layouts" "$home/themes"
run cp "$here/layouts/devbench.json" "$home/layouts/devbench.json"
run cp "$here"/theme/*.json "$home/themes/"
echo "installed. Activate: herdr-app do layout.switch '{\"name\":\"devbench\"}'"
