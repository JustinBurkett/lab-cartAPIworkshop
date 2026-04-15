# Playwright MCP E2E Run Notes

## Goal
Replace the previous manual happy-path test with one automated Playwright MCP-driven E2E run:
- register -> login -> browse -> add to cart -> checkout -> view order in history

## Prompts Given To The Agent
1. "Create a Playwright E2E happy-path spec for register -> login -> browse -> add to cart -> checkout -> view order history."
2. "Run the spec with npx playwright test and fix failures until it passes."
3. "Document first failure and what was corrected."

## Generated Spec
- `e2e/checkout.spec.ts`

## First Run Failures And Fixes
### Failure 1
- Error: `Cannot find module '@playwright/test'` when running `npx playwright test` from repo root.
- Cause: Playwright test runner dependency was not installed at repo root.
- Fix: Added root `package.json` with `@playwright/test` dev dependency and installed Chromium via `npx playwright install chromium`.

### Failure 2
- Error: Playwright `webServer` timed out waiting for backend.
- Cause: backend readiness check targeted `/`, which returns `404`; Playwright waits for `2xx/3xx`.
- Fix: Updated backend readiness URL in `playwright.config.ts` to `http://localhost:5000/api/products`.

### Failure 3
- Error: strict mode violation on `getByLabel('Password')` during registration.
- Cause: page has both `Password` and `Confirm password` fields.
- Fix: Switched selector to `#register-password` in `e2e/checkout.spec.ts`.

### Failure 4
- Error: registration flow stayed on `/register`.
- Cause: CORS mismatch (`127.0.0.1:5173` frontend vs backend allowlist `http://localhost:5173`).
- Fix: Updated Playwright frontend host/base URL to `localhost` in `playwright.config.ts`.

## Final Passing Command
- `npx playwright test e2e/checkout.spec.ts`

Result:
- 1 passed (happy path)
