---
schema_version: "1.0.0"
artifact_type: "ORCHESTRATOR_MANIFEST"
role: "ORCHESTRATOR"
attempt: 0
run_id: "{{RUN_ID}}"
task_summary: "{{TASK_SUMMARY}}"
timestamp: "{{TIMESTAMP}}"
---

# Nenflow Run Manifest

## Run Metadata

| Field | Value |
|-------|-------|
| Run ID | {{RUN_ID}} |
| Task | {{TASK_SUMMARY}} |
| Started | {{TIMESTAMP}} |
| Max Attempts | 2 |
| Status | {{STATUS}} |

## Task

{{TASK_FULL_DESCRIPTION}}

## Attempt Log

### Attempt 1

| Phase | Artifact | Validator Result | Timestamp |
|-------|----------|-----------------|-----------|
| Research (optional) | ATT_1_RESEARCH_BRIEF.md | — | — |
| Planner | ATT_1_PLANNER_CONTRACT.md | — | — |
| Human Gate | — | — | — |
| Executor | ATT_1_EXECUTION_REPORT.md | — | — |
| Verifier | ATT_1_VERIFICATION_REPORT.md | — | — |
| **Verdict** | — | **—** | — |

### Attempt 2 (only if Attempt 1 FAIL)

| Phase | Artifact | Validator Result | Timestamp |
|-------|----------|-----------------|-----------|
| Planner | ATT_2_PLANNER_CONTRACT.md | — | — |
| Human Gate | — | — | — |
| Executor | ATT_2_EXECUTION_REPORT.md | — | — |
| Verifier | ATT_2_VERIFICATION_REPORT.md | — | — |
| **Verdict** | — | **—** | — |

## Final Outcome

{{FINAL_OUTCOME}}
