/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            login(): Chainable<void>;
            setupDashboardMocks(): Chainable<void>;
        }
    }
}

export { }; // Make this a module
