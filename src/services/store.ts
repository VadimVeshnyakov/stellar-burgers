import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import user from './slices/userSlice';
import ingredients from './slices/ingredientsSlice';
import orders from './slices/ordersSlice';
import burgerConstructor from './slices/constructorSlice';
import feed from './slices/feedSlice';

const rootReducer = combineReducers({
  user,
  ingredients,
  orders,
  burgerConstructor,
  feed
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
