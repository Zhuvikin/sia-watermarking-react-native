import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getGnuScientificLibrary } from '../../lib/gsl';
import { RootState } from '../../store/store';

export interface WaveletState {
  isDecomposed: boolean;
  decomposition: number | undefined;
}

export const initialState: WaveletState = {
  isDecomposed: false,
  decomposition: undefined,
};

export const waveletDecompose = createAsyncThunk(
  'wavelet/decompose',
  async (arg: number) => {
    const gnuScientificLibrary = await getGnuScientificLibrary();
    return gnuScientificLibrary.besselJ0(arg);
  },
);

export const waveletSlice = createSlice({
  name: 'wavelet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(waveletDecompose.fulfilled, (state, action) => {
      state.isDecomposed = true;
      state.decomposition = action.payload;
    });
  },
});

export const selectDecomposition = (state: RootState) =>
  state.wavelet.decomposition;

export default waveletSlice.reducer;
