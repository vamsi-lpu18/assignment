# Finance Backend API

Backend service for role-based finance tracking with authentication, record management, dashboard totals, and monthly insights.

## Live URLs

- API Base URL: https://assignment-nek4.onrender.com
- Swagger UI: https://assignment-nek4.onrender.com/api-docs
- OpenAPI JSON: https://assignment-nek4.onrender.com/api-docs.json

## Main Features

- JWT authentication
- Role-based authorization using VIEWER, ANALYST, ADMIN
- Admin user management (list users, update role, activate/deactivate)
- Financial record create, read, update, soft delete
- Record filtering by type, category, text search, page, and limit
- Dashboard totals (income, expense, balance)
- Monthly insights endpoint
- Swagger documentation for testing all APIs

## Tech Stack

- Node.js and Express
- MongoDB and Mongoose
- Joi validation
- JWT and bcryptjs
- Swagger (swagger-jsdoc and swagger-ui-express)

## Role Permissions

| Endpoint Group | VIEWER | ANALYST | ADMIN |
| --- | --- | --- | --- |
| Register and Login | Yes | Yes | Yes |
| Dashboard | Yes | Yes | Yes |
| Monthly Insights | Yes | Yes | Yes |
| Record List | No | Yes | Yes |
| Record Create/Update/Delete | No | No | Yes |
| User Management | No | No | Yes |

## Quick Start (Local)

### 1. Prerequisites

- Node.js 18 or later
- npm
- MongoDB connection string

### 2. Install dependencies

~~~bash
npm install
~~~

### 3. Create environment file

Create a file named .env in project root with:

~~~dotenv
PORT=900
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
~~~

### 4. Run the API

Development mode:

~~~bash
npm run dev
~~~

Production mode:

~~~bash
npm start
~~~

### 5. Verify local URLs

- Base URL: http://localhost:900
- Swagger UI: http://localhost:900/api-docs
- OpenAPI JSON: http://localhost:900/api-docs.json

If PORT is not set, app defaults to 5000.

## Authentication Flow

Use this order while testing:

1. Call POST /api/auth/register to create a user.
2. Call POST /api/auth/login to get a token.
3. For protected routes, pass header Authorization: Bearer <token>.
4. Use a role that has permission for the endpoint.

Inactive users cannot log in and cannot access protected routes.

## Swagger Guide (Clear Steps)

1. Open Swagger UI:
   https://assignment-nek4.onrender.com/api-docs
2. Expand POST /api/auth/login and click Try it out.
3. Submit credentials and copy token from response.
4. Click Authorize in Swagger UI.
5. Paste token and authorize.
   Tip: This API accepts Bearer <token> or raw token.
6. Test protected endpoints directly from Swagger.

OpenAPI JSON is available at:
https://assignment-nek4.onrender.com/api-docs.json

## API Endpoints

### Public Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | / | Welcome route |
| POST | /api/auth/register | Register user and return token |
| POST | /api/auth/login | Login and return token |
| GET | /api-docs | Swagger UI |
| GET | /api-docs.json | OpenAPI specification |

### Admin User Management

| Method | Path | Role | Description |
| --- | --- | --- | --- |
| GET | /api/auth/users | ADMIN | List all users |
| PATCH | /api/auth/users/:id | ADMIN | Update role and/or isActive |

PATCH body (one or both fields):

~~~json
{
  "role": "ANALYST",
  "isActive": true
}
~~~

Valid roles: VIEWER, ANALYST, ADMIN.

### Records Endpoints

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| POST | /api/records | ADMIN | Create record |
| GET | /api/records | ANALYST, ADMIN | List records with filters |
| GET | /api/records/insights/monthly | VIEWER, ANALYST, ADMIN | Monthly insight summary |
| PUT | /api/records/:id | ADMIN | Update record |
| DELETE | /api/records/:id | ADMIN | Soft delete record |

Create record body:

~~~json
{
  "amount": 2500,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-05T10:30:00.000Z",
  "notes": "Monthly salary"
}
~~~

GET /api/records query parameters:

- type: INCOME or EXPENSE
- category: category value
- search: text search in notes and category
- page: page number (default 1)
- limit: page size (default 10)

Example:
GET /api/records?type=EXPENSE&category=Food&page=1&limit=10

GET /api/records/insights/monthly query parameter:

- month: YYYY-MM (optional), example 2026-04

### Dashboard Endpoint

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| GET | /api/dashboard/data | VIEWER, ANALYST, ADMIN | Totals and balance |

Sample response:

~~~json
{
  "totalIncome": 10000,
  "totalExpense": 6500,
  "balance": 3500
}
~~~

## Common HTTP Responses

- 200: Success
- 201: Created
- 400: Validation or bad input
- 401: Missing or invalid token
- 403: Forbidden (role mismatch or inactive user)
- 404: Resource not found
- 500: Server error

## Quick cURL Examples

Register:

~~~bash
curl -X POST "https://assignment-nek4.onrender.com/api/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Admin\",\"email\":\"admin@example.com\",\"password\":\"StrongPassword@123\",\"role\":\"ADMIN\"}"
~~~

Login:

~~~bash
curl -X POST "https://assignment-nek4.onrender.com/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"StrongPassword@123\"}"
~~~

Get records:

~~~bash
curl "https://assignment-nek4.onrender.com/api/records?page=1&limit=10" ^
  -H "Authorization: Bearer <token>"
~~~

## Render Deployment Instructions

Use these service settings:

- Root Directory: . (or leave empty if repo root contains package.json)
- Build Command: npm install
- Start Command: npm start
- Environment Variables:
  - MONGO_URI
  - JWT_SECRET
  - NODE_ENV=production

After deploy, verify:

1. Base URL opens.
2. Swagger UI opens at /api-docs.
3. OpenAPI JSON opens at /api-docs.json.
4. Login returns token.
5. One protected endpoint works with token.

## Render Troubleshooting

Error: Root directory finance-backend does not exist

- Fix: Set Root Directory to . or leave it empty.

Error: Cannot find module /opt/render/project/src/start

- Cause: Wrong start command.
- Fix: Set Start Command to npm start (or node app.js).

## Security Notes

- Never commit real secrets in .env.
- Use a strong JWT secret in production.
- Rotate database and JWT credentials if exposed.
