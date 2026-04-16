# Buckeye Marketplace

Course project for AMIS 4630 (Spring 2026).

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: ASP.NET Core Web API, Entity Framework Core
- Database: SQLite (development)

## Project Status

- Product catalog and product details: complete
- Cart, checkout, and order history: complete
- Milestone 5 (authentication, security, admin features): complete

## What We Added This Milestone (M5)

### Authentication and Security

- Added registration, login, and refresh endpoints using JWT.
- Added role-based authorization (`User` and `Admin`) on protected endpoints.
- Added explicit `401` and `403` handling for auth/authorization failures.
- Added refresh token persistence and rotation.
- Added password policy enforcement through ASP.NET Identity.
- Added security hardening headers and JWT validation middleware.

### Orders and Checkout

- Added authenticated order placement from cart (`POST /api/orders`).
- Added order history endpoint for the logged-in user (`GET /api/orders/mine`).
- Added order confirmation flow and cart clear-on-order behavior.

### Admin Features

- Added admin dashboard route on the frontend (`/admin`) with role restriction.
- Added admin product management APIs (create, read, update, delete).
- Added admin order management APIs (view all orders, update order status).

## AI Usage

- AI usage log: `docs/ai-usage-log.md`

## Basic Run Commands

From repo root:

```bash
dotnet build buckeyemarketplace.sln
dotnet test buckeyemarketplace.sln
```

From `frontend/`:

```bash
npm test -- --run
```

From repo root for E2E:

```bash
npx playwright test
```
