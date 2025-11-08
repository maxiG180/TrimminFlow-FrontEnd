# TrimminFlow - Barbershop Management SaaS

Modern barbershop management platform built with Next.js, TypeScript, and Spring Boot. Streamline appointments, manage barbers, and grow your barbershop business.

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7+-ec5990)
![Zod](https://img.shields.io/badge/Zod-3+-3e67b1)

---

## Features

- 🎨 **Modern UI/UX** - Dark theme with glassmorphism design and smooth animations
- 📅 **Appointment Management** - Weekly calendar view with real-time booking
- 💈 **Barber Management** - Track barbers, services, and availability
- 📊 **Dashboard Analytics** - Revenue tracking, customer insights, and statistics
- 🔐 **Secure Authentication** - JWT-based auth with OWASP-compliant password validation
- ✅ **Form Validation** - React Hook Form + Zod with full type safety
- 📱 **Responsive Design** - Mobile-first approach for all devices
- 🔄 **Real-time Updates** - Live appointment and booking updates (planned)

---

## Quick Start

### Prerequisites

- **Node.js 18+** (for frontend)
- **Java 17+** (for backend)
- **PostgreSQL** (database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TrimminFlow-FrontEnd/trimminflowf
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

### Backend Setup

To run the full-stack application, you'll also need the backend:

1. **Navigate to backend directory:**
   ```bash
   cd ../../TrimminFlow-Backend/demo
   ```

2. **Start PostgreSQL** (via Docker or Windows service)

3. **Run Spring Boot:**
   ```bash
   gradlew.bat bootRun
   ```

Backend will be available at `http://localhost:8080`

For detailed testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── register/           # Barbershop registration
│   ├── dashboard/          # Owner dashboard
│   └── booking/            # Public booking interface
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── *.tsx               # Feature-specific components
├── lib/
│   ├── api.ts              # API client layer
│   ├── utils.ts            # Utility functions
│   ├── theme.ts            # Theme configuration
│   └── mockData.ts         # Development mock data
└── types/
    └── index.ts            # TypeScript type definitions
```

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15.5.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Form Validation:** React Hook Form + Zod
- **API Client:** Custom Fetch wrapper

### Backend
- **Framework:** Spring Boot 3.5.5
- **Language:** Java 17
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Jakarta Bean Validation
- **API Documentation:** Swagger/OpenAPI

---

## Documentation

- **[MVP_README.md](./MVP_README.md)** - MVP implementation details and features
- **[COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md)** - Component patterns, validation architecture, and best practices
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Complete testing guide with architecture explanations

---

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## Key Features Implemented

### ✅ Barbershop Registration
- Full-stack registration with validation
- OWASP-compliant password requirements
- Real-time validation feedback
- BCrypt password hashing

### ✅ Owner Dashboard
- Appointment statistics
- Revenue tracking
- Customer management
- Barber overview

### ✅ Calendar View
- Weekly appointment grid
- Barber filtering
- Time slot scheduling

### ✅ Public Booking
- Multi-step booking flow
- Service/barber selection
- Date/time picker
- Customer information form

---

## Validation Architecture

The project uses a dual-validation approach for security and user experience:

**Frontend (React Hook Form + Zod):**
```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter')
    .regex(/[a-z]/, 'One lowercase letter')
    .regex(/[0-9]/, 'One number')
    .regex(/[!@#$%^&*]/, 'One special character'),
});
```

**Backend (Jakarta Bean Validation):**
```java
@NotBlank(message = "Email is required")
@Email(message = "Invalid email address")
private String email;

@Pattern(
  regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$",
  message = "Password must meet security requirements"
)
private String password;
```

See [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) for detailed validation patterns.

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Optional: Analytics, Monitoring, etc.
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Roadmap

- [ ] User authentication (login/logout)
- [ ] Protected routes with JWT middleware
- [ ] Real-time appointment notifications
- [ ] Email/SMS reminders
- [ ] Stripe payment integration
- [ ] QR code generation for barbershops
- [ ] Multi-language support (Portuguese, English)
- [ ] Mobile app (React Native)

---

## License

[Your License Here]

---

## Contact

Project Link: [https://github.com/your-username/TrimminFlow](https://github.com/your-username/TrimminFlow)

---

Built with ❤️ using [Next.js](https://nextjs.org)
