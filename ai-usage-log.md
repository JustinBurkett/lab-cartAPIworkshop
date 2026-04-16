# AI Usage Log - M5: Security, JWT Auth, and Admin Features

## Session: April 2026

### Authentication API (Register/Login/Refresh)
* **Generated with AI support:** Initial controller patterns for registration, login, and refresh-token flows in `AuthController`.
* **What AI was used for:** Suggesting endpoint structure, response contracts, and token lifecycle logic (access + refresh).
* **Manual verification/modifications:** Confirmed error handling for invalid credentials, duplicate email registration, and expired/invalid refresh tokens; validated actual responses with test runs.

### JWT Configuration and Middleware
* **Generated with AI support:** JWT bearer middleware setup in startup, including token validation parameters and auth pipeline wiring.
* **What AI was used for:** Recommending issuer/audience/signing-key/lifetime checks and middleware ordering.
* **Manual verification/modifications:** Verified `UseAuthentication` and `UseAuthorization` ordering, ensured runtime key loading via user secrets, and tested protected endpoint access with and without tokens.

### Password Security and Identity
* **Generated with AI support:** Identity configuration scaffolding and password policy settings.
* **What AI was used for:** Proposing secure defaults for password rules and identity-backed account management.
* **Manual verification/modifications:** Kept password hashing/verification fully in ASP.NET Identity APIs, validated registration/login behavior, and confirmed no custom plaintext password handling was introduced.

### Role-Based Authorization and Admin Enforcement
* **Generated with AI support:** Role-gated endpoint annotations and admin-only route patterns for backend controllers.
* **What AI was used for:** Drafting role restrictions for user/admin endpoints and forbidden-path handling.
* **Manual verification/modifications:** Confirmed `Admin` role enforcement for admin APIs and order-status updates, and verified correct `401` vs `403` behavior through automated and manual checks.

### Admin Dashboard and Admin APIs
* **Generated with AI support:** Frontend admin dashboard wiring and backend admin endpoints for product CRUD and order management.
* **What AI was used for:** Drafting typed service calls, form flow for create/update/delete products, and status update interactions.
* **Manual verification/modifications:** Validated role-restricted frontend routing, checked API integration against protected endpoints, and confirmed end-to-end admin flows still work after security updates.

### Security Hardening and Dependency Risk Reduction
* **Generated with AI support:** Security review checklist and safe dependency remediation plan.
* **What AI was used for:** Prioritizing non-breaking vulnerability fixes first, then recommending a controlled Vitest upgrade to clear remaining advisories.
* **Manual verification/modifications:** Re-ran `npm audit`, `dotnet list package --vulnerable`, `dotnet test`, `npm test -- --run`, and `npx playwright test` after updates to ensure vulnerabilities were addressed without regressions.

### Submission and Evidence Documentation
* **Generated with AI support:** Submission checklist language and evidence mapping to grading requirements.
* **What AI was used for:** Structuring concise confirmation statements for build, tests, E2E, security checks, admin seeding, and auth coverage.
* **Manual verification/modifications:** Kept only milestone-relevant items in this file, updated documentation links, and cross-checked all listed confirmations against live command output.