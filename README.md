# ChocoFixCo Order and Production Manager

BELLS Institute – Module 5: Datacentric Development Assessment

## Project Overview

ChocoFixCo is a chocolate order management application using a RESTful API, MongoDB Atlas, JWT authentication, and AI-generated database queries.

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express
- Database: MongoDB Atlas
- Authentication: JWT and bcryptjs
- AI Provider: OpenRouter
- AI Model: DeepSeek V3.2
- API Testing: Advanced REST Client (ARC)
- Development Environment: GitHub Codespaces

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | API health check |
| GET | /products | List or search products |
| POST | /products | Create product |
| PUT | /products/:id | Update product |
| DELETE | /products/:id | Delete product |
| GET | /orders | List orders |
| POST | /orders | Create order |
| PUT | /orders/:id | Update order |
| DELETE | /orders/:id | Delete order |
| POST | /auth/register | Register user |
| POST | /auth/login | Login and obtain JWT |
| GET | /auth/me | Protected user endpoint |
| POST | /ai/query | Protected AI-generated MongoDB query |

Product search example:

GET /products?search=chocolate

## MongoDB Database

Database: chocofix

Collections:
- products
- orders
- users

Products contain fields such as name, category, price, stock, and description.

Orders contain customer and product information, quantities, and order status.

A product-order relationship is demonstrated using an order's productId reference to a product document.

## Authentication

Passwords are hashed using bcryptjs.

Successful login returns a JWT.

Protected routes require:

Authorization: Bearer <JWT>

## AI Integration

The application uses OpenRouter with DeepSeek V3.2.

The AI receives a natural-language question and generates a structured JSON MongoDB query plan.

Example question:

How many completed orders are there?

Example generated query:

{
  "collection": "orders",
  "operation": "count",
  "filter": {
    "orderStatus": "Completed"
  }
}

The backend validates the generated query and executes permitted read-only MongoDB operations.

Supported AI operations:
- find
- count

Supported collections:
- products
- orders

The AI cannot execute database updates or deletions.

## AI-Generated Mock Data

OpenRouter was used to generate a fictional chocolate product record.

The generated JSON was inserted into MongoDB Atlas and verified through the REST API.

Sample product:
- Name: AI Assessment Sample Chocolate
- Category: Dark Chocolate
- Price: 4.99
- Stock: 25

## Local Setup

1. Clone the repository.
2. Open the api directory.
3. Run npm install.
4. Create api/.env with the required configuration:

MONGO_URI=<MongoDB connection string>
JWT_SECRET=<JWT signing secret>
OPENROUTER_API_KEY=<OpenRouter API key>
OPENROUTER_MODEL=deepseek/deepseek-v3.2

5. Start the backend:

node index.js

6. Open the frontend using a local web server.

Never commit the .env file or API credentials.

## Testing

The following were tested:

- API health check
- Product CRUD
- Order CRUD
- MongoDB persistence
- JWT authentication
- Protected endpoints
- AI-generated MongoDB queries
- AI-generated mock data insertion
- API requests using Advanced REST Client

## GitHub Repository

https://github.com/sheldoncm/chocofixco-order-manager

## Assessment Evidence

Screenshots should demonstrate:
- REST API requests and responses in ARC
- MongoDB collections and product-order relationship
- JWT login and protected API access
- AI-generated query and database result
- AI-generated mock data
- Working frontend
