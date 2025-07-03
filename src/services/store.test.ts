import store, { RootState } from './store';

describe('Redux store', () => {
  it('должен иметь корректное начальное состояние', () => {
    const state: RootState = store.getState();

    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');

    // Проверим, что начальные состояния примерно соответствуют ожидаемым типам/структурам
    expect(state.user).toBeDefined();
    expect(state.ingredients).toBeDefined();
    expect(state.orders).toBeDefined();
    expect(state.burgerConstructor).toBeDefined();
    expect(state.feed).toBeDefined();
  });

  it('должен корректно dispatch-ить экшен', () => {
    const prevState = store.getState();
    store.dispatch({ type: 'unknown_action' });
    const nextState = store.getState();
    expect(nextState).toEqual(prevState);
  });
});
