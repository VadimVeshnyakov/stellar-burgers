/// <reference types="cypress" />

// Селекторы
const modalSelectorCommands = '[data-cy="modal"]';
const modalCloseSelector = '[data-cy="modal-close"]';
const modalOverlaySelector = '[data-cy="modal-overlay"]';

declare namespace Cypress {
  interface Chainable {
    addIngredientByName(name: string): Chainable<void>;
    openIngredientModal(name: string): Chainable<void>;
    closeModalByButton(): Chainable<void>;
    closeModalByOverlay(): Chainable<void>;
  }
}

// Добавить ингредиент по имени
Cypress.Commands.add('addIngredientByName', (name: string) => {
  cy.get(`[data-cy="ingredient-${name}"]`).contains('Добавить').click();
});

// Открыть модалку по имени ингредиента
Cypress.Commands.add('openIngredientModal', (name: string) => {
  cy.get(`[data-cy="ingredient-${name}"]`).click();
  cy.get(modalSelectorCommands).should('exist');
  cy.get(modalSelectorCommands).contains(name);
});

// Закрыть модалку через крестик
Cypress.Commands.add('closeModalByButton', () => {
  cy.get(modalCloseSelector).click();
  cy.get(modalSelectorCommands).should('not.exist');
});

// Закрыть модалку по оверлею
Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get(modalOverlaySelector).click('topLeft', { force: true });
  cy.get(modalSelectorCommands).should('not.exist');
});
