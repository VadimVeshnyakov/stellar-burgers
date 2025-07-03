import ingredientsReducer, {
  fetchIngredients,
  initialState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  it('должен вернуть начальное состояние по умолчанию', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('обрабатывает fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  it('обрабатывает fetchIngredients.fulfilled', () => {
    const fakeIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 200,
        price: 50,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: fakeIngredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ingredients: fakeIngredients,
      isLoading: false,
      error: null
    });
  });

  it('обрабатывает fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сети' }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка сети'
    });
  });
});
