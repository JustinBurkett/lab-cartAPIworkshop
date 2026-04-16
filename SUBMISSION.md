# Submission Checklist

## Test Credentials

### Regular User
- Email: `student+demo@buckeyemarketplace.local`
- Password: `Password1`
- Note: On a fresh database, register this user first via `POST /api/auth/register` (or through the Register page), then use these credentials to log in.

### Admin User (Seeded)
- Email: `admin@buckeyemarketplace.local`
- Password: `Admin1234`
- Seed source: `backend/Program.cs` in `SeedAdminUserAsync(...)`.

## Security Practices Applied (3+)

1. JWT validation and short-lived access tokens
- The API validates issuer, audience, signature, and lifetime for JWT bearer tokens before allowing access to protected endpoints.
- Access tokens are intentionally short-lived and refresh tokens are rotated to reduce replay risk.

2. Role-based authorization and explicit 401/403 handling
- Endpoints are protected with role-aware authorization (`User`, `Admin`) so sensitive operations are restricted by role.
- Custom auth challenge/forbidden handlers return clear `401 Unauthorized` and `403 Forbidden` responses.

3. Password and identity controls via ASP.NET Identity
- Passwords are handled by ASP.NET Identity (hashed + verified by framework APIs) rather than custom plaintext logic.
- Identity password requirements are configured (minimum length, digit, uppercase, unique email).

4. Defense-in-depth HTTP response headers
- The app sets security headers such as `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- These reduce common browser-based attack surfaces.

## AI Usage Documentation
- Required AI usage log: [docs/ai-usage-log.md](docs/ai-usage-log.md)

## Confirm Before Submitting

- [x] `dotnet build` succeeds with zero warnings related to project code.
  - Latest run: success (`buckeyemarketplace.sln`).

- [x] `dotnet test` passes with at least 3 unit tests and 1 integration test.
  - Latest run: `4/4` passed.
  - Unit tests: `OrderValidatorUnitTests` has 3 facts.
  - Integration tests: `AuthenticatedOrdersIntegrationTests` has 1 fact.

- [x] `npm test -- --run` passes in the React project with 3+ component/unit tests.
  - Latest run: `3` test files, `6` tests passed.

- [x] `npx playwright test` runs the committed E2E spec end-to-end.
  - Latest run: `1` spec passed (`e2e/checkout.spec.ts`).

- [x] No secrets committed review completed via:
  - `git grep -i "Jwt:Key\|password\|secret"`
  - Review result: no live production secrets or real JWT signing keys were found in source. Matches are expected code symbols, docs/examples, test values, and local dev credentials.

- [x] Admin user is seeded on a fresh database.
  - Confirmed in `backend/Program.cs` (`SeedAdminUserAsync`) where admin role and `admin@buckeyemarketplace.local` are created/assigned if missing.
