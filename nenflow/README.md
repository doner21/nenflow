# Nenflow — Structured PEV Orchestration

Nenflow is a parallel, additive redesign of the legacy PEV loop system. It fixes structural
defects in the legacy system while preserving all legacy files untouched.

## Quick Start

```
/nenflow <your task here>
```

## File Structure

```
~/.claude/commands/
  nenflow.md               — orchestrator (the /nenflow command)
  nenflow-researcher.md    — Researcher role prompt
  nenflow-planner.md       — Planner role prompt
  nenflow-executor.md      — Executor role prompt
  nenflow-verifier.md      — Verifier role prompt

nenflow/
  README.md
  SYSTEM_DESIGN.md
  validator.js           — Node.js artifact validator (no external deps)
  templates/             — artifact templates for each role
  examples/              — filled examples that pass the validator
  runs/                  — runtime artifacts (per-run directories)
```

## Validator

```bash
node nenflow/validator.js <artifact_path> <role>
node nenflow/validator.js <artifact_path> <role> --run-dir nenflow/runs/<run_id>
```

Exit codes: `0` = passed, `1` = failed.

## Roles

| Role | Produces |
|------|---------|
| Orchestrator `/nenflow` | Run manifest, spawns subagents |
| Researcher (optional) | RESEARCH_BRIEF |
| Planner | PLANNER_CONTRACT |
| Executor | EXECUTION_REPORT + VERIFIER_BRIEF |
| Verifier | VERIFICATION_REPORT |

## Key Design Principles

- **Artifact-based handoffs** — all inter-role communication via structured markdown files on disk
- **Structural validation at every gate** — validator checks sections, IDs, uniqueness, frontmatter, traceability
- **PASS is a hard stop** — no mechanism can force a second attempt after a PASS
- **Immutable attempt artifacts** — `ATT_1_*` files are never overwritten
- **Independent verification** — Verifier role prompt has explicit Independence Rule
