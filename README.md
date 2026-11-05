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

## Assessment Demonstration Guide — LO6 and LO8

### Before the demonstration

1. Open GitHub Codespaces.
2. Start the API:

   cd api
   node index.js

3. Confirm the API is running on port 3000.
4. Open Advanced REST Client (ARC).
5. Ensure the Codespaces port 3000 is accessible from ARC.

### Login and authentication

1. Open the existing POST /auth/login request in ARC.
2. Click Send.
3. Confirm HTTP 200 and a JWT in the response.
4. Copy the returned token into the ARC environment variable AUTH_TOKEN.
5. Protected requests use the header:

   Authorization: Bearer ${AUTH_TOKEN}

6. Do not replace JWT_SECRET or OPENROUTER_API_KEY.

### LO6 — AI-generated MongoDB query

1. Open the existing POST /ai/query request in ARC.
2. Select BODY and use JSON.
3. Enter:

   {
     "question": "How many completed orders are there?"
   }

4. Click Send.
5. Confirm HTTP 200.
6. Find generatedQuery in the response.

Expected query structure:

   {
     "collection": "orders",
     "operation": "count",
     "filter": {
       "orderStatus": "Completed"
     }
   }

The data.count value is calculated from MongoDB and may change.

Explain to the assessor:

"DeepSeek converts my natural-language question into a MongoDB
query plan. Express validates the generated query and executes
it against MongoDB Atlas."

### LO8 — System prompt and structured JSON

1. Open api/aiRoutes.js in GitHub Codespaces.
2. Locate the system message sent to OpenRouter.
3. Show the allowed collections, fields and query operations.
4. Explain that the system prompt instructs DeepSeek to return
   JSON with collection, operation and filter.
5. Return to ARC and show the generatedQuery JSON response.

Explain to the assessor:

"The system prompt tells DeepSeek which MongoDB collections,
fields and operations are allowed. DeepSeek returns structured
JSON according to that schema. The backend validates the
response before running the query."

### Additional demonstration questions

Use these one at a time in POST /ai/query:

   {"question":"How many orders are currently in the database?"}

   {"question":"How many products are in the database?"}

   {"question":"Show all products."}

Results depend on current MongoDB records.

### Evidence screenshots

Capture screenshots showing:

1. POST /auth/login — HTTP 200 (login successful).
2. POST /ai/query — question and HTTP 200 response.
3. The generatedQuery JSON and MongoDB result.
4. The system prompt in api/aiRoutes.js.
5. The products collection containing the AI-generated sample.
6. REST API CRUD requests and responses.

### Important distinction

LO6 demonstrates the AI generating a MongoDB query.

LO8 demonstrates the system prompt instructing an LLM to
produce structured JSON according to a defined schema.

Both learning outcomes use the existing POST /ai/query endpoint.
A website chatbot is not required by the assessment.
