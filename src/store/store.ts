import { configureStore } from '@reduxjs/toolkit';
import siaReducer from '../features/sia/siaSlice';
import modulesReducer from '../features/modules/modulesSlice';

export const store = configureStore({
  reducer: {
    sia: siaReducer,
    modules: modulesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
