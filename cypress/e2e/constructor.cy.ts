/// <reference types="cypress" />

// Общие селекторы
const constructorIngredientSelector = '[data-cy^="constructor-ingredient-"]';
const modalSelector = '[data-cy="modal"]';

describe('Бургер-конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку и начинку в конструктор', () => {
    cy.addIngredientByName('Краторная булка N-200i');
    cy.addIngredientByName('Филе Люминесцентного тетраодонтимформа');

    cy.get(constructorIngredientSelector).should('have.length', 3);
    cy.get(constructorIngredientSelector).contains('Краторная булка N-200i');
    cy.get(constructorIngredientSelector).contains(
      'Филе Люминесцентного тетраодонтимформа'
    );
  });
});

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открывается при клике на ингредиент и показывает корректную информацию', () => {
    cy.openIngredientModal('Краторная булка N-200i');
    cy.get(modalSelector).contains('Калории, ккал');
    cy.get(modalSelector).contains('420');
  });

  it('закрывается по клику на крестик', () => {
    cy.openIngredientModal('Краторная булка N-200i');
    cy.closeModalByButton();
  });

  it('закрывается по клику на оверлей', () => {
    cy.openIngredientModal('Краторная булка N-200i');
    cy.closeModalByOverlay();
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'orders.json' }).as(
      'createOrder'
    );

    window.localStorage.setItem('refreshToken', 'fakeRefreshToken');
    cy.setCookie('accessToken', 'Bearer fakeAccessToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('оформляет заказ и очищает конструктор', () => {
    cy.addIngredientByName('Краторная булка N-200i');
    cy.addIngredientByName('Филе Люминесцентного тетраодонтимформа');

    cy.get('button').contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get(modalSelector).should('be.visible');
    cy.contains('83358').should('exist');

    cy.closeModalByButton();
    cy.get(constructorIngredientSelector).should('have.length', 0);
  });

  afterEach(() => {
    window.localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });
});
