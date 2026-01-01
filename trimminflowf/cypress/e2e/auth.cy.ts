describe("Authentication Flows", () => {
    it("should navigate to the login page", () => {
        cy.visit("/login");
        // Assuming there is a generic login form or header
        cy.get("form").should("exist");
    });

    it("should navigate to the register page", () => {
        cy.visit("/register");
        cy.get("form").should("exist");
    });
});
