import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import {
  createOrder,
  clearOrderModal
} from '../../services/slices/ordersSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { RootState, AppDispatch } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);

  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const orderRequest = useSelector(
    (state: RootState) => state.orders.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.orders.orderModal
  );

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
    dispatch(clearConstructor());
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
