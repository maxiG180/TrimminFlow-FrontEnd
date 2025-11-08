# Service Management Implementation Guide

## Overview

This guide explains how the Service Management feature works in TrimminFlow, covering both backend and frontend implementations. This is **Phase 2: Core Setup** - allowing barbershop owners to manage their services (haircuts, beard trims, etc.).

---

## Table of Contents

1. [What is a Service?](#what-is-a-service)
2. [Database Structure](#database-structure)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Complete Data Flow](#complete-data-flow)
6. [Testing Guide](#testing-guide)
7. [Common Patterns Explained](#common-patterns-explained)

---

## What is a Service?

A **Service** represents something a barbershop offers to customers, like:
- Haircut (€15, 30 minutes)
- Beard Trim (€10, 15 minutes)
- Hair Coloring (€50, 60 minutes)

### Service Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| id | UUID | Unique identifier | `123e4567-...` |
| barbershopId | UUID | Which barbershop owns this | `456e7890-...` |
| name | String | Service name | "Haircut" |
| description | String | Optional details | "Professional cut" |
| price | Decimal | Cost in euros | 15.00 |
| durationMinutes | Integer | How long it takes | 30 |
| isActive | Boolean | Is it available? | true/false |
| createdAt | DateTime | When created | 2025-11-07... |
| updatedAt | DateTime | Last updated | 2025-11-07... |

---

## Database Structure

### The `services` Table

```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barbershop_id UUID NOT NULL REFERENCES barbershop(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Key Points:

1. **Primary Key**: `id` - UUID for global uniqueness
2. **Foreign Key**: `barbershop_id` - Links to barbershop table
3. **Price**: `DECIMAL(10, 2)` - Stores money accurately (no floating point errors)
4. **Soft Delete**: `is_active` - Don't delete, just mark as inactive

### Why UUID instead of Integer ID?

```
❌ Integer IDs:
- Predictable: /services/1, /services/2, /services/3
- Security risk: Easy to guess other services
- Limited: Only 2.1 billion possible values

✅ UUID:
- Unpredictable: /services/123e4567-e89b-12d3-a456-426614174000
- Secure: Impossible to guess
- Unlimited: 340 undecillion possible values
- Distributed: Can generate offline, no conflicts
```

---

## Backend Architecture

### Layer Architecture

```
┌─────────────────────────────────────────────────┐
│              CLIENT REQUEST                      │
│    POST /api/v1/services                        │
│    Authorization: Bearer <JWT>                   │
│    X-Barbershop-Id: <UUID>                      │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         JWT AUTHENTICATION FILTER                │
│  - Validates JWT token                          │
│  - Extracts user info                           │
│  - Sets Spring Security context                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          CONTROLLER LAYER                        │
│  ServiceController.java                         │
│  - Receives HTTP request                        │
│  - Validates input (Jakarta Validation)         │
│  - Extracts barbershopId from header            │
│  - Calls service layer                          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│           SERVICE LAYER                          │
│  ServiceManagementService.java                  │
│  - Business logic                               │
│  - Authorization checks                         │
│  - Calls repository                             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         REPOSITORY LAYER                         │
│  ServiceRepository.java                         │
│  - Database operations                          │
│  - JPA/Hibernate                                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│            DATABASE                              │
│  PostgreSQL                                     │
│  services table                                 │
└─────────────────────────────────────────────────┘
```

---

### 1. Entity Layer

**File**: `Service.java`

**What it does**: Represents the database table as a Java class

```java
@Entity  // This is a JPA entity
@Table(name = "services")  // Maps to "services" table
public class Service {

    @Id  // Primary key
    @GeneratedValue(strategy = GenerationType.UUID)  // Auto-generate UUID
    private UUID id;

    @ManyToOne  // Many services belong to one barbershop
    @JoinColumn(name = "barbershop_id")
    private Barbershop barbershop;

    @Column(nullable = false)  // Required field
    private String name;

    @Column(precision = 10, scale = 2)  // Money: 10 digits, 2 decimal places
    private BigDecimal price;

    // ... getters and setters
}
```

**Key Annotations Explained**:

- `@Entity` - "This class represents a database table"
- `@Table(name = "services")` - "The table name is 'services'"
- `@Id` - "This field is the primary key"
- `@GeneratedValue` - "Auto-generate this value"
- `@ManyToOne` - "Many services can belong to one barbershop"
- `@Column` - "This is a table column"

---

### 2. Repository Layer

**File**: `ServiceRepository.java`

**What it does**: Provides database operations (CRUD)

```java
@Repository
public interface ServiceRepository extends JpaRepository<Service, UUID> {

    // Spring Data JPA automatically implements this!
    // No need to write SQL

    List<Service> findByBarbershopId(UUID barbershopId);
    // SQL: SELECT * FROM services WHERE barbershop_id = ?

    List<Service> findByBarbershopIdAndIsActive(UUID barbershopId, Boolean isActive);
    // SQL: SELECT * FROM services WHERE barbershop_id = ? AND is_active = ?
}
```

**How Spring Data JPA Works**:

Spring Data JPA reads your method name and generates SQL automatically!

| Method Name | Generated SQL |
|-------------|---------------|
| `findByBarbershopId(UUID id)` | `SELECT * FROM services WHERE barbershop_id = ?` |
| `findByName(String name)` | `SELECT * FROM services WHERE name = ?` |
| `findByPriceLessThan(BigDecimal price)` | `SELECT * FROM services WHERE price < ?` |

**Why this is awesome**:
- ✅ No SQL code to write
- ✅ No SQL injection vulnerabilities
- ✅ Type-safe (compile-time checks)
- ✅ Database-agnostic (works with MySQL, PostgreSQL, etc.)

---

### 3. DTO Layer

**What is a DTO?**

DTO = **Data Transfer Object**

DTOs are used to transfer data between layers, separate from the entity.

**Why use DTOs?**

```
❌ Without DTOs (using Entity directly):
- Exposes internal database structure
- Can't hide sensitive fields
- Client gets unnecessary data (createdAt, updatedAt, etc.)
- Changes to entity affect API contract

✅ With DTOs:
- Clean API contract
- Hide sensitive data
- Only send what client needs
- Entity changes don't break API
```

**Three DTOs**:

1. **CreateServiceRequest** - For creating services
   ```java
   {
     "name": "Haircut",
     "description": "Professional haircut",
     "price": 15.00,
     "durationMinutes": 30
   }
   ```

2. **UpdateServiceRequest** - For updating services (all fields optional)
   ```java
   {
     "price": 20.00,
     "durationMinutes": 45
   }
   ```

3. **ServiceResponse** - For returning service data
   ```java
   {
     "id": "123e4567-...",
     "barbershopId": "456e7890-...",
     "name": "Haircut",
     "description": "Professional haircut",
     "price": 15.00,
     "durationMinutes": 30,
     "isActive": true,
     "createdAt": "2025-11-07T10:30:00",
     "updatedAt": "2025-11-07T10:30:00"
   }
   ```

---

### 4. Service Layer

**File**: `ServiceManagementService.java`

**What it does**: Business logic and authorization

```java
@Service  // This is a Spring service (business logic)
@Transactional  // All methods run in database transactions
public class ServiceManagementService {

    public ServiceResponse createService(UUID barbershopId, CreateServiceRequest request) {
        // 1. Validate barbershop exists
        Barbershop barbershop = barbershopRepository.findById(barbershopId)
            .orElseThrow(() -> new RuntimeException("Barbershop not found"));

        // 2. Create service entity
        Service service = new Service(
            barbershop,
            request.getName(),
            request.getDescription(),
            request.getPrice(),
            request.getDurationMinutes()
        );

        // 3. Save to database
        Service saved = serviceRepository.save(service);

        // 4. Convert to DTO and return
        return new ServiceResponse(saved);
    }
}
```

**Key Concepts**:

- **`@Transactional`**: If any operation fails, roll back all changes
- **Authorization**: Always verify service belongs to barbershop
- **DTO Conversion**: Entity → DTO before returning

---

### 5. Controller Layer

**File**: `ServiceController.java`

**What it does**: Handles HTTP requests

```java
@RestController  // RESTful web service
@RequestMapping("/api/v1/services")  // Base URL
public class ServiceController {

    @PostMapping  // POST /api/v1/services
    public ResponseEntity<ServiceResponse> createService(
        @Valid @RequestBody CreateServiceRequest request,  // From request body
        @RequestHeader("X-Barbershop-Id") UUID barbershopId  // From header
    ) {
        ServiceResponse response = serviceManagementService.createService(
            barbershopId,
            request
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

**HTTP Methods**:

| Method | URL | Purpose |
|--------|-----|---------|
| POST | `/api/v1/services` | Create service |
| GET | `/api/v1/services` | Get all services |
| GET | `/api/v1/services/{id}` | Get one service |
| PUT | `/api/v1/services/{id}` | Update service |
| DELETE | `/api/v1/services/{id}` | Delete service (soft) |

---

## Frontend Architecture

### Component Structure

```
┌─────────────────────────────────────────────────┐
│          SERVICES PAGE                          │
│  /dashboard/services/page.tsx                   │
│  - React component                              │
│  - UI state management                          │
│  - User interactions                            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│           API LAYER                             │
│  src/lib/api.ts                                 │
│  - serviceApi.create()                          │
│  - serviceApi.getAll()                          │
│  - serviceApi.update()                          │
│  - serviceApi.delete()                          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         AXIOS INSTANCE                          │
│  src/lib/axios.ts                               │
│  - Automatically adds JWT token                 │
│  - Handles errors                               │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│           HTTP REQUEST                          │
│  POST /api/v1/services                          │
│  Authorization: Bearer <token>                  │
│  X-Barbershop-Id: <uuid>                        │
└─────────────────────────────────────────────────┘
```

---

### Type Definitions

**File**: `src/types/service.ts`

```typescript
export interface Service {
  id: string;
  barbershopId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}
```

**Why TypeScript?**

```typescript
// ✅ Type safety - catch errors at compile time
const service: Service = {
  id: "123",
  name: "Haircut",
  price: 15,  // Correct
  // TypeScript error: Property 'durationMinutes' is missing
};

// ❌ Without types (plain JavaScript)
const service = {
  id: "123",
  name: "Haircut",
  price: "fifteen",  // Oops! Should be number, but no error until runtime
};
```

---

### API Layer

**File**: `src/lib/api.ts`

```typescript
export const serviceApi = {
  async create(barbershopId: string, data: CreateServiceRequest): Promise<Service> {
    const response = await apiClient.post<Service>('/services', data, {
      headers: {
        'X-Barbershop-Id': barbershopId,  // Backend needs this for authorization
      },
    });
    return response.data;
  },

  async getAll(barbershopId: string): Promise<Service[]> {
    const response = await apiClient.get<Service[]>('/services', {
      headers: {
        'X-Barbershop-Id': barbershopId,
      },
    });
    return response.data;
  },
};
```

**Key Points**:

1. **Uses axios** - Not fetch() because axios has better features:
   - Automatic JSON parsing
   - Interceptors (for JWT token)
   - Better error handling
   - TypeScript support

2. **Type Safety**: `apiClient.post<Service>()` tells TypeScript what type to expect

3. **Headers**: Always send `X-Barbershop-Id` for authorization

---

### React Component

**File**: `src/app/dashboard/services/page.tsx`

**Component State**:

```typescript
const [services, setServices] = useState<Service[]>([]);  // List of services
const [isLoading, setIsLoading] = useState(true);  // Loading state
const [showAddModal, setShowAddModal] = useState(false);  // Modal visibility
const [formData, setFormData] = useState<CreateServiceRequest>({  // Form data
  name: '',
  description: '',
  price: 0,
  durationMinutes: 30,
});
```

**React Hooks**:

1. **useState** - Store component state
   ```typescript
   const [count, setCount] = useState(0);
   setCount(count + 1);  // Update state
   ```

2. **useEffect** - Run code on mount/update
   ```typescript
   useEffect(() => {
     loadServices();  // Load data when component mounts
   }, [user]);  // Re-run when 'user' changes
   ```

3. **useAuth** - Custom hook for authentication
   ```typescript
   const { user, isAuthenticated } = useAuth();
   ```

---

## Complete Data Flow

### Creating a Service (Full Journey)

```
┌─────────────────────────────────────────────────┐
│  1. USER FILLS FORM                             │
│     Name: "Haircut"                             │
│     Price: 15.00                                │
│     Duration: 30 minutes                        │
│     Clicks "Add Service"                        │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  2. REACT HANDLES SUBMIT                        │
│     handleSubmit(e) {                           │
│       e.preventDefault();                       │
│       await serviceApi.create(                  │
│         user.barbershopId,                      │
│         formData                                │
│       );                                        │
│     }                                           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  3. API LAYER                                   │
│     serviceApi.create() called                  │
│     Uses axios to make HTTP request             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  4. AXIOS INTERCEPTOR                           │
│     Automatically adds headers:                 │
│     Authorization: Bearer <JWT>                 │
│     X-Barbershop-Id: <UUID>                     │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  5. HTTP REQUEST SENT                           │
│     POST http://localhost:8080/api/v1/services  │
│     Headers: Authorization, X-Barbershop-Id     │
│     Body: {name, price, durationMinutes}        │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  6. BACKEND JWT FILTER                          │
│     Validates JWT token                         │
│     Extracts user info                          │
│     Sets Spring Security context                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  7. CONTROLLER LAYER                            │
│     ServiceController.createService()           │
│     Validates input (@Valid)                    │
│     Extracts barbershopId from header           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  8. SERVICE LAYER                               │
│     ServiceManagementService.createService()    │
│     - Finds barbershop                          │
│     - Creates Service entity                    │
│     - Saves to database                         │
│     - Returns ServiceResponse DTO               │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  9. DATABASE                                    │
│     INSERT INTO services (...) VALUES (...)     │
│     Returns saved record with generated UUID    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  10. HTTP RESPONSE                              │
│      Status: 201 Created                        │
│      Body: ServiceResponse JSON                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  11. FRONTEND RECEIVES RESPONSE                 │
│      axios returns response.data                │
│      serviceApi.create() returns Service        │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  12. REACT UPDATES UI                           │
│      setServices([...services, newService])     │
│      setShowAddModal(false)                     │
│      User sees new service in list!             │
└─────────────────────────────────────────────────┘
```

---

## Testing Guide

### Step 1: Start Backend

```bash
cd C:\Users\Maxi G\Documents\GitHub\TrimminFlow-Backend\demo
./mvnw spring-boot:run
```

**What happens**:
- Spring Boot starts
- Database connection established
- Tables created (if not exist)
- Server starts on port 8080

---

### Step 2: Start Frontend

```bash
cd C:\Users\Maxi G\Documents\GitHub\TrimminFlow-FrontEnd\trimminflowf
npm run dev
```

**What happens**:
- Next.js development server starts
- Server starts on port 3000
- Hot reload enabled

---

### Step 3: Login

1. Go to `http://localhost:3000/login`
2. Enter your credentials
3. You'll be redirected to dashboard

---

### Step 4: Navigate to Services

1. Go to `http://localhost:3000/dashboard/services`
2. You should see the Services page

---

### Step 5: Add a Service

1. Click "Add Service" button
2. Fill in the form:
   - Name: Haircut
   - Description: Professional haircut
   - Price: 15.00
   - Duration: 30
3. Click "Add Service"
4. Service should appear in the list!

---

### Step 6: Verify in Database

```bash
# Connect to PostgreSQL
psql -h localhost -U trimminflow_user -d trimminflow

# Query services table
SELECT * FROM services;
```

You should see your service!

---

### Step 7: Test Update

1. Click "Edit" on a service
2. Change the price to 20.00
3. Click "Update Service"
4. Price should update!

---

### Step 8: Test Delete

1. Click the trash icon on a service
2. Confirm deletion
3. Service should disappear!
4. Check database - `is_active` is now `false` (soft delete)

---

## Common Patterns Explained

### 1. Repository Pattern

**What**: Separate data access from business logic

```
❌ Without Repository:
Service → SQL directly
- Hard to test
- SQL scattered everywhere
- Tight coupling

✅ With Repository:
Service → Repository → Database
- Easy to test (mock repository)
- Centralized data access
- Loose coupling
```

---

### 2. DTO Pattern

**What**: Separate API contract from database structure

```
❌ Without DTO:
Controller returns Entity directly
- Exposes database structure
- Can't hide fields
- Breaking changes

✅ With DTO:
Controller returns DTO
- Clean API contract
- Hide sensitive data
- Version independently
```

---

### 3. Service Layer Pattern

**What**: Business logic separate from controllers

```
❌ Without Service Layer:
Controller → Repository
- No business logic separation
- Fat controllers
- Hard to reuse logic

✅ With Service Layer:
Controller → Service → Repository
- Clean business logic
- Thin controllers
- Reusable logic
```

---

### 4. React Hooks Pattern

**What**: Reusable stateful logic

```typescript
// Custom hook for loading services
function useServices(barbershopId: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [barbershopId]);

  const loadServices = async () => {
    const data = await serviceApi.getAll(barbershopId);
    setServices(data);
    setIsLoading(false);
  };

  return { services, isLoading, loadServices };
}

// Use in component
function ServicesPage() {
  const { services, isLoading } = useServices(user.barbershopId);
  // ...
}
```

---

## Summary

### What We Built

✅ **Backend**:
- Service entity (database model)
- ServiceRepository (data access)
- ServiceManagementService (business logic)
- ServiceController (REST API)
- Full CRUD operations
- JWT authentication
- Authorization checks

✅ **Frontend**:
- TypeScript types
- API layer with axios
- Services management page
- Add/Edit/Delete functionality
- Beautiful UI with Tailwind CSS

### Key Takeaways

1. **Separation of Concerns**: Each layer has one responsibility
2. **Type Safety**: TypeScript + Java types prevent bugs
3. **Security**: JWT authentication + authorization checks
4. **User Experience**: Loading states, error handling, confirmation dialogs
5. **Best Practices**: DTOs, repositories, service layer, React hooks

---

## Next Steps

Now you can implement:
- **Barbers Management** (similar pattern)
- **Business Hours** (similar pattern)
- **Appointments** (uses Services + Barbers)

The pattern is the same for all features! 🎉
