# Library Management System (LMS)

A comprehensive Library Management System built with NestJS, Prisma, and PostgreSQL. This system allows librarians to manage books, members, and book transactions efficiently.

## Features

- <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg> **Authentication & Authorization** - JWT-based authentication system
- <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> **Book Management** - Add, view, and manage books
- <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> **Member Management** - Register and manage library members with per-librarian uniqueness
- <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h2m4-6a4 4 0 1 1 8 0v6a2 2 0 0 1-2 2h-5"/><path d="M9 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg> **Transaction Management** - Track book issues and returns with auto return dates
- <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg> **Role-based Access** - Librarian-specific access controls
- <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg> **Data Validation** - Input validation using class-validator
- <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M8 8h8v8H8z"/></svg> **Database** - PostgreSQL with Prisma ORM

## Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: class-validator
- **Language**: TypeScript

## Database Schema

### User (Librarian)
- id, name, email, password, createdAt
- Has many: books, members

### Book
- id, title, author, publishedYear, available, createdAt, userId
- Belongs to: User (librarian)
- Has many: transactions

### Member
- id, name, email, createdAt, librarianId
- Belongs to: User (librarian)
- Has many: transactions
- **Email uniqueness**: Per-librarian (same email can exist across different librarians)

### Transaction
- id, issueDate, memberId, bookId, returnDate, returned
- Belongs to: Member, Book
- **Auto return date**: 14 days from issue date (configurable)

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/RohanPoudel2024/LMS.git
cd bms
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/bms_db"
JWT_SECRET="your-super-secret-jwt-key"
```

4. **Database Setup**
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

5. **Start the application**
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The server will start on `http://localhost:3000`

## <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg> Key Business Rules

### Member Management
- **Per-Librarian Uniqueness**: Each librarian can have unique member emails in their list
- **Cross-Librarian Flexibility**: Same email can be registered across different librarians
- **Example**: Librarian A and Librarian B can both have a member with email "john@example.com"

### User (Librarian) Management
- **Global Email Uniqueness**: Librarian emails must be unique across the entire system
- **Secure Authentication**: Passwords are hashed using bcrypt
- **JWT-based Sessions**: Authentication tokens for secure API access

### Transaction Management
- **Auto Return Date**: Books automatically get a return date of 14 days from issue
- **Borrowing Limit**: Each member can borrow up to 5 books simultaneously
- **Real-time Tracking**: Dynamic calculation of remaining days until return
- **Validation**: Ensures book and member belong to the same librarian

### Book Management
- **Librarian-Specific**: Each librarian manages their own book inventory
- **Availability Tracking**: Books can be marked as available/unavailable
- **Comprehensive Details**: Title, author, publication year tracking

## API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Required
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg> Authentication Endpoints

### POST /auth/login
Login with email and password to get JWT token.

**Request Body:**
```json
{
  "email": "librarian@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "User authenticated successfully",
  "statusCode": 200,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "librarian@example.com",
    "createdAt": "2025-06-26T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "User not registered. Please sign up first.",
  "statusCode": 401
}
```

```json
{
  "success": false,
  "message": "Invalid password",
  "statusCode": 401
}
```

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "librarian@example.com",
    "password": "password123"
  }'
```

---

## <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> User Management Endpoints

### POST /user/adduser
Register a new librarian user. **Note**: Email must be globally unique for librarians.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@library.com",
  "password": "securepassword"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "statusCode": 201,
  "data": {
    "name": "Jane Smith",
    "email": "jane@library.com",
    "password": "$2b$10$..."
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Email already exists",
  "statusCode": 400
}
```

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/user/adduser \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@library.com",
    "password": "securepassword"
  }'
```

### GET /user
Get all users (librarians).

**Response:**
```json
[
  {
    "name": "John Doe",
    "email": "john@library.com",
    "password": "$2b$10$..."
  }
]
```

**Test with cURL:**
```bash
curl -X GET http://localhost:3000/user
```

---

## <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Book Management Endpoints
**(Authentication Required)**

### POST /book/addBook
Add a new book to the library.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "publishedYear": 1925,
  "available": true
}
```

**Response:**
```json
{
  "message": "book Created successfully",
  "data": {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publishedYear": 1925,
    "available": true,
    "userId": 1
  }
}
```

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/book/addBook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publishedYear": 1925,
    "available": true
  }'
```

### GET /book
Get all books for the authenticated librarian.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publishedYear": 1925,
    "available": true,
    "userId": 1,
    "createdAt": "2025-06-26T10:00:00.000Z"
  }
]
```

