import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '@ui';
import { fetchUserOrders } from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders, userOrdersLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (userOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
