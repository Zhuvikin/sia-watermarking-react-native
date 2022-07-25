import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getGnuScientificLibrary } from '../../lib/gsl';
import { Image } from '../../lib/imagemagick/types/image';
import { RootState } from '../../store/store';
import { DwtDirection } from '../../lib/gsl/types/wavelet';

export type Decomposition = {
  dwtImage: Image;
  restoredImage: Image;
};

export interface WaveletState {
  isDecomposed: boolean;
  decomposition: Decomposition | undefined;
}

const DWT_LEVELS = 3;

export const initialState: WaveletState = {
  isDecomposed: false,
  decomposition: undefined,
};

export const waveletDecompose = createAsyncThunk(
  'wavelet/decompose',
  async (numbers: number[], thunkAPI) => {
    const gnuScientificLibrary = await getGnuScientificLibrary();

    const state = thunkAPI.getState() as RootState;

    const imageState = state.image;
    const image = imageState.image as Image;
    const dwtImage = gnuScientificLibrary.dwt(
      image,
      DwtDirection.Forward,
      DWT_LEVELS,
    );

    const restoredImage = gnuScientificLibrary.dwt(
      dwtImage,
      DwtDirection.Inverse,
      DWT_LEVELS,
    );

    return {
      dwtImage,
      restoredImage,
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
