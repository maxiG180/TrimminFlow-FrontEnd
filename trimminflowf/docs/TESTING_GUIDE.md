# TRIMMINFLOW Testing Guide

## Overview

This guide walks you through testing the TrimminFlow application from start to finish. **This guide is designed for learning** - each section explains not just WHAT to do, but WHY and HOW things work under the hood.

---

## Table of Contents

1. [Understanding the Architecture](#understanding-the-architecture)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Testing the Barbershop Registration Feature](#testing-the-barbershop-registration-feature)
5. [Understanding the Request Flow](#understanding-the-request-flow)
6. [Troubleshooting Common Issues](#troubleshooting-common-issues)
7. [Learning Resources](#learning-resources)
8. [Future Features to Test](#future-features-to-test)

---

## Understanding the Architecture

Before testing, it's important to understand how the pieces fit together.

### The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                    http://localhost:3000                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ 1. User fills form & clicks submit
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js/React)                    │
│                    Port: 3000                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /register page                                       │   │
│  │  - Renders BarbershopRegistrationForm.tsx            │   │
│  │  - Collects user input                               │   │
│  │  - Validates data client-side                        │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │ 2. Calls authApi.register()             │
│                   ▼                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  src/lib/api.ts                                       │   │
│  │  - Makes HTTP POST request                           │   │
│  │  - Sends JSON data to backend                        │   │
│  │  - URL: http://localhost:8080/api/v1/auth/register   │   │
│  └────────────────┬─────────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    │ 3. HTTP POST with JSON body
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Spring Boot/Java)                      │
│                    Port: 8080                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AuthController.java                                  │   │
│  │  - Receives HTTP request at /api/v1/auth/register    │   │
│  │  - Maps JSON to RegisterRequest DTO                  │   │
│  │  - Validates input                                    │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │ 4. Calls AuthService.register()         │
│                   ▼                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AuthService.java                                     │   │
│  │  - Business logic                                     │   │
│  │  - Hashes password (BCrypt)                          │   │
│  │  - Creates Barbershop entity                         │   │
│  │  - Creates User entity with OWNER role               │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   │ 5. Saves to database                    │
│                   ▼                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  BarbershopRepository & UserRepository                │   │
│  │  - JPA/Hibernate ORM                                  │   │
│  │  - Generates SQL INSERT statements                    │   │
│  └────────────────┬─────────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    │ 6. SQL INSERT commands
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                           │
│                    Port: 5432                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database: trimminflow                                │   │
│  │  ┌──────────────────┐  ┌───────────────────────┐     │   │
│  │  │ barbershop table │  │ users table           │     │   │
│  │  │ - id (UUID)      │  │ - id (UUID)           │     │   │
│  │  │ - name           │  │ - barbershop_id (FK)  │     │   │
│  │  │ - email          │  │ - email               │     │   │
│  │  │ - phone          │  │ - password_hash       │     │   │
│  │  │ - address        │  │ - role (OWNER)        │     │   │
│  │  │ - created_at     │  │ - first_name          │     │   │
│  │  └──────────────────┘  │ - last_name           │     │   │
│  │                        │ - created_at          │     │   │
│  │                        └───────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

**Frontend (Next.js/React):**
- **Purpose**: User interface and client-side logic
- **Why React**: Component-based architecture makes UI development modular and maintainable
- **Why Next.js**: Server-side rendering (SSR), routing, and optimizations out of the box
- **Port 3000**: Standard development port for Next.js

**Backend (Spring Boot/Java):**
- **Purpose**: Business logic, authentication, and data management
- **Why Spring Boot**: Enterprise-grade framework with built-in security, dependency injection, and database integration
- **Why Java**: Type-safe, performant, and widely used in enterprise applications
- **Port 8080**: Standard port for Spring Boot applications

**Database (PostgreSQL):**
- **Purpose**: Persistent data storage
- **Why PostgreSQL**: Robust, ACID-compliant, supports complex queries, JSON columns, and has excellent performance
- **Port 5432**: Standard PostgreSQL port

---

## Prerequisites

### What You Need Installed

1. **Java 17+** (for Spring Boot backend)
   - Check: `java -version`
   - Why: Spring Boot 3.x requires Java 17 minimum

2. **Node.js 18+** (for Next.js frontend)
   - Check: `node -v`
   - Why: Next.js 15 requires Node 18.18 or higher

3. **PostgreSQL** (database)
   - Check: `psql --version` or `docker ps` (if running in Docker)
   - Why: Your data needs to be stored somewhere persistent

4. **Gradle** (optional - included in backend project)
   - The backend includes Gradle wrapper (`gradlew.bat`)
   - Why: Gradle builds and runs the Spring Boot application

---

## Database Setup

### Option 1: PostgreSQL as Windows Service (Recommended)

**What is a Windows Service?**
A background process that starts automatically with Windows. You don't need to manually start it.

**How to Check if It's Running:**
```powershell
# PowerShell command to check if PostgreSQL service is running
Get-Service -Name postgresql*
```

**If it's running:**
- Status will be "Running"
- You don't need to do anything - it's already active!
- **You DO NOT need pgAdmin4 open** - pgAdmin is just a GUI tool for viewing/managing the database

**What pgAdmin4 Actually Does:**
- It's a visual interface (like File Explorer for your database)
- The database runs independently - pgAdmin just connects to it
- Think of it like: PostgreSQL is the engine, pgAdmin is the dashboard

### Option 2: PostgreSQL in Docker

**What is Docker?**
A containerization platform that packages applications with their dependencies.

**Why Docker?**
- Isolated environment
- Easy to start/stop
- No conflicts with other software

**Check if Docker Container is Running:**
```bash
docker ps
# Look for a container with "postgres" in the IMAGE column
```

**If Not Running, Start It:**

**Using docker-compose (if you have docker-compose.yml):**
```bash
cd "C:\Users\Maxi G\Documents\GitHub\TrimminFlow-Backend\demo"
docker-compose up -d
# -d means "detached mode" - runs in background
```

**Using docker start (if container already exists):**
```bash
docker start <container-name-or-id>
```

**Create New Container (if needed):**
```bash
docker run --name trimminflow-postgres \
  -e POSTGRES_DB=trimminflow \
  -e POSTGRES_USER=trimminflow_user \
  -e POSTGRES_PASSWORD=mx269518 \
  -p 5432:5432 \
  -d postgres:15
```

### Verify Database Connection

**Method 1: Using psql (Command Line):**
```bash
psql -h localhost -U trimminflow_user -d trimminflow
# If it connects, you're good!
# Type \q to quit
```

**Method 2: Using PowerShell (Network Test):**
```powershell
Test-NetConnection -ComputerName localhost -Port 5432
# If TcpTestSucceeded is True, PostgreSQL is listening
```

**Method 3: Using pgAdmin4 (Visual):**
- Open pgAdmin4
- Right-click on server → Connect
- If it connects, database is ready

### Database Configuration (What the Backend Expects)

The backend looks for these settings (from `application.properties`):

```properties
Database Name: trimminflow
Username: trimminflow_user
Password: mx269518
Host: localhost
Port: 5432
```

**How Spring Boot Connects:**
1. Spring Boot reads `application.properties` at startup
2. Uses JDBC (Java Database Connectivity) to connect to PostgreSQL
3. Hibernate (JPA implementation) automatically creates tables based on your Java entity classes
4. Property `spring.jpa.hibernate.ddl-auto=update` means:
   - On startup, Hibernate checks if tables exist
   - If not, it creates them
   - If they exist, it updates them to match your entity classes

---

## Testing the Barbershop Registration Feature

### Step 1: Start the Database

**If Windows Service:**
- Nothing to do - it's already running!

**If Docker:**
```bash
docker start trimminflow-postgres
# Or using docker-compose:
cd "C:\Users\Maxi G\Documents\GitHub\TrimminFlow-Backend\demo"
docker-compose up -d
```

### Step 2: Start the Backend

**Navigate to Backend Directory:**
```bash
cd "C:\Users\Maxi G\Documents\GitHub\TrimminFlow-Backend\demo"
```

**Start Spring Boot Application:**
```bash
# Windows:
gradlew.bat bootRun

# Mac/Linux:
./gradlew bootRun
```

**What Happens When Backend Starts:**

1. **Gradle compiles your Java code**
   - Converts `.java` files to `.class` bytecode
   - Packages everything into a runnable application

2. **Spring Boot initializes**
   - Loads `application.properties`
   - Connects to PostgreSQL database
   - Scans for `@Component`, `@Service`, `@Controller` annotations
   - Sets up dependency injection container

3. **Hibernate/JPA creates database tables**
   - Reads your `@Entity` classes (Barbershop.java, User.java)
   - Generates SQL CREATE TABLE statements
   - Executes them on PostgreSQL

4. **Tomcat web server starts**
   - Embedded Tomcat server (comes with Spring Boot)
   - Listens on port 8080
   - Ready to handle HTTP requests

**You Should See:**
```
Started DemoApplication in X.XXX seconds
```

**Backend is now running at:** `http://localhost:8080`

**Test Backend Health:**
```bash
# Open browser or use curl:
curl http://localhost:8080/api/v1/health
# Should return: {"status": "UP"}
```

### Step 3: Start the Frontend

**Open a NEW terminal** (keep backend running in the other terminal)

**Navigate to Frontend Directory:**
```bash
cd "C:\Users\Maxi G\Documents\GitHub\TrimminFlow-FrontEnd\trimminflowf"
```

**Start Next.js Development Server:**
```bash
npm run dev
```

**What Happens When Frontend Starts:**

1. **Next.js compiles your code**
   - TypeScript → JavaScript
   - Tailwind CSS → Optimized CSS
   - React components → Renderable HTML

2. **Development server starts**
   - Watches files for changes (hot reload)
   - Serves your application at port 3000
   - Enables React Fast Refresh

**You Should See:**
```
  ▲ Next.js 15.5.3
  - Local:        http://localhost:3000
  - Ready in 2.1s
```

**Frontend is now running at:** `http://localhost:3000`

### Step 4: Test the Registration Feature

**Open Your Browser:**
```
http://localhost:3000/register
```

**Fill Out the Registration Form:**

```
Barbershop Name: Classic Cuts Barbershop
Email: owner@classiccuts.com
Password: SecurePassword123
First Name: John
Last Name: Doe
Phone: +351 912 345 678 (optional)
Address: Rua Augusta 123, Lisbon (optional)
```

**Click "Create Account"**

### Step 5: What Happens When You Submit?

**Frontend Flow (Browser → Backend):**

1. **Form Submission** (`BarbershopRegistrationForm.tsx`)
   ```typescript
   const handleSubmit = async (e) => {
     e.preventDefault(); // Prevents page reload

     const formData = {
       barbershopName: 'Classic Cuts',
       email: 'owner@classiccuts.com',
       password: 'SecurePassword123',
       firstName: 'John',
       lastName: 'Doe',
       // ... other fields
     };

     const result = await authApi.register(formData);
   }
   ```

2. **API Call** (`src/lib/api.ts`)
   ```typescript
   export const authApi = {
     register: async (data: RegisterRequest) => {
       const response = await fetch('http://localhost:8080/api/v1/auth/register', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
       });

       return response.json();
     }
   };
   ```

3. **HTTP Request Sent**
   ```http
   POST http://localhost:8080/api/v1/auth/register HTTP/1.1
   Content-Type: application/json

   {
     "barbershopName": "Classic Cuts Barbershop",
     "email": "owner@classiccuts.com",
     "password": "SecurePassword123",
     "firstName": "John",
     "lastName": "Doe",
     "phone": "+351 912 345 678",
     "address": "Rua Augusta 123, Lisbon"
   }
   ```

**Backend Flow (Request Processing):**

1. **Controller Receives Request** (`AuthController.java`)
   ```java
   @PostMapping("/register")
   public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
       // Spring automatically converts JSON to RegisterRequest object
       RegisterResponse response = authService.register(request);
       return ResponseEntity.ok(response);
   }
   ```

2. **Service Processes Business Logic** (`AuthService.java`)
   ```java
   public RegisterResponse register(RegisterRequest request) {
       // 1. Create Barbershop entity
       Barbershop barbershop = new Barbershop();
       barbershop.setName(request.getBarbershopName());
       barbershop.setEmail(request.getEmail());
       barbershop.setPhone(request.getPhone());
       barbershop.setAddress(request.getAddress());

       // 2. Save barbershop to database
       barbershop = barbershopRepository.save(barbershop);

       // 3. Hash password using BCrypt
       String hashedPassword = passwordEncoder.encode(request.getPassword());

       // 4. Create User entity
       User user = new User();
       user.setBarbershopId(barbershop.getId());
       user.setEmail(request.getEmail());
       user.setPasswordHash(hashedPassword);
       user.setFirstName(request.getFirstName());
       user.setLastName(request.getLastName());
       user.setRole(UserRole.OWNER);

       // 5. Save user to database
       user = userRepository.save(user);

       // 6. Return response
       return new RegisterResponse(
           user.getId(),
           barbershop.getId(),
           user.getEmail(),
           "Registration successful"
       );
   }
   ```

3. **Database Operations** (PostgreSQL)
   ```sql
   -- Hibernate generates and executes these SQL statements:

   INSERT INTO barbershop (id, name, email, phone, address, created_at, updated_at)
   VALUES (
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'Classic Cuts Barbershop',
     'owner@classiccuts.com',
     '+351 912 345 678',
     'Rua Augusta 123, Lisbon',
     NOW(),
     NOW()
   );

   INSERT INTO users (id, barbershop_id, email, password_hash, first_name, last_name, role, created_at, updated_at)
   VALUES (
     'b2c3d4e5-f6a7-8901-bcde-f12345678901',
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
     'owner@classiccuts.com',
     '$2a$10$hashed_password_here',
     'John',
     'Doe',
     'OWNER',
     NOW(),
     NOW()
   );
   ```

4. **Response Sent Back to Frontend**
   ```json
   {
     "userId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
     "barbershopId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
     "email": "owner@classiccuts.com",
     "message": "Registration successful"
   }
   ```

5. **Frontend Displays Success**
   - Shows success message to user
   - Can redirect to dashboard or login page

---

## Understanding the Request Flow

### What is REST API?

**REST (Representational State Transfer)** is an architectural style for APIs.

**Key Concepts:**

- **Resources**: Things your app manages (barbershops, users, appointments)
- **HTTP Methods**:
  - `GET` - Read data
  - `POST` - Create new data
  - `PUT` - Update existing data
  - `DELETE` - Remove data
- **Status Codes**:
  - `200 OK` - Success
  - `201 Created` - Resource created
  - `400 Bad Request` - Invalid data
  - `404 Not Found` - Resource doesn't exist
  - `500 Internal Server Error` - Server error

### What is JSON?

**JSON (JavaScript Object Notation)** is a data format.

```json
{
  "barbershopName": "Classic Cuts",
  "email": "owner@example.com"
}
```

**Why JSON?**
- Human-readable
- Language-agnostic (works with Java, JavaScript, Python, etc.)
- Lightweight
- Easy to parse

### How Frontend Talks to Backend

**CORS (Cross-Origin Resource Sharing):**

Your frontend (localhost:3000) talks to backend (localhost:8080) - different ports = different origins.

**Backend CORS Configuration** (`application.properties`):
```properties
cors.allowed.origins=http://localhost:3000
```

This tells the backend:
- "It's okay for localhost:3000 to send requests to me"
- Without this, browsers block the request for security

### Authentication (Future Feature)

**Current State:**
- Registration works, but no login/authentication yet

**How JWT Authentication Will Work:**

1. User registers → Account created
2. User logs in → Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token (localStorage/cookies)
5. Future requests include token in header
6. Backend validates token before processing request

**JWT (JSON Web Token) Structure:**
```
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0In0.signature_here
```

---

## Troubleshooting Common Issues

### Issue 1: Backend Won't Start

**Error: "Could not connect to database"**

**Cause:** PostgreSQL is not running or wrong credentials

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows Service:
   Get-Service -Name postgresql*

   # Docker:
   docker ps
   ```

2. Verify credentials in `application.properties` match your PostgreSQL setup

3. Test connection manually:
   ```bash
   psql -h localhost -U trimminflow_user -d trimminflow
   ```

**Error: "Port 8080 already in use"**

**Cause:** Another application is using port 8080

**Solution:**
1. Find what's using port 8080:
   ```powershell
   netstat -ano | findstr :8080
   ```

2. Kill the process or change Spring Boot port:
   ```properties
   # In application.properties:
   server.port=8081
   ```

### Issue 2: Frontend Won't Start

**Error: "Port 3000 already in use"**

**Solution:**
```bash
# Kill process on port 3000:
npx kill-port 3000

# Or use different port:
npm run dev -- -p 3001
```

**Error: "Module not found" or "Cannot find package"**

**Solution:**
```bash
# Delete node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Registration Returns Error

**Error 400: "Email already exists"**

**Cause:** Email must be unique in database

**Solution:**
- Use a different email
- Or delete the existing record:
  ```sql
  DELETE FROM users WHERE email = 'owner@classiccuts.com';
  DELETE FROM barbershop WHERE email = 'owner@classiccuts.com';
  ```

**Error 500: "Internal Server Error"**

**Cause:** Backend crash - check backend logs

**Solution:**
1. Look at terminal where backend is running
2. Find stack trace (error details)
3. Common causes:
   - Database constraint violation
   - Missing required field
   - Type mismatch

**Error: CORS Policy Block**

**Error in browser console:**
```
Access to fetch at 'http://localhost:8080/api/v1/auth/register'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Cause:** Backend not allowing requests from frontend

**Solution:**
Check `application.properties`:
```properties
cors.allowed.origins=http://localhost:3000
```

Make sure `SecurityConfig.java` has CORS enabled:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    // ...
}
```

### Issue 4: Database Connection Issues

**Error: "FATAL: password authentication failed"**

**Solution:**
- Check username/password in `application.properties`
- Match with PostgreSQL user credentials

**Error: "FATAL: database 'trimminflow' does not exist"**

**Solution:**
Create database:
```sql
CREATE DATABASE trimminflow;
```

Or using psql:
```bash
createdb -U trimminflow_user trimminflow
```

---

## Verifying Everything Works

### Check 1: Database Records

**Using pgAdmin4:**
1. Open pgAdmin4
2. Navigate to: Servers → PostgreSQL → Databases → trimminflow → Schemas → public → Tables
3. Right-click `barbershop` → View/Edit Data → All Rows
4. You should see your new barbershop record

**Using psql:**
```sql
psql -h localhost -U trimminflow_user -d trimminflow

-- Check barbershop record:
SELECT * FROM barbershop;

-- Check user record:
SELECT * FROM users;

-- See the relationship:
SELECT
  b.name AS barbershop_name,
  u.email AS owner_email,
  u.first_name || ' ' || u.last_name AS owner_name
FROM barbershop b
JOIN users u ON u.barbershop_id = b.id;
```

### Check 2: API Response

**Expected Success Response:**
```json
{
  "userId": "uuid-here",
  "barbershopId": "uuid-here",
  "email": "owner@classiccuts.com",
  "message": "Registration successful"
}
```

**HTTP Status:** 200 OK or 201 Created

### Check 3: Browser DevTools

**Open Browser Developer Tools:**
- Press F12
- Go to "Network" tab
- Submit the form
- Click on the request to `/api/v1/auth/register`

**Check Request:**
- Method: POST
- Status: 200
- Request Payload: Your form data
- Response: Success message with IDs

---

## Learning Resources

### Understanding the Tech Stack

**Next.js / React:**
- [Next.js Official Tutorial](https://nextjs.org/learn)
- [React Docs](https://react.dev/learn)
- **What to learn**: Component lifecycle, hooks (useState, useEffect), routing

**Spring Boot / Java:**
- [Spring Boot Getting Started](https://spring.io/guides/gs/spring-boot/)
- [Baeldung Spring Boot](https://www.baeldung.com/spring-boot)
- **What to learn**: Dependency injection, annotations, JPA/Hibernate

**PostgreSQL:**
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- **What to learn**: SQL basics, relationships, indexes

**REST APIs:**
- [REST API Tutorial](https://restfulapi.net/)
- **What to learn**: HTTP methods, status codes, JSON

### Key Concepts to Master

1. **Client-Server Architecture**
   - Frontend = Client (what user sees)
   - Backend = Server (business logic)
   - Database = Persistent storage

2. **HTTP Request/Response Cycle**
   - User action → Frontend sends request → Backend processes → Database stores → Response sent back → Frontend updates UI

3. **Data Flow**
   - User Input (Form) → TypeScript Object → JSON → HTTP Request → Java Object → JPA Entity → SQL → Database

4. **Environment Setup**
   - Development vs Production
   - Port management
   - Environment variables

---

## Future Features to Test

### Once Backend is Fully Implemented:

1. **User Login**
   - Test: POST to `/api/v1/auth/login`
   - Should return JWT token

2. **Get Barbershop Details**
   - Test: GET to `/api/v1/barbershops/{id}`
   - Should return barbershop data

3. **Update Barbershop**
   - Test: PUT to `/api/v1/barbershops/{id}`
   - Should update database

4. **Create Barber**
   - Test: POST to `/api/v1/barbers`
   - Should create barber associated with barbershop

5. **Create Appointment**
   - Test: POST to `/api/v1/appointments`
   - Should create booking with customer, barber, service

6. **Payment Processing**
   - Test: POST to `/api/v1/payments`
   - Integration with Stripe API

---

## Quick Reference

### Start Everything (Order Matters!)

```bash
# 1. Start Database (if Docker):
docker start trimminflow-postgres

# 2. Start Backend:
cd "C:\Users\Maxi G\Documents\GitHub\TrimminFlow-Backend\demo"
gradlew.bat bootRun

# 3. Start Frontend (new terminal):
cd "C:\Users\Maxi G\Documents\GitHub\TrimminFlow-FrontEnd\trimminflowf"
npm run dev

# 4. Open Browser:
http://localhost:3000/register
```

### Key URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **Health Check**: http://localhost:8080/api/v1/health
- **Swagger UI**: http://localhost:8080/swagger-ui.html (if enabled)

### Database Connection

```bash
# Command Line:
psql -h localhost -U trimminflow_user -d trimminflow

# Connection String:
postgresql://trimminflow_user:mx269518@localhost:5432/trimminflow
```

### Check if Services are Running

```bash
# PostgreSQL:
Test-NetConnection -ComputerName localhost -Port 5432

# Backend:
curl http://localhost:8080/api/v1/health

# Frontend:
curl http://localhost:3000
```

---

## Summary

**The Complete Flow:**

1. Start PostgreSQL (database)
2. Start Spring Boot backend (API server)
3. Start Next.js frontend (user interface)
4. Navigate to registration page
5. Fill form and submit
6. Frontend sends JSON to backend
7. Backend validates, hashes password, creates entities
8. Backend saves to PostgreSQL
9. Backend returns success response
10. Frontend shows success message

**You've successfully tested:**
- Full-stack application startup
- Database connectivity
- HTTP request/response cycle
- Data persistence
- Frontend-backend integration

**Next Steps:**
- Implement login feature
- Add authentication to protected routes
- Build out remaining CRUD operations
- Add real-time features

---

**Remember:** Learning full-stack development is a journey. Don't worry if things don't work perfectly the first time - troubleshooting is part of the learning process!
