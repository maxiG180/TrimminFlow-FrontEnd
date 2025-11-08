# Component Architecture & CSS Best Practices

This document explains the component architecture and CSS best practices implemented in the TRIMMINFLOW frontend.

## Directory Structure

```
src/
├── components/
│   ├── ui/                          # Reusable UI components
│   │   ├── Button.tsx               # Button component with variants
│   │   ├── Input.tsx                # Input field with label & validation
│   │   ├── TextArea.tsx             # Textarea with label & validation
│   │   ├── Select.tsx               # Select dropdown with label
│   │   ├── Card.tsx                 # Card container component
│   │   └── index.ts                 # Barrel export for easy imports
│   ├── layout/                      # Layout components
│   │   └── Navbar.tsx               # Shared navbar component
│   └── BarbershopRegistrationForm.tsx # Feature-specific form
├── lib/
│   ├── api.ts                       # API client layer
│   ├── utils.ts                     # Utility functions (cn for className merging)
│   ├── theme.ts                     # Theme configuration & constants
│   └── mockData.ts                  # Mock data for development
├── app/
│   ├── page.tsx                     # Home page
│   ├── register/page.tsx            # Registration page
│   └── dashboard/page.tsx           # Dashboard page
└── types/
    └── index.ts                     # TypeScript type definitions
```

---

## Design Philosophy

### 1. Separation of Concerns

**Before:**
```tsx
// ❌ Bad: CSS mixed with component logic
<input className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" />
```

**After:**
```tsx
// ✅ Good: Reusable component with clean API
<Input label="Email" type="email" name="email" required />
```

### 2. Component Reusability

All UI components are:
- **Composable**: Can be used anywhere in the app
- **Configurable**: Accept props for customization
- **Consistent**: Follow the same design system
- **Type-safe**: Full TypeScript support

### 3. Single Source of Truth

All styling constants live in `src/lib/theme.ts`:
- Colors
- Spacing
- Typography
- Border radius
- Animations

---

## Component Usage

### Button Component

```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" size="lg">
  Submit
</Button>

// Outline button
<Button variant="outline">
  Cancel
</Button>

// With loading state
<Button variant="primary" isLoading={true}>
  Saving...
</Button>
```

**Props:**
- `variant`: 'primary' | 'outline' | 'ghost' | 'link'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- All standard button HTML attributes

---

### Input Component

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  name="email"
  required
  placeholder="your@email.com"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

**Props:**
- `label`: string (optional)
- `error`: string (shows error state)
- `helperText`: string (shows helper text)
- `required`: boolean (adds asterisk to label)
- All standard input HTML attributes

---

### TextArea Component

```tsx
import { TextArea } from '@/components/ui';

<TextArea
  label="Description"
  name="description"
  rows={4}
  placeholder="Tell us about your business..."
/>
```

---

### Select Component

```tsx
import { Select } from '@/components/ui';

<Select label="Timezone" name="timezone">
  <option value="America/New_York">Eastern Time</option>
  <option value="Europe/London">London</option>
</Select>
```

---

### Card Component

```tsx
import { Card } from '@/components/ui';

<Card className="lg:p-12">
  <h2>Card Title</h2>
  <p>Card content...</p>
</Card>
```

---

### Navbar Component

```tsx
import Navbar from '@/components/layout/Navbar';

const navLinks = [
  { href: '/', label: 'Home', variant: 'default' },
  { href: '/about', label: 'About', variant: 'default' },
  { href: '/register', label: 'Sign Up', variant: 'primary' },
];

<Navbar links={navLinks} />
```

---

## Styling Utilities

### className Merging (cn)

The `cn` utility merges Tailwind classes intelligently, handling conflicts:

```tsx
import { cn } from '@/lib/utils';

<Button className={cn('w-full', isActive && 'bg-green-500')} />
```

This uses:
- **clsx**: Conditional className merging
- **tailwind-merge**: Removes conflicting Tailwind classes

---

## Theme Configuration

All theme constants are in `src/lib/theme.ts`:

```tsx
import { theme } from '@/lib/theme';

// Access theme colors
theme.colors.primary.gradient // 'from-yellow-400 to-amber-500'
theme.colors.text.secondary    // 'gray-300'

// Access spacing
theme.spacing.md               // '1.5rem'

// Access typography
theme.typography.fontSize.xl   // '1.25rem'
```

**Helper functions:**
```tsx
import { getGradient, getTextColor } from '@/lib/theme';

getGradient('primary')         // 'bg-gradient-to-r from-yellow-400 to-amber-500'
getTextColor('secondary')      // 'text-gray-300'
```

---

## Best Practices

### 1. Always Use Barrel Exports

```tsx
// ✅ Good: Import from barrel
import { Button, Input, Card } from '@/components/ui';

// ❌ Bad: Import individually
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
```

### 2. Extract Reusable Logic

If you repeat the same component pattern 3+ times, create a reusable component.

### 3. Keep Components Small

