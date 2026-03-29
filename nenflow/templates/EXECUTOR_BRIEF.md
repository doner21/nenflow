---
schema_version: "1.0.0"
artifact_type: "EXECUTOR_BRIEF"
role: "EXECUTOR"
attempt: {{ATTEMPT_NUMBER}}
run_id: "{{RUN_ID}}"
task_summary: "{{TASK_SUMMARY}}"
timestamp: "{{TIMESTAMP}}"
---

# Executor Brief

## You Are

You are the EXECUTOR in a Nenflow PEV loop (Attempt {{ATTEMPT_NUMBER}}).

## Workflow Instructions

Read: `~/.claude/commands/nenflow-executor.md`
Read: `~/.claude/commands/pev-loop-human-handoff-v3.md`

## Required Reads

1. `~/.claude/commands/nenflow-executor.md`
2. `~/.claude/commands/pev-loop-human-handoff-v3.md`
3. `nenflow/runs/{{RUN_ID}}/ATT_{{ATTEMPT_NUMBER}}_PLANNER_CONTRACT.md`
4. `nenflow/templates/EXECUTION_REPORT.md`

## Task Summary

{{TASK_SUMMARY}}

## Environment Checks

{{ENVIRONMENT_CHECKS}}

## Files to Create

{{FILES_TO_CREATE}}

## Invariants to Uphold

{{INVARIANTS}}

## Verification Criteria

{{VERIFICATION_CRITERIA}}

## After Implementation

1. Run all environment checks and capture output.
2. Produce `nenflow/runs/{{RUN_ID}}/ATT_{{ATTEMPT_NUMBER}}_EXECUTION_REPORT.md`
3. Produce `nenflow/runs/{{RUN_ID}}/ATT_{{ATTEMPT_NUMBER}}_VERIFIER_BRIEF.md`
4. Write LATEST_ aliases for both files.
5. Stop. Do not proceed to verification.
