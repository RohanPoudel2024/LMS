# Book Management System (BMS)

A comprehensive Book Management System built with NestJS, Prisma, and PostgreSQL. This system allows librarians to manage books, members, and book transactions efficiently.

## Features

- 🔐 **Authentication & Authorization** - JWT-based authentication system
- 📚 **Book Management** - Add, view, and manage books
- 👥 **Member Management** - Register and manage library members
- 📋 **Transaction Management** - Track book issues and returns
- 🛡️ **Role-based Access** - Librarian-specific access controls
- ✅ **Data Validation** - Input validation using class-validator
- 🗄️ **Database** - PostgreSQL with Prisma ORM

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

### Transaction
- id, issueDate, memberId, bookId, returnDate, returned
- Belongs to: Member, Book

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
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

## 🔐 Authentication Endpoints

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

**Error Response:**
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

## 👥 User Management Endpoints

### POST /user/adduser
Register a new librarian user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@library.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "book created successfully",
  "data": {
    "name": "Jane Smith",
    "email": "jane@library.com",
    "password": "$2b$10$..."
  }
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

## 📚 Book Management Endpoints
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

## 👤 Member Management Endpoints
**(Authentication Required)**

### POST /member/addMember
Add a new library member.

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

**Response:**
```json
{
  "message": "member created successfully",
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@email.com",
    "librarianId": 1,
    "createdAt": "2025-06-26T10:00:00.000Z"
  }
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

### PATCH /member/:id
Update member information.

**Request Body:**
```json
{
  "name": "Alice Smith",
  "email": "alice.smith@email.com"
}
```

### DELETE /member/:id
Delete a member.

**Test with cURL:**
```bash
curl -X DELETE http://localhost:3000/member/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📋 Transaction Management Endpoints
**(Authentication Required)**

### POST /transaction/add
Create a new book issue transaction.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "memberId": 1,
  "bookId": 1,
  "returnDate": "2025-07-26T10:00:00.000Z",
  "returned": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "memberId": 1,
    "bookId": 1,
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

### PATCH /transaction/:id
Update transaction (e.g., mark as returned).

**Request Body:**
```json
{
  "returned": true,
  "returnDate": "2025-06-26T15:00:00.000Z"
}
```

### DELETE /transaction/:id
Delete a transaction.

---

## 🧪 Testing the API

### 1. Using cURL

**Complete workflow example:**

```bash
# 1. Register a new librarian
curl -X POST http://localhost:3000/user/adduser \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Librarian",
    "email": "test@library.com",
    "password": "password123"
  }'

# 2. Login to get JWT token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@library.com",
    "password": "password123"
  }'

# 3. Add a book (replace YOUR_JWT_TOKEN with actual token)
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

## 🛠️ Development Scripts
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

## 📁 Project Structure

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

## 🔧 Error Handling

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

## 🔍 Validation Rules

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

## 🚀 Deployment

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run tests and ensure they pass
6. Submit a pull request

## 📝 License

This project is licensed under the UNLICENSED License.

## 🆘 Troubleshooting

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

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review error messages and logs

---

**Happy Coding! 🚀**
