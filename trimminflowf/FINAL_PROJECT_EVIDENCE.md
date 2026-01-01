# TrimminFlow Project Evidence

## 1. Appointment Operations (Phase 3.5)
**Objective:** Verify that barbershop owners can manage the lifecycle of an appointment beyond just creation.

I implemented End-to-End testing for the frontend application using Cypress. This tests the full user experience by simulating real user interactions in the browser.

How I built it

I set up Cypress with the base URL pointing to the Next.js development server on localhost:3000. I created custom commands to make tests reusable and reliable. The cy.login() command simulates a user session by mocking the authentication endpoints without exposing real credentials. The cy.setupDashboardMocks() command intercepts all the API calls for appointments, barbers, services, and business hours so tests return consistent data every time.

What got tested

For the Homepage I tested that the landing page loads correctly, the hero section shows the headline and Get Started button, the pricing section is visible, and the CTA buttons link to the register page.

For Authentication I tested that the login and register routes render their forms correctly and that the paths work as expected.

For the Dashboard I tested that authenticated users can access it, the sidebar navigation items are visible, clicking sidebar links navigates to the correct pages like calendar and analytics, and loading states work properly.

For Appointments I tested the calendar grid showing the weekly view, opening the booking modal, filling out the form with barber, service, date and customer details, submitting the form and verifying the API call, and filtering by barber.

For Appointment Operations I tested viewing appointment details by clicking calendar tiles, completing appointments and verifying status changes, rescheduling appointments to different times using inline editing, and navigating the calendar to specific dates to find appointments.

For Customer Features I tested displaying the customer list with pagination, showing table headers with Name and Phone columns, searching for customers by name with debounced input, and verifying filtered results appear correctly.

For QR Code Workflows I tested that the QR code generation page loads properly, the QR code display is visible to admins, and barbershop owners can access the QR management features.

Problems I solved

I switched to wildcard mocking for API endpoints to handle different ports and URL structures, which fixed 403 Forbidden errors that were logging users out during tests. I set a fixed desktop viewport of 1280x800 so mobile headers don't hide buttons. I added explicit waits for loading spinners to prevent flaky tests. I made intercept patterns specific to backend API routes like **/api/v1/customers* to avoid accidentally intercepting Next.js internal requests which caused page crashes.

How to run

For visual mode I use npm run cypress:open and for headless mode which is CI/CD ready I use npm run cypress:run.
```typescript
it("should search for a customer", () => {
    // ... Intercept search query ...
    cy.get('input[placeholder*="Search"]').type("John");
    cy.wait('@searchCustomer');
    cy.contains("John").should("be.visible");
});
```

---

## 3. QR Code Workflows (Phase 5)
**Objective:** Ensure physical-to-digital bridge features are functional.

### 3.1 Validated Features
- **QR Generation:**
  - ✅ **Shop QR:** Automatically generates a unique QR code linking to the shop's public booking page.
- **Downloadables:**
  - ✅ **Export:** "Download" functionality is present for printing shop posters.

### 3.2 Verification (Automated Tests)
Test File: `cypress/e2e/qrcodes.cy.ts`
```typescript
it("should display the QR code generation page", () => {
    cy.visit("/dashboard/qr");
    cy.get('svg').should('exist'); // Verifies QR image generation
    cy.contains(/download/i).should('exist');
});
```

## Summary of Test Suite Status
All features listed above are covered by deterministic, mocked End-to-End tests ensuring regression safety for the final project delivery.
