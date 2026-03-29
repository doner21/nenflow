#!/bin/sh
# uninstall.sh — Remove the Nenflow PEV plugin from Claude Code
# Supports: Mac, Linux
#
# Usage:
#   chmod +x uninstall.sh
#   ./uninstall.sh

echo "==> Uninstalling Nenflow PEV plugin..."
echo ""

FILES="nenflow.md nenflow-planner.md nenflow-executor.md nenflow-verifier.md nenflow-researcher.md pev-loop-human-handoff-v3.md"

i=1
for f in $FILES; do
    if [ -f "$HOME/.claude/commands/$f" ]; then
        rm "$HOME/.claude/commands/$f"
        echo "[$i/6] Removed ~/.claude/commands/$f"
    else
        echo "[$i/6] Not found (skipping): ~/.claude/commands/$f"
    fi
    i=$((i + 1))
done

echo ""
echo "==> Uninstall complete."
echo ""
echo "    Note: the nenflow/ directory inside your projects was NOT removed."
echo "    To remove it from a project, run:"
echo "      rm -rf /path/to/your-project/nenflow"
echo ""
echo "    Restart Claude Code to deactivate the removed commands."
echo ""
