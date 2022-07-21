import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import siaReducer from '../features/counter/siaSlice';

export const store = configureStore({
  reducer: {
    sia: siaReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
