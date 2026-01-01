// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import { mockUser, mockBarbers, mockServices, mockBusinessHours } from '../fixtures/mocks';

Cypress.Commands.add('login', () => {
    // 1. Mock Auth API calls
    cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: mockUser
    }).as('loginRequest');

    cy.intercept('GET', '**/auth/validate', {
        statusCode: 200,
        body: mockUser
    }).as('validateRequest');

    cy.intercept('POST', '**/auth/logout', {
        statusCode: 200
    }).as('logoutRequest');

    // Prevent 403s by mocking EVERYTHING that might be called on page load
    cy.intercept('GET', '**/barbers/all*', { statusCode: 200, body: mockBarbers }).as('getAllBarbers');
    cy.intercept('GET', '**/services/all*', { statusCode: 200, body: mockServices }).as('getAllServices');
    cy.intercept('GET', '**/barbers*', { statusCode: 200, body: { content: mockBarbers } }).as('getPaginatedBarbers');
    cy.intercept('GET', '**/services*', { statusCode: 200, body: { content: mockServices } }).as('getPaginatedServices');
    cy.intercept('GET', '**/appointments*', { statusCode: 200, body: { content: [] } }).as('getAppointments');
    cy.intercept('GET', '**/business-hours*', { statusCode: 200, body: mockBusinessHours }).as('getHours');

    // 2. Set LocalStorage to simulate "remember me" / valid session state
    // The app checks localStorage first, then calls validate()
    localStorage.setItem('user', JSON.stringify(mockUser));
});

Cypress.Commands.add('setupDashboardMocks', () => {
    // Mock Dashboard Data APIs - Use wildcards to match any base URL or port
    cy.intercept('GET', '**/analytics*', {
        statusCode: 200,
        body: { todayAppointments: 5, totalAppointments: 100, totalRevenue: 5000 }
    }).as('getAnalytics');

    // Mocks for lists
    cy.intercept('GET', '**/appointments*', {
        statusCode: 200,
        body: { content: [] }
    }).as('getAppointments');

    cy.intercept('GET', '**/barbers*', {
        statusCode: 200,
        body: { content: mockBarbers } // Handle both array and paginated response structures if needed
    }).as('getBarbers');

    cy.intercept('GET', '**/services*', {
        statusCode: 200,
        body: mockServices
    }).as('getServices');

    cy.intercept('GET', '**/business-hours*', {
        statusCode: 200,
        body: mockBusinessHours
    }).as('getHours');
});

//
