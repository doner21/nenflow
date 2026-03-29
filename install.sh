#!/bin/sh
# install.sh — Install the Nenflow PEV plugin globally for Claude Code
# Supports: Mac, Linux
#
# Usage:
#   chmod +x install.sh
#   ./install.sh

set -e

PLUGIN_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Installing Nenflow PEV plugin..."
echo ""

# 1. Create ~/.claude/commands/ if needed
mkdir -p "$HOME/.claude/commands"
echo "[1/2] Checked ~/.claude/commands/"

# 2. Copy all command files
cp "$PLUGIN_DIR/commands/nenflow.md"                    "$HOME/.claude/commands/nenflow.md"
cp "$PLUGIN_DIR/commands/nenflow-planner.md"            "$HOME/.claude/commands/nenflow-planner.md"
cp "$PLUGIN_DIR/commands/nenflow-executor.md"           "$HOME/.claude/commands/nenflow-executor.md"
cp "$PLUGIN_DIR/commands/nenflow-verifier.md"           "$HOME/.claude/commands/nenflow-verifier.md"
cp "$PLUGIN_DIR/commands/nenflow-researcher.md"         "$HOME/.claude/commands/nenflow-researcher.md"
cp "$PLUGIN_DIR/commands/pev-loop-human-handoff-v3.md"  "$HOME/.claude/commands/pev-loop-human-handoff-v3.md"
echo "[2/2] Copied 6 command files to ~/.claude/commands/"

echo ""
echo "==> Installation complete."
echo ""
echo "    Commands installed:"
echo "      /nenflow             — run the PEV orchestrator"
echo "      /nenflow-planner     — Planner role (used by orchestrator)"
echo "      /nenflow-executor    — Executor role (used by orchestrator)"
echo "      /nenflow-verifier    — Verifier role (used by orchestrator)"
echo "      /nenflow-researcher  — Researcher role (optional phase)"
echo ""
echo "    Restart Claude Code to activate the commands."
echo ""
echo "    Then add the nenflow/ directory to each project you want to use it in:"
echo "      cp -r $PLUGIN_DIR/nenflow /path/to/your-project/nenflow"
echo ""
