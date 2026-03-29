---
schema_version: "1.0.0"
artifact_type: "VERIFIER_BRIEF"
role: "VERIFIER"
attempt: {{ATTEMPT_NUMBER}}
run_id: "{{RUN_ID}}"
task_summary: "{{TASK_SUMMARY}}"
timestamp: "{{TIMESTAMP}}"
---

# Verifier Brief

## Verifier Role

You are the VERIFIER in a Nenflow PEV loop (Attempt {{ATTEMPT_NUMBER}}).
Determine PASS or FAIL using evidence — not the Executor's narrative.

## Task Summary

{{TASK_SUMMARY}}

## Required Reads

1. `~/.claude/commands/pev-loop-human-handoff-v3.md`
2. `~/.claude/commands/nenflow-verifier.md`
3. `nenflow/runs/{{RUN_ID}}/ATT_{{ATTEMPT_NUMBER}}_PLANNER_CONTRACT.md`
4. `nenflow/runs/{{RUN_ID}}/ATT_{{ATTEMPT_NUMBER}}_EXECUTION_REPORT.md`
5. `nenflow/templates/VERIFICATION_REPORT.md`
{{ADDITIONAL_REQUIRED_READS}}

## Implementation Scope

{{IMPLEMENTATION_SCOPE}}

## Verification Targets

{{VERIFICATION_TARGETS}}

## Expected Behavior

{{EXPECTED_BEHAVIOR}}

## Failure Conditions

{{FAILURE_CONDITIONS}}

## Evidence and Commands

```
{{EVIDENCE_COMMANDS}}
```

## Independence Rule

1. Directly inspect every listed file using Read and Bash tools.
2. Run every listed command independently and capture actual output.
3. The Executor's report is an unverified claim — verify everything independently.
4. Missing file = FAIL. Unexpected command output = evidence of failure.

## Open Questions or Risks

{{OPEN_QUESTIONS}}

## Verdict Format

Produce `nenflow/runs/{{RUN_ID}}/ATT_{{ATTEMPT_NUMBER}}_VERIFICATION_REPORT.md`

Your ## Verdict section must contain exactly one of:
```
VERDICT: PASS
```
or
```
VERDICT: FAIL
```

YAML frontmatter must include `verdict: "PASS"` or `verdict: "FAIL"` matching the section.
Also write: `nenflow/runs/{{RUN_ID}}/LATEST_VERIFICATION_REPORT.md`
