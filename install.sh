#!/usr/bin/env bash
# Copy the devbench mod + layout into the Herdr app home. Usage: ./install.sh [--dry-run]
set -eu
home="${HERDR_APP_HOME:-$HOME/.config/herdr-app}"; here="$(cd "$(dirname "$0")" && pwd)"; dry=${1:-}
run() { echo "+ $*"; [ "$dry" = --dry-run ] || "$@"; }
run mkdir -p "$home/mods/devbench-spaces" "$home/layouts"
run cp "$here"/mods/devbench-spaces/* "$home/mods/devbench-spaces/"
run mkdir -p "$home/mods/devbench-pane"
run cp "$here"/mods/devbench-pane/* "$home/mods/devbench-pane/"
run cp "$here/layouts/devbench.json" "$home/layouts/devbench.json"
echo "installed. Activate: herdr-app do layout.switch '{\"name\":\"devbench\"}'"
