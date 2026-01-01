describe("Home Page", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should display the navigation bar", () => {
        // Navbar should exist
        cy.get("nav").should("exist");
    });

    it("should have a hero section with CTA buttons", () => {
        // Check for the hero section
        cy.get("section").first().should("be.visible");

        // Check for main CTA links
        cy.get('a[href="/register"]').should("exist");
        cy.get('a[href="/dashboard"]').should("exist");
    });

    it("should display the pricing section", () => {
        cy.get("#pricing").should("exist");
        cy.get("#pricing").contains("Professional Plan");
    });
});
