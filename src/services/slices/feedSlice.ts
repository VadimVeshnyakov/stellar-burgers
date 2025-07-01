import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

interface IFeedState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
}

const initialState: IFeedState = {
  orders: [],
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0
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
      });
  }
});

export default feedSlice.reducer;
