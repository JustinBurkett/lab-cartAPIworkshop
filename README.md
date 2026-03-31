# Buckeye Marketplace (AMIS 4630)

Buckeye Marketplace is a full-stack e-commerce application for AMIS 4630.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: ASP.NET Core Web API + Entity Framework Core
- Database: SQLite (development)

## Current Milestone Status

- Milestone 4 (Shopping Cart): In progress
- Product catalog: Complete
- Product detail view: Complete
- Authentication: Not started (planned for Milestone 5)

## Recently Added

### Backend

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