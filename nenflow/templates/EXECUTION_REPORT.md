---
schema_version: "1.0.0"
artifact_type: "EXECUTION_REPORT"
role: "EXECUTOR"
attempt: {{ATTEMPT_NUMBER}}
run_id: "{{RUN_ID}}"
task_summary: "{{TASK_SUMMARY}}"
timestamp: "{{TIMESTAMP}}"
---

# Execution Report

## Execution Summary

{{EXECUTION_SUMMARY}}

## Files Created

{{FILES_CREATED}}

## Invariants Addressed

{{INVARIANTS_ADDRESSED}}

## Test Results

{{TEST_RESULTS}}

## Evidence

{{EVIDENCE}}

## Open Issues

{{OPEN_ISSUES}}

## Verifier Handoff

The Verifier Brief is at:
  nenflow/runs/{{RUN_ID}}/ATT_{{ATTEMPT_NUMBER}}_VERIFIER_BRIEF.md

{{VERIFIER_HANDOFF_NOTES}}
