---
name: playwright-skills
description: 'Run Playwright workflows for setup checks, targeted debugging, E2E validation, accessibility snapshots, and artifact-driven triage. Use when testing UI flows, reproducing flaky browser bugs, or validating frontend-backend integration.'
argument-hint: 'What flow should be tested, which URL(s), and what pass or fail criteria apply?'
user-invocable: true
---

# Playwright Workflow Skill

## Outcome
Produce a reproducible Playwright run with artifacts (trace, screenshot, video, logs), clear pass or fail verdicts, and CI-oriented test update recommendations.

## When to Use
- Validate end-to-end user flows in a browser
- Reproduce or isolate flaky UI behavior
- Verify frontend and backend integration behavior
- Capture evidence for bug reports or grading demos
- Decide what to update in CI after failures (tests, retries, tags, or run scope)

## Required Inputs
- Target URL or environment (local, staging, production-like)
- Exact scenario steps to execute
- Expected behavior and acceptance criteria
- Constraints (time budget, browser/device coverage, auth prerequisites)

## Workflow
1. Define scope and success criteria
- Restate the scenario as Given/When/Then checks.
- Confirm what would count as pass, fail, and blocked.

2. Run preflight checks
- Confirm toolchain versions (Node.js and Playwright).
- Confirm target app is reachable.
- If unreachable, start required services before testing.

3. Run a quick checklist slice first
- Execute a focused smoke or grep-targeted run to establish fast signal.
- If checks pass and no broader risk is known, report and stop.

4. Pick deeper execution strategy when needed
- Use existing tests when coverage exists.
- Use a focused ad-hoc script when reproducing a new bug.
- Prefer targeted runs first, then broaden scope if needed.

5. Execute tests and capture artifacts
- Run the smallest useful test slice first.
- On failure, rerun with trace enabled.
- Save screenshots and video for observable issues.

6. Triage failures with branching logic
- If selectors fail: verify locator stability before changing waits.
- If timing fails: inspect network or rendering bottlenecks, then add explicit waits only when tied to real app state.
- If auth or cross-origin issues appear: inspect storage state, cookies, token handling, and CORS responses.
- If flaky behavior is suspected: rerun multiple times and compare traces.

7. Report findings and CI updates
- Map each acceptance criterion to pass, fail, or blocked.
- Include reproducible command(s), key evidence paths, and probable root cause.
- Recommend the smallest safe fix, a follow-up regression test, and CI changes (scope, retries, tagging, or sharding) when justified.

## Decision Points
- Start with targeted test scope unless a broad regression is explicitly requested.
- Escalate to full suite only after targeted failures are understood.
- Treat a test as flaky only after repeated inconsistent outcomes.
- Prefer resilient locator updates over adding broad time-based waits.

## Completion Checklist
- Scenario, expectations, and environment are explicit.
- At least one reproducible run command is documented.
- Artifacts exist for each failure (trace plus screenshot minimum).
- Each acceptance criterion has a verdict.
- Next action is clear: fix, re-test, expand coverage, and apply CI test updates if needed.

## Buckeye Marketplace Defaults
- Frontend path: frontend/
- Backend path: backend/
- Typical frontend test command: npx playwright test
- For debugging: npx playwright test --headed --trace on
- For focused runs: npx playwright test --grep "<flow-name>"
