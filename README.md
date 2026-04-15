# 🛍️ Buckeye Marketplace
**Course:** AMIS 4630 - Spring 2026  
**Developer:** Justin Burkett  

- Frontend: React + TypeScript + Vite
- Backend: ASP.NET Core Web API + Entity Framework Core
- Database: SQLite (development)

## Current Milestone Status

- Milestone 4 (Shopping Cart): In progress
- Product catalog: Complete
- Product detail view: Complete
- Authentication: In progress (Milestone 5)

## Recently Added

### Backend

- Added ASP.NET Core Identity + JWT authentication support.
- Added auth endpoints:
	- `POST /api/auth/register`
	- `POST /api/auth/login`
	- `POST /api/auth/refresh`
- Added protected API endpoints with `[Authorize]`:
	- Cart endpoints require authenticated `User` or `Admin`
	- Order endpoints require authenticated `User` or `Admin`
	- Admin endpoints (`/api/admin/*`) require `Admin` role
- Added explicit JSON responses for auth failures:
	- `401 Unauthorized` for missing/invalid JWT
	- `403 Forbidden` for insufficient role access
- Added refresh token persistence + rotation.
- Added seeded admin user (development) for admin feature testing.
- Added Identity password rules:
	- Minimum 8 characters
	- At least one digit
	- At least one uppercase letter
- Added email validation for auth requests.
- Added JWT validation middleware.
- Added migration for Identity and refresh token tables.
- Added order placement flow:
	- `POST /api/orders` places an order from the authenticated user's cart using a shipping address payload
	- `GET /api/orders/mine` returns current user's order history (derived from JWT claims, not URL user id)
	- Order confirmation number is generated per order
	- Cart is cleared after successful order placement

- Added persistent cart endpoints in `CartController`:
	- `GET /api/cart`
	- `POST /api/cart`
	- `PUT /api/cart/{cartItemId}`
	- `DELETE /api/cart/{id}`
	- `DELETE /api/cart/clear`
- Added cart persistence models and DTO mapping for API responses.
- Added validation pipeline with FluentValidation for cart requests.
- Added product stock support (`StockQuantity`) via migration.
- Added stock-aware business rules:
	- Prevent adding out-of-stock products
	- Prevent quantity updates beyond available stock
- Added startup database migration + seed logic in `Program.cs` for development data.

### Frontend

- Added cart API service layer in `src/services/cartApi.ts`.
- Added cart state management with `useReducer` + Context in `src/contexts/CartContext.tsx`.
- Added optimistic cart interactions for add, update quantity, remove, and clear actions.
- Added loading/error handling for cart fetch and mutation flows.
- Added cart UI components for cart page, badge, item row, summary, and checkout form.


## AI Usage Documentation

AI assistance has been used for code scaffolding, implementation acceleration, and documentation support.

- Detailed log: `docs/ai-usage-log.md`
- Project AI conventions: `AGENTS.md`

### What AI Was Used For

- Scaffolding cart reducer/context/component structure
- Generating API wiring between frontend cart state and backend endpoints
- Drafting validator and DTO boilerplate for cart flows
- Assisting with stock validation and edge-case handling

### What Was Verified/Adjusted Manually

- Business logic and edge-case handling (quantity rules, out-of-stock behavior)
- Accessibility requirements (button types, aria-label coverage)
- Type safety and strict TypeScript compatibility
- API behavior and response mapping consistency

## Authentication Setup (Development)

JWT key is intentionally not stored in `appsettings.json`. Configure it with user secrets:

```bash
dotnet user-secrets set "Jwt:Key" "buckeye-super-secret-jwt-key-for-dev-only-change-me-2026" --project backend/BuckeyeMarketplace.csproj
dotnet user-secrets set "Jwt:Issuer" "BuckeyeMarketplace" --project backend/BuckeyeMarketplace.csproj
dotnet user-secrets set "Jwt:Audience" "BuckeyeMarketplaceClient" --project backend/BuckeyeMarketplace.csproj
```

### Seeded Admin Credentials (Development)

- Email: `admin@buckeyemarketplace.local`
- Password: `Admin1234`

These credentials are seeded at startup if the account does not exist.
