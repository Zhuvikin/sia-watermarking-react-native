import { configureStore } from '@reduxjs/toolkit';
import modulesReducer from '../features/modules/modulesSlice';
import imageReducer from '../features/image/imageSlice';
import waveletReducer from '../features/wavelet/waveletSlice';

export const store = configureStore({
  reducer: {
    modules: modulesReducer,
    image: imageReducer,
    wavelet: waveletReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
