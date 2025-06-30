import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { FC, ReactElement } from 'react';

type TProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user);

  if (!isAuthChecked) {
    return null; // или спиннер
  }

  if (onlyUnAuth && user) {
    return <Navigate to='/' />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
