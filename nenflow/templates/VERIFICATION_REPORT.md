---
schema_version: "1.0.0"
artifact_type: "VERIFICATION_REPORT"
role: "VERIFIER"
attempt: {{ATTEMPT_NUMBER}}
run_id: "{{RUN_ID}}"
task_summary: "{{TASK_SUMMARY}}"
timestamp: "{{TIMESTAMP}}"
verdict: "{{VERDICT}}"
---

# Verification Report

## Verification Summary

{{VERIFICATION_SUMMARY}}

## Files Inspected

{{FILES_INSPECTED}}

## Commands Run

{{COMMANDS_RUN}}

## Invariants Verified

{{INVARIANTS_VERIFIED}}

## Test Results

{{TEST_RESULTS}}

## Verdict

<!-- Must contain exactly one of the following on its own line: -->
<!-- VERDICT: PASS -->
<!-- VERDICT: FAIL -->

{{VERDICT_LINE}}

## Evidence

{{EVIDENCE}}
