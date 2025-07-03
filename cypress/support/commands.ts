/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    addIngredientByName(name: string): Chainable<void>;

    openIngredientModal(name: string): Chainable<void>;

    closeModalByButton(): Chainable<void>;

    closeModalByOverlay(): Chainable<void>;
  }
}

// Добавить ингредиент по имени (drag & drop)
Cypress.Commands.add('addIngredientByName', (name: string) => {
  cy.get(`[data-cy="ingredient-${name}"]`).contains('Добавить').click();
});

// Открыть модалку по имени ингредиента
Cypress.Commands.add('openIngredientModal', (name: string) => {
  cy.get(`[data-cy="ingredient-${name}"]`).click();
  cy.get('[data-cy="modal"]').should('exist');
  cy.get('[data-cy="modal"]').contains(name);
});

// Закрыть модалку через крестик
Cypress.Commands.add('closeModalByButton', () => {
  cy.get('[data-cy="modal-close"]').click();
  cy.get('[data-cy="modal"]').should('not.exist');
});

// Закрыть модалку по оверлею
Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });
  cy.get('[data-cy="modal"]').should('not.exist');
});
