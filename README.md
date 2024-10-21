# Simple CRUD API

This project is a simple CRUD API built using Node.js (version 22.x.x) and TypeScript. It uses an in-memory database to manage users and provides endpoints to create, read, update, and delete users. The API supports horizontal scaling using a load balancer, and is fully compatible with Postman for testing purposes.

## Features

- **CRUD API for Users**:
  - `GET /api/users`: Retrieve all users.
  - `GET /api/users/{userId}`: Retrieve a user by ID.
  - `POST /api/users`: Create a new user.
  - `PUT /api/users/{userId}`: Update a user by ID.
  - `DELETE /api/users/{userId}`: Delete a user by ID.
- **Error Handling**: Proper handling of invalid UUIDs, non-existent records, and server-side errors.
- **Environment Variables**: Port configuration stored in `.env` file.
- **Horizontal Scaling**: The application can be scaled with multiple workers using the Node.js Cluster API and a load balancer.
- **Tests**: Six test scenarios for the API endpoints.

## Installation and Setup

### Prerequisites

- Node.js version 22.9.0 or higher
- npm

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/crud-api.git
   cd crud-api
   ```

## 2. Install dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### 3. Run the application

#### Development mode

To start the application in development mode (with `nodemon` or `ts-node-dev`), run the following command:

```bash
npm run start:dev
```

## Production mode

To build and start the application in production mode, run the following commands:

```bash
npm run start:prod
```

### 4. Horizontal Scaling (optional)

To run the application with horizontal scaling and load balancing, use the following command:

```bash
npm run start:multi
```

This will start a load balancer on localhost:4000 and worker instances on ports 4001, 4002, and so on.

## API Documentation

### Base URL

Development: http://localhost:4000

### Endpoints

#### 1. GET `/api/users`

Retrieves all users.

- **Response:** 200 OK

**Example response:**

```
[ { "id": "uuid", "username": "John Doe", "age": 25, "hobbies": ["reading", "swimming"] } ]
```

#### 2. GET `/api/users/{userId}`

Retrieves a user by their unique id.

- **Response:** 200 OK
- **Error Responses:**
  - 400 Bad Request: Invalid UUID.
  - 404 Not Found: User with the given id does not exist.

#### 3. POST `/api/users`

Creates a new user. The request body must contain `username`, `age`, and `hobbies`.

- **Request Body:**

```
{ "username": "John Doe", "age": 25, "hobbies": ["reading", "swimming"] }
```

- **Response:** 201 Created
- **Error Responses:**
  - 400 Bad Request: Missing or invalid fields.

#### 4. PUT `/api/users/{userId}`

Updates an existing user by id.

- **Request Body:**

```
{ "username": "John Smith", "age": 26, "hobbies": ["traveling"] }
```

- **Response:** 200 OK
- **Error Responses:**
  - 400 Bad Request: Invalid UUID or missing fields.
  - 404 Not Found: User with the given id does not exist.

#### 5. DELETE `/api/users/{userId}`

Deletes a user by id.

- **Response:** 204 No Content
- **Error Responses:**
  - 400 Bad Request: Invalid UUID.
  - 404 Not Found: User with the given id does not exist.

### Running Tests

The project includes tests for basic API functionality. To run the tests:

```bash
npm test
```

### Load Balancer Setup

The load balancer distributes requests across multiple workers in a round-robin fashion. To start the application with horizontal scaling:

```bash
npm run start:multi
```

The load balancer will listen on localhost:4000, and worker instances will be on ports 4001, 4002, etc.
