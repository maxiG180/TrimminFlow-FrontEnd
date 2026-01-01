describe("Dashboard", () => {
    beforeEach(() => {
        // 1. Log in programmatically
        cy.login();

        // 2. Setup Data Mocks
        cy.setupDashboardMocks();

        // 3. Visit Dashboard
        cy.visit("/dashboard");
    });

    it("should load the dashboard page", () => {
        cy.url().should("include", "/dashboard");
        // Wait for loading to finish
        cy.get(".animate-spin").should("not.exist");
        // Use a more generic container check if "main" tag isn't explicitly used in the root layout or page
        cy.get("div").contains("Welcome back").should("exist");
    });

    it("should display the sidebar", () => {
        // Wait for loading to finish
        cy.get(".animate-spin").should("not.exist");

        // Check for navigation items using generic text matching which is safer than looking for "aside" tag
        cy.contains("nav", "Dashboard").should("exist");
        cy.contains("nav", "Calendar").should("exist");
    });

    it("should navigate to Calendar", () => {
        // Wait for loading to finish
        cy.get(".animate-spin").should("not.exist");

        // Click on Calendar link in sidebar (nav tag ensures we get the sidebar one, not quick actions)
        // usage of force: true helps if there's any overlay or animation happening
        cy.get('nav a[href="/dashboard/calendar"]').click({ force: true });

        // Verify URL change
        cy.url().should("include", "/dashboard/calendar");

        // Check if Calendar header exists
        cy.contains("Appointments").should("be.visible");
    });

    it("should navigate to Analytics", () => {
        cy.get(".animate-spin").should("not.exist");
        // Force click in case of animation/overlay issues
        cy.get('nav a[href="/dashboard/analytics"]').click({ force: true });
        cy.url().should("include", "/dashboard/analytics");
    });
});
