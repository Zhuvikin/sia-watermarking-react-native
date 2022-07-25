import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getGnuScientificLibrary } from '../../lib/gsl';
import { RootState } from '../../store/store';

export type Decomposition = {
  besselJ0: number;
  numbers: number[];
};

export interface WaveletState {
  isDecomposed: boolean;
  decomposition: Decomposition | undefined;
}

export const initialState: WaveletState = {
  isDecomposed: false,
  decomposition: undefined,
};

export const waveletDecompose = createAsyncThunk(
  'wavelet/decompose',
  async (numbers: number[]) => {
    const gnuScientificLibrary = await getGnuScientificLibrary();
    const besselJ0 = gnuScientificLibrary.besselJ0(numbers[1]);
    return {
      besselJ0,
      numbers: gnuScientificLibrary.doubleNumbers(numbers),
    };
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