**Test with cURL:**
```bash
curl -X GET http://localhost:3000/book \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Member Management Endpoints
**(Authentication Required)**

### POST /member/addMember
Add a new library member. **Note**: Email must be unique per librarian, but same email can exist across different librarians.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@email.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Member created successfully",
  "statusCode": 201,
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@email.com",
    "librarianId": 1,
    "createdAt": "2025-06-26T10:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Member with email alice@email.com already exists in your member list",
  "error": "Bad Request"
}
```

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/member/addMember \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@email.com"
  }'
```

### GET /member
Get all members for the authenticated librarian.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "name": "Alice Johnson",
    "email": "alice@email.com",
    "librarianId": 1
  }
]
```

### GET /member/:id
Get a specific member by ID.

**Test with cURL:**
```bash
curl -X GET http://localhost:3000/member/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### DELETE /member/:id
Delete a member.

**Test with cURL:**
```bash
curl -X DELETE http://localhost:3000/member/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h2m4-6a4 4 0 1 1 8 0v6a2 2 0 0 1-2 2h-5"/><path d="M9 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg> Transaction Management Endpoints
**(Authentication Required)**

### POST /transaction/add
Create a new book issue transaction. **Auto Return Date**: If no return date is provided, it will be automatically set to 14 days from issue date.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body (with custom return date):**
```json
{
  "memberId": 1,
  "bookId": 1,
  "returnDate": "2025-07-26T10:00:00.000Z",
  "returned": false
}
```

**Request Body (auto return date):**
```json
{
  "memberId": 1,
  "bookId": 1
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "statusCode": 201,
  "data": {
    "id": 1,
    "memberId": 1,
    "bookId": 1,
    "issueDate": "2025-06-26T10:00:00.000Z",
    "returnDate": "2025-07-10T10:00:00.000Z",
    "returned": false,
    "remainingDays": 14,
    "member": {
      "name": "Alice Johnson",
      "email": "alice@email.com"
    },
    "book": {
      "title": "Sample Book",
      "author": "Sample Author"
    }
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Member has already borrowed 5 books",
  "statusCode": 400
}
```

```json
{
  "success": false,
  "message": "Book not found",
  "statusCode": 404
}
```
    "issueDate": "2025-06-26T10:00:00.000Z",
    "returnDate": "2025-07-26T10:00:00.000Z",
    "returned": false
  }
}
```

**Test with cURL:**
```bash
curl -X POST http://localhost:3000/transaction/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "memberId": 1,
    "bookId": 1,
    "returnDate": "2025-07-26T10:00:00.000Z",
    "returned": false
  }'
```

### GET /transaction
Get all transactions for the authenticated librarian.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "memberId": 1,
    "bookId": 1,
    "issueDate": "2025-06-26T10:00:00.000Z",
    "returnDate": "2025-07-26T10:00:00.000Z",
    "returned": false
  }
]
```

### GET /transaction/:id
Get a specific transaction by ID.

### DELETE /transaction/:id
Delete a transaction.

---

## <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg> Testing the API

### 1. Using cURL

**Complete workflow example demonstrating per-librarian member uniqueness:**

```bash
# 1. Register first librarian
curl -X POST http://localhost:3000/user/adduser \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Librarian A",
    "email": "librarianA@library.com",
    "password": "password123"
  }'

# 2. Register second librarian
curl -X POST http://localhost:3000/user/adduser \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Librarian B", 
    "email": "librarianB@library.com",
    "password": "password123"
  }'

# 3. Login as Librarian A
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "librarianA@library.com",
    "password": "password123"
  }'
# Save the token as LIBRARIAN_A_TOKEN

# 4. Login as Librarian B  
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "librarianB@library.com",
    "password": "password123"
  }'
# Save the token as LIBRARIAN_B_TOKEN

# 5. Librarian A adds a book
curl -X POST http://localhost:3000/book/addBook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer LIBRARIAN_A_TOKEN" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "publishedYear": 1949,
    "available": true
  }'

# 6. Librarian A adds a member
curl -X POST http://localhost:3000/member/addMember \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer LIBRARIAN_A_TOKEN" \
  -d '{
    "name": "John Reader",
    "email": "john@example.com"
  }'

# 7. Librarian B adds the SAME member (different librarian, allowed)
curl -X POST http://localhost:3000/member/addMember \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer LIBRARIAN_B_TOKEN" \
  -d '{
    "name": "John Reader",
    "email": "john@example.com"
  }'

# 8. Librarian A tries to add the same member again (should fail)
curl -X POST http://localhost:3000/member/addMember \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer LIBRARIAN_A_TOKEN" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com"
  }'

# 9. Create transaction with auto return date (14 days)
curl -X POST http://localhost:3000/transaction/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer LIBRARIAN_A_TOKEN" \
  -d '{
    "memberId": 1,
    "bookId": 1
  }'
curl -X POST http://localhost:3000/book/addBook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "publishedYear": 1949,
    "available": true
  }'

# 4. Add a member
curl -X POST http://localhost:3000/member/addMember \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Reader",
    "email": "john.reader@email.com"
  }'

# 5. Create a transaction (issue book)
curl -X POST http://localhost:3000/transaction/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "memberId": 1,
    "bookId": 1
  }'
```

