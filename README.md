# Buckeye Marketplace

A full-stack e-commerce application built as a course project for AMIS 4630 (Spring 2026). Buckeye Marketplace demonstrates modern web development practices with a React frontend and ASP.NET Core backend, featuring JWT-based authentication, role-based authorization, product catalog, shopping cart, and order management.

## Features

- **Product Catalog**: Browse and view detailed product information
- **Shopping Cart**: Add/remove products, manage quantities
- **User Authentication**: Registration, login, and JWT token-based session management with refresh tokens
- **Order Management**: Place orders from cart, view order history with timestamps
- **Order Confirmation**: Real-time feedback on order placement
- **Admin Dashboard**: Manage products and view/update order statuses (Admin role only)
- **Role-Based Access Control**: User and Admin roles with appropriate restrictions
- **Responsive Design**: Mobile-friendly UI built with React and CSS Modules

## Technology Stack

### Frontend
- **React** 19.2.0 - UI library
- **TypeScript** 5.7.2 - Type-safe JavaScript
- **Vite** 6.0.1 - Fast build tool and dev server
- **React Router** 7.13.0 - Client-side routing
- **Vitest** 3.6.1 - Unit testing framework
- **ESLint** 9.39.1 - Code linting
- **Testing Library** - Component testing utilities

### Backend
- **.NET** 10.0 - Framework
- **ASP.NET Core** 10.0.5 - Web framework
- **Entity Framework Core** 10.0.5 - ORM
- **ASP.NET Identity** 10.0.5 - User and role management
- **JWT Bearer** 10.0.5 - Authentication
- **FluentValidation** 11.3.1 - Request validation
- **Swagger/OpenAPI** 10.1.2 - API documentation
- **SQLite** 10.0.5 - Database (development)
- **xUnit** - Unit testing framework

### DevOps & Testing
- **Playwright** 1.48.2 - End-to-end testing
- **Azure Web App** - Production deployment

## Project Status

✅ **Milestone 1-5: Complete**
- ✅ Product catalog and product details
- ✅ Shopping cart and checkout
- ✅ Authentication and JWT security
- ✅ Order management and history
- ✅ Admin dashboard and product/order management
- ✅ Role-based authorization

## Setup Instructions

### Prerequisites

- **Node.js** 18.0.0+ (for frontend)
- **.NET SDK** 10.0+ (for backend)
- **Git**

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd amis4630-spring26-burkett
```

#### 2. Backend Setup

```bash
cd backend

# Restore NuGet packages
dotnet restore

# Build the backend
dotnet build

# Run the backend server (starts on https://localhost:5000)
dotnet run
```

The backend will automatically create the SQLite database (`buckeye.db`) on first run and apply all migrations.

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev
```

#### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: https://localhost:5000
- **Swagger API Docs**: https://localhost:5000/swagger/index.html

### Running Tests

#### Backend Unit & Integration Tests

```bash
cd backend
dotnet test BuckeyeMarketplace.sln
```

#### Frontend Unit Tests

```bash
cd frontend
npm test -- --run
```

#### End-to-End Tests (Playwright)

```bash
# From repo root
npx playwright test

# Run in UI mode for debugging
npx playwright test --ui

# Run specific test file
npx playwright test checkout.spec.ts
```

## Configuration

### Backend Configuration

The backend uses `appsettings.json` for configuration and SQLite for local development. JWT secrets are configured via ASP.NET user secrets in development and environment variables in production.

### Frontend Configuration

The frontend connects to the backend API via `https://localhost:5000` in development. No additional configuration needed for local setup.

## API Documentation

Full API documentation is available via **Swagger UI** at:

```
https://localhost:5000/swagger/index.html
```

### Key API Endpoints

#### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/refresh` - Refresh JWT token

#### Cart
- `GET /api/cart` - Get current cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item quantity
- `DELETE /api/cart/items/{id}` - Remove item from cart

#### Orders
- `POST /api/orders` - Place order from cart (requires auth)
- `GET /api/orders/mine` - Get user's order history (requires auth)
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/{id}/status` - Update order status (Admin only)

## Deployment Instructions

### Azure Web App Deployment

The application is deployed to Azure App Service:

**Frontend**: https://buckeye-marketplace-burkett.azurewebsites.net  
**Backend API**: https://buckeye-api-burkett.azurewebsites.net

#### Prerequisites
- Azure CLI
- Azure subscription
- Resource group: `rg-buckeye-marketplace`

#### Deploy Backend

```bash
# From backend directory
dotnet publish -c Release -o publish

# Deploy to Azure Web App
az webapp up --name buckeye-api-burkett --resource-group rg-buckeye-marketplace --runtime "DOTNETCORE|10.0" --os-type Windows
```

#### Deploy Frontend

```bash
# From frontend directory
npm run build

# StPreparing for Deployment

#### Build for Production

```bash
# Backend
cd backend
dotnet publish -c Release

# Frontend
cd frontend
npm run build
# Output: frontend/dist/
```

#### Deployment Platforms

The application can be deployed to:
- **Azure App Service** - Backend (Web App)
- **Azure Static Web Apps** - Frontend
- **Docker** - Containerized deployment
- **Any .NET/Node.js hosting** - Standard deployments

Configure environment-specific settings (JWT secrets, API endpoints, CORS) in your deployment platform's configuration management (environment variables, key vault, app settings).Security

- JWT-based stateless authentication
- Refresh token rotation for security
- Password policy: minimum 8 characters, 1 uppercase, 1 digit
- Role-based access control (User/Admin)
- Explicit 401/403 HTTP status codes for auth failures
- HTTPS-only in production
- SQL injection prevention via EF Core parameterized queries

## Documentation

- [AI Usage Log](docs/ai-usage-log.md) - Track of AI-assisted development
- [Architecture Documentation](docs/system_architecture.md) - System design overview
- [Component Architecture](docs/component_architecture.md) - Frontend component structure
- [Design Decisions](docs/design_decisions.md) - Key technical decisions
- [ADR (Architecture Decision Records)](docs/ADR.md) - Formal decision log

## Development Workflow

### Building
```bash
dotnet build buckeyemarketplace.sln
npm run build --prefix frontend
```

### Linting
```bash
cd frontend
npm run lint
```

### Running All Tests
```bash
# Backend tests
dotnet test buckeyemarketplace.sln

# Frontend tests
npm test -- --run --prefix frontend

# E2E tests
npx playwright test
```

## Troubleshooting

### JWT Key Missing Error
If you see "JWT signing key missing" on startup:
```bash
cd backend
dotnet user-secrets set "Jwt:Key" "your-long-random-key-min-32-chars"
```

### Port Already in Use
- Backend uses port 5000/5001 (HTTPS)
- Frontend uses port 5173
- Ensure these ports are available or update configuration

### Database Connection Issues
Delete `buckeye.db` and restart the backend to recreate the database with fresh migrations.

### CORS Errors
Ensure backend CORS is configured properly in `Program.cs` and the frontend URL is whitelisted.

## CPort Already in Use
- Backend uses port 5000/5001 (HTTPS)
- Frontend uses port 5173
- Ensure these ports are available

### Test Failures
- Ensure all dependencies are installed: `dotnet restore` and `npm install`
- Clear build artifacts: `dotnet clean` and `npm ci`
- Check that ports 5000 and 5173 are available for test servers