Each component should have a single responsibility. If a component gets too large, split it.

### 4. Use TypeScript

All components have full TypeScript support for type safety.

### 5. Follow the Design System

All components follow the same:
- Color palette (yellow/amber primary)
- Dark theme background
- Glassmorphism styling
- Consistent spacing & typography

---

## Migration Guide

### Before (Inline Styles):
```tsx
<div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
  <label className="block text-sm font-semibold mb-2 text-gray-200">
    Email <span className="text-yellow-400">*</span>
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
  />
  <button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 font-bold py-4 px-6 rounded-xl">
    Submit
  </button>
</div>
```

### After (Reusable Components):
```tsx
<Card>
  <Input label="Email" type="email" required />
  <Button variant="primary" size="lg" className="w-full font-bold">
    Submit
  </Button>
</Card>
```

**Benefits:**
- 90% less code
- Easier to maintain
- Consistent styling
- Better TypeScript support
- Easier testing

---

## Adding New Components

1. Create component in `src/components/ui/ComponentName.tsx`
2. Use `React.forwardRef` for ref support
3. Accept `className` prop for customization
4. Export props interface
5. Add to `src/components/ui/index.ts`

**Template:**
```tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'special';
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('base-styles', variant === 'special' && 'special-styles', className)}
        {...props}
      />
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;
```

---

## Form Validation Architecture

### Technology Stack

**Frontend Validation:**
- **React Hook Form** (v7+) - Form state management
- **Zod** (v3+) - Schema validation
- **@hookform/resolvers** - Integration layer

**Backend Validation:**
- **Jakarta Bean Validation** - Java annotation-based validation
- **Spring Boot Validation** - `@Valid` annotation processing
- **GlobalExceptionHandler** - Centralized error response formatting

### Why This Stack?

**React Hook Form:**
- Better performance (uncontrolled components = fewer re-renders)
- Less boilerplate than manual useState management
- Built-in error handling and form state
- Industry standard (40k+ GitHub stars)

**Zod:**
- TypeScript-first (schema = types)
- Composable validation rules
- Great error messages
- Used by Next.js, tRPC, Vercel

**Jakarta Bean Validation:**
- Java standard for validation
- Declarative (annotations)
- Automatic validation with @Valid
- Consistent with Spring Boot ecosystem

---

### Implementation Pattern

#### Frontend Form Pattern (TypeScript)

**1. Define Zod Schema:**
```typescript
// src/components/BarbershopRegistrationForm.tsx

const registrationSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),

  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(val),
      'Please enter a valid phone number'
    ),
});

// Infer TypeScript type from schema
type RegistrationFormData = z.infer<typeof registrationSchema>;
```

**2. Use React Hook Form:**
```typescript
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
} = useForm<RegistrationFormData>({
  resolver: zodResolver(registrationSchema),
  mode: 'onBlur', // Validate when user leaves field
});

const onSubmit = async (data: RegistrationFormData) => {
  // data is fully typed and validated
  const response = await authApi.register(data);
  reset(); // Clear form on success
};
```

**3. Connect Form Fields:**
```typescript
<form onSubmit={handleSubmit(onSubmit)}>
  <Input
    label="Email"
    type="email"
    placeholder="john@example.com"
    {...register('email')}
    error={errors.email?.message}
  />

  <Input
    label="Password"
    type="password"
    placeholder="••••••••"
    {...register('password')}
    error={errors.password?.message}
  />

  <Button type="submit" isLoading={isSubmitting}>
    Submit
  </Button>
</form>
```

---

#### Backend Validation Pattern (Java)

**1. DTO with Validation Annotations:**
```java
// src/main/java/com/trimminflow/demo/dto/RegisterRequest.java

public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>]{8,}$",
        message = "Password must contain uppercase, lowercase, number, and special character"
    )
    private String password;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "First name can only contain letters")
    private String firstName;

    @Pattern(
        regexp = "^$|^[\\+]?[(]?[0-9]{1,3}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,4}[-\\s\\.]?[0-9]{1,9}$",
        message = "Please provide a valid phone number"
    )
    private String phone;

    // Getters and setters...
}
```

**2. Controller with @Valid:**
```java
// src/main/java/com/trimminflow/demo/controller/AuthController.java

@PostMapping("/register")
public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
    // @Valid triggers automatic validation
    // If validation fails, GlobalExceptionHandler catches it
    RegisterResponse response = authService.registerBarbershopOwner(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

**3. Global Exception Handler:**
```java
// src/main/java/com/trimminflow/demo/config/GlobalExceptionHandler.java

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Validation failed");
        response.put("fieldErrors", fieldErrors);
        response.put("status", HttpStatus.BAD_REQUEST.value());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
