# Nenflow Plugin

Nenflow is a Planner-Executor-Verifier (PEV) orchestration plugin for [Claude Code](https://claude.ai/code). It gives Claude Code a structured, artifact-based loop for completing complex tasks reliably.

Each role (Planner, Executor, Verifier) runs in a fully isolated context window. All communication between roles happens through files on disk — no shared state, no prompt-stuffing. A Node.js validator gates every handoff.

Nenflow is a redesign of [nen-contract](https://github.com/doner21/nen-contract) that fixes six structural defects in the legacy system.

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed
- [Node.js](https://nodejs.org/) v16+ on your PATH
- [Git](https://git-scm.com/downloads) installed

---

## Install — Windows

Open **PowerShell** or **Command Prompt** and run:

```powershell
git clone https://github.com/doner21/nenflow.git
cd nenflow
.\install.bat
```

Then **restart Claude Code**.

To add the `nenflow/` runtime directory to a project:

```powershell
xcopy /E /I C:\path\to\nenflow\nenflow C:\path\to\your-project\nenflow
```

> To update: `git pull` inside the `nenflow` clone, then re-run `install.bat`.

---

## Install — Mac

Open **Terminal** and run:

```bash
git clone https://github.com/doner21/nenflow.git
cd nenflow
chmod +x install.sh
./install.sh
```

Then **restart Claude Code**.

To add the `nenflow/` runtime directory to a project:

```bash
cp -r /path/to/nenflow/nenflow /path/to/your-project/nenflow
```

> To update: `git pull` inside the `nenflow` clone, then re-run `./install.sh`.

---

## Install — Linux

Same as Mac:

```bash
git clone https://github.com/doner21/nenflow.git
cd nenflow
chmod +x install.sh
./install.sh
```

Then **restart Claude Code** (or reload the Claude Code CLI session).

To add the `nenflow/` runtime directory to a project:

```bash
cp -r /path/to/nenflow/nenflow /path/to/your-project/nenflow
```

---

## What the install script does

Copies 6 command files into `~/.claude/commands/` (global, user-scoped):

| File | Purpose |
|------|---------|
| `nenflow.md` | Orchestrator — the `/nenflow` slash command |
| `nenflow-planner.md` | Planner role prompt |
| `nenflow-executor.md` | Executor role prompt |
| `nenflow-verifier.md` | Verifier role prompt |
| `nenflow-researcher.md` | Researcher role prompt (optional phase) |
| `pev-loop-human-handoff-v3.md` | Operating workflow reference |

No project files are modified. No settings.json patching required.

---

## Project setup

Nenflow writes runtime artifacts to a `nenflow/` directory **inside your project**. Copy it once per project:

**Mac / Linux:**
```bash
cp -r /path/to/nenflow-clone/nenflow ./nenflow
```

**Windows:**
```powershell
xcopy /E /I C:\path\to\nenflow-clone\nenflow nenflow
```

This copies the validator, templates, examples, and an empty `runs/` directory.

---

## How to use

From any Claude Code project that has a `nenflow/` directory:

```
/nenflow Add a health check endpoint to the Express server
```

The orchestrator will:

1. Create `nenflow/runs/RUN_{datetime}/`
2. Spawn a **Planner** — produces a structured contract
3. Validate the contract (`node nenflow/validator.js`)
4. **Pause for your review** — reply `proceed` when ready
5. Spawn an **Executor** — implements the plan
6. Validate the execution report
7. Spawn a **Verifier** — independently tests the implementation
8. Validate the verification report
9. Report **PASS** (hard stop) or **FAIL** (one retry)

All artifacts are written to `nenflow/runs/RUN_{datetime}/` in your project.

---

## Validator

The validator is a zero-dependency Node.js script that runs at every gate:

```bash
# Validate a planner contract
node nenflow/validator.js nenflow/runs/RUN_xxx/ATT_1_PLANNER_CONTRACT.md PLANNER

# Validate executor output with traceability check
node nenflow/validator.js nenflow/runs/RUN_xxx/ATT_1_EXECUTION_REPORT.md EXECUTOR --run-dir nenflow/runs/RUN_xxx

# Validate verifier output
node nenflow/validator.js nenflow/runs/RUN_xxx/ATT_1_VERIFICATION_REPORT.md VERIFIER --run-dir nenflow/runs/RUN_xxx
```

Exit codes: `0` = passed, `1` = failed.

What it checks:
- YAML frontmatter present with all required fields
- `role` field matches the role argument
- Required section headers present (role-specific)
- Role-appropriate ID patterns: `[INV_NNN]`, `[EXEC_NNN]`, `[VER_NNN]`
- IDs unique within the file
- VERIFIER: `## Verdict` section contains `VERDICT: PASS` or `VERDICT: FAIL` on its own line; frontmatter `verdict` matches
- With `--run-dir`: all `[INV_NNN]` references in Executor/Verifier artifacts trace back to the Planner Contract

---

## Uninstall — Mac / Linux

```bash
chmod +x uninstall.sh
./uninstall.sh
```

Removes the 6 command files from `~/.claude/commands/`. The `nenflow/` directory inside your projects is **not** removed — delete it manually if no longer needed.

## Uninstall — Windows

```bat
uninstall.bat
```

---

## File structure

```
(this repo — clone once, install globally)
├── README.md
├── install.sh          Mac/Linux install
├── install.bat         Windows install
├── uninstall.sh        Mac/Linux uninstall
├── uninstall.bat       Windows uninstall
├── commands/           Copied to ~/.claude/commands/ by install script
│   ├── nenflow.md
│   ├── nenflow-planner.md
│   ├── nenflow-executor.md
│   ├── nenflow-verifier.md
│   ├── nenflow-researcher.md
│   └── pev-loop-human-handoff-v3.md
└── nenflow/            Copy to each project root
    ├── README.md
    ├── SYSTEM_DESIGN.md
    ├── validator.js    Zero-dependency Node.js validator
    ├── templates/      Artifact templates for each role
    ├── examples/       Filled examples that pass the validator
    └── runs/           Runtime artifacts written here
        └── RUN_{datetime}/
            ├── MANIFEST.md
            ├── ATT_1_PLANNER_CONTRACT.md
            ├── ATT_1_EXE_BRIEF.md
            ├── ATT_1_EXECUTION_REPORT.md
            ├── ATT_1_VERIFIER_BRIEF.md
            ├── ATT_1_VERIFICATION_REPORT.md
            └── LATEST_*.md   (aliases, overwritten by Attempt 2)
```

---

## Key improvements over nen-contract

| Issue | nen-contract | nenflow |
|-------|-------------|--------|
| FORCE_SECOND_ATTEMPT | hooks.py creates it; v3 ignores it (contradiction) | Never created or checked |
| Validation depth | Regex presence only | Sections, IDs, uniqueness, frontmatter, traceability |
| Validation gate | File existence check only | `node nenflow/validator.js` exit-code gate |
| Artifact history | EXE_BRIEF.md overwritten on Attempt 2 | Immutable `ATT_N_*` files + `LATEST_*` aliases |
| Verifier independence | No explicit requirement | Explicit Independence Rule in role prompt |
| Researcher role | Not present | Optional first phase |
| PASS enforcement | Can be overridden by a file | Hard stop — no override |
| Traceability | None | `[INV_NNN]` IDs traced Planner → Executor → Verifier |
