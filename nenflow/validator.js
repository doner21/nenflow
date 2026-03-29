#!/usr/bin/env node
// nenflow/validator.js — Nenflow artifact validator
// Usage: node nenflow/validator.js <artifact_path> <role> [--run-dir <path>]
//
// Exit codes:
//   0 — validation passed
//   1 — validation failed (errors printed to stdout)

'use strict';

const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  const yamlBlock = content.slice(4, end).trim();
  const body = content.slice(end + 4);
  const fields = {};
  for (const line of yamlBlock.split('\n')) {
    const m = line.match(/^(\w[\w_]*):\s*(.*)$/);
    if (m) {
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fields[m[1]] = val;
    }
  }
  return { fields, body };
}

function checkRequiredSections(content, sections) {
  const missing = [];
  for (const sec of sections) {
    const pattern = new RegExp('^' + escapeRegex(sec) + '\\s*$', 'm');
    if (!pattern.test(content)) missing.push(sec);
  }
  return missing;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findIds(content, pattern) {
  const re = new RegExp(pattern, 'g');
  const ids = [];
  let m;
  while ((m = re.exec(content)) !== null) ids.push(m[0]);
  return ids;
}

function checkUniqueIds(content, pattern) {
  const ids = findIds(content, pattern);
  const seen = new Set();
  const dupes = [];
  for (const id of ids) {
    if (seen.has(id)) { if (!dupes.includes(id)) dupes.push(id); }
    seen.add(id);
  }
  return { ids, dupes };
}

function fail(message) { console.log('[NENFLOW VALIDATOR FAIL] ' + message); }
function pass(artifactPath, role) { console.log('[NENFLOW VALIDATOR PASS] ' + artifactPath + ' (' + role + ')'); }

function validatePlanner(content) {
  const errors = [];
  const required = ['## Task Statement','## Invariants','## Constraints','## Verification Criteria','## Unknowns','## Handoff Instructions'];
  for (const sec of checkRequiredSections(content, required)) errors.push('Missing required section: ' + sec);
  const { ids: invIds, dupes: invDupes } = checkUniqueIds(content, '\\[INV_\\d+\\]');
  if (invIds.length === 0) errors.push('## Invariants section must contain at least one [INV_NNN] ID');
  for (const d of invDupes) errors.push('Duplicate [INV_NNN] ID found: ' + d);
  const { ids: sucIds, dupes: sucDupes } = checkUniqueIds(content, '\\[SUC_\\d+\\]');
  if (sucIds.length === 0) errors.push('## Verification Criteria section must contain at least one [SUC_NNN] ID');
  for (const d of sucDupes) errors.push('Duplicate [SUC_NNN] ID found: ' + d);
  return errors;
}

function validateExecutor(content, runDir) {
  const errors = [];
  const required = ['## Execution Summary','## Files Created','## Invariants Addressed','## Test Results','## Evidence','## Open Issues','## Verifier Handoff'];
  for (const sec of checkRequiredSections(content, required)) errors.push('Missing required section: ' + sec);
  const { ids: execIds, dupes: execDupes } = checkUniqueIds(content, '\\[EXEC_\\d+\\]');
  if (execIds.length === 0) errors.push('Must contain at least one [EXEC_NNN] ID');
  for (const d of execDupes) errors.push('Duplicate [EXEC_NNN] ID found: ' + d);
  const invIds = findIds(content, '\\[INV_\\d+\\]');
  if (invIds.length === 0) errors.push('Must reference at least one [INV_NNN] ID (traceability to Planner Contract)');
  if (runDir) {
    const plannerPath = path.join(runDir, 'LATEST_PLANNER_CONTRACT.md');
    if (!fs.existsSync(plannerPath)) {
      errors.push('--run-dir provided but LATEST_PLANNER_CONTRACT.md not found at: ' + plannerPath);
    } else {
      const plannerContent = fs.readFileSync(plannerPath, 'utf8');
      const plannerInvIds = new Set(findIds(plannerContent, '\\[INV_\\d+\\]'));
      for (const id of invIds) { if (!plannerInvIds.has(id)) errors.push('Referenced ' + id + ' not found in LATEST_PLANNER_CONTRACT.md'); }
    }
  }
  return errors;
}

function validateVerifier(content, fm, runDir) {
  const errors = [];
  const required = ['## Verification Summary','## Files Inspected','## Commands Run','## Invariants Verified','## Test Results','## Verdict','## Evidence'];
  for (const sec of checkRequiredSections(content, required)) errors.push('Missing required section: ' + sec);
  const { ids: verIds, dupes: verDupes } = checkUniqueIds(content, '\\[VER_\\d+\\]');
  if (verIds.length === 0) errors.push('Must contain at least one [VER_NNN] ID');
  for (const d of verDupes) errors.push('Duplicate [VER_NNN] ID found: ' + d);
  const invIds = findIds(content, '\\[INV_\\d+\\]');
  if (invIds.length === 0) errors.push('Must reference at least one [INV_NNN] ID (traceability to Planner Contract)');
  const verdictSectionMatch = content.match(/## Verdict\s*([\s\S]*?)(?=\n## |\n---|\Z|$)/);
  let verdictInSection = null;
  if (verdictSectionMatch) {
    const verdictBody = verdictSectionMatch[1];
    const passMatch = /^VERDICT:\s*PASS\s*$/m.test(verdictBody);
    const failMatch = /^VERDICT:\s*FAIL\s*$/m.test(verdictBody);
    if (passMatch && failMatch) errors.push('## Verdict section contains both VERDICT: PASS and VERDICT: FAIL');
    else if (!passMatch && !failMatch) errors.push('## Verdict section must contain exactly one of: "VERDICT: PASS" or "VERDICT: FAIL" (on its own line)');
    else verdictInSection = passMatch ? 'PASS' : 'FAIL';
  } else { errors.push('Could not extract ## Verdict section content'); }
  const fmVerdict = fm && fm.fields && fm.fields.verdict;
  if (!fmVerdict) errors.push('YAML frontmatter must include a "verdict" field with value PASS or FAIL');
  else if (fmVerdict !== 'PASS' && fmVerdict !== 'FAIL') errors.push('YAML frontmatter "verdict" field must be exactly PASS or FAIL, got: ' + fmVerdict);
  if (fmVerdict && verdictInSection && fmVerdict !== verdictInSection) errors.push('Frontmatter verdict (' + fmVerdict + ') does not match ## Verdict section (' + verdictInSection + ')');
  if (runDir) {
    const plannerPath = path.join(runDir, 'LATEST_PLANNER_CONTRACT.md');
    if (!fs.existsSync(plannerPath)) {
      errors.push('--run-dir provided but LATEST_PLANNER_CONTRACT.md not found at: ' + plannerPath);
    } else {
      const plannerContent = fs.readFileSync(plannerPath, 'utf8');
      const plannerInvIds = new Set(findIds(plannerContent, '\\[INV_\\d+\\]'));
      for (const id of invIds) { if (!plannerInvIds.has(id)) errors.push('Referenced ' + id + ' not found in LATEST_PLANNER_CONTRACT.md'); }
    }
  }
  return errors;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) { console.log('[NENFLOW VALIDATOR FAIL] Usage: node nenflow/validator.js <artifact_path> <role> [--run-dir <path>]'); process.exit(1); }
  const artifactPath = args[0];
  const role = args[1].toUpperCase();
  let runDir = null;
  const runDirIdx = args.indexOf('--run-dir');
  if (runDirIdx !== -1 && args[runDirIdx + 1]) runDir = args[runDirIdx + 1];
  const validRoles = ['RESEARCHER', 'PLANNER', 'EXECUTOR', 'VERIFIER'];
  if (!validRoles.includes(role)) { fail('Unknown role: ' + args[1] + '. Must be one of: ' + validRoles.join(', ')); process.exit(1); }
  if (!fs.existsSync(artifactPath)) { fail('File does not exist: ' + artifactPath); process.exit(1); }
  const content = fs.readFileSync(artifactPath, 'utf8');
  if (!content.startsWith('---')) { fail('File does not begin with YAML frontmatter (---): ' + artifactPath); process.exit(1); }
  const fm = parseFrontmatter(content);
  if (!fm) { fail('Could not parse YAML frontmatter in: ' + artifactPath); process.exit(1); }
  const errors = [];
  const requiredFields = ['schema_version', 'artifact_type', 'role', 'attempt', 'run_id', 'task_summary', 'timestamp'];
  for (const field of requiredFields) { if (!fm.fields[field]) errors.push('Missing required frontmatter field: ' + field); }
  if (fm.fields.role && fm.fields.role.toUpperCase() !== role) errors.push('Frontmatter role field (' + fm.fields.role + ') does not match argument role (' + role + ')');
  let roleErrors = [];
  if (role === 'PLANNER') roleErrors = validatePlanner(content);
  else if (role === 'EXECUTOR') roleErrors = validateExecutor(content, runDir);
  else if (role === 'VERIFIER') roleErrors = validateVerifier(content, fm, runDir);
  const allErrors = errors.concat(roleErrors);
  if (allErrors.length > 0) { for (const err of allErrors) fail(err); process.exit(1); }
  pass(artifactPath, role);
  process.exit(0);
}

main();
