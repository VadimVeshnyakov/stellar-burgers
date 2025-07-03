import ordersReducer, {
  clearOrder,
  clearOrderModal,
  createOrder,
  fetchOrderByNumber
} from '../ordersSlice';
import type { TOrder } from '@utils-types';

interface IOrdersState {
  order: TOrder | null;
  orderRequest: boolean;
  orderModal: TOrder | null;
  error: string | null;
}

describe('ordersSlice', () => {
  const initialState: IOrdersState = {
    order: null,
    orderRequest: false,
    orderModal: null,
    error: null
  };

  const fakeOrder: TOrder = {
    _id: '123',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    number: 42,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T01:00:00Z',
    name: 'Test Order'
  };

  it('должен возвращать начальное состояние', () => {
    expect(ordersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен обрабатывать clearOrder', () => {
    const prevState: IOrdersState = {
      order: fakeOrder,
      orderRequest: true,
      orderModal: fakeOrder,
      error: 'some error'
    };
    expect(ordersReducer(prevState, clearOrder())).toEqual(initialState);
  });

  it('должен обрабатывать clearOrderModal', () => {
    const prevState: IOrdersState = {
      ...initialState,
      orderModal: fakeOrder
    };
    expect(ordersReducer(prevState, clearOrderModal())).toEqual({
      ...initialState,
      orderModal: null
    });
  });

  describe('асинхронный thunk createOrder', () => {
    it('должен обрабатывать pending', () => {
      const action = { type: createOrder.pending.type };
      const state = ordersReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: true,
        error: null
      });
    });

    it('должен обрабатывать fulfilled', () => {
      const action = { type: createOrder.fulfilled.type, payload: fakeOrder };
      const state = ordersReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        order: fakeOrder,
        orderModal: fakeOrder
      });
    });

    it('должен обрабатывать rejected', () => {
      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка создания заказа' }
      };
      const state = ordersReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        error: 'Ошибка создания заказа'
      });
    });
  });

  describe('fetchOrderByNumber async thunk', () => {
    it('должен обрабатывать pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = ordersReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: true,
        error: null
      });
    });

    it('должен обрабатывать fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: fakeOrder
      };
      const state = ordersReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        orderModal: fakeOrder
      });
    });

    it('должен обрабатывать rejected', () => {
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: 'Не удалось получить заказ' }
      };
      const state = ordersReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        error: 'Не удалось получить заказ'
      });
    });
  });
});
