import feedReducer, {
  fetchFeeds,
  fetchUserOrders,
  initialState
} from '../feedSlice';
import { TOrder } from '@utils-types';

describe('feedSlice reducer и async thunks', () => {
  const ordersMock: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Order 1',
      number: 1001,
      createdAt: '',
      updatedAt: '',
      ingredients: []
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Order 2',
      number: 1002,
      createdAt: '',
      updatedAt: '',
      ingredients: []
    }
  ];

  it('должен возвращать начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('обрабатывает fetchFeeds.pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchFeeds.fulfilled', () => {
    const payload = {
      orders: ordersMock,
      total: 10,
      totalToday: 5
    };
    const action = { type: fetchFeeds.fulfilled.type, payload };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(ordersMock);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(5);
  });

  it('обрабатывает fetchFeeds.rejected', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  it('обрабатывает fetchUserOrders.pending', () => {
    const action = { type: fetchUserOrders.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.userOrdersLoading).toBe(true);
    expect(state.userOrdersError).toBeNull();
  });

  it('обрабатывает fetchUserOrders.fulfilled', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: ordersMock
    };
    const state = feedReducer(initialState, action);
    expect(state.userOrdersLoading).toBe(false);
    expect(state.userOrders).toEqual(ordersMock);
  });

  it('обрабатывает fetchUserOrders.rejected с payload', () => {
    const action = {
      type: fetchUserOrders.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = feedReducer(initialState, action);
    expect(state.userOrdersLoading).toBe(false);
    expect(state.userOrdersError).toBe('Ошибка загрузки');
  });

  it('обрабатывает fetchUserOrders.rejected без payload', () => {
    const action = { type: fetchUserOrders.rejected.type };
    const state = feedReducer(initialState, action);
    expect(state.userOrdersLoading).toBe(false);
    expect(state.userOrdersError).toBe('Ошибка загрузки заказов пользователя');
  });
});
