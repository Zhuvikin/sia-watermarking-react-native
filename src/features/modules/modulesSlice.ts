import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getImageMagick } from '../../lib/imagemagick/index';
import { getGnuScientificLibrary } from '../../lib/gsl';

export interface ModulesState {
  isLoaded: boolean;
}

export const initialState: ModulesState = {
  isLoaded: false,
};

export const initModules = createAsyncThunk('modules/init', async () => {
  await getImageMagick();
  await getGnuScientificLibrary();
});

export const modulesSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(initModules.fulfilled, state => {
      state.isLoaded = true;
    });
  },
});

export default modulesSlice.reducer;
