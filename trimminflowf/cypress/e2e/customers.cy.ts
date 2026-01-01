import { mockCustomers } from '../fixtures/mocks';

describe("Customer Features", () => {
    beforeEach(() => {
        cy.login();
        cy.setupDashboardMocks();

        // Mock Customers API - must be specific to backend API to avoid intercepting Next.js RSC requests
        cy.intercept('GET', '**/api/v1/customers*', {
            statusCode: 200,
            body: { content: mockCustomers, totalElements: mockCustomers.length, totalPages: 1 }
        }).as('getCustomersAPI');

        cy.visit("/dashboard");
        // Wait for dashboard to load
        cy.get(".animate-spin").should("not.exist");
        // Navigate via sidebar
        cy.contains('nav a', 'Customers').click({ force: true });
    });

    it("should display customer list", () => {
        cy.viewport(1280, 800); // Desktop view to see Email column
        cy.get(".animate-spin").should("not.exist");

        // Check table headers
        cy.contains("Name").should("be.visible");

        // DEBUG: Check for Next.js Error Overlay
        cy.get("body").then(($body) => {
            if ($body.find("nextjs-portal").length > 0) {
                cy.log("Next.js Error Overlay Detected!");
                const pre = $body.find("pre");
                if (pre.length) {
                    cy.log("Error Stack:", pre.text());
                    console.error("CYPRESS FOUND APP ERROR:", pre.text());
                }
            }
        });

        // Email is hidden on small screens, so we ensured desktop viewport.
        // But to be unbreakable, let's verify Phone which is always visible
        cy.contains("Phone").should("be.visible");

        // Check data
        cy.contains(mockCustomers[0].firstName).should("be.visible");
        // Phone check
        cy.contains(mockCustomers[0].phone).should("be.visible");
    });

    it("should search for a customer", () => {
        cy.viewport(1280, 800);
        cy.get(".animate-spin").should("not.exist");

        // Mock search response
        cy.intercept('GET', '**/api/v1/customers*search=John*', {
            statusCode: 200,
            body: { content: [mockCustomers[0]], totalElements: 1, totalPages: 1 }
        }).as('searchCustomer');

        // Type in search box - finding by type="text" since placeholder might be localized
        cy.get('input[type="text"]').first().should('be.visible').type("John");

        // Wait for debounce/search
        cy.wait('@searchCustomer');

        // Verify only John is shown (implied by the mock return, but we check presence)
        cy.contains("John").should("be.visible");
    });
});
