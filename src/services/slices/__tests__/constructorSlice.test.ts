import constructorReducer, {
  addIngredient,
  removeIngredient,
  reorderIngredients,
  clearConstructor
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

beforeAll(() => {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid'
    }
  });
});

describe('constructorSlice', () => {
  const ingredientBun: TIngredient = {
    _id: 'bun-123',
    name: 'Test Bun',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 200,
    price: 50,
    image: 'url',
    image_large: 'url',
    image_mobile: 'url'
  };

  const ingredient1: TIngredient = {
    _id: 'ing-1',
    name: 'Ingredient 1',
    type: 'main',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 100,
    price: 30,
    image: 'url',
    image_large: 'url',
    image_mobile: 'url'
  };

  const ingredient2: TIngredient = {
    _id: 'ing-2',
    name: 'Ingredient 2',
    type: 'sauce',
    proteins: 3,
    fat: 2,
    carbohydrates: 6,
    calories: 50,
    price: 20,
    image: 'url',
    image_large: 'url',
    image_mobile: 'url'
  };

  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('должен добавлять булку', () => {
    const expectedBun: TConstructorIngredient = {
      ...ingredientBun,
      id: 'test-uuid'
    };

    const nextState = constructorReducer(
      initialState,
      addIngredient(ingredientBun)
    );
    expect(nextState.bun).toEqual(expectedBun);
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('должен добавлять ингредиенты, кроме булки', () => {
    const expectedIngredient: TConstructorIngredient = {
      ...ingredient1,
      id: 'test-uuid'
    };

    const nextState = constructorReducer(
      initialState,
      addIngredient(ingredient1)
    );
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual(expectedIngredient);
    expect(nextState.bun).toBeNull();
  });

  it('должен удалять ингредиент по id', () => {
    const ingredientWithId1: TConstructorIngredient = {
      ...ingredient1,
      id: 'id-1'
    };
    const ingredientWithId2: TConstructorIngredient = {
      ...ingredient2,
      id: 'id-2'
    };

    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredientWithId1, ingredientWithId2]
    };

    const nextState = constructorReducer(
      stateWithIngredients,
      removeIngredient('id-1')
    );
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual(ingredientWithId2);
  });

  it('должен переставлять ингредиенты', () => {
    const ingredientWithId1: TConstructorIngredient = {
      ...ingredient1,
      id: 'id-1'
    };
    const ingredientWithId2: TConstructorIngredient = {
      ...ingredient2,
      id: 'id-2'
    };

    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredientWithId1, ingredientWithId2]
    };

    const nextState = constructorReducer(
      stateWithIngredients,
      reorderIngredients({ fromIndex: 0, toIndex: 1 })
    );

    expect(nextState.ingredients[0]).toEqual(ingredientWithId2);
    expect(nextState.ingredients[1]).toEqual(ingredientWithId1);
  });

  it('должен очищать конструктор', () => {
    const ingredientWithId1: TConstructorIngredient = {
      ...ingredient1,
      id: 'id-1'
    };
    const bunWithId: TConstructorIngredient = {
      ...ingredientBun,
      id: 'bun-id'
    };

    const stateWithIngredients = {
      bun: bunWithId,
      ingredients: [ingredientWithId1]
    };

    const nextState = constructorReducer(
      stateWithIngredients,
      clearConstructor()
    );
    expect(nextState.bun).toBeNull();
    expect(nextState.ingredients).toHaveLength(0);
  });
});
