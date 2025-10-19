# TRIMMINFLOW MVP

## Overview

MVP implementation of TRIMMINFLOW - a barbershop management SaaS platform with mock data for demonstration purposes.

## What's Implemented

### 1. **Home/Landing Page** (`/`)

- Modern SaaS landing page with hero section
- Feature showcase
- Testimonials section
- Pricing information
- Call-to-action buttons linking to dashboard and booking
- Fully responsive design with animations

### 2. **Barbershop Registration** (`/register`)

- Full-stack registration flow (frontend + backend integration)
- Production-grade form validation:
  - **Frontend**: React Hook Form + Zod schema validation
  - **Backend**: Jakarta Bean Validation annotations
  - OWASP-compliant password requirements (8+ chars, uppercase, lowercase, number, special character)
  - Real-time validation feedback on blur
  - Field-specific error messages
- Creates both Barbershop and Owner User entities in PostgreSQL
- Password hashing with BCrypt
- Structured error responses with GlobalExceptionHandler
- Success/error state handling with user feedback

### 3. **Barbershop Owner Dashboard** (`/dashboard`)

- Overview statistics (Today's appointments, Total customers, Weekly revenue)
- Today's appointments list with customer details
- Active barbers sidebar
- Quick actions panel
- Modern sidebar navigation
- Mock data integration showing real appointment data

### 4. **Calendar View** (`/dashboard/calendar`)

- Weekly calendar grid view
- Time slot based scheduling (9:00 AM - 7:00 PM)
- Filter appointments by barber
- Visual appointment cards with customer and service info
- Week navigation (previous/next week)
- Today highlighting
- Displays mock appointments from the current week

### 5. **Public Booking Page** (`/booking`)

- Multi-step booking flow:
  - **Step 1**: Service selection (shows all services with prices and duration)
  - **Step 2**: Barber selection (choose from available barbers)
  - **Step 3**: Date & time selection (next 7 days, hourly slots)
  - **Step 4**: Customer information (name, phone, email)
  - **Step 5**: Confirmation screen with booking summary
- Progress indicator
- Smooth animations and transitions
- Mobile responsive

## Mock Data Structure

### Entities Created:

- **Barbershop**: Classic Cuts Barbershop (Lisbon-based)
- **Barbers**: 3 barbers (Miguel Costa, Ricardo Martins, Pedro Santos)
- **Services**: 6 services (Classic Haircut, Modern Fade, Beard Trim, Hot Towel Shave, Haircut + Beard, Kids' Cut)
- **Customers**: 5 mock customers with realistic Portuguese names and contact info
- **Appointments**: 9 appointments spread across the current week
- **Statistics**: Mock business metrics (revenue, customers, completion rate)

### TypeScript Types

All database entities have been fully typed according to the PostgreSQL schema:

- `Barbershop`
- `User`
- `Barber`
- `Service`
- `Customer`
- `Appointment`
- `Payment`

## Tech Stack Used

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React useState (simple local state)
- **Form Validation**: React Hook Form + Zod
- **API Client**: Fetch API with custom wrapper

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── register/
│   │   └── page.tsx                # Barbershop registration
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard home
│   │   └── calendar/
│   │       └── page.tsx            # Calendar view
│   └── booking/
│       └── page.tsx                # Public booking
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── Button.tsx              # Button with variants
│   │   ├── Input.tsx               # Input with validation support
│   │   ├── TextArea.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   └── index.ts                # Barrel exports
│   ├── layout/
│   │   └── Navbar.tsx              # Navigation component
│   └── BarbershopRegistrationForm.tsx  # Registration form with validation
├── lib/
│   ├── api.ts                      # API client (authApi, barbershopApi)
│   ├── mockData.ts                 # Mock data for development
│   ├── utils.ts                    # Utilities (cn for className merging)
│   └── theme.ts                    # Theme configuration
└── types/
    └── index.ts                    # TypeScript definitions
```

## Running the Application

### Development Server

```bash
cd trimminflowf
npm run dev
```

Access at: `http://localhost:3000`

### Available Routes

- `/` - Landing page
- `/dashboard` - Owner dashboard (requires mock authentication in production)
- `/dashboard/calendar` - Calendar view
- `/booking` - Public booking interface

## Key Features

### Design System

- **Color Scheme**: Dark mode with yellow/amber accent colors
- **Gradient Accents**: Yellow-400 to Amber-500 for primary actions
- **Glass Morphism**: Backdrop blur effects on cards
- **Rounded Corners**: Modern 3xl border radius
- **Animations**: Smooth transitions and motion effects

### Responsive Design

- Mobile-first approach
- Breakpoints for tablet and desktop
- Collapsible navigation for mobile
- Touch-friendly interactive elements

## Next Steps for Full Implementation

### Backend Integration

1. ~~Replace mock data with API calls~~ ✅ **PARTIALLY DONE** - Registration endpoint fully integrated
2. Implement authentication (JWT login/logout)
3. Connect remaining endpoints (barbers, appointments, services)
4. Add real-time updates
5. Implement protected routes with JWT middleware

### Features to Add

1. User authentication pages (`/auth/login`, `/auth/register`)
2. Appointment management (edit, cancel, reschedule)
3. Customer management page
4. QR code generation and display
5. Settings page for barbershop configuration
6. Email notification system
7. Stripe payment integration
8. Analytics and reporting dashboard

### Enhancements

1. ~~Add form validation~~ ✅ **COMPLETED** - React Hook Form + Zod implemented with OWASP-compliant password rules
2. Error handling and loading states ✅ **COMPLETED** - GlobalExceptionHandler on backend, error display on frontend
3. Toast notifications
4. Confirmation modals
5. Search and filter functionality
6. Export data capabilities
7. Multi-language support (Portuguese, English)
8. Field-level async validation (e.g., check if email exists in real-time)

## Mock Data Notes

- Appointments are generated for the current week (Monday to Sunday)
- Business hours: Monday-Friday 9:00-19:00, Saturday 10:00-18:00, Sunday closed
- All monetary values in EUR
- Portuguese locale used for names and phone numbers
- Realistic service prices (€15-€40 range)

## Design Reference

The design is based on the Figma wireframes located in the `Figma Design` folder, adapted for Next.js with modern UI patterns.
