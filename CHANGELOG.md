# Changelog

## 2026-04-15 - Security Hardening Milestone

### Commit Message: `security(api): add hardening headers and HSTS policy`
- Added defensive HTTP response headers in backend middleware:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: no-referrer`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Enabled `UseHsts()` for non-development environments.
- Kept `UseHttpsRedirection()` enabled.

### Commit Message: `security(api): reduce server fingerprinting in kestrel`
- Disabled Kestrel `Server` response header via `options.AddServerHeader = false`.

### Commit Message: `security(review): verify checklist coverage for injection, xss, and access control`
- SQL injection review:
  - No `FromSqlRaw` string interpolation or raw SQL string concatenation found.
  - Data access continues through LINQ/EF Core parameterized query generation.
- XSS review:
  - No `dangerouslySetInnerHTML` usage in frontend rendering paths.
- Broken access control review:
  - Protected cart and order endpoints are authorized and scoped to JWT user claims (`ClaimTypes.NameIdentifier`).
  - Admin-only endpoints use `[Authorize(Roles = "Admin")]`.
  - Order history endpoint remains `/api/orders/mine` and is claim-scoped rather than URL user id-scoped.

## Security Checklist Coverage (W13)
Applied practices implemented in codebase:
1. Secrets management with .NET user-secrets for JWT signing key (`Jwt:Key`) instead of appsettings.
2. HTTPS enforcement (`UseHttpsRedirection`) + HSTS in non-dev.
3. Secure response headers middleware.
4. JWT claim-scoped resource queries for user-owned cart/order resources.
5. Role-based authorization (`User` vs `Admin`) with explicit 401/403 responses.