### 2. Using Postman

1. **Create a new collection** called "BMS API"
2. **Set up environment variables:**
   - `baseUrl`: `http://localhost:3000`
   - `authToken`: (will be set after login)

3. **Authentication Setup:**
   - Add a POST request: `{{baseUrl}}/auth/login`
   - In Tests tab, add:
   ```javascript
   if (pm.response.code === 200) {
       const response = pm.response.json();
       pm.environment.set("authToken", response.accessToken);
   }
   ```

4. **For protected endpoints:**
   - Add to Headers: `Authorization: Bearer {{authToken}}`

### 3. Using Insomnia/Thunder Client

Similar setup as Postman, with environment variables and automatic token management.

### 4. Using JavaScript/Fetch

```javascript
// Login and get token
const loginResponse = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@library.com',
    password: 'password123'
  })
});

const { accessToken } = await loginResponse.json();

// Use token for authenticated requests
const booksResponse = await fetch('http://localhost:3000/book', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

const books = await booksResponse.json();
```

---

## Development Scripts
```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start with debugging

# Production
npm run build             # Build the application
npm run start:prod        # Start production server

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run end-to-end tests

# Database
npm run prisma:generate   # Generate Prisma client
npx prisma migrate dev    # Run migrations
npx prisma studio         # Open Prisma Studio

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

---

## <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Unique Features

### <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Per-Librarian Member Uniqueness
- **Flexible Member Management**: Same person can register with multiple librarians
- **Scoped Validation**: Email uniqueness enforced per librarian, not globally
- **Real-world Application**: Supports libraries with multiple branches/librarians

### <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg> Smart Transaction Management
- **Auto Return Dates**: 14-day automatic return period calculation
- **Dynamic Remaining Days**: Real-time calculation of days until due
- **Borrowing Limits**: 5-book limit per member with validation
- **Overdue Detection**: Built-in support for overdue transaction tracking

### <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg> Enhanced Error Handling
- **Proper HTTP Status Codes**: Accurate status codes for all responses
- **Detailed Error Messages**: Clear, actionable error descriptions
- **NestJS Exception Handling**: Built-in BadRequest and Internal Server exceptions
- **Consistent Response Format**: Standardized success/error response structure

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   ├── jwt.strategy.ts
│   └── dto/
├── book/                 # Book management module
│   ├── book.controller.ts
│   ├── book.service.ts
│   └── dto/
├── member/               # Member management module
│   ├── member.controller.ts
│   ├── member.service.ts
│   └── dto/
├── transaction/          # Transaction module
│   ├── transaction.controller.ts
│   ├── transaction.service.ts
│   └── dto/
├── user/                 # User management module
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── dto/
├── app.module.ts         # Main application module
└── main.ts              # Application entry point

prisma/
├── schema.prisma         # Database schema
└── migrations/           # Database migrations
```

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Validation Rules

### User Registration
- `name`: Required string
- `email`: Required valid email format
- `password`: Required string

### Book Creation
- `title`: Required string
- `author`: Required string
- `publishedYear`: Required integer
- `available`: Required boolean

### Member Registration
- `name`: Required string
- `email`: Required valid email format

### Transaction Creation
- `memberId`: Required integer
- `bookId`: Required integer
- `returnDate`: Optional date string
- `returned`: Optional boolean

## Deployment

### Using Docker

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```

2. **Create docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/bms_db
      - JWT_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=bms_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. **Run with Docker:**
```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run tests and ensure they pass
6. Submit a pull request

## 📝 License

This project is licensed under the UNLICENSED License.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your DATABASE_URL in .env file
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **JWT Token Error**
   - Check JWT_SECRET in .env file
   - Ensure token is included in Authorization header
   - Verify token format: `Bearer <token>`

3. **Validation Errors**
   - Check request body format
   - Ensure all required fields are provided
   - Verify data types match schema

4. **Port Already in Use**
   - Change port in main.ts
   - Kill process using the port: `npx kill-port 3000`

### Debug Mode

Run in debug mode to get detailed error logs:
```bash
npm run start:debug
```

## Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review error messages and logs

---

**Happy Coding! 🚀**
