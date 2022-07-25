import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getGnuScientificLibrary } from '../../lib/gsl';
import { Image } from '../../lib/imagemagick/types/image';
import { RootState } from '../../store/store';

export type Decomposition = {
  besselJ0: number;
  numbers: number[];
  dwtImage: Image;
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
  async (numbers: number[], thunkAPI) => {
    const gnuScientificLibrary = await getGnuScientificLibrary();
    const besselJ0 = gnuScientificLibrary.besselJ0(numbers[1]);

    const state = thunkAPI.getState() as RootState;

    const imageState = state.image;
    const image = imageState.image as Image;
    const dwtImage = await gnuScientificLibrary.dwtForward(image);

    return {
      besselJ0,
      numbers: gnuScientificLibrary.doubleNumbers(numbers),
      dwtImage,
    };
  },
);

export const waveletSlice = createSlice({
  name: 'wavelet',
  initialState,
  reducers: {
    resetWavelet: state => {
      state.isDecomposed = false;
      state.decomposition = undefined;
    },
  },
  extraReducers: builder => {
    builder.addCase(waveletDecompose.fulfilled, (state, action) => {
      state.isDecomposed = true;
      state.decomposition = action.payload;
    });
  },
});

export const { resetWavelet } = waveletSlice.actions;

export const selectDecomposition = (state: RootState) =>
  state.wavelet.decomposition;

export default waveletSlice.reducer;