```

---

### Validation Rules Standards

**Password Requirements (OWASP-compliant):**
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*(),.?":{}|<>)

**Name Fields:**
- 2-50 characters
- Letters, spaces, hyphens, apostrophes only
- Regex: `^[a-zA-Z\s'-]+$`

**Email:**
- Valid email format (HTML5 + backend validation)
- Unique in database

**Phone (Optional):**
- International format support
- Regex: `^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$`

---

### Error Response Format

**Backend Validation Error Response:**
```json
{
  "error": "Validation failed",
  "status": 400,
  "fieldErrors": {
    "password": "Password must contain at least one uppercase letter",
    "email": "Please provide a valid email address"
  }
}
```

**Frontend Error Display:**
- Field-specific errors shown below each input
- Red border on invalid fields
- Error text in red-400 color
- Errors clear when user fixes the issue

---

### Best Practices

**1. Dual Validation (Frontend + Backend):**
- Frontend: User experience (instant feedback)
- Backend: Security (never trust client)
- Keep validation rules synchronized

**2. Schema as Single Source of Truth:**
- Define validation once in Zod schema
- TypeScript types auto-generated
- Easy to update and maintain

**3. User-Friendly Error Messages:**
- Specific errors (not generic "Invalid input")
- Actionable feedback ("Must be at least 8 characters" vs "Invalid")
- Show password requirements upfront

**4. Validation Timing:**
- Use `mode: 'onBlur'` for better UX
- Validates when user leaves field (not on every keystroke)
- Submit validation as final check

**5. Optional Fields:**
- Use `.optional()` in Zod
- Skip `@NotBlank` in Java
- Allow empty strings or null

---

### Adding Validation to New Forms

**Step 1: Install Dependencies (if not already):**
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Step 2: Create Zod Schema:**
```typescript
const myFormSchema = z.object({
  fieldName: z.string().min(1, 'Field is required'),
  // ... other fields
});

type MyFormData = z.infer<typeof myFormSchema>;
```

**Step 3: Use React Hook Form:**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<MyFormData>({
  resolver: zodResolver(myFormSchema),
  mode: 'onBlur',
});
```

**Step 4: Connect to Backend DTO:**
```java
public class MyFormRequest {
    @NotBlank(message = "Field is required")
    private String fieldName;
    // ... getters/setters
}
```

**Step 5: Use @Valid in Controller:**
```java
@PostMapping("/my-endpoint")
public ResponseEntity<?> myEndpoint(@Valid @RequestBody MyFormRequest request) {
    // ...
}
```

---

### Files Modified for Validation

**Frontend:**
- `src/components/BarbershopRegistrationForm.tsx` - Implemented React Hook Form + Zod
- `src/components/ui/Input.tsx` - Already supports `error` prop for validation messages
- `package.json` - Added dependencies

**Backend:**
- `src/main/java/com/trimminflow/demo/dto/RegisterRequest.java` - Added validation annotations
- `src/main/java/com/trimminflow/demo/config/GlobalExceptionHandler.java` - Created for validation error handling
- `src/main/java/com/trimminflow/demo/controller/AuthController.java` - Uses `@Valid` annotation

---

### Common Validation Patterns

**Email Validation:**
```typescript
// Frontend (Zod):
email: z.string().email('Invalid email address')

// Backend (Java):
@Email(message = "Invalid email address")
private String email;
```

**Required Field:**
```typescript
// Frontend (Zod):
name: z.string().min(1, 'Name is required')

// Backend (Java):
@NotBlank(message = "Name is required")
private String name;
```

**String Length:**
```typescript
// Frontend (Zod):
name: z.string().min(2).max(50, 'Must be 2-50 characters')

// Backend (Java):
@Size(min = 2, max = 50, message = "Must be 2-50 characters")
private String name;
```

**Regex Pattern:**
```typescript
// Frontend (Zod):
code: z.string().regex(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers')

// Backend (Java):
@Pattern(regexp = "^[A-Z0-9]+$", message = "Only uppercase letters and numbers")
private String code;
```

**Optional Field:**
```typescript
// Frontend (Zod):
phone: z.string().optional()

// Backend (Java):
// Simply omit @NotBlank annotation
private String phone;
```

**Custom Validation:**
```typescript
// Frontend (Zod):
age: z.number().refine((val) => val >= 18, 'Must be 18 or older')

// Backend (Java):
// Create custom validator or use @Min/@Max
@Min(value = 18, message = "Must be 18 or older")
private Integer age;
```

---

## Future Improvements

1. **Component Library**: Consider moving to shadcn/ui or Radix UI
2. **CSS Modules**: For more complex component-specific styles
3. **Storybook**: For component documentation and testing
4. **Animations**: Add Framer Motion variants to components
5. **Theming**: Support light/dark mode toggle
6. **Accessibility**: Add ARIA labels and keyboard navigation
7. **Form Validation**: Consider adding field-level async validation (e.g., check if email exists)

---

## Resources

- [Tailwind CSS](https://tailwindcss.com/docs)
- [React forwardRef](https://react.dev/reference/react/forwardRef)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [clsx](https://github.com/lukeed/clsx)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Jakarta Bean Validation](https://beanvalidation.org/)
