# API Testing Challenge

A QA automation solution demonstrating API testing with TypeScript, Playwright, BDD (Cucumber), and Docker mock services.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   User Service  │     │  Order Service  │
│   (Port 3001)   │     │   (Port 3002)   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │  Playwright │
              │  API Tests  │
              │  (Cucumber) │
              └─────────────┘
```

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Mock Services

```bash
npm run docker:up
```

### Run Tests

```bash
npm test
```

### Stop Services

```bash
npm run docker:down
```

## Project Structure

```
├── docker/
│   ├── user-service/      # User Service mock (GET /users/:id)
│   └── order-service/     # Order Service mock (GET/POST /orders)
├── src/
│   ├── interfaces/        # TypeScript interfaces
│   └── validators/        # Interface-based validators
├── tests/
│   ├── features/          # Cucumber feature files
│   └── steps/             # Step definitions
├── docker-compose.yml
└── cucumber.js
```

## Test Scenario

The test validates a complete user journey:

1. Retrieve User - `GET /users/1` returns HTTP 200 with user data
2. Fetch Orders - `GET /orders?userId=1` returns HTTP 200 with orders list
3. Create Order - `POST /orders` with amount 35.95 returns HTTP 200 with new order

## API Endpoints

### User Service (http://localhost:3001)

| Method | Endpoint     | Description       |
|--------|--------------|-------------------|
| GET    | /users/:id   | Get user by ID    |

### Order Service (http://localhost:3002)

| Method | Endpoint | Description              |
|--------|----------|--------------------------|
| GET    | /orders  | Get orders by userId     |
| POST   | /orders  | Create new order         |

## Key Features

- BDD with Cucumber using Gherkin feature files with data-driven scenarios
- Playwright API Testing with native HTTP client and full TypeScript support
- Interface Validators for runtime type checking of API responses
- Docker Mock Services providing isolated, reproducible test environment
- Comprehensive Assertions with documented explanatory comments
