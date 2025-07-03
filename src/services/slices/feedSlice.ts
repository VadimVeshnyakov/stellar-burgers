import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

interface IFeedState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
}

export const initialState: IFeedState = {
  orders: [],
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0,
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async (_, thunkAPI) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk<TOrder[], void>(
  'feed/fetchUserOrders',
  async (_, thunkAPI) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Ошибка загрузки заказов');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.isLoading = false;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.userOrdersLoading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError =
          (action.payload as string) || 'Ошибка загрузки заказов пользователя';
      });
  }
});

export default feedSlice.reducer;
