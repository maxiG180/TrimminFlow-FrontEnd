import { mockBarbers, mockServices } from '../fixtures/mocks';

describe("Calendar & Appointments", () => {
    beforeEach(() => {
        cy.login();
        cy.setupDashboardMocks();
        cy.visit("/dashboard/calendar");
    });

    it("should display the calendar appointment grid", () => {
        // Wait for loading to finish
        cy.get(".animate-spin").should("not.exist");

        // Check for grid headers (Mon, Tue, etc)
        cy.contains("Mon").should("exist");
        cy.contains("Sun").should("exist");
    });

    it("should show the 'New Booking' button", () => {
        // Set viewport to desktop to ensure mobile menu doesn't cover elements
        cy.viewport(1280, 800);
        cy.get(".animate-spin").should("not.exist");

        // Find button by text content and force click to bypass any temporary overlays
        cy.contains("button", "New Booking").should("be.visible").click({ force: true });

        // Modal should open
        cy.contains("New Appointment").should("be.visible");

        // Form fields should be populated with mocks
        cy.get('select').should("exist");
    });

    it("should filter by barber", () => {
        cy.get(".animate-spin").should("not.exist");

        // Find the select dropdown for barbers by label text or position
        // Since we have multiple selects, let's use the one that contains "All Barbers"
        cy.get('select').contains('option', 'All Barbers').parent().select(mockBarbers[0].firstName);

        // Verify value changed
        cy.get('select').contains('option', 'All Barbers').parent().should('have.value', mockBarbers[0].id);
    });

    it("should complete the appointment creation flow", () => {
        // Mock the create request
        cy.intercept('POST', '**/appointments', {
            statusCode: 200,
            body: { id: 'new-apt-1', status: 'CONFIRMED' }
        }).as('createAppointment');

        cy.viewport(1280, 800);
        cy.get(".animate-spin").should("not.exist");

        // Open Modal
        cy.contains("button", "New Booking").click({ force: true });

        // Fill Form
        cy.get('select').contains('option', 'Select Barber').parent().select(mockBarbers[0].id);
        cy.get('select').contains('option', 'Select Service').parent().select(mockServices[0].id);

        // Type Date (future date)
        const futureDate = '2025-12-25T10:00';
        cy.get('input[type="datetime-local"]').first().type(futureDate);

        // Type Customer info
        cy.get('input[placeholder="Name"]').type("John Doe");
        cy.get('input[placeholder="Email"]').type("john@test.com");

        // Submit
        cy.contains("button", "Confirm Booking").click();

        // Verify API was called
        cy.wait('@createAppointment').its('request.body').should('include', {
            customerName: 'John Doe',
            customerEmail: 'john@test.com'
        });

        // Modal should close
        cy.contains("New Appointment").should("not.exist");
    });
});
